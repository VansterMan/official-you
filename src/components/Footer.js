// src/components/Footer.js
import React from 'react';

export default function Footer() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '24px 20px',
      color: '#64748b',
      fontSize: '14px',
      borderTop: '1px solid #e2e8f0',
      marginTop: '40px'
    }}>
      Official You is a product of{' '}
      <a
        href="https://fancy.works/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#0A9D93',
          fontWeight: '600',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
      >
        Fancy Works
      </a>
    </div>
  );
}
