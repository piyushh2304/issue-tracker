# Issue Tracker (FastAPI + Angular + Tailwind)

This repository contains a complete small Issue Tracker as requested.

- Backend: FastAPI (Python) — in-memory storage, REST API
- Frontend: Angular + Tailwind — list, search, filter, sort, pagination, create, update, detail view

## Structure

```
src/
  backend/           # FastAPI app (uvicorn entrypoint: src/backend/app.py:app)
  frontend/
    angular-app/     # Angular app (ng serve)
```

## Backend (FastAPI)

Requirements: Python 3.11+

```
cd src/backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

API Endpoints:
- GET /health → {"status":"ok"}
- GET /issues → search/filter/sort/pagination via query params
- GET /issues/{id}
- POST /issues → auto id, createdAt, updatedAt
- PUT /issues/{id} → updates and refreshes updatedAt

## Frontend (Angular + Tailwind)

Requirements: Node 18+

```
cd src/frontend/angular-app
npm install
npm run start
```

The app runs at http://localhost:4200 and calls the API at http://localhost:8000 (CORS enabled).

## Notes
- Storage is in-memory (data resets on server restart).
- Sorting fields: id, title, status, priority, assignee, updatedAt, createdAt.
- Pagination is 1-based: page, pageSize.

## Packaging
Use your Git provider or download a ZIP of the project. Keep this README with the code.
