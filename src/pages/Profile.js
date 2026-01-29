// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Query users collection for this username
        const q = query(collection(db, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setNotFound(true);
        } else {
          const userData = querySnapshot.docs[0].data();
          setProfile(userData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ fontSize: '18px', color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        padding: '20px'
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Archivo+Black&display=swap');
        `}</style>

        <div style={{ textAlign: 'center', color: 'white' }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: '900',
            fontFamily: '"Archivo Black", sans-serif',
            marginBottom: '16px'
          }}>
            404
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '32px',
            opacity: 0.9
          }}>
            This profile doesn't exist
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'white',
              color: '#667eea',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '16px'
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      padding: '40px 20px'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Archivo+Black&display=swap');
      `}</style>

      <div style={{
        maxWidth: '680px',
        margin: '0 auto'
      }}>
        {/* Profile Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Profile Picture */}
          <div style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: profile.photoURL ? `url(${profile.photoURL})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: '900',
            color: 'white',
            fontFamily: '"Archivo Black", sans-serif',
            border: '4px solid #f8fafc',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            {!profile.photoURL && profile.fullName.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            fontFamily: '"Archivo Black", sans-serif',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            {profile.fullName}
          </h1>

          {/* Username */}
          <div style={{
            fontSize: '16px',
            color: '#64748b',
            marginBottom: profile.motto || profile.location || profile.email || profile.phone ? '16px' : '0',
            fontWeight: '500'
          }}>
            @{profile.username}
          </div>

          {/* Motto */}
          {profile.motto && (
            <p style={{
              fontSize: '16px',
              color: '#475569',
              fontStyle: 'italic',
              maxWidth: '500px',
              margin: '0 auto 20px',
              paddingBottom: profile.location || profile.email || profile.phone ? '20px' : '0',
              borderBottom: profile.location || profile.email || profile.phone ? '1px solid #e2e8f0' : 'none'
            }}>
              "{profile.motto}"
            </p>
          )}

          {/* Contact Info */}
          {(profile.location || profile.email || profile.phone) && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
              marginTop: '20px'
            }}>
              {profile.location && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#64748b',
                  fontSize: '15px'
                }}>
                  <MapPin size={16} />
                  {profile.location}
                </div>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#667eea',
                    fontSize: '15px',
                    textDecoration: 'none'
                  }}
                >
                  <Mail size={16} />
                  {profile.email}
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#667eea',
                    fontSize: '15px',
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={16} />
                  {profile.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Links Section - Coming Soon */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            🔗
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Links Coming Soon
          </h3>
          <p style={{
            color: '#64748b',
            fontSize: '15px'
          }}>
            {profile.fullName.split(' ')[0]} hasn't added any links yet
          </p>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <Link
            to="/"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Create your own Official You profile
          </Link>
        </div>
      </div>
    </div>
  );
}
