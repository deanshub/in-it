import fs from 'fs-extra';
import path from 'path';
import terminalLink from 'terminal-link';
import pc from 'picocolors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import isCI from 'is-ci';
import type { PostStatsResponse } from 'in-it-shared-types';
import type { Compiler } from 'webpack';

interface InItStatsWebpackPluginOptions {
  reportFilename: string;
  serverUrl: string;
  buildId: string;
}

const pluginName = 'InItStatsWebpackPlugin';

// const log = (...args: any[]) => console.log(...args.map((a) => pc.bold(pc.gray(a))));

export default class InItStatsWebpackPlugin {
  constructor(private options: InItStatsWebpackPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(pluginName, async (compilation) => {
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
        const formData = new FormData();
        formData.append('file', file, this.options.reportFilename);
        formData.append(
          'envirmonet',
          process.env.NODE_ENV === 'production' && isCI ? 'ci' : 'local',
        );
        formData.append('buildId', this.options.buildId);

        const response = await fetch(serverUrl.toString(), {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          // console.log(response);
          console.log(pc.yellow(response.statusText));
          console.log(pc.yellow(`Can't send in-it stats to the server`));
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
    });
  }
}
