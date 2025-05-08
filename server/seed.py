import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__) + '/../'))

from server import create_app, db
from server.models import Branch, Product, TransferRequest, User, Warehouse

app = create_app()

with app.app_context():
    print("🌱 Seeding the database...")

    # Clear any existing data if needed (optional)
    TransferRequest.query.delete()
    Product.query.delete()
    Branch.query.delete()
    Warehouse.query.delete()
    User.query.delete()

    # Create users
    user1 = User(username='admin')
    user1.set_password('admin123')
    user2 = User(username='Alex')
    user2.set_password('Alex1234')
    user3 = User(username='Mary')
    user3.set_password('Mary@123')
    user4 = User(username='John')
    user4.set_password('John2345')
    db.session.add_all([user1, user2, user3, user4])

    # Create warehouse
    warehouse1 = Warehouse(name='Main Warehouse')
    db.session.add(warehouse1)
    db.session.flush()
    # Create branches
    branch1 = Branch(name='Downtown Branch')
    branch2 = Branch(name='Bondeni Branch')
    branch3 = Branch(name='Hill crest Branch')
    branch4 = Branch(name='Uptown Branch')
    branch5 = Branch(name='Dodoma Branch')
    branch6 = Branch(name='Doorma Branch')
    db.session.add_all([branch1, branch2, branch3, branch4, branch5, branch6])
    db.session.flush()

    # Create products
    products = [
        Product(name='Laptop', warehouse_qty=20, branch_qty=5, warehouse_id=warehouse1.id, branch_id=branch1.id),
        Product(name='Home Theatre', warehouse_qty=10, branch_qty=2, warehouse_id=warehouse1.id, branch_id=branch2.id),
        Product(name='Samsung TV', warehouse_qty=15, branch_qty=1, warehouse_id=warehouse1.id, branch_id=branch5.id),
        Product(name='Microwave', warehouse_qty=200, branch_qty=2, warehouse_id=warehouse1.id, branch_id=branch4.id),
        Product(name='Washing Machine', warehouse_qty=14, branch_qty=4, warehouse_id=warehouse1.id, branch_id=branch3.id),
        Product(name='Dishwasher', warehouse_qty=25, branch_qty=4, warehouse_id=warehouse1.id, branch_id=branch6.id),
    ]
    db.session.add_all(products)

    db.session.commit()
    print("✅ Done seeding!")
