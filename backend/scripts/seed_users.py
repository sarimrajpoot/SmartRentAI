from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.user import User
from app.enums.user import UserRole
from app.core.security import hash_password


def seed_users():
    db: Session = SessionLocal()

    users = []

    seed_data = [
        {
            "full_name": "System Administrator",
            "email": "admin@smartrent.ai",
            "phone": "03000000000",
            "password": "Password123",
            "role": UserRole.ADMIN,
            "cnic": "11111-1111111-1",
            "driving_license": "ADMIN-001",
        },

        {
            "full_name": "Islamabad Motors",
            "email": "showroom1@smartrent.ai",
            "phone": "03000000001",
            "password": "Password123",
            "role": UserRole.SHOWROOM,
            "cnic": "11111-1111111-2",
            "driving_license": "SHOW-001",
        },

        {
            "full_name": "Lahore Cars",
            "email": "showroom2@smartrent.ai",
            "phone": "03000000002",
            "password": "Password123",
            "role": UserRole.SHOWROOM,
            "cnic": "11111-1111111-3",
            "driving_license": "SHOW-002",
        },

        {
            "full_name": "Karachi Rentals",
            "email": "showroom3@smartrent.ai",
            "phone": "03000000003",
            "password": "Password123",
            "role": UserRole.SHOWROOM,
            "cnic": "11111-1111111-4",
            "driving_license": "SHOW-003",
        },
    ]

    # Create 10 customers
    for i in range(1, 11):
        seed_data.append(
            {
                "full_name": f"Customer {i}",
                "email": f"customer{i}@test.com",
                "phone": f"031100000{i:02}",
                "password": "Password123",
                "role": UserRole.CUSTOMER,
                "cnic": f"22222-22222{i:02}-1",
                "driving_license": f"CUST-{i:03}",
            }
        )

    for data in seed_data:

        existing = (
            db.query(User)
            .filter(User.email == data["email"])
            .first()
        )

        if existing:
            users.append(existing)
            continue

        user = User(
            full_name=data["full_name"],
            email=data["email"],
            phone=data["phone"],
            password_hash=hash_password(data["password"]),
            role=data["role"],
            cnic=data["cnic"],
            driving_license=data["driving_license"],
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        users.append(user)

    db.close()

    print(f"Created {len(users)} users.")

    return users