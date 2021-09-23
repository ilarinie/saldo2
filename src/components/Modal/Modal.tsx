import { Card, Modal } from '@mui/material';
import { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '99vw',
  height: '99vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const SaldoModal = ({ open, onClose, children }: ModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Card sx={{ ...style, position: 'absolute' }}>{children}</Card>
    </Modal>
  );
};
