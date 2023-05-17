import fs from 'fs-extra';
import type { PostStatsResponse } from 'in-it-shared-types';
import type { Compiler } from 'webpack';

interface InItStatsWebpackPluginOptions {
  reportFilename: string;
  serverUrl: string;
}

const pluginName = 'InItStatsWebpackPlugin';

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
        const response = await fetch(this.options.serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: await fs.readFile(this.options.reportFilename, 'utf-8'), // TODO: use multipart/form-data
        });
        if (!response.ok) {
          console.warn(`in-it stats could not send to server`);
        } else {
          const data = (await response.json()) as PostStatsResponse;
          console.log(`in-it analyze: ${data.url}`);
        }
      } else {
        console.warn(`in-it stats "${this.options.reportFilename}" does not exist`);
      }
    });
  }
}
