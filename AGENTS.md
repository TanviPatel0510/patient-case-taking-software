# Agent Rules & Full-Stack Architectural Guidelines

This document defines the strict development, architectural, and coding standards for this project across both frontend and backend. All AI agents and developers working on this codebase must follow these rules.

---

# Part 1: Frontend Architectural Guidelines (React + Vite)

## 1. Core Technology Stack

Build and maintain the client project exclusively as a **React + Vite frontend application**.
Do not mix backend, mobile-app, or React Native conventions into the frontend.

* **Framework & Core**: React using functional components and hooks.
* **Build Tool**: Vite.
* **Routing**: React Router (`react-router-dom`).
* **Styling**: Tailwind CSS as the primary styling system.
* **HTTP Client**: Axios with a centralized shared instance (`src/api/axiosInstance.js` or `src/services/api.client.js`).
* **Icons**: Lucide React (`lucide-react`) and other configured icon libraries.
* **Forms**: React Hook Form for complex forms.
* **Notifications**: React Hot Toast for success and error toast notifications.
* **Language**: JavaScript with JSX (`.jsx`) unless TypeScript is explicitly requested.
* **Restrictions**: Do not introduce another CSS framework or component library (e.g. Bootstrap, MUI, Chakra, AntD) unless explicitly requested.

---

## 2. Directory & File Structure

All frontend source code resides under `src/` (or `client/src/`) organized by responsibility:

```text
src/
├── api/
│   └── axiosInstance.js       # Centralized Axios client & interceptors
├── assets/                    # Static assets (images, icons, media)
├── components/                # Reusable presentation UI components
│   └── SharedComponent.jsx
├── config/                    # Environment variables and app configuration
│   └── env.js
├── constants/                 # Roles, navigation configs, and enums
│   ├── roles.js
│   └── navigation.js
├── context/                   # Global React Context providers (state management)
│   └── AuthContext.jsx
├── pages/                     # Route-level screens / view containers
│   ├── patient/               # Patient-specific screens
│   ├── doctor/                # Doctor-specific screens
│   ├── kiosk/                 # Kiosk-specific screens
│   ├── triage_nurse/          # Triage nurse screens
│   ├── admin/                 # Admin screens
│   ├── Login.jsx              # Common public pages
│   └── Register.jsx
├── routes/                    # Route guards (ProtectedRoute, RoleProtectedRoute)
├── services/                  # Domain-specific API calls & server operations
│   └── feature.service.js
├── utils/                     # Pure utility helpers and transformations
│   └── feature.utils.js
├── App.jsx                    # Root routing and application composition
├── index.css                  # Global Tailwind styles & directives
└── main.jsx                   # Vite application entry point
```

### Folder Responsibilities:
* `pages/`: Route-level screens; coordinates UI behavior and connects services to presentation. Sub-folders for each role (`patient/`, `doctor/`, `kiosk/`, etc.).
* `components/`: Reusable, modular UI components focused on presentation (e.g. `DashboardLayout.jsx`, `ErrorBoundary.jsx`).
* `services/`: API communication, feature-specific server calls, data fetching.
* `api/`: Shared Axios configuration, base URL, headers, and request/response interceptors.
* `context/`: Global application state (e.g., authentication, session management).
* `utils/`: Pure helper functions, formatters, and data transformation logic.
* `config/`: Environment configuration (`VITE_*`) and runtime constants.
* `assets/`: Local static assets, logos, and images.

---

## 3. File Naming Conventions

Maintain strict naming consistency across all files:

| Type | Format | Example |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.jsx` | `LocationSection.jsx`, `DashboardLayout.jsx` |
| **Pages** | `PascalCase.jsx` | `Login.jsx`, `PatientDashboard.jsx` |
| **Contexts** | `PascalCaseContext.jsx` or `PascalCase.jsx` | `AuthContext.jsx` |
| **API Services** | `feature.service.js` *(singular)* | `auth.service.js`, `patients.service.js` |
| **Utilities** | `feature.utils.js` | `format.utils.js` |
| **Axios Instance** | `api/axiosInstance.js` | `src/api/axiosInstance.js` |

* **Rule**: Always use the singular `.service.js` suffix (e.g. `patient.service.js`). Do not use `.services.js` unless already established for that specific module.

---

## 4. Component Rules

* **Functional Components Only**: Use functional React components with standard hooks (`useState`, `useEffect`, `useContext`, `useNavigate`, `useLocation`, etc.).
* **Single Responsibility**: Keep components focused on one responsibility. Extract repeated UI blocks into reusable components.
* **No Direct Heavy API Logic in Presentational Components**: Do not place large API calls or network orchestration directly inside reusable presentational components. Pass data and callbacks via props or custom hooks.
* **Readability & Naming**:
  * Use clear, descriptive variable and function names.
  * Avoid single-letter variables (e.g., use `patient` or `profile` instead of `p`).
  * Keep JSX clean and avoid deeply nested ternary expressions.
* **List Keys**: Always use stable, unique keys (such as `item.id`) when rendering lists; never use array indices as keys for dynamic lists.
* **Comprehensive States**: Explicitly handle **loading**, **empty**, **success**, and **error** states on all data-driven components.
* **Defensive Rendering**: Never attempt to render raw JavaScript objects directly into JSX children. Always format or extract primitive strings/numbers to prevent unhandled React render crashes.

---

## 5. Routing Rules

* **React Router**: Define application routes in `App.jsx` using declarative `<Routes>` and `<Route>` components.
* **Separation of Access**:
  * Clearly separate public routes (e.g. `/`, `/login`, `/register`) from protected routes.
  * Use reusable route guards:
    * `ProtectedRoute`: Authenticated gatekeeper checking login status.
    * `RoleProtectedRoute`: Authorization gatekeeper checking user roles.
  * Redirect unauthenticated users to `/login`, preserving their target URL (`state: { from: location }`).
  * On role mismatch (e.g. Patient accessing `/doctor/*`), pass a `roleMismatch: true` state flag to prevent infinite redirect loops between guest wrappers and protected routes.
* **Layout Wrappers**: Wrap authenticated pages with a shared shell/layout component such as `DashboardLayout.jsx`.
* **URL Formatting**: Keep all route paths lowercase and kebab-case (e.g. `/patient/dashboard`, `/doctor/queue`).

---

## 6. API & Network Communication Rules

* **Centralized Axios Client**:
  * Always use the shared Axios instance from `src/api/axiosInstance.js` or `src/services/api.client.js`.
  * Never instantiate separate `axios.create()` instances inside pages or components.
* **Environment Variables**:
  * Store the API base URL in `VITE_API_URL` (configured via `src/config/env.js`).
  * Never hardcode backend URLs, secrets, or private API keys in client source code.
* **Service Encapsulation**:
  * Keep all API calls inside `src/services/`.
  * Export small, named functions from service files.
  * Avoid constructing raw request bodies inside page JSX.
* **Error Handling & Interceptors**:
  * Use Axios interceptors for shared behavior: attaching authorization tokens, handling expired sessions (401), and global error handling.
  * Return or re-throw sanitized errors consistently so caller components can handle or display toast notifications.

---

## 7. State Management Rules

* **Local vs Global**:
  * Use local state (`useState`, `useReducer`) for page-specific or UI-only states (modals, active tabs, form inputs).
  * Use React Context (`src/context/`) for global cross-cutting state (e.g. authenticated user, session data, permissions).
  * Do not add Redux, MobX, or other third-party state managers unless explicitly requested.
* **Context Design**:
  * Expose clear, predictable actions from context (e.g. `login`, `logout`, `checkAuth`, `selectProfile`).
  * Clean up authentication tokens, cookie sessions, and Axios authorization headers during `logout`.
  * Handle initial verification loading states cleanly before rendering protected screens.

---

## 8. Styling & Visual Design Rules

* **Tailwind CSS First**:
  * Use Tailwind utility classes directly in JSX.
  * Keep `index.css` limited to Tailwind directives (`@theme`, `@import "tailwindcss"`, base body styles, and keyframe animations).
  * Do not create separate `.css` or `.module.css` files per component.
* **Responsive Layouts**:
  * Build mobile-friendly layouts first.
  * Use standard responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`.
  * Tables must be horizontally scrollable on mobile screens (`overflow-x-auto`).
* **Design Aesthetic**:
  * Restrained, professional dashboard aesthetic.
  * White content surfaces (`bg-white`), subtle neutral backgrounds (`bg-gray-50` or `#f4f9f7`), crisp borders (`border-gray-200` or `#d1e2dc`), and high-contrast typography (`text-gray-900` / `#143337`).
  * Consistent border-radius (`rounded-xl`, `rounded-2xl`) and shadow levels.
* **Icons & Buttons**:
  * Use Lucide React icons (`lucide-react`) or configured icon packs (e.g. `@remixicon/react`). Never hand-craft inline SVG paths when library icons exist.
  * Icon-only buttons must include an accessible `aria-label` or `title`.
  * Provide visible hover, focus-visible, active, and disabled states on interactive elements.

---

## 9. UX, Feedback & Accessibility

* **Toast Notifications**:
  * Use `react-hot-toast` for short-lived feedback (e.g., *"Profile updated successfully"*, *"Session expired"*).
  * Do not use toast for persistent, essential information that users must continuously see.
* **Accessibility**:
  * Use semantic HTML elements (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<button>`).
  * Do not rely solely on color to convey status (e.g., include icons and textual indicators).
  * Provide confirmation modals/prompts before destructive actions (e.g. delete, logout).

---

## 10. Checklist Before Completing Any Frontend Change

Before finishing any change, verify:
- [ ] New and modified files follow `PascalCase.jsx` (components/pages) and `feature.service.js` (services) conventions.
- [ ] API requests go through the services layer and utilize the shared Axios instance.
- [ ] Styling strictly adheres to Tailwind CSS without ad-hoc inline styles.
- [ ] Loading, error, empty, and success states are handled.
- [ ] Authentication guards and role protection logic are preserved.
- [ ] Application builds without errors (`npm run build`).
- [ ] Files changed and verification steps are accurately reported.

---

# Part 2: Backend Architectural Guidelines (Node.js + Express + MongoDB)

## 1. Technology Rules

Use:
- **Runtime & Framework**: Node.js and Express.js
- **Module System**: ES modules with `"type": "module"` in `package.json`
- **Database & ORM**: MongoDB with Mongoose
- **Authentication**: JWT for authentication
- **Password Security**: bcryptjs for password hashing
- **Environment Management**: dotenv for environment variables
- **Security Headers**: Helmet
- **CORS**: CORS with an explicit allowlist
- **Rate Limiting**: express-rate-limit for sensitive endpoints (auth, OTP, payments)
- **Validation**: express-validator or custom validation middleware
- **File Uploads**: Multer for file uploads
- **Media Hosting**: Cloudinary (or configured cloud storage) for hosted files and images
- **Real-Time**: Socket.IO for real-time updates when required
- **Email Delivery**: Nodemailer or an external email API for email delivery

**Restriction**: Do not introduce another web framework or ORM unless explicitly requested.

---

## 2. Project Structure

Follow this structure (in `backend/` or `server/`):

```text
server/ (or backend/)
├── server.js
├── env-template.txt
├── nodemon.json
├── package.json
└── src/
    ├── app.js
    ├── config/
    │   ├── config.js
    │   └── db.js
    ├── controllers/
    │   └── feature.controller.js
    ├── middlewares/
    │   ├── feature.middleware.js
    ├── models/
    │   └── Feature.js
    ├── routes/
    │   └── feature.routes.js
    └── utils/
        └── feature.utils.js
```

### Folder Responsibilities:
- `config/`: Database, environment, storage service (Cloudinary, AWS), and external service setup.
- `controllers/`: Request handlers and feature business orchestration.
- `middlewares/`: Authentication, authorization, validation, uploads, logging, and request guards.
- `models/`: Mongoose schemas and models.
- `routes/`: Endpoint definitions and middleware composition.
- `utils/`: Reusable pure helpers and small service-independent utilities.
- `app.js`: Express application configuration and route registration.
- `server.js`: HTTP server startup, database connection, and Socket.IO setup.

---

## 3. File Naming Rules

Use these naming conventions consistently:
- **Routes**: `feature.routes.js` (e.g. `auth.routes.js`, `patient.routes.js`)
- **Controllers**: `feature.controller.js` (e.g. `auth.controller.js`, `patient.controller.js`)
- **Models**: `PascalCase.js` (e.g. `User.js`, `Patient.js`, `Order.js`)
- **Middleware**: `feature.middleware.js` (e.g. `auth.middleware.js`, `validation.middleware.js`)
- **Utilities**: `feature.utils.js` or descriptive kebab-case (e.g. `cloudinary-upload.js`, `otp.js`, `authCookie.js`)
- **Configuration**: Descriptive lowercase names (e.g. `config.js`, `db.js`)

* **Rule**: Use singular `.controller.js`, `.middleware.js`, and `.service.js` suffixes where applicable. Use `.routes.js` for route modules.
* **ES Modules Requirement**: Every local import must include the `.js` extension (e.g., `import connectDB from './config/db.js'`).

---

## 4. Application Bootstrap

Keep responsibilities strictly separated:

- `server.js` should start Express or HTTP server.
- `server.js` must connect to MongoDB before accepting requests.
- `server.js` must configure Socket.IO when real-time communication is required.
- `app.js` must configure Express middleware and routes.
- Do not connect to the database inside individual controllers or route files.
- Do not call `app.listen()` from `app.js` if the server is started from `server.js`.

Example:
```javascript
// server.js
import 'dotenv/config';
import { createServer } from 'http';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

---

## 5. Express Middleware Order

Configure middleware in a deliberate order:

1. Load environment variables.
2. Add Helmet and security headers.
3. Configure CORS with explicit allowed origins.
4. Parse JSON request bodies (`express.json()`).
5. Parse cookies if cookies are used (`cookieParser()`).
6. Serve public static files if required.
7. Add request logging.
8. Add API version checks if required.
9. Register application routes (`/api/*`).
10. Register static upload routes if required.
11. Register the 404 handler for unhandled endpoints.
12. Register a centralized error handler.

* **Rule**: Use an explicit CORS allowlist from environment variables. Do not use unrestricted CORS (`*`) in production.

---

## 6. Route Rules

- Routes should define the API contract and compose middleware. Keep business logic out of route files.
- Use REST-style routes:
  - `GET /resources`
  - `GET /resources/:id`
  - `POST /resources`
  - `PUT /resources/:id`
  - `PATCH /resources/:id`
  - `DELETE /resources/:id`
- Use lowercase kebab-case route paths.
- Use route prefixes in `app.js`:
  ```javascript
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', ordersRoutes);
  app.use('/api/patients', patientRoutes);
  ```
- Use separate route modules for admin endpoints:
  - `routes/admin.auth.routes.js`
  - `routes/admin.users.routes.js`

Example:
```javascript
import express from 'express';
import * as orderController from '../controllers/orders.controller.js';
import { auth, shopOwnerAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/shop/my-orders', auth, shopOwnerAuth, orderController.getShopOrders);
router.put('/:orderId/status', auth, shopOwnerAuth, orderController.updateOrderStatus);

export default router;
```

---

## 7. Controller Rules

- Export named controller functions.
- Use `async` functions for database and external service operations.
- Keep controllers responsible for:
  - Reading request data (`req.params`, `req.query`, `req.body`)
  - Calling models or utilities
  - Applying business rules
  - Returning HTTP responses
- Keep route definitions out of controllers.
- Keep reusable pure logic in `utils/`.
- Avoid creating overly large controllers; split unrelated feature areas into separate controller files.
- Return immediately after sending an error response (e.g. `return res.status(400).json(...)`).
- Do not expose passwords, password hashes, OTP hashes, API keys, or private credentials.
- Use consistent response shapes.

Example:
```javascript
import Order from '../models/Order.js';

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    return res.json(order);
  } catch (error) {
    console.error('Get order error:', error);

    return res.status(500).json({
      message: 'Failed to fetch order'
    });
  }
};
```

---

## 8. Response Rules

Use meaningful HTTP status codes:
- `200`: Successful read or update
- `201`: Successful creation
- `204`: Successful deletion with no response body
- `400`: Invalid request data
- `401`: Missing or invalid authentication
- `403`: Authenticated user lacks permission
- `404`: Resource not found
- `409`: Conflict
- `429`: Rate limit exceeded
- `500`: Unexpected server error
- `502`: External service failure

Use a consistent JSON response format:
```json
{
  "message": "Human-readable result",
  "data": {}
}
```

For validation failures, include the relevant field where useful:
```json
{
  "message": "Invalid email format",
  "field": "email"
}
```

* **Rule**: Do not return raw stack traces or sensitive error details to clients in production.

---

## 9. MongoDB and Mongoose Rules

- Create one model per domain entity.
- Use PascalCase model filenames (e.g. `User.js`, `Patient.js`).
- Use singular model names.
- Add `timestamps: true` where creation and update dates are needed.
- Add schema validation for required values, enums, formats, and ranges.
- Use indexes for frequently queried fields.
- Use `.select('-password')` or equivalent projections for sensitive fields.
- Use `.lean()` for read-only queries where appropriate.
- Validate and authorize resource ownership before updating or deleting data.
- Avoid unbounded queries and unnecessary population.
- Use transactions for operations that must succeed or fail together.
- Keep database connection logic inside `config/db.js`.

Example:
```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Order', orderSchema);
```

---

## 10. Authentication and Authorization

- Use JWT authentication.
- Read bearer tokens from the `Authorization` header (`Bearer <token>`) or configured secure HTTP-only cookies.
- Verify tokens using the configured JWT secret.
- Load the authenticated user from the database.
- Attach the authenticated user to `req.user` (or `req.auth`).
- Exclude sensitive fields such as passwords from queries.
- Return `401` for missing or invalid tokens.
- Return `403` when the user has the wrong role.
- Create role-specific middleware such as:
  - `auth` / `requireAuth`
  - `roleAuth(['doctor', 'admin'])`
- Always verify that the authenticated user owns or may access the requested resource.

Example:
```javascript
const token = req.header('Authorization')?.replace('Bearer ', '');

if (!token) {
  return res.status(401).json({
    message: 'Authentication required'
  });
}
```

---

## 11. Password and OTP Rules

- Hash passwords with bcrypt before saving.
- Never store plaintext passwords.
- Never return passwords in API responses.
- Hash OTP values before storing them.
- Add expiration times to OTP records.
- Limit OTP attempts.
- Rate-limit OTP endpoints.
- Mark OTP records as used after successful verification.
- Do not return OTP values in API responses, including development responses.
- Use generic authentication errors where necessary to reduce user enumeration risk.

---

## 12. Validation and Sanitization

- Validate request bodies before controllers execute.
- Use reusable middleware from `validation.middleware.js` or express-validator.
- Validate email, phone, identifiers, numeric values, enum values, and nested objects.
- Trim and normalize values where appropriate.
- Reject unexpected or unsafe input.
- Do not rely only on frontend validation.
- Validate uploaded files by MIME type, extension, file size, and expected content where possible.
- Never build database queries directly from untrusted input without validation.

---

## 13. File Uploads

- Use Multer middleware for multipart requests.
- Restrict allowed MIME types and file extensions.
- Enforce file size limits.
- Store temporary uploads safely.
- Upload permanent files to configured storage provider (e.g. Cloudinary, S3).
- Do not expose local temporary files unnecessarily.
- Delete temporary files after successful or failed processing when applicable.
- Keep upload configuration in `src/config/`.
- Keep upload middleware in `src/middlewares/`.

---

## 14. External Services

Keep external service setup centralized:
- Storage provider configuration: `config/storageProvider.js` or `config/cloudinary.js`
- Payment configuration and operations: Payment-related controllers/config
- Email configuration: Environment variables or a dedicated utility
- Socket.IO initialization: `server.js`
- Database connection: `config/db.js`

**Never hardcode**:
- JWT secrets
- Database credentials
- Storage provider secrets
- Payment secrets
- Email API keys
- Encryption keys

---

## 15. Environment Variables

- Use `.env` locally and provide `env-template.txt` with variable names only.
- Read environment variables through a centralized `config/config.js` or `config/env.js` module.
- Validate required variables at startup:

```javascript
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingVars = requiredVars.filter((name) => !config[name]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}
```

* **Rule**: Never commit `.env` files or real secrets to source control.

---

## 16. Security Rules

- Use Helmet.
- Configure CORS with explicit allowed origins.
- Use rate limiting for login, registration, OTP, password reset, and payment verification endpoints.
- Validate and sanitize all external input.
- Use parameterized Mongoose queries.
- Protect against unauthorized resource access.
- Do not log passwords, tokens, OTPs, payment secrets, or personal data unnecessarily in production. Can log in development.
- Return generic errors in production.
- Configure secure cookies if cookies are used (`httpOnly`, `secure`, `sameSite`).
- Use HTTPS in production.
- Verify payment signatures on the backend if any.
- Never trust payment status received directly from the frontend if any.
- Verify webhook signatures when payment providers support webhooks.
- Keep dependency versions updated and audit dependencies regularly.

---

## 17. Socket.IO Rules

Use Socket.IO only when real-time updates are required:
- Initialize Socket.IO in `server.js`.
- Attach the instance to the Express app if controllers need access:
  ```javascript
  app.set('io', io);
  ```
- Use predictable room names.
- Authenticate socket connections when sensitive data is involved.
- Do not broadcast private order or customer data to public rooms.
- Emit events after successful database updates.
- Use descriptive event names such as:
  - `order_status_updated`
  - `new_order`
  - `payment_updated`

---

## 18. Logging

- Use the shared logger middleware for request logging.
- Log useful operational information without exposing secrets.
- Log errors with enough context to diagnose them.
- Avoid logging authorization headers, passwords, OTPs, and payment secrets.
- Use appropriate log levels in production.

---

## 19. Error Handling

- Always handle rejected promises.
- Use `try/catch` in async controllers or a shared async error wrapper.
- Add a centralized error-handling middleware for unexpected errors.
- Keep error responses consistent.
- Do not expose stack traces in production.
- Handle 404 routes separately from server errors.

---

## 20. Code Quality

- Preserve the existing project structure and naming conventions.
- Use the smallest focused change required.
- Do not mix frontend or mobile-app code into the backend.
- Reuse existing middleware, models, utilities, and configuration modules.
- Avoid duplicated authentication, validation, and database logic.
- Keep controllers focused.
- Do not add unnecessary abstractions.
- Use descriptive names instead of one-letter variables.
- Use comments only for non-obvious business rules.
- Do not commit changes unless explicitly requested.

---

## 21. Checklist Before Finishing Any Backend Change

Before completing any backend task, verify:
1. [ ] The file follows the correct naming convention (`feature.routes.js`, `feature.controller.js`, `PascalCase.js`).
2. [ ] All local ES module imports include `.js`.
3. [ ] Authentication and authorization are applied where required.
4. [ ] Request input is validated and sanitized.
5. [ ] Sensitive data (passwords, OTP hashes, secrets) is not returned or logged.
6. [ ] Database queries verify ownership and permissions.
7. [ ] Loading or external-service failures are handled.
8. [ ] The correct HTTP status codes are returned (`200`, `201`, `400`, `401`, `403`, `404`, `500`).
9. [ ] Environment variables are used for secrets and configuration.
10. [ ] The server starts and builds/tests pass without errors.
11. [ ] Files changed and verification steps are accurately reported.

Important backend naming conventions from the reference project:
- `auth.routes.js`
- `auth.controller.js`
- `auth.middleware.js`
- `validation.middleware.js`
- `User.js`
- `Order.js`
- `shop.multer.js`
- `cloudinary-upload.js`
