interface HeaderButtonProps {
  onButtonClick: () => void | Promise<void>;
  isLoading?: boolean;
  loadingText?: string;
  buttonText?: string;
  className?: string;
  buttonIcon?: React.ReactNode;
}

export function HeaderButton({
  onButtonClick,
  isLoading = false,
  loadingText = "",
  buttonText = "",
  className = "",
  buttonIcon,
}: HeaderButtonProps) {
  const handleClick = async () => {
    if (!isLoading) {
      await onButtonClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} flex items-center gap-2 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {buttonIcon && buttonIcon}
      {isLoading ? loadingText : buttonText}
    </button>
  );
}
