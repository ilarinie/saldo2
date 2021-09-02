import { Box } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useContext, useState } from 'react';
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
    amount: number | undefined,
    description: string
  ) => {
    console.log('funktiossa', amount);
    if (description) {
      const contents = (
        <PurchaseCreationDialog
          amount={amount}
          description={description}
          confirmPurchase={confirmPurchase}
          onClose={() => setModalContents(null)}
        />
        // <div>muu</div>
      );
      setModalContents(contents);
    }
  };

  const confirmPurchase = async (
    amount: number | undefined,
    description: string
  ) => {
    if (!amount) {
      return;
    }
    setModalContents(<LoadingScreen message='Luodaan..' />);
    try {
      await rootState.createPurchase(amount, description);
    } catch (err) {
    } finally {
      setModalContents(null);
    }
  };

  const onSearchTextChange = useCallback((searchText) => {
    setSearchText(searchText);
  }, []);

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
        onSearchTextChange={onSearchTextChange}
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
