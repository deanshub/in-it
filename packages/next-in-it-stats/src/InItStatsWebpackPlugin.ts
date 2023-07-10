import fs from 'fs-extra';
import path from 'path';
import terminalLink from 'terminal-link';
import pc from 'picocolors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import isCI from 'is-ci';
import { sizeCheckBundles } from './sizeCheckBundles.js';
import readPackageUp from 'read-pkg-up';
import {
  getCommitHash,
  getCurrentBranch,
  getRemoteUrl,
  getRootDir,
  getUserEmail,
  getUserName,
} from './git.js';
import { getDirname } from './getDirname.js';
import type { PostStatsResponse } from 'in-it-shared-types';
import type { Compiler } from 'webpack';

interface InItStatsWebpackPluginOptions {
  reportFilename: string;
  serverUrl: string;
  buildId: string;
  outDir: string;
  name?: string;
}

const pluginName = 'InItStatsWebpackPlugin';

export default class InItStatsWebpackPlugin {
  constructor(private options: InItStatsWebpackPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.done.tapPromise(pluginName, async (compilation) => {
      const exists = await fs.exists(this.options.reportFilename);
      const branch = await getCurrentBranch();
      const commitHash = await getCommitHash();
      const remoteUrl = await getRemoteUrl();
      const provider = process.env.VERCEL_GIT_PROVIDER ?? getProviderFromUrl(remoteUrl);
      const repository =
        process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
          ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
          : getRepositoryFromUrl(remoteUrl);
      const gitRootDir = await getRootDir();
      const packagePath = gitRootDir ? path.relative(gitRootDir, process.cwd()) : process.cwd();
      const appPackage = await readPackageUp();
      const serverUrl = new URL(this.options.serverUrl);

      if (exists) {
        const fileStat = await fs.stat(this.options.reportFilename);
        const emptyStats = fileStat.size < 3;
        if (!this.options.serverUrl || emptyStats) {
          //   console.warn(`in-it stats serverUrl is not defined`);
          return;
        }

        const file = await fs.readFile(this.options.reportFilename);
        const cwd = getDirname();
        const generatorPackage = await readPackageUp({ cwd });
        const userEmail = await getUserEmail();
        const userName = await getUserName();
        const compilation = path.basename(this.options.reportFilename, '.json');

        const formData = new FormData();
        formData.append('file', file, this.options.reportFilename);
        setFormData(formData, 'environment', isCI ? 'ci' : 'local');
        setFormData(formData, 'buildId', this.options.buildId);
        setFormData(formData, 'version', appPackage?.packageJson.version); // from app package.json
        setFormData(formData, 'name', this.options.name);
        setFormData(formData, 'userEmail', userEmail); // from git config
        setFormData(formData, 'userName', userName); // from git config
        setFormData(formData, 'provider', provider); // from git config remote url
        setFormData(formData, 'compilation', compilation); // from webpack stats
        setFormData(formData, 'branch', branch); // from git branch
        setFormData(formData, 'generatingTool', generatorPackage?.packageJson?.name); // TOOD: maybe different endpoint
        setFormData(formData, 'generatingToolVersion', generatorPackage?.packageJson?.version); // TOOD: get from package.json
        setFormData(formData, 'repository', repository); // from git config remote url
        setFormData(formData, 'packagePath', packagePath); // from build dir
        setFormData(formData, 'packageName', appPackage?.packageJson?.name); // from app package.json
        setFormData(formData, 'commitHash', commitHash); // from git branch

        if (process.env.DEBUG) {
          console.log({
            environment: process.env.NODE_ENV === 'production' && isCI ? 'ci' : 'local',
            buildId: this.options.buildId,
            version: appPackage?.packageJson.version,
            name: this.options.name,
            userEmail,
            userName,
            provider,
            compilation,
            branch,
            generatingTool: generatorPackage?.packageJson?.name,
            generatingToolVersion: generatorPackage?.packageJson?.version,
            repository,
            packagePath,
            packageName: appPackage?.packageJson?.name,
            commitHash,
          });
          return;
        }

        // @ts-ignore-next-line
        const response = await fetch(`${serverUrl.toString()}/stats`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          // console.log(response);
          console.log(pc.red(response.statusText));
          console.log(pc.red(`Can't send in-it stats to the server`));
        } else {
          const data = (await response.json()) as PostStatsResponse;
          const name = path.basename(this.options.reportFilename, '.json');
          console.log(
            terminalLink(
              pc.green(`Analyze ${pc.bold(name)} Bundle`),
              `${serverUrl.protocol}//${serverUrl.host}${data.url}`,
            ),
          );
        }
      } else {
        console.log(pc.yellow(`in-it stats "${this.options.reportFilename}" does not exist`));
      }

      await sizeCheckBundles({
        serverUrl,
        outDir: this.options.outDir,
        buildId: this.options.buildId,
        branch,
        commitHash,
        provider,
        repository,
        packagePath,
        packageName: appPackage?.packageJson?.name!,
        name: this.options.name,
      });
    });
  }
}

function getProviderFromUrl(url: undefined | string): undefined | string {
  if (!url) {
    return;
  }
  const match = url.match(/^(https?:\/\/|git@)([^\\/:]+)[\\/:]/);
  if (match) {
    if (match[2] === 'github.com') {
      return 'github';
    }
    if (match[2] === 'gitlab.com') {
      return 'gitlab';
    }
    if (match[2] === 'bitbucket.org') {
      return 'bitbucket';
    }
    return match[2];
  }
}

function getRepositoryFromUrl(providerUrl: undefined | string) {
  if (!providerUrl) {
    return;
  }
  const match = providerUrl.match(/^(https?:\/\/|git@)([^\\/:]+)[\\/:](.+?)(?:\.git)?$/);
  if (match) {
    return match[3];
  }
}

function setFormData(formData: FormData, key: string, value: undefined | string) {
  if (value) {
    formData.append(key, value);
  }
}
