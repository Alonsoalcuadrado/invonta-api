# Invonta API

Backend API for Invonta - A Billing SaaS Platform

## Tech Stack

- TypeScript
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT Authentication
- Zod Validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/invonta?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   PORT=3000
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Development

Run the development server:
```bash
npm run dev
```

## Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new tenant and user
  ```json
  {
    "tenantName": "Company Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### User

- `GET /api/me` - Get current user information (requires authentication)
  - Headers: `Authorization: Bearer <token>` 