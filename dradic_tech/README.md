# Dradic Technologies - Main Website

The official website and portfolio for Dradic Technologies, showcasing our projects, services, and company information.

## 🚀 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Project Showcase**: Highlighting our best work and achievements
- **Contact Forms**: Easy communication channels for potential clients
- **Blog Integration**: Seamless integration with our blog CMS
- **Responsive Layout**: Optimized for all devices and screen sizes
- **Performance Optimized**: Fast loading times and smooth interactions

## 🛠️ Tech Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Backend**: FastAPI (unified backend)
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Deployment**: Static hosting ready

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
   Then select "Dradic Tech" from the menu.

## 🎯 Quick Start

### Manual Setup

1. **Navigate to the project:**

   ```bash
   cd dradic_tech
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
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Contact Information
VITE_CONTACT_EMAIL=contact@dradictech.com
VITE_COMPANY_NAME=Dradic Technologies
```

## 📁 Project Structure

```
dradic_tech/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── navbar/         # Navigation components
│   │   │   ├── DesktopNav.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Logo.tsx
│   │   ├── ContactForm.tsx
│   │   ├── MemberCard.tsx
│   │   ├── SectionHeader.tsx
│   │   └── ...
│   ├── module/             # Utility modules
│   │   ├── apis.ts        # API client functions
│   │   ├── projectsConfig.ts
│   │   ├── types.ts       # TypeScript type definitions
│   │   └── utils.ts       # Utility functions
│   ├── routes/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── BlogPage.tsx
│   │   └── ...
│   └── root.tsx           # Root component
├── public/                # Static assets
│   ├── dradic_tech_logo.png
│   ├── dusan.jpeg
│   └── ...
└── package.json
```

## 🎨 Key Components

### Navigation System

Modern navigation with:

- Desktop and mobile responsive design
- Smooth transitions and animations
- Logo and branding integration
- Contact information display

### Project Showcase

Comprehensive project display featuring:

- Project cards with images and descriptions
- Technology stack indicators
- Live demo links
- GitHub repository links

### Contact Forms

Professional contact system with:

- Contact form with validation
- Email integration
- Response confirmation
- Spam protection

### Blog Integration

Seamless blog integration:

- Blog post listing
- Individual post pages
- Category filtering
- Search functionality

## 🚀 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript type checking
pnpm clean        # Clean build artifacts
```

## 🔗 API Integration

This project integrates with the unified backend API for:

- Contact form submissions
- Blog post data
- Project information
- Analytics tracking

## 🎯 Content Management

### Projects Configuration

Projects are configured in `app/module/projectsConfig.ts`:

- Project metadata
- Technology stacks
- Links and descriptions
- Image assets

### Blog Integration

Blog posts are fetched from the unified backend:

- Real-time content updates
- SEO optimization
- Social media sharing

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The build output will be in the `build/` directory, ready for deployment.

### Recommended Hosting

- Vercel (recommended for React Router v7)
- Netlify
- AWS S3 + CloudFront

### Environment Setup

For production deployment, ensure:

- Environment variables are properly configured
- API endpoints point to production backend
- Analytics tracking is enabled
- SSL certificates are configured

## 📊 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: Efficient caching strategies
- **Bundle Analysis**: Regular bundle size monitoring

## 🔍 SEO Features

- **Meta Tags**: Dynamic meta tag generation
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Open Graph**: Social media optimization

## 🤝 Contributing

1. Follow the monorepo development workflow
2. Ensure all tests pass
3. Follow the established code style
4. Update documentation as needed
5. Test responsive design across devices

## 📄 License

This project is proprietary to Dradic Technologies.

---

**Built with ❤️ by Dradic Technologies**
