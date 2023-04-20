import { execa } from 'execa';
import fs from 'fs-extra';

type VersionType = 'patch' | 'minor' | 'major';
interface YarnWorkspace {
  name: string;
  location: string;
}
async function bump(type: VersionType) {
  await fs.rmdir('.yarn/versions', { recursive: true }).catch(() => {});
  const { stdout } = await execa('yarn', ['workspaces', 'list', '--json']);
  const packages: YarnWorkspace[] = JSON.parse(`[${stdout.split('\n').join(',')}]`);
  await execa('yarn', ['version', type, '--deferred'], { stdio: 'inherit' });
  const versions = await fs.readdir('.yarn/versions');
  if (versions.length !== 1) throw new Error('Expected only one version file');
  const versionFile: string = versions[0];
  await fs.writeFile(`.yarn/versions/${versionFile}`, getRealeaseContent(packages, type));
  await execa('yarn', ['version', 'apply', '--all'], { stdio: 'inherit' });
  await execa(
    'git',
    ['add', 'package.json', 'yarn.lock'].concat(packages.map((p) => `${p.location}/package.json`)),
    { stdio: 'inherit' },
  );
}

function getRealeaseContent(packages: YarnWorkspace[], type: VersionType) {
  const content = packages
    .map((pkg) => {
      return `    ${pkg.name}: ${type}`;
    })
    .join('\n');
  return `releases:
${content}`;
}

bump('patch');
