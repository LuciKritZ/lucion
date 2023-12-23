'use client';

import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';

import SearchCommand from '@/components/search-command';
import Spinner from '@/components/spinner';
import { GenericReactElement } from '@/types/react.types';

import Navigation from './_components/navigation';

type Props = {
  children: GenericReactElement;
};

const MainLayout = ({ children }: Props) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect('/');
  }

  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
