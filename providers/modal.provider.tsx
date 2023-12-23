'use client';

import { useEffect, useState } from 'react';

import { CoverImageModal } from '@/components/modals/cover-image-modal';
import { SettingsModal } from '@/components/modals/settings-modal';

export const ModalProvider = () => {
  const [isMounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};
