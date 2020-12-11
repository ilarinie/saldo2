import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, Box, Switch, Text, Center, Container } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { RootContext } from "..";
import { Purchase } from "../models/Purchase"
import { PurchaseList } from "../PurchaseList";
import'./dashboard.scss'

export interface DashboardProps {

}

export const Dashboard: React.FC<DashboardProps> = observer(() => {

    const rootState = useContext(RootContext);

    const [ deleteMode, setDeleteMode ] = useState(false);
    const [ fullScreenList, setFullscreenList ] = useState(false);

    return (
        <>
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
                    <PurchaseList dateToPurchaseMap={rootState.dateToPurchaseMap} deleteMode={deleteMode} purchasesWithCumTotal={rootState.purchasesWithCumTotal} deletePurchase={rootState.deletePurchase} />
                </div>
            </Container>
        </>
    )
});