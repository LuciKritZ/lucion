'use client';

import { useMemo, useState } from 'react';

import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, UndoIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import Spinner from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState<string>('');

  const filteredDocuments = useMemo(
    () =>
      documents?.filter((document) =>
        document.title.toLowerCase().includes(search.toLowerCase())
      ),
    [search, documents]
  );

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<'documents'>
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: 'Restoring document...',
      success: 'Document restored',
      error: 'Failed to restore document',
    });
  };

  const onRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: 'Deleting document...',
      success: 'Document deleted',
      error: 'Failed to delete document',
    });

    if (params.documentId === documentId) {
      router.push('/documents');
    }
  };

  if (documents === undefined) {
    return (
      <div className='h-full flex items-center justify-center p-4'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='text-sm'>
      <div className='flex items-center gap-x-1 p-2'>
        <Search className='h-4 w-4' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='h-7 px-2 focus-visible:ring-transparent bg-secondary'
          placeholder='Filter by page title...'
        />
      </div>
      <div className='mt-2 px-1 pb-1'>
        <p className='hidden last:block text-xs text-center text-muted-foreground pb-2'>
          No documents found.
        </p>

        {filteredDocuments?.map(({ _id, title }) => (
          <div
            className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between'
            key={_id}
            role='button'
            onClick={() => onClick(_id)}
          >
            <span className='truncate pl-2'>{title}</span>
            <div className='flex items-center'>
              <div
                onClick={(e) => onRestore(e, _id)}
                role='button'
                className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
              >
                <UndoIcon className='h-4 w-4 text-muted-foreground' />
              </div>
              <ConfirmModal onConfirm={() => onRemove(_id)}>
                <div
                  role='button'
                  className='rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                >
                  <Trash className='h-4 w-4 text-muted-foreground' />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
