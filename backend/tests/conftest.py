import pytest

from app import create_app
from app.extensions import db
from app.models import User


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
