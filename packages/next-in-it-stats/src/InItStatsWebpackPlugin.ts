import fs from 'fs-extra';
import terminalLink from 'terminal-link';
import pc from 'picocolors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import type { PostStatsResponse } from 'in-it-shared-types';
import type { Compiler } from 'webpack';

interface InItStatsWebpackPluginOptions {
  reportFilename: string;
  serverUrl: string;
}

const pluginName = 'InItStatsWebpackPlugin';

// const log = (...args: any[]) => console.log(...args.map((a) => pc.bold(pc.gray(a))));

export default class InItStatsWebpackPlugin {
  constructor(private options: InItStatsWebpackPluginOptions) {}
  apply(compiler: Compiler) {
    compiler.hooks.done.tap(pluginName, async (compilation) => {
      const exists = await fs.exists(this.options.reportFilename);
      if (exists) {
        if (!this.options.serverUrl) {
          //   console.warn(`in-it stats serverUrl is not defined`);
          return;
        }
        const serverUrl = new URL(this.options.serverUrl);

        const file = await fs.readFile(this.options.reportFilename);
        const formData = new FormData();
        formData.append('file', file, this.options.reportFilename);

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
          console.log(
            pc.green(
              terminalLink('Analyze Bundle', `${serverUrl.protocol}${serverUrl.host}${data.url}`),
            ),
          );
        }
      } else {
        console.log(pc.yellow(`in-it stats "${this.options.reportFilename}" does not exist`));
      }
    });
  }
}
