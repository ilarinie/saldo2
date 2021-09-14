import { Box, Heading } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useContext, useState } from 'react';
import { Budget } from 'src/models/Budget';
import { LoadingScreen } from '../../components';
import { RootContext } from '../../state/RootContext';
import { BudgetList } from './BudgetList/BudgetList';
import './newdashboard.scss';
import { PurchaseCreationDialog } from './PurchaseCreationDialog/PurchaseCreationDialog';
import { SaldoHistoryDialog } from './SaldoHistoryDialog/SaldoHistoryDialog';

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

  const addPurchase = (budget: Budget) => {
    const contents = (
      <PurchaseCreationDialog
        budgetId={budget._id}
        members={[...budget.members, ...budget.owners]}
        amount={undefined}
        confirmPurchase={confirmPurchase}
        onClose={() => setModalContents(null)}
      />
    );
    setModalContents(contents);
  };

  // const requestConfirmPurchase = (
  //   amount: number | undefined,
  //   description: string
  // ) => {
  //   console.log('funktiossa', amount);
  //   if (description) {
  //     const contents = (
  //       <PurchaseCreationDialog
  //         amount={amount}
  //         description={description}
  //         confirmPurchase={confirmPurchase}
  //         onClose={() => setModalContents(null)}
  //       />
  //       // <div>muu</div>
  //     );
  //     setModalContents(contents);
  //   }
  // };

  const confirmPurchase = async (
    amount: number | undefined,
    description: string,
    budgetId: string,
    payerId: string
  ) => {
    if (!amount) {
      return;
    }
    setModalContents(<LoadingScreen message='Luodaan..' />);
    try {
      await rootState.createPurchase(amount, description, budgetId, payerId);
    } catch (err) {
      console.error(err);
    } finally {
      setModalContents(null);
    }
  };

  const onSearchTextChange = useCallback((searchText) => {
    setSearchText(searchText);
  }, []);

  return (
    <Box className='newdashboard'>
      <Box>
        <Heading>SaldoApp</Heading>
        <div>Logged in as {rootState.currentUser.name}</div>
      </Box>
      <BudgetList
        addPurchase={addPurchase}
        budgets={rootState.budgets}
        currentUser={rootState.currentUser}
      />
      {/* <SaldoPanel
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
      </Slider> */}
      {modalContents && <Box className='modal'>{modalContents}</Box>}
    </Box>
  );
});
