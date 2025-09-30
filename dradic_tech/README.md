# Dradic Technologies Blog

A modern, full-stack personal portfolio and blog website showcasing cloud solutions, DevOps expertise, and technical insights. Built with React Router v7, TypeScript, Supabase, and a unified backend API.

## 🌟 Features

### Personal Portfolio

- **Professional Profile**: Comprehensive about page with experience, skills, and downloadable CV
- **Portfolio Showcase**: Featured applications and projects with live demos
- **Contact System**: Integrated contact form for professional inquiries

### Technical Blog

- **Content Management**: Full-featured CMS for blog post creation and management
- **Markdown Support**: Rich text editing with MDX support and syntax highlighting
- **Search & Discovery**: Advanced search functionality across all blog content
- **Performance Optimized**: Intelligent caching and optimized API calls for fast loading
- **Client-Side Store**: Smart data management with `blogStore` for optimal performance
- **Responsive Design**: Mobile-first approach with dark/light theme support

### Admin Dashboard

- **Authentication**: Secure admin login with Supabase Auth
- **Post Management**: Create, edit, and delete blog posts
- **Content Editor**: WYSIWYG markdown editor with live preview
- **Media Management**: Image uploads and asset organization

## 🛠️ Tech Stack

### Frontend

- **React Router v7** - Modern routing with SSR support and static pre-rendering
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS v4** - Modern utility-first styling with new engine
- **MDXEditor** - Rich markdown editing experience with live preview
- **React 19** - Latest React features and concurrent rendering
- **Vite 6** - Fast build tool and dev server

### Backend & Services

- **Unified Backend API** - FastAPI-based backend with PostgreSQL
- **Supabase** - Database, authentication, and real-time subscriptions
- **PostgreSQL** - Relational database for content storage
- **Server-Side Rendering** - SEO-optimized page rendering with React Router v7

### Development Tools

- **ESLint & Prettier** - Code quality and formatting
- **Docker** - Containerized deployment
- **Vercel Preset** - Optimized deployment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dradic_tech
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
dradic_tech/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── markdown/       # Markdown rendering utilities
│   │   ├── BlogPostForm.tsx
│   │   ├── ContactForm.tsx
│   │   ├── MDXEditor.tsx
│   │   ├── PostEditor.tsx
│   │   ├── PostList.tsx
│   │   ├── SearchModal.tsx
│   │   └── ...
│   ├── contexts/           # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useBlogPostsData.tsx
│   ├── modules/            # API clients, stores, and utilities
│   │   ├── apis.ts         # Backend API integration
│   │   ├── blogStore.ts    # Client-side blog data store
│   │   ├── supabase.ts     # Supabase client configuration
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Utility functions
│   ├── routes/             # Page components
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── blog/           # Blog pages
│   │   ├── portfolio/      # Portfolio pages
│   │   └── ...
│   ├── app.css            # Global styles
│   ├── root.tsx           # Root component
│   └── routes.ts          # Route definitions
├── public/                # Static assets
│   ├── assets/           # Images and media files
│   └── favicon.ico
├── Dockerfile            # Container configuration
├── package.json          # Dependencies and scripts
├── react-router.config.ts # React Router configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## ⚡ Performance Features

### Optimized Data Loading

- **Intelligent Caching**: Smart caching system prevents duplicate API calls
- **Navigation State Passing**: Post data passed through navigation to eliminate redundant fetches
- **Client-Side Store**: `blogStore` maintains application state for optimal performance
- **Suspense Integration**: React 18+ Suspense for smooth loading states

### Modern Architecture

- **Server-Side Rendering**: SEO-friendly SSR with React Router v7
- **Static Pre-rendering**: Build-time optimization for faster initial loads
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **TypeScript**: Full type safety across the entire application

## 🎨 Key Pages

- **Home** (`/`) - Landing page with company overview
- **About** (`/about`) - Professional profile and experience
- **Blog** (`/blog`) - Technical articles and tutorials
- **Portfolio** (`/portfolio`) - Featured projects and applications
- **Admin** (`/admin`) - Content management dashboard

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
pnpm typecheck        # Run TypeScript checks
pnpm type-check       # Alternative TypeScript check (no emit)

# Maintenance
pnpm clean            # Clean build artifacts
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t dradic-tech .

# Run the container (maps to port 3000)
docker run -p 3000:3000 dradic-tech
```

## 🌐 Deployment Options

The application can be deployed to any platform supporting Node.js:

- **Vercel** - Recommended for React Router apps
- **Netlify** - Static site hosting
- **AWS ECS** - Container orchestration
- **Google Cloud Run** - Serverless containers
- **Railway** - Simple deployment platform

## 🎯 About Dradic Technologies

Dradic Technologies specializes in cloud solutions and DevOps, with expertise in:

- AWS cloud-native architectures
- Edge device deployment and management
- CI/CD pipeline automation
- Serverless system development
- Infrastructure as Code (IaC)

## 📝 License

This project is private and proprietary to Dradic Technologies.
