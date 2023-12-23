'use client';

import { ElementRef, useEffect, useRef, useState } from 'react';

import { useMutation } from 'convex/react';
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

import ConditionalRendering from '@/components/conditional-rendering';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/use-search.hook';
import { useSettings } from '@/hooks/use-settings.hook';
import { cn } from '@/lib/utils';

import { DocumentList } from './document-list';
import NavItem from './nav-item';
import Navbar from './navbar';
import TrashBox from './trash-box';
import { UserItem } from './user-item';

const Navigation = () => {
  const { onOpen } = useSearch();
  const { onOpen: onSettingsOpen } = useSettings();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef<boolean>(false);
  const sidebarRef = useRef<ElementRef<'aside'>>(null);
  const navbarRef = useRef<ElementRef<'div'>>(null);

  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile]);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const animateSideBarPosition = () => {
    // For animation
    setTimeout(() => setIsResetting(false), 300);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      );
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');

      animateSideBarPosition();
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');

      animateSideBarPosition();
    }
  };

  const handleCreateDocument = () => {
    const promise = create({ title: 'Untitled' }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );
    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          role='button'
          onClick={collapse}
          className={cn(
            'h-6 2-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className='h-6 w-6' />
        </div>
        <div>
          <UserItem />
          <NavItem label='Search' icon={Search} isSearch onClick={onOpen} />
          <NavItem label='Settings' icon={Settings} onClick={onSettingsOpen} />
          <NavItem
            onClick={handleCreateDocument}
            label='New Page'
            icon={PlusCircle}
          />
        </div>
        <div className='mt-4'>
          <DocumentList />
          <NavItem
            onClick={handleCreateDocument}
            icon={Plus}
            label='Add a page'
          />
          <Popover>
            <PopoverTrigger className='w-full mt-4'>
              <NavItem label='Trash' icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className='p-0 w-72'
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sidebar separator */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full'
        )}
      >
        <ConditionalRendering
          condition={!!params.documentId}
          render={
            <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
          }
          elseRender={
            <nav className='bg-transparent px-3 py-2 w-full'>
              <ConditionalRendering
                condition={isCollapsed}
                render={
                  <MenuIcon
                    className='h-6 w-6 text-muted-foreground'
                    role='button'
                    onClick={resetWidth}
                  />
                }
              />
            </nav>
          }
        />
      </div>
    </>
  );
};

export default Navigation;
