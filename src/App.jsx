
import React, { useState, useRef } from 'react';

export default function App() {
  const [page, setPage] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const card = {
    background: '#151b2e',
    padding: '22px',
    borderRadius: '16px',
    border: '1px solid #303b59',
    marginTop: '20px'
  };

  const btn = {
    background: '#795cff',
    color: 'white',
    border: 0,
    padding: '13px 20px',
    borderRadius: '9px',
    margin: '6px',
    cursor: 'pointer'
  };

  const field = {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    background: '#080b16',
    color: 'white',
    border: '1px solid #39435e',
    borderRadius: '8px',
    boxSizing: 'border-box'
  };

  const upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setVideoUrl(URL.createObjectURL(file));
    setOutputUrl('');
    setMessage('');
    setStart(0);
  };

  const createClip = async () => {
    const player = videoRef.current;
    if (!player || !videoUrl) return;

    if (start < 0 || end <= start || end > duration) {
      setMessage('Please enter valid start and end times.');
      return;
    }

    const capture = player.captureStream || player.mozCaptureStream;
    if (!capture || !window.MediaRecorder) {
      setMessage('Clipping is not supported in this browser.');
      return;
    }

    setLoading(true);
    setMessage('Creating clip...');

    try {
      player.pause();
      player.currentTime = start;
      await new Promise(resolve => {
        player.onseeked = resolve;
      });

      const stream = capture.call(player);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType: mime });
      const chunks = [];

      recorder.ondataavailable = e => {
        if (e.data.size) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mime });
        setOutputUrl(URL.createObjectURL(blob));
        setLoading(false);
        setMessage('Clip ready!');
        stream.getTracks().forEach(track => track.stop());
      };

      const stop = () => {
        if (player.currentTime >= end) {
          player.pause();
          player.removeEventListener('timeupdate', stop);
          if (recorder.state === 'recording') recorder.stop();
        }
      };

      player.addEventListener('timeupdate', stop);
      recorder.start(250);
      await player.play();

    } catch (error) {
      setLoading(false);
      setMessage('Could not create clip. Try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080b16',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderBottom: '1px solid #303b59'
      }}>
        <h2 style={{color:'#a99bff'}}>✦ AAHAD AI STUDIO</h2>
        <p>AI Creation Platform</p>
      </header>

      <h1 style={{marginTop:35}}>Create Something Amazing.</h1>
      <p style={{color:'#9ca3af'}}>Your creative world powered by AI.</p>

      <nav>
        <button style={btn} onClick={() => setPage('home')}>Dashboard</button>
        <button style={btn} onClick={() => setPage('video')}>AI Video Maker</button>
        <button style={btn} onClick={() => setPage('clipper')}>Video Clipper</button>
      </nav>

      {page === 'home' && (
        <div style={card}>
          <h2>Welcome to Aahad AI Studio</h2>
          <p>Choose your creative tool.</p>
          <button style={btn} onClick={() => setPage('video')}>Open Video Maker</button>
          <button style={btn} onClick={() => setPage('clipper')}>Open Video Clipper</button>
        </div>
      )}

      {page === 'video' && (
        <div style={card}>
          <h2>🎬 AI Video Generator</h2>
          <textarea
            style={field}
            rows="5"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your video..."
          />
          <button style={btn} onClick={() => setMessage('AI generation API is not connected yet.')}>
            Generate Video
          </button>
          <p style={{color:'#a99bff'}}>{message || 'AI API connection required.'}</p>
        </div>
      )}

      {page === 'clipper' && (
        <div style={card}>
          <h2>✂️ AI Video Clipper</h2>
          <p>Upload a video from your device.</p>

          <input
            type="file"
            accept="video/*"
            onChange={upload}
            style={field}
          />

          {videoUrl && (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                onLoadedMetadata={e => {
                  const d = e.currentTarget.duration;
                  setDuration(d);
                  setEnd(Math.min(10, Math.floor(d)));
                }}
                style={{width:'100%', borderRadius:12, marginTop:15}}
              />

              <p>Duration: {duration.toFixed(1)} seconds</p>

              <label>Start Time (seconds)</label>
              <input
                type="number"
                style={field}
                value={start}
                min="0"
                max={duration}
                onChange={e => setStart(Number(e.target.value))}
              />

              <label>End Time (seconds)</label>
              <input
                type="number"
                style={field}
                value={end}
                min="0"
                max={duration}
                onChange={e => setEnd(Number(e.target.value))}
              />

              <button style={btn} disabled={loading} onClick={createClip}>
                {loading ? 'Creating...' : '✂️ Create Clip'}
              </button>

              <p>{message}</p>

              {outputUrl && (
                <>
                  <h3>✅ Your Clip Is Ready</h3>
                  <video src={outputUrl} controls style={{width:'100%'}} />
                  <a
                    href={outputUrl}
                    download="aahad-ai-clip.webm"
                    style={{...btn, display:'inline-block', textDecoration:'none'}}
                  >
                    Download Clip
                  </a>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
    }
        
