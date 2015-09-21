from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('wally.config')

db = SQLAlchemy(app)

import wally.views
