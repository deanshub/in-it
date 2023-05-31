import { Button } from '../basic/button';

interface PagingFooterProps {
  total: number;
  page: number;
  perPage: number;
}

export function PagingFooter({ total, page, perPage }: PagingFooterProps) {
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
          <Button size="sm" variant="outline" disabled={!hasPreviousPage}>
            &lt;
          </Button>
          {pages.map((p) => (
            <Button key={p} size="sm" variant={p === page ? 'default' : 'outline'}>
              {p}
            </Button>
          ))}
          <Button size="sm" variant="outline" disabled={!hasNextPage}>
            &gt;
          </Button>
        </div>
      ) : null}
    </div>
  );
}
