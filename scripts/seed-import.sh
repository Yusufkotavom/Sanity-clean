#!/bin/bash
# DEVK Studio — Seed Import Script
# Imports the starter dataset into a fresh Sanity project.
#
# Usage:
#   ./scripts/seed-import.sh <project-id> <dataset>
#
# Example:
#   ./scripts/seed-import.sh ww3aejg2 production
#
# Prerequisites:
#   - Sanity CLI installed and logged in (sanity login)
#   - Target dataset must exist (sanity dataset create <name>)

set -e

PROJECT_ID="${1:-ww3aejg2}"
DATASET="${2:-production}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ARCHIVE="$SCRIPT_DIR/seed-dataset.tar.gz"

if [ ! -f "$ARCHIVE" ]; then
  echo "❌ Seed archive not found: $ARCHIVE"
  echo "   Run the export first or ensure seed-dataset.tar.gz is in scripts/"
  exit 1
fi

echo "🌱 DEVK Studio — Seed Import"
echo "   Project: $PROJECT_ID"
echo "   Dataset: $DATASET"
echo "   Archive: $ARCHIVE"
echo ""

read -p "This will import seed data into '$DATASET'. Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Importing..."
npx sanity dataset import "$ARCHIVE" \
  --dataset "$DATASET" \
  --project-id "$PROJECT_ID" \
  --replace \
  --allow-failing-assets \
  --allow-assets-in-different-dataset

echo ""
echo "✅ Seed import complete!"
echo "   Your dataset '$DATASET' now has all DEVK Studio starter content."
echo ""
echo "Next steps:"
echo "  1. Update .env with your project ID and dataset name"
echo "  2. Set NEXT_PUBLIC_SITE_URL to your deployment URL"
echo "  3. Run 'pnpm build' to verify"
