import json
import joblib
import random
import re
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import requests
import cohere
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
import secrets
from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
models_dir = os.path.join(os.getcwd(), 'models')


# Load chat rules
chat_rules_dir = os.path.join(os.getcwd(), 'chat_rules')
with open(os.path.join(chat_rules_dir, 'Chat_rules.json'), 'r', encoding='utf-8') as rules_file:
    chat_rules = json.load(rules_file)

class Form(FlaskForm):
    text = StringField('Talk to Chatti 👉', validators=[DataRequired()])
    submit = SubmitField('Send')


def generate_response(user_message):
    for rule in chat_rules['triggers']:
        for trigger in rule['trigger']:
            if re.search(r'\b' + trigger + r'\b', user_message, re.IGNORECASE):
                # If a trigger is found, return the corresponding response
                return rule['response']
    # If no trigger is found, call the Cohere API
    co = cohere.Client('oFkFCVKmdNrYJ14hOYCMZ8ygz8HkEAXS1FDaymnh')  # Update with your Cohere API key
    response = co.generate(
        model='command-nightly',
        prompt=user_message,
        max_tokens=300,
        temperature=0.9,
        k=0,
        p=0.75,
        stop_sequences=[],
        return_likelihoods='NONE'
    )
    output = response.generations[0].text
    return output

# Store conversation history
conversation_history = []

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form['message']
    bot_response = generate_response(user_message)
    
    # Save conversation history
    conversation_history.append({'user_message': user_message, 'bot_response': bot_response})
    
    return jsonify({'bot_response': bot_response})

@app.route('/', methods=['GET', 'POST'])
def home():
    form = Form()  # Instantiate the Form

    if form.validate_on_submit():
        user_message = form.text.data
        bot_response = generate_response(user_message)
        
        # Save conversation history
        conversation_history.append({'user_message': user_message, 'bot_response': bot_response})

        return render_template('conversation-page.html', form=form, output=bot_response)

    return render_template('conversation-page.html', form=form, output=None)

@app.route('/conversation-history')
def get_conversation_history():
    return jsonify(conversation_history)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/conversation-page.html')
def conversation_page():
    return render_template('conversation-page.html')

if __name__ == '__main__':
    app.run(debug=True)
