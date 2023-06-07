import { simpleGit } from 'simple-git';

export async function getUserEmail() {
  try {
    const userEmail = await simpleGit().raw(['config', 'user.email']);
    return userEmail.trim();
  } catch (error) {
    //
  }
}

export async function getUserName() {
  try {
    const userName = await simpleGit().raw(['config', 'user.name']);
    return userName.trim();
  } catch (error) {
    //
  }
}

export async function getCurrentBranch() {
  if (process.env.VERCEL_GIT_COMMIT_REF) {
    return process.env.VERCEL_GIT_COMMIT_REF;
  }
  try {
    const branches = await simpleGit().branch();
    return branches.current;
  } catch (error) {
    //
  }
}

export async function getRemoteUrl() {
  try {
    const remoteUrl = await simpleGit().raw(['remote', 'get-url', 'origin']);
    return remoteUrl.trim();
  } catch (error) {
    //
  }
}

export async function getCommitHash() {
  try {
    const commitHash = await simpleGit().raw(['rev-parse', 'HEAD']);
    return commitHash.trim();
  } catch (error) {
    //
  }
}

export async function getRootDir() {
  try {
    const gitRootDir = (await simpleGit().raw(['rev-parse', '--show-toplevel'])).trim();
    return gitRootDir;
  } catch (error) {
    //
  }
}
