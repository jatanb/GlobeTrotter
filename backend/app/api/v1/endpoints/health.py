from fastapi import APIRouter


router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "GlobeTrotter API",
        "message": "Backend is running",
    }