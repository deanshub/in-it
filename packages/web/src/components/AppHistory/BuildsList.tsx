import filesize from 'filesize';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineDeploymentUnit, AiOutlineDiff } from 'react-icons/ai';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../basic/table';
import { SiGithub } from 'react-icons/si';
import { BiFileFind } from 'react-icons/bi';
import { PagingFooter } from './PagingFooter';
import { TableAction } from './TableAction';
import type { BuildItemType } from '@/db/queries';

interface BuildsListProps {
  builds: BuildItemType[];
  count: number;
  page: number;
  appId: string;
  repository?: string;
}
export function BuildsList({ builds, count, page, appId, repository }: BuildsListProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Version</TableHead>
            <TableHead className="w-[100px]">Compilation</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Size</TableHead>
            <TableHead className="text-right w-[170px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {builds.length > 0 ? (
            builds.map((build) => (
              <BuildItem key={build.version} appId={appId} repository={repository} {...build} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-4">
                <div className="text-center">No builds found</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PagingFooter appId={appId} total={count} page={page} perPage={6} />
    </>
  );
}

interface BuildItemProps extends BuildItemType {
  appId: string;
  repository?: string;
}
function BuildItem({
  _id,
  version,
  createdAt,
  parsedSize,
  commitHash,
  appId,
  repository,
  compilation,
}: BuildItemProps) {
  // TODO: get provider from app
  // const providerHost = getProviderHost(provider)
  const providerHost = 'https://github.com';
  return (
    <TableRow>
      <TableCell className="py-1 font-bold">{version}</TableCell>
      <TableCell className="py-1">{compilation}</TableCell>
      <TableCell className="py-1">{formatDistanceToNow(createdAt, { addSuffix: true })}</TableCell>
      <TableCell className="py-1">{filesize(parsedSize)}</TableCell>
      <TableCell className="px-1 py-1 text-right flex justify-end items-center">
        {repository && commitHash ? (
          <TableAction
            tooltip="View on GitHub"
            href={`${providerHost}/${repository}/commit/${commitHash}`}
            icon={SiGithub}
          />
        ) : null}
        <TableAction disabled tooltip="Dependency Graph" icon={AiOutlineDeploymentUnit} />
        <TableAction disabled tooltip="Bundle Diff" icon={AiOutlineDiff} />
        <TableAction tooltip="Analyze Bundle" href={`/analyze/${appId}/${_id}`} icon={BiFileFind} />
      </TableCell>
    </TableRow>
  );
}
