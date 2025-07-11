# Blog CMS

A modern content management system for creating and managing blog posts, built with React Router v7, TypeScript, and Supabase.

## 🚀 Features

- **Markdown Editor**: Rich text editing with markdown support
- **Post Management**: Create, edit, delete, and organize blog posts
- **Authentication**: Secure user authentication with Supabase
- **Real-time Updates**: Live preview and real-time collaboration
- **Responsive Design**: Works seamlessly on desktop and mobile
- **SEO Optimized**: Built-in SEO features for better search visibility

## 🛠️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: FastAPI (unified backend)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📦 Installation

This project is part of the Dradic Technologies monorepo. To get started:

1. **From the root directory:**

   ```bash
   pnpm install
   ```

2. **Start the development environment:**
   ```bash
   pnpm start
   ```
   Then select "Blog CMS" from the menu.

## 🎯 Quick Start

### Manual Setup

1. **Navigate to the project:**

   ```bash
   cd blog_cms
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start development server:**

   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key



# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## 📁 Project Structure

```
blog_cms/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Editor.tsx      # Markdown editor component
│   │   ├── MarkdownPreview.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── modules/            # Utility modules
│   │   ├── apis.ts        # API client functions
│   │   ├── supabase.ts    # Supabase client
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── utils.ts       # Utility functions
│   ├── routes/            # Page components
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   └── ...
│   └── root.tsx           # Root component
├── public/                # Static assets
└── package.json
```

## 🎨 Key Components

### Editor Component

The markdown editor provides a rich editing experience with:

- Real-time preview
- Syntax highlighting
- Auto-save functionality
- Image upload support

### Authentication

Secure authentication system using Supabase:

- Email/password login
- Social login options
- Protected routes
- User session management

### Post Management

Comprehensive post management features:

- Create new posts
- Edit existing posts
- Draft system
- Publish/unpublish
- Category organization

## 🚀 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript type checking
pnpm clean        # Clean build artifacts
```

## 🔗 API Integration

This project integrates with the unified backend API and Supabase for:

- User authentication (Supabase Auth)
- Post CRUD operations (Backend API)
- File storage (Supabase Storage)
- Analytics data (Backend API)

## 🎯 Development Workflow

1. **Create a new post:**

   - Navigate to the editor
   - Write content in markdown
   - Preview in real-time
   - Save as draft or publish

2. **Manage existing posts:**

   - View all posts in the dashboard
   - Edit, delete, or republish posts
   - Organize by categories

3. **User management:**
   - Register new users
   - Manage user permissions
   - Handle authentication flows

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The build output will be in the `build/` directory, ready for deployment to any static hosting service.

### Recommended Hosting

- Vercel
- Netlify
- AWS S3 + CloudFront

## 🤝 Contributing

1. Follow the monorepo development workflow
2. Ensure all tests pass
3. Follow the established code style
4. Update documentation as needed

## 📄 License

This project is proprietary to Dradic Technologies.

---

**Built with ❤️ by Dradic Technologies**
