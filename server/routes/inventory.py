from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from server.models import TransferRequest, db, Product, Branch, Warehouse

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api')

@inventory_bp.route('/warehouses', methods=['GET'])
@jwt_required()
def get_warehouses():
    return jsonify([w.to_dict() for w in Warehouse.query.all()])

@inventory_bp.route('/branches', methods=['GET'])
@jwt_required()
def get_branches():
    return jsonify([b.to_dict() for b in Branch.query.all()])
