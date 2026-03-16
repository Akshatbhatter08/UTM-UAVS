
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from backend.app.models import Base, User, Drone, Geofence
from backend.app.config import settings
from backend.app.auth import get_password_hash

def init():
    engine = create_engine(settings.DB_URL)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    s = Session(bind=engine)
    # create admin user
    admin_email = 'admin@example.com'
    existing = s.query(User).filter(User.email==admin_email).first()
    if not existing:
        admin = User(email=admin_email, hashed_password=get_password_hash('adminpass'), is_admin=True)
        s.add(admin); s.commit(); s.refresh(admin)
        print("Created admin user:", admin.email)
    # sample drone
    user = s.query(User).filter(User.email==admin_email).first()
    d = s.query(Drone).filter(Drone.owner_id==user.id).first()
    if not d:
        drone = Drone(name='SampleDrone', owner_id=user.id)
        s.add(drone); s.commit(); s.refresh(drone)
        print("Created sample drone:", drone.id)
    # sample geofence (a small square near Delhi)
    gf_exists = s.query(Geofence).filter(Geofence.name=='Delhi Square').first()
    if not gf_exists:
        poly = [[28.61,77.20],[28.61,77.22],[28.63,77.22],[28.63,77.20]]
        gf = Geofence(name='Delhi Square', polygon=poly, type='no-fly')
        s.add(gf); s.commit(); s.refresh(gf)
        print('Created geofence:', gf.name)
    s.close()
    print('Init complete.')

if __name__ == '__main__':
    init()
