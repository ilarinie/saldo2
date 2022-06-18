import { List, ListItemButton } from '@mui/material'
import { useGetBudgetsQuery } from 'client/store/budgetApi'
import { useLocalStorageUserSettings } from './useLocalStorageUserSettings'

export const UserSettings = () => {
  const { data } = useGetBudgetsQuery()
  const { settings, updateSettings } = useLocalStorageUserSettings()

  return (
    <>
      {data && (
        <div>
          <h1>Choose default budget</h1>
          <List>
            {data.ids.map((budgetId: keyof typeof data['map']) => (
              <BudgetSelectionItem
                name={data.map[budgetId].name}
                selected={settings.defaultBudgetId === budgetId}
                key='budgetId'
                onClick={() => updateSettings({ defaultBudgetId: budgetId.toString() })}
              />
            ))}
            <BudgetSelectionItem
              name='None'
              selected={settings.defaultBudgetId === ''}
              onClick={() => updateSettings({ defaultBudgetId: '' })}
            />
          </List>
        </div>
      )}
    </>
  )
}

type BudgetSelectionItemProps = {
  name: string
  selected: boolean
  onClick: () => void
}

const BudgetSelectionItem = ({ selected, onClick, name }: BudgetSelectionItemProps) => (
  <ListItemButton selected={selected} onClick={onClick}>
    {name}
  </ListItemButton>
)
