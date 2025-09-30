import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const FileUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { addFile } = useAppStore();

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        addFile(file);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      style={{
        marginTop: '20px',
        padding: '24px',
        backgroundColor: isDragging ? 'var(--bg-hover)' : 'var(--bg-input)',
        border: `2px dashed ${isDragging ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 200ms',
        textAlign: 'center'
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
      />
      
      <Upload style={{ 
        width: '32px', 
        height: '32px', 
        color: 'var(--text-muted)',
        margin: '0 auto 12px'
      }} />
      
      <p style={{ 
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginBottom: '8px'
      }}>
        Drop files here or click to upload
      </p>
      
      <p style={{ 
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        Supports PDF, DOC, DOCX, PPT, PPTX, TXT
      </p>
    </div>
  );
};

export const FileList: React.FC = () => {
  const { uploadedFiles, removeFile } = useAppStore();
  
  if (uploadedFiles.length === 0) return null;
  
  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '14px' 
      }}>
        <FileText style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--text-secondary)', 
          fontWeight: '500' 
        }}>
          {uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} uploaded
        </span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {uploadedFiles.map((file) => (
          <div key={file.id} style={{ 
            backgroundColor: 'var(--bg-input)',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            border: '1px solid var(--border-subtle)',
            position: 'relative'
          }}>
            <FileText style={{ 
              width: '16px', 
              height: '16px', 
              color: 'var(--text-muted)', 
              marginTop: '2px' 
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ 
                fontSize: '13px',
                color: 'var(--text-primary)',
                fontWeight: '400',
                margin: 0,
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{file.name}</p>
              <p style={{ 
                fontSize: '11px', 
                color: 'var(--text-muted)', 
                margin: 0 
              }}>{file.size}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file.id);
              }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 200ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FileText: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={style}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);