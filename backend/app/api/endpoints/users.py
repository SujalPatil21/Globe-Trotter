from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.db.database import get_db
from app.models.trip import CommunityExperience, CommunityExperienceLike
from app.models.user import User
from app.auth.security.dependencies import get_optional_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{username}")
def get_public_profile(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Case-insensitive lookup
    user = db.query(User).filter(func.lower(User.username) == username.lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # published_by is the correct FK field name (not publisher_id)
    experiences = (
        db.query(CommunityExperience)
        .filter(
            CommunityExperience.published_by == user.id,
            CommunityExperience.is_published == True
        )
        .order_by(CommunityExperience.published_at.desc())
        .all()
    )

    user_id = current_user.id if current_user else None
    exp_list = []
    for exp in experiences:
        try:
            trip = exp.trip
            if not trip:
                continue
            unique_cities = list(dict.fromkeys(
                [s.city.city for s in trip.stops if s.city]
            ))
            duration = (trip.end_date - trip.start_date).days + 1
            is_liked = False
            if user_id:
                is_liked = db.query(CommunityExperienceLike).filter(
                    CommunityExperienceLike.experience_id == exp.id,
                    CommunityExperienceLike.user_id == user_id
                ).first() is not None

            exp_list.append({
                "id": exp.id,
                "trip_name": trip.name,
                "description": trip.description,
                "cover_image": trip.cover_image,
                "budget_tier": trip.budget_tier,
                "interests": trip.interests,
                "cities": unique_cities,
                "duration": duration,
                "like_count": exp.like_count,
                "copy_count": exp.copy_count,
                "is_liked_by_me": is_liked,
                "published_at": exp.published_at.isoformat() if exp.published_at else None,
            })
        except Exception:
            # Skip malformed experience records gracefully
            continue

    return {
        "username": user.username,
        "full_name": user.full_name or user.username,
        "avatar_url": user.avatar_url,
        "member_since": user.created_at.strftime("%B %Y"),
        "experience_count": len(exp_list),
        "experiences": exp_list,
    }
