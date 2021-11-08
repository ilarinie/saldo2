import { Card, Modal } from '@mui/material'
import { styled } from '@mui/system'
import { CSSProperties, ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  width: CSSProperties['width']
  height: CSSProperties['height']
  children: ReactNode
}

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

export const SmallSaldoModal = ({ open, onClose, children, height, width }: ModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalCard sx={{ height, width }}>{children}</StyledModalCard>
    </Modal>
  )
}
