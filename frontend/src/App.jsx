import React from 'react'
import Uploader from './components/Uploader'
import Chat from './components/Chat'
import { FileText, Cpu } from 'lucide-react'

function App() {
  return (
    <div className="app-container">
      <div className="sidebar glass-panel">
        <div className="branding">
          <Cpu className="text-blue-500" size={28} color="#3b82f6" />
          <h1>KnowledgeLens</h1>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Knowledge Base
          </h2>
          <Uploader />
        </div>
        
        <div style={{ marginTop: 'auto', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <p>Powered by LangGraph & Gemini</p>
        </div>
      </div>
      
      <div className="main-content">
        <Chat />
      </div>
    </div>
  )
}

export default App
