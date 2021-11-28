import { Button, colors, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Box, styled } from '@mui/system'
import { useBudgetViewData } from 'client/hooks/useBudgetViewData'
import { formatCurrency } from 'client/utils/formatCurrency'
import { Benefactor, Budget, Purchase, UserTotal } from 'types'

export const BudgetReport = () => {
  const { budget, history } = useBudgetViewData()

  if (!budget) {
    return null
  }

  const getUserBenefactor = (purchase: Purchase, userId: string) => {
    return purchase.benefactors.find(b => b.user._id === userId)
  }

  const getUserTotal = (budget: Budget, userId: string): UserTotal => {
    return budget.totals.find(t => t.user._id === userId) as UserTotal
  }

  return (
    <Box maxWidth='100vw' sx={{ overflow: 'scroll' }}>
      <Button onClick={() => history.goBack()}>Go back</Button>
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
                  const benefactor = getUserBenefactor(p, i) as Benefactor
                  return (
                    <>
                      <TableCell
                        key={`paid-${i}`}
                        sx={{
                          color:
                            benefactor.amountPaid === 0 ? 'rgba(0,0,0,0)' : benefactor.amountPaid < 0 ? colors.red[300] : colors.green[300],
                        }}
                      >
                        {formatCurrency(benefactor.amountPaid)}
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
                        {formatCurrency(benefactor.amountBenefitted)}
                      </TableCell>
                    </>
                  )
                })}
              </TableRow>
            ))}
            <StyledTotalRow>
              <TableCell>Total</TableCell>
              {budget.allIds.map((i: string) => (
                <>
                  <TableCell key={`paid-${i}`}>{formatCurrency(getUserTotal(budget, i).totalPaid)}</TableCell>
                  <TableCell key={`got-${i}`}>{formatCurrency(getUserTotal(budget, i).totalBenefitted)}</TableCell>
                </>
              ))}
            </StyledTotalRow>
            <StyledDiffRow>
              <TableCell>Diff</TableCell>
              {budget.allIds.map((i: string) => {
                const { diff } = getUserTotal(budget, i)
                return (
                  <TableCell
                    colSpan={2}
                    key={`paid-${i}`}
                    align='left'
                    sx={{
                      color: diff === 0 ? 'inherit' : diff < 0 ? colors.red[300] : colors.green[300],
                    }}
                  >
                    {formatCurrency(diff, true)}
                  </TableCell>
                )
              })}
            </StyledDiffRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  )
}

const StyledTable = styled(Table)`
  tr:nth-of-type(2) {
    th:nth-of-type(even) {
      border-left: 1px solid gray;
    }
  }
  td:nth-of-type(even) {
    border-left: 1px solid gray;
  }
`

const StyledTotalRow = styled(TableRow)`
  td {
    border: none;
    border-top: 3px solid gray;
    border-left: none !important;
  }
`

const StyledDiffRow = styled(TableRow)`
  td {
    border: none;
    border-left: none !important;
  }
`
