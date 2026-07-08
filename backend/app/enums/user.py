from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    SHOWROOM = "SHOWROOM"
    ADMIN = "ADMIN"
