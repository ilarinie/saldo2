import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useContext, useState } from 'react';
import { LoadingScreen } from '../../components';
import { RootContext } from '../../state/RootContext';
import './newdashboard.scss';
import { PurchaseCreationDialog } from './PurchaseCreationDialog/PurchaseCreationDialog';
import { PurchaseList } from './PurchaseList/PurchaseList';
import { SaldoHistoryDialog } from './SaldoHistoryDialog/SaldoHistoryDialog';
import { SaldoPanel } from './SaldoPanel';
import { SearchField } from './SearchField/SearchField';
import { Slider } from './Slider';

export const NewDashboard = observer(() => {
  const rootState = useContext(RootContext);

  const closeModal = () => {
    setModalContents(null);
  };
  const [modalContents, setModalContents] = useState(null as null | ReactNode);
  const [searchText, setSearchText] = useState('');

  const openSaldoHistoryDialog = () => {
    setModalContents(
      <SaldoHistoryDialog
        purchases={rootState.purchasesWithCumulativeTotal}
        onClose={closeModal}
      />
    );
  };

  const requestConfirmPurchase = (
    amount: number | null,
    description: string
  ) => {
    if (description) {
      const contents = (
        <PurchaseCreationDialog
          amount={amount}
          description={description}
          confirmPurchase={confirmPurchase}
          onClose={() => setModalContents(null)}
        />
      );
      setModalContents(contents);
    }
  };

  const confirmPurchase = async (amount: number, description: string) => {
    setModalContents(<LoadingScreen message='Luodaan..' />);
    try {
      await rootState.createPurchase(amount, description);
    } catch (err) {
    } finally {
      setModalContents(null);
    }
  };

  return (
    <Box className='newdashboard'>
      <SaldoPanel
        openSaldoHistory={openSaldoHistoryDialog}
        total={rootState.totalSaldo}
        changeToday={rootState.changeToday}
        refreshPurchases={() => rootState.fetchPurchases()}
      />
      <SearchField
        requestConfirmPurchase={requestConfirmPurchase}
        onSearchTextChange={(searchText) => setSearchText(searchText)}
      />
      <Slider>
        <PurchaseList
          purchasesWithCumTotal={rootState.purchasesWithCumulativeTotal}
          dateToPurchaseMap={rootState.dateToPurchaseMap}
          deleteMode={false}
          deletePurchase={rootState.deletePurchase}
          requestConfirmPurchase={requestConfirmPurchase}
          filterText={searchText}
        />
      </Slider>
      {modalContents && <Box className='modal'>{modalContents}</Box>}
    </Box>
  );
});
