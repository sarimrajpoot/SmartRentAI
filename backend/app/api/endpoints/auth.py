from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.dependencies import get_db
from app.schemas.user import UserRegister, UserResponse, UserUpdate, PasswordChange
from app.services.user_service import create_user

from app.services.user_service import authenticate_user
from app.core.jwt_handler import create_access_token

from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    created_user = create_user(db, user)

    if created_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    return created_user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        form_data.username,   # Use the email in the username field
        form_data.password
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/profile", response_model=UserResponse)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_dict = payload.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/profile/picture", response_model=UserResponse)
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.core.config import settings
    from app.services.storage import get_storage_service
    import os

    if file.content_type not in settings.allowed_mime_types_list:
        raise HTTPException(status_code=400, detail="Invalid image type.")

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(status_code=400, detail="File too large.")

    # Save using storage service
    storage = get_storage_service()
    url = storage.save_file(content, file.filename or "profile.jpg", "profiles")

    current_user.profile_picture = url
    db.commit()
    db.refresh(current_user)
    return current_user


@router.patch("/change-password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.core.security import verify_password, hash_password
    
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.get("/sessions")
def get_sessions(current_user: User = Depends(get_current_user)):
    # Mock active sessions list
    import datetime
    return [
        {
            "id": "session-1",
            "device": "MacBook Pro (macOS)",
            "ip": "192.168.1.101",
            "location": "Islamabad, Pakistan",
            "last_active": datetime.datetime.utcnow().isoformat(),
            "is_current": True,
        },
        {
            "id": "session-2",
            "device": "iPhone 15 Pro",
            "ip": "182.160.2.45",
            "location": "Rawalpindi, Pakistan",
            "last_active": (datetime.datetime.utcnow() - datetime.timedelta(hours=2)).isoformat(),
            "is_current": False,
        }
    ]


@router.post("/sessions/logout-all")
def logout_all_devices(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out from all other devices"}


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()