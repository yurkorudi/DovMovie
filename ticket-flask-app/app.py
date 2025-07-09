from flask import Flask, render_template, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from user_agents import *
import requests
import uuid
from models import Movie
from extensions import db


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dvzh_dev:19950812amZ@usbmr293.mysql.network:10279/dvzh_dev'
app.config['DM_HOST'] = '192.168.1.12'
app.config['DM_PORT'] = 3939
app.config['DM_DEVICE'] = 'test'
db.init_app(app)



def rro_send(payload: dict):
    url = f"http://{current_app.config['DM_HOST']}:{current_app.config['DM_PORT']}/dm/execute"
    resp = requests.post(url, json=payload, headers={'Content-Type':'application/json'})
    resp.raise_for_status()
    return resp.json()



@app.route('/')
def red():
    return redirect('/buy')



@app.route('/payment', methods=['POST'])
def pay():
    #_____ For LiqPay ____#
    
    return jsonify({'status': 'ok', 'massage': 'LiqPay'})


@app.route('/receipt')
def receipt():
    data = request.args.get('data_for_rro')
    if not data:
        ticket_items = [
        {"name": "Квиток: Avatar", "price": 1000, "quantity":1, "tax":0}
        ]
        payments = [
        {"type": 1, "sum": 1000}  
        ]
        fiscal = {
        "task": 1,         # 1 = чек на продаж :contentReference[oaicite:2]{index=2}
        "goods": ticket_items,
        "payments": payments
        }
        data = {
            "ver": 6,
            "source": 'source',
            "device": 'device',
            "tag": "sale_"+str(uuid()),
            "type": 1,
            "fiscal": fiscal
        }
    
    
    a = rro_send(payload=data)
    return jsonify({'massage': a})
    


@app.route('/checkout', methods=['POST'])
def checkout():

    print("GoodJob")
    return jsonify({'status' : 'accepted'}), 200

@app.route('/buy')
def buy_ticket():
    try: 
        mov_id = request.args.get('movie_id')

        movie = Movie.query.filter_by(id=mov_id).first()
        if not movie:
            movie_data = {'title' : 'Movie not found',
                'poster' : 'static/img/red.jpg'}
        else: 
            movie_data = {
            'id' : movie.id,
            'title' : movie.title,
            'age' : movie.age,
            'genre' : movie.genre,
            'filmMaker' : movie.filmMaker,
            'duration' : movie.duration,
            'description' : movie.description,
            'trailerLink' : movie.trailerLink,
            'poster' : movie.poster,
            'price' : movie.price,
        }
        ua_string = request.headers.get("User-Agent", "")
        user_agent = parse(ua_string)    
        is_mobile = user_agent.is_mobile

        print(movie_data)

        return render_template(
            'buy.html',
            movie_data = movie_data,
            movie_session=None,
            occupied_seats=[],
            is_mobile = is_mobile
        )
        
    except:
        return jsonify({'status' : 'error'})

if __name__ == '__main__':
    app.run(debug=True)