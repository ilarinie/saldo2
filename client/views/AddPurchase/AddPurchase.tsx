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
import { useCreatePurchaseMutation } from 'client/store/purchaseApi'
import { selectPurchaseAutocompletionOptions } from 'client/store/purchaseAutocompleteOptions'
import currency from 'currency.js'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Benefactor, Budget, PurchaseUser } from 'types'
import { BenefactorEditor } from './BenefactorEditor'
import { initBenefactors } from './initBenefactors'
import { SaldoPurchaseCreatedInfoBox } from './PurchaseCreatedInfoBox'
import { usePurchaseValidation } from './usePurchaseValidation'

const StyledTextField = styled(TextField)`
  width: 100%;
`

type AddPurchaseProps = {
  budget: Budget,
  currentUser: PurchaseUser
  onPurchaseCreated: () => void
  onCancel: () => void
}

export const AddPurchase = ({ budget, currentUser, onPurchaseCreated, onCancel }: AddPurchaseProps) => {
  const purchaseAutocompleteOptions = useSelector(selectPurchaseAutocompletionOptions(budget))
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)

  const [saldoPurchaseModalConf, setSaldoPurchaseModalConf] = useState({
    modalOpen: true,
    originalDiff: 200,
    newDiff: 100,
    purchaseDescription: 'budvar',
    purchaseAmount: 100,
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
        purchaseDescription: description,
        purchaseAmount: currency(amount).value,
      })
    }
  }, [isSuccess])

  const { validationResult: validation, isInvalidInputs } = usePurchaseValidation(amount, description)

  const onSave = async () => {
    if (isInvalidInputs) {
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
      setSelectedPayerId(purchase.benefactors.find((b: Benefactor) => b.amountPaid > 0).user._id)
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
        {/* <Box
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
        </Box> */}
        {/* <BenefactorEditor benefactors={benefactors} onBenefactorsChanged={setBenefactors} total={amount || 0} /> */}
      </CardContent>
      <CardActions disableSpacing>
        <Button disabled={isInvalidInputs} fullWidth color='info' variant='outlined' onClick={onSave}>
          Save
        </Button>
        <Button color='error' fullWidth variant='outlined' onClick={onCancel}>
          Cancel
        </Button>
      </CardActions>
      <SmallSaldoModal
        open={saldoPurchaseModalConf.modalOpen}
        onClose={() => {
          setSaldoPurchaseModalConf({
            modalOpen: false,
            newDiff: 0,
            originalDiff: 0,
            purchaseDescription: '',
            purchaseAmount: 0,
          })
          onPurchaseCreated()
        }}
        height='400px'
        width='300px'
      >
        <SaldoPurchaseCreatedInfoBox
          purchaseDescription={saldoPurchaseModalConf.purchaseDescription}
          previousDiff={saldoPurchaseModalConf.originalDiff}
          newDiff={saldoPurchaseModalConf.newDiff}
          purchaseAmount={saldoPurchaseModalConf.purchaseAmount}
        />
      </SmallSaldoModal>
    </FullPageContainer>
  )
}
