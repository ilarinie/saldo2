import { Box, CloseButton, Container, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { PurchaseWithCumTotal } from '../../../models/Purchase';
import { SaldoChart } from './SaldoChart';

interface SaldoHistoryDialogProps {
  onClose: () => void;
  purchases: PurchaseWithCumTotal[];
}

export const SaldoHistoryDialog = observer(
  ({ onClose, purchases }: SaldoHistoryDialogProps) => {
    // const [lastMonthPurchases, setLastMonthPurchases] = useState(
    //   [] as PurchaseWithCumTotal[]
    // );

    // useEffect(() => {
    //   const currMonth = new Date().getMonth();
    //   let i = 0;
    //   const lastMonthPurchasesArr = [];
    //   while (new Date(purchases[i].createdAt).getMonth() === currMonth - 1) {
    //     lastMonthPurchasesArr.push(purchases[i]);
    //     i++;
    //   }
    //   setLastMonthPurchases(lastMonthPurchasesArr);
    // }, [purchases]);

    return (
      <Container className='saldoHistoryDialog'>
        <CloseButton onClick={onClose} marginLeft='auto' size='lg' />
        <Text variant='h1'>Saldo history</Text>
        <Box>
          <SaldoChart purchases={purchases} />
        </Box>
        {/* <Box>
          <SaldoChart purchases={lastMonthPurchases} />
        </Box> */}
      </Container>
    );
  }
);
