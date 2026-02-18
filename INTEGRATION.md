# Backend Integration Guide

## Overview

This project integrates a TypeScript/Express backend (`hiready_backend`) with a React/Vite frontend. The backend handles authentication, user profiles, and database operations using Prisma ORM.

## Architecture

```
/Hiready-An-Ai-Powered-Interview-Bot
├── hiready_backend/          # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── profile/      # User profile endpoints
│   │   ├── middleware/       # Auth middleware
│   │   ├── config/           # DB & env config
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── .env                  # Backend environment vars
│
├── src/                      # Frontend (React + Vite)
│   ├── lib/
│   │   └── api.ts            # Axios API client
│   ├── contexts/
│   │   └── AuthContext.tsx   # Auth state management
│   └── pages/                # React pages
├── .env                      # Frontend environment vars
└── package.json              # Root scripts
```

## Getting Started

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd hiready_backend
npm install
cd ..
```

### 2. Configure Environment Variables

#### Frontend (.env in root)
```env
# AI Service API Keys
VITE_DEEPGRAM_API_KEY=your_deepgram_key_here
VITE_GROQ_API_KEY=your_groq_key_here

# Backend API (leave blank for development)
VITE_API_BASE_URL=
```

#### Backend (hiready_backend/.env)
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=8000
```

### 3. Set Up Database

```bash
# Run Prisma migrations
npm run prisma:migrate

# Optional: Open Prisma Studio to view/edit data
npm run prisma:studio
```

### 4. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend only (port 8080)
npm run dev:backend   # Backend only (port 8000)
```

## API Endpoints

### Base URL
- **Development**: `http://localhost:8080/api` (proxied to backend:8000)
- **Production**: Set `VITE_API_BASE_URL` to your deployed backend

### Authentication
- `POST /api/auth/signup` - Create new account
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- `POST /api/auth/login` - Sign in
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `GET /api/auth/session` - Get current user (requires auth token)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## Frontend Integration

### Using the API Client

```typescript
import { authApi, profileApi } from '@/lib/api';

// Login example
const handleLogin = async () => {
  const response = await authApi.login({ email, password });
  const { token, user } = response.data;
  // Token is automatically stored and added to subsequent requests
};

// Get profile example
const profile = await profileApi.getProfile();
```

### Using Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome {user.name}</div>;
}
```

## Database Schema

The backend uses Prisma ORM with the following main models:

- **User**: Authentication and basic user info
- **Profile**: Extended user profile data

See `hiready_backend/prisma/schema.prisma` for complete schema.

## Development Workflow

### Making Database Changes

1. Edit `hiready_backend/prisma/schema.prisma`
2. Create migration: `cd hiready_backend && npx prisma migrate dev --name your_migration_name`
3. The migration is automatically applied

### Adding New API Endpoints

1. Create controller in `hiready_backend/src/modules/{module}/{module}.controller.ts`
2. Add route in `{module}.routes.ts`
3. Register route in `hiready_backend/src/app.ts`
4. Update `src/lib/api.ts` with new endpoint

### Protecting Routes with Auth

Backend:
```typescript
import { authMiddleware } from '../../middleware/authMiddleware';
router.get('/protected', authMiddleware, controller.protectedRoute);
```

Frontend:
```typescript
// Token is automatically added via axios interceptor
const data = await apiClient.get('/protected');
```

## Vite Proxy Configuration

The frontend proxies `/api/*` requests to the backend during development:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

This avoids CORS issues and allows using relative URLs like `/api/auth/login` in development.

## Production Deployment

### Frontend
1. Set `VITE_API_BASE_URL` to your backend URL
2. Build: `npm run build`
3. Deploy `dist/` folder (Vercel, Netlify, etc.)

### Backend
1. Set production environment variables
2. Use PostgreSQL instead of SQLite (update `DATABASE_URL`)
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build:backend`
5. Start: `cd hiready_backend && npm start`
6. Deploy to Render, Railway, Heroku, etc.

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run build` | Build frontend |
| `npm run build:backend` | Build backend |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio |

## Troubleshooting

### Backend won't start
- Check that port 8000 is available
- Verify `hiready_backend/.env` exists with required variables
- Run `cd hiready_backend && npm install`

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check Vite proxy config in `vite.config.ts`
- Verify `VITE_API_BASE_URL` is not set (for dev)

### Database errors
- Delete `hiready_backend/dev.db` and `hiready_backend/prisma/dev.db` 
- Run `npm run prisma:migrate` to recreate

### Auth token issues
- Clear localStorage in browser dev tools
- Check JWT_SECRET matches between requests
- Verify token expiration in `hiready_backend/src/utils/token.ts`

## Next Steps

- [ ] Set up production database (PostgreSQL)
- [ ] Configure CORS for production domains
- [ ] Add refresh token mechanism
- [ ] Implement password reset flow
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Set up automated testing
- [ ] Configure CI/CD pipeline
