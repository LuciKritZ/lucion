'use client';

import { SignInButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';

import ConditionalRendering from '@/components/conditional-rendering';
import Spinner from '@/components/spinner';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import useScrollTop from '@/hooks/use-scroll-top.hook';
import { cn } from '@/lib/utils';

import Logo from './logo';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />

      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        <ConditionalRendering
          condition={isLoading}
          render={<Spinner />}
          elseRender={
            <ConditionalRendering
              condition={!isAuthenticated}
              render={
                <>
                  <SignInButton mode='modal'>
                    <Button variant='ghost'>Login</Button>
                  </SignInButton>
                  <SignInButton mode='modal'>
                    <Button size='sm'>Get Lucion Free</Button>
                  </SignInButton>
                </>
              }
              elseRender={
                <>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href='/documents'>Enter Lucion</Link>
                  </Button>
                  <UserButton afterSignOutUrl='/' />
                </>
              }
            />
          }
        />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Navbar;
