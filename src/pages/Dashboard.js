// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { ExternalLink, LogOut, User, Upload, MapPin, Mail, Phone } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [motto, setMotto] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Load user profile
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setFullName(data.fullName || '');
          setMotto(data.motto || '');
          setLocation(data.location || '');
          setEmail(data.email || currentUser.email || '');
          setPhone(data.phone || '');
          setPhotoURL(data.photoURL || '');
        }
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        fullName,
        motto,
        location,
        email,
        phone,
        updatedAt: new Date().toISOString()
      });
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveMessage('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setSaveMessage('');

    try {
      // Create a reference to the file location
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      
      // Upload file
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update Firestore
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });
      
      setPhotoURL(downloadURL);
      setSaveMessage('Profile picture updated!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setSaveMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '"DM Sans", system-ui, sans-serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Archivo+Black&display=swap');
      `}</style>

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '900',
            fontFamily: '"Archivo Black", sans-serif',
            color: '#1e293b'
          }}>
            Official You
          </h1>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              to={`/${profile?.username}`}
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: '#f1f5f9',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#475569',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <ExternalLink size={16} />
              View Profile
            </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        {/* Profile Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <User size={24} color="#667eea" />
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Profile Information
            </h2>
          </div>

          <div style={{
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
              Your profile link:
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#667eea'
            }}>
              offu.io/{profile?.username}
            </div>
          </div>

          {saveMessage && (
            <div style={{
              background: saveMessage.includes('success') ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${saveMessage.includes('success') ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: saveMessage.includes('success') ? '#065f46' : '#991b1b',
              fontSize: '14px'
            }}>
              {saveMessage}
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Profile Picture Upload */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: photoURL ? `url(${photoURL})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: '900',
                color: 'white',
                fontFamily: '"Archivo Black", sans-serif',
                position: 'relative',
                cursor: 'pointer',
                border: '4px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                {!photoURL && fullName.charAt(0).toUpperCase()}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: 'white',
                  borderRadius: '50%',
                  padding: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  pointerEvents: 'none'
                }}>
                  <Upload size={16} color="#667eea" />
                </div>
              </div>
              {uploading && (
                <div style={{ fontSize: '14px', color: '#667eea', fontWeight: '500' }}>
                  Uploading...
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Country"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Motto
              </label>
              <input
                type="text"
                value={motto}
                onChange={(e) => setMotto(e.target.value)}
                placeholder="Your personal motto or tagline"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                marginTop: '4px'
              }}>
                {motto.length}/100 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: saving ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Coming Soon Sections */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '40px',
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
            Social media links and custom URLs will be available in Phase 2
          </p>
        </div>
      </div>
    </div>
  );
}
