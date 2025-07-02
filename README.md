# Ticket Flask App

This is a simple Flask application for selecting and purchasing cinema tickets. It connects to a MySQL database (same as your main Next.js project) and provides endpoints for displaying sessions, selecting seats, and processing ticket purchases.

## Features

* Retrieve movie sessions from the database
* Display available seats in a hall and mark taken seats
* Select multiple seats and enter buyer phone number
* Create ticket records in the database
* Ready for integration with LiqPay and PPRRO

## Project Structure

```bash
ticket-flask-app/
├── app.py              # Main Flask application
├── models.py           # SQLAlchemy models (Session, Hall, Seat, Ticket)
├── extensions.py       # Initializes SQLAlchemy `db` instance
├── config.py           # Application configuration (env variables)
├── .env                # Environment variables (DATABASE_URL)
├── requirements.txt    # Python dependencies
├── templates/          # Jinja2 HTML templates
│   ├── buy.html        # Seat selection and checkout form
│   └── home.html       # (Optional) List of sessions
└── static/
    ├── css/
    │   └── styles.css
    └── js/
        └── logic.js
```

## Requirements

* Python 3.8+
* MySQL database (same schema as the Next.js backend)
* Virtual environment (recommended)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/ticket-flask-app.git
   cd ticket-flask-app
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate   # Linux/macOS
   venv\Scripts\activate    # Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env` and set your database URL:

   ```env
   DATABASE_URL=mysql+pymysql://root:password@host:port/DovMov
   ```

## Usage

1. Initialize the database (in development):

   ```bash
   python
   >>> from app import app, db
   >>> app.app_context().push()
   >>> db.create_all()
   >>> exit()
   ```

2. Run the Flask server:

   ```bash
   python app.py
   ```

   The app will be available at `http://localhost:5000`.

3. Open seat selection for a session:

   ```
   http://localhost:5000/buy?session_id=<SESSION_ID>
   ```

4. Select seats, enter phone number, and submit to `/checkout`.

## Endpoints

* `GET /` - (Optional) List all sessions
* `GET /buy?session_id=<SESSION_ID>` - Display seat selection for a specific session
* `POST /checkout` - Process seat selection and create tickets (to be implemented)

## Templates

* **buy.html** - Renders film details and seating grid with checkboxes for available seats.
* **home.html** - (Optional) Shows a list of all movie sessions.

## Next Steps

* Integrate LiqPay payment gateway in `/checkout` route
* Add PPRRO integration for online ticket taxation
* Implement ticket generation (PDF or email confirmation)
* Secure Flask endpoints (authentication/authorization)
* Deploy Flask app on a live server (DigitalOcean, Render, etc.)
* Configure reverse proxy or subdomain to integrate with Next.js front-end

---

© Your Cinema Ticketing 2025
