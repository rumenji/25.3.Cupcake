from flask import Flask, render_template, flash, redirect, jsonify, request
from models import db, connect_db, Cupcake
from forms import AddCupcakeForm

app = Flask(__name__)
app.config["SECRET_KEY"] = "oh-so-secret"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///cupcakes"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

connect_db(app)
with app.app_context():
    db.create_all()
"""Flask app for Cupcakes"""

@app.route("/")
def homepage():
    form = AddCupcakeForm()
    return render_template('homepage.html', form=form)

@app.route('/api/cupcakes')
def get_cupcakes():
    cupcakes = Cupcake.query.all()
    data = [cupcake.serialize() for cupcake in cupcakes]
    return jsonify(cupcakes=data)

@app.route('/api/cupcakes/search')
def search_cupcakes():
    search_val = request.args['search']
    cupcakes = Cupcake.query.filter(Cupcake.flavor.ilike(f'%{search_val}%')).all()
    print(f"Cupcakes: {cupcakes}")
    data = [Cupcake.serialize(cupcake )for cupcake in cupcakes]
    return jsonify(cupcakes=data)

@app.route('/api/cupcakes/<int:cup_id>')
def get_cupcake(cup_id):
    cupcake = Cupcake.query.get_or_404(cup_id)
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes', methods=['POST'])
def add_cupcake():
    flavor = request.json.get('flavor')
    size = request.json.get('size')
    rating = request.json.get('rating')
    image = request.json.get('image')

    cupcake = Cupcake(flavor=flavor, size=size, rating=rating, image=image or None)
    db.session.add(cupcake)
    db.session.commit()
    return (jsonify(cupcake=cupcake.serialize()), 201)

@app.route('/api/cupcakes/<int:cup_id>', methods=['PATCH'])
def update_cupcake(cup_id):
    cupcake = Cupcake.query.get_or_404(cup_id)
    cupcake.flavor = request.json.get('flavor', cupcake.flavor)
    cupcake.size = request.json.get('size', cupcake.size)
    cupcake.rating = request.json.get('rating', cupcake.rating)
    cupcake.image = request.json.get('image', cupcake.image)
    db.session.commit()
    return jsonify(cupcake=cupcake.serialize())

@app.route('/api/cupcakes/<int:cup_id>', methods=['DELETE'])
def delete_cupcake(cup_id):
    cupcake = Cupcake.query.get_or_404(cup_id)
    db.session.delete(cupcake)
    db.session.commit()
    return jsonify(message='Deleted')