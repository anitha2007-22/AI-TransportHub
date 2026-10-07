# AI TransportHub — Backend API

Node.js + Express + MongoDB REST API. All AI calls (Claude) run server-side only.

## Quick start

```bash
cd ai-transporthub-backend
npm install
cp .env.example .env       # fill in MONGO_URI + ANTHROPIC_API_KEY at minimum
npm run dev                # → http://localhost:4000
```

## API Base URL

```
http://localhost:4000/api
```

## Authentication

All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

Get a token by calling `POST /api/auth/login`.

---

## Endpoint Reference

### Auth  `/api/auth`

| Method | Path                  | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| POST   | `/register`           | —    | Register new user              |
| POST   | `/login`              | —    | Login, returns JWT             |
| GET    | `/me`                 | ✅   | Get current user profile       |
| POST   | `/refresh-token`      | —    | Refresh JWT with refresh token |
| POST   | `/verify-email`       | —    | Confirm email with token       |
| POST   | `/forgot-password`    | —    | Send password reset email      |
| POST   | `/reset-password`     | —    | Reset password with token      |
| PUT    | `/update-password`    | ✅   | Change password (logged in)    |

### Trips  `/api/trips`

| Method | Path        | Auth | Description                            |
|--------|-------------|------|----------------------------------------|
| POST   | `/plan`     | ✅   | Generate AI route options (no save)    |
| POST   | `/insight`  | ✅   | Get Claude AI tip for a selected route |
| GET    | `/stats`    | ✅   | Weekly carbon + savings aggregation    |
| GET    | `/`         | ✅   | Trip history (paginated)               |
| POST   | `/`         | ✅   | Save a completed trip                  |
| DELETE | `/:id`      | ✅   | Delete a trip                          |

### Reports  `/api/reports`

| Method | Path            | Auth            | Description                     |
|--------|-----------------|-----------------|----------------------------------|
| POST   | `/`             | ✅              | Submit report (+ image upload)   |
| GET    | `/`             | —               | List all reports (public)        |
| GET    | `/my`           | ✅              | Authenticated user's reports     |
| GET    | `/:id`          | —               | Single report detail             |
| PUT    | `/:id/status`   | ✅ authority/admin | Update report status           |
| POST   | `/:id/upvote`   | ✅              | Community upvote                 |
| DELETE | `/:id`          | ✅              | Delete own report or admin       |

### AI  `/api/ai`  (rate limited: 30/hr)

| Method | Path                | Auth | Description                          |
|--------|---------------------|------|--------------------------------------|
| POST   | `/route-insight`    | ✅   | Claude AI tip for a trip             |
| POST   | `/traffic-briefing` | ✅   | City-wide traffic summary            |
| GET    | `/eco-tip`          | ✅   | Personalised carbon improvement tip  |
| POST   | `/voice`            | ✅   | NLU for voice assistant (multilingual)|

### Notifications  `/api/notifications`

| Method | Path               | Auth      | Description                    |
|--------|--------------------|-----------|--------------------------------|
| GET    | `/`                | ✅        | Get notifications (+ unread count) |
| PUT    | `/mark-all-read`   | ✅        | Mark all as read               |
| DELETE | `/`                | ✅        | Clear all notifications        |
| PUT    | `/:id/read`        | ✅        | Mark one as read               |
| DELETE | `/:id`             | ✅        | Dismiss one                    |
| POST   | `/broadcast`       | ✅ admin  | Broadcast to all users         |

### Admin  `/api/admin`

| Method | Path                        | Auth            | Description              |
|--------|-----------------------------|-----------------|--------------------------|
| GET    | `/users`                    | ✅ admin        | Paginated user list      |
| PUT    | `/users/:id`                | ✅ admin        | Change role/status       |
| DELETE | `/users/:id`                | ✅ admin        | Delete user              |
| GET    | `/analytics`                | ✅ admin/authority | City-wide stats        |
| GET    | `/traffic-incidents`        | ✅ admin/authority | List incidents         |
| POST   | `/traffic-incidents`        | ✅ admin/authority | Create incident        |
| PUT    | `/traffic-incidents/:id/clear` | ✅ admin/authority | Clear incident      |

---

## Folder structure

```
src/
├── config/
│   ├── db.js              MongoDB connection
│   ├── cloudinary.js      Cloudinary SDK
│   └── logger.js          Winston logger
├── controllers/
│   ├── authController.js  Register · Login · Verify · Reset
│   ├── tripController.js  Plan · Save · History · Stats
│   ├── reportController.js Submit · Upvote · Status update
│   ├── notificationController.js Read · Mark · Broadcast
│   ├── aiController.js    Route insight · Traffic · Eco · Voice
│   └── adminController.js Users · Analytics · Incidents
├── middleware/
│   ├── auth.js            JWT protect + role authorize
│   ├── errorHandler.js    Global error → JSON
│   ├── upload.js          Multer + Cloudinary upload
│   └── rateLimiter.js     api / auth / ai rate limits
├── models/
│   ├── User.js            name · email · role · ecoScore
│   ├── Trip.js            from/to · mode · carbon metrics
│   ├── Report.js          type · location · image · upvotes
│   ├── Notification.js    category · read · push tracking
│   └── TrafficIncident.js type · severity · active · coords
├── routes/
│   ├── authRoutes.js
│   ├── tripRoutes.js
│   ├── reportRoutes.js
│   └── aiRoutes.js        also exports notificationRouter + adminRouter
├── services/
│   ├── aiService.js       All Claude API calls (server-side only)
│   ├── emailService.js    Nodemailer templates
│   ├── notificationService.js Firebase FCM + in-app
│   ├── carbonService.js   IPCC emission factors + eco score
│   └── routeService.js    Route generation + multi-factor AI scoring
├── utils/
│   └── (helpers as needed)
└── server.js              Express app entry point
tests/
└── auth.test.js           Supertest integration tests
```

## Environment variables

See `.env.example` for full list. Minimum required to run:
```
MONGO_URI=mongodb://localhost:27017/ai-transporthub
JWT_SECRET=any-long-random-string
ANTHROPIC_API_KEY=sk-ant-...
```
