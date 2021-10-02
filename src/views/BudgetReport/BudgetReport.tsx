import {
  colors,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box, styled } from '@mui/system';
import currency from 'currency.js';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { useRouteMatch } from 'react-router';
import { Benefactor, BudgetResponse, Purchase, UserTotal } from 'server/types';
import { RootContext } from '../../state/RootContext';
import {
  CurrencyFormatOptions,
  CurrencyFormatOptionsWithPlus,
} from '../Dashboard/BudgetList/BudgetItem/BudgetItem';

export const BudgetReport = observer(() => {
  const rootState = useContext(RootContext);
  let match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId/report');
  const budget = rootState.budgetStore.map[match?.params.budgetId as string];

  if (!budget) {
    return null;
  }

  const getUserBenefactor = (purchase: Purchase, userId: string) => {
    return purchase.benefactors.find((b) => b.user._id === userId);
  };

  const getUserTotal = (budget: BudgetResponse, userId: string): UserTotal => {
    return budget.totals.find((t) => t.user._id === userId) as UserTotal;
  };

  return (
    <Box maxWidth='100vw' sx={{ overflow: 'scroll' }}>
      <TableContainer component={Paper}>
        <StyledTable size='small'>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>

              {budget.allIds.map((i: string) => (
                <TableCell size='small' colSpan={2} key={`table-head-${i}`}>
                  {budget.userMap[i].name}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell size='small'>Description</TableCell>
              {budget.allIds.map((i: string) => (
                <>
                  <TableCell key={`paid-${i}`}>paid</TableCell>
                  <TableCell key={`got-${i}`}>got</TableCell>
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {budget.purchases.map((p: Purchase) => (
              <TableRow key={p._id}>
                <TableCell>{p.description}</TableCell>
                {budget.allIds.map((i: string) => {
                  const benefactor = getUserBenefactor(p, i) as Benefactor;
                  return (
                    <>
                      <TableCell
                        key={`paid-${i}`}
                        sx={{
                          color:
                            benefactor.amountPaid === 0
                              ? 'rgba(0,0,0,0)'
                              : benefactor.amountPaid < 0
                              ? colors.red[300]
                              : colors.green[300],
                        }}
                      >
                        {currency(benefactor.amountPaid).format(
                          CurrencyFormatOptions
                        )}
                      </TableCell>
                      <TableCell
                        key={`got-${i}`}
                        sx={{
                          color:
                            benefactor.amountBenefitted === 0
                              ? 'rgba(0,0,0,0)'
                              : benefactor.amountBenefitted > 0
                              ? colors.red[300]
                              : colors.green[300],
                        }}
                      >
                        {currency(benefactor.amountBenefitted).format(
                          CurrencyFormatOptions
                        )}
                      </TableCell>
                    </>
                  );
                })}
              </TableRow>
            ))}
            <StyledTotalRow>
              <TableCell>Total</TableCell>
              {budget.allIds.map((i: string) => (
                <>
                  <TableCell key={`paid-${i}`}>
                    {currency(getUserTotal(budget, i).totalPaid).format(
                      CurrencyFormatOptions
                    )}
                  </TableCell>
                  <TableCell key={`got-${i}`}>
                    {currency(getUserTotal(budget, i).totalBenefitted).format(
                      CurrencyFormatOptions
                    )}
                  </TableCell>
                </>
              ))}
            </StyledTotalRow>
            <StyledDiffRow>
              <TableCell>Diff</TableCell>
              {budget.allIds.map((i: string) => {
                const { diff } = getUserTotal(budget, i);
                return (
                  <TableCell
                    colSpan={2}
                    key={`paid-${i}`}
                    align='left'
                    sx={{
                      color:
                        diff === 0
                          ? 'inherit'
                          : diff < 0
                          ? colors.red[300]
                          : colors.green[300],
                    }}
                  >
                    {currency(diff).format(CurrencyFormatOptionsWithPlus)}
                  </TableCell>
                );
              })}
            </StyledDiffRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
});

const StyledTable = styled(Table)`
  tr:nth-of-type(2) {
    th:nth-of-type(even) {
      border-left: 1px solid gray;
    }
  }
  td:nth-of-type(even) {
    border-left: 1px solid gray;
  }
`;

const StyledTotalRow = styled(TableRow)`
  td {
    border: none;
    border-top: 3px solid gray;
    border-left: none !important;
  }
`;

const StyledDiffRow = styled(TableRow)`
  td {
    border: none;
    border-left: none !important;
  }
`;
