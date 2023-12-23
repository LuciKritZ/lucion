'use client';

import { ElementRef, useRef, useState } from 'react';

import { useMutation } from 'convex/react';
import { ImageIcon, SmileIcon, X } from 'lucide-react';
import TextAreaAutoSize from 'react-textarea-autosize';

import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image.hook';

import ConditionalRendering from './conditional-rendering';
import { IconPicker } from './icon-picker';
import { Button } from './ui/button';

interface ToolbarProps {
  initialData: Doc<'documents'>;
  preview?: boolean;
}

const Toolbar = ({ initialData, preview = false }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);

  const [isEditing, setEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const { isOpen, onClose, onOpen } = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setEditing(true);

    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || 'Untitled',
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  // Add/remove icons
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  return (
    <div className='pl-[54px] group relative'>
      <ConditionalRendering
        condition={!!initialData.icon && !preview}
        render={
          <div className='flex items-center gap-x-2 group/icon pt-6'>
            <IconPicker onChange={onIconSelect}>
              <p className='text-6xl hover:opacity-75 transition'>
                {initialData.icon}
              </p>
            </IconPicker>
            <Button
              className='rounded-full opacity-0 group-hover/icon:opacity-100 text-muted-foreground'
              onClick={onRemoveIcon}
              variant='outline'
              size='icon'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        }
      />
      <ConditionalRendering
        condition={!!initialData.icon && preview}
        render={<p className='text-6xl pt-6'>{initialData.icon}</p>}
      />
      <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
        <ConditionalRendering
          condition={!initialData.icon && !preview}
          render={
            <IconPicker asChild onChange={onIconSelect}>
              <Button
                className='text-muted-foreground text-sm'
                variant='outline'
                size='sm'
              >
                <SmileIcon className='h-4 w-4 mr-2' />
                Add Icon
              </Button>
            </IconPicker>
          }
        />
        <ConditionalRendering
          condition={!initialData.coverImage && !preview}
          render={
            <Button
              onClick={onOpen}
              className='text-muted-foreground text-sm'
              variant='outline'
              size='sm'
            >
              <ImageIcon className='h-4 w-4 mr-2' />
              Add cover
            </Button>
          }
        />
      </div>
      <ConditionalRendering
        condition={isEditing && !preview}
        render={
          <TextAreaAutoSize
            ref={inputRef}
            onBlur={disableInput}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onInput(e.target.value)}
            className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none'
          />
        }
        elseRender={
          <div
            className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]'
            onClick={enableInput}
          >
            {initialData.title}
          </div>
        }
      />
    </div>
  );
};

export default Toolbar;
