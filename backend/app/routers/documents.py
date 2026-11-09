from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models import Document, DocumentRevision, User
from app.models.enums import Discipline, DocType
from app.schemas.document import DocumentOut
from app.services.access import get_project_or_404, require_upload_permission
from app.services.storage import save_upload

router = APIRouter(prefix="/api/projects/{project_id}/documents", tags=["documents"])


@router.get("", response_model=list[DocumentOut])
def list_documents(
    project_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    project = get_project_or_404(db, user, project_id)
    query = (
        select(Document)
        .where(Document.project_id == project.id)
        .options(selectinload(Document.revisions))
        .order_by(Document.created_at.desc())
    )
    return list(db.scalars(query))


@router.post("", response_model=DocumentOut, status_code=201)
def upload_document(
    project_id: UUID,
    title: str = Form(..., min_length=1, max_length=300),
    doc_type: DocType = Form(...),
    discipline: Discipline | None = Form(None),
    doc_number: str | None = Form(None),
    revision_label: str = Form("A", max_length=20),
    force: bool = Form(False),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    project = get_project_or_404(db, user, project_id)
    require_upload_permission(user)

    path, size, sha256 = save_upload(file, project.id)

    try:
        if not force:
            duplicate = db.scalar(
                select(DocumentRevision)
                .join(Document)
                .where(
                    Document.project_id == project.id,
                    DocumentRevision.sha256 == sha256,
                )
            )
            if duplicate:
                existing = db.get(Document, duplicate.document_id)
                raise HTTPException(
                    status_code=409,
                    detail=(
                        f'This exact file is already uploaded as "{existing.title}" '
                        f"(revision {duplicate.revision_label})."
                    ),
                )

        document = Document(
            project_id=project.id,
            title=title,
            doc_number=doc_number,
            doc_type=doc_type.value,
            discipline=discipline.value if discipline else None,
            created_by=user.id,
        )
        db.add(document)
        db.flush()  # gives the document its id

        db.add(
            DocumentRevision(
                document_id=document.id,
                revision_label=revision_label,
                original_filename=file.filename or "unnamed",
                storage_path=path,
                mime_type=file.content_type or "application/octet-stream",
                size_bytes=size,
                sha256=sha256,
                uploaded_by=user.id,
            )
        )
        db.commit()
    except Exception:
        db.rollback()
        Path(path).unlink(missing_ok=True)  # don't orphan the stored file
        raise

    return document