from flask import Flask, render_template, request, redirect, jsonify, session, url_for, flash, current_app
from flask_admin import Admin, BaseView, expose
from flask_admin.contrib.sqla import ModelView
from flask_admin.form import FileUploadField
from wtforms_sqlalchemy.fields import QuerySelectField
from flask_admin.form import SecureForm
from wtforms.validators import DataRequired
from flask_admin.model import filters
from flask_admin import helpers as admin_helpers
from flask_admin import AdminIndexView
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from uuid import uuid4
import os
from user_agents import *
import requests
import uuid
from models import Movie
from extensions import db


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dvzh_dev:19950812amZ@usbmr293.mysql.network:10279/dvzh_dev'
app.config['DM_HOST'] = '192.168.178.143'
app.config['DM_PORT'] = 3939
app.config['DM_DEVICE'] = 'test'
app.config['SECRET_KEY'] = 'AdminSecretKey(2025)s'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['DM_DEVICE'] = 'test'
app.config['ADMIN_PASSWORD'] = os.environ.get('ADMIN_PASSWORD', '1234')
db.init_app(app)
Session(app)

# _____________________ admin panel ________________________# 


class MainViev(BaseView):
    @expose('/')
    def index(self, **kwargs):
        print ('____ is in admin kasa page ____ ')
        
        return self.render('kasa.html')
    
    
    def is_accessible(self):
        return session.get('is_admin')

    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))
    
    
class CustomHomeView(AdminIndexView):
    @expose('/')
    def index(self):
        print ('____ is in admin home page ______')
        
        return self.render('admin/Home.html')
    
    
    def is_accessible(self):
        return session.get('is_admin')
    
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))
    
    
class AuthModelView(ModelView):
    def is_accessible(self):
        return session.get('is_admin')
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('admin_login'))
    

admin = Admin(app, name="Каса", template_mode='bootstrap3', url='/admin', endpoint='admin', index_view=CustomHomeView())
admin.add_view(MainViev(endpoint='kasa', name='Каса'))



# _________ wev page code _______# 


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        pwd = request.form.get('password')
        if pwd == app.config['ADMIN_PASSWORD']:
            session['is_admin'] = True
            return redirect(url_for('admin.index'))
        flash('Невірний пароль', 'error')
    return render_template('admin/admin-login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('is_admin', None)
    return redirect(url_for('admin_login'))


def rro_send(payload: dict, url=None):
    print(url)
    # url = f"http://{current_app.config['DM_HOST']}:{current_app.config['DM_PORT']}/dm/execute-pkg"
    resp = requests.post(url, json=payload, headers={'Content-Type':'application/json'})
    resp.raise_for_status()
    return resp.json()


def open_shift():
    payload = {
        "ver": 6,
        "source": "CenterDovzhenkoCinema",
        "device": current_app.config['DM_DEVICE'],
        "tag": f"open_shift_{uuid4()}",
        "type": 1,
        "fiscal": {
            "task": 0
        }
    }
    return rro_send(payload)



def sell_ticket():
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn"
    url += "?dev_id=MyPrinterName"

    payload = {
      "ver": 6,
      "source": "MyCinemaPOS",
      "device": app.config['DM_DEVICE'],
      "tag": f"print_{uuid4()}",
      "type": 1,
      "fiscal": {
        "task": 1,
        "receipt": {
          "sum": 1000,
          "rows": [
            {"code":"T1","name":"Квиток","cnt":1,"price":1000,"cost":1000,"disc":0,"taxgrp":2}
          ],
          "pays":[{"type":2,"sum":1000}]
        }
      }
    }

    r = requests.post(url, json=payload)
    r.raise_for_status()
    result = r.json()
    print("isprint:", result.get("info",{}).get("isprint"))
    return jsonify(result)




@app.route('/')
def red():
    a = sell_ticket()
    return jsonify(str(a))



@app.route('/payment', methods=['POST'])
def pay():
    #_____ For LiqPay ____#
    
    return jsonify({'status': 'ok', 'massage': 'LiqPay'})


@app.route('/receipt')
def receipt():
    print('____receipt_____')
    data = request.args.get('data_for_rro')
    if not data:
        ticket_items = [
        {"name": "Квиток: Avatar", "price": 1000, "quantity":1, "tax":0}
        ]
        payments = [
        {"type": 1, "sum": 1000}  
        ]
        fiscal = {
        "task": 1,
        "goods": ticket_items,
        "payments": payments
        }
        data = {
            "ver": 6,
            "source": 'CenterDovzhenkoCinema',
            "device": current_app.config['DM_DEVICE'],
            "tag": f"sale_{uuid4()}",
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

