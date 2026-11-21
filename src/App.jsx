import React, { useState } from 'react';

export default function App() {
  const [page, setPage] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [video, setVideo] = useState(null);
  const [clips, setClips] = useState(5);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080b16',
      color: 'white',
      fontFamily: 'Arial',
      padding: '20px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        borderBottom: '1px solid #293149',
        paddingBottom: '20px'
      }}>
        <h2 style={{color:'#a99bff'}}>✦ AAHAD AI STUDIO</h2>
        <span style={{color:'#9ca3af'}}>AI Creation Platform</span>
      </header>

      <h1 style={{fontSize:'34px', marginTop:'35px'}}>
        Create Something Amazing.
      </h1>
      <p style={{color:'#9ca3af'}}>
        Your creative world powered by AI.
      </p>

      <div style={{
        display:'flex',
        gap:'12px',
        flexWrap:'wrap',
        margin:'30px 0'
      }}>
        <button onClick={()=>setPage('home')}>Dashboard</button>
        <button onClick={()=>setPage('video')}>AI Video Generator</button>
        <button onClick={()=>setPage('clipper')}>Video Clipper</button>
      </div>

      {page === 'home' && (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
          gap:'18px'
        }}>
          <div style={card}>
            <h2>🎬 AI Video Generator</h2>
            <p>Create videos from your text prompts.</p>
            <button onClick={()=>setPage('video')}>Open Generator</button>
          </div>
          <div style={card}>
            <h2>✂️ Video Clipper</h2>
            <p>Upload a long video and prepare multiple clips.</p>
            <button onClick={()=>setPage('clipper')}>Open Clipper</button>
          </div>
        </div>
      )}

      {page === 'video' && (
        <div style={card}>
          <h2>🎬 AI Video Generator</h2>
          <p>Describe the video you want to create.</p>
          <textarea
            value={prompt}
            onChange={e=>setPrompt(e.target.value)}
            placeholder="Describe your video..."
            style={field}
          />
          <button onClick={()=>alert(
            'AI video generation API connection is required. Your prompt: '+prompt
          )}>
            Generate Video
          </button>
          <p style={{color:'#a99bff'}}>
            AI generation API: Not connected yet
          </p>
        </div>
      )}

      {page === 'clipper' && (
        <div style={card}>
          <h2>✂️ AI Video Clipper</h2>
          <p>Select a video from your device.</p>
          <input
            type="file"
            accept="video/*"
            onChange={e=>setVideo(e.target.files[0])}
            style={field}
