from app.errors.exceptions import NotFoundError, ValidationError
from app.extensions import db
from app.models import Parcel, WeightCategory
from app.utils.validators import validate_parcel_payload


def create_parcel(payload):
    data = validate_parcel_payload(payload)

    if WeightCategory.query.get(data["weight_category_id"]) is None:
        raise NotFoundError("Weight category not found.")

    parcel = Parcel(
        description=data["description"],
        weight=data["weight"],
        weight_category_id=data["weight_category_id"],
        image_url=data["image_url"],
        special_instructions=data["special_instructions"],
    )
    db.session.add(parcel)
    db.session.flush()
    return parcel


def get_parcel(parcel_id):
    parcel = Parcel.query.get(parcel_id)
    if parcel is None:
        raise NotFoundError("Parcel not found.")
    return parcel
