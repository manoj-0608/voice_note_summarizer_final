const App = () => {
  const [audioFile, setAudioFile] = React.useState(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [transcription, setTranscription] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [error, setError] = React.useState("");
  const [isDragging, setIsDragging] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setError("");
      setTranscription("");
      setSummary("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file);
      setError("");
      setTranscription("");
      setSummary("");
    } else {
      setError("Please drop an audio file");
    }
  };

  const removeFile = () => {
    setAudioFile(null);
    setTranscription("");
    setSummary("");
    setError("");
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!audioFile) {
      setError("Please select an audio file");
      return;
    }

    setIsProcessing(true);
    setError("");
    setTranscription("");
    setSummary("");

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. Please make sure the backend is running on http://localhost:5000`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to process audio: ${response.status} ${response.statusText}`);
      }

      setTranscription(data.transcription);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "An error occurred while processing the audio");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎤 Voice Note Summarizer</h1>
        <p>Transform your audio recordings into transcribed text and AI-powered summaries</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <div
            className={`file-upload-area ${isDragging ? "dragover" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={isProcessing}
              className="file-input"
              id="audio-input"
            />
            <div className="file-upload-icon">🎵</div>
            <div className="file-upload-text">
              {isDragging ? "Drop your audio file here" : "Click to upload or drag and drop"}
            </div>
            <div className="file-upload-hint">
              Supports MP3, WAV, M4A, OGG and other audio formats
            </div>
          </div>

          {audioFile && (
            <div className="selected-file">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{audioFile.name}</span>
                  <span className="file-size">{formatFileSize(audioFile.size)}</span>
                </div>
              </div>
              <button
                type="button"
                className="remove-file"
                onClick={removeFile}
                disabled={isProcessing}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isProcessing || !audioFile}
        >
          {isProcessing ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Summary
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {(transcription || summary) && (
        <div className="results-section">
          {transcription && (
            <div className="result-card transcription-card">
              <div className="result-header">
                <span className="result-icon">📝</span>
                <h3 className="result-title">Transcription</h3>
              </div>
              <div className="result-content">{transcription}</div>
              <button
                className={`copy-button ${copiedField === "transcription" ? "copied" : ""}`}
                onClick={() => copyToClipboard(transcription, "transcription")}
              >
                {copiedField === "transcription" ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          )}

          {summary && (
            <div className="result-card summary-card">
              <div className="result-header">
                <span className="result-icon">✨</span>
                <h3 className="result-title">Summary</h3>
              </div>
              <div className="result-content">{summary}</div>
              <button
                className={`copy-button ${copiedField === "summary" ? "copied" : ""}`}
                onClick={() => copyToClipboard(summary, "summary")}
              >
                {copiedField === "summary" ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          )}
        </div>
      )}

      {isProcessing && (
        <div className="processing-overlay">
          <div className="processing-modal">
            <div className="processing-spinner"></div>
            <div className="processing-text">Processing Your Audio</div>
            <div className="processing-subtext">
              Transcribing and generating summary... This may take a moment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
