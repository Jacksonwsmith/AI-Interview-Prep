export default function LogoMark() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#cdbca6] bg-[#fffaf2] text-[#261f19] shadow-[0_12px_28px_-22px_rgba(38,31,25,0.75)]"
    >
      <svg
        viewBox="0 0 40 40"
        className="h-7 w-7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 27V13M9 20H19M19 13V27"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.5 15.5C28.9 13.8 26.8 13 24.7 13C20.8 13 18 15.9 18 20C18 24.1 20.9 27 24.9 27C27 27 29.1 26.2 30.6 24.8V20.8H25.3"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 11.2L20 7L32 11.2L20 15.4L8 11.2Z"
          fill="#ead7c5"
          stroke="#8f3e2e"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M30.5 12.2V16.8"
          stroke="#8f3e2e"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="30.5" cy="18.6" r="1.4" fill="#8f3e2e" />
      </svg>
    </span>
  );
}
