import { Skeleton } from "@/components/ui/skeleton";

const incomingMessages = [
  { avatarWidth: "w-8", firstLine: "w-40", secondLine: "w-24" },
  { avatarWidth: "w-8", firstLine: "w-56", secondLine: "w-32" },
  { avatarWidth: "w-8", firstLine: "w-32", secondLine: "" },
];

const outgoingMessages = [
  { firstLine: "w-48", secondLine: "w-24" },
  { firstLine: "w-36", secondLine: "" },
];

export default function ChatSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading conversation"
      className="flex h-full min-h-0 w-full flex-col"
    >
      <div
        aria-hidden="true"
        className="flex min-h-0 flex-1 flex-col justify-end gap-5 overflow-hidden px-3 pb-4 sm:px-5"
      >
        <div className="flex justify-center py-2">
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {incomingMessages.map((message, index) => (
          <div key={`incoming-${index}`} className="flex items-end gap-2">
            <Skeleton className={`h-8 ${message.avatarWidth} shrink-0 rounded-full`} />
            <div className="flex max-w-[75%] flex-col gap-1.5 rounded-2xl rounded-bl-md bg-muted/60 p-3">
              <Skeleton className={`h-3 ${message.firstLine}`} />
              {message.secondLine && (
                <Skeleton className={`h-3 ${message.secondLine}`} />
              )}
            </div>
          </div>
        ))}

        {outgoingMessages.map((message, index) => (
          <div key={`outgoing-${index}`} className="flex justify-end">
            <div className="flex max-w-[75%] flex-col gap-1.5 rounded-2xl rounded-br-md bg-primary/10 p-3">
              <Skeleton className={`h-3 ${message.firstLine}`} />
              {message.secondLine && (
                <Skeleton className={`h-3 ${message.secondLine}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="mx-2 mb-2 mt-2 shrink-0 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-lg shadow-black/5"
      >
        <div className="flex items-end gap-2 rounded-xl border border-border/60 p-2">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
        </div>
      </div>

      <span className="sr-only">Loading conversation…</span>
    </div>
  );
}
