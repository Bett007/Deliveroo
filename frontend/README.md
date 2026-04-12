# Frontend

This folder contains the React frontend for Deliveroo's role-based workspace experience.

## Current Frontend Scope

- Combined auth portal (`/login`, `/register`, `/verify`)
- Role-based app shell:
  - customer workspace (`/orders`, `/orders/create`, `/orders/history`, `/orders/:id`)
  - rider workspace (`/rider`)
  - admin workspace (`/dashboard`, `/dashboard/orders`)
- Shared protected pages (`/profile`, `/help`)
- Redux Toolkit data flow for auth and order state
- UI layout tuned for app-like viewport behavior (reduced long-page scrolling on desktop)
- CSS modules split by page/component instead of one monolithic stylesheet

## Install Dependencies

```bash
npm install
```

## Run The Frontend

```bash
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` previews the production build locally
- `npm run lint` linting placeholder for current setup

## Environment File

Copy `.env.example` to `.env` when you need local frontend variables.

Current example:

- `VITE_API_BASE_URL` points the frontend to the backend API

## Folder Structure

```text
src/
├── app/         # shared app-level setup and base styles
├── assets/      # static assets and logos
├── components/  # app shell + reusable UI components
├── features/    # Redux slices (auth, orders)
├── pages/       # route-level page components
├── routes/      # route guards and router setup
├── services/    # API helpers
├── store/       # Redux store
└── utils/       # shared helpers
```
