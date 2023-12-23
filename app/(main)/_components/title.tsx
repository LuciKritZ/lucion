import { useRef, useState } from 'react';

import { useMutation } from 'convex/react';

import ConditionalRendering from '@/components/conditional-rendering';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';

type TitleProps = {
  initialData: Doc<'documents'>;
};

const Title = ({ initialData }: TitleProps) => {
  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialData.title ?? 'Untitled');

  const enableInput = () => {
    setTitle(initialData.title);
    setEditing(true);
    // A little hack for focusing on input
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    update({
      id: initialData._id,
      title: event.target.value || 'Untitled',
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className='flex items-center gap-x-1'>
      <ConditionalRendering
        condition={!!initialData.icon}
        render={<p>{initialData.icon}</p>}
      />
      <ConditionalRendering
        condition={isEditing}
        render={
          <Input
            ref={inputRef}
            className='h-7 px-2 focus-visible:ring-transparent'
            onClick={enableInput}
            onBlur={disableInput}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={title}
          />
        }
        elseRender={
          <Button
            variant='ghost'
            className='font-normal h-auto p-1'
            onClick={enableInput}
            size='sm'
          >
            <span className='truncate'>{initialData.title}</span>
          </Button>
        }
      />
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-9 w-20 rounded-md' />;
};

export default Title;
