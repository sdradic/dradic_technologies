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
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
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
