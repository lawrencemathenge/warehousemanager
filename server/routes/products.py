from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from server.models import db, Product

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
@jwt_required()
def get_products():
    try:
        print("✅ Received request to /api/products")
        print("✅ Headers received:", dict(request.headers))
        identity = get_jwt_identity()
        print("🔐 JWT Identity:", identity)

        products = Product.query.all()
        return jsonify([p.to_dict() for p in products]), 200

    except Exception as e:
        print("❌ Error in get_products:", str(e))
        return jsonify({'error': 'Unable to retrieve products', 'details': str(e)}), 500

@products_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    try:
        data = request.get_json()
        print("📦 Creating product with data:", data)

        product = Product(
            name=data['name'],
            warehouse_qty=data['warehouse_qty'],
            branch_qty=data['branch_qty'],
            warehouse_id=data['warehouse_id'],
            branch_id=data['branch_id']
        )

        db.session.add(product)
        db.session.commit()
        return jsonify(product.to_dict()), 201

    except Exception as e:
        print("❌ Error creating product:", str(e))
        return jsonify({'error': 'Unable to create product', 'details': str(e)}), 400

@products_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    try:
        product = Product.query.get_or_404(id)
        db.session.delete(product)
        db.session.commit()
        print(f"🗑️ Deleted product ID: {id}")
        return jsonify({'message': 'Product deleted'}), 200

    except Exception as e:
        print("❌ Error deleting product:", str(e))
        return jsonify({'error': 'Unable to delete product', 'details': str(e)}), 400
