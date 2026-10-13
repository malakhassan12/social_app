/* ============================
   Message Status Component
   ============================ */
const MessageStatus = ({ hasBeenRead }: { hasBeenRead: boolean }) => {
  if (!hasBeenRead) {
    // Sent (single check)
    return (
      <svg
        className="h-3 w-3 text-white/70"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l3 3 7-7" />
      </svg>
    );
  }

  // Read (double check, brighter)
  return (
    <svg
      className="h-3 w-3 text-green-200"
      viewBox="0 0 20 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 8l3 3 7-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8l3 3 7-7" />
    </svg>
  );
};

export default MessageStatus;
