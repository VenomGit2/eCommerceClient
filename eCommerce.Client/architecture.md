# Architecture

The application follows a layered React architecture.

Presentation

↓

Containers

↓

Services

↓

Backend API

The application separates:

- UI
- Business logic
- API communication
- Utilities

Business logic should never live inside reusable UI components.

API calls should never be made directly inside reusable components.

State should be lifted into containers or context when shared.

Pages are route-level components.

Shared components remain reusable.

Page-specific components remain inside the page folder.