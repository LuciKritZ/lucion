'use client';

import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

import ConditionalRendering from '@/components/conditional-rendering';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

import { Banner } from './banner';
import { Menu } from './menu';
import Publish from './publish';
import Title from './title';

type NavBarProps = {
  isCollapsed: boolean;
  onResetWidth: () => void;
};

const Navbar = ({ isCollapsed, onResetWidth }: NavBarProps) => {
  const { documentId = '' as Id<'documents'> } = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<'documents'>,
  });

  if (document === undefined) {
    return (
      <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between'>
        <Title.Skeleton />
        <div className='flex items-center justify-between gap-x-2'>
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }
  return (
    <>
      <nav className='bg-background dark:bg-[#1F1F1F] px-2 py-2 w-full flex items-center gap-x-4'>
        <ConditionalRendering
          condition={isCollapsed}
          render={
            <MenuIcon
              role='button'
              onClick={onResetWidth}
              className='h-6 w-6 text-muted-foreground'
            />
          }
        />
        <div className='flex items-center justify-between w-full'>
          <Title initialData={document} />
          <div className='flex items-center gap-x-2'>
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      <ConditionalRendering
        condition={document.isArchived}
        render={<Banner documentId={documentId as Id<'documents'>} />}
      />
    </>
  );
};

export default Navbar;
