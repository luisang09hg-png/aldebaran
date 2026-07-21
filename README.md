# Aldebaran - Full-Stack Platform

## Overview
A comprehensive full-stack application combining Express.js backend with Vite React frontend, featuring authentication, user management, and modern web capabilities.

## Tech Stack

### Backend (Express.js + Node.js)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT-based middleware
- **Security**: Helmet, CORS, rate limiting
- **Deployment**: Dockerized with PostgreSQL container

### Frontend (Vite + React)
- **Framework**: React with Vite
- **Routing**: React Router v7
- **Styling**: CSS modules with Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite

### Monorepo Management
- **Package Manager**: npm workspaces
- **Backend App**: `apps/api`
- **Frontend App**: `apps/web`

## Setup Instructions

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/luisang09hg-png/aldebaran.git
cd aldebaran
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Database
Create a PostgreSQL database using Docker:
```bash
docker-compose up -d
docker-compose exec db psql -U postgres -c "ALTER USER postgres WITH ENCRYPTED PASSWORD 'secret';"
```

Update `.env` file in `apps/api/`:
```env
DATABASE_URL=postgresql://postgres:secret@localhost:5432/jobsearch
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
PORT=4000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173
```

#### 4. Database Migration
```bash
# Generate Prisma client
npm run db:generate --workspace=apps/api

# Apply migrations
npm run db:migrate --workspace=apps/api
```

#### 5. Run Applications
```bash
# Start API server
npm run dev:api

# Start frontend
npm run dev --workspace=apps/web
```

#### 6. Production Build
```bash
# Build both applications
npm run build --workspace=apps/api
npm run build --workspace=apps/web
```

### Docker Deployment

#### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Stop and remove containers, networks, images
# (Delete volumes with -v if you want to reset database)
docker-compose down
```

#### Individual Services
```bash
# Run API service
docker-compose run --rm api npm run db:migrate

cdocker-compose start api frontend
```

## Environment Variables

### Required Variables

#### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string
  ```
  postgresql://username:password@localhost:5432/database_name
  ```
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh
- `PORT`: API server port (default: 4000)
- `HOST`: API server host (default: 0.0.0.0)
- `FRONTEND_URL`: Frontend URL (default: http://localhost:5173)

#### Frontend (.env.example)
- `VITE_API_URL`: API base URL
  ```
  http://localhost:4000/api
  ```

### Optional Variables

#### Redis
- `REDIS_URL`: Redis connection URL for session storage

#### File Upload
- `UPLOAD_DIR`: Directory for uploaded files
- `MAX_FILE_SIZE`: Maximum file upload size (bytes)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/profile/:id` - Get user profile
- `PUT /api/profile/:id` - Update user profile
- `DELETE /api/profile/:id` - Delete user profile

### Posts
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `GET /api/applications` - List user applications
- `POST /api/applications` - Submit job application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Messaging
- `GET /api/messaging/conversations` - List conversations
- `POST /api/messaging/messages` - Send message
- `GET /api/messaging/messages/:id` - Get message
- `PUT /api/messaging/messages/:id` - Update message
- `DELETE /api/messaging/messages/:id` - Delete message

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/:id` - Get specific course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Jobs
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## Project Structure

```
aldebaran/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── pages/
│       │   └── styles/
│       └── package.json
├── scripts/
│   └── setup-db.js
├── docker-compose.yaml
├── .env.example
├── .gitignore
├── docker-compose.yaml
└── README.md
```

## Contributors

This project was initially developed as part of the Aldebaran platform's full-stack architecture. Contributions are welcome!

## License

This project is licensed under the MIT License.
