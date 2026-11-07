from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    CEO = "ceo"
    PROJECTS_MANAGER = "projects_manager"
    PROJECT_MANAGER = "project_manager"
    ENGINEER = "engineer"
    DOCUMENT_CONTROL = "document_control"


class ProjectStatus(str, Enum):
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"


class ExtractionStatus(str, Enum):
    PENDING = "pending"
    EXTRACTED = "extracted"
    NEEDS_OCR = "needs_ocr"
    FAILED = "failed"