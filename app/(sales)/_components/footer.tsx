import { CircleUser, CircleUserRound, Github, UserCheck2 } from 'lucide-react';
import Link from 'next/link';

import Logo from './logo';

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className='flex items-center w-full p-6 bg-background z-50 dark:bg-[#1f1f1f]'>
      <Logo />
      <div className='md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-4 text-muted-foreground'>
        <Link href='https://github.com/LuciKritZ/lucion' target='_blank'>
          <Github className='h-8 w-8 text-foreground' />
        </Link>
        <Link href='https://lucikritz.github.io' target='_blank'>
          <UserCheck2 className='h-8 w-8 text-foreground' />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
