from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_current_user, require_role
from app.database.dependencies import get_db
from app.enums.user import UserRole
from app.models.user import User
from app.models.wishlist import WishlistItem
from app.models.car import Car
from app.schemas.wishlist import WishlistAdd, WishlistItemResponse, WishlistListResponse
from app.schemas.car import CarResponse

router = APIRouter(
    prefix="/wishlist",
    tags=["Wishlist"],
)

@router.get("", response_model=WishlistListResponse, summary="Get my wishlist")
def get_wishlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    items = (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.car))
        .filter(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )
    validated = [
        WishlistItemResponse.model_validate(item) for item in items
    ]
    return WishlistListResponse(items=validated, total=len(validated))


@router.post("", response_model=WishlistItemResponse, status_code=status.HTTP_201_CREATED, summary="Add to wishlist")
def add_to_wishlist(
    payload: WishlistAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    # Check car exists
    car = db.query(Car).filter(Car.id == payload.car_id).first()
    if not car:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found.")

    # Check for duplicate
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.car_id == payload.car_id,
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Vehicle already in wishlist.")

    item = WishlistItem(user_id=current_user.id, car_id=payload.car_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    # Eager load car for response
    item = (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.car))
        .filter(WishlistItem.id == item.id)
        .first()
    )
    return WishlistItemResponse.model_validate(item)


@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove from wishlist")
def remove_from_wishlist(
    car_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.car_id == car_id,
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wishlist item not found.")
    db.delete(item)
    db.commit()


@router.get("/ids", summary="Get wishlisted car IDs")
def get_wishlist_ids(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.CUSTOMER)),
):
    ids = (
        db.query(WishlistItem.car_id)
        .filter(WishlistItem.user_id == current_user.id)
        .all()
    )
    return {"car_ids": [str(row[0]) for row in ids]}
