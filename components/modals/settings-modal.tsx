'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/use-settings.hook';

import { ThemeSwitcher } from '../theme-switcher';
import { Label } from '../ui/label';

export const SettingsModal = () => {
  const { isOpen, onClose, onOpen } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className='border-b pb-3'>
          <h2 className='text-lg font-medium'>My settings</h2>
        </DialogHeader>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>Appearance</Label>
            <span className='text-[0.8rem] text-muted-foreground'>
              Customize how Lucion looks on your device.
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </DialogContent>
    </Dialog>
  );
};
