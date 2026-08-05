# Backend Integration

Backend:

ASP.NET Core Web API

Architecture:

Clean Architecture

Rules

Never invent DTOs.

Never invent endpoints.

Never invent request models.

Never invent response models.

Use existing backend contracts.

All API communication belongs inside:

src/services

Use:

REACT_APP_API_BASE_URL

Never hardcode URLs.