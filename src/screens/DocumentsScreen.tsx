import React from 'react';
import { FileText, Download, Trash2, Eye, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { FileUpload } from '../components/FileUpload';

export const DocumentsScreen: React.FC = () => {
  const { uploadedFiles, removeFile } = useAppStore();

  return (
    <div style={{ 
      flex: 1,
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Document Management
        </h2>
        <p style={{ 
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          Upload and manage your brand strategy documents
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--bg-card)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          Upload Documents
        </h3>
        <FileUpload />
      </div>

      {uploadedFiles.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            Uploaded Files
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {uploadedFiles.map((file) => (
              <div key={file.id} style={{
                backgroundColor: 'var(--bg-input)',
                borderRadius: '6px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
                  <div>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      fontWeight: '400',
                      margin: 0
                    }}>
                      {file.name}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {file.size}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '11px', height: '11px', color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Eye style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  </button>
                  <button style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Download style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  </button>
                  <button 
                    onClick={() => removeFile(file.id)}
                    style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Trash2 style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};