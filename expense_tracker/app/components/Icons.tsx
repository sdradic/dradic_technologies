interface IconProps {
  className?: string;
  [key: string]: unknown;
}

export const SunIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
};

export const MoonIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
};

export const TallyUpLogo = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 130 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M130 69C130 104.899 100.899 134 65 134C29.1015 134 0 104.899 0 69C0 33.1015 29.1015 4 65 4C100.899 4 130 33.1015 130 69Z" />
      <path
        d="M94.016 59.152H88.736L85.952 47.632H68.576V97.84L76.64 100.72V106H52.256V100.72L60.32 97.84V47.632H42.944L40.16 59.152H34.88V40.72H94.016V59.152Z"
        fill="white"
      />
    </svg>
  );
};

export const DashboardIconOutline = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M5.01562 10H7.01562C9.01562 10 10.0156 9 10.0156 7V5C10.0156 3 9.01562 2 7.01562 2H5.01562C3.01562 2 2.01562 3 2.01562 5V7C2.01562 9 3.01562 10 5.01562 10Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0156 10H19.0156C21.0156 10 22.0156 9 22.0156 7V5C22.0156 3 21.0156 2 19.0156 2H17.0156C15.0156 2 14.0156 3 14.0156 5V7C14.0156 9 15.0156 10 17.0156 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0156 22H19.0156C21.0156 22 22.0156 21 22.0156 19V17C22.0156 15 21.0156 14 19.0156 14H17.0156C15.0156 14 14.0156 15 14.0156 17V19C14.0156 21 15.0156 22 17.0156 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.01562 22H7.01562C9.01562 22 10.0156 21 10.0156 19V17C10.0156 15 9.01562 14 7.01562 14H5.01562C3.01562 14 2.01562 15 2.01562 17V19C2.01562 21 3.01562 22 5.01562 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ExpensesIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3.00977 11.22V15.71C3.00977 20.2 4.80977 22 9.29977 22H14.6898C19.1798 22 20.9798 20.2 20.9798 15.71V11.22"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12C13.83 12 15.18 10.51 15 8.68L14.34 2H9.66999L8.99999 8.68C8.81999 10.51 10.17 12 12 12Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3098 12C20.3298 12 21.8098 10.36 21.6098 8.35L21.3298 5.6C20.9698 3 19.9698 2 17.3498 2H14.2998L14.9998 9.01C15.1698 10.66 16.6598 12 18.3098 12Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.63988 12C7.28988 12 8.77988 10.66 8.93988 9.01L9.15988 6.8L9.63988 2H6.58988C3.96988 2 2.96988 3 2.60988 5.6L2.33988 8.35C2.13988 10.36 3.61988 12 5.63988 12Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17C10.33 17 9.5 17.83 9.5 19.5V22H14.5V19.5C14.5 17.83 13.67 17 12 17Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const IncomesIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2.01562 2V19C2.01562 20.66 3.35563 22 5.01562 22H22.0156"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.01562 17L9.60563 11.64C10.3656 10.76 11.7156 10.7 12.5356 11.53L13.4856 12.48C14.3056 13.3 15.6556 13.25 16.4156 12.37L21.0156 7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SettingsIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2562 9.77282 19.9815C9.58052 19.7068 9.3119 19.4925 9 19.36C8.69838 19.2269 8.36381 19.1872 8.03941 19.246C7.71502 19.3048 7.41568 19.4595 7.18 19.69L7.12 19.75C6.93425 19.936 6.71368 20.0835 6.47088 20.1841C6.22808 20.2848 5.96783 20.3366 5.705 20.3366C5.44217 20.3366 5.18192 20.2848 4.93912 20.1841C4.69632 20.0835 4.47575 19.936 4.29 19.75C4.10405 19.5643 3.95653 19.3437 3.85588 19.1009C3.75523 18.8581 3.70343 18.5978 3.70343 18.335C3.70343 18.0722 3.75523 17.8119 3.85588 17.5691C3.95653 17.3263 4.10405 17.1057 4.29 16.92L4.35 16.86C4.58054 16.6243 4.73523 16.325 4.79402 16.0006C4.85282 15.6762 4.81312 15.3416 4.68 15.04C4.55324 14.7442 4.34276 14.492 4.07447 14.3143C3.80618 14.1366 3.49179 14.0413 3.17 14.04H3C2.46957 14.04 1.96086 13.8293 1.58579 13.4542C1.21071 13.0791 1 12.5704 1 12.04C1 11.5096 1.21071 11.0009 1.58579 10.6258C1.96086 10.2507 2.46957 10.04 3 10.04H3.09C3.42099 10.0323 3.74381 9.92512 4.01847 9.73282C4.29314 9.54052 4.50748 9.2719 4.64 8.96C4.77312 8.65838 4.81282 8.32381 4.75402 7.99941C4.69523 7.67502 4.54054 7.37568 4.31 7.14L4.25 7.08C4.06405 6.89425 3.91653 6.67368 3.81588 6.43088C3.71523 6.18808 3.66343 5.92783 3.66343 5.665C3.66343 5.40217 3.71523 5.14192 3.81588 4.89912C3.91653 4.65632 4.06405 4.43575 4.25 4.25C4.43575 4.06405 4.65632 3.91653 4.89912 3.81588C5.14192 3.71523 5.40217 3.66343 5.665 3.66343C5.92783 3.66343 6.18808 3.71523 6.43088 3.81588C6.67368 3.91653 6.89425 4.06405 7.08 4.25L7.14 4.31C7.37568 4.54054 7.67502 4.69523 8.00041 4.75402C8.32581 4.81282 8.66038 4.77312 8.962 4.64H9C9.29577 4.51324 9.54802 4.30276 9.72568 4.03447C9.90335 3.76618 9.99868 3.45179 10 3.13V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.71402C16.285 4.65523 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.96041C19.1472 8.28581 19.1869 8.62038 19.32 8.922V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72568C20.1938 9.90335 20.5082 9.99868 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DailyIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 2V5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.08997H20.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6947 13.7H15.7037"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6947 16.7H15.7037"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9955 13.7H12.0045"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9955 16.7H12.0045"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.29431 13.7H8.30329"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.29431 16.7H8.30329"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MonthlyIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8 2V5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.08997H20.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.2V17.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 15.2H9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CategoriesIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M10 3H3V10H10V3Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 3H14V10H21V3Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 14H14V21H21V14Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14H3V21H10V14Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AboutIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 16V12"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8H12.01"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronRightIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.07996"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronLeftIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.07996"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19.92 8.94995L13.4 15.47C12.63 16.24 11.37 16.24 10.6 15.47L4.08 8.94995"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ChevronUpIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M19.92 15.05L13.4 8.53001C12.63 7.76001 11.37 7.76001 10.6 8.53001L4.08 15.05"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PlusIconOutline = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M12 5V19M5 12H19"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MenuIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3 7H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17H21"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const XIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M18 6L6 18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LogoutIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M15.24 22.27H15.11C10.67 22.27 8.53002 20.52 8.16002 16.6C8.12002 16.19 8.42002 15.82 8.84002 15.78C9.24002 15.74 9.62002 16.05 9.66002 16.46C9.95002 19.6 11.43 20.77 15.12 20.77H15.25C19.32 20.77 20.76 19.33 20.76 15.26V8.73998C20.76 4.66998 19.32 3.22998 15.25 3.22998H15.12C11.41 3.22998 9.93002 4.41998 9.66002 7.61998C9.61002 8.02998 9.26002 8.33998 8.84002 8.29998C8.42002 8.26998 8.12001 7.89998 8.15001 7.48998C8.49001 3.50998 10.64 1.72998 15.11 1.72998H15.24C20.15 1.72998 22.25 3.82998 22.25 8.73998V15.26C22.25 20.17 20.15 22.27 15.24 22.27Z"
        strokeWidth="0.1"
      />
      <path
        d="M15 12.75H3.62C3.21 12.75 2.87 12.41 2.87 12C2.87 11.59 3.21 11.25 3.62 11.25H15C15.41 11.25 15.75 11.59 15.75 12C15.75 12.41 15.41 12.75 15 12.75Z"
        strokeWidth="0.1"
      />
      <path
        d="M5.85 16.1C5.66 16.1 5.47 16.03 5.32 15.88L1.97 12.53C1.68 12.24 1.68 11.76 1.97 11.47L5.32 8.11997C5.61 7.82997 6.09 7.82997 6.38 8.11997C6.67 8.40997 6.67 8.88997 6.38 9.17997L3.56 12L6.38 14.82C6.67 15.11 6.67 15.59 6.38 15.88C6.24 16.03 6.04 16.1 5.85 16.1Z"
        strokeWidth="0.1"
      />
    </svg>
  );
};

export const ErrorXIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ChevronWithTransform = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
};

export const TrashIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8499 9.13989L18.1999 19.2099C18.0899 20.7799 17.9999 21.9999 15.2099 21.9999H8.7899C5.9999 21.9999 5.9099 20.7799 5.7999 19.2099L5.1499 9.13989"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3301 16.5H13.6601"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.5H14.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const RightArrowIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
};

export const LeftArrowIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
};

export const CalendarIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
};

export const ReloadIcon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M1 4V10H7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23 20V14H17" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DradicTechLogo = ({ className, ...props }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 153 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M130.802 76.3752L103.106 123.999L48.57 124.136L21.7185 76.6691L49.414 29.0448L103.949 28.9078L130.802 76.3752Z" />
      <line x1="40.5735" y1="108.629" x2="67.379" y2="83.456" />
      <line x1="67" y1="84" x2="88" y2="84" />
      <circle cx="96" cy="85" r="8" />
      <line x1="64.6606" y1="47.9" x2="48.4439" y2="61" />
      <line x1="64" y1="29" x2="64" y2="49" />
      <circle
        cx="45.598"
        cy="67.598"
        r="8"
        transform="rotate(176.462 45.598 67.598)"
      />
      <line x1="97.4635" y1="39.3656" x2="81.4612" y2="52.488" />
      <line x1="95.9999" y1="40" x2="110" y2="40" />
      <circle
        cx="78.598"
        cy="59.598"
        r="8"
        transform="rotate(176.462 78.598 59.598)"
      />
      <line x1="81.0001" y1="103" x2="115" y2="103" />
      <line x1="73" y1="124" x2="73.0001" y2="112" />
      <path d="M73.0917 112.583C68.6818 112.855 64.8859 109.502 64.6133 105.092C64.3406 100.682 67.6945 96.8859 72.1044 96.6133C76.5142 96.3406 80.3101 99.6945 80.5828 104.104C80.8554 108.514 77.5015 112.31 73.0917 112.583Z" />
    </svg>
  );
};
