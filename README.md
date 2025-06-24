# Autoluxe - Luxury Car Rental Platform

A modern, full-stack car rental platform built with Next.js 15, Supabase, and TypeScript. Autoluxe provides a premium car rental experience with advanced search, filtering, and booking capabilities.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Advanced Search**: Real-time search with Algolia integration
- **Car Management**: Comprehensive car listing and management system
- **Brand Management**: Multi-brand car rental platform
- **Admin Dashboard**: Full-featured admin panel for content management
- **Image Management**: Cloud storage with Supabase Storage
- **Authentication**: Secure admin authentication system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **SEO Optimized**: Meta tags, structured data, and performance optimized

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Search**: Algolia
- **Deployment**: Vercel
- **UI Components**: Custom component library with shadcn/ui

## 📁 Project Structure

```
autoluxe-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── car/               # Car detail pages
│   │   ├── brand/             # Brand pages
│   │   ├── category/          # Category pages
│   │   └── home/              # Homepage components
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility libraries
│   ├── services/              # API services
│   └── types/                 # TypeScript type definitions
├── supabase/                  # Supabase configuration
├── scripts/                   # Migration and setup scripts
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Algolia account (optional, for search functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd autoluxe-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Algolia (optional)
   NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
   NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
   ALGOLIA_ADMIN_KEY=your_algolia_admin_key
   
   # Admin Authentication
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Start Supabase locally (optional)
   supabase start
   
   # Run migrations
   supabase db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Setup

The project uses Supabase with the following main tables:

- **cars**: Car listings with details, images, and pricing
- **brands**: Car brands with logos and descriptions
- **categories**: Car categories (type, fuel, etc.)
- **users**: Admin users for authentication

Run the migration scripts to set up the database:

```bash
# Create tables
npm run scripts:create-tables

# Verify tables
npm run scripts:verify-tables
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard

2. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Preview deployments for pull requests

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ALGOLIA_APP_ID`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`
- `ALGOLIA_ADMIN_KEY`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## 📱 Features Overview

### For Users
- Browse luxury cars by brand, category, and type
- Advanced search and filtering
- Detailed car specifications and images
- Responsive design for all devices

### For Admins
- Secure admin dashboard
- Car management (add, edit, delete)
- Brand management
- Category management
- Image upload and management
- Analytics and insights

## 🔒 Security

- Row Level Security (RLS) in Supabase
- Admin authentication
- Secure API routes
- Environment variable protection
- Input validation and sanitization

## 📈 Performance

- Next.js 15 App Router for optimal performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- SEO optimization
- CDN integration with Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the migration status in `MIGRATION_STATUS.md`

## 🔄 Migration Status

This project has been migrated from Firebase to Supabase. See `MIGRATION_STATUS.md` for detailed information about the migration process and current status.

