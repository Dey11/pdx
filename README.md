# PDX Project

## Overview

PDX is a Next.js application with TypeScript, Prisma, and various integrations for authentication, payments, storage, and more. This README provides detailed setup instructions for developers and collaborators.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database ORM**: Prisma Accelerate with NeonDB PostgreSQL
- **Authentication**: AuthJS with Google OAuth and magic links with Resend
- **Styling**: Tailwind CSS with shadcn/ui components
- **Payment Processing**: Dodo Payments
- **Storage**: Cloudflare R2
- **Queue & Rate Limiting**: Upstash Redis
- **AI Integration**: Google Gemini API
- **Analytics**: PostHog

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pdx
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   - Copy `example.env` to `.env`
   - Fill in the required values (see Environment Variables section)

4. Set up the database:

   ```bash
   pnpm prisma db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Copy `example.env` to `.env` and fill in the following values:

### Authentication (AuthJS)

- `AUTH_SECRET`: Secret key for AuthJS encryption
- `AUTH_GOOGLE_ID`: Google OAuth client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret
- `AUTH_TRUST_HOST`: Set to `true` for proper callback URL construction

### Email

- `AUTH_RESEND_KEY`: API key for Resend email service

### Database

- `DIRECT_DATABASE_URL`: Direct connection URL to NeonDB PostgreSQL database
- `DATABASE_URL`: Prisma Accelerate connection URL for pooling

### AI Integration

- `GOOGLE_API_KEY`: API key for Google Gemini

### Redis Queue

- `REDIS_HOST`: Upstash Redis host
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password

### Rate Limiting

- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST API token

### Storage

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID
- `CLOUDFLARE_ACCESS_KEY_ID`: Cloudflare R2 access key ID
- `CLOUDFLARE_SECRET_ACCESS_KEY`: Cloudflare R2 secret access key
- `CLOUDFLARE_TOKEN_VALUE`: Cloudflare API token
- `BUCKET_NAME`: R2 bucket name (default: "test")

### Payments

- `DODO_PAYMENTS_API_KEY`: Dodo Payments API key
- `WEBHOOK_SECRET`: Webhook secret for payment notifications
- `STATIC_PAYMENT_LINK`: Default payment checkout URL template

### Administration

- `ADMIN_KEY`: Secret key for admin access

### Analytics

- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog instance URL
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog API key

## Project Structure

- `src/`
  - `app/`: Next.js App Router pages and API routes
  - `components/`: Reusable React components
  - `lib/`: Utility functions and configuration
- `prisma/`: Database schema
- `public/`: Static assets and files
- `.next/`: Next.js build output (gitignored)

## Development Workflow

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git commit -m "Description of changes"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Database Operations

- Update schema:

  ```bash
  pnpm prisma db push
  ```

- Generate Prisma client:
  ```bash
  pnpm prisma generate
  ```

## Useful Commands

- Run development server:

  ```bash
  pnpm dev
  ```

- Build for production:

  ```bash
  pnpm build
  ```

- Start production server:

  ```bash
  pnpm start
  ```

- Lint code:
  ```bash
  pnpm lint
  ```

## Deployment

The application can be deployed on platforms like Vercel, which integrate well with Next.js. Ensure all environment variables are properly set in the deployment environment.

## Troubleshooting

- If you encounter database connection issues, check that your `DATABASE_URL` and `DIRECT_DATABASE_URL` are correctly configured.
- For authentication problems, verify your OAuth credentials and callback URLs.
- Redis connection issues may require checking firewall settings or environment variables.

## Contributing

1. Follow the project's code style using ESLint and Prettier
2. Write meaningful commit messages
3. Update documentation for any new features
4. Test thoroughly before submitting PRs

## License

[Add license information here]
