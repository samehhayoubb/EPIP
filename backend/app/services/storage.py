import hashlib
import uuid
from pathlib import Path
from uuid import UUID

from fastapi import HTTPException, UploadFile

from app.core.config import settings

ALLOWED_EXTENSIONS = {
    ".pdf", ".xlsx", ".xlsm", ".xls", ".docx", ".doc",
    ".dwg", ".dxf", ".png", ".jpg", ".jpeg", ".tif", ".tiff",
}
CHUNK_SIZE = 1024 * 1024  # 1 MB


def save_upload(file: UploadFile, project_id: UUID) -> tuple[str, int, str]:
    """Streams the upload to disk. Returns (path, size_bytes, sha256)."""
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' is not allowed")

    folder = Path(settings.storage_dir) / str(project_id)
    folder.mkdir(parents=True, exist_ok=True)
    # The stored name is a random ID, never the user's filename
    path = folder / f"{uuid.uuid4()}{ext}"

    max_bytes = settings.max_upload_mb * 1024 * 1024
    digest = hashlib.sha256()
    size = 0

    try:
        with open(path, "wb") as out:
            while chunk := file.file.read(CHUNK_SIZE):
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File is larger than {settings.max_upload_mb} MB",
                    )
                digest.update(chunk)
                out.write(chunk)
        if size == 0:
            raise HTTPException(status_code=400, detail="The file is empty")
    except Exception:
        path.unlink(missing_ok=True)  # never leave a partial file behind
        raise

    return str(path), size, digest.hexdigest()