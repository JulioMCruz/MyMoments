# Database Setup Guide

This project uses PostgreSQL with Prisma ORM to manage user data.

## Schema Overview

The database schema includes:

- **User**: Stores user information with wallet addresses and verification status
  - `id`: Unique identifier (UUID)
  - `walletAddress`: Ethereum wallet address (unique)
  - `isVerified`: Boolean flag indicating verification status
  - `createdAt`: Timestamp of record creation
  - `updatedAt`: Timestamp of last update

## Setup Instructions

1. Ensure your PostgreSQL database is running and accessible
2. Verify the connection string in your `.env` file:
   ```
   NEXT_PUBLIC_POSTGRESQL_URL="postgresql://username:password@host:port/database"
   ```

3. Run database setup:

   **Option 1**: Using Prisma DB Push (recommended for development)
   ```bash
   npx prisma db push
   ```

   **Option 2**: Using Prisma Migrations (recommended for production)
   ```bash
   npx prisma migrate dev --name init
   ```

   Note: The migration option requires database user with permissions to create databases.

## Troubleshooting

If you encounter permission errors like the following:

```
Error: P3014 - Prisma Migrate could not create the shadow database. 
Please make sure the database user has permission to create databases.
```

Options:
1. Use `prisma db push` instead of migrations
2. Grant your database user CREATE DATABASE permissions
3. Contact your database administrator for assistance

## Development Workflow

During development:
1. Update the schema in `prisma/schema.prisma`
2. Run `npx prisma db push` to update the database
3. Run `npx prisma generate` to update the Prisma client

## Database Reset

To reset your database:
```bash
npx prisma db push --force-reset
```
Warning: This will delete all data in your database! 