import { Button } from '@mui/material'
import { useHistory } from 'react-router-dom'

interface PurchaseListProps {}

export const PurchaseList = ({}: PurchaseListProps) => {
  const history = useHistory()

  return (
    <div>
      Not implemented yet yo
      <Button onClick={() => history.goBack()}>Go back</Button>
    </div>
  )
}
