'use client';

import { useState } from 'react';

import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCoverImage } from '@/hooks/use-cover-image.hook';
import { useEdgeStore } from '@/lib/edgestore';

import { SingleImageDropzone } from '../single-image-dropzone';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

export const CoverImageModal = () => {
  const {
    isOpen: isCoverImageDialogOpen,
    onClose: onCoverImageDialogClose,
    url: coverImageUrl,
  } = useCoverImage();
  const { edgestore } = useEdgeStore();
  const update = useMutation(api.documents.update);
  const params = useParams();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const onClose = () => {
    setFile(undefined);
    setSubmitting(false);
    onCoverImageDialogClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImageUrl,
        },
      });

      await update({
        id: params.documentId as Id<'documents'>,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog
      open={isCoverImageDialogOpen}
      onOpenChange={onCoverImageDialogClose}
    >
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-lg font-semibold'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
