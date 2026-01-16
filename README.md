# Full-Stack To-Do Application

A production-ready, full-stack To-Do application built with Next.js, Express.js, and Supabase. Features user authentication, task management, filtering, and sorting capabilities.

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Backend**: Express.js (Node.js) with RESTful API
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Styling**: TailwindCSS
- **Deployment**: Vercel (frontend and backend)

### Project Structure

```
todo-app/
├── backend/              # Express.js backend API
│   ├── src/
│   │   ├── config/       # Supabase configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server entry point
│   ├── package.json
│   └── .env.example
├── frontend/             # Next.js frontend
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and API client
│   ├── package.json
│   └── .env.example
├── database/             # Database schema
│   └── schema.sql
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL via Supabase with the following schema:

### Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Row-Level Security (RLS)

All RLS policies are configured to ensure users can only access their own tasks:
- Users can view their own tasks
- Users can insert their own tasks
- Users can update their own tasks
- Users can delete their own tasks

See `database/schema.sql` for the complete schema and RLS policies.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `database/schema.sql`
3. Note down your project URL and API keys from Settings > API

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <supabase_jwt_token>
```

### Endpoints

#### Create Task

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Optional description",
  "due_date": "2024-12-31T23:59:59Z",
  "priority": "high",
  "completed": false
}
```

#### Get All Tasks

```http
GET /api/tasks?completed=false&priority=high&sort_by=due_date&sort_order=asc
```

Query Parameters:
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low/medium/high)
- `sort_by` (string): Sort column (created_at, due_date, priority, title)
- `sort_order` (string): Sort direction (asc/desc)

#### Get Task by ID

```http
GET /api/tasks/:id
```

#### Update Task

```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

## 🔐 Authentication Flow

1. **Sign Up**: User creates an account via Supabase Auth
2. **Email Confirmation**: User confirms email (if enabled in Supabase)
3. **Sign In**: User signs in with email/password
4. **JWT Token**: Supabase returns a JWT token
5. **API Requests**: Frontend includes token in Authorization header
6. **Backend Verification**: Backend verifies token with Supabase
7. **User Context**: Backend extracts user ID from token for data scoping

### Protected Routes

- All task endpoints require authentication
- Frontend redirects unauthenticated users to login
- Backend middleware validates JWT tokens

## 🎨 Features

### Task Management

- ✅ Create, read, update, delete tasks
- ✅ Mark tasks as completed/incomplete
- ✅ Task fields: title, description, due date, priority
- ✅ Automatic timestamps (created_at, updated_at)

### Filtering & Sorting

- Filter by completion status
- Filter by priority (low/medium/high)
- Sort by created date, due date, priority, or title
- Ascending/descending order

### User Experience

- Responsive design (mobile-friendly)
- Dark mode support
- Loading states
- Error handling
- Empty states
- Optimistic UI updates

## 🔒 Security Considerations

### Implemented

1. **Row-Level Security (RLS)**: Database-level access control
2. **JWT Authentication**: Secure token-based auth
3. **Input Validation**: Server-side validation using express-validator
4. **CORS Configuration**: Restricted to frontend URL
5. **Environment Variables**: Sensitive data stored in .env files
6. **No Direct DB Access**: Frontend uses backend API only
7. **User Scoping**: All queries filtered by user_id

### Best Practices

- Never expose service role key to frontend
- Use anon key for frontend Supabase client
- Validate all user inputs
- Sanitize database queries
- Use HTTPS in production
- Implement rate limiting (recommended for production)

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy

### Backend (Vercel Serverless)

1. Create `vercel.json` in backend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

2. Set environment variables in Vercel dashboard
3. Deploy backend as serverless function

### Alternative: Separate Node Service

For better performance, deploy backend as a separate Node.js service on:
- Railway
- Render
- DigitalOcean App Platform
- AWS EC2/ECS
- Google Cloud Run

## 📝 Environment Variables

### Backend (.env)

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can sign out
- [ ] User can create tasks
- [ ] User can view their tasks
- [ ] User can edit tasks
- [ ] User can delete tasks
- [ ] User can mark tasks as complete
- [ ] Filters work correctly
- [ ] Sorting works correctly
- [ ] Users cannot see other users' tasks
- [ ] Unauthenticated users are redirected

## 🔮 Future Improvements

### Features

- [ ] Task categories/tags
- [ ] Task attachments
- [ ] Task comments/notes
- [ ] Recurring tasks
- [ ] Task sharing/collaboration
- [ ] Task templates
- [ ] Calendar view
- [ ] Search functionality
- [ ] Bulk operations
- [ ] Export tasks (CSV/JSON)

### Technical

- [ ] Unit tests (Jest/Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright/Cypress)
- [ ] API rate limiting
- [ ] Caching layer (Redis)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Offline support (PWA)
- [ ] Push notifications
- [ ] Analytics
- [ ] Error tracking (Sentry)

### Performance

- [ ] Database query optimization
- [ ] API response caching
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your frontend URL
2. **Authentication Fails**: Verify Supabase keys are correct
3. **Database Errors**: Ensure RLS policies are enabled and schema is applied
4. **Build Errors**: Check Node.js version (18+) and dependencies

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Check Next.js documentation: https://nextjs.org/docs
- Check Express.js documentation: https://expressjs.com/

