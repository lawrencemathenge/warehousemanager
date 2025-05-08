from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from server.models import TransferRequest, db, Product, Branch

transfers_bp = Blueprint('transfers', __name__, url_prefix='/api/transfers')


@transfers_bp.route('', methods=['GET'])
@jwt_required()
def get_transfers():
    transfers = TransferRequest.query.all()
    return jsonify([t.to_dict() for t in transfers])


@transfers_bp.route('', methods=['POST'])
@jwt_required()
def create_transfer():
    data = request.get_json()

    # Input validation
    required_fields = ['product_id', 'branch_id', 'quantity']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        product_id = int(data['product_id'])
        branch_id = int(data['branch_id'])
        quantity = int(data['quantity'])
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid input types'}), 400

    if quantity <= 0:
        return jsonify({'error': 'Quantity must be greater than 0'}), 400

    # Fetch product and branch
    product = Product.query.get(product_id)
    branch = Branch.query.get(branch_id)

    if not product or not branch:
        return jsonify({'error': 'Product or Branch not found'}), 404

    # Check stock
    if product.warehouse_qty < quantity:
        return jsonify({'error': 'Not enough stock in warehouse'}), 400

    # Update stock levels
    product.warehouse_qty -= quantity
    product.branch_qty += quantity

    # Create transfer
    transfer = TransferRequest(
        product_id=product.id,
        qty=quantity,
        branch_id=branch.id
    )
    db.session.add(transfer)
    db.session.commit()

    return jsonify(transfer.to_dict()), 201


@transfers_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transfer(id):
    transfer = TransferRequest.query.get(id)

    if not transfer:
        return jsonify({'error': 'Transfer not found'}), 404

    db.session.delete(transfer)
    db.session.commit()
    return jsonify({'message': 'Transfer deleted'}), 200
