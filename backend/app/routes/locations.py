from flask import Blueprint, jsonify

from app.models.location import Location

locations_bp = Blueprint("locations", __name__)


@locations_bp.get("")
def list_locations():
    locations = Location.query.order_by(Location.city.asc(), Location.address.asc()).all()

    features = [
        {
            "type": "Feature",
            "properties": {
                "id": location.id,
                "name": location.address,
                "category": location.city or "location",
                "address": location.address,
                "city": location.city,
                "country": location.country,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [float(location.longitude), float(location.latitude)],
            },
        }
        for location in locations
    ]

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    return jsonify(geojson), 200
