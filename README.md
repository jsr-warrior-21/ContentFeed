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
- **Medium-Inspired Next.js Web Application**:
  - Clean, minimalist aesthetic design matching editorial Medium layout.
  - Responsive content cards with left text description and right image thumbnail.
  - Dynamic read-time calculation, category filter tabs, and toast notifications.

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
│   │   ├── components/      # Navbar, FeedCard, CategoryFilter, ContentModal, AuthModal
│   │   ├── context/         # AuthContext state management
│   │   ├── lib/             # Axios API client (importing env var)
│   │   └── types/           # TypeScript definitions
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Deployment Guide (Vercel & Render)

### STEP 1: Deploy Backend Service on Render

1. Go to [Render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository `jsr-warrior-21/ContentFeed`.
3. Configure the following fields:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables under Render's **Environment** tab:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.mongodb.net/content_feed_db?retryWrites=true&w=majority`
   - `JWT_SECRET` = `your_production_jwt_secret_key_2026`
   - `CLIENT_URL` = `https://your-frontend-app.vercel.app`
5. Click **Create Web Service**. Save your live backend URL (e.g. `https://content-feed-backend.onrender.com`).

---

### STEP 2: Deploy Frontend Client on Vercel

1. Go to [Vercel.com](https://vercel.com) and click **Add New** → **Project**.
2. Select your GitHub repository `jsr-warrior-21/ContentFeed`.
3. Configure build settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click edit and select `frontend`
4. Add Environment Variable under Vercel project settings:
   - `NEXT_PUBLIC_API_URL` = `https://content-feed-backend.onrender.com/api/v1` *(Your Render backend URL)*
5. Click **Deploy**.

---

### 🔑 Environment Variables Summary

#### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGODB_URI` | MongoDB Atlas URI | `mongodb+srv://<username>:<password>@cluster0.mongodb.net/content_feed_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key_content_feed_platform_2026` |
| `CLIENT_URL` | Frontend origin allowed for CORS | `http://localhost:3000` |

#### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Production REST API Base URL | `https://content-feed-backend.onrender.com/api/v1` |

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

#### Login User
- **POST** `/api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```

---

### 2. Content Feed Endpoints

#### Fetch Paginated Feed
- **GET** `/api/v1/feed?page=1&limit=20&sort=latest`

#### Fetch Single Article Detail
- **GET** `/api/v1/feed/:id`

---

### 3. Bookmark Endpoints (Authenticated)

#### Add Bookmark
- **POST** `/api/v1/feed/:id/bookmark`
- **Headers:** `Authorization: Bearer <TOKEN>`

#### Remove Bookmark
- **DELETE** `/api/v1/feed/:id/bookmark`
- **Headers:** `Authorization: Bearer <TOKEN>`

#### List User Bookmarks
- **GET** `/api/v1/bookmarks`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## 🗄️ Database Design & Decisions

1. **User Schema (`User`)**:
   - `email`: Indexed, lowercase, unique constraint. Hashed using `bcrypt`.
2. **Content Schema (`Content`)**:
   - Indexed on `publishedAt` (`{ publishedAt: -1, _id: -1 }`) for fast feed sorting.
3. **Bookmark Schema (`Bookmark`)**:
   - **Compound Unique Index**: `bookmarkSchema.index({ user: 1, content: 1 }, { unique: true })`. Enforces zero duplicate bookmarks.
