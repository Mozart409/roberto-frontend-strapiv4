# Roberto Frontend - Strapi v4

A modern Next.js frontend application integrated with Strapi CMS, featuring internationalization and Cloudflare deployment support.

## Features

- Next.js 15 with App Router
- Strapi v4 CMS integration
- Internationalization (i18n) support (English, German)
- Cloudflare Pages deployment
- TailwindCSS styling
- TypeScript
- Email functionality with Resend
- Code quality tools (Biome, Knip)

## Prerequisites

- Node.js >= 22.x.x
- npm or equivalent package manager
- Strapi CMS backend (v4)

## Getting Started

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Configure the following environment variables:

```bash
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_api_token
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-url.com
NEXT_PUBLIC_PAGE_LIMIT=6
RESEND_API_KEY=your_resend_api_key
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

The dev server runs with Turbopack for faster builds and includes debugging support.

## Available Scripts

- `npm run dev` - Start development server with debugging
- `npm run build` - Build for production
- `npm run preview` - Preview Cloudflare build locally
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run upload` - Upload build to Cloudflare
- `npm run lint` - Run Biome linter
- `npm run fix` - Format code with Biome
- `npm run t` - Run TypeScript compiler in watch mode
- `npm run knip` - Detect unused dependencies and exports
- `npm run cf-typegen` - Generate Cloudflare types

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable components (Hero, Navbar, Footer, etc.)
│   ├── email/          # Email handling
│   ├── utils/          # Utility functions and API helpers
│   └── [...slug]/      # Dynamic routing for CMS pages
├── middleware.ts       # i18n middleware
└── i18n-config.ts      # Internationalization configuration
```

## Deployment

### Cloudflare Workers

Deploy to Cloudflare Workers using:

```bash
npm run deploy
```

This project uses [@opennextjs/cloudflare](https://opennext.js.org/cloudflare) for deployment.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [OpenNext Cloudflare](https://opennext.js.org/cloudflare)
- [TailwindCSS](https://tailwindcss.com/docs)
