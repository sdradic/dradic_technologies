import { Dropdown } from "./Dropdown";

export function HeaderDropdown({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  return <Dropdown options={options} value={value} onChange={onChange} />;
}
