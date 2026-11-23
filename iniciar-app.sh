#!/usr/bin/env bash

# Abre o aplicativo por um servidor local. Isso evita que navegadores sandboxed
# bloqueiem o carregamento de styles.css e app.js ao abrir index.html diretamente.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=4173
URL="http://127.0.0.1:${PORT}"

if ! curl --silent --fail --max-time 1 "$URL" >/dev/null 2>&1; then
  python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$APP_DIR" \
    >"${TMPDIR:-/tmp}/controle-rendaextra-server.log" 2>&1 &
fi

xdg-open "$URL"
