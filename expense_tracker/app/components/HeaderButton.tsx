interface HeaderButtonProps {
  onButtonClick: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  buttonText?: string;
  className?: string;
  buttonIcon?: React.ReactNode;
}

export function HeaderButton({
  onButtonClick,
  isLoading = false,
  disabled = false,
  loadingText = "",
  buttonText = "",
  className = "",
  buttonIcon,
}: HeaderButtonProps) {
  const handleClick = async () => {
    if (!isLoading && !disabled) {
      await onButtonClick();
    }
  };

  const isButtonDisabled = isLoading || disabled;

  return (
    <button
      onClick={handleClick}
      disabled={isButtonDisabled}
      className={`${className} flex items-center gap-2 cursor-pointer ${
        isButtonDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {buttonIcon && buttonIcon}
      {isLoading ? loadingText : buttonText}
    </button>
  );
}
