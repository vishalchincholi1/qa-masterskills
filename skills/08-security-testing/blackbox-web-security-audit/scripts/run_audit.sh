#!/usr/bin/env bash
# Passive evidence collection. Run in Git Bash. One request per URL, rate-limited.
# Reads ../config.json for domains, paths, user agent and rate limit.
# Usage: bash scripts/run_audit.sh   -> writes into ./evidence/<domain>/
set -u

CFG="${1:-config.json}"
if [ ! -f "$CFG" ]; then echo "config not found: $CFG (run from project root)"; exit 1; fi

# --- read config with node (always available in this toolchain) ---
read_cfg() { node -e "const c=require('./$CFG');process.stdout.write($1)"; }
UA=$(read_cfg "c.userAgent")
RATE=$(read_cfg "String(c.rateLimitSeconds||1)")
DOMAINS=$(read_cfg "c.domains.join(' ')")
PATHS=$(read_cfg "c.paths.join(' ')")

echo "User-Agent: $UA"
echo "Rate limit: ${RATE}s"
echo "Domains: $DOMAINS"

for d in $DOMAINS; do
  out="evidence/$d"; mkdir -p "$out"
  # GET (not HEAD): some origins answer HEAD differently; we need headers + full body
  # for form/script/SRI parsing.
  for p in $PATHS; do
    f=$(echo "$p" | tr '/.' '__')
    curl -s -L -A "$UA" -D "$out/hdr$f.txt" -o "$out/body$f.html" -w "%{http_code} $p\n" "https://$d$p"
    sleep "$RATE"
  done
  curl -sI -A "$UA" "http://$d/" > "$out/http_redirect.txt"
  echo | openssl s_client -connect "$d:443" -servername "$d" 2>/dev/null \
    | grep -E "Protocol|Cipher is|Verify return" > "$out/tls.txt"
  nslookup -type=TXT "_dmarc.$d" > "$out/dmarc.txt" 2>&1
  nslookup -type=TXT "$d" > "$out/spf.txt" 2>&1
done
echo "Done. Next: npm run consent   (browser cookies + pre-consent trackers)"
