'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { Check, Copy, GlobeIcon } from 'lucide-react';
import { toast } from 'sonner';

import ConditionalRendering from '@/components/conditional-rendering';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useOrigin } from '@/hooks/use-origin.hook';

type PublishProps = {
  initialData: Doc<'documents'>;
};

const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published',
      error: 'Failed to publish note',
    });
  };

  const onUnPublish = () => {
    setSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setSubmitting(false));

    toast.promise(promise, {
      loading: 'Un-publishing...',
      success: 'Note un-published',
      error: 'Failed to un-publish note',
    });
  };

  const onCopyURL = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          <ConditionalRendering
            condition={initialData.isPublished}
            render={<GlobeIcon className='text-sky-500 w-4 h-4 ml-2' />}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72' align='end' alignOffset={8} forceMount>
        <ConditionalRendering
          condition={initialData.isPublished}
          render={
            <div className='space-y-4'>
              <div className='flex items-center gap-x-2'>
                <GlobeIcon className='text-sky-500 animate-pulse h-4 w-4' />
                <p className='text-xs font-medium text-sky-500'>
                  This note is live on web.
                </p>
              </div>
              <div className='flex items-center'>
                <input
                  className='flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate'
                  value={url}
                  disabled
                />
                <Button
                  onClick={onCopyURL}
                  disabled={copied}
                  className='h-8 rounded-l-none'
                >
                  <ConditionalRendering
                    condition={copied}
                    render={<Check className='h-4 w-4' />}
                    elseRender={<Copy className='h-4 w-4' />}
                  />
                </Button>
              </div>
              <Button
                size='sm'
                className='w-full text-xs'
                disabled={submitting}
                onClick={onUnPublish}
              >
                Un-publish
              </Button>
            </div>
          }
          elseRender={
            <div className='flex flex-col items-center justify-center'>
              <GlobeIcon className='h-8 w-8 text-muted-foreground mb-2' />
              <p className='text-sm font-medium mb-2'>Publish this note</p>
              <span className='text-sx text-muted-foreground mb-4'>
                Share your work with others.
              </span>
              <Button
                disabled={submitting}
                onClick={onPublish}
                className='w-full text-sm'
                size='sm'
              >
                Publish
              </Button>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
