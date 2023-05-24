import { LineChart } from '../Charts/LineChart';
import { Button } from '../basic/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../basic/table';
import { SiGithub } from 'react-icons/si';
import { AiOutlineDeploymentUnit, AiOutlineDiff } from 'react-icons/ai';
import { BiFileFind } from 'react-icons/bi';
import { useMemo } from 'react';

export function AppHistory() {
  return (
    <div className="flex flex-1 flex-col">
      <Chart />
      <BuildsList />
    </div>
  );
}

function Chart() {
  return (
    <div className="h-64">
      <LineChart />
    </div>
  );
}

function BuildsList() {
  const builds = useMemo(
    () => [
      {
        version: '1.0.0',
        date: '1 year ago',
        size: '3.5MB',
      },
      {
        version: '1.0.1',
        date: '8 months ago',
        size: '3.8MB',
      },
      {
        version: '1.0.2',
        date: '7 months ago',
        size: '3.9MB',
      },
      {
        version: '1.0.3',
        date: '6 months ago',
        size: '4.1MB',
      },
      {
        version: '2.0.0',
        date: '2 months ago',
        size: '5.2MB',
      },
      {
        version: '2.0.1',
        date: '3 weeks ago',
        size: '5.3MB',
      },
      // {
      //   version: '2.0.2',
      //   date: '2 weeks ago',
      //   size: '5.0MB',
      // },
      // {
      //   version: '2.0.3',
      //   date: '2 days ago',
      //   size: '3.6MB',
      // },
      // {
      //   version: '2.0.4',
      //   date: '3 hours ago',
      //   size: '3.7MB',
      // },
    ],
    [],
  );

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
          {builds.map((build) => (
            <BuildItem key={build.version} {...build} />
          ))}
        </TableBody>
      </Table>
      <PagingFooter total={100} page={10} perPage={10} />
    </>
  );
}

interface BuildItemProps {
  version: string;
  date: string;
  size: string;
}
function BuildItem({ version, date, size }: BuildItemProps) {
  return (
    <TableRow>
      <TableCell className="py-1 font-bold">{version}</TableCell>
      <TableCell className="py-1">{date}</TableCell>
      <TableCell className="py-1">{size}</TableCell>
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

interface PagingFooterProps {
  total: number;
  page: number;
  perPage: number;
}
function PagingFooter({ total, page, perPage }: PagingFooterProps) {
  const totalPages = Math.ceil(total / perPage);
  const hasMultiplePages = totalPages > 1;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;
  const firstPageOfThePages = Math.max(1, page - 2);
  const lastPageOfThePages = Math.min(totalPages, page + 2);

  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => Math.min(firstPageOfThePages, Math.max(1, lastPageOfThePages - 4)) + i,
  );

  return (
    <div className="flex text-xs items-center justify-center mt-2">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={!hasPreviousPage}>
          &lt;
        </Button>
        {hasMultiplePages
          ? pages.map((p) => (
              <Button key={p} size="sm" variant={p === page ? 'default' : 'outline'}>
                {p}
              </Button>
            ))
          : null}
        <Button size="sm" variant="outline" disabled={!hasNextPage}>
          &gt;
        </Button>
      </div>
    </div>
  );
}
