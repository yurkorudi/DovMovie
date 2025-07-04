from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import os

from models import Session, Hall, Seat, Ticket
from extensions import db


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://rootforchaplin:Super_Password22@167.172.62.229:3306/DovMov'
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    sessions = Session.query.all()
    return render_template('buy.html')



@app.route('/checkout', methods=['POST'])
def checkout():

    session_id = request.form.get('session_id')
    seat_ids   = request.form.getlist('seat_ids')
    phone      = request.form.get('phone')

    if not session_id or not seat_ids or not phone:
        return "Missing data", 400


    for sid in seat_ids:
        ticket = Ticket(session_id=session_id, seat_id=sid)
        db.session.add(ticket)
    db.session.commit()


    return redirect(url_for('home'))


@app.route('/buy')
def buy_ticket():
    session_id = request.args.get('session_id', 'session_test_1')
    if not session_id:
        return "Missing session_id", 400

    session = db.session.get(Session, session_id)
    if not session:
        return "Session not found", 404

    hall = db.session.get(Hall, session.hall_id)
    all_seats = Seat.query.filter_by(hall_id=hall.id).all()
    taken = [t.seat_id for t in Ticket.query.filter_by(session_id=session.id).all()]

    rows = []
    for row_num in range(1, hall.rows + 1):
        row = [seat for seat in all_seats if seat.row == row_num]
        for seat in row:
            seat.taken = seat.id in taken
        rows.append(row)
        
    
    print('__' * 40)
    print(f"Session: {session}, Hall: {hall}, Rows: {rows}")
    print(session.start_time)

    return render_template(
        'buy.html',
        movie_session=session,
        hall=hall,
        rows=rows
    )

if __name__ == '__main__':
    app.run(debug=True, host="192.168.0.103")