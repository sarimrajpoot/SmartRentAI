from uuid import UUID
from sqlalchemy.orm import Session
from app.models.car import Car
from app.models.booking import Booking

def get_recommendations(
    db: Session,
    user_id: UUID,
    budget_min: float | None = None,
    budget_max: float | None = None,
    seats: int | None = None,
    fuel_type: str | None = None,
    transmission: str | None = None,
    city: str | None = None,
    limit: int = 12,
) -> list[dict]:
    # Get user's past bookings to boost similar brands
    past_bookings = db.query(Booking).filter(Booking.customer_id == user_id).all()
    past_car_ids = [b.car_id for b in past_bookings]
    
    past_brands = []
    if past_car_ids:
        past_cars = db.query(Car).filter(Car.id.in_(past_car_ids)).all()
        past_brands = [car.brand for car in past_cars]

    # Get available cars
    available_cars = db.query(Car).filter(Car.is_available == True).all()
    
    recommendations = []
    
    for car in available_cars:
        score = 0.0
        explanations = []
        
        # Budget match (30 points)
        if budget_min is not None and budget_max is not None:
            if budget_min <= car.daily_price <= budget_max:
                score += 30
                explanations.append("Fits your budget perfectly.")
            elif budget_min * 0.9 <= float(car.daily_price) <= budget_max * 1.1:
                score += 15
                explanations.append("Close to your budget range.")
        else:
            score += 15 # Default
        
        # Seats match (15 points)
        if seats is not None:
            if car.seats == seats:
                score += 15
                explanations.append(f"Has exactly {seats} seats as requested.")
            elif abs(car.seats - seats) <= 1:
                score += 7
                explanations.append("Has a similar number of seats to your request.")
        else:
            score += 7.5

        # Fuel preference (15 points)
        if fuel_type is not None:
            car_fuel = str(car.fuel_type).split('.')[-1].upper() if car.fuel_type else ""
            if car_fuel == fuel_type.upper():
                score += 15
                explanations.append(f"Matches your {fuel_type} fuel preference.")
        else:
            score += 7.5

        # Transmission match (10 points)
        if transmission is not None:
            car_trans = str(car.transmission).split('.')[-1].upper() if car.transmission else ""
            if car_trans == transmission.upper():
                score += 10
                explanations.append(f"Has your preferred {transmission} transmission.")
        else:
            score += 5

        # City match (10 points)
        if city is not None:
            if car.city and car.city.lower() == city.lower():
                score += 10
                explanations.append(f"Available in {city}.")
        else:
            score += 5

        # AI Score bonus (10 points)
        if car.ai_vehicle_score is not None:
            # Assuming ai_vehicle_score is out of 100
            score += (car.ai_vehicle_score / 100) * 10
        
        # Past booking affinity (10 points)
        if car.brand in past_brands:
            score += 10
            explanations.append("You've driven this brand before.")
            
        final_score = min(int(score), 100)
        
        if explanations:
            explanation_str = " ".join(explanations)
        else:
            explanation_str = "A good overall match based on vehicle quality."
            
        recommendations.append({
            "car": car,
            "match_score": final_score,
            "explanation": explanation_str
        })
        
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)
    
    return recommendations[:limit]
