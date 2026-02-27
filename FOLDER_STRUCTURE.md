# SkillBridge AI - Folder Structure

## Complete Project Structure

```
AI_SKILL_GAP_SYSTEM/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── images/
│
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── logos/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx          # Root layout wrapper
│   │   │   ├── Sidebar.jsx             # Fixed left navigation
│   │   │   ├── Navbar.jsx              # Top navigation bar
│   │   │   ├── PageContainer.jsx       # Content wrapper
│   │   │   └── index.js                # Exports
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx              # Reusable button
│   │   │   ├── Card.jsx                # Content card
│   │   │   ├── Input.jsx               # Form input
│   │   │   ├── Badge.jsx               # Status badge
│   │   │   ├── Avatar.jsx              # User avatar
│   │   │   ├── Dropdown.jsx            # Dropdown menu
│   │   │   ├── Modal.jsx               # Modal dialog
│   │   │   ├── Table.jsx               # Data table
│   │   │   ├── Tabs.jsx                # Tab navigation
│   │   │   ├── Tooltip.jsx             # Hover tooltip
│   │   │   ├── SearchBar.jsx           # Search input
│   │   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   │   └── index.js                # Exports
│   │   │
│   │   ├── dashboard/
│   │   │   ├── SkillGapCard.jsx        # Skill gap display
│   │   │   ├── ProgressChart.jsx       # Charts (Recharts)
│   │   │   ├── RecommendationCard.jsx  # AI recommendations
│   │   │   ├── SkillsOverview.jsx      # Stats overview
│   │   │   ├── LearningPathCard.jsx    # Learning path
│   │   │   ├── StatsWidget.jsx         # Stat display
│   │   │   ├── ActivityFeed.jsx        # Recent activity
│   │   │   └── index.js                # Exports
│   │   │
│   │   └── common/
│   │       ├── EmptyState.jsx          # No data placeholder
│   │       ├── ErrorBoundary.jsx       # Error catcher
│   │       ├── PageHeader.jsx          # Page title section
│   │       ├── SectionTitle.jsx        # Section heading
│   │       ├── NotificationToast.jsx   # Toast notification
│   │       └── index.js                # Exports
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx           # Login page
│   │   │   ├── SignupPage.jsx          # Signup page
│   │   │   ├── ForgotPasswordPage.jsx  # Password reset
│   │   │   └── index.js                # Exports
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx       # Main dashboard
│   │   │   ├── AssessmentPage.jsx      # Skill assessment
│   │   │   ├── AnalyticsPage.jsx       # Analytics view
│   │   │   ├── LearningPathsPage.jsx   # Learning paths
│   │   │   └── index.js                # Exports
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfilePage.jsx         # User profile
│   │   │   └── index.js
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsPage.jsx       # Detailed analytics
│   │   │   └── index.js
│   │   │
│   │   └── settings/
│   │       ├── SettingsPage.jsx        # App settings
│   │       └── index.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js                  # Authentication hook
│   │   ├── useTheme.js                 # Theme management
│   │   ├── useApi.js                   # API calls hook
│   │   ├── useDebounce.js              # Debounce utility
│   │   ├── useLocalStorage.js          # Local storage hook
│   │   ├── useMediaQuery.js            # Responsive hook
│   │   └── index.js                    # Exports
│   │
│   ├── context/
│   │   ├── AuthContext.jsx             # Auth state provider
│   │   ├── ThemeContext.jsx            # Theme state provider
│   │   ├── NotificationContext.jsx     # Notification provider
│   │   └── index.js                    # Exports
│   │
│   ├── services/
│   │   ├── api/
│   │   │   └── axios.js                # Axios config
│   │   ├── authService.js              # Auth API calls
│   │   ├── skillService.js             # Skill API calls
│   │   ├── analyticsService.js         # Analytics API
│   │   ├── userService.js              # User API calls
│   │   └── index.js                    # Exports
│   │
│   ├── utils/
│   │   ├── helpers.js                  # Helper functions
│   │   ├── formatters.js               # Date/number formatters
│   │   ├── validators.js               # Form validators
│   │   └── index.js                    # Exports
│   │
│   ├── constants/
│   │   ├── theme.js                    # Theme constants
│   │   ├── routes.js                   # Route constants
│   │   ├── api.js                      # API endpoints
│   │   └── index.js                    # Exports
│   │
│   ├── styles/
│   │   └── custom.css                  # Custom CSS (if needed)
│   │
│   ├── App.jsx                         # Root App component
│   ├── App.css                         # App styles
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles + Tailwind
│
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── README.md
├── LAYOUT_ARCHITECTURE.md              # Layout documentation
└── COMPONENTS_LIST.md                  # Components documentation
```

---

## Folder Purpose

### `/components`
Reusable React components organized by category

**Subfolders:**
- **layout/** - Layout structure components (Sidebar, Navbar)
- **ui/** - Generic UI components (Button, Card, Input)
- **dashboard/** - Dashboard-specific components
- **common/** - Shared utility components

### `/pages`
Page-level components for routing

**Subfolders:**
- **auth/** - Authentication pages
- **dashboard/** - Dashboard pages
- **profile/** - User profile pages
- **analytics/** - Analytics pages
- **settings/** - Settings pages

### `/hooks`
Custom React hooks for reusable logic

**Examples:**
- useAuth - Authentication state
- useApi - API calls with loading/error states
- useDebounce - Debounced input values

### `/context`
React Context providers for global state

**Providers:**
- AuthContext - User authentication
- ThemeContext - Dark/light theme
- NotificationContext - Toast notifications

### `/services`
API communication layer

**Purpose:**
- Centralize API calls
- Handle authentication tokens
- Manage request/response formatting

### `/utils`
Utility functions and helpers

**Examples:**
- Date formatting
- Number formatting
- Validation functions
- String manipulation

### `/constants`
Static configuration and constants

**Examples:**
- Theme colors
- Route paths
- API endpoints
- Environment variables

### `/styles`
Global styles and custom CSS

---

## Naming Conventions

### Files
- **Components:** PascalCase (e.g., `SkillGapCard.jsx`)
- **Hooks:** camelCase with 'use' prefix (e.g., `useAuth.js`)
- **Utils:** camelCase (e.g., `formatters.js`)
- **Constants:** camelCase (e.g., `theme.js`)

### Components
- **Functional components:** Arrow functions
- **Export:** Named exports in index.js, default in component files

### CSS Classes
- **Tailwind utility classes** (primary approach)
- **Custom classes:** kebab-case if needed

---

## Import Best Practices

### Absolute Imports (Configure in vite.config.js)
```javascript
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks';
import { ROUTES } from '@/constants';
```

### Relative Imports (Within same folder)
```javascript
import Sidebar from './Sidebar';
import { formatDate } from './helpers';
```

---

## Component Structure Template

```jsx
// Imports
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui';

// Component
const ComponentName = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default Props
ComponentName.defaultProps = {
  prop2: 0,
};

// Export
export default ComponentName;
```

---

## Development Workflow

### 1. **Create Component**
```bash
# In appropriate folder
touch src/components/ui/NewComponent.jsx
```

### 2. **Add to index.js**
```javascript
export { default as NewComponent } from './NewComponent';
```

### 3. **Import in Page**
```jsx
import { NewComponent } from '@/components/ui';
```

---

## Next Steps

1. ✅ Folder structure created
2. ✅ Architecture documented
3. ✅ Components listed
4. ⏳ Implement layout components (Sidebar, Navbar, MainLayout)
5. ⏳ Implement UI components (Button, Card, Input)
6. ⏳ Create dashboard pages
7. ⏳ Integrate API services
8. ⏳ Add routing with React Router
9. ⏳ Implement authentication flow

---

## Key Files Already Created

- ✅ `tailwind.config.js` - Tailwind configuration
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `src/constants/theme.js` - Theme constants
- ✅ `src/constants/routes.js` - Route constants
- ✅ `src/index.css` - Tailwind directives
- ✅ All index.js export files
