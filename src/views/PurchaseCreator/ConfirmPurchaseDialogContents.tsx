import { Box, Button, Stack, Text } from "@chakra-ui/react"

export interface ConfirmPurchaseDialogContentsProps {
    description: string;
    amount: number;
    confirmPurchase: (amount: number, description: string) => void;
    onClose: () => void;
}

export const ConfirmPurchaseDialogContents: React.FC<ConfirmPurchaseDialogContentsProps> = ({description, amount, confirmPurchase, onClose}) => {
    return (
        <Box className='confirm-dialog-container'>
            <Text className='header'>Vahvista luonti</Text>
            <Box className='value-container'>
                <Text className='label'>
                    selite
                </Text>
                <Text className='value'>
                    {description}
                </Text>
            </Box>
            <Box className='value-container'>
                <Text className='label'>
                    summa
                </Text>
                <Text className='value'>
                    {amount.toFixed(2)} €
                </Text>
            </Box>
            <Box className='value-container'>
                <Text className='label'>
                    maksaja
                </Text>
                <Text className='value'>
                    {amount < 0 ? 'Olli' : 'Ilari'}
                </Text>
            </Box>
            <Box className='buttonContainer'>
                <Button
                    colorScheme='darkgray'
                    variant='outline'
                    onClick={onClose}
                >
                    peruuta
                </Button>
                <Button
                    colorScheme='teal'
                    onClick={() => confirmPurchase(amount, description)}
                >
                    vahvista
                </Button>
            </Box>
        </Box>
    )
}