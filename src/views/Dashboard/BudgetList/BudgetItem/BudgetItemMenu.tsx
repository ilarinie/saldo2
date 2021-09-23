interface BudgetItemMenuProps {
  actions: Array<{
    label: string;
    action: (label: string) => void;
  }>;
}

export const BudgetItemMenu = ({ actions }: BudgetItemMenuProps) => {
  return <div>BudgetItemMenu</div>;
};
