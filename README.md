# OneClickDrive - Car Rental Management System

A modern car rental management system built with Next.js 15, featuring a comprehensive dashboard for managing car listings operations.

## 🚀 Features

- **Car Management**: Edit, and manage car listings with detailed information
- **Advanced Filtering**: Search and filter cars by status, category, location, and more
- **URL-based State Management**: Shareable URLs with persistent filters and pagination
- **Responsive Design**: Mobile-first design that works on all devices
- **Database Integration**: Neon database with proper schema and relationships
- **Image Management**: Car image upload and display functionality
- **Status Management**: Approval workflow for car listings

## 🛠️ Technologies Used

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icon library

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **Neon Database** - Serverless PostgreSQL database
- **Zod** - Schema validation library

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.0 or higher)
- **pnpm**
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hariananthaa/oneclickdrive.git
cd oneclickdrive
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Neon Database Configuration
DATABASE_URL="neon-database-url"
```

### 4. Database Setup

The application uses Neon PostgreSQL database. Make sure to:

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy your connection strings to the `.env.local` file
3. The database schema will be initialized automatically

```bash
# Run the development server
pnpm run dev
```

### 5. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 👤 Sample Users for Testing

The application comes with pre-configured sample users for testing different roles and permissions:

### Admin User

- **Email**: `admin@oneclickdrive.com`
- **Password**: `admin123`
- **Role**: Admin

### Manager User

- **Email**: `manager@oneclickdrive.com`
- **Password**: `manager123`
- **Role**: Manager

## 📁 Project Structure

```
oneclickdrive/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── cars/                 # Car-related endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── dashboard/                # Dashboard-specific components
├── lib/                          # Utility libraries
│   ├── database.ts               # Database configuration
│   └── utils.ts                  # Helper functions
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── scripts/                      # Database scripts
└── README.md                     # Project documentation
```

## 🗄️ Database Schema

### Cars Table (PostgreSQL)

```sql
CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  dailyRate DECIMAL(10,2) NOT NULL,
  monthlyRate DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  imageUrl TEXT NOT NULL,
  isPremium BOOLEAN DEFAULT FALSE,
  availableForRent BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Users Table (PostgreSQL)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### Cars API

- **GET** `/api/cars` - Get all cars with pagination and filtering
  - Query parameters: `page`, `limit`, `search`, `status`
- **PUT** `/api/cars/[id]` - Update a specific car

### Authentication API

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/me` - Get current user information

### Example API Usage

```javascript
// Fetch cars with filters
const response = await fetch(
  "/api/cars?page=1&limit=10&search=toyota&status=approved"
);
const data = await response.json();

// Update a car
const response = await fetch("/api/cars/1", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Updated Car Title",
    status: "approved",
  }),
});

// User login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@oneclickdrive.com",
    password: "admin123",
  }),
});
```

## 🎨 UI Components

The project uses **shadcn/ui** some components for consistent design:

- **Table** - Data display with sorting and pagination
- **Button** - Interactive elements
- **Input** - Form inputs with validation
- **Select** - Dropdown selections
- **Badge** - Status indicators
- **Card** - Content containers
- **Dialog** - Modal interactions

## 🔍 Key Features Implementation

### URL-based State Management

The application uses Next.js App Router's `useSearchParams` for URL-based state management:

```typescript
const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();

// Update URL with new parameters
const createQueryString = useCallback(
  (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    // Update parameters logic
    return params.toString();
  },
  [searchParams]
);
```

### Debounced Search

Search functionality uses debouncing to optimize API calls:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 500);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

## 🚀 Deployment

### Vercel

This application is deployed on Vercel with the following setup:

1. **Automatic Deployments**: Connected to GitHub for automatic deployments
2. **Environment Variables**: Configured in Vercel dashboard
3. **Neon Integration**: Database automatically connected via Vercel integration

**Live Application**: [Live Demo](https://oneclickdrive.vercel.app/)
**Live Application Alternative**: [Live Demo](https://oneclickdrive-git-dev-hariananthaas-projects.vercel.app/)

## 📝 Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Neon](https://neon.tech/) - Serverless PostgreSQL database
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vercel](https://vercel.com/) - Deployment platform
