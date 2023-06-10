import Link from 'next/link';
import { Button } from '../basic/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../basic/tooltip';
import type { ItalicOutlined } from '@ant-design/icons';

interface TableActionProps {
  href?: string;
  icon: typeof ItalicOutlined;
  tooltip: React.ReactNode;
  disabled?: boolean;
}
export function TableAction({ href, icon: Icon, tooltip, disabled }: TableActionProps) {
  return (
    <TableActionWrapper tooltip={tooltip} href={href}>
      <Button variant="ghost" size="sm" disabled={disabled}>
        <Icon />
      </Button>
    </TableActionWrapper>
  );
}
interface TableActionWrapperProps {
  children: React.ReactNode;
  href?: string;
  tooltip: React.ReactNode;
}
function TableActionWrapper({ children, href, tooltip }: TableActionWrapperProps) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Link
              href={href}
              prefetch={false}
              target={href.startsWith('http') ? '_blank' : undefined}
            >
              {children}
            </Link>
          ) : (
            children
          )}
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
