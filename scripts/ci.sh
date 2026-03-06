#!/usr/bin/env bash
set -euo pipefail

npm test
npm run test:e2e
