Repository folders should be kept as:

Chatbot (main folder)

|__chat_rules (sub folder)
```bash
   |__Chat_rules
```
|__static (sub folder)
```bash
   |__conversation-script.js

   |__2.jpg

   |__logo.jpg

   |__user.jpg
```
|__templates (sub folder)
```bash
   |__conversation-page.html
   ```
|__app.py

```markdown
# EmoCare Chatbot

Welcome to EmoCare Chatbot, a web-based application designed to provide emotional support and engagement through conversation.

## Overview

EmoCare Chatbot utilizes natural language processing to interact with users, offering suggestions and activities to enhance mood based on their emotional state.

## Features

- Real-time Chat: Engage in real-time conversations with EmoCare Chatbot.
- Emotional Support: Receive tailored responses and activities based on your emotional input.
- Interactive Interface: User-friendly chat interface designed for ease of use.

## Installation

To run EmoCare Chatbot locally or deploy it:

1. Clone the repository:
   ```bash
   git clone https://github.com/Mahnoor-rao/emotion-care-chatbot-using-Cohere-API 
   cd emocare-chatbot
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Obtain and set your Cohere API key in your environment variables (`COHERE_API_KEY`).

4. Run the application:
   ```bash
   python app.py
   ```

5. Open your web browser and go to `http://localhost:5000` to access EmoCare Chatbot.

## Dependencies

- Flask==3.0.0
- Flask-WTF==0.15.1
- requests==2.31.0
- cohere==0.2.0

Install these dependencies using `pip install -r requirements.txt`.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
```
