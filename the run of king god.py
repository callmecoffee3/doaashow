from flask import Flask, request, jsonify

app = Flask(__therunofkinggod__)

characters = []
vehicles = []
scenes = []
props = []
weapons = []
hairs = []
wigs = []
clothings = []
shops = []

@app.route('/character', methods=['POST'])
def create_character():
    data = request.json
    character = {
        'name': data['name'],
        'hair': data['hair'],
        'eyes': data['eyes'],
        'skin': data['skin'],
    }
    characters.append(character)
    return jsonify(character)

@app.route('/vehicle', methods=['POST'])
def create_vehicle():
    data = request.json
    vehicle = {
        'name': data['name'],
        'year': data['year'],
        'model': data['model'],
    }
    vehicles.append(vehicle)
    return jsonify(vehicle)

@app.route('/scene', methods=['POST'])
def create_scene():
    data = request.json
    scene = {
        'name': data['name'],
        'description': data['description'],
    }
    scenes.append(scene)
    return jsonify(scene)

@app.route('/prop', methods=['POST'])
def create_prop():
    data = request.json
    prop = {
        'name': data['name'],
        'type': data['type'],
    }
    props.append(prop)
    return jsonify(prop)

@app.route('/weapon', methods=['POST'])
def create_weapon():
    data = request.json
    weapon = {
        'name': data['name'],
        'type': data['type'],
    }
    weapons.append(weapon)
    return jsonify(weapon)

@app.route('/hair', methods=['POST'])
def create_hair():
    data = request.json
    hair = {
        'name': data['name'],
        'color': data['color'],
    }
    hairs.append(hair)
    return jsonify(hair)

@app.route('/wig', methods=['POST'])
def create_wig():
    data = request.json
    wig = {
        'name': data['name'],
        'color': data['color'],
    }
    wigs.append(wig)
    return jsonify(wig)

@app.route('/clothing', methods=['POST'])
def create_clothing():
    data = request.json
    clothing = {
        'name': data['name'],
        'type': data['type'],
    }
    clothings.append(clothing)
    return jsonify(clothing)

@app.route('/shop', methods=['POST'])
def create_shop():
    data = request.json
    shop = {
        'name': data['name'],
        'type': data['type'],
    }
    shops.append(shop)
    return jsonify(shop)

if __name__ == '__main__':
    app.run(debug=True)