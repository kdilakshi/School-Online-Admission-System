# School Online Admission System

A full-stack admission management system built with Django REST Framework and Next.js. The project provides a public admission form, an admin dashboard for managing applications, and a clean presentation-ready UI.

## Overview

This repository contains two main parts:

- `backend/` and `core/` - Django backend with REST API endpoints.
- `frontend/` - Next.js frontend with reusable UI components and route pages.

## Features

- Public admission form with file uploads.
- Admin dashboard to review, edit, and delete applications.
- Responsive interface with shadcn-style UI components.
- Centralized API client for frontend-backend communication.
- School logo and polished landing page experience.

## Project Structure

- `manage.py` - Django project entry point.
- `core/` - Django project settings, URLs, WSGI, and ASGI configuration.
- `backend/` - Django app containing models, serializers, views, admin, and API routes.
- `frontend/` - Next.js application.
  - `frontend/app/` - App Router route entry points.
  - `frontend/components/pages/` - Page-level components.
  - `frontend/components/ui/` - Reusable UI primitives.
  - `frontend/lib/` - Shared frontend utilities, including the API client.
  - `frontend/public/` - Static assets.

## Requirements

- Python 3.11 or later
- Node.js 18 or later
- npm
- A relational database supported by Django

## Backend Setup

Create and activate a Python virtual environment, then install dependencies:

```bash
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Apply database migrations:

```bash
python manage.py migrate
```

Run the Django development server:

```bash
python manage.py runserver
```

## Frontend Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Run the Next.js development server:

```bash
npm run dev
```

Build the frontend for production:

```bash
npm run build
```

## API Configuration

The frontend expects the backend API at `http://127.0.0.1:8000/api`. If your backend runs on a different host or port, update `frontend/lib/api.js` accordingly.

## Development Notes

- Keep page-specific logic inside `frontend/components/pages/`.
- Use `frontend/components/ui/` for reusable interface elements.
- Keep route files in `frontend/app/*/page.js` minimal.
- Ensure `django-cors-headers` is installed and configured in the backend environment.

## Validation

Before publishing changes, run:

```bash
cd frontend
npm run build
```

and, for backend changes:

```bash
python manage.py migrate
```

## License

No license has been specified for this project.
