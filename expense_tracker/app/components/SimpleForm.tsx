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
}: {
  title: string;
  description: string;
  fields: SimpleFormField[];
  action: (data: any) => Promise<void>;
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
        return <input type="number" id={field.id} />;
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
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-500">{description}</p>
        <form action={submitAction}>
          {fields.map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              {renderField(field)}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
