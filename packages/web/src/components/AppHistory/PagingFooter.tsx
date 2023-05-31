import Link from 'next/link';
import { Button } from '../basic/button';

interface PagingFooterProps {
  total: number;
  page: number;
  perPage: number;
  appId: string;
}

export function PagingFooter({ total, page, perPage, appId }: PagingFooterProps) {
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
      {hasMultiplePages ? (
        <div className="flex gap-2">
          <Link
            prefetch={false}
            href={{
              pathname: `/apps/${appId}`,
              search: hasPreviousPage && page > 2 ? `page=${page - 1}` : undefined,
            }}
          >
            <Button size="sm" variant="outline" disabled={!hasPreviousPage}>
              &lt;
            </Button>
          </Link>
          {pages.map((p) => (
            <Link
              key={p}
              prefetch={false}
              href={{ pathname: `/apps/${appId}`, search: p > 1 ? `page=${p}` : undefined }}
            >
              <Button size="sm" variant={p === page ? 'default' : 'outline'}>
                {p}
              </Button>
            </Link>
          ))}
          <Link
            prefetch={false}
            href={{
              pathname: `/apps/${appId}`,
              search: hasNextPage ? `page=${page + 1}` : `page=${page}`,
            }}
          >
            <Button size="sm" variant="outline" disabled={!hasNextPage}>
              &gt;
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
