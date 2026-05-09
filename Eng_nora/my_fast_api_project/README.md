# FastAPI + React CRUD (Users / Projects / Tasks)

a small full-stack CRUD app:

- **Backend:** FastAPI + SQLAlchemy + PostgreSQL
- **Frontend:** React (Vite) + Tailwind + Redux Toolkit Query

It manages three resources: **Users**, **Projects**, and **Tasks**.

## Project structure

- [main.py](main.py) — FastAPI app setup (routers + CORS)
- [database.py](database.py) — SQLAlchemy engine/session and the `get_db` dependency
- [models/](models) — SQLAlchemy models (Users / Projects / Tasks)
- [schemas/](schemas) — Pydantic request/response schemas
- [routers/](routers) — API endpoints (`/users`, `/projects`, `/tasks`)
- [req.txt](req.txt) — Python dependencies
- [frontend/](frontend) — React/Vite client application

## Requirements

- **Python** 3.10+
- **Node.js** 18+ (for the frontend)
- **PostgreSQL** running locally

The backend database connection is currently hard-coded in [database.py](database.py) as:

`postgresql://postgres:admin@localhost:5432/odai`

Make sure your local Postgres user/password/database match this, or edit the URL to match your environment.

## Run the backend (FastAPI)

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r req.txt

# Run the API on port 8000 (matches the frontend default)
uvicorn main:app --reload --port 8000
```

API docs:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Notes:

- Tables are created automatically on startup via `Base.metadata.create_all(...)` in [main.py](main.py).

## Run the frontend (React)

In a second terminal:

```powershell
cd frontend
npm install

# Optional: if your backend is not on http://localhost:8000
# set VITE_API_BASE_URL to your backend URL before starting.

npm run dev
```

Vite will print the local URL (commonly `http://localhost:5173`).

### API base URL

The frontend uses `VITE_API_BASE_URL` when provided; otherwise it defaults to `http://localhost:8000`.
You can see this in [frontend/src/store/api.ts](frontend/src/store/api.ts).

### By : Odai Aqlan
