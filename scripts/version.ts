import { execa } from 'execa';
import fs from 'fs-extra';
import prompts, { type PromptObject } from 'prompts';
import pc from 'picocolors';
import isCi from 'is-ci';

type VersionType = 'patch' | 'minor' | 'major';
interface YarnWorkspace {
  name: string;
  location: string;
}
async function bump(type: VersionType) {
  try {
    await fs.rmdir('.yarn/versions', { recursive: true });
  } catch (error) {
    // Nothing to do
  }
  const { stdout } = await execa('yarn', ['workspaces', 'list', '--json']);
  const packages: YarnWorkspace[] = JSON.parse(`[${stdout.split('\n').join(',')}]`);
  await execa('yarn', ['version', type, '--deferred'], { stdio: 'inherit' });
  const versions = await fs.readdir('.yarn/versions');
  if (versions.length !== 1) throw new Error('Expected only one version file');
  const versionFile: string = versions[0];
  await fs.writeFile(`.yarn/versions/${versionFile}`, getRealeaseContent(packages, type));
  await execa('yarn', ['version', 'apply', '--all'], { stdio: 'inherit' });

  if (isCi) {
    return;
  }

  await execa(
    'git',
    ['add', 'package.json', 'yarn.lock'].concat(packages.map((p) => `${p.location}/package.json`)),
    { stdio: 'inherit' },
  );

  const pkg = await fs.readJSON('package.json');
  const version = `v${pkg.version}`;

  // ask should commit?
  const questions: PromptObject[] = [
    {
      type: 'confirm',
      name: 'commit',
      message: `Can I commit version "${version}"?`,
      initial: true,
    },
    {
      type: (prev: boolean) => (prev ? 'text' : null),
      name: 'message',
      message: 'Commit message',
      initial: `version bump ${version}`,
    },
  ];

  const { commit, message } = await prompts(questions);
  // if no remind user to git tag and git push --tags
  if (!commit) {
    console.log(
      `Don't forget to \n${pc.bold(
        pc.green(`git tag -a "${version}" -m "version bump ${version}`),
      )}"\n and \n${pc.bold(pc.green('git push --tags'))}`,
    );
    return;
  }
  // if yes ask for commit message
  // git commit -m "message"
  await execa('git', ['commit', '-m', message], { stdio: 'inherit' });
  // git tag -a "v1.0.0" -m "message"
  await execa('git', ['tag', '-a', version, '-m', message], { stdio: 'inherit' });
  // git push --tags
  await execa('git', ['push', '--follow-tags'], { stdio: 'inherit' });
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

let versionType: VersionType = 'patch';
if (process.argv[2] && ['patch', 'minor', 'major'].includes(process.argv[2])) {
  versionType = process.argv[2] as VersionType;
} else if (process.argv[2] && ['--help', '-h'].includes(process.argv[2])) {
  console.log(`Usage: ${pc.green('yarn version:bump [patch|minor|major]')}`);
  process.exit(0);
} else if (process.argv[2]) {
  console.log(
    `${pc.red('Error:')} ${pc.green(
      `"${process.argv[2]}"`,
    )} is not a valid version type. Valid types are: ${pc.green('patch')}, ${pc.green(
      'minor',
    )}, ${pc.green('major')}`,
  );
  process.exit(1);
}

bump(versionType);
