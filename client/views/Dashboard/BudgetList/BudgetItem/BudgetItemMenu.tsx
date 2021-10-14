interface BudgetItemMenuProps {
  actions: Array<{
    label: string
    action: (label: string) => void
  }>
}

export const BudgetItemMenu = ({}: BudgetItemMenuProps) => {
  return <div>BudgetItemMenu</div>
}
