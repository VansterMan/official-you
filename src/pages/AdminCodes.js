// src/pages/AdminCodes.js - Temporary admin page to create codes
// Access this at /admin-codes (you'll need to add the route)
import React, { useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminCodes() {
  const [codes, setCodes] = useState('');
  const [creating, setCreating] = useState(false);
  const [results, setResults] = useState([]);

  const handleCreateCodes = async () => {
    setCreating(true);
    setResults([]);

    // Split by newlines, clean up
    const codeList = codes
      .split('\n')
      .map(code => code.trim().toUpperCase())
      .filter(code => code.length > 0);

    const creationResults = [];

    for (const code of codeList) {
      try {
        // Check if code already exists
        const codeRef = doc(db, 'referralCodes', code);
        const codeSnap = await getDoc(codeRef);

        if (codeSnap.exists()) {
          creationResults.push({ code, status: 'already exists', success: false });
        } else {
          // Create the code
          await setDoc(codeRef, {
            used: false,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
          });
          creationResults.push({ code, status: 'created', success: true });
        }
      } catch (error) {
        creationResults.push({ code, status: `error: ${error.message}`, success: false });
      }
    }

    setResults(creationResults);
    setCreating(false);
  };

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#1e293b'
          }}>
            Bulk Create Referral Codes
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '24px'
          }}>
            Enter one code per line. This page should be deleted after use!
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Referral Codes (one per line)
            </label>
            <textarea
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              placeholder={`FOUNDER2025\nBETA001\nBETA002\nLAUNCH100`}
              rows={12}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            onClick={handleCreateCodes}
            disabled={creating || !codes.trim()}
            style={{
              padding: '12px 24px',
              background: creating || !codes.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: creating || !codes.trim() ? 'not-allowed' : 'pointer',
              marginBottom: '24px'
            }}
          >
            {creating ? 'Creating Codes...' : 'Create Codes'}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div style={{
                background: successCount === totalCount ? '#d1fae5' : '#fef3c7',
                border: `1px solid ${successCount === totalCount ? '#a7f3d0' : '#fde68a'}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <strong>Results:</strong> {successCount} of {totalCount} codes created successfully
              </div>

              <div style={{
                maxHeight: '300px',
                overflow: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px'
              }}>
                {results.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px',
                      marginBottom: '4px',
                      borderRadius: '4px',
                      background: result.success ? '#f0fdf4' : '#fef2f2',
                      fontSize: '14px'
                    }}
                  >
                    <strong>{result.code}</strong>: {result.status}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '24px',
          fontSize: '14px',
          color: '#991b1b'
        }}>
          <strong>⚠️ Security Warning:</strong> Delete this page after creating your codes!
          This page has no authentication and anyone with the URL could create codes.
        </div>
      </div>
    </div>
  );
}
