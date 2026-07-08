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
    phone: str
    role: UserRole
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str