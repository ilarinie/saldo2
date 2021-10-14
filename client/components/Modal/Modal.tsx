import { Card, Modal } from '@mui/material'
import { styled } from '@mui/system'
import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const style: any = {}

const StyledModalCard = styled(Card)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 99vw;
  height: 99vh;
  bgcolor: background.paper;
  border: 2px solid #000;
  boxshadow: 24;
  p: 4;
  overflow-y: auto;
  position: absolute;
`

export const SaldoModal = ({ open, onClose, children }: ModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalCard sx={style}>{children}</StyledModalCard>
    </Modal>
  )
}
