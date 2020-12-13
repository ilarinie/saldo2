import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, Box, Switch, Text, Center, Container } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { PurchaseList } from "./PurchaseList";
import'./dashboard.scss'
import { RootContext } from "../../state/RootContext";

const Dashboard: React.FC = observer(() => {

    const rootState = useContext(RootContext);

    useEffect(() => { 
        // rootState.fetchPurchases()
    }, [rootState]);

    const [ deleteMode, setDeleteMode ] = useState(false);
    const [ fullScreenList, setFullscreenList ] = useState(false);

    return (
        <Box className='dashboard'>
            <Container className='dashboard-header'>
                <Center className='dashboard-saldo'>
                    <Text style={{ fontSize: '40px'}}>{rootState.totalSaldo > 0 && '+'}  {rootState.totalSaldo} €</Text>
                </Center>
            </Container>
            <Container bg="lighterDark" className={`dashboard-list ${fullScreenList && 'fullsize'}`}>
                {fullScreenList && <ChevronDownIcon className='boxRaiser' onClick={() => setFullscreenList(!fullScreenList)}>y</ChevronDownIcon>}
                {!fullScreenList && <ChevronUpIcon className='boxRaiser' onClick={() => setFullscreenList(!fullScreenList)}>y</ChevronUpIcon>}
                <Flex justifyContent='space-between' marginBottom='1em'>
                    <Text variant='h6'>Saldolista</Text>
                    <Box display='flex' alignItems='center' justifyContent="flex-end">
                        <Text style={{ fontSize: '10px', fontVariant: 'small-caps', marginRight: '0.5em'}}>delete</Text>
                        <Switch isChecked={deleteMode} onChange={() => setDeleteMode(!deleteMode)} />
                    </Box>
                </Flex>
                <div className='list-container'>
                    <PurchaseList dateToPurchaseMap={rootState.dateToPurchaseMap} deleteMode={deleteMode} purchasesWithCumTotal={rootState.purchasesWithCumulativeTotal} deletePurchase={rootState.deletePurchase} />
                </div>
            </Container>
        </Box>
    )
});

export default Dashboard;