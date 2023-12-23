import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ConditionalRendering from '@/components/conditional-rendering';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

interface NavItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

const NavItem = ({
  label,
  onClick,
  icon: Icon,
  id,
  documentIcon = '',
  active = false,
  expanded = false,
  isSearch = false,
  level = 0,
  onExpand,
}: NavItemProps) => {
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const router = useRouter();
  const { user } = useUser();

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const onCreateDocument = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({ title: 'Untitled', parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }

        router.push(`/documents/${documentId}`);
      }
    );

    toast.promise(promise, {
      loading: 'Creating a new document...',
      success: 'New note created!',
      error: 'Failed to add a new note',
    });
  };

  const onArchiveDocument = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!id) return;

    const promise = archive({ id }).then(() => router.push('/documents'));

    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note',
    });
  };

  return (
    <div
      onClick={onClick}
      role='button'
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : '12px',
      }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      <ConditionalRendering
        condition={!!id}
        render={
          <div
            role='button'
            className='h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
            onClick={handleExpand}
          >
            <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
          </div>
        }
      />
      <ConditionalRendering
        condition={!!documentIcon}
        render={<div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>}
        elseRender={
          <Icon className='shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground' />
        }
      />
      <span className='truncate'>{label}</span>

      {/* Searching */}
      <ConditionalRendering
        condition={isSearch}
        render={
          <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
            <span className='text-xs'>⌘</span>K
          </kbd>
        }
      />

      <ConditionalRendering
        condition={!!id}
        render={
          <div className='ml-auto flex items-center gap-x-2'>
            <DropdownMenu>
              <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
                <div
                  role='button'
                  className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
                >
                  <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-60'
                align='start'
                side='right'
                forceMount
              >
                <DropdownMenuItem onClick={onArchiveDocument}>
                  <Trash className='h-4 w-4 mr-2 hello' />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className='text-sm text-muted-foreground p-2'>
                  Last edited by: {user?.fullName}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div
              onClick={onCreateDocument}
              role='button'
              className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
            >
              <Plus className='h-4 w-4 text-muted-foreground' />
            </div>
          </div>
        }
      />
    </div>
  );
};

NavItem.Skeleton = function NavItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className='gap-x-2 py-[3px]'
    >
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[30%]' />
    </div>
  );
};

export default NavItem;
