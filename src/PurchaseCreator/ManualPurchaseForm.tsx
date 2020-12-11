import { Box, Button, Container, FormLabel, Input, NumberInput, NumberInputField, Stack, Switch, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// const CustomSwitch = withStyles({
//     switchBase: {
//       color: 'red',
//       '&$checked': {
//         color: 'green',
//       },
//       '&$checked + $track': {
//         backgroundColor: 'green',
//       },
//     },
//     checked: {},
//     track: {
//         backgroundColor: 'red'
//     },
//   })(Switch);

// const useStyles = makeStyles({
//   container: {
//     marginBottom: "10px",
//     width: "98%",
//     display: "flex",
//     flexDirection: "column",
//     padding: "0.5em",
//   },
//   selector: {
//       display: 'flex',
//       alignItems: 'center'
//   },
//   header: {
//     color: 'rgba(255, 255, 255, 0.7)',
//     padding: '0',
//     fontSize: '0.8rem',
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     fontWeight: '400',
//     lineHeight: '1',
//     letterSpacing: '0.00938em'
//   }
// });

//@ts-ignore
export const ManualPurchaseForm = ({ requestConfirmPurchase, open }) => {
  const [manualPurchase, setManualPurchase] = useState({
    amount: "",
    description: "",
  });

  const [isOlli, setIsOlli] = useState(false);

  useEffect(() => {
    if (open) {
      setManualPurchase({
        amount: '',
        description: "",
      });
    }
  }, [open]);

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
          fullWidth
          onClick={() =>
            requestConfirmPurchase(
              isOlli ? parseFloat(manualPurchase.amount) * -1 : manualPurchase.amount,
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
