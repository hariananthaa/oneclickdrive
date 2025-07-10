# React + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui

A modern React application built with TypeScript, Vite, Tailwind CSS 4, shadcn/ui components, and React Router DOM for routing.

## 🚀 Technologies Used

- **[React 19](https://reactjs.org/)** - A JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI and Tailwind CSS
- **[React Router DOM](https://reactrouter.com/)** - Declarative routing for React applications
- **[ESLint](https://eslint.org/)** - Code linting and formatting

## 📋 Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd <your-project-name>
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see your application running.

## 🏗️ Project Structure

```
src/
├── components/         # Reusable components
│   └── ui/             # shadcn/ui components
├── pages/              # Considering this as a pages directory in nextjs
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── styles/             # Global styles and Tailwind CSS
├── types/              # TypeScript type definitions
├── App.tsx/            # Application routing definitions
└── main.tsx            # Application entry point
```

## 🎨 Styling with Tailwind CSS 4

This project uses Tailwind CSS 4 with the new CSS-first configuration. The configuration is handled through CSS imports and custom properties.

### Key Features:

- **CSS-first configuration** - No more `tailwind.config.js`
- **Native CSS cascade layers** - Better style organization
- **Improved performance** - Faster builds and smaller bundles
- **Enhanced developer experience** - Better IntelliSense and debugging

### Global Styles

The main stylesheet is located at `src/styles/globals.css` and includes:

- Tailwind CSS imports
- Custom CSS variables for theming
- Dark mode support
- Component-specific styles

## 🧩 shadcn/ui Components

This project is configured with shadcn/ui for consistent, accessible, and customizable components.

### Adding New Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Using Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

## 🛣️ Routing with React Router DOM

The application uses React Router DOM for client-side routing.

### Basic Setup

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation

```tsx
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <button onClick={() => navigate("/contact")}>Contact</button>
    </nav>
  );
}
```

## 📝 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 🔧 Configuration Files

### TypeScript Configuration

- `tsconfig.json` - Base TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript settings
- `tsconfig.node.json` - Node.js specific settings

### Vite Configuration

- `vite.config.ts` - Vite build tool configuration
- Includes path aliases for clean imports (`@/` prefix)
- Tailwind CSS 4 plugin integration

### shadcn/ui Configuration

- `components.json` - shadcn/ui component configuration
- Defines component paths, styling preferences, and aliases

## 🎯 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use functional components with hooks
- Implement proper error boundaries
- Use semantic HTML elements

### Component Structure

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onAction?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Click me"}
      </Button>
    </div>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Leverage shadcn/ui components for consistency
- Use CSS variables for theming
- Implement responsive design with Tailwind breakpoints
- Follow the established color palette and spacing scale

## 🌙 Dark Mode Support

The project includes built-in dark mode support through Tailwind CSS and shadcn/ui theming system.

```tsx
import { useTheme } from "@/hooks/use-theme";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md border"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
```

## 📦 Building for Production

```bash
pnpm run build
```

The build artifacts will be stored in the `dist/` directory. The build is optimized and ready for deployment to any static hosting service.

## 🆘 Troubleshooting

### Common Issues

**Build errors with Tailwind CSS 4:**

- Ensure you're using the latest version of Tailwind CSS
- Check that your CSS imports are correct in `index.css`

**TypeScript path resolution issues:**

- Verify `tsconfig.json` and `vite.config.ts` have matching path aliases
- Restart your TypeScript server in your IDE

**shadcn/ui component issues:**

- Run `npx shadcn@latest add <component-name>` to ensure latest versions
- Check that `components.json` configuration matches your project structure

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Router Documentation](https://reactrouter.com/docs)

```

```
