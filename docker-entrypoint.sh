#!/bin/bash
set -e

if [[ -z "${CHAMBER_TARGETS}" ]]; then
  echo "[chamber] Running without chamber"
  export NO_CHAMBER=1
  exec "$@"
else
  echo "[chamber] Running chamber. Targeting: ${CHAMBER_TARGETS}"
  exec /bin/chamber exec ${CHAMBER_TARGETS} -- "$@"
fi
