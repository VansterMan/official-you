// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A4D4A 0%, #005A8D 100%)',
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '16px'
        }}>
          <Logo size={80} />
          <h1 style={{
            fontSize: '56px',
            fontWeight: '900',
            fontFamily: '"Archivo Black", sans-serif',
            color: 'white',
            margin: 0,
            letterSpacing: '-1px'
          }}>
            Official You
          </h1>
        </div>

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
              color: '#0A9D93',
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
            Accept Invitation
          </Link>

          <Link 
            to="/waitlist"
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
            Join the Waitlist
          </Link>
        </div>

        {/* Invitation Only Message */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.85)',
          marginBottom: '24px',
          lineHeight: '1.6',
          maxWidth: '400px',
          margin: '0 auto 24px'
        }}>
          Official You is currently by invitation only. Join the waitlist to be notified as we open new spots.
        </p>

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
            textDecoration: 'underline',
            display: 'block',
            marginBottom: '24px'
          }}
        >
          offu.io/van
        </Link>

        {/* Login link */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'white',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
