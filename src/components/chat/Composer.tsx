import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ChatStrings } from './types';

interface Props {
  strings: ChatStrings;
  /** True while a reply is outstanding: the composer takes no second question. */
  busy: boolean;
  onSend: (question: string) => void;
}

/**
 * The input bar.
 *
 * Enter sends and Shift+Enter opens a line, which is the contract every chat
 * has trained people to expect. The empty-submit path prints the kit's own
 * error plate rather than the browser's validation bubble, and the field grows
 * with the question through `field-sizing-content` instead of a script.
 */
export function Composer({ strings, busy, onSend }: Props) {
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);

  // The reader came here to type. Once a reply lands, give the box back.
  useEffect(() => {
    if (!busy) field.current?.focus();
  }, [busy]);

  const submit = () => {
    const question = value.trim();
    if (!question) {
      setInvalid(true);
      field.current?.focus();
      return;
    }
    setInvalid(false);
    setValue('');
    onSend(question);
  };

  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label className="sr-only" htmlFor="chat-field">
        {strings.composerLabel}
      </label>

      <div className="composer-row flex items-end gap-3">
        <Textarea
          id="chat-field"
          ref={field}
          rows={1}
          value={value}
          disabled={busy}
          placeholder={strings.placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby="chat-hint"
          className="max-h-48 flex-1 overflow-y-auto"
          onChange={(event) => {
            setValue(event.target.value);
            if (invalid) setInvalid(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
        />

        {/* Cut to the box's own resting height, so the two read as one row. */}
        <Button
          type="submit"
          size="icon"
          disabled={busy || value.trim().length === 0}
          aria-label={strings.send}
          className="composer-send size-[var(--composer-h)]"
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>

      <p
        id="chat-hint"
        aria-live="polite"
        className="mt-2.5 flex min-h-5 items-center"
      >
        {invalid ? (
          <span className="plate plate-solid">{strings.error}</span>
        ) : (
          // Keyboard guidance is for people who have a keyboard.
          <span className="legend hidden sm:inline">{strings.hint}</span>
        )}
      </p>
    </form>
  );
}
