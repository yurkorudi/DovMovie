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
from models import Movie, Showtime, Ticket, Payment
from extensions import db
from datetime import *
import time
from zoneinfo import ZoneInfo
import pytz
import json
from sqlalchemy import func
import traceback
from flask import send_file, session as flask_session



import uuid, json, base64, hashlib
from liqpay.liqpay import LiqPay
import pyfiglet
from pyfiglet import figlet_format
import urllib.parse
import ast
import re
import zlib

from reportlab.lib.pagesizes import A6
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
import textwrap

font_path = os.path.join(os.path.dirname(__file__), "static", "fonts", "DejaVuSans-Bold.ttf")
pdfmetrics.registerFont(TTFont("DejaVuSans-Bold", font_path))

font_path = os.path.join(os.path.dirname(__file__), "static", "fonts", "DejaVuSans.ttf")
pdfmetrics.registerFont(TTFont("DejaVuSans", font_path))

import re
from flask_apscheduler import APScheduler

import html
import ast

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dvzh_dev:19950812amZ@usbmr293.mysql.network:10279/dvzh_dev'
app.config['DM_HOST'] = '194.44.116.57'
app.config['DM_PORT'] = 3939
app.config['SECRET_KEY'] = 'AdminSecretKey(2025)s'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['DM_DEVICE'] = 'kasar'
app.config['DM_ONLINE_DEVICE'] = 'kasar_online'
app.config['ADMIN_PASSWORD'] = os.environ.get('ADMIN_PASSWORD', 'DovzhenkoAdminPassword')
LIQPAY_PUBLIC_KEY = 'i40470776966'
LIQPAY_PRIVATE_KEY = 'mHLYgc7FLwKeqBrpp6Pay4O7a4GBr9gueYdJLeKB'



lp = LiqPay(LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY)



db.init_app(app)
Session(app)


UTC = pytz.UTC

KYIV = pytz.timezone('Europe/Kyiv')
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
def lp_encode(params: dict):
    return str(base64.b64encode(json.dumps(params, ensure_ascii=False).encode("utf-8")).decode("utf-8"))



def lp_signature(data_b64: str):
    digest = hashlib.sha1((LIQPAY_PRIVATE_KEY + data_b64 + LIQPAY_PRIVATE_KEY).encode("utf-8")).digest()
    return str(base64.b64encode(digest).decode("utf-8"))



def compress_data(data_dict):
    try:
        json_str = json.dumps(data_dict, ensure_ascii=False, separators=(',', ':'))
        compressed = zlib.compress(json_str.encode('utf-8'))
        encoded = base64.urlsafe_b64encode(compressed).decode('ascii')
        return encoded.rstrip('=')
    except Exception as e:
        print(f"Помилка стиснення: {e}")
        return None

def decompress_data(compressed_str):
    try:
        padding = 4 - len(compressed_str) % 4
        if padding != 4:
            compressed_str += '=' * padding
        
        compressed = base64.urlsafe_b64decode(compressed_str.encode('ascii'))
        json_str = zlib.decompress(compressed).decode('utf-8')  
        return json.loads(json_str)
    except Exception as e:
        print(f"Помилка розпакування: {e}")
        print(f"Вхідний рядок: {compressed_str}")
        print(f"Довжина рядка: {len(compressed_str)}")
        return None


    
@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    print("=== UNHANDLED EXCEPTION ===")
    traceback.print_exc()
    return "Internal Server Error", 500
    


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

def double_char_fig(num: str) -> list[str]:
    """Ручна таблиця жирних ASCII-цифр з 'x' замість #"""
    ascii_digits = {
        '0': [
            "xxxxxx",
            "xx  xx",
            "xx  xx",
            "xx  xx",
            "xxxxxx"
        ],
        '1': [
            "  xx  ",
            "xxxx  ",
            "  xx  ",
            "  xx  ",
            "xxxxxx"
        ],
        '2': [
            "xxxxxx",
            "    xx",
            "xxxxxx",
            "xx    ",
            "xxxxxx"
        ],
        '3': [
            "xxxxxx",
            "    xx",
            " xxxxx",
            "    xx",
            "xxxxxx"
        ],
        '4': [
            "xx  xx",
            "xx  xx",
            "xxxxxx",
            "    xx",
            "    xx"
        ],
        '5': [
            "xxxxxx",
            "xx    ",
            "xxxxxx",
            "    xx",
            "xxxxxx"
        ],
        '6': [
            "xxxxxx",
            "xx    ",
            "xxxxxx",
            "xx  xx",
            "xxxxxx"
        ],
        '7': [
            "xxxxxx",
            "    xx",
            "   xx ",
            "  xx  ",
            " xx   "
        ],
        '8': [
            "xxxxxx",
            "xx  xx",
            "xxxxxx",
            "xx  xx",
            "xxxxxx"
        ],
        '9': [
            "xxxxxx",
            "xx  xx",
            "xxxxxx",
            "    xx",
            "xxxxxx"
        ]
    }
    result = [""] * 5
    for digit in str(num):
        for i in range(5):
            result[i] += ascii_digits[digit][i] + "  "
    return result

def build_comment_for_receipt(items, session_dt_str):
    lines = []
    lines.append(f"СЕАНС: {session_dt_str}")
    lines.append("-" * 32)
    for idx, it in enumerate(items, start=1):
        row = str(it['row'])
        seat = str(it['seatNumber'])

        row_ascii = double_char_fig(row)
        seat_ascii = double_char_fig(seat)

        # Вирівнюємо по висоті
        max_height = max(len(row_ascii), len(seat_ascii))
        row_ascii += [''] * (max_height - len(row_ascii))
        seat_ascii += [''] * (max_height - len(seat_ascii))

        # Підрахунок ширин
        row_width = max(len(line) for line in row_ascii)
        print(row_width)
        seat_width = max(len(line) for line in seat_ascii)
        print(seat_width)
        space_between = 10

        total_width = row_width + seat_width + space_between
        if total_width > 30:
            space_between = 0
            #max(2, 30 - row_width - seat_width)
            print("__________________________SPACEBEETWEEN>> ")
            print(space_between)

        lines.append("+" + "-" * 29 + "+")
        lines.append(f"| КВИТОК {idx:<20}")
        lines.append(" " * 30)
        lines.append(f"| РЯД:              МІСЦЕ: \n")
        lines.append(" " * 30)
        for i in range(max_height):
            row_line = row_ascii[i].ljust(row_width)
            print(row_line)
            seat_line = seat_ascii[i].ljust(seat_width)
            print(seat_line)
            combined = row_line + (" " * space_between) + seat_line
            lines.append(f"|{combined[:29]:<29}")
        lines.append("+" + "-" * 29 + "+")
        lines.append("-" * 30)
    return "\n".join(lines)

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

@app.route('/api/tickets_list')
def api_tickets_list():
    session_id = request.args.get('session_id')

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    try:
        tickets = Ticket.query.filter_by(sessionId=session_id).all()
    except Exception as e:
        print("Помилка в базі:", e)
        return jsonify({"error": "DB query failed"}), 500

    result = []
    for t in tickets:
        result.append({
            "row": t.seatRow,
            "seatNumber": t.seatNumb,
            "cost": t.cost,
            "firstName": t.first_name,
            "lastName": t.last_name,
            "email": t.email,
            "payment_method": t.payment_method
        })

    return jsonify(result)


def is_compressed_data(s: str):
    try:
        if len(s) > 50 and ' ' not in s and '/' not in s and '+' not in s:
            decoded = base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))
            return True
    except:
        pass
    return False




def coerce_to_dict(raw):
    # Якщо це вже словник, повертаємо як є
    if isinstance(raw, dict):
        return raw
        
    # Якщо це None або порожній рядок
    if not raw:
        raise ValueError("Порожній рядок")

    # Тепер точно рядок - робимо strip
    s = raw.strip()

    # Прибираємо зовнішні лапки
    if len(s) >= 2 and s[0] == s[-1] and s[0] in ('"', "'"):
        s = s[1:-1]

    # Декодуємо HTML
    s = html.unescape(s)

    # Замінюємо специфічні escape-послідовності
    s = s.replace("\\u0026#39;", "'")

    try:
        return ast.literal_eval(s)
    except Exception:
        pass

    # Спроба через JSON
    s_jsonish = s.replace("'", '"')
    try:
        return json.loads(s_jsonish)
    except Exception as e:
        raise ValueError(f"Не вдалось розпарсити дані: {e}\nrepr={repr(s)}")
    
    # decoded = html.unescape(s)
    # cleaned = decoded.strip().strip('"').strip("'")
    # return ast.literal_eval(cleaned)





    # s = s.replace("\\u0026#39;", "&#39;")
    # s = s.replace("\\\"", '"')  # \" → "

    # for _ in range(3):
    #     new_s = html.unescape(s)
    #     if new_s == s:
    #         break
    #     s = new_s

    # s = s.strip()
    # if len(s) >= 2 and s[0] == s[-1] and s[0] in ('"', "'"):
    #     s = s[1:-1]

    # s = s.replace("\\u0027", "'").replace("\\u2019", "'")

    # try:
    #     return ast.literal_eval(s)
    # except Exception:
    #     pass

    # s_jsonish = re.sub(r"'", '"', s)
    # s_jsonish = re.sub(r'None', 'null', s_jsonish)
    # try:
    #     return json.loads(s_jsonish)
    # except Exception as e:
    #     raise ValueError(f"Не вдалось розпарсити дані: {e}\nrepr={repr(s)}")





@app.route('/ticket_pdf')
def ticket_pdf():
    from io import BytesIO
    from reportlab.lib.pagesizes import A6
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import mm
    import os
    print('__________________________ TICKET PDF ___________________________ \n \n \n \n \n \n ')    
    data_param = request.args.get('data_')
    print('DATA PARAM:', data_param)
    if not data_param:
        return "Missing data_", 400

    try:
        data_param = decompress_data(data_param)
        data = coerce_to_dict(data_param)
        print('__________________________data_to_coerce_____________________________ \n \n \n \n \n \n ')
        print(data)
    except Exception as e:
        print(e)
        print('__________________________ DATA DECODE ERROR ___________________________ \n \n \n \n \n \n ')
        print(data_param)
        return f"Data decode error: {e}", 400

    print("DATA OK:", type(data), data)
        




    buf = BytesIO()
    p = canvas.Canvas(buf, pagesize=A6)
    width, height = A6

    banner_h = 8 * mm
    p.setFillColorRGB(0, 0.2, 0.6)
    p.rect(0, height - banner_h, width, banner_h, fill=1, stroke=0)

    margin_x = 6 * mm
    header_bottom = height - banner_h - 2 * mm
    print('__________________________ ___________________________ \n \n \n \n \n \n ')
    
    print(type(data))
    
    print('__________________________ ___________________________ \n \n \n \n \n \n ')

    film = Movie.query.filter_by(title=data.get('movie')).first()
    poster_path = film.poster if film and film.poster else 'static/img/default_poster.png'
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
    title_x = margin_x + poster_w + (4 * mm if poster_w else 0)
    title_y = header_bottom - 4 * mm
    p.setFillColorRGB(0, 0, 0)

    title = (film.title if film else data.get('movie', ''))
    age = getattr(film, 'age', '') or ''
    duration = getattr(film, 'duration', '') or ''
    descr = getattr(film, 'description', '') or ''

    p.setFont("DejaVuSans-Bold", 10)
    p.drawString(title_x, title_y, str(title)[:60])

    p.setFont("DejaVuSans", 6)
    if age:
        p.drawString(title_x, title_y - 15, f"Вік: {age}")
    if duration:
        p.drawString(title_x, title_y - 25, f"Тривалість: {duration}")

    description_lines = textwrap.wrap(descr, width=50) if descr else []
    text_obj = p.beginText(title_x, title_y - 40)
    text_obj.setFont("DejaVuSans", 6)
    for line in description_lines[:12]:
        text_obj.textLine(line)
    p.drawText(text_obj)

    lines_count = len(description_lines)
    line_height = 6 * 1.2
    description_height = max(poster_h, lines_count * line_height)
    y = title_y - description_height - (26 if poster_w else 8)

    buyer_name = f"{data.get('first_name','') or ''} {data.get('last_name','') or ''}".strip()
    buyer_email = data.get('email') or ''
    p.drawString(margin_x, y, f"Куплено: {buyer_name or '-'} {buyer_email}")
    y -= 6 * mm

    sess = Showtime.query.filter_by(id=data.get('session_id')).first() if data.get('session_id') else None
    if sess and getattr(sess, 'dateTime', None):
        dt_str = (sess.dateTime + timedelta(hours=2)).strftime('%Y-%m-%d %H:%M')
    else:
        dt_str = "-"
    p.drawString(margin_x, y, f"Сеанс: {dt_str}")
    y -= 8 * mm

    for t in (data.get('seats') or []):
        try:
            r = int(t.get('row')) + 1
            s = int(t.get('seatNumber')) + 1
            c = t.get('cost')
            p.drawString(margin_x, y, f"Ряд: {r}  Місце: {s}  Ціна: {c} грн")
            y -= 5 * mm
            if y < 20 * mm:
                break
        except Exception:
            continue

    footer_y = 10 * mm
    p.setStrokeColorRGB(0, 0.2, 0.6)
    p.setLineWidth(0.8)
    p.line(margin_x, footer_y + 4 * mm, width - margin_x, footer_y + 4 * mm)
    p.setFont("DejaVuSans", 6)
    p.drawCentredString(width / 2, footer_y, "Тел.: +38 (044) 123-45-67   •   Львів   •   Червоної Калини 81")

    p.showPage()
    p.save()
    buf.seek(0)

    download = request.args.get("download", "false").lower() == "true"
    return send_file(buf, as_attachment=download, download_name='ticket.pdf', mimetype='application/pdf')

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

@app.route('/admin/return', methods=['GET'])
def admin_return():
    return render_template('admin/return.html')



@app.route('/admin/reports', methods=['GET'])
def admin_reports():
    selected_date_str = request.args.get('date')
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date() if selected_date_str else date.today()
    except ValueError:
        selected_date = date.today()


    tickets = db.session.query(Ticket, Showtime, Movie) \
        .join(Showtime, Showtime.id == Ticket.sessionId) \
        .join(Movie, Movie.id == Showtime.movieId) \
        .filter(Ticket.date_of_purchase == selected_date) \
        .all()

    print('Всього квитків:', len(tickets))


    report_data = {}
    for ticket, session, film in tickets:
        key = (film.title, (session.dateTime + timedelta(hours=3)).strftime('%H:%M'), ticket.cost)
        report_data[key] = report_data.get(key, 0) + 1

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

@app.route('/admin/full-report', methods=['GET'])
def admin_full_reports():
    selected_date_str = request.args.get('date')
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date() if selected_date_str else date.today()
    except ValueError:
        selected_date = date.today()

    tickets = db.session.query(Ticket, Showtime, Movie) \
        .join(Showtime, Showtime.id == Ticket.sessionId) \
        .join(Movie, Movie.id == Showtime.movieId) \
        .filter(Ticket.date_of_purchase == selected_date) \
        .all()

    print('Всього квитків:', len(tickets))

    # Групування по фільму, годині і ціні
    report_data = {}
    for ticket, session, film in tickets:
        key = (film.title, (session.dateTime + timedelta(hours=3)).strftime('%H:%M'), ticket.cost)
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


    return render_template('admin/full-report.html',
                        data=formatted_data,
                        selected_date=selected_date.strftime('%Y-%m-%d'),
                        total_tickets=total_tickets,
                        total_revenue=total_revenue)

@app.route('/admin/tickets-list', methods=['GET'])
def admin_tickets():

    selected_date_str = request.args.get('date')
    try:
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d').date() if selected_date_str else date.today()
    except ValueError:
        selected_date = date.today()

    tickets = redirect(url_for('api_tickets'))
    print(tickets)

    return render_template('admin/tickets-list.html',
                        data=tickets,
                        selected_date=selected_date.strftime('%Y-%m-%d'))   
                        # total_tickets=total_tickets,
                        # total_revenue=total_revenue)


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
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn?dev_id=print"
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
      "fiscal": {"task": 11, 'cashier': 'Рецепція центру Довженка'}
    }
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute"
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
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn?dev_id=print"
    result = rro_send(payload=payload, url=url)
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
    sum = 0
    items_for_banner = []
    for item in data:
        t = Ticket(
            seatRow=item['row'],
            seatNumb=item['seatNumber'],
            sessionId=item['sessionId'],
            cost=item['cost'],
            payment_method='cash',
            date_of_purchase=prod_date,
            email=item['email'],
            first_name=item['firstName'],
            last_name=item['lastName']
        )
        db.session.add(t)
        sum += item['cost']
        items_for_banner.append({
            "row": item['row'],
            "seatNumber": item['seatNumber']
        })
    db.session.commit()
    
    
    time_str = '15:30'  
    email = item['email']
    comments = build_comment_for_receipt(items_for_banner, time_str)
    price = sum/len(data)
    data  = {
    "ver": 6,
    "source": "DM_API",
    "device": "kasar",
    "tag": "",
    "need_pf_img": "0",
    "need_pf_pdf": "0",
    "need_pf_txt": "0",
    "need_pf_doccmd": "0",
    "type": "1",
    "userinfo": {
        "email": email,
        "phone": ""
    },
    "fiscal": {
        "task": 1,
        "cashier": "Рецепція центру Довженка",
        "receipt": {
            "sum": sum,
            "comment_down": comments,
            "rows": [
                {
                    
                    "code": "100",
                    "code2": "",
                    "name": "Квиток",
                    "cnt": sum/price,
                    "price":price,
                    "taxgrp": 5,
                },
            ],
            "pays": [
                {
                    "type": 0,
                    "sum": sum,
                }
            ]
        }
    }
}
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn?dev_id=print"
    result = rro_send(payload=data, url=url)
    
    return jsonify({'status':'ok'})


@app.route('/prod_card', methods=['POST'])
def card_prod():
    data = request.get_json()
    sum = 0
    print('__________________________________________', data)
    prod_date = date.today()
    items_for_banner = []
    for item in data:
        t = Ticket(
            seatRow=item['row'],
            seatNumb=item['seatNumber'],
            sessionId=item['sessionId'],
            cost=item['cost'],
            payment_method='card',
            date_of_purchase=prod_date,
            email=item['email'],
            first_name=item['firstName'],
            last_name=item['lastName'])
        sum += item['cost']
        items_for_banner.append({
            "row": item['row'],
            "seatNumber": item['seatNumber']
        })
        db.session.add(t)
    db.session.commit()
    
    email = item['email']
    price = 100
    row = item['row']
    seat = item['seatNumber']
    time_str = '15:30'
    comments = build_comment_for_receipt(items_for_banner, time_str)
    print(comments)

    data  = {
    "ver": 6,
    "source": "DM_API",
    "device": "kasar",
    "tag": "",
    "need_pf_img": "0",
    "need_pf_pdf": "0",
    "need_pf_txt": "0",
    "need_pf_doccmd": "0",
    "type": "1",
    "userinfo": {
        "email": email,
        "phone": ""
    },
    "fiscal": {
        "task": 1,
        "cashier": "Рецепція центру Довженка",
        "receipt": {
            "sum": sum,
            "comment_down": comments,
            "rows": [
                {
                    
                    "code": "100",
                    "code2": "",
                    "name": "Квиток",
                    "cnt": sum/price,
                    "price":price,
                    "taxgrp": 5,
                },
            ],
            "pays": [
                {
                    "type": 2,
                    "sum": sum
                }
            ]
        }
    }
}
    url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn?dev_id=print"
    result = rro_send(payload=data, url=url)
    
    return jsonify({'status':'ok'})



    

        












@app.route('/')
def red():
    return redirect(url_for('admin_login'))





@app.route('/buy')
def buy_ticket():
    try: 
        mov_id = request.args.get('movie_id')
        movie = Movie.query.filter_by(id=mov_id).first()
        if not movie:
            movie_data = {'title' : 'Movie not found',
                'poster' : 'static/img/red.jpg'}
        else: 
            s = movie.applications
            values = re.findall(r'"value"\s*:\s*"([^"]+)"', s)
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

        ua_string = request.headers.get("User-Agent", "")
        user_agent = parse(ua_string)    
        is_mobile = user_agent.is_mobile


        
        

        return render_template(
            'buy.html',
            movie_data = movie_data,
            movie_session=None,
            occupied_seats=[],
            is_mobile = is_mobile
        )
        
    except Exception as e:
        return jsonify({'status' : e}), 500
    
@app.route('/political')
def political():  
    return render_template(
            'politicals.html'
        )
    
    
    

    



@app.route('/payment', methods=['GET', 'POST'])
def payment(movie_data=None, selected_seats=None):  
    try: 
        mov_id = request.args.get('movie_id')
        session_id = request.args.get('session_id')
        movie = Movie.query.filter_by(id=mov_id).first()
        if not movie:
            movie_data = {'title' : 'Movie ot found',
                'poster' : 'static/img/red.jpg'}
        else: 
            s = movie.applications
            values = re.findall(r'"value"\s*:\s*"([^"]+)"', s)
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
        ua_string = request.headers.get("User-Agent", "")
        user_agent = parse(ua_string)    
        is_mobile = user_agent.is_mobile

        seats_raw = request.args.get('seats')
        seats = json.loads(seats_raw) if seats_raw else []
        total_cost = sum(seat['cost'] for seat in seats)
        
        flask_session['confirmation_data'] = {
            'movie': movie.title,
            'poster': movie.poster,
            'session_id': session_id,
            'seats': seats
        }

        return render_template(
                'online-pay.html',
                movie_data = movie_data,
                movie_session=None,
                occupied_seats=[],
                is_mobile = is_mobile,
                seats=seats,
                total_cost=total_cost,
                session = session_id
            )
    except Exception as e:
        return jsonify({'status' : e}), 500
    
    

    
    #___________________________________________ LIQPAY __________________________________________________________#
    



    
    
    
    

    
    
    
    
@app.route('/liqpay', methods=['GET', 'POST'])
def liqpay(movie_data=None, selected_seats=None):  
    data_b64 = ''
    try: 
        items_for_banner = []
        user_inf = request.get_json()
        ua_string = request.headers.get("User-Agent", "")
        user_agent = parse(ua_string)    
        is_mobile = user_agent.is_mobile
        pid = order_id = str(uuid.uuid4())

        seats_raw = user_inf['seats']
        seats_raw = html.unescape(seats_raw)
        seats_raw = ast.literal_eval(seats_raw)
        total_cost = sum(seat['cost'] for seat in seats_raw)
        session = user_inf['session_id']
        
        payment = Payment(
        id=pid,
        orderId=pid,
        sessionId=session,
        email=user_inf['email'],
        amount=total_cost,
        currency='UAH',
        status='pending'
        )
        db.session.add(payment)
        db.session.commit()
        
        sessio_data = flask_session.get('confirmation_data', {})
        sessio_data.update({
            'first_name': user_inf['name'],
            'last_name': user_inf['lastName'],
            'email': user_inf['email']
        })
        flask_session['confirmation_data'] = sessio_data
        flask_session['user_info'] = user_inf
        data_coded = compress_data(flask_session.get('confirmation_data', {}))
        
        params = {
        "public_key": LIQPAY_PUBLIC_KEY,
        "version": "3",
        "action": "pay",
        "amount": str(total_cost),
        "currency": "UAH",
        "description": f"Оплата квитка (сеанс {user_inf['title']})",
        "order_id": order_id,
        "result_url": f"http://178.62.106.58/success_loading?order_id={order_id}&confirmation_data={data_coded}",
        "server_url": f"http://178.62.106.58/payment_callback?confirmation_data={data_coded}",
        "sandbox": "1"
    }
        
        
        data_b64 = lp_encode(params)
        # print('data_b64: ', data_b64)
        sign = lp_signature(data_b64)
        user_inf = flask_session['confirmation_data']
        sum_t = 0
        try:
            # user_inf = coerce_to_dict(user_inf)
            print("User info:", user_inf)
        except Exception as e:
            return f"Data decode error: {e}", 400
        
        print(" adding tickets... ")
        
        for i in user_inf['seats']:
            print(i)
            tk = Ticket(
                seatRow=i['row'] +1 ,
                seatNumb=i['seatNumber'] + 1,
                sessionId=session,
                cost=i['cost'],
                payment_method='online',
                date_of_purchase=datetime.now(),
                first_name=user_inf['first_name'],
                last_name=user_inf['last_name'],
                email=user_inf['email'])
            print("Adding ticket:", tk)
            
            sum_t += i['cost']
            items_for_banner.append({
                "row": i['row'],
                "seatNumber": i['seatNumber']
            })
            db.session.add(tk)
        db.session.commit()
        
        print("Tickets added")
            


        
        return render_template(
                'liqpay.html',
                is_mobile = is_mobile,
                user_inf = user_inf,
                seats=seats_raw,
                total_cost=total_cost,
                session=session,
                data=data_b64,
                signature=sign
        )   
        
    except Exception as e:
        print("Error in liqpay:", e)
        return jsonify({'status' : 'error', 'message': str(e)}), 500
    

    
@app.route('/success_loading', methods=['GET'])
def success_loading():
    data = request.args.get('order_id')
    data2 = request.args.get('confirmation_data')
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!++++++++++++++++++++++++++++++++++++++++++++!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print(">>> /success_loading HIT", data)
    if not data:
        return jsonify({'status': 'error', 'message': 'Order ID not provided'}), 400
    
    return render_template(
        'success_loading.html', order_id=data, confirmation_data=data2
    )
    


@app.route('/check_payment_status', methods=['GET'])
def check_payment_status():
    order_id = request.args.get('order_id')
    payment = Payment.query.filter_by(id=order_id).first()
    try: 
        print(payment.status)
    except:
        pass
    if not payment:
        print("payment not found")
        return jsonify({'status': 'not_found'}), 404
    return jsonify({'status': payment.status})




    
@app.route('/payment_callback', methods=['POST', 'GET'])
def payment_callback():
    PRIVATE_KEY = LIQPAY_PRIVATE_KEY
    print("_________________________________________ACTIVATE_________________________________________")
    print(">>> /payment_callback HIT", request.method, request.form or request.args)
    data_b64 = request.form.get("data", "")
    print("DATA GOT" )
    signature = request.form.get("signature", "")  
    print("SIGNATURE GOT" ) 
    print("DATA:", data_b64)
    print("SIGNATURE:", signature)  
    
    
    check_string = PRIVATE_KEY + data_b64 + PRIVATE_KEY
    generated_signature = base64.b64encode(
        hashlib.sha1(check_string.encode('utf-8')).digest()
    ).decode('utf-8')

    print("EXPECTED SIGNATURE:", generated_signature)
    
    try:
        decoded_json = base64.b64decode(data_b64).decode('utf-8')
        data = json.loads(decoded_json)
        print("_________________________________________DECODED DATA_________________________________________ \n \n \n \n \n \n ")
        print("DECODED DATA:", data)
    except Exception as e:
        print("Error decoding data:", e)
    
    
    try:
        confirmation_data = request.args.get('confirmation_data')
        if confirmation_data:
            decompressed = decompress_data(confirmation_data)
            if decompressed:
                confirmation_data = decompressed
            else:
                confirmation_data = coerce_to_dict(confirmation_data)
        else:
            confirmation_data = None
    except Exception as e:
        print(f"Помилка обробки confirmation_data: {e}")
        confirmation_data = None


    payload = json.loads(base64.b64decode(data_b64).decode("utf-8"))
    order_id = payload.get("order_id")
    status = payload.get("status")
    
    print("__________________________________> STATUS:: ")
    print(status)
    
    print("ORDER ID:", order_id)

    payment = Payment.query.filter_by(id=order_id).first()
    
    print ("PAYMENT RECORD:", payment)
    if not payment:
        print("Payment not found")
        return "Payment not found", 404
    # session = payment.sessionI
    
    
    payment.status = status
    payment.liqpay_response = json.dumps(payload)
    print("UPDATING PAYMENT STATUS TO:", payment.status)
    
    db.session.commit()
    
    print("PAYMENT STATUS UPDATED")


    
    if status == "sandbox":
        
        
        
        
        print("if heandled sandbox CONFIRMATION_DATA:", confirmation_data)
        sum = 0 
        items_for_banner = []   
        print("Parsing user info...")
        
        try:
            user_inf = urllib.parse.unquote(confirmation_data)
            data = ast.literal_eval(user_inf)
        except Exception as e:
            print("Data decode error:", e)
            
        print('_________________________________________USER INFO PARSED_________________________________________')
        print(confirmation_data)
        print('\n \n \n \n \n ')
        try:
            user_inf = coerce_to_dict(confirmation_data)
        except Exception as e:
            print("Error coercing user info:", e)
            
        print(confirmation_data)
        print('_________________________________________USER INFO COERCE DONE_________________________________________')
        print('\n \n \n \n \n ')
        print(user_inf)
        print(" user info gone well ", user_inf)



        for i in user_inf['seats']:
            print('_________________________________________ADDING TICKETS_________________________________________')
            
            print(i)
            tk = Ticket(
                seatRow=i['row'] +1 ,
                seatNumb=i['seatNumber'] + 1,
                sessionId=session,
                cost=i['cost'],
                payment_method='online',
                date_of_purchase=datetime.now(),
                first_name=user_inf['first_name'],
                last_name=user_inf['last_name'],
                email=user_inf['email'])
            print("Adding ticket:", tk)
            
            sum += i['cost']
            items_for_banner.append({
                "row": i['row'],
                "seatNumber": i['seatNumber']
            })
            db.session.add(tk)
        db.session.commit()
        
        
        
        email = 'yurko@gmail.com'#user_inf['email']
        price = '200'#i['cost']
        time_str = '15:30'
        comments = ''
        print(comments)

        data  = {
        "ver": 6,
        "source": "DM_API",
        "device": " kasar",
        "tag": "",
        "need_pf_img": "0",
        "need_pf_pdf": "0",
        "need_pf_txt": "0",
        "need_pf_doccmd": "0",
        "type": "1",
        "userinfo": {
            "email": email,
            "phone": ""
        },
        "fiscal": {
            "task": 1,
            "cashier": "Рецепція центру Довженка",
            "receipt": {
                "sum": sum,
                "comment_down": comments,
                "rows": [
                    {
                        
                        "code": "100",
                        "code2": "",
                        "name": "Квиток",
                        "cnt": sum/price,
                        "price":price,
                        "taxgrp": 5,
                    },
                ],
                "pays": [
                    {
                        "type": 2,
                        "sum": sum
                    }
                ]
            }
        }
    }
        url = f"http://{app.config['DM_HOST']}:{app.config['DM_PORT']}/dm/execute-prn?dev_id=print"
        result = rro_send(payload=data, url=url)
       
    return jsonify({
        'status': 'success',
        'message': 'Payment successful',
        'order_id': order_id,
        'payment_status': payment.status
    })   






@app.route('/final_success', methods=['GET'])
def success():
    
    success_pay = request.args.get('is_success')
    datar = request.args.get('info')
    print('DATA FOR FINAL SUCCESS: ', datar)
    
    user_inf = None
    
    if datar:
        try:
            user_inf = decompress_data(datar)
            user_inf = coerce_to_dict(user_inf)
        except Exception as e:
            print(f"Помилка обробки даних: {e}")
            user_inf = None

    if success_pay and user_inf:
        print('___________________________________________________________________')
        print('user info>')
        print(user_inf)

        for i in user_inf['seats']:
            print(i)
            tk = Ticket(
                seatRow=i['row'] + 1,
                seatNumb=i['seatNumber'] + 1,
                sessionId=user_inf.get('session_id'),
                cost=i['cost'],
                payment_method='online',
                date_of_purchase=datetime.now(),
                first_name=user_inf.get('first_name'),
                last_name=user_inf.get('last_name'),
                email=user_inf.get('email'))
            print("Adding ticket:", tk)
            db.session.add(tk)
        db.session.commit()
        print("✅ Квитки успішно додано до БД")
    
    return render_template(
        'final_success.html',
        success_pay=success_pay,
        info=datar
    )


class Config:
    SCHEDULER_API_ENABLED = True
    SCHEDULER_TIMEZONE = 'Europe/Kyiv'
    
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

