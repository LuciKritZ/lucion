'use client';

import { useMutation } from 'convex/react';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image.hook';
import { useEdgeStore } from '@/lib/edgestore';
import { cn } from '@/lib/utils';

import ConditionalRendering from './conditional-rendering';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url = '', preview = false }: CoverImageProps) => {
  const params = useParams();
  const { onOpen: onCoverImageDialogOpen, onReplace: onCoverImageReplace } =
    useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url,
      });
    }
    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    });
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      <ConditionalRendering
        condition={!!url}
        render={
          <Image src={url} fill alt='Cover' className='object-cover' priority />
        }
      />
      <ConditionalRendering
        condition={!!url && !preview}
        render={
          <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
            <Button
              onClick={() => onCoverImageReplace(url)}
              className='text-muted-foreground text-xs'
              variant='outline'
              size='sm'
            >
              <ImageIcon className='h-4 w-4 mr-2' />
              Change Cover
            </Button>
            <Button
              onClick={onRemove}
              className='text-muted-foreground text-xs'
              variant='outline'
              size='sm'
            >
              <X className='h-4 w-4 mr-2' />
              Remove
            </Button>
          </div>
        }
      />
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className='w-full h-[12vh]' />;
};

export default Cover;
