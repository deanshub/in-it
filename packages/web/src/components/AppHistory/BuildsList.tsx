import filesize from 'filesize';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineDeploymentUnit, AiOutlineDiff } from 'react-icons/ai';
import { Button } from '../basic/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../basic/table';
import { SiGithub } from 'react-icons/si';
import { BiFileFind } from 'react-icons/bi';
import { PagingFooter } from './PagingFooter';
import Link from 'next/link';
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
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Size</TableHead>
            <TableHead className="text-right w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {builds.length > 0 ? (
            builds.map((build) => (
              <BuildItem key={build.version} appId={appId} repository={repository} {...build} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="py-4">
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
}: BuildItemProps) {
  // TODO: get provider from app
  // const providerHost = getProviderHost(provider)
  const providerHost = 'https://github.com';
  return (
    <TableRow>
      <TableCell className="py-1 font-bold">{version}</TableCell>
      <TableCell className="py-1">{formatDistanceToNow(createdAt)}</TableCell>
      <TableCell className="py-1">{filesize(parsedSize)}</TableCell>
      <TableCell className="py-1 text-right">
        {repository && commitHash ? (
          <Link
            target="_blank"
            href={`${providerHost}/${repository}/commit/${commitHash}`}
            prefetch={false}
          >
            <Button variant="ghost" size="sm">
              <SiGithub />
            </Button>
          </Link>
        ) : null}
        <Button variant="ghost" size="sm">
          <AiOutlineDeploymentUnit />
        </Button>
        <Button variant="ghost" size="sm">
          <AiOutlineDiff />
        </Button>
        <Link href={`/analyze/${appId}/${_id}`} prefetch={false}>
          <Button variant="ghost" size="sm">
            <BiFileFind />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
