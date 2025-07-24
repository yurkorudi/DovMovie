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
from models import Movie, Showtime, Ticket
from extensions import db
from datetime import *
from zoneinfo import ZoneInfo
import pytz
import json
from sqlalchemy import func

from flask import send_file, session as flask_session


from reportlab.lib.pagesizes import A6
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm

import re
from flask_apscheduler import APScheduler


# pdfmetrics.registerFont(
#     TTFont('DejaVuSans', 'static/fonts/DejaVuSans.ttf'),
# )
# pdfmetrics.registerFont(
#     TTFont('DejaVuSans-Bold', 'static/fonts/DejaVuSans-Bold.ttf')
# )
# pdfmetrics.registerFont(
#     TTFont('DejaVuSans-BoldOblique', 'static/fonts/DejaVuSans-BoldOblique.ttf')
# )
# pdfmetrics.registerFont(
#     TTFont('DejaVuSans-ExtraLight', 'static/fonts/DejaVuSans-ExtraLight.ttf') 
# )

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dvzh_dev:19950812amZ@usbmr293.mysql.network:10279/dvzh_dev'
app.config['DM_HOST'] = '192.168.31.36'
app.config['DM_PORT'] = 3939
app.config['DM_DEVICE'] = 'test'
app.config['SECRET_KEY'] = 'AdminSecretKey(2025)s'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['DM_DEVICE'] = 'test'
app.config['ADMIN_PASSWORD'] = os.environ.get('ADMIN_PASSWORD', '1234')
db.init_app(app)
Session(app)


UTC = pytz.UTC
KYIV = pytz.timezone('Europe/Kiev')
# _____________________ admin panel ________________________# 



class MainViev(BaseView):
    @expose('/')
    def index(self, **kwargs):
        print ('____ is in admin kasa page ____ ')
        
        return self.render('admin/kasa.html')
    
    
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




# _____________________________ api ___________________________________#

@app.route('/api/tickets')
def api_tickets():

    tickets = db.session.query(Ticket).all()
    result = []
    for t in tickets:
        row = int(t.seatRow) - 1
        col = int(t.seatNumb) - 1
        result.append({
            'sessionId':  t.sessionId,
            'row':        row,
            'seatNumber': col
        })
    return jsonify(result)


@app.route('/api/sessions')
def get_sessions():
    date_str = request.args.get('date')
    try:
        date = datetime.fromisoformat(date_str).date()
    except Exception:
        date = datetime.utcnow().date()


    sessions = (db.session.query(Showtime)
                .filter(db.func.date(Showtime.dateTime) == date)
                .all())


    result = []
    for s in sessions:
        film = Movie.query.filter_by(id=s.movieId).first()
        result.append({
            "id": s.id,
            "time": s.dateTime.strftime("%H:%M"),
            "title": film.title,
            "duration": film.duration
        })
    print(result)
    return jsonify(result)


@app.route('/api/sessions/dates')
def get_session_dates():
    print("STATE: ___________________________________ DATES _______________________________________")
    movie_id = request.args.get('movie_id', type=str)
    print(movie_id)
    if not movie_id:
        print('not movie id')
        return jsonify([]), 404

    sessions = Showtime.query.filter_by(movieId=movie_id).all()
    dates = {
        s.dateTime
         .replace(tzinfo=UTC)
         .astimezone(KYIV)
         .date()
        for s in sessions
    }
    sorted_dates = sorted(dates)
    print(sorted_dates)
    return jsonify([d.isoformat() for d in dates])


@app.route('/api/sessions/times')
def get_session_times():
    print("STATE: ___________________________________ TIMES _______________________________________")
    movie_id = request.args.get('movie_id', type=str)
    date_str = request.args.get('date')  
    try:
        date_obj = datetime.fromisoformat(date_str).date()
    except:
        print(' exceptionnn ')
        return jsonify([])

    sessions = (
      Showtime.query
      .filter_by(movieId=movie_id)
      .filter(db.func.date(Showtime.dateTime) == date_obj)
      .all()
    )
    times = {
        s.dateTime
         .replace(tzinfo=UTC)
         .astimezone(KYIV)
         .strftime('%H:%M')
        for s in sessions
    }
    sorted_times = sorted(times)
    
    print('time list: ', sorted_times)
    return jsonify(sorted_times)








@app.route('/ticket_pdf', methods=['GET'])
def ticket_pdf():
    from io import BytesIO
    from reportlab.lib.pagesizes import A6
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import mm
    from models import Session as DBSess, Film as DBFilm, User as DBUser


    data = flask_session.get('confirmation_data')
    if not data:
        return "Немає даних квитка", 400


    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A6)
    width, height = A6


    banner_h = 8 * mm
    p.setFillColorRGB(129, 0, 0)
    p.rect(0, height - banner_h, width, banner_h, fill=1, stroke=0)

    margin_x = 6 * mm
    header_bottom = height - banner_h - 2 * mm


    film = DBFilm.query.filter_by(name=data['movie_name']).first()
    poster_path = film.image.path if film and film.image else 'static/img/default_poster.png'
    poster_w = 30 * mm
    poster_h = 40 * mm
    p.drawImage(
        poster_path,
        margin_x,
        header_bottom - poster_h,
        width=poster_w,
        height=poster_h,
        mask='auto'
    )


    title_x = margin_x + poster_w + 3 * mm
    title_y = header_bottom - 3 * mm
    p.setFillColorRGB(0, 0, 0)
    p.setFont("DejaVuSans-Bold", 10)
    p.drawString(title_x, title_y, data['movie_name'])

    y = header_bottom - poster_h - 6 * mm
    p.setFont("DejaVuSans", 6)
    p.drawString(margin_x, y, f"Куплено користувачем: {DBUser.query.filter_by(login=data.get('user', '')).first().first_name} {DBUser.query.filter_by(login=data.get('user', '')).first().last_name}")
    y -= 6 * mm

    sess = DBSess.query.filter_by(session_id=data['session_id']).first()
    dt_str = sess.session_datetime.strftime('%Y-%m-%d %H:%M')
    p.drawString(margin_x, y, f"Сеанс: {dt_str}")
    y -= 8 * mm

    for t in data['tickets']:
        p.drawString(
            margin_x,
            y,
            f"Місце: {t['seatNumber']}   Ряд: {t['row']}   Ціна: {t['cost']} грн"
        )
        y -= 6 * mm


    footer_y = 8 * mm
    p.setStrokeColorRGB(128, 0, 0)
    p.setLineWidth(0.5)
    p.line(margin_x, footer_y + 4 * mm, width - margin_x, footer_y + 4 * mm)

    p.setFont("DejaVuSans", 6)
    footer = (
        "Телефон: +38 (044) 123-45-67   •   "
        "Місто: Львів   •   "
        "Адреса: Червоної калини 81 "
    )
    p.drawString(margin_x + 4, footer_y, footer)

    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name='ticket.pdf',
        mimetype='application/pdf'
    )


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

@app.route('/admin/kasa', methods=['POST'])
def admin_kasa():
    return render_template('admin/kasa.html')





@app.route('/admin/reports', methods=['GET'])
def admin_reports():
    # Отримання дати з параметра або встановлення сьогоднішньої
    selected_date_str = request.args.get('date')
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date() if selected_date_str else date.today()
    except ValueError:
        selected_date = date.today()

    # Отримання квитків, проданих у цю дату
    tickets = db.session.query(Ticket, Showtime, Movie) \
        .join(Showtime, Showtime.id == Ticket.sessionId) \
        .join(Movie, Movie.id == Showtime.movieId) \
        .filter(Ticket.date_of_purchase == selected_date) \
        .all()

    print('Всього квитків:', len(tickets))

    # Групування по фільму, годині і ціні
    report_data = {}
    for ticket, session, film in tickets:
        key = (film.title, session.dateTime.strftime('%H:%M'), ticket.cost)
        report_data[key] = report_data.get(key, 0) + 1

    # Форматування для шаблону
    formatted_data = [{
        'title': k[0],
        'time': k[1],
        'price': k[2],
        'count': v
    } for k, v in report_data.items()]

    total_tickets = sum(item['count'] for item in formatted_data)
    total_revenue = sum(item['count'] * float(item['price']) for item in formatted_data)


    return render_template('admin/reports.html',
                        data=formatted_data,
                        selected_date=selected_date.strftime('%Y-%m-%d'),
                        total_tickets=total_tickets,
                        total_revenue=total_revenue)

@app.route('/admin/tickets-list', methods=['GET'])
def admin_tickets():
    # Отримання дати з параметра або встановлення сьогоднішньої
    selected_date_str = request.args.get('date')
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date() if selected_date_str else date.today()
    except ValueError:
        selected_date = date.today()

    tickets = redirect(url_for('api/tickets'))
    print(tickets)


    



    return render_template('admin/tickets-list.html',
                        data=formatted_data,
                        selected_date=selected_date.strftime('%Y-%m-%d'),
                        total_tickets=total_tickets,
                        total_revenue=total_revenue)


def rro_send(payload: dict, url: str = None):
    print(url)
    resp = requests.post(url, json=payload, headers={'Content-Type':'application/json'})
    resp.raise_for_status()
    return resp.json()



@app.route('/open_shift', methods=['POST',  'GET'])
def open_shift():
    device = app.config['DM_DEVICE']
    payload = {
      "ver": 6,
      "source": "CenterDovzhenkoCinema",
      "device": device,
      "tag": f"open_shift_{uuid4()}",
      "type": 1,
      "fiscal": {"task": 0}
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-pkg"
    result = rro_send(payload, url)
    print(result)
    return redirect(url_for('admin_kasa'))


@app.route('/close_shift', methods=['POST', 'GET'])
def close_shift():
    device = app.config['DM_DEVICE']
    payload = {
      "ver": 6,
      "source": "CenterDovzhenkoCinema",
      "device": device,
      "tag": f"close_shift_{uuid4()}",
      "type": 1,
      "fiscal": {"task": 11}
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-pkg"
    result = rro_send(payload, url)
    print(result)
    return redirect(url_for('admin_kasa'))


def autoopen_shift():
    print("Auto opening shift")
    device = app.config['DM_DEVICE']
    payload = {
      "ver": 6,
      "source": "CenterDovzhenkoCinema",
      "device": device,
      "tag": f"auto_open_shift_{uuid4()}",
      "type": 1,
      "fiscal": {"task": 0}
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-pkg"
    result = rro_send(payload, url)
    print(result)
    

def autoclosed_shift():
    print("Auto closing shift")
    device = app.config['DM_DEVICE']
    payload = {
      "ver": 6,
      "source": "CenterDovzhenkoCinema",
      "device": device,
      "tag": f"auto_close_shift_{uuid4()}",
      "type": 1,
      "fiscal": {"task": 11}
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-pkg"
    result = rro_send(payload, url)
    print(result)
    
@app.route('/prod_cash', methods=['POST'])
def cash_prod():
    data = request.get_json()
    
    
    print('__________________________________________', data)
    prod_date = date.today()
    for item in data:
        t = Ticket(
            seatRow=item['row'],
            seatNumb=item['seatNumber'],
            sessionId=item['sessionId'],
            cost=item['cost'],
            payment_method='cash',
            date_of_purchase=prod_date
        )
        db.session.add(t)
    db.session.commit()
    
    return jsonify({'status':'ok'})


@app.route('/prod_card', methods=['POST'])
def card_prod():
    data = request.get_json()
    
    
    print('__________________________________________', data)
    for item in data:
        t = Ticket(
            seatRow=item['row'],
            seatNumb=item['seatNumber'],
            sessionId=item['sessionId'],
            cost=item['cost'], 
            payment_method='card'
        )
        db.session.add(t)
    db.session.commit()
    
    return jsonify({'status':'ok'})



    

        

@app.route('/print_receipt', methods=['POST', 'GET'])
def print_receipt():
    data  = {
    "ver": 6,
    "source": "DM_API",
    "device": current_app.config['DM_DEVICE'],
    "tag": "",
    "need_pf_img": "1",
    "need_pf_pdf": "1",
    "need_pf_txt": "1",
    "need_pf_doccmd": "1",
    "type": "1",
    "userinfo": {
        "email": "",
        "phone": ""
    },
    "fiscal": {
        "task": 1,
        "cashier": "API",
        "receipt": {
            "sum": 4240.16,
            "disc": 0.00,
            "disc_type": 0,
            "round": 0.00,
            "comment_up": "Приклад коментаря зверху чеку",
            "comment_down": "Приклад коментаря \nзнизу чеку",
            "rows": [
                {
                    "code": "100",
                    "code1": "79545322",
                    "code2": "00456",
                    "name": 'name',
                    "cnt": 1,
                    "price": 4240.16,
                    "disc": 0.00,
                    "disc_type": 0,
                    "cost": 0,
                    "taxgrp": 1,
                    "comment": "Коментар до продукту 1"
                }
            ],
            "pays": [
                {
                    "type": 0,
                    "sum": 4240.16,
                    "comment": "коментар до оплати готівкою"
                }
            ]
        }
    }
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-pkg"
    result = rro_send(payload=data, url=url)
    return jsonify(result)


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
        print('_____________________________________________________________ mov_id:', mov_id)
        movie = Movie.query.filter_by(id=mov_id).first()
        if not movie:
            movie_data = {'title' : 'Movie not found',
                'poster' : 'static/img/red.jpg'}
        else: 
            s = movie.applications
            values = re.findall(r'"value"\s*:\s*"([^"]+)"', s)
            print('_____________________________________________________________ apps!!!!!!!!!:')
            print(values)
            movie_data = {
            'id' : movie.id,
            'title' : movie.title,
            'age' : movie.age,
            'genre' : movie.genre,
            'filmMaker' : movie.filmMaker,
            'duration' : movie.duration,
            'description' : movie.description,
            'trailerLink' : movie.trailerLink,
            'app' : app,
            'poster' : movie.poster,
            'price' : movie.price,
        }
        print('_____________________________________________________________ apps:')
        print('app', movie_data['app'])
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
    
@app.route('/political')
def political():  
    return render_template(
            'politicals.html'
        )

@app.route('/success', methods=['GET'])
def success():
    return render_template('success.html')


class Config:
    SCHEDULER_API_ENABLED = True
    SCHEDULER_TIMEZONE = 'Europe/Kiev'
    
    JOBS = [{
        'id' : 'close_shift_job',
        'func' : autoclosed_shift,
        'trigger' : 'cron',
        'hour' : 23,
        'minute' : 30,
    }, 
    {
        'id' : 'open_shift_job',
        'func' : autoopen_shift,
        'trigger' : 'cron',
        'hour' : 2,
        'minute': 44
    }]


app.config.from_object(Config())
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True)

