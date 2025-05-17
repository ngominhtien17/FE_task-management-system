// src/features/users/components/DeactivateUserDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { User } from '../types';

interface DeactivateUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const DeactivateUserDialog: React.FC<DeactivateUserDialogProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    onClose();
    setReason('');
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vô hiệu hóa tài khoản</DialogTitle>
          <DialogDescription>
            Bạn đang vô hiệu hóa tài khoản:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="font-medium">{user.fullName} ({user.email})</p>
          <p>{user.department?.name}</p>
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Lý do vô hiệu hóa<span className="text-red-500">*</span>
            </label>
            <textarea 
              className="w-full min-h-24 p-2 border rounded-md"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          
          <div className="mt-2 flex items-start">
            <div className="text-amber-600 text-sm">
              <p>⚠️ Lưu ý: Tài khoản sẽ không thể đăng nhập sau khi bị vô hiệu hóa.</p>
              <p>Tất cả phiên làm việc hiện tại sẽ bị chấm dứt.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserDialog;