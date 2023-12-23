import { Poppins } from 'next/font/google';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
});

const Logo = () => {
  return (
    <div className='hidden md:flex items-center gap-x-2'>
      <Image
        height='40'
        width='40'
        src='/logo.png'
        alt='Logo'
        className='dark:hidden rounded-sm'
      />
      <Image
        height='40'
        width='40'
        src='/logo-dark.png'
        alt='Logo'
        className='hidden dark:block rounded-sm'
      />
      <p className={cn('font-semibold', font.className)}>Lucion</p>
    </div>
  );
};

export default Logo;
