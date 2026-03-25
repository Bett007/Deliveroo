# Frontend

This folder contains the React frontend starter for Deliveroo. It is intentionally small right now so the team can agree on patterns before feature work starts.

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
- `npm run lint` is a placeholder script for now

## Environment File

Copy `.env.example` to `.env` when you need local frontend variables.

Current example:

- `VITE_API_BASE_URL` points the frontend to the backend API

## Folder Structure

```text
src/
├── app/         # shared app-level styles and setup
├── assets/      # static assets
├── components/  # reusable UI pieces
├── features/    # future Redux slices and feature modules
├── pages/       # route-level page components
├── routes/      # router setup
├── services/    # API helpers
├── store/       # Redux store setup
└── utils/       # shared helpers
```

## Current Status

The frontend currently includes:

- a Vite-based React setup
- React Router with placeholder pages
- Redux Toolkit store wiring
- a small app shell for basic route verification

No real business features or authentication logic have been added yet.
