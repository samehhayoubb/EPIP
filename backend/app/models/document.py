import uuid
from datetime import datetime

from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Document(Base):
    """One logical document. Its uploaded versions are DocumentRevisions."""

    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("projects.id"), index=True
    )
    title: Mapped[str] = mapped_column(String(300))
    doc_number: Mapped[str | None] = mapped_column(String(100))
    doc_type: Mapped[str] = mapped_column(String(30))
    discipline: Mapped[str | None] = mapped_column(String(30))
    created_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class DocumentRevision(Base):
    """One uploaded file of a document."""

    __tablename__ = "document_revisions"
    __table_args__ = (UniqueConstraint("document_id", "revision_label"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    document_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"), index=True
    )
    revision_label: Mapped[str] = mapped_column(String(20))
    original_filename: Mapped[str] = mapped_column(String(500))
    storage_path: Mapped[str] = mapped_column(String(1000))
    mime_type: Mapped[str] = mapped_column(String(200))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    language: Mapped[str | None] = mapped_column(String(10))
    extraction_status: Mapped[str] = mapped_column(String(20), default="pending")
    uploaded_by: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )