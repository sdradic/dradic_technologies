import { useActionState } from "react";
import { Dropdown } from "./Dropdown";

interface SimpleFormField {
  label: string;
  type: string;
  id: string;
  additionalProps?: {
    options?: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
  };
}

export default function SimpleForm({
  title,
  description,
  fields,
  action,
  onCancel,
}: {
  title: string;
  description: string;
  fields: SimpleFormField[];
  action: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, submitAction] = useActionState(
    async (prevState: { error?: string } | null, formData: FormData) => {
      const data = Object.fromEntries(formData);
      try {
        await action(data);
        return null;
      } catch (error) {
        return { error: "Failed to submit form" };
      }
    },
    null,
  );

  const renderField = (field: SimpleFormField) => {
    switch (field.type) {
      case "number":
        return (
          <input
            className="w-full"
            type="number"
            id={field.id}
            onChange={(e) => field.additionalProps?.onChange(e.target.value)}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            options={field.additionalProps?.options || []}
            value={field.additionalProps?.value || ""}
            onChange={field.additionalProps?.onChange || (() => {})}
          />
        );
      default:
        return <input type="text" id={field.id} />;
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 w-full">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{description}</p>
        <form
          className="flex flex-col justify-center items-center gap-4 mt-4"
          action={submitAction}
        >
          {fields.map((field) => (
            <div className="w-full " key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              {renderField(field)}
            </div>
          ))}
          <div className="flex gap-4 w-full justify-end">
            <button
              className="btn-secondary max-w-24"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className="btn-primary max-w-24" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
