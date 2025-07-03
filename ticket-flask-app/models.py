from extensions import db


class Session(db.Model):
    __tablename__   = 'Session'
    id              = db.Column('id', db.String(64), primary_key=True)
    film_title      = db.Column('filmTitle',    db.String(255))
    film_poster     = db.Column('filmPoster',   db.String(255))
    start_time      = db.Column('startTime',    db.DateTime)
    duration        = db.Column('duration',     db.Integer)
    price           = db.Column('price',        db.Integer)
    hall_id         = db.Column('hallId',       db.String(64),
                                  db.ForeignKey('Hall.id'))

class Hall(db.Model):
    __tablename__   = 'Hall'
    id              = db.Column('id',          db.String(64), primary_key=True)
    name            = db.Column('name',        db.String(100))
    rows            = db.Column('rows',        db.Integer)
    seats_per_row   = db.Column('seatsPerRow', db.Integer)
    seats           = db.relationship('Seat', backref='hall')

class Seat(db.Model):
    __tablename__   = 'Seat'
    id              = db.Column('id',     db.String(64), primary_key=True)
    row             = db.Column('row',    db.Integer)
    number          = db.Column('number', db.Integer)
    hall_id         = db.Column('hallId', db.String(64),
                                  db.ForeignKey('Hall.id'))

class Ticket(db.Model):
    __tablename__   = 'Ticket'
    id              = db.Column('id',         db.String(64), primary_key=True)
    session_id      = db.Column('sessionId',  db.String(64),
                                  db.ForeignKey('Session.id'))
    seat_id         = db.Column('seatId',     db.String(64),
                                  db.ForeignKey('Seat.id'))
    phone           = db.Column('phone',      db.String(20))
    created_at      = db.Column('createdAt',  db.DateTime)
    is_offline      = db.Column('isOffline',  db.Boolean)