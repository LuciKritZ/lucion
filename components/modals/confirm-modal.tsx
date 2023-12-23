'use client';

import {
  AlertDialog,
  AlertDialogAction as DialogAction,
  AlertDialogCancel as DialogCancel,
  AlertDialogContent as DialogContent,
  AlertDialogDescription as DialogDescription,
  AlertDialogFooter as DialogFooter,
  AlertDialogHeader as DialogHeader,
  AlertDialogTitle as DialogTitle,
  AlertDialogTrigger as DialogTrigger,
} from '@/components/ui/alert-dialog';
import { GenericReactElement } from '@/types/react.types';

interface ConfirmModalProps {
  children: GenericReactElement;
  onConfirm: () => void;
}

export const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
  const handleConfirm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onConfirm();
  };

  return (
    <AlertDialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </DialogCancel>
          <DialogAction onClick={handleConfirm}>Confirm</DialogAction>
        </DialogFooter>
      </DialogContent>
    </AlertDialog>
  );
};
