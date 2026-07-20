from decimal import Decimal

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.car import Car
from app.models.user import User
from app.enums.user import UserRole
from app.enums.car import FuelType, TransmissionType

def seed_cars(users=None):
    db: Session = SessionLocal()

    showrooms = (
        db.query(User)
        .filter(User.role == UserRole.SHOWROOM)
        .all()
    )

    if not showrooms:
        print("No showroom users found. Run seed_users first.")
        db.close()
        return

    cars = [

        # Toyota
        ("Toyota", "Corolla", "Grande", 2023, "White", "ICT-101", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 6500, "Islamabad"),
        ("Toyota", "Yaris", "ATIV X", 2024, "Silver", "ICT-102", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 6000, "Islamabad"),
        ("Toyota", "Fortuner", "Sigma 4", 2022, "Black", "LHR-201", TransmissionType.AUTOMATIC, FuelType.DIESEL, 7, 18000, "Lahore"),
        ("Toyota", "Prado", "TXL", 2021, "White", "LHR-202", TransmissionType.AUTOMATIC, FuelType.DIESEL, 7, 28000, "Lahore"),
        ("Toyota", "Land Cruiser", "ZX", 2023, "Black", "KHI-301", TransmissionType.AUTOMATIC, FuelType.DIESEL, 7, 45000, "Karachi"),

        # Honda
        ("Honda", "Civic", "RS", 2024, "Grey", "ICT-103", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 9000, "Islamabad"),
        ("Honda", "City", "Aspire", 2023, "White", "ICT-104", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 6000, "Islamabad"),
        ("Honda", "BR-V", "i-VTEC", 2022, "Silver", "LHR-203", TransmissionType.AUTOMATIC, FuelType.PETROL, 7, 9000, "Lahore"),

        # Suzuki
        ("Suzuki", "Alto", "VXL AGS", 2024, "White", "ICT-105", TransmissionType.AUTOMATIC, FuelType.PETROL, 4, 3500, "Islamabad"),
        ("Suzuki", "Cultus", "AGS", 2023, "Blue", "LHR-204", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 4200, "Lahore"),
        ("Suzuki", "Swift", "GLX", 2024, "Red", "KHI-302", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 5000, "Karachi"),

        # Kia
        ("Kia", "Sportage", "FWD", 2023, "Black", "ICT-106", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 12000, "Islamabad"),
        ("Kia", "Stonic", "EX+", 2024, "White", "LHR-205", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 8000, "Lahore"),

        # Hyundai
        ("Hyundai", "Tucson", "AWD", 2024, "Grey", "KHI-303", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 13000, "Karachi"),
        ("Hyundai", "Elantra", "GLS", 2023, "White", "ICT-107", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 8500, "Islamabad"),

        # MG
        ("MG", "HS", "Essence", 2024, "Black", "LHR-206", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 13000, "Lahore"),
        ("MG", "ZS", "Excite", 2023, "Red", "KHI-304", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 9000, "Karachi"),

        # BMW
        ("BMW", "320i", "M Sport", 2022, "Black", "ICT-108", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 22000, "Islamabad"),
        ("BMW", "X5", "xDrive40i", 2023, "White", "LHR-207", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 35000, "Lahore"),

        # Mercedes
        ("Mercedes", "C200", "AMG", 2023, "Silver", "KHI-305", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 25000, "Karachi"),
        ("Mercedes", "GLE", "450", 2024, "Black", "ICT-109", TransmissionType.AUTOMATIC, FuelType.PETROL, 7, 42000, "Islamabad"),

        # Audi
        ("Audi", "A4", "Premium", 2023, "Grey", "LHR-208", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 23000, "Lahore"),
        ("Audi", "Q5", "Quattro", 2024, "White", "KHI-306", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 32000, "Karachi"),

        # Tesla
        ("Tesla", "Model 3", "Long Range", 2024, "White", "ICT-110", TransmissionType.AUTOMATIC, FuelType.ELECTRIC, 5, 25000, "Islamabad"),
        ("Tesla", "Model Y", "Performance", 2024, "Black", "LHR-209", TransmissionType.AUTOMATIC, FuelType.ELECTRIC, 5, 32000, "Lahore"),

        # Nissan
        ("Nissan", "Dayz", "Highway Star", 2022, "Silver", "KHI-307", TransmissionType.AUTOMATIC, FuelType.PETROL, 4, 4200, "Karachi"),
        ("Nissan", "Note", "e-Power", 2023, "Blue", "ICT-111", TransmissionType.AUTOMATIC, FuelType.HYBRID, 5, 6500, "Islamabad"),

        # Hyundai/Kia extras
        ("Hyundai", "Sonata", "2.5", 2024, "Black", "LHR-210", TransmissionType.AUTOMATIC, FuelType.PETROL, 5, 14000, "Lahore"),
        ("Kia", "Picanto", "AT", 2023, "Yellow", "KHI-308", TransmissionType.AUTOMATIC, FuelType.PETROL, 4, 3800, "Karachi"),
    ]

    car_images = {
    ("Toyota", "Corolla"): "https://images.unsplash.com/photo-1638618164682-12b986ec2a75?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Honda", "Civic"): "https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?q=80&w=2200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("BMW", "320i"): "https://images.unsplash.com/photo-1734554381974-56e06a32453c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Toyota", "Yaris"): "https://images.unsplash.com/photo-1596429916858-6f97b5b9cf48?q=80&w=2475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Toyota", "Fortuner"): "https://images.unsplash.com/photo-1664783856972-ac9922d7b2d3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwZm9ydHVuZXJ8ZW58MHx8MHx8fDA%3D",
    ("Toyota", "Prado"): "https://images.unsplash.com/photo-1613859492095-85d9944f09f6?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Toyota", "Land Cruiser"): "https://images.unsplash.com/photo-1650530579355-7ad9d4766043?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Honda", "City"): "https://images.unsplash.com/photo-1678002239411-d633292ecbc4?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Honda", "BR-V"): "https://images.unsplash.com/photo-1675582832382-dbb013dd03b7?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Suzuki", "Alto"): "https://images.unsplash.com/photo-1743518421133-1f4ce56b5510?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Suzuki", "Cultus"): "https://images.unsplash.com/photo-1699862335489-36f7dec55c0e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Suzuki", "Swift"): "https://images.unsplash.com/photo-1699862335489-36f7dec55c0e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Kia", "Sportage"): "https://images.unsplash.com/photo-1688893288248-3338b8491a46?q=80&w=1341&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Kia", "Stonic"): "https://images.unsplash.com/photo-1688893288248-3338b8491a46?q=80&w=1341&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Hyundai", "Tucson"): "https://images.unsplash.com/photo-1575090536203-2a6193126514?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Hyundai", "Elantra"): "https://images.unsplash.com/photo-1716384277908-0024e397c30c?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("MG", "HS"): "https://images.unsplash.com/photo-1777175013292-9c20b56c3fc2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("MG", "ZS"): "https://images.unsplash.com/photo-1643628067815-3c32ff04f23e?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("BMW", "X5"): "https://images.unsplash.com/photo-1635089917414-6da790da8479?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Mercedes", "C200"): "https://images.unsplash.com/photo-1605556816125-d752c226247b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Mercedes", "GLE"): "https://images.unsplash.com/photo-1669234226129-8ede05b40eff?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Audi", "A4"): "https://images.unsplash.com/photo-1726003536800-b9ec0888cf36?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Audi", "Q5"): "https://images.unsplash.com/photo-1584558303984-0ac08c41ddc5?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Tesla", "Model 3"): "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Tesla", "Model Y"): "https://images.unsplash.com/photo-1658030074520-74e1acd0865c?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Nissan", "Dayz"): "https://images.unsplash.com/photo-1575501707067-0e4c7db2a950?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Tmlzc2FuJTIwRGF5enxlbnwwfHwwfHx8MA%3D%3D",
    ("Nissan", "Note"): "https://images.unsplash.com/photo-1618091171668-e1c3cf1ffce2?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Hyundai", "Sonata"): "https://images.unsplash.com/photo-1726038021851-9dc24938b376?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ("Kia", "Picanto"): "https://images.unsplash.com/photo-1628066985203-d45e75825a90?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    } 

    created = 0

    for index, car in enumerate(cars):

        owner = showrooms[index % len(showrooms)]

        (
            brand,
            model,
            variant,
            year,
            color,
            plate,
            transmission,
            fuel,
            seats,
            price,
            city,
        ) = car

        existing = (
            db.query(Car)
            .filter(Car.license_plate == plate)
            .first()
        )

        if existing:
           existing.image_url = car_images.get((brand, model))
           existing.ai_vehicle_score = 95.0
           
        if existing:
            print(f"Updating {brand} {model}")
            existing.image_url = car_images.get((brand, model))
            existing.ai_vehicle_score = 95.0
            continue
    
        vehicle = Car(
            owner_id=owner.id,
            brand=brand,
            model=model,
            variant=variant,
            year=year,
            color=color,
            license_plate=plate,
            transmission=transmission,
            fuel_type=fuel,
            seats=seats,
            daily_price=Decimal(price),
            city=city,
            is_available=True,
            image_url=car_images.get((brand, model)),
            ai_vehicle_score=95.0,
        )

        db.add(vehicle)
        created += 1

    db.commit()
    print("Committed")
    db.close()

    print(f"Created {created} cars.")

if __name__ == "__main__":
    seed_cars()