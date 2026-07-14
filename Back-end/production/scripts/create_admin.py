# production/scripts/create_admin.py
from app.db.database import SessionLocal
from app.models.erp_models import Employee
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    try:
        admin = Employee(
            id="admin",
            name="System Admin",
            email="admin@eternis.com",
            hashed_password=get_password_hash("AdminPass123!"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("✅ Admin user created successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()