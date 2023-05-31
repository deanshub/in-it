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
  appId: string;
  repository?: string;
}
export function BuildsList({ builds, count, appId, repository }: BuildsListProps) {
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
      <PagingFooter total={count} page={1} perPage={6} />
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
  return (
    <TableRow>
      <TableCell className="py-1 font-bold">{version}</TableCell>
      <TableCell className="py-1">{formatDistanceToNow(createdAt)}</TableCell>
      <TableCell className="py-1">{filesize(parsedSize)}</TableCell>
      <TableCell className="py-1 text-right">
        {repository && commitHash ? (
          <Button variant="ghost" size="sm">
            <Link href={`${repository}/commits/${commitHash}`} prefetch={false}>
              <SiGithub />
            </Link>
          </Button>
        ) : null}
        <Button variant="ghost" size="sm">
          <AiOutlineDeploymentUnit />
        </Button>
        <Button variant="ghost" size="sm">
          <AiOutlineDiff />
        </Button>
        <Button variant="ghost" size="sm">
          <Link href={`/analyze/${appId}/${_id}`} prefetch={false}>
            <BiFileFind />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
