import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocument } from '../store/slices/chatSlice';
import { UploadCloud, File, CheckCircle } from 'lucide-react';

const Uploader = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { isUploading, documentUploaded, uploadError } = useSelector((state) => state.chat);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF document.');
      return;
    }
    dispatch(uploadDocument(file));
  };

  const triggerSelect = () => {
    fileInputRef.current.click();
  };

  if (documentUploaded) {
    return (
      <div className="uploader-area" style={{ borderColor: 'var(--accent-base)', background: 'rgba(59, 130, 246, 0.05)' }}>
        <CheckCircle color="#10b981" size={32} />
        <div className="uploader-text">
          <h3 style={{ color: '#10b981' }}>Document Ready</h3>
          <p>System initialized for Querying</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`uploader-area ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerSelect}
    >
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="application/pdf" 
        style={{ display: 'none' }} 
        onChange={handleChange} 
      />
      
      {isUploading ? (
        <>
          <div className="typing-indicator" style={{ marginBottom: '8px' }}>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
          <div className="uploader-text">
            <h3>Indexing Document...</h3>
            <p>Extracting and generating embeddings</p>
          </div>
        </>
      ) : (
        <>
          <UploadCloud className="upload-icon" size={36} />
          <div className="uploader-text">
            <h3>Upload Knowledge</h3>
            <p>Drag & Drop your PDF or Click to Browse</p>
          </div>
        </>
      )}
      
      {uploadError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '8px' }}>{uploadError}</p>}
    </div>
  );
};

export default Uploader;
