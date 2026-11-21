import React from 'react';

export default function App() {
  return (
    <div style={{background:'#090d18',color:'white',minHeight:'100vh',padding:'25px',fontFamily:'Arial'}}>
      <h1>Aahad AI Studio</h1>
      <p>Your AI Creation Platform</p>

      <h2>AI Video Generator</h2>
      <textarea placeholder="Describe the video you want to create..." style={{width:'100%',height:'100px'}} />
      <br /><br />
      <button>Generate Video</button>

      <hr />

      <h2>AI Video Clipper</h2>
      <input type="file" accept="video/*" />
      <br /><br />
      <button>Extract Clips</button>

      <p>More powerful AI tools coming soon.</p>
    </div>
  );
      }
