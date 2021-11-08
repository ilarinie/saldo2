import MoreVert from '@mui/icons-material/MoreVert'
import {
  Autocomplete,
  Backdrop,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { Box, styled } from '@mui/system'
import { FullPageContainer, SmallSaldoModal } from 'client/components'
import { UserSelector } from 'client/components/UserSelector/UserSelector'
import { selectCurrentUser } from 'client/store/authSlice'
import { useGetBudgetsQuery } from 'client/store/budgetApi'
import { useCreatePurchaseMutation } from 'client/store/purchaseApi'
import { selectPurchaseAutocompletionOptions } from 'client/store/purchaseAutocompleteOptions'
import currency from 'currency.js'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { BenefactorEditor } from './BenefactorEditor'
import { initBenefactors } from './initBenefactors'
import { SaldoPurchaseCreatedInfoBox } from './PurchaseCreatedInfoBox'
import { usePurchaseValidation } from './usePurchaseValidation'

const StyledTextField = styled(TextField)`
  width: 100%;
`

export const AddPurchase = observer(() => {
  const match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId/addpurchase')
  const budget = useGetBudgetsQuery().data?.map[match?.params.budgetId || '']
  const history = useHistory()
  const currentUser = useSelector(selectCurrentUser)
  const purchaseAutocompleteOptions = useSelector(selectPurchaseAutocompletionOptions(budget))
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const [saldoPurchaseModalConf, setSaldoPurchaseModalConf] = useState({
    modalOpen: false,
    originalDiff: 0,
    newDiff: 0,
  })

  const onMenuClose = (mode?: any) => {
    setAnchorEl(null)
    if (mode) {
      setBenefactors(
        initBenefactors({
          ...defaultBenefactorParams(),
          defaultMode: mode,
        })
      )
    }
  }
  const onMenuOpen = (event: any) => {
    setAnchorEl(event.target)
  }

  const [selectedPayerId, setSelectedPayerId] = useState(currentUser._id as string)
  const [amount, setAmount] = useState('' as '' | number)
  const [description, setDescription] = useState('')

  const defaultBenefactorParams = () => ({
    amount,
    payerId: selectedPayerId,
    defaultMode: budget?.type === 'saldo' ? 'saldo' : ('even-split' as 'saldo' | 'even-split'),
    userMap: budget?.userMap,
    memberIds: budget?.allIds,
  })

  const [benefactors, setBenefactors] = useState(initBenefactors(defaultBenefactorParams()))

  useEffect(() => {
    setBenefactors(initBenefactors(defaultBenefactorParams()))
  }, [budget, selectedPayerId])

  const [createPurchase, { isLoading, error, isSuccess }] = useCreatePurchaseMutation()

  useEffect(() => {
    if (isSuccess && budget) {
      const currentDiff = Math.abs(budget.totals[0].diff)
      const member1PositiveDiff = budget.totals[0].diff >= 0
      const member1IsPayer = selectedPayerId === budget.totals[0].user._id
      let newDiff = 0
      if (member1IsPayer && member1PositiveDiff) {
        newDiff = currentDiff + currency(amount).value
      } else if (member1IsPayer && !member1PositiveDiff) {
        newDiff = currentDiff - currency(amount).value
      } else if (!member1IsPayer && member1PositiveDiff) {
        newDiff = currentDiff - currency(amount).value
      } else {
        newDiff = currentDiff + currency(amount).value
      }

      setSaldoPurchaseModalConf({
        modalOpen: true,
        originalDiff: currentDiff,
        newDiff: Math.abs(newDiff),
      })
    }
  }, [isSuccess])

  const validation = usePurchaseValidation(amount, description)

  const isInvalidInputs = () => {
    console.log(validation)

    return (
      !validation.amount.isValid || !validation.description.isValid || !validation.amount.isTouched || !validation.description.isTouched
    )
  }

  const onSave = async () => {
    if (isInvalidInputs()) {
      return
    }
    await createPurchase({
      amount: amount as number,
      description,
      budgetId: budget?._id,
      benefactors,
      type: 'purchase',
    })
  }
  const onChange = (event: any, newValue: any) => {
    if (!newValue) {
      setDescription('')
    } else if (newValue.purchase) {
      const { purchase } = newValue
      setAmount(purchase.amount)
      setDescription(purchase.description)
      setBenefactors(purchase.benefactors)
    } else {
      setDescription(newValue)
    }
  }

  if (!budget) {
    return null
  }

  return (
    <FullPageContainer loading={!budget}>
      <Backdrop open={isLoading} sx={{ zIndex: 999999 }}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <CardHeader titleTypographyProps={{ sx: { fontFamily: 'LogoFont' } }} title='Add purchase' />
      {error && JSON.stringify(error, null, 2)}
      <CardContent>
        <Autocomplete
          autoComplete
          id='combo-box-demo'
          options={purchaseAutocompleteOptions || []}
          onInputChange={(event, newValue) => {
            setDescription(newValue)
          }}
          freeSolo
          value={description}
          inputValue={description}
          onChange={onChange}
          renderInput={params => (
            <StyledTextField
              {...params}
              label='Description'
              error={!validation.description.isValid}
              helperText={validation.description.error}
            />
          )}
        />
        <StyledTextField
          sx={{
            marginTop: '1em',
          }}
          type='number'
          label='Amount'
          value={amount}
          onChange={event => {
            setAmount(currency(event.target.value).value || '')
            setBenefactors(
              initBenefactors({
                ...defaultBenefactorParams(),
                amount: currency(event.target.value).value || 0,
              })
            )
          }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>€</InputAdornment>,
          }}
          error={!validation.amount.isValid}
          helperText={validation.amount.error}
        />
        <Typography variant='h6' sx={{ marginTop: '8px' }}>
          Payer
        </Typography>
        {budget.userMap[selectedPayerId] && (
          <UserSelector
            title='Select payer'
            selectedUser={budget.userMap[selectedPayerId]}
            onUserSelected={setSelectedPayerId}
            userIds={budget.allIds}
            userMap={budget.userMap}
          />
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant='h6' gutterBottom>
            Share
          </Typography>
          <IconButton disabled={!amount} ref={anchorEl} onClick={onMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            id='benefactor-mode-menu'
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={() => onMenuClose()}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => onMenuClose('even-split')}>Even-split</MenuItem>
            <MenuItem onClick={() => onMenuClose('saldo')}>Saldo</MenuItem>
          </Menu>
        </Box>
        <BenefactorEditor benefactors={benefactors} onBenefactorsChanged={setBenefactors} total={amount || 0} />
      </CardContent>
      <CardActions disableSpacing>
        <Button disabled={isInvalidInputs()} fullWidth color='info' variant='outlined' onClick={onSave}>
          Save
        </Button>
        <Button color='error' fullWidth variant='outlined' onClick={() => history.goBack()}>
          Cancel
        </Button>
      </CardActions>
      <SmallSaldoModal
        open={true}
        onClose={() => {
          console.log('foo')
        }}
        height='200px'
        width='200px'
      >
        <SaldoPurchaseCreatedInfoBox previousDiff={300.12} newDiff={308.8} />
      </SmallSaldoModal>
    </FullPageContainer>
  )
})
