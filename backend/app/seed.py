from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models import Organization, Project, ProjectMember, User
from app.models.enums import ProjectStatus, Role

ORGS = ["Ghoneimi Architects", "Sectors"]

# (name, email, role, company name or None for the platform admin)
USERS = [
    ("Sameh", "sameh@example.com", Role.ADMIN, None),
    ("Omar Ghoneimi", "omar.ghoneimi@example.com", Role.CEO, "Ghoneimi Architects"),
    ("Saad", "saad@example.com", Role.PROJECTS_MANAGER, "Ghoneimi Architects"),
    ("Atef", "atef@example.com", Role.PROJECT_MANAGER, "Ghoneimi Architects"),
    ("Shaimaa", "shaimaa@example.com", Role.ENGINEER, "Ghoneimi Architects"),
    ("GA Document Control", "ga.doccontrol@example.com", Role.DOCUMENT_CONTROL, "Ghoneimi Architects"),
    ("Random CEO", "sec.ceo@example.com", Role.CEO, "Sectors"),
    ("Random Projects Manager", "sec.projects.manager@example.com", Role.PROJECTS_MANAGER, "Sectors"),
    ("Random Project Manager", "sec.project.manager@example.com", Role.PROJECT_MANAGER, "Sectors"),
    ("Random Engineer", "sec.engineer@example.com", Role.ENGINEER, "Sectors"),
]

# (project name, company name, status)
PROJECTS = [
    ("NXT Bank", "Ghoneimi Architects", ProjectStatus.ACTIVE),
    ("MLI 41 Kasr Al Nile", "Ghoneimi Architects", ProjectStatus.COMPLETED),
    ("MLI 23 Kasr Al Nile", "Ghoneimi Architects", ProjectStatus.ON_HOLD),
    ("MCS", "Ghoneimi Architects", ProjectStatus.ACTIVE),
    ("Orange Business Center", "Sectors", ProjectStatus.COMPLETED),
    ("Luxor White Palace", "Sectors", ProjectStatus.ACTIVE),
]

# (user email, company name, project name)
MEMBERSHIPS = [
    ("atef@example.com", "Ghoneimi Architects", "NXT Bank"),
    ("atef@example.com", "Ghoneimi Architects", "MCS"),
    ("shaimaa@example.com", "Ghoneimi Architects", "NXT Bank"),
    ("ga.doccontrol@example.com", "Ghoneimi Architects", "NXT Bank"),
    ("ga.doccontrol@example.com", "Ghoneimi Architects", "MCS"),
    ("sec.project.manager@example.com", "Sectors", "Luxor White Palace"),
    ("sec.engineer@example.com", "Sectors", "Luxor White Palace"),
]


def get_or_create_org(db: Session, name: str) -> Organization:
    org = db.scalar(select(Organization).where(Organization.name == name))
    if org is None:
        org = Organization(name=name)
        db.add(org)
        db.flush()  # assigns the id without ending the transaction
    return org


def get_or_create_user(db: Session, name, email, role, org) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(
            name=name,
            email=email,
            role=role.value,
            organization_id=org.id if org else None,
        )
        db.add(user)
        db.flush()
    return user


def get_or_create_project(db: Session, name, org, status) -> Project:
    project = db.scalar(
        select(Project).where(
            Project.organization_id == org.id, Project.name == name
        )
    )
    if project is None:
        project = Project(name=name, organization_id=org.id, status=status.value)
        db.add(project)
        db.flush()
    return project


def seed() -> None:
    with SessionLocal() as db:
        orgs = {name: get_or_create_org(db, name) for name in ORGS}

        users = {}
        for name, email, role, org_name in USERS:
            org = orgs[org_name] if org_name else None
            users[email] = get_or_create_user(db, name, email, role, org)

        projects = {}
        for name, org_name, status in PROJECTS:
            projects[(org_name, name)] = get_or_create_project(
                db, name, orgs[org_name], status
            )

        for email, org_name, project_name in MEMBERSHIPS:
            user = users[email]
            project = projects[(org_name, project_name)]
            if db.get(ProjectMember, (user.id, project.id)) is None:
                db.add(ProjectMember(user_id=user.id, project_id=project.id))

        db.commit()

    print("Seed complete.")


if __name__ == "__main__":
    seed()
