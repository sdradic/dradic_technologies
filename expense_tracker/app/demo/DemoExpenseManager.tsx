import { useDemoData } from "./useDemoData";
import type {
  ExpenseCreate,
  ExpenseWithDetails,
  ExpenseItem,
} from "../modules/types";

interface DemoExpenseManagerProps {
  children: (props: {
    guestExpenses: ExpenseWithDetails[];
    guestExpenseItems: ExpenseItem[];
    addDemoExpense: (expenseData: ExpenseCreate) => ExpenseWithDetails;
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
