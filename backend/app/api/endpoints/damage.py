from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
import os

from app.database.dependencies import get_db
from app.models.damage_report import DamageReport
from app.schemas.damage_report import DamageReportResponse
from app.ai.damage_detector.detector import analyze_damage

router = APIRouter()

UPLOAD_DIR = "uploads/damage"

@router.post("/analyze", response_model=DamageReportResponse)
async def analyze_vehicle_damage(
    booking_id: UUID = Form(...),
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        before_bytes = await before_image.read()
        after_bytes = await after_image.read()
        
        # Call the AI model
        analysis = analyze_damage(before_bytes, after_bytes, UPLOAD_DIR)
        
        # Save to DB
        report = DamageReport(
            booking_id=booking_id,
            before_image_url=f"/uploads/damage/{analysis['before_image_filename']}",
            after_image_url=f"/uploads/damage/{analysis['after_image_filename']}",
            annotated_image_url=f"/uploads/damage/{analysis['annotated_image_filename']}",
            condition_score=analysis['condition_score'],
            total_repair_cost=analysis['total_repair_cost'],
            damages=analysis['damages']
        )
        
        db.add(report)
        db.commit()
        db.refresh(report)
        
        return report
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to analyze damage: {str(e)}")

@router.get("/{booking_id}", response_model=list[DamageReportResponse])
def get_booking_damage_reports(booking_id: UUID, db: Session = Depends(get_db)):
    reports = db.query(DamageReport).filter(DamageReport.booking_id == booking_id).all()
    return reports
