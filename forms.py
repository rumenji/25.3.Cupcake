from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, URLField, FloatField
from wtforms.validators import InputRequired, Optional, AnyOf, URL, NumberRange

class AddCupcakeForm(FlaskForm):
    flavor = StringField("Flavor", validators=[InputRequired()])
    size = StringField("Size", validators=[InputRequired()])
    rating = FloatField("Rating", validators=[InputRequired()])
    image = URLField("Photo URL", validators=[Optional(), URL(message="Please enter a valid URL!")])