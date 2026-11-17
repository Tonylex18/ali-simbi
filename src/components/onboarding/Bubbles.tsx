export function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-rise justify-start">
      <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-2.5 text-[15px] leading-relaxed sm:max-w-[78%]">
        {children}
      </div>
    </div>
  );
}

export function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex animate-rise justify-end">
      <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-forest-900 px-4 py-2.5 text-[15px] leading-relaxed text-white sm:max-w-[78%]">
        {children}
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-rise justify-start" aria-hidden="true">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3.5">
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
        <span className="typing-dot h-2 w-2 rounded-full bg-muted" />
      </div>
    </div>
  );
}
