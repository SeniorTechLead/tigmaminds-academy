# Tigma Minds Foundation - Deployment Guide

## Package Contents

This package contains the complete Tigma Minds Foundation website, ready for deployment.

### What's Included

- **Source Code**: All React TypeScript components and pages
- **Built Assets**: Production-ready files in the `dist/` folder
- **Database Migrations**: Supabase SQL migrations in `supabase/migrations/`
- **Edge Functions**: Serverless functions for email handling
- **Configuration Files**: Environment templates and build configs

## Quick Start

### 1. Database Setup (Supabase)

Your Supabase database connection details are in the `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The database schema is already set up with all necessary migrations applied.

### 2. Deploy the Website

#### Option A: Deploy to Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

#### Option B: Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Option C: Deploy with Docker

1. Build the Docker image:
   ```bash
   docker build -t tigmaminds-foundation .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:80 tigmaminds-foundation
   ```

3. Or use Docker Compose:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:3000`

#### Option D: Deploy to Any Static Host

Upload the contents of the `dist/` folder to your hosting provider (AWS S3, GitHub Pages, etc.)

### 3. Environment Variables

Make sure to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### 4. Edge Functions (Already Deployed)

Two Supabase Edge Functions are deployed and ready:
- `send-contact-email` - Handles contact form submissions
- `send-application-email` - Handles beneficiary application submissions

## Local Development

To run the website locally:

```bash
# Install dependencies
npm install

# Start development server (runs automatically)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Database Structure

### Tables

1. **programs** - Educational and welfare programs
   - Categories: education, child_welfare, old_age

2. **impact_stories** - Testimonials and success stories
   - Features sorting and featured flag

3. **beneficiary_applications** - Applications for help
   - Tracks status and application details

4. **blogs** - Blog posts and articles
   - Markdown content with categories

5. **help_articles** - Knowledge base articles
   - Categorized help documentation

### Security

Row Level Security (RLS) is enabled on all tables with appropriate policies.

## Content Management

### Adding Programs

Use the Supabase dashboard or SQL to insert programs:

```sql
INSERT INTO programs (title, category, description, image_url, active, beneficiaries_count)
VALUES ('Program Name', 'education', 'Description', 'https://...', true, 100);
```

### Adding Impact Stories

```sql
INSERT INTO impact_stories (name, role, story, location, featured, sort_order)
VALUES ('Name', 'Role', 'Their story...', 'Location', true, 1);
```

### Adding Blog Posts

```sql
INSERT INTO blogs (title, slug, excerpt, content, category, author, published)
VALUES ('Title', 'url-slug', 'Brief excerpt', 'Full markdown content', 'news', 'Author Name', true);
```

## Support

For questions about deployment or technical issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

## Docker Configuration

The project includes Docker support for easy containerized deployment:

- **Dockerfile** - Multi-stage build that creates an optimized production image using Nginx
- **docker-compose.yml** - Easy orchestration for local development or deployment
- **nginx.conf** - Nginx configuration with SPA routing and asset caching
- **.dockerignore** - Optimizes build context by excluding unnecessary files

The Docker setup:
- Uses Node.js 20 Alpine for building
- Serves the app with Nginx Alpine for minimal image size
- Enables gzip compression for assets
- Configures proper cache headers
- Supports React Router with fallback to index.html

## Project Structure

```
project/
├── dist/                  # Production build
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── contexts/        # React contexts (theme, etc.)
│   ├── lib/             # Supabase client setup
│   └── utils/           # Utility functions
├── supabase/
│   ├── migrations/      # Database schema migrations
│   └── functions/       # Edge functions
├── Dockerfile            # Docker build configuration
├── docker-compose.yml    # Docker Compose setup
└── public/              # Static assets
```

## Contact

For any questions, visit the website's contact page or reach out through the help center.
