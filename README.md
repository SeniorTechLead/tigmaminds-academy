# Tigma Minds Foundation Website

A modern, responsive website for Tigma Minds Foundation - empowering communities in Assam through education, child welfare, and elderly care programs.

## Features

- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Three Focus Areas**: Education, Child Welfare, and Old Age Support
- **Impact Stories**: Showcase real testimonials and success stories
- **Blog System**: Share updates and stories from the field
- **Application System**: Allow beneficiaries to apply for help
- **Help Center**: Knowledge base for common questions
- **Contact Forms**: Easy ways for visitors to get in touch

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Serverless Functions**: Supabase Edge Functions
- **Icons**: Lucide React
- **Routing**: React Router

## Quick Start

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/contexts` - React contexts
  - `/lib` - Third-party integrations
- `/supabase` - Database and serverless functions
  - `/migrations` - Database schema
  - `/functions` - Edge functions
- `/dist` - Production build output

## Environment Variables

Copy `.env` and configure:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## License

© 2024 Tigma Minds Foundation. All rights reserved.
