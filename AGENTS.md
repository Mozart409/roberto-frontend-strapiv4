# Agent Development Guide

This guide provides essential information for AI coding agents working in this repository.

## Development Environment Setup

**IMPORTANT: Use Nix flake for development**

```bash
# Enter development environment
nix develop . --command zsh

# The flake provides:
# - Node.js 24
# - Biome formatter/linter
# - Wrangler (Cloudflare CLI)
# - Playwright testing tools
# - Docker & Docker Compose
# - dprint, Caddy, Python3
```

After entering the Nix shell, install dependencies:
```bash
npm install
```

## Build, Lint, and Test Commands

### Development
```bash
npm run dev           # Start dev server (Turbopack, debugging, host 0.0.0.0)
npm run build         # Production build
```

### Cloudflare Deployment
```bash
npm run preview       # Local preview of Cloudflare build
npm run deploy        # Build and deploy to Cloudflare Pages
npm run upload        # Build and upload to Cloudflare Workers
```

### Code Quality
```bash
npm run lint          # Run Biome linter checks
npm run fix           # Auto-format code with Biome
npm run knip          # Detect unused dependencies and exports
npm run t             # TypeScript compiler in watch mode
```

### Testing
**NO TESTING FRAMEWORK CURRENTLY CONFIGURED**
- Playwright is available via Nix flake but not configured
- To add tests: Configure Playwright or Vitest
- Run single test (when configured): `npm test <filename>`

### Cloudflare Utilities
```bash
npm run cf-typegen    # Generate Cloudflare environment types
```

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Cloudflare Workers (via OpenNext adapter)
- **CMS**: Strapi v4
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **Forms**: React Server Actions + Zod validation
- **Email**: Resend API
- **HTTP Client**: Wretch

## Code Style Guidelines

### TypeScript

**Strictness**: Full strict mode enabled (`strict: true`)

**Type Patterns**:
- Use inline interfaces for component props
- Prefix global interfaces with `I` (e.g., `IMedia`, `ILink`)
- Suffix component props interfaces with `Props` (e.g., `HeroProps`)
- Use `any` for Strapi CMS responses (with Biome ignore comment)
- Prefer type inference over explicit types
- Use Zod schemas for form validation

```typescript
// Good: Inline interface for component props
interface HeroProps {
  data: {
    id: string;
    title: string;
  };
}

export default function Hero({ data }: HeroProps) {
  // ...
}

// Good: Using any for CMS data with explanation
// biome-ignore lint/suspicious/noExplicitAny: Strapi response structure is dynamic
const page: any = await getPageBySlug(slug, lang);
```

### Imports

**Order**:
1. React/Next.js imports
2. Third-party libraries
3. Local components (relative imports)
4. Utilities (using `@/` alias)
5. Type imports

**Path Aliases**:
- Use `@/` for utilities: `import { getPageBySlug } from "@/app/utils/get-page-by-slug"`
- Use relative imports for nearby components: `import Hero from "./components/Hero"`

```typescript
// Good import order
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "../utils/api-helpers";
import { renderButtonStyle } from "../utils/render-button-style";
import HighlightedText from "./HighlightedText";
```

### Naming Conventions

**Files**:
- Components: `PascalCase.tsx` (Hero.tsx, Navbar.tsx)
- Element components: `kebab-case.tsx` (custom-link.tsx, image.tsx)
- Utilities: `kebab-case.ts` (api-helpers.ts, fetch-api.tsx)
- Next.js special files: lowercase (layout.tsx, page.tsx, error.tsx)

**Functions/Variables**:
- Functions: `camelCase` with verb prefixes (`getStrapiURL`, `renderButtonStyle`)
- Variables: `camelCase` (`imgUrl`, `navbarLogoUrl`)
- Constants: `SCREAMING_SNAKE_CASE` (`FALLBACK_SEO`, `RESEND_API_KEY`)

**Components**:
- Use default exports: `export default function Navbar() {}`
- Functional components only (no class components)
- Use PascalCase for component names

### Formatting (Biome)

**Configuration**:
- **Indent**: 2 spaces
- **Line width**: 80 characters
- **Quotes**: Double quotes
- **Line ending**: LF
- **Auto-format on save**: Enabled (VSCode)
- **Pre-commit hook**: Auto-formats staged files

Run `npm run fix` to format all files.

### Components

**Client vs Server**:
- **Default**: Server components (no directive)
- **Client components**: Add `"use client"` directive at top
  - Use for: Forms, interactivity, hooks (useState, usePathname, etc.)

### Error Handling

**API Errors** (Wretch pattern):
```typescript
const data = await wretch(requestUrl)
  .get()
  .badRequest((err) => console.log(err.status))
  .unauthorized((err) => console.log(err.status))
  .notFound((err) => console.log(err.status))
  .json();
```

**Server Actions** (return error objects):
```typescript
try {
  // ... operation
  return { message: "Success message", type: "success" };
} catch (e) {
  return { message: `Failed: ${e}`, type: "error" };
}
```

**Component Fallbacks** (early returns):
```typescript
if (!data) return <div>404 Content not found!</div>;
```

### Data Fetching

**Strapi API Pattern**:
```typescript
async function getData(lang: string) {
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  if (!token) throw new Error("API token missing");
  const urlParamsObject = { populate: ["field1", "field2"], locale: lang };
  return await fetchAPI(path, urlParamsObject);
}
```

**Dynamic Component Rendering**:
```typescript
export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.hero": return <Hero key={index} data={section} />;
    case "sections.features": return <Features key={index} data={section} />;
    default: return null;
  }
}
```

## Environment Variables

Required variables (create `.env.local`):
```bash
NEXT_PUBLIC_STRAPI_API_TOKEN=<your_token>
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi.com
NEXT_PUBLIC_PAGE_LIMIT=6
RESEND_API_KEY=<your_key>
```

## Git Workflow

**Pre-commit Hook** (Lefthook):
- Auto-formats `.{js,ts,jsx,tsx}` files with Biome
- Runs on staged files only
- Auto-stages fixed files

**Before Committing**:
1. Run `npm run lint` to check for issues
2. Run `npm run t` to verify TypeScript compilation
3. Stage your changes
4. Commit (hook will auto-format)

## Common Patterns

### Internationalization (i18n)
- Configured for `en` and `de` locales
- Currently hardcoded to `"de"` in many places
- Middleware disabled (transitional state)
- Pass locale to Strapi API calls

### Styling (TailwindCSS)
- Use inline classes (no extraction needed)
- Dark mode: `dark:` prefix
- Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Conditional classes: `className={\`px-8 py-3 ${isRecommended ? "bg-violet-600" : "bg-gray-800"}\`}`

### Form Validation (Zod)
```typescript
const Schema = z.object({
  username: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is not valid" }),
});
export type EmailSchema = z.infer<typeof Schema>;
```

## Important Notes

- **Node.js Version**: >=22.x.x (provided by Nix flake)
- **Package Manager**: Use `npm` (not pnpm or yarn)
- **State Management**: No global state library (use React hooks/context)
- **Testing**: Not yet configured (Playwright available in Nix flake)
- **Deployment Target**: Cloudflare Workers/Pages
- **CMS Integration**: All content from Strapi v4

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Strapi v4 Docs](https://docs.strapi.io/)
- [Biome Documentation](https://biomejs.dev/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
