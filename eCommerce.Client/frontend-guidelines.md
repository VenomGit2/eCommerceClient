# Frontend Guidelines

Use:

- Functional Components
- React Hooks
- JSX

Do not use:

- Class Components
- Inline business logic
- Hardcoded URLs
- Hardcoded tokens

Every page should support:

- Loading
- Error
- Empty state

Reusable UI belongs in src/components.

Page-specific UI belongs inside the page folder.

Always use PascalCase component names.

Hooks start with:

use

Example:

useProducts

useCart

useAuth