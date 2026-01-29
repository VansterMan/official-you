// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      padding: '20px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Archivo+Black&display=swap');
      `}</style>

      <div style={{
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Logo/Title */}
        <h1 style={{
          fontSize: '56px',
          fontWeight: '900',
          fontFamily: '"Archivo Black", sans-serif',
          color: 'white',
          marginBottom: '16px',
          letterSpacing: '-1px'
        }}>
          Official You
        </h1>

        <p style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '48px',
          fontWeight: '500'
        }}>
          One link for everything you are
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <Link 
            to="/signup"
            style={{
              background: 'white',
              color: '#667eea',
              padding: '18px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'block',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Get Started Free
          </Link>

          <Link 
            to="/login"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '18px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'block',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            Log In
          </Link>
        </div>

        {/* Example profile link */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '8px'
        }}>
          Example profile:
        </p>
        <Link
          to="/van"
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'underline'
          }}
        >
          offu.io/van
        </Link>
      </div>
    </div>
  );
}
