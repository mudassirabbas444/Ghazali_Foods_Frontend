# Frontend Code Organization - ROI Application

## 📁 Directory Structure Overview

The frontend is built with **React 19** and follows a feature-based folder structure with clear separation of concerns.

```
roi_frontend/
├── public/              # Static assets (HTML, images, manifest)
├── src/
│   ├── assets/         # Images, logos, static files
│   ├── components/     # Reusable UI components
│   ├── constants/      # Configuration, routes, API endpoints
│   ├── context/        # React Context providers (state management)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components (route-level components)
│   ├── services/       # API service layer
│   ├── utils/          # Utility functions
│   ├── App.js          # Main app component with routing
│   └── index.js        # Entry point
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

---

## 🎯 Core Architecture

### **1. Entry Point (`src/index.js`)**
- Renders the root `App` component
- Sets up React Router, Context Providers, and global styles
- Initializes error boundaries

### **2. Main App (`src/App.js`)**
- **Routing Configuration**: Defines all routes using React Router
- **Provider Wrapping**: Wraps app with multiple context providers:
  - `GoogleOAuthProvider` - Google authentication
  - `AuthProvider` - User authentication state
  - `AdminAuthProvider` - Admin authentication state
  - `ThemeProvider` - Dark/light theme
  - `AppProvider` - Global app state (notifications, etc.)
- **Route Protection**: Uses `ProtectedRoute` and `AdminRoute` components
- **Layouts**: Applies `Layout` for user pages, `AdminLayout` for admin pages

---

## 📦 Key Directories Explained

### **`/components` - Reusable UI Components**

Organized by purpose:

```
components/
├── auth/              # Authentication components (GoogleAuth)
├── common/            # Shared components (NotificationContainer, PageTransition)
├── forms/             # Form components (Input, LocationInput)
├── layout/            # Layout components (Header, Footer, Layout, AdminLayout)
├── ui/                # Basic UI elements (Button, Input, LoadingSpinner, ThemeToggle)
├── ErrorBoundary.js   # Error handling component
├── FirebaseImage.js  # Image display component
└── index.js          # Central export file
```

**Design Pattern**: Each component folder has an `index.js` for clean imports.

**Example Usage**:
```javascript
import { Button, Input, Header } from './components';
```

---

### **`/pages` - Route-Level Components**

Organized by feature/domain:

```
pages/
├── admin/              # Admin panel pages
│   ├── AdminDashboardPage.js
│   ├── AdminUsersPage.js
│   ├── AdminInvestmentsPage.js
│   ├── AdminWithdrawalsPage.js
│   ├── AdminPlansPage.js
│   ├── AdminRanksPage.js
│   ├── AdminSupportPage.js
│   ├── AdminPaymentAccountsPage.js
│   └── AdminLoginPage.js
├── auth/               # Authentication pages
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── ForgotPasswordPage.js
│   ├── ResetPasswordPage.js
│   └── VerifyEmailPage.js
├── dashboard/          # User dashboard pages
│   ├── DashboardPage.js
│   └── DailyEarningsPage.js
├── investment/         # Investment-related pages
│   ├── PlansPage.js
│   ├── BuyPlanPage.js
│   └── MyInvestmentsPage.js
├── profile/            # User profile
│   └── ProfilePage.js
├── support/            # Support tickets
│   └── SupportPage.js
├── team/               # Team/referral system
│   └── TeamPage.js
├── withdrawal/         # Withdrawal pages
│   └── WithdrawPage.js
└── Home.jsx            # Landing page
```

**Design Pattern**: Each page is a self-contained component that:
- Uses services to fetch data
- Manages its own local state
- Uses context for global state (auth, theme, notifications)

---

### **`/services` - API Communication Layer**

Centralized API service functions:

```
services/
├── api.js              # Base axios instance with interceptors
├── auth.js             # Authentication API calls
├── adminAuth.js        # Admin authentication
├── admin.js            # Admin operations (users, investments, etc.)
├── dashboard.js         # Dashboard data fetching
├── investment.js       # Investment operations
├── support.js          # Support ticket operations
├── withdrawal.js       # Withdrawal operations
└── uploadImage.js      # Image upload to Firebase
```

**Design Pattern**: 
- Each service file exports functions for a specific domain
- Uses the base `api.js` axios instance
- Handles errors consistently
- Returns standardized response format: `{ success, data, message }`

**Example** (`services/auth.js`):
```javascript
export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message };
  }
};
```

**Base API (`services/api.js`)**:
- Creates axios instance with base URL from environment
- Request interceptor: Adds auth token to headers
- Response interceptor: Handles 401 errors (auto-logout), error formatting

---

### **`/context` - Global State Management**

React Context API for global state:

```
context/
├── AuthContext.js          # User authentication state
├── AdminAuthContext.js     # Admin authentication state
├── ThemeContext.js         # Dark/light theme
├── AppContext.js           # Global app state (notifications, user data)
└── SocketContext.js        # WebSocket connections (if used)
```

**Design Pattern**:
- Each context provides a `Provider` component
- Exports a custom hook (e.g., `useAuth()`) for easy access
- Manages state and provides methods to update it
- Persists critical data (tokens, user data) to localStorage

**Example Usage**:
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // Use auth state and methods
}
```

---

### **`/constants` - Configuration & Constants**

Single source of truth for configuration:

```
constants/
└── index.js  # All constants exported from here
```

**Contains**:
- **API Configuration**: Base URL, timeout, endpoints
- **Routes**: All route paths (`ROUTES.DASHBOARD`, etc.)
- **Storage Keys**: localStorage key names
- **Validation Rules**: Regex patterns, min/max lengths
- **Toast Messages**: Predefined success/error messages
- **Theme/Language**: Configuration constants
- **Pagination**: Default page sizes
- **File Upload**: Max sizes, allowed types

**Benefits**:
- Easy to update API endpoints in one place
- Prevents typos in route paths
- Centralized configuration

---

### **`/hooks` - Custom React Hooks**

Reusable logic extraction:

```
hooks/
├── useAuth.js    # Auth-related hooks (if needed)
├── useApi.js     # API call hooks (if using React Query)
└── index.js      # Exports
```

**Purpose**: Extract common logic from components into reusable hooks.

---

### **`/utils` - Utility Functions**

Helper functions:

```
utils/
├── currency.js   # Currency formatting functions
└── index.js     # Exports
```

**Example**: Format numbers as currency, date formatting, validation helpers.

---

## 🔄 Data Flow

### **1. User Action → Component → Service → API → Backend**

```
User clicks "Login"
  ↓
LoginPage.js calls authService.login()
  ↓
auth.js makes axios POST to /api/auth/login
  ↓
api.js interceptor adds auth token
  ↓
Backend processes request
  ↓
Response flows back through services
  ↓
AuthContext updates global state
  ↓
Component re-renders with new auth state
```

### **2. State Management Flow**

```
Local State (useState)
  ↓
Component-specific data (form inputs, loading states)
  ↓
Context State (useContext)
  ↓
Global app state (auth, theme, notifications)
  ↓
Persisted State (localStorage)
  ↓
Auth tokens, user data, theme preference
```

---

## 🎨 Styling Architecture

### **Tailwind CSS**
- Utility-first CSS framework
- Configuration in `tailwind.config.js`
- Dark mode support via `dark:` classes
- Responsive design with breakpoints (`sm:`, `md:`, `lg:`)

### **Component Styling Pattern**:
```javascript
<div className="flex items-center space-x-4 
                bg-white dark:bg-gray-800 
                p-4 rounded-lg">
```

---

## 🛡️ Security & Authentication

### **Token Management**:
- Tokens stored in `localStorage` and `Cookies` (fallback)
- Auto-attached to API requests via axios interceptor
- Auto-logout on 401 errors (except on login pages)

### **Route Protection**:
- `ProtectedRoute`: Wraps user routes, redirects to login if not authenticated
- `AdminRoute`: Wraps admin routes, checks admin role

---

## 📱 Responsive Design

- **Mobile-First**: Components designed for mobile, enhanced for desktop
- **Breakpoints**: Uses Tailwind's responsive utilities
- **Mobile Menu**: Hamburger menu on mobile, full nav on desktop
- **Layout Adaptation**: Different layouts for mobile/desktop (see `Header.js`)

---

## 🔌 API Integration Pattern

### **Service Layer Pattern**:

1. **Service Function** (`services/auth.js`):
```javascript
export const login = async (credentials) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};
```

2. **Component Usage** (`pages/auth/LoginPage.js`):
```javascript
const handleLogin = async (formData) => {
  const response = await authService.login(formData);
  if (response.success) {
    await login(response.data.user, response.data.token);
    navigate(ROUTES.DASHBOARD);
  } else {
    toast.error(response.message);
  }
};
```

---

## 🎭 Component Patterns

### **1. Page Components**:
- Self-contained, route-level components
- Fetch data on mount (`useEffect`)
- Use services for API calls
- Use context for global state
- Handle loading and error states

### **2. Reusable Components**:
- Accept props for customization
- Use composition over configuration
- Export from `index.js` for clean imports

### **3. Layout Components**:
- `Layout.js`: Wraps user pages (Header + Footer)
- `AdminLayout.js`: Wraps admin pages (Admin sidebar)
- `Header.js`: Navigation, user menu, mobile menu
- `Footer.js`: Footer content

---

## 🚀 Key Technologies

- **React 19**: UI library
- **React Router v7**: Client-side routing
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **React Toastify**: Notifications
- **Socket.io Client**: Real-time updates (if used)

---

## 📝 Best Practices Used

1. **Separation of Concerns**: Clear boundaries between components, services, and state
2. **DRY Principle**: Reusable components and utilities
3. **Single Responsibility**: Each file has one clear purpose
4. **Error Handling**: Try-catch in services, error boundaries for components
5. **Type Safety**: Consistent response formats from services
6. **Performance**: Lazy loading routes, optimized re-renders
7. **Accessibility**: Semantic HTML, ARIA labels where needed
8. **Code Organization**: Feature-based folder structure

---

## 🔍 How to Navigate the Codebase

### **To add a new page**:
1. Create component in `/pages/[feature]/NewPage.js`
2. Add route in `App.js`
3. Add route constant in `/constants/index.js`
4. Create service functions in `/services/[feature].js` if needed

### **To add a new API endpoint**:
1. Add endpoint constant in `/constants/index.js` → `API_ENDPOINTS`
2. Create service function in appropriate `/services/[feature].js`
3. Use service function in component

### **To add a new reusable component**:
1. Create component in `/components/[category]/ComponentName.js`
2. Export from `/components/[category]/index.js`
3. Optionally export from `/components/index.js` for root-level access

---

## 🎯 Summary

The frontend follows a **feature-based, layered architecture**:

- **Presentation Layer**: Components and Pages
- **Business Logic Layer**: Services and Context
- **Data Layer**: API calls and localStorage
- **Configuration Layer**: Constants

This structure makes the codebase:
- ✅ **Maintainable**: Easy to find and update code
- ✅ **Scalable**: Easy to add new features
- ✅ **Testable**: Clear separation allows unit testing
- ✅ **Readable**: Consistent patterns throughout

