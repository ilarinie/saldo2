import { Box, Button, Container, FormLabel, Input, NumberInput, NumberInputField, Stack, Switch, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export interface ManualPurchaseFormProps {
  requestConfirmPurchase: (amount: number, description: string) => void;
}


export const ManualPurchaseForm: React.FC<ManualPurchaseFormProps> = ({ requestConfirmPurchase }) => {
  const [manualPurchase, setManualPurchase] = useState({
    amount: "",
    description: "",
  });
  const [isOlli, setIsOlli] = useState(false);

  return (
    <Container>
      <Stack spacing={1}>
        <Box>
          <Text>Maksaja</Text>
          <Box className='payer-selector'>
            <Text>Ilari</Text>
            <Switch
              isChecked={isOlli}
              onChange={(event) => setIsOlli(event.target.checked)}
            />
            <Text>Olli</Text>
          </Box>
        </Box>
        <NumberInput>
          <FormLabel>Summa</FormLabel>
          <NumberInputField
            value={manualPurchase.amount}
            onChange={(event) =>
              setManualPurchase({
                ...manualPurchase,
                amount: event.target.value,
              })
            }
            type="number"
          />
        </NumberInput>
        <FormLabel>Selite</FormLabel>
        <Input
          value={manualPurchase.description}
          type="text"
          onChange={(event) =>
            setManualPurchase({
              ...manualPurchase,
              description: event.currentTarget.value,
            })
          }
        />
        <br />
        <Button
          colorScheme="teal"
          onClick={() =>
            requestConfirmPurchase(
              isOlli ? parseFloat(manualPurchase.amount) * -1 : parseFloat(manualPurchase.amount),
              manualPurchase.description
            )
          }
        >
          Lisää
        </Button>
      </Stack>
    </Container>
  );
};
