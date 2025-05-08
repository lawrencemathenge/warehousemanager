from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from server.models import db, migrate

jwt = JWTManager() 

def create_app():
    app = Flask(__name__)
    app.config.from_object('server.config.Config')

    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False

    jwt.init_app(app)
    print("✅ App created, JWT initialized.")

    
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {"origins": "http://localhost:5173"}
    })

    db.init_app(app)
    migrate.init_app(app, db)

    
    from server.routes.auth import auth_bp
    from server.routes.products import products_bp
    from server.routes.transfers import transfers_bp
    from server.routes.inventory import inventory_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(transfers_bp)
    app.register_blueprint(inventory_bp)

    @jwt.unauthorized_loader
    def custom_unauthorized_response(reason):
        return jsonify({'error': 'Missing or invalid JWT', 'reason': reason}), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_callback(reason):
        return jsonify({'error': 'Invalid token', 'reason': reason}), 422

    @jwt.expired_token_loader
    def custom_expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token expired'}), 401

    return app
