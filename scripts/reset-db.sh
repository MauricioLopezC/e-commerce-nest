#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting database reset and seed..."

# Run Prisma migrate reset.
# --force is used to skip the confirmation prompt in non-interactive environments.
npx prisma migrate reset --force

# Run Prisma db seed.
# TODO: Use database script seed instead

echo "Database reset and seed completed successfully."
