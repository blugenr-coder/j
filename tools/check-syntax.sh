#!/usr/bin/env bash
# Parse every module as ESM. `node --check` on a .js file parses it as
# CommonJS and silently misses errors, so each file is checked as .mjs.
set -u
fail=0
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
while IFS= read -r f; do
  cp "$f" "$tmp/mod.mjs"
  if ! out="$(node --check "$tmp/mod.mjs" 2>&1)"; then
    echo "✗ $f"
    echo "$out" | sed -n '2,6p' | sed 's/^/    /'
    fail=1
  fi
done < <(find assets/js tools -name '*.js' -o -name '*.mjs' | sort)
[ "$fail" -eq 0 ] && echo "All modules parse."
exit "$fail"
