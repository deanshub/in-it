import fs from 'fs-extra';
import terminalLink from 'terminal-link';
import pc from 'picocolors';
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
        const serverUrl = new URL(this.options.serverUrl);

        const file = await fs.readFile(this.options.reportFilename);
        const blob = new Blob([file], { type: 'application/octet-stream' });
        const headers = {
          'Content-Type': 'multipart/form-data',
        };

        const formData = new FormData();
        formData.append('file', blob);
        const response = await fetch(serverUrl.toString(), {
          method: 'POST',
          body: formData,
          headers,
        });
        if (!response.ok) {
          console.log(response.statusText);
          console.warn(`in-it stats could not send to server`);
        } else {
          const data = (await response.json()) as PostStatsResponse;
          console.log(
            pc.green(
              terminalLink('Analyze Bundle', `${serverUrl.protocol}${serverUrl.host}${data.url}`),
            ),
          );
        }
      } else {
        console.warn(`in-it stats "${this.options.reportFilename}" does not exist`);
      }
    });
  }
}
