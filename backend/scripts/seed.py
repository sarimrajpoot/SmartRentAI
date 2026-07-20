from scripts.seed_users import seed_users
from scripts.seed_cars import seed_cars


def main():
    print("=" * 50)
    print("🚗 SmartRent AI Database Seeder")
    print("=" * 50)

    seed_users()
    seed_cars()

    print("\n✅ Database seeded successfully!")


if __name__ == "__main__":
    main()