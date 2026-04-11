#!/usr/bin/env bash
set -euo pipefail

find . -name "._*" -delete
find . -name "__pycache__" -type d -prune -exec rm -rf {} +

exec "$@"
