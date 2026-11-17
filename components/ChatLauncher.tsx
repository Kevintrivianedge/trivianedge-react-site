import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare } from 'lucide-react';

type ChatPanel = typeof import('./ChatSidebar').default;

export default function ChatLauncher() {
  const [Panel, setPanel] = useState<ChatPanel | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  const close = useCallback(() => {
    restoreFocus.current = true;
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen && restoreFocus.current) {
      restoreFocus.current = false;
      launcher.current?.focus();
    }
  }, [isOpen]);

  const open = async () => {
    if (isLoading) return;
    if (Panel) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setLoadFailed(false);
    try {
      const { default: ChatSidebar } = await import('./ChatSidebar');
      setPanel(() => ChatSidebar);
      setIsOpen(true);
    } catch {
      setLoadFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        ref={launcher}
        type="button"
        hidden={isOpen}
        onClick={open}
        aria-label="Open AI Assistant"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-disabled={isLoading}
        className="group fixed bottom-6 right-4 z-[150] rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 p-4 text-white shadow-[0_0_20px_rgba(64,201,200,0.5)] transition-transform hover:scale-105 sm:bottom-10 sm:right-10"
      >
        <MessageSquare aria-hidden="true" className="h-6 w-6" />
        <span className="pointer-events-none absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1 text-xs font-bold text-text opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          AI Assistant
        </span>
      </button>
      <div role="status">
        {(isLoading || loadFailed) && (
          <p className="fixed bottom-24 right-4 z-[150] max-w-64 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text sm:bottom-28 sm:right-10">
            {isLoading ? 'Opening AI Assistant…' : 'Could not load the AI Assistant. Try opening it again.'}
          </p>
        )}
      </div>
      {Panel && <Panel isOpen={isOpen} onClose={close} />}
    </>
  );
}
