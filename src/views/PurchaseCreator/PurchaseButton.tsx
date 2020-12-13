import { Button, Spacer, Text } from '@chakra-ui/react'



// @ts-ignore
export const PurchaseButton = ({preset, onClick}) => {
 return (
     <Button colorScheme='teal' onClick={onClick} style={{ marginBottom: '0.5em', minHeight: '40px'}}>
         <Text isTruncated>{preset.description}</Text><Spacer />
         {preset.amount.toFixed(2)} €
     </Button>
 )
}