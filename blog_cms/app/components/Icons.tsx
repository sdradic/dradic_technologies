export const TallyUpLogo = ({ className, ...props }: any) => {
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

export const ArrowUpIcon = ({ className, ...props }: any) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M7 14L12 8L17 14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MenuIcon = ({ className, ...props }: any) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {props.isSidebarOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
};

export const ChipSVG = ({ className, ...props }: any) => {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect
        x="40"
        y="40"
        width="140"
        height="140"
        rx="20"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="8"
      />
      <rect x="80" y="80" width="60" height="60" rx="12" fill="#16B6C6" />
      <circle cx="110" cy="110" r="10" fill="#2ED9E7" />
      {/* Pins */}
      <line x1="110" y1="10" x2="110" y2="40" stroke="#fff" strokeWidth="8" />
      <circle
        cx="110"
        cy="10"
        r="8"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="4"
      />
      <line x1="110" y1="180" x2="110" y2="210" stroke="#fff" strokeWidth="8" />
      <circle
        cx="110"
        cy="210"
        r="8"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="4"
      />
      <line x1="40" y1="110" x2="10" y2="110" stroke="#fff" strokeWidth="8" />
      <circle
        cx="10"
        cy="110"
        r="8"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="4"
      />
      <line x1="180" y1="110" x2="210" y2="110" stroke="#fff" strokeWidth="8" />
      <circle
        cx="210"
        cy="110"
        r="8"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="4"
      />
      {/* More pins for corners */}
      <line x1="60" y1="60" x2="35" y2="35" stroke="#fff" strokeWidth="6" />
      <circle
        cx="35"
        cy="35"
        r="6"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="3"
      />
      <line x1="160" y1="60" x2="185" y2="35" stroke="#fff" strokeWidth="6" />
      <circle
        cx="185"
        cy="35"
        r="6"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="3"
      />
      <line x1="60" y1="160" x2="35" y2="185" stroke="#fff" strokeWidth="6" />
      <circle
        cx="35"
        cy="185"
        r="6"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="3"
      />
      <line x1="160" y1="160" x2="185" y2="185" stroke="#fff" strokeWidth="6" />
      <circle
        cx="185"
        cy="185"
        r="6"
        fill="#fff"
        stroke="#16B6C6"
        strokeWidth="3"
      />
    </svg>
  );
};

export const RefreshIcon = ({ className, ...props }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const ChevronLeftIcon = ({ className, ...props }: any) => {
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

export const DradicTechLogo = ({ className, ...props }: any) => {
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

export const SearchIcon = ({ className, ...props }: any) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22L20 20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SunIcon = ({ className, ...props }: any) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
};

export const MoonIcon = ({ className, ...props }: any) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={className} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
};

export const XIcon = ({ className, ...props }: any) => {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const FullScreenIcon = ({ className, ...props }: any) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  );
};

export const TrashIcon = ({ className, ...props }: any) => {
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
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8499 9.13989L18.1999 19.2099C18.0899 20.7799 17.9999 21.9999 15.2099 21.9999H8.7899C5.9999 21.9999 5.9099 20.7799 5.7999 19.2099L5.1499 9.13989"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3301 16.5H13.6601"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 12.5H14.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export const SaveIcon = ({ className, ...props }: any) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M8.00001 22H16C20.02 22 20.74 20.39 20.95 18.43L21.7 10.43C21.97 7.99 21.27 6 17 6H7.00001C2.73001 6 2.03001 7.99 2.30001 10.43L3.05001 18.43C3.26001 20.39 3.98001 22 8.00001 22Z"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V5.2C8 3.43 8 2 11.2 2H12.8C16 2 16 3.43 16 5.2V6"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 13V14C14 14.01 14 14.01 14 14.02C14 15.11 13.99 16 12 16C10.02 16 10 15.12 10 14.03V13C10 12 10 12 11 12H13C14 12 14 12 14 13Z"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.65 11C19.34 12.68 16.7 13.68 14 14.02"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.62 11.27C4.87 12.81 7.41 13.74 10 14.03"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
