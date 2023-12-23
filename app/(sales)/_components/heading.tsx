'use client';

import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import ConditionalRendering from '@/components/conditional-rendering';
import Spinner from '@/components/spinner';
import { Button } from '@/components/ui/button';

type Props = {};

const Heading = (props: Props) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className='max-w-3xl space-y-4'>
      <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold'>
        Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
        <span className='underline'>Lucion</span>
      </h1>
      <h3 className='text-base sm:text-xl md:text-2xl font-medium'>
        Lucion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      <ConditionalRendering
        condition={isLoading}
        render={
          <div className='w-full flex items-center justify-center'>
            <Spinner size='lg' />
          </div>
        }
        elseRender={
          <ConditionalRendering
            condition={isAuthenticated}
            render={
              <Button asChild>
                <Link href='/documents'>
                  Enter Lucion
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Link>
              </Button>
            }
            elseRender={
              <SignInButton mode='modal'>
                <Button>
                  Get Lucion
                  <ArrowRight className='h-4 w-4 ml-2' />
                </Button>
              </SignInButton>
            }
          />
        }
      />
    </div>
  );
};

export default Heading;
