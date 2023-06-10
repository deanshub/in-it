import filesize from 'filesize';
import { formatDistanceToNow } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../basic/table';
import {
  DiffOutlined,
  DeploymentUnitOutlined,
  GithubOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { PagingFooter } from './PagingFooter';
import { TableAction } from './TableAction';
import { PAGE_SIZE } from '@/utils/paging';
import type { BuildItemType } from '@/db/queries';
import clsx from 'clsx';

interface BuildsListProps {
  builds: BuildItemType[];
  count: number;
  page: number;
  appId: string;
  repository?: string;
  defaultBranchLatestBuild?: BuildItemType;
}
export function BuildsList({
  builds,
  count,
  page,
  appId,
  repository,
  defaultBranchLatestBuild,
}: BuildsListProps) {
  return (
    <div className="pr-4">
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Version</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]">Compilation</TableHead>
            <TableHead className="w-[100px]">Size</TableHead>
            <TableHead className="text-right w-[170px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody id="buildsTableBody">
          {builds.length > 0 ? (
            builds.flatMap((build, compilationIndex) =>
              build.compilations.map((compilation, buildInCompilationIndex) => (
                <BuildItem
                  key={`${compilation.name}@${build._id}`}
                  appId={appId}
                  repository={repository}
                  {...build}
                  compilation={compilation}
                  compilationsCount={build.compilations.length}
                  buildInCompilationIndex={buildInCompilationIndex}
                  isEven={compilationIndex % 2 === 0}
                  previousCompilationId={compilation.previousCompilationId}
                  defaultBranchName={defaultBranchLatestBuild?.branch}
                  latestCompilationIdInDefaultBranch={
                    defaultBranchLatestBuild?.compilations.find((c) => c.name === compilation.name)
                      ?.id
                  }
                />
              )),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-4">
                <div className="text-center">No builds found</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PagingFooter appId={appId} total={count} page={page} perPage={PAGE_SIZE} />
    </div>
  );
}

interface BuildItemProps extends Omit<BuildItemType, 'compilations'> {
  appId: string;
  repository?: string;
  compilation: BuildItemType['compilations'][0];
  isEven?: boolean;
  compilationsCount: number;
  buildInCompilationIndex: number;
  previousCompilationId?: string;
  defaultBranchName?: string;
  latestCompilationIdInDefaultBranch?: string;
}
function BuildItem({
  _id,
  version,
  createdAt,
  commitHash,
  appId,
  repository,
  compilationsCount,
  compilation,
  isEven,
  buildInCompilationIndex,
  previousCompilationId,
  defaultBranchName,
  latestCompilationIdInDefaultBranch,
}: BuildItemProps) {
  // TODO: get provider from app
  // const providerHost = getProviderHost(provider)
  const providerHost = 'https://github.com';
  return (
    <TableRow
      id={`${compilation.name}-${_id}`}
      className={clsx(isEven ? 'bg-gray-700' : 'bg-gray-900', 'hover:bg-inherit/100')}
    >
      {buildInCompilationIndex === 0 ? (
        <TableCell rowSpan={compilationsCount} className="font-bold py-0">
          {version}
        </TableCell>
      ) : null}
      {buildInCompilationIndex === 0 ? (
        <TableCell rowSpan={compilationsCount} className="py-0">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </TableCell>
      ) : null}
      <TableCell className="hoverable py-0.5">{compilation.name}</TableCell>
      <TableCell className="hoverable py-0.5">{filesize(compilation.parsedSize)}</TableCell>
      <TableCell className="hoverable px-1 py-0.5 text-right flex justify-end items-center">
        {repository && commitHash ? (
          <TableAction
            tooltip="View on GitHub"
            href={`${providerHost}/${repository}/commit/${commitHash}`}
            icon={GithubOutlined}
          />
        ) : null}
        <TableAction disabled tooltip="Dependency Graph" icon={DeploymentUnitOutlined} />
        <TableAction
          disabled={!previousCompilationId}
          tooltip={
            defaultBranchName ? `Diff with latest ${defaultBranchName}` : 'Diff with Previous'
          }
          href={`/analyze/${appId}/${compilation.id}-${
            defaultBranchName ? latestCompilationIdInDefaultBranch : previousCompilationId
          }`}
          icon={DiffOutlined}
        />
        <TableAction
          tooltip="Analyze Bundle"
          href={`/analyze/${appId}/${compilation.id}`}
          icon={FileSearchOutlined}
        />
      </TableCell>
    </TableRow>
  );
}
