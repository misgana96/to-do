# Architecture Documentation

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Next.js       │────────▶│   Express.js    │────────▶│   Supabase      │
│   Frontend      │  HTTP   │   Backend API   │  REST   │   PostgreSQL    │
│                 │         │                 │         │   + Auth        │
└─────────────────┘         └─────────────────┘         └─────────────────┘
      │                            │                            │
      │                            │                            │
      └────────────────────────────┴────────────────────────────┘
                    JWT Token Authentication
```

## Data Flow

### Authentication Flow

1. User signs up/logs in via Supabase Auth (frontend)
2. Supabase returns JWT token
3. Frontend stores token in session
4. Frontend includes token in API requests: `Authorization: Bearer <token>`
5. Backend middleware verifies token with Supabase
6. Backend extracts user ID from token
7. All database queries filtered by `user_id`

### Task CRUD Flow

#### Create Task
```
User Input → TaskForm → API Client → Express Backend → Supabase → PostgreSQL
                                                              ↓
Response ← TaskList ← API Client ← Express Backend ← Supabase ←
```

#### Read Tasks
```
Page Load → API Client → Express Backend → Supabase (with RLS) → PostgreSQL
                                                              ↓
Tasks ← TaskList ← API Client ← Express Backend ← Supabase ←
```

## Component Architecture

### Frontend Components

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Main page (task list + auth)
└── globals.css         # Global styles

components/
├── Auth.tsx            # Sign up/login form
├── TaskForm.tsx        # Create/edit task form
├── TaskList.tsx        # Task list container
├── TaskItem.tsx        # Individual task display
└── FilterBar.tsx       # Filter and sort controls

lib/
├── supabase.ts         # Supabase client
└── api.ts              # API client functions
```

### Backend Structure

```
src/
├── server.js           # Express app entry point
├── config/
│   └── supabase.js    # Supabase client configuration
├── middleware/
│   ├── auth.js        # JWT authentication middleware
│   ├── validation.js  # Input validation middleware
│   └── errorHandler.js # Error handling middleware
├── controllers/
│   └── taskController.js # Task CRUD operations
└── routes/
    └── taskRoutes.js   # Task API routes
```

## Security Layers

### Layer 1: Frontend
- Supabase Auth handles authentication
- JWT tokens stored in secure session
- No direct database access

### Layer 2: Backend API
- JWT token verification on every request
- Input validation (express-validator)
- User ID extraction from token
- CORS protection

### Layer 3: Database
- Row-Level Security (RLS) policies
- User-scoped queries
- Foreign key constraints
- Data validation at schema level

## API Design

### RESTful Principles

- **POST /api/tasks** - Create task
- **GET /api/tasks** - List tasks (with filters)
- **GET /api/tasks/:id** - Get single task
- **PUT /api/tasks/:id** - Update task
- **DELETE /api/tasks/:id** - Delete task

### Request/Response Format

**Request Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response Format:**
```json
{
  "message": "Success message",
  "task": { ... }  // or "tasks": [ ... ]
}
```

**Error Format:**
```json
{
  "error": "Error type",
  "message": "Error description"
}
```

## Database Design

### Tables

**tasks**
- Primary key: `id` (UUID)
- Foreign key: `user_id` → `auth.users(id)`
- Indexes on: `user_id`, `completed`, `priority`, `due_date`
- RLS enabled with user-scoped policies

### Relationships

```
auth.users (1) ──< (many) tasks
```

### Constraints

- `priority` CHECK constraint (low/medium/high)
- `user_id` NOT NULL with foreign key
- `title` NOT NULL
- Automatic `updated_at` via trigger

## State Management

### Frontend State

- **Server State**: Fetched from API, stored in React state
- **Client State**: Form inputs, UI state (editing, filters)
- **Auth State**: Managed by Supabase client

### No Global State Library

- React hooks (`useState`, `useEffect`) for local state
- API calls on component mount and filter changes
- Optimistic updates where appropriate

## Performance Considerations

### Frontend

- Next.js App Router for optimal loading
- Server Components where possible
- Client Components only when needed
- TailwindCSS for minimal CSS bundle

### Backend

- Express.js lightweight server
- Efficient database queries with indexes
- RLS policies enforced at database level
- Connection pooling (handled by Supabase)

### Database

- Indexed columns for fast queries
- RLS policies optimized for user-scoped access
- Automatic query optimization by PostgreSQL

## Scalability

### Current Architecture

- Suitable for: 1-1000 concurrent users
- Database: Up to 500MB (Supabase free tier)
- API: Stateless, horizontally scalable

### Scaling Path

1. **Database**: Upgrade Supabase plan or migrate to dedicated PostgreSQL
2. **Backend**: Deploy multiple instances behind load balancer
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Use Vercel Edge Network for static assets
5. **Real-time**: Enable Supabase Realtime for live updates

## Error Handling

### Frontend

- Try-catch blocks around API calls
- User-friendly error messages
- Loading states during async operations
- Form validation feedback

### Backend

- Centralized error handler middleware
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)
- Error logging for debugging

## Testing Strategy

### Recommended Tests

1. **Unit Tests**: Individual functions/components
2. **Integration Tests**: API endpoints
3. **E2E Tests**: User flows (sign up → create task → delete)
4. **Security Tests**: RLS policies, auth middleware

### Test Tools

- Jest/Vitest for unit tests
- Supertest for API tests
- Playwright/Cypress for E2E tests

## Monitoring & Observability

### Recommended Tools

- **Vercel Analytics**: Frontend performance
- **Supabase Dashboard**: Database metrics
- **Sentry**: Error tracking (optional)
- **LogRocket**: User session replay (optional)

## Future Architecture Enhancements

1. **Real-time Updates**: Supabase Realtime subscriptions
2. **Caching Layer**: Redis for frequently accessed data
3. **Message Queue**: For background jobs
4. **Microservices**: Split into auth, tasks, notifications services
5. **GraphQL API**: Alternative to REST
6. **Serverless Functions**: For specific operations
7. **CDN**: For static assets and API responses

