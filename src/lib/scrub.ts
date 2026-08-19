/**
 * Keep credentials out of the log.
 *
 * A client library that rejects a malformed key puts the key it was given into
 * the error message, and a log is a less private place than the environment the
 * key came from. Anything on its way to `console` goes through here first.
 *
 * This redacts by shape, so the failure mode is a key shape nobody thought of
 * rather than a key shape that changed. Add a pattern when a new kind of
 * credential enters the request path.
 */
export function scrub(text: string): string {
  return text
    .replace(/sb_(secret|publishable)_[\w-]+/g, 'sb_$1_[redacted]')
    .replace(/sk-or-v\d+-[\w-]+/g, 'sk-or-[redacted]')
    .replace(/eyJ[\w-]*\.[\w-]*\.[\w-]*/g, '[redacted-jwt]');
}
