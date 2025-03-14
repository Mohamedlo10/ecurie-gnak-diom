// ConfirmDeleteDialog.tsx
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from './alert-dialog';
import { Button } from './button';

type ConfirmDeleteDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  message: string;
};

const ConfirmDialog: React.FC<ConfirmDeleteDialogProps> = ({ onConfirm, onCancel, isOpen, message }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
        <AlertDialogTitle className='text-black hidden'>
            ELITE
        </AlertDialogTitle>
      <AlertDialogContent>
        <div className='font-bold h-10 items-center justify-start flex -p-8 w-full text-red-600 border-b '>Confirmation</div>
        <p className='text-black'>{message}</p>
        <AlertDialogFooter>
          <Button className='bg-white p-2 cursor-pointer text-black hover:text-white hover:bg-red-700 font-bold ' onClick={onCancel}>Non</Button>
          <Button className='bg-white p-2 cursor-pointer text-black hover:text-white hover:bg-red-700 font-bold' onClick={onConfirm} variant="destructive">
            Oui
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
