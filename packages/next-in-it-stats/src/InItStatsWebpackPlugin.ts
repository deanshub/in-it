import fs from 'fs-extra';
import path from 'path';
import terminalLink from 'terminal-link';
import pc from 'picocolors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import isCI from 'is-ci';
import { sizeCheckBundles } from './sizeCheckBundles';
import readPackageUp from 'read-pkg-up';
import { simpleGit } from 'simple-git';
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

// const log = (...args: any[]) => console.log(...args.map((a) => pc.bold(pc.gray(a))));

export default class InItStatsWebpackPlugin {
  constructor(private options: InItStatsWebpackPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.done.tapPromise(pluginName, async (compilation) => {
      const exists = await fs.exists(this.options.reportFilename);
      if (exists) {
        const fileStat = await fs.stat(this.options.reportFilename);
        const emptyStats = fileStat.size < 3;
        if (!this.options.serverUrl || emptyStats) {
          //   console.warn(`in-it stats serverUrl is not defined`);
          return;
        }
        const serverUrl = new URL(this.options.serverUrl);

        const file = await fs.readFile(this.options.reportFilename);
        const appPackage = await readPackageUp();
        const generatorPackage = await readPackageUp({ cwd: __dirname });
        const userEmail = (await simpleGit().raw(['config', 'user.email'])).trim();
        const userName = (await simpleGit().raw(['config', 'user.name'])).trim();
        const branches = await simpleGit().branch();
        const providerUrl = (await simpleGit().raw(['remote', 'get-url', 'origin'])).trim();
        const commitHash = (await simpleGit().raw(['rev-parse', 'HEAD'])).trim();
        const provider = getProviderFromUrl(providerUrl);
        const repository = getRepositoryFromUrl(providerUrl);
        const gitRootDir = (await simpleGit().raw(['rev-parse', '--show-toplevel'])).trim();
        const packagePath = path.relative(gitRootDir, process.cwd());
        const compilation = path.basename(this.options.reportFilename, '.json');

        const formData = new FormData();
        formData.append('file', file, this.options.reportFilename);
        setFormData(
          formData,
          'envirmonet',
          process.env.NODE_ENV === 'production' && isCI ? 'ci' : 'local',
        );
        setFormData(formData, 'buildId', this.options.buildId);
        setFormData(formData, 'version', appPackage?.packageJson.version); // from app package.json
        setFormData(formData, 'name', this.options.name);
        setFormData(formData, 'userEmail', userEmail); // from git config
        setFormData(formData, 'userName', userName); // from git config
        setFormData(formData, 'provider', provider); // from git config remote url
        setFormData(formData, 'compilation', compilation); // from webpack stats
        setFormData(formData, 'branch', branches.current); // from git branch
        setFormData(formData, 'generatingTool', generatorPackage?.packageJson?.name); // TOOD: maybe different endpoint
        setFormData(formData, 'generatingToolVersion', generatorPackage?.packageJson?.version); // TOOD: get from package.json
        setFormData(formData, 'repository', repository); // from git config remote url
        setFormData(formData, 'packagePath', packagePath); // from build dir
        setFormData(formData, 'packageName', appPackage?.packageJson?.name); // from app package.json
        setFormData(formData, 'commitHash', commitHash); // from git branch

        if (process.env.DEBUG) {
          console.log({
            envirmonet: process.env.NODE_ENV === 'production' && isCI ? 'ci' : 'local',
            buildId: this.options.buildId,
            version: appPackage?.packageJson.version,
            name: this.options.name,
            userEmail,
            userName,
            provider,
            compilation,
            branch: branches.current,
            generatingTool: generatorPackage?.packageJson?.name,
            generatingToolVersion: generatorPackage?.packageJson?.version,
            repository,
            packagePath,
            packageName: appPackage?.packageJson?.name,
            commitHash,
          });
          return;
        }

        const response = await fetch(serverUrl.toString(), {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          console.log(response);
          console.log(pc.red(response.statusText));
          console.log(pc.red(`Can't send in-it stats to the server`));
        } else {
          const data = (await response.json()) as PostStatsResponse;
          const name = path.basename(this.options.reportFilename, '.json');
          console.log(
            pc.green(
              terminalLink(
                `Analyze ${pc.bold(name)} Bundle`,
                `${serverUrl.protocol}${serverUrl.host}${data.url}`,
              ),
            ),
          );
        }
      } else {
        console.log(pc.yellow(`in-it stats "${this.options.reportFilename}" does not exist`));
      }

      await sizeCheckBundles({ outDir: this.options.outDir });
    });
  }
}

function getProviderFromUrl(url: string): undefined | string {
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

function getRepositoryFromUrl(providerUrl: string) {
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
