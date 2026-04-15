import pytest

from app import create_app
from app.extensions import db
from app.models import Location, User, WeightCategory


@pytest.fixture()
def app():
    app = create_app("testing")
    app.config.update(TESTING=True)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def create_user(app):
    def _create_user(email="admin@example.com", password="Password123", role="admin"):
        with app.app_context():
            user = User(email=email, role=role)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            db.session.refresh(user)
            return user

    return _create_user


@pytest.fixture()
def create_location(app):
    def _create_location(address="123 Main St", city="Nairobi", country="Kenya", latitude=1.28333, longitude=36.81667):
        with app.app_context():
            location = Location(
                address=address,
                city=city,
                country=country,
                latitude=latitude,
                longitude=longitude,
            )
            db.session.add(location)
            db.session.commit()
            db.session.refresh(location)
            return location

    return _create_location


@pytest.fixture()
def create_weight_category(app):
    def _create_weight_category(name="Light", min_weight=0.01, max_weight=5.00, base_price=150.00):
        with app.app_context():
            weight_category = WeightCategory(
                name=name,
                min_weight=min_weight,
                max_weight=max_weight,
                base_price=base_price,
            )
            db.session.add(weight_category)
            db.session.commit()
            db.session.refresh(weight_category)
            return weight_category

    return _create_weight_category
