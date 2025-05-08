from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import relationship, validates
from datetime import datetime,timezone
from sqlalchemy import Column, Integer, String
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate


db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()

# User model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "is_admin": self.is_admin
        }

# Warehouse model
class Warehouse(db.Model):
    __tablename__ = 'warehouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    products = db.relationship('Product', backref='warehouse', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Branch model
class Branch(db.Model):
    __tablename__ = 'branches'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    products = db.relationship('Product', backref='branch', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

# Product model
class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    warehouse_qty = db.Column(db.Integer, default=0)
    branch_qty = db.Column(db.Integer, default=0)

    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "warehouse_qty": self.warehouse_qty,
            "branch_qty": self.branch_qty,
            "warehouse": self.warehouse.name if self.warehouse else None,
            "branch": self.branch.name if self.branch else None
        }

# TransferRequest model
class TransferRequest(db.Model):
    __tablename__ = 'transfer_requests'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    qty = db.Column(db.Integer, nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branches.id'))

    product = db.relationship('Product')
    branch = db.relationship('Branch')

    def to_dict(self):
        return {
            "id": self.id,
            "product": self.product.name if self.product else None,
            "qty": self.qty,
            "branch": self.branch.name if self.branch else None
        }




