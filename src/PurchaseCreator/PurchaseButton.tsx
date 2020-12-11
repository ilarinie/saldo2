import { Button } from '@chakra-ui/react'



// @ts-ignore
export const PurchaseButton = ({preset, onClick}) => {
 return (
     <Button colorScheme='teal' onClick={onClick} style={{ marginBottom: '0.5em', minHeight: '80px'}}>
         {preset.description}<br />
         {preset.amount.toFixed(2)} €
     </Button>
 )
}