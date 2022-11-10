import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  InputAdornment,
  Modal,
  Slide,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import { UserSelector } from 'client/components/UserSelector/UserSelector'
import { selectPurchaseAutocompletionOptions } from 'client/store/purchaseAutocompleteOptions'
import currency from 'currency.js'
import { useEffect, useState, forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { TransitionProps } from 'react-transition-group/Transition'
import { Benefactor, Budget, Purchase, PurchaseUser } from 'types'
import { initBenefactors } from '../AddPurchase/initBenefactors'
import { usePurchaseValidation } from '../AddPurchase/usePurchaseValidation'

interface CreateModalProps {
  modalOpen: boolean
  onClose: (purchase?: Partial<Purchase>) => void
  budget: Budget
  currentUser: PurchaseUser
}

const style = {
  // top: '25%',
  bottom: '0',
  left: '0px',
  right: '0px',
  width: '100%',
  height: '480px',
  boxShadow: 24,
  p: 4,
}

const StyledTextField = styled(TextField)`
  width: 100%;
`

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export const CreateModal = (props: CreateModalProps) => {
  const { budget } = props

  const purchaseAutocompleteOptions = useSelector(selectPurchaseAutocompletionOptions(budget))

  const [selectedPayerId, setSelectedPayerId] = useState(props.currentUser._id as string)
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
  }, [selectedPayerId])

  const onClose = (purchase?: Partial<Purchase>) => {
    props.onClose(purchase)
    setSelectedPayerId(props.currentUser._id as string)
    setAmount('' as '' | number)
    setDescription('')
    resetValidation()
  }

  const { validationResult: validation, isInvalidInputs, resetValidation } = usePurchaseValidation(amount, description)

  const onSave = async () => {
    if (isInvalidInputs) {
      return
    }
    onClose({
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

  return (
    <Dialog open={props.modalOpen} onClose={() => onClose()} TransitionComponent={Transition}>
      <Card sx={{ padding: '1em' }}>
        <CardHeader titleTypographyProps={{ sx: { fontFamily: 'LogoFont' } }} title='Add purchase' />
        <CardContent>
          <Autocomplete
            blurOnSelect
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
                variant='outlined'
              />
            )}
          />
          <StyledTextField
            sx={{
              marginTop: '1em',
            }}
            variant='outlined'
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
        </CardContent>
        <CardActions>
          <Button disabled={isInvalidInputs} variant='contained' fullWidth onClick={onSave}>
            Save
          </Button>
          <Button fullWidth variant='contained' onClick={() => onClose()}>
            Cancel
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  )
}
