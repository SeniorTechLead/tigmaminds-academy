import { Download } from 'lucide-react';

export default function DownloadProject() {
  const handleDownload = () => {
    const readmeContent = `# TigmaMinds Academy

A modern web application for the TigmaMinds Academy, showcasing programs, impact stories, and providing ways to get involved.

## Features

- Responsive design
- Dark mode support
- Font size adjustment
- Programs showcase
- Impact stories
- Beneficiary applications
- Contact forms

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Database & Edge Functions)
- React Router

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a \`.env\` file with your Supabase credentials:
   \`\`\`
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

## Docker Support

### Using Docker Compose

1. Build and run:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. Access the application at http://localhost:3000

### Using Dockerfile

1. Build the image:
   \`\`\`bash
   docker build -t tigmaminds-academy .
   \`\`\`

2. Run the container:
   \`\`\`bash
   docker run -p 3000:3000 tigmaminds-academy
   \`\`\`

## Database Setup

The project uses Supabase for data persistence. Schema is managed directly in the Supabase dashboard — pull a current schema dump from there when bootstrapping a new environment.

## Project Structure

\`\`\`
/src
  /components     - Reusable UI components
  /contexts       - React contexts (Theme)
  /pages          - Page components
  /lib            - Utility functions and configurations
  /utils          - Helper functions
/supabase
  /functions      - Edge functions
\`\`\`

## License

MIT License
`;

    const dockerfileContent = `FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
`;

    const dockerComposeContent = `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
`;

    const nginxConfig = `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`;

    const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Supabase
.supabase/
`;

    alert(`To download the complete project:

1. All source code is already in your project directory
2. Key configuration files to include:
   - Dockerfile (for containerization)
   - docker-compose.yml (for easy deployment)
   - nginx.conf (for production server)
   - README.md (documentation)
   - .gitignore (version control)

3. Edge functions are in: supabase/functions/
4. Database schema lives in the Supabase dashboard — pull a fresh dump from there as needed.

Instructions:
- Use your IDE or file manager to copy/export the entire project folder
- Or use: zip -r tigmaminds-academy.zip . -x "node_modules/*" "dist/*" ".git/*"
- Or use Git to clone: git clone [your-repo-url]

Docker configuration files are shown below. Save them to your project root.`);

    const configFiles = {
      'README.md': readmeContent,
      'Dockerfile': dockerfileContent,
      'docker-compose.yml': dockerComposeContent,
      'nginx.conf': nginxConfig,
      '.gitignore': gitignoreContent,
    };

    const blob = new Blob([JSON.stringify(configFiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-config-files.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      title="Download Docker configuration and project setup files"
    >
      <Download className="h-4 w-4" />
      <span>Download Project Config</span>
    </button>
  );
}
