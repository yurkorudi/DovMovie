from extensions import db
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, Enum, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.mysql import DECIMAL



UserRole = Enum('USER', 'ADMIN', name='UserRole')
EventType = Enum('KINO', 'MUSIC', 'PERFORMANCE', 'THEATER', 'TALKS', 'STANDUP', name='EventType')

class Account(db.Model):
    __tablename__ = 'Account'
    id = Column('id', String, primary_key=True)
    userId = Column('userId', String, ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    type = Column('type', String, nullable=False)
    provider = Column('provider', String, nullable=False)
    providerAccountId = Column('providerAccountId', String, nullable=False)
    refresh_token = Column('refresh_token', Text)
    access_token = Column('access_token', Text)
    expires_at = Column('expires_at', Integer)
    token_type = Column('token_type', String)
    scope = Column('scope', String)
    id_token = Column('id_token', Text)
    session_state = Column('session_state', String)

    user = relationship('User', back_populates='accounts')

class User(db.Model):
    __tablename__ = 'User'
    id = Column('id', String, primary_key=True)
    name = Column('name', String)
    email = Column('email', String, unique=True)
    emailVerified = Column('emailVerified', DateTime)
    image = Column('image', String)
    password = Column('password', String)
    role = Column('role', UserRole, default='USER')
    isTwoFactorEnabled = Column('isTwoFactorEnabled', Boolean, default=False)

    accounts = relationship('Account', back_populates='user')
    twoFactorConfirmation = relationship('TwoFactorConfirmation', uselist=False, back_populates='user')
    mainCarousel = relationship('MainCarousel', back_populates='createdBy')
    events = relationship('Event', back_populates='createdBy')
    studios = relationship('Studio', back_populates='createdBy')
    aboutSlides = relationship('About', back_populates='createdBy')
    movies = relationship('Movie', back_populates='createdBy')
    MovieHeader = relationship('MovieHeader', back_populates='createdBy')

class MainCarousel(db.Model):
    __tablename__ = 'MainCarousel'
    id = Column('id', String, primary_key=True)
    startTime = Column('startTime', DateTime, nullable=False)
    dateForDisplay = Column('dateForDisplay', String)
    dateForDisplayEng = Column('dateForDisplayEng', String)
    title = Column('title', String)
    titleEng = Column('titleEng', String)
    description = Column('description', String)
    descriptionEng = Column('descriptionEng', String)
    image = Column('image', String)
    link = Column('link', String)
    linkTitle = Column('linkTitle', String)
    linkTitleEng = Column('linkTitleEng', String)
    typeImage = Column('typeImage', EventType)
    order = Column('order', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))

    createdBy = relationship('User', back_populates='mainCarousel')

class Event(db.Model):
    __tablename__ = 'Event'
    id = Column('id', String, primary_key=True)
    typeImage = Column('typeImage', EventType)
    title = Column('title', String)
    titleEng = Column('titleEng', String)
    startTime = Column('startTime', DateTime)
    startDateString = Column('startDateString', String)
    startDateStringEng = Column('startDateStringEng', String)
    cardDescription = Column('cardDescription', String)
    cardDescriptionEng = Column('cardDescriptionEng', String)
    link = Column('link', String)
    backgroundImage = Column('backgroundImage', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))
    freeEntry = Column('freeEntry', Boolean, default=False)

    createdBy = relationship('User', back_populates='events')

class Studio(db.Model):
    __tablename__ = 'Studio'
    id = Column('id', String, primary_key=True)
    name = Column('name', String)
    nameEng = Column('nameEng', String)
    description = Column('description', String)
    descriptionEng = Column('descriptionEng', String)
    image = Column('image', String)
    contactsName = Column('contactsName', String)
    contactsNameEng = Column('contactsNameEng', String)
    contactsPhone = Column('contactsPhone', String)
    ageDiapason = Column('ageDiapason', String)
    ageDiapasonEng = Column('ageDiapasonEng', String)
    scheduleDays = Column('scheduleDays', String)
    scheduleDaysEng = Column('scheduleDaysEng', String)
    scheduleTime = Column('scheduleTime', String)
    scheduleTimeEng = Column('scheduleTimeEng', String)
    order = Column('order', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))

    createdBy = relationship('User', back_populates='studios')

class About(db.Model):
    __tablename__ = 'About'
    id = Column('id', String, primary_key=True)
    name = Column('name', String)
    nameEng = Column('nameEng', String)
    surname = Column('surname', String)
    surnameEng = Column('surnameEng', String)
    position = Column('position', String)
    positionEng = Column('positionEng', String)
    image = Column('image', String)
    secondImage = Column('secondImage', String)
    order = Column('order', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))

    createdBy = relationship('User', back_populates='aboutSlides')

class Contacts(db.Model):
    __tablename__ = 'Contacts'
    id = Column('id', String, primary_key=True)
    address = Column('address', String)
    addressEng = Column('addressEng', String)
    phone = Column('phone', String)
    email = Column('email', String)
    schedule = Column('schedule', String)
    scheduleEng = Column('scheduleEng', String)

class Message(db.Model):
    __tablename__ = 'Message'
    id = Column('id', String, primary_key=True)
    name = Column('name', String)
    phone = Column('phone', String)
    message = Column('message', String)
    type = Column('type', Integer)
    createdAt = Column('createdAt', DateTime)

class Movie(db.Model):
    __tablename__ = 'Movie'
    id = Column('id', String, primary_key=True)
    title = Column('title', String)
    titleEng = Column('titleEng', String)
    age = Column('age', String)
    genre = Column('genre', String)
    genreEng = Column('genreEng', String)
    filmMaker = Column('filmMaker', String)
    filmMakerEng = Column('filmMakerEng', String)
    country = Column('country', String)
    countryEng = Column('countryEng', String)
    duration = Column('duration', String)
    description = Column('description', Text)
    descriptionEng = Column('descriptionEng', Text)
    trailerLink = Column('trailerLink', String)
    ticketLink = Column('ticketLink', String)
    applications = Column('applications', String)
    poster = Column('poster', String)
    price = Column('price', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))
    createdAt = Column('createdAt', DateTime)
    updatedAt = Column('updatedAt', DateTime)

    createdBy = relationship('User', back_populates='movies')
    showtimes = relationship('Showtime', back_populates='movie')

class Ticket(db.Model):
    __tablename__ = 'Tickets'
    idTickets  = Column(Integer, primary_key=True, autoincrement=True)
    seatRow    = Column(String(45), nullable=False)
    seatNumb = Column(String(45), nullable=False)
    email      = Column(String(45), nullable=True)
    first_name = Column(String(45), nullable=True)
    last_name  = Column(String(45), nullable=True)
    payment_method    = Column(String(45), nullable=True)
    cost       = Column(String(45), nullable=False)
    sessionId  = Column(String(80), ForeignKey('Showtime.id'), nullable=False)
    sessionId  = Column('sessionId', String(80), ForeignKey('Showtime.id'), nullable=False)
    order_id   = Column(Text, nullable=True)
    date_of_purchase = Column(Date, default=datetime.utcnow().date)
    

class Payment(db.Model):
    __tablename__ = 'payments'

    id = Column('id', String(36), primary_key=True)
    orderId = Column('orderId', String(255), nullable=False, unique=True)
    sessionId = Column('sessionId', String(191), ForeignKey('Showtime.id'), nullable=False)
    email = Column('email', String(255), nullable=False)
    amount = Column('amount', DECIMAL(10, 2), nullable=False)


    currency = Column('currency', String(10), nullable=False, default='UAH')
    status = Column('status', String(20), nullable=False, default='pending')
    liqpay_response = Column('liqpay_response', Text, nullable=True)
    createdAt = Column('createdAt', DateTime, default=datetime.utcnow)
    updatedAt = Column('updatedAt', DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tickets_info = Column('tickets_info', Text, nullable=True)
    
    




class Showtime(db.Model):
    __tablename__ = 'Showtime'
    id = Column('id', String, primary_key=True)
    dateTime = Column('dateTime', DateTime)
    movieId = Column('movieId', String, ForeignKey('Movie.id'))
    createdAt = Column('createdAt', DateTime)
    updatedAt = Column('updatedAt', DateTime)

    movie = relationship('Movie', back_populates='showtimes')

class MovieHeader(db.Model):
    __tablename__ = 'MovieHeader'
    id = Column('id', String, primary_key=True)
    title = Column('title', String)
    titleEng = Column('titleEng', String)
    subtitle = Column('subtitle', String)
    subtitleEng = Column('subtitleEng', String)
    image = Column('image', String)
    address = Column('address', String)
    addressEng = Column('addressEng', String)
    contactsPhone = Column('contactsPhone', String)
    contactTitle = Column('contactTitle', String)
    contactTitleEng = Column('contactTitleEng', String)
    createdById = Column('createdById', String, ForeignKey('User.id', ondelete='CASCADE'))
    createdAt = Column('createdAt', DateTime)
    updatedAt = Column('updatedAt', DateTime)

    createdBy = relationship('User', back_populates='MovieHeader')

class VerificationToken(db.Model):
    __tablename__ = 'VerificationToken'
    id = Column('id', String, primary_key=True)
    email = Column('email', String)
    token = Column('token', String, unique=True)
    expires = Column('expires', DateTime)

class PasswordResetToken(db.Model):
    __tablename__ = 'PasswordResetToken'
    id = Column('id', String, primary_key=True)
    email = Column('email', String)
    token = Column('token', String, unique=True)
    expires = Column('expires', DateTime)

class TwoFactorToken(db.Model):
    __tablename__ = 'TwoFactorToken'
    id = Column('id', String, primary_key=True)
    email = Column('email', String)
    token = Column('token', String, unique=True)
    expires = Column('expires', DateTime)

class TwoFactorConfirmation(db.Model):
    __tablename__ = 'TwoFactorConfirmation'
    id = Column('id', String, primary_key=True)
    userId = Column('userId', String, ForeignKey('User.id', ondelete='CASCADE'))

    user = relationship('User', back_populates='twoFactorConfirmation')
