# server/routes/register_routes.py

from server.routes.auth import auth_bp
from server.routes.products import products_bp
from server.routes.transfers import transfers_bp
from server.routes.inventory import inventory_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(transfers_bp)
    app.register_blueprint(inventory_bp)
