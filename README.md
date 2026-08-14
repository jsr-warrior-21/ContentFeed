# Content Feed Platform - Full-Stack Assignment

A production-grade, industry-standard Content Feed application built with **Node.js, Express, MongoDB (Mongoose)** for the backend service and **Next.js 14, React, Tailwind CSS** for the frontend client.

---

## 🌟 Key Features & Highlights

- **Clean Layered Architecture**: Strictly follows separation of concerns with `config/`, `controllers/`, `services/`, `models/`, `middleware/`, and `utils/`.
- **Zero Hardcoded Configuration**: All database URIs, secrets, ports, and CORS origins are imported from `.env` files using a central environment validator (`src/config/env.js`).
- **Robust Error Handling**: Centralized global error handling middleware catching custom `ApiError` instances, Mongoose validation errors, MongoDB duplicate keys (`E11000`), and JWT errors with appropriate HTTP status codes (`200`, `201`, `400`, `401`, `404`, `409`, `500`).
- **Database Optimization & Indexing**:
  - Compound Unique Index `{ user: 1, content: 1 }` on `Bookmark` to guarantee zero duplicate bookmarks at the MongoDB layer.
  - Compound Index `{ publishedAt: -1, _id: -1 }` on `Content` for fast sorted pagination.
- **RESTful Feed & Bookmark APIs**:
  - Public paginated feed with custom sort options (`latest`, `oldest`).
  - Single article detail view endpoint.
  - User authentication with JWT and bcrypt password hashing.
  - Authenticated bookmark addition, removal, and listing.
- **Next.js 14 Web Application**:
  - Modern UI built with Tailwind CSS and Lucide icons.
  - Interactive pagination, sorting, search filter, and tab views.
  - Tabbed Register & Login modals.
  - Skeleton loading states, error retry handling, and empty states.

---

## 🛠️ Project Structure

```text
content-feed-platform/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & MongoDB connection modules
│   │   ├── controllers/     # Express route handlers
│   │   ├── middleware/      # JWT auth guard, input validation & error handler
│   │   ├── models/          # Mongoose Schemas (User, Content, Bookmark)
│   │   ├── routes/          # RESTful endpoints (/auth, /feed, /bookmarks)
│   │   ├── services/        # Encapsulated business logic layer
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler, jwt helpers
│   │   ├── scripts/         # MongoDB seeder script
│   │   ├── app.js           # Express app initialization
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router (layout, page, globals.css)
│   │   ├── components/      # Navbar, FeedCard, ContentModal, AuthModal, Pagination
│   │   ├── context/         # AuthContext state management
│   │   ├── lib/             # Axios API client (importing env var)
│   │   └── types/           # TypeScript definitions
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Quick Setup & Local Installation

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/content_feed_db`) or MongoDB Atlas connection URI.

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your MongoDB URI if using Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/content_feed_db

# Seed initial content articles into MongoDB
npm run seed

# Start backend server in development mode (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/content_feed_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key_content_feed_platform_2026` |
| `JWT_EXPIRES_IN` | Token expiration period | `7d` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default / Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of backend REST API | `http://localhost:5000/api/v1` |

---

## 📚 REST API Documentation

### 1. Authentication Endpoints

#### Register User
- **POST** `/api/v1/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "66bc90e1f3a2b10012345678",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
    }
  }
  ```

#### Login User
- **POST** `/api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "66bc90e1f3a2b10012345678",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
    }
  }
  ```

---

### 2. Content Feed Endpoints

#### Fetch Paginated Feed
- **GET** `/api/v1/feed?page=1&limit=20&sort=latest`
- **Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Feed items retrieved successfully",
    "data": [
      {
        "id": "66bc90e1f3a2b10099999999",
        "title": "Understanding Next.js 15 App Router",
        "description": "Deep dive into Next.js 15 features...",
        "source": "TechCrunch",
        "url": "https://nextjs.org/docs",
        "image": "https://images.unsplash.com/photo-1618401471353",
        "publishedAt": "2026-08-14T09:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 12,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

#### Fetch Single Article Detail
- **GET** `/api/v1/feed/:id`
- **Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Content item retrieved successfully",
    "data": {
      "id": "66bc90e1f3a2b10099999999",
      "title": "Understanding Next.js 15 App Router",
      "description": "Deep dive into Next.js 15 features...",
      "source": "TechCrunch",
      "url": "https://nextjs.org/docs",
      "image": "https://images.unsplash.com/photo-1618401471353",
      "publishedAt": "2026-08-14T09:30:00.000Z"
    }
  }
  ```

---

### 3. Bookmark Endpoints (Authenticated)

#### Add Bookmark
- **POST** `/api/v1/feed/:id/bookmark`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "Content bookmarked successfully",
    "data": {
      "id": "66bc91f2f3a2b10088888888",
      "user": "66bc90e1f3a2b10012345678",
      "content": { ... }
    }
  }
  ```
- **Error Response (409 Conflict):** Attempting to bookmark an article twice returns `409 Conflict` with `"Content item is already bookmarked by this user."`

#### Remove Bookmark
- **DELETE** `/api/v1/feed/:id/bookmark`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Bookmark removed successfully"
  }
  ```

#### List User Bookmarks
- **GET** `/api/v1/bookmarks`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Response (200 OK):** Returns array of articles bookmarked by the authenticated user.

---

## 🗄️ Database Design & Decisions

1. **User Schema (`User`)**:
   - `email`: Indexed, lowercase, unique constraint.
   - `password`: Stored as a salted bcrypt hash; set to `select: false` so credentials are never returned in queries by default.
2. **Content Schema (`Content`)**:
   - Stores article metadata (`title`, `description`, `source`, `url`, `image`, `publishedAt`).
   - Indexed on `publishedAt` (`{ publishedAt: -1, _id: -1 }`) for fast feed sorting.
3. **Bookmark Schema (`Bookmark`)**:
   - Stores user-to-content relationship references.
   - **Compound Unique Index**: `bookmarkSchema.index({ user: 1, content: 1 }, { unique: true })`. This guarantees data integrity preventing race conditions or duplicate entries.

---

## 🧠 Architectural Decisions

1. **Service-Layer Encapsulation**: Controllers handle HTTP parsing, status code returning, and calling services. All core business rules (duplicate checks, database transactions, hashing) live inside the `services/` layer.
2. **Centralized Operational Error Boundary**: All async exceptions are caught by `asyncHandler` and passed to `errorMiddleware.js`. This guarantees consistent error response formats across all endpoints.
3. **No Hardcoded Constants**: Environment configurations are checked and validated centrally in `src/config/env.js` and `src/lib/api.ts`.
