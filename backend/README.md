# Skill Gap & Career Recommendation Backend

Backend API for **Developing a Web-based Technology for Measuring the Skill Gap and Recommending Careers for IT Students** — a final year capstone project.

Built with Node.js, Express.js, and MongoDB following clean MVC architecture.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Importing the Dataset](#importing-the-dataset)
6. [Running the Server](#running-the-server)
7. [Authentication](#authentication)
8. [API Documentation](#api-documentation)
9. [Skill Gap Algorithm](#skill-gap-algorithm)
10. [Admin Module](#admin-module)
11. [Response Format](#response-format)
12. [Security](#security)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **Other:** dotenv, cors, helmet, express-rate-limit, csv-parser, multer, validator, nodemon

---

## Project Structure

```
backend/
├── config/
│   ├── db.js                  # MongoDB connection
│   └── constants.js            # App-wide constants
├── controllers/
│   ├── authController.js       # Register / Login / Me
│   ├── studentController.js    # Profile & skills management
│   ├── jobController.js        # Job listing / detail / search
│   ├── recommendationController.js  # Career recommendation engine
│   ├── dashboardController.js  # Dashboard statistics
│   └── adminController.js      # Admin: job CRUD, user management, admin stats
├── middleware/
│   ├── auth.js                 # JWT protect / restrictTo
│   ├── errorHandler.js         # Global error + 404 handler
│   ├── validate.js              # Request validation
│   └── rateLimiter.js          # Rate limiting
├── models/
│   ├── User.js
│   └── Job.js
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── jobRoutes.js
│   ├── recommendationRoutes.js
│   ├── dashboardRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── apiResponse.js
│   ├── AppError.js
│   ├── asyncHandler.js
│   ├── jwt.js
│   └── skillMatcher.js
├── scripts/
│   ├── importJobs.js           # CSV → MongoDB import script
│   └── createAdmin.js          # Bootstrap the first admin account
├── dataset/
│   └── jobs.csv                # Source dataset
├── server.js
├── package.json
├── .env.example
└── README.md
```

---

## Installation

```bash
cd backend
npm install
cp .env.example .env
# then edit .env with your own values
```

### Prerequisites

- Node.js >= 18
- A running MongoDB instance (local or Atlas)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/skill_gap_db` |
| `JWT_SECRET` | Secret used to sign JWTs | `a_long_random_string` |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `200` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3000` |

---

## Importing the Dataset

The dataset CSV (`dataset/jobs.csv`) has these columns:

```
job_title, company, location, is_remote, role_category, seniority_level, is_aggregator, skills_str
```

`skills_str` is a comma-separated string (e.g. `"python, java, sql, aws"`). The import script converts it into a normalized, de-duplicated array on each Job document.

Run the import script:

```bash
npm run import:jobs
```

Options:

```bash
# Import a different CSV file
node scripts/importJobs.js path/to/other.csv

# Wipe existing jobs before importing
node scripts/importJobs.js --fresh

# Combine both
node scripts/importJobs.js path/to/other.csv --fresh
```

---

## Running the Server

```bash
# Development (auto-restart with nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000` (or whichever `PORT` you set).

Health check: `GET /health`

---

## Authentication

JWT-based authentication. Include the token in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_jwt_token>
```

### Register

`POST /api/auth/register`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123",
  "university": "State University",
  "degree": "B.Sc. Computer Science",
  "graduationYear": 2026,
  "skills": ["java", "sql", "git"]
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "jane@example.com",
  "password": "securePass123"
}
```

### Get current user

`GET /api/auth/me` *(Private)*

### Roles

Every user has a `role` of either `student` (default, assigned on public registration) or `admin`. Regular registration always creates `student` accounts — the `role` field is never accepted from the public register payload, so it can't be self-escalated.

To create the very first admin account, use the bootstrap script (see [Admin Module](#admin-module) below).

---

## API Documentation

### Student Module *(all Private — requires Bearer token)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/profile` | View profile |
| PUT | `/api/students/profile` | Update profile (name, university, degree, graduationYear) |
| GET | `/api/students/skills` | Get current skills |
| PUT | `/api/students/skills` | Replace entire skills list |
| POST | `/api/students/skills` | Add skill(s) |
| DELETE | `/api/students/skills` | Remove skill(s) |

Example — add skills:

```json
POST /api/students/skills
{
  "skills": ["docker", "kubernetes"]
}
```

### Job Module *(Public)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs` | List all jobs (paginated, sortable) |
| GET | `/api/jobs/:id` | Get a single job by ID |
| GET | `/api/jobs/search` | Search jobs |

Query parameters supported on `/api/jobs` and `/api/jobs/search`:

- `keyword` — matches job title, company, or skills
- `location` — partial, case-insensitive match
- `remote` — `true` / `false`
- `category` — exact match on `role_category`
- `seniority` — exact match on `seniority_level`
- `page` — page number (default `1`)
- `limit` — results per page (default `10`, max `100`)
- `sort` — e.g. `job_title`, `-createdAt`

Example:

```
GET /api/jobs/search?keyword=backend&remote=true&category=backend_developer&page=1&limit=10&sort=-createdAt
```

### Career Recommendation API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/recommendations` | Public | Recommend jobs for an arbitrary skill set |
| GET | `/api/recommendations/me` | Private | Recommend jobs based on logged-in student's saved skills |
| GET | `/api/recommendations/gap/:jobId` | Private | Skill gap analysis vs. one specific job |

Example request:

```json
POST /api/recommendations
{
  "skills": ["Java", "Spring Boot", "Git", "SQL"]
}
```

Example response:

```json
{
  "success": true,
  "message": "Career recommendations generated successfully.",
  "data": {
    "inputSkills": ["Java", "Spring Boot", "Git", "SQL"],
    "totalJobsEvaluated": 1172,
    "recommendations": [
      {
        "jobId": "6683f1...",
        "job": "Backend Developer",
        "company": "ABC",
        "location": "Remote",
        "is_remote": true,
        "role_category": "backend_developer",
        "seniority_level": "not specified",
        "score": 84,
        "matchedSkills": ["java", "sql", "git"],
        "missingSkills": ["spring boot"]
      }
    ]
  }
}
```

### Dashboard APIs *(mostly Public; top-recommended-jobs is Private)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Consolidated summary of all stats |
| GET | `/api/dashboard/total-jobs` | Total number of jobs |
| GET | `/api/dashboard/remote-jobs` | Remote vs onsite counts |
| GET | `/api/dashboard/categories` | Job counts by role category |
| GET | `/api/dashboard/seniority` | Job counts by seniority level |
| GET | `/api/dashboard/top-skills` | Most common skills (supports `?limit=`) |
| GET | `/api/dashboard/top-recommended-jobs` | Top 10 jobs for the logged-in student |

---

## Skill Gap Algorithm

For a given student's skills and a job's required skills:

```
matchedSkills = intersection(studentSkills, jobSkills)
missingSkills = jobSkills - studentSkills
score = (matchedSkills.length / jobSkills.length) × 100
```

All skills are normalized (trimmed, lowercased, de-duplicated) before comparison so that matching is case-insensitive and consistent (e.g. `"Node.js"` and `"node.js"` are treated as the same skill).

Recommendations are sorted by descending score, and the top 10 are returned by default.

---

## Admin Module

All routes under `/api/admin` require a valid Bearer token **and** `role: "admin"`. Requests from non-admin users receive `403 Forbidden`.

### Bootstrapping the first admin

Public registration only ever creates `student` accounts, so the first admin must be created from the command line:

```bash
npm run create:admin -- "Admin Name" admin@example.com StrongPass123
```

- If the email doesn't exist yet, a new admin user is created.
- If the email already exists as a student, it is promoted to admin.

Once you have one admin, further admins can be promoted through the API (see below).

### Job Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/jobs` | Create a new job posting |
| PUT | `/api/admin/jobs/:id` | Update a job (partial update supported) |
| DELETE | `/api/admin/jobs/:id` | Delete a single job |
| DELETE | `/api/admin/jobs` | Delete **all** jobs (use with caution) |
| POST | `/api/admin/jobs/import` | Re-run the CSV import from `dataset/jobs.csv` |

Example — create a job:

```json
POST /api/admin/jobs
Authorization: Bearer <admin_token>

{
  "job_title": "Frontend Developer",
  "company": "TechCorp",
  "location": "Remote",
  "is_remote": true,
  "role_category": "frontend_developer",
  "seniority_level": "mid",
  "is_aggregator": false,
  "skills": ["react", "javascript", "css", "git"]
}
```

Example — re-import the dataset, wiping existing jobs first:

```json
POST /api/admin/jobs/import
Authorization: Bearer <admin_token>

{
  "fresh": true
}
```

### User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | List all users (paginated, filter with `?role=student` or `?role=admin`) |
| GET | `/api/admin/users/:id` | Get a single user by ID |
| PUT | `/api/admin/users/:id/role` | Change a user's role (`student` ⇄ `admin`) |
| DELETE | `/api/admin/users/:id` | Delete a user account |

Notes:

- An admin cannot revoke their own admin role or delete their own account through these endpoints (prevents accidental lockout).

Example — promote a user to admin:

```json
PUT /api/admin/users/6683f1.../role
Authorization: Bearer <admin_token>

{
  "role": "admin"
}
```

### Admin Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | User counts (total/students/admins) and job counts (total/remote/aggregator) |

---

## Response Format

**Success:**

```json
{
  "success": true,
  "message": "Description of what happened",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Description of the error",
  "error": {}
}
```

---

## Security

- **Helmet** — sets secure HTTP headers
- **CORS** — restricts cross-origin requests to `CLIENT_URL`
- **JWT** — stateless authentication with configurable expiration
- **bcryptjs** — password hashing (10 salt rounds)
- **express-rate-limit** — general (200 req / 15 min) and stricter auth-route limits (20 req / 15 min)
- **dotenv** — secrets and config kept out of source code
- Centralized error handler that hides stack traces in production
