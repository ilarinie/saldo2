import { ChakraProvider } from '@chakra-ui/react';
import { render, screen} from '@testing-library/react';
import Dashboard from '.';
import { RootContext, rootState } from '../../state/RootContext';
import theme from '../../theme';

const MOCK_PURCHASES = [
    {   
        _id: 'some id 1',
        amount: 1.2,
        description: 'test_purchase_1',
        createdAt: '2020-12-11',
        updatedAt: '2020-12-10',
        cumTotal: 2.4,
    },
    {
        _id: 'some id 2',
        amount: 1.2,
        description: 'test_purchase_2',
        createdAt: '2020-12-10',
        updatedAt: '2020-12-10',
        cumTotal: 1.2,
    }
]

const MOCK_DATE_TO_PURCHASE_MAP = {
    [new Date(MOCK_PURCHASES[0].createdAt).toLocaleDateString()]: [
        MOCK_PURCHASES[0]
    ],
    [new Date(MOCK_PURCHASES[1].createdAt).toLocaleDateString()]: [
        MOCK_PURCHASES[1]
    ]
}



test('Dashboard matches snapshot', () => {
    rootState.dateToPurchaseMap = MOCK_DATE_TO_PURCHASE_MAP;
    render(<RootContext.Provider value={rootState}><ChakraProvider theme={theme}><Dashboard /></ChakraProvider></RootContext.Provider>);
    expect(screen).toMatchSnapshot();
    const testPurchase1 = screen.getByText(/test_purchase_1/i);
    expect(testPurchase1).toBeInTheDocument();
});