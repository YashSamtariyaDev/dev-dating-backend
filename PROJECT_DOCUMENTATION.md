# Dev Dating Backend - Project Documentation

## Project Overview
This is a **dating app backend for developers** built with NestJS framework. The application is designed to connect developers based on their technical skills, experience level, and preferences.

## Tech Stack & Dependencies

### Core Framework
- **NestJS** - Progressive Node.js framework for building efficient server-side applications
- **TypeScript** - Type-safe JavaScript superset

### Database & ORM
- **MySQL** - Primary database
- **TypeORM** - Object-Relational Mapping library
- **MySQL2** - MySQL driver for Node.js

### Authentication & Security
- **JWT (JSON Web Tokens)** - Authentication tokens
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **@nestjs/jwt** - NestJS JWT module
- **@nestjs/passport** - NestJS Passport integration

### Validation & Transformation
- **class-validator** - Input validation
- **class-transformer** - Object transformation

### Additional Features
- **@nestjs/swagger** - API documentation generation
- **nodemailer** - Email sending
- **ioredis** - Redis client (likely for caching/sessions)

### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Project Structure

```
src/
├── app.module.ts              # Root application module
├── main.ts                    # Application entry point
├── common/                    # Shared utilities and decorators
│   ├── decorators/           # Custom decorators (@CurrentUser, @Roles)
│   ├── guards/               # Authentication and authorization guards
│   └── utils/                # Utility functions
├── config/                   # Configuration files
│   └── database.config.ts    # Database configuration
├── database/                 # Database migrations
│   └── migrations/           # TypeORM migration files
└── modules/                  # Feature modules
    ├── auth/                 # Authentication module
    ├── users/                # User management module
    ├── profile/              # User profile module
    └── matching/             # Matching algorithm module
```

## Database Schema

### Users Table
```typescript
interface User {
  id: string (UUID)
  email: string (unique, max 100 chars)
  password: string (hashed)
  isActive: boolean (default: true)
  isEmailVerified: boolean (default: false)
  role: UserRole (enum: USER, ADMIN)
  createdAt: Date
  updatedAt: Date
  profile: Profile (one-to-one relation)
}
```

### Profiles Table
```typescript
interface Profile {
  id: string (UUID)
  user: User (one-to-one relation)
  bio: string (optional)
  gender: Gender (enum: MALE, FEMALE, OTHER)
  lookingFor: string (optional)
  techStack: string[] (JSON array)
  experienceLevel: ExperienceLevel (enum: JUNIOR, MID, SENIOR)
  githubUrl: string (optional)
  linkedinUrl: string (optional)
  location: string (optional)
  isComplete: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

## API Endpoints

### Authentication Module (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Users Module (`/users`)
- `GET /users/all-users` - Get all users (admin only, requires JWT + admin role)
- `GET /users/browse` - Browse users (requires JWT + completed profile)

### Profile Module (`/profile`)
- Profile management endpoints (implementation in progress)

### Matching Module (`/matching`)
- Matching algorithm endpoints (placeholder implementation)

## Current Implementation Status

### ✅ Completed Features
1. **User Authentication System**
   - JWT-based authentication
   - User registration and login
   - Password hashing with bcrypt
   - Role-based access control (USER, ADMIN)

2. **User Management**
   - User entity with TypeORM
   - Basic CRUD operations
   - Email uniqueness validation

3. **Profile System**
   - Profile entity with developer-specific fields
   - Tech stack, experience level, GitHub/LinkedIn links
   - Gender and preferences
   - Profile completion tracking

4. **Security & Guards**
   - JWT authentication guard
   - Role-based authorization guard
   - Profile completion guard
   - Input validation and sanitization

5. **Database Setup**
   - MySQL database configuration
   - TypeORM integration
   - Migration system setup

### 🚧 In Progress / Partially Implemented
1. **Profile Management**
   - Profile CRUD operations (service implemented, controller needs completion)
   - Profile completion validation

2. **User Browsing**
   - Basic user listing functionality
   - Profile filtering based on preferences

### ❌ Not Yet Implemented
1. **Matching Algorithm**
   - Developer compatibility scoring
   - Match recommendations
   - Match history and preferences

2. **Communication Features**
   - Chat/messaging system
   - Match notifications

3. **Email Verification**
   - Email verification tokens
   - Verification email sending

4. **Advanced Features**
   - File upload for profile pictures
   - Social login integration
   - Advanced filtering and search

## Environment Configuration

Required environment variables (`.env` file):
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=dev_dating_app
JWT_SECRET=your_jwt_secret_key
```

## Next Development Priorities

### High Priority (Immediate)
1. **Complete Profile Module**
   - Finish profile controller implementation
   - Add profile update endpoints
   - Implement profile picture upload

2. **Implement Matching Algorithm**
   - Create compatibility scoring based on:
     - Tech stack overlap
     - Experience level compatibility
     - Location proximity
     - Preferences matching

3. **Add Email Verification**
   - Implement email verification tokens
   - Send verification emails with nodemailer
   - Update user registration flow

### Medium Priority (Short-term)
1. **Enhanced User Browsing**
   - Advanced filtering options
   - Pagination and sorting
   - Search functionality

2. **Chat System**
   - Real-time messaging with WebSocket
   - Message history
   - Match-based chat restrictions

3. **API Documentation**
   - Complete Swagger documentation
   - Add detailed endpoint descriptions

### Low Priority (Long-term)
1. **Social Features**
   - Social media integration
   - Profile recommendations
   - User reporting system

2. **Performance & Scaling**
   - Redis caching implementation
   - Database query optimization
   - File storage optimization

## Development Commands

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Database migrations
npm run migration:generate
npm run migration:run

# Code formatting
npm run format

# Linting
npm run lint
```

## Key Files to Understand

1. **`src/app.module.ts`** - Root module with all imports
2. **`src/modules/auth/auth.service.ts`** - Authentication logic
3. **`src/modules/users/users.service.ts`** - User management logic
4. **`src/modules/profile/profile.service.ts`** - Profile management logic
5. **`src/common/guards/`** - Security guards
6. **`src/config/database.config.ts`** - Database configuration

## Architecture Patterns Used

- **Modular Architecture** - Feature-based module separation
- **Dependency Injection** - NestJS DI container
- **Repository Pattern** - TypeORM repositories
- **Guard Pattern** - Authentication and authorization
- **Decorator Pattern** - Custom decorators for metadata
- **DTO Pattern** - Data transfer objects for validation

## Current Development State

The project is in **early development phase** with core authentication and user management systems in place. The foundation is solid with proper security measures, database schema, and modular architecture. The next phase should focus on completing the profile management and implementing the matching algorithm to make the app functional.

**Estimated Completion**: Basic MVP can be achieved in 2-3 weeks focusing on:
1. Profile management completion
2. Basic matching algorithm
3. Simple chat functionality

**Technical Debt**: Minimal, code follows NestJS best practices with proper separation of concerns.
