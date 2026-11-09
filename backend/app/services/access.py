from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Project, ProjectMember, User
from app.models.enums import Role

# Who may upload. The CEO is read-only. Easy to change in one place.
CAN_UPLOAD = {
    Role.ADMIN,
    Role.PROJECTS_MANAGER,
    Role.PROJECT_MANAGER,
    Role.ENGINEER,
    Role.DOCUMENT_CONTROL,
}


def accessible_projects_query(user: User):
    role = Role(user.role)
    query = select(Project)

    if role == Role.ADMIN:
        return query

    if role in (Role.CEO, Role.PROJECTS_MANAGER):
        return query.where(Project.organization_id == user.organization_id)

    # Project manager, engineer, document control: assigned projects only
    return query.join(
        ProjectMember, ProjectMember.project_id == Project.id
    ).where(
        ProjectMember.user_id == user.id,
        Project.organization_id == user.organization_id,
    )


def get_accessible_projects(db: Session, user: User) -> list[Project]:
    query = accessible_projects_query(user).order_by(Project.name)
    return list(db.scalars(query))


def get_project_or_404(db: Session, user: User, project_id: UUID) -> Project:
    project = db.scalar(accessible_projects_query(user).where(Project.id == project_id))
    if project is None:
        # 404, not 403: don't reveal that a project the user can't see exists
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def require_upload_permission(user: User) -> None:
    if Role(user.role) not in CAN_UPLOAD:
        raise HTTPException(status_code=403, detail="Your role cannot upload documents")