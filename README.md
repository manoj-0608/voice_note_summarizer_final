# Voice Note Summarizer

A web application that transcribes audio files using Whisper AI and generates summaries using OpenAI GPT.

## Prerequisites

1. **Python 3.8+** installed
2. **OpenAI API Key** - Get one from https://platform.openai.com/api-keys
3. All Python dependencies installed (Flask, flask-cors, openai, whisper)

## Setup Instructions

### 1. Set Your OpenAI API Key

**Windows PowerShell:**
```powershell
$env:OPENAI_API_KEY="your-api-key-here"
```

**Windows Command Prompt:**
```cmd
set OPENAI_API_KEY=your-api-key-here
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="your-api-key-here"
```

### 2. Start the Backend Server

Open a terminal and navigate to the backend directory:

```bash
cd backend
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
.\venv\Scripts\activate.bat   # Windows CMD
# OR
source venv/bin/activate      # Linux/Mac

python app.py
```

The backend will start on **http://localhost:5000**

### 3. Start the Frontend Server

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
python -m http.server 8000
```

The frontend will be available at **http://localhost:8000**

## How to Use

1. **Open your web browser** and navigate to: **http://localhost:8000**

2. **Upload an audio file:**
   - Click the "Choose File" button
   - Select an audio file from your computer (supports formats like: .mp3, .wav, .m4a, .ogg, etc.)

3. **Click "Summarize"** button

4. **Wait for processing:**
   - The app will show "Processing..." while working
   - First, it transcribes your audio using Whisper AI
   - Then, it generates a summary using OpenAI GPT-4o-mini

5. **View results:**
   - **Transcription**: The full text transcription of your audio
   - **Summary**: A concise summary of the transcribed content

## Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- OGG (.ogg)
- FLAC (.flac)
- And other common audio formats

## Troubleshooting

### Backend won't start
- Make sure you're in the `backend` directory
- Ensure the virtual environment is activated
- Check that all dependencies are installed: `pip install flask flask-cors openai openai-whisper`

### "OpenAI API key not configured" error
- Make sure you've set the `OPENAI_API_KEY` environment variable
- Restart the backend server after setting the environment variable

### Frontend can't connect to backend
- Ensure the backend is running on port 5000
- Check that CORS is enabled (it should be by default)
- Make sure both servers are running simultaneously

### Processing takes too long
- Large audio files take longer to process
- The Whisper model needs to download on first use (this is automatic)
- Network speed affects API calls to OpenAI

## Features

- ✅ Audio file upload
- ✅ Automatic transcription using Whisper AI
- ✅ AI-powered summarization
- ✅ Clean, modern web interface
- ✅ Error handling and user feedback
- ✅ Real-time processing status

## API Endpoint

The backend exposes a POST endpoint:

**POST** `/summarize`
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with `audio` field containing the audio file
- **Response**: JSON with `transcription` and `summary` fields

Example response:
```json
{
  "transcription": "Full transcribed text here...",
  "summary": "Summary of the transcription..."
}
```
