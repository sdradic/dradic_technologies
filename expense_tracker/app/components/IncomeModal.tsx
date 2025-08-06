import { useState } from "react";
import SimpleForm from "./SimpleForm";
import { SimpleModal } from "./SimpleModal";
import type { Income } from "~/modules/types";

const CURRENCY_OPTIONS = [
  { value: "CLP", label: "CLP" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

const INCOME_CATEGORY_OPTIONS = [
  { value: "salary", label: "Salary" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investment" },
  { value: "business", label: "Business" },
  { value: "other", label: "Other" },
];

export default function IncomeModal({
  isModalOpen,
  setIsModalOpen,
  selectedIncome,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  selectedIncome: Income | null;
}) {
  // For demonstration, we use local state for controlled fields.
  // In a real app, you might want to lift this state up or use a form library.
  const [form, setForm] = useState({
    sourceId: selectedIncome?.source_id || "",
    amount: selectedIncome?.amount?.toString() || "",
    currency: selectedIncome?.currency || "CLP",
    date: selectedIncome?.date || new Date().toISOString().split("T")[0],
    description: selectedIncome?.description || "",
  });

  const fields = [
    {
      label: "Source ID",
      type: "text",
      id: "sourceId",
      additionalProps: {
        value: form.sourceId,
        onChange: (value: string) =>
          setForm((prev) => ({ ...prev, sourceId: value })),
      },
    },
    {
      label: "Amount",
      type: "number",
      id: "amount",
      additionalProps: {
        value: form.amount,
        onChange: (value: string) =>
          setForm((prev) => ({ ...prev, amount: value })),
      },
    },
    {
      label: "Currency",
      type: "dropdown",
      id: "currency",
      additionalProps: {
        options: CURRENCY_OPTIONS,
        value: form.currency,
        onChange: (value: string) =>
          setForm((prev) => ({ ...prev, currency: value })),
      },
    },
    {
      label: "Date",
      type: "text",
      id: "date",
      additionalProps: {
        value: form.date,
        onChange: (value: string) =>
          setForm((prev) => ({ ...prev, date: value })),
      },
    },
    {
      label: "Description",
      type: "text",
      id: "description",
      additionalProps: {
        value: form.description,
        onChange: (value: string) =>
          setForm((prev) => ({ ...prev, description: value })),
      },
    },
  ];

  const handleAction = async (data: any) => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SimpleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-full max-w-2xl"
      >
        <SimpleForm
          title={selectedIncome ? "Edit Income" : "Add Income"}
          description={
            selectedIncome
              ? "Edit the income record"
              : "Add a new income record"
          }
          fields={fields}
          action={handleAction}
        />
      </SimpleModal>
    </>
  );
}
