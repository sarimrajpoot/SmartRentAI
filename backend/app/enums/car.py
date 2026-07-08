from enum import Enum


class FuelType(str, Enum):
    PETROL = "Petrol"
    DIESEL = "Diesel"
    HYBRID = "Hybrid"
    ELECTRIC = "Electric"


class TransmissionType(str, Enum):
    MANUAL = "MANUAL"
    AUTOMATIC = "AUTOMATIC"


class CarStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    RENTED = "RENTED"
    MAINTENANCE = "MAINTENANCE"
    RESERVED = "RESERVED"


class CarCategory(str, Enum):
    SEDAN = "SEDAN"
    HATCHBACK = "HATCHBACK"
    SUV = "SUV"
    CROSSOVER = "CROSSOVER"
    PICKUP = "PICKUP"
    VAN = "VAN"
    SPORTS = "SPORTS"
    LUXURY = "LUXURY"