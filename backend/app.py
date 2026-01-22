from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load Whisper model
model = whisper.load_model("base")

# OpenAI client - use environment variable or default to empty string
api_key = os.getenv("OPENAI_API_KEY", "")
if not api_key:
    print("Warning: OPENAI_API_KEY not set. Please set it as an environment variable.")
client = OpenAI(api_key=api_key) if api_key else None

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "openai_configured": client is not None
    })

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file"}), 400

        audio = request.files["audio"]
        if audio.filename == "":
            return jsonify({"error": "No file selected"}), 400

        audio_path = os.path.join(UPLOAD_FOLDER, audio.filename)
        audio.save(audio_path)

        # Step 1: Transcription
        result = model.transcribe(audio_path)
        text = result["text"]

        # Step 2: Summarization
        if client is None:
            return jsonify({
                "error": "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            }), 500
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Summarize the following text"},
                {"role": "user", "content": text}
            ]
        )

        summary = response.choices[0].message.content

        return jsonify({
            "transcription": text,
            "summary": summary
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
