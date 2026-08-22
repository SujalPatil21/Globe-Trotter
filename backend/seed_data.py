import asyncio
from sqlalchemy.orm import Session
from app.db.database import engine, Base
from app.models import City, Activity, Role

def seed_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    with Session(engine) as session:
        # Check if roles exist
        if not session.query(Role).first():
            print("Seeding roles...")
            session.add_all([
                Role(name="ADMIN", description="Administrator"),
                Role(name="USER", description="Standard User")
            ])
            session.commit()

        # Check if cities exist
        if not session.query(City).first():
            print("Seeding cities...")
            cities = [
                City(name="Mumbai", country="India", region="Maharashtra", cost_index=70, popularity=95, image_url="https://images.unsplash.com/photo-1522295593892-23c330c6a85f"),
                City(name="Goa", country="India", region="Goa", cost_index=65, popularity=100, image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2"),
                City(name="Bangalore", country="India", region="Karnataka", cost_index=80, popularity=90, image_url="https://images.unsplash.com/photo-1596176530529-78163a4f7af2"),
            ]
            session.add_all(cities)
            session.commit()
            
            print("Seeding activities...")
            mumbai = session.query(City).filter_by(name="Mumbai").first()
            goa = session.query(City).filter_by(name="Goa").first()
            blr = session.query(City).filter_by(name="Bangalore").first()

            activities = [
                Activity(city_id=mumbai.id, name="Gateway of India Tour", type="sightseeing", cost=500, duration_minutes=120),
                Activity(city_id=mumbai.id, name="Marine Drive Walk", type="leisure", cost=0, duration_minutes=60),
                Activity(city_id=goa.id, name="Baga Beach Water Sports", type="adventure", cost=1500, duration_minutes=180),
                Activity(city_id=goa.id, name="Fort Aguada Visit", type="sightseeing", cost=100, duration_minutes=90),
                Activity(city_id=blr.id, name="Lalbagh Botanical Garden", type="nature", cost=50, duration_minutes=120),
                Activity(city_id=blr.id, name="Pub Crawl in Indiranagar", type="food", cost=2500, duration_minutes=240),
            ]
            session.add_all(activities)
            session.commit()
            
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
