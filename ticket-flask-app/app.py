from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import os
from user_agents import *

from models import Movie
from extensions import db


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://dvzh_dev:19950812amZ@usbmr293.mysql.network:10279/dvzh_dev'
db.init_app(app)

# with app.app_context():
#     db.create_all()





@app.route('/checkout', methods=['POST'])
def checkout():

    session_id = request.form.get('session_id')
    seat_ids   = request.form.getlist('seat_ids')
    phone      = request.form.get('phone')

    if not session_id or not seat_ids or not phone:
        return "Missing data", 400


    for sid in seat_ids:
        # ticket = Ticket(session_id=session_id, seat_id=sid)
        db.session.add(ticket)
    db.session.commit()


    return redirect(url_for('home'))


@app.route('/buy')
def buy_ticket():
    mov_id = request.args.get('movie_id')
    if not mov_id:
        pass

    # session = db.session.get(Session, session_id)
    # if not session:
    #     return "Session not found", 404



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

if __name__ == '__main__':
    app.run(debug=True, host="192.168.1.12")