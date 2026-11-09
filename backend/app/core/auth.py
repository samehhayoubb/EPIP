from fastapi import Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import User


def get_current_user(
    x_user_email: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    """TEMPORARY: identifies the user from a header.
    Anyone can claim to be anyone, so this is for development only.
    It will be replaced by real login (JWT) in the auth feature."""
    if not x_user_email:
        raise HTTPException(status_code=401, detail="Missing X-User-Email header")
    user = db.scalar(select(User).where(User.email == x_user_email))
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="Unknown or inactive user")
    return user