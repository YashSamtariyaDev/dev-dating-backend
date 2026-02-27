#!/bin/bash
# Reset DB (truncate all tables) and run fresh migrations
# Usage: ./scripts/reset-and-migrate.sh

set -e

echo "🔧 Truncating all tables..."
mysql -u root -p dev_dating < scripts/truncate-all.sql

echo "🚀 Running TypeORM migrations..."
npm run migration:run

echo "✅ Done. Database is clean and migrated."
