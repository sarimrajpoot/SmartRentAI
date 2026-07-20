from pydantic import BaseModel, EmailStr
from uuid import UUID

from app.enums.user import UserRole


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: UserRole
    cnic: str
    driving_license: str


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    phone: str | None = None
    role: UserRole
    cnic: str | None = None
    driving_license: str | None = None
    address: str | None = None
    profile_picture: str | None = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    address: str | None = None
    cnic: str | None = None
    driving_license: str | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str