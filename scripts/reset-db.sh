#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🔄 Starting database reset and seed from SQL dump..."

# 1. Reset the database (wipes all tables and reapplies migrations)
npx prisma migrate reset --force

# 2. Clean the SQL dump file
# prisma db execute does not support psql meta-commands (lines starting with \)
echo "🧹 Cleaning psql meta-commands from seed.sql..."
grep -v "^\\\\" ./prisma/seed.sql >./prisma/seed.cleaned.sql

# 3. Execute the cleaned SQL dump file
# We don't use --schema as it is deprecated
echo "📥 Loading cleaned SQL dump..."
npx prisma db execute --file ./prisma/seed.cleaned.sql

# 4. Remove the temporary cleaned file
rm ./prisma/seed.cleaned.sql

echo "✅ Database reset and seed completed successfully."
