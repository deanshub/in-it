import filesize from 'filesize';
import { formatDistanceToNow } from 'date-fns';
import { AiOutlineDeploymentUnit, AiOutlineDiff } from 'react-icons/ai';
import { Button } from '../basic/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../basic/table';
import { SiGithub } from 'react-icons/si';
import { BiFileFind } from 'react-icons/bi';
import { PagingFooter } from './PagingFooter';
import type { BuildItemType } from '@/utils/getAppBuilds';

interface BuildsListProps {
  builds: BuildItemType[];
  count: number;
}
export function BuildsList({ builds, count }: BuildsListProps) {
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
            builds.map((build) => <BuildItem key={build.version} {...build} />)
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

type BuildItemProps = BuildItemType;
function BuildItem({ version, createdAt, parsedSize }: BuildItemProps) {
  return (
    <TableRow>
      <TableCell className="py-1 font-bold">{version}</TableCell>
      <TableCell className="py-1">{formatDistanceToNow(createdAt)}</TableCell>
      <TableCell className="py-1">{filesize(parsedSize)}</TableCell>
      <TableCell className="py-1 text-right">
        <Button variant="ghost" size="sm">
          <SiGithub />
        </Button>
        <Button variant="ghost" size="sm">
          <AiOutlineDeploymentUnit />
        </Button>
        <Button variant="ghost" size="sm">
          <AiOutlineDiff />
        </Button>
        <Button variant="ghost" size="sm">
          <BiFileFind />
        </Button>
      </TableCell>
    </TableRow>
  );
}
