# Local Database

GlobeTrotter uses SQLite by default, so the backend works locally without a cloud database.

The database file is created at `backend/globetrotter.db` when FastAPI starts. SQLAlchemy creates these tables automatically:

- `users`
- `trips`
- `trip_stops`
- `activities`
- `expenses`
- `saved_destinations`
- `shares`

Start the API from the backend directory:

```powershell
cd backend
uvicorn app.main:app --reload
```

The local API documentation is available at `http://localhost:8000/docs`.

Trip endpoints require the bearer token returned by signup or login:

- `GET /api/v1/trips`
- `POST /api/v1/trips`
- `GET /api/v1/trips/{trip_id}`
- `PATCH /api/v1/trips/{trip_id}`
- `DELETE /api/v1/trips/{trip_id}`
- `POST /api/v1/trips/{trip_id}/stops`
- `POST /api/v1/trips/stops/{stop_id}/activities`
- `DELETE /api/v1/trips/activities/{activity_id}`

To use another local SQLite file, set `DATABASE_URL` in `backend/.env`, for example:

```env
DATABASE_URL=sqlite:///./globetrotter-dev.db
```
