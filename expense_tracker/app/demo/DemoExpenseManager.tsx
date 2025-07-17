import { useDemoData } from "./useDemoData";
import type { ExpenseCreate } from "../modules/types";

interface DemoExpenseManagerProps {
  children: (props: {
    guestExpenses: any[];
    guestExpenseItems: any[];
    addDemoExpense: (expenseData: ExpenseCreate) => any;
    updateDemoExpense: (expenseId: string, expenseData: ExpenseCreate) => void;
    deleteDemoExpense: (expenseId: string) => void;
  }) => React.ReactNode;
}

export function DemoExpenseManager({ children }: DemoExpenseManagerProps) {
  const {
    guestExpenses,
    guestExpenseItems,
    addDemoExpense,
    updateDemoExpense,
    deleteDemoExpense,
  } = useDemoData();

  return (
    <>
      {children({
        guestExpenses,
        guestExpenseItems,
        addDemoExpense,
        updateDemoExpense,
        deleteDemoExpense,
      })}
    </>
  );
}
