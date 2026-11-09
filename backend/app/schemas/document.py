from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RevisionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    revision_label: str
    original_filename: str
    mime_type: str
    size_bytes: int
    language: str | None
    extraction_status: str
    uploaded_at: datetime


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID
    title: str
    doc_number: str | None
    doc_type: str
    discipline: str | None
    created_at: datetime
    revisions: list[RevisionOut]