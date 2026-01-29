// src/pages/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const navigate = useNavigate();

  // Check if username is available
  const checkUsername = async (user) => {
    if (!user || user.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    // Convert to lowercase and remove spaces
    const cleanUsername = user.toLowerCase().replace(/\s+/g, '');
    setUsername(cleanUsername);

    try {
      const docRef = doc(db, 'usernames', cleanUsername);
      const docSnap = await getDoc(docRef);
      setUsernameAvailable(!docSnap.exists());
    } catch (err) {
      console.error('Error checking username:', err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!fullName || !username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!usernameAvailable) {
      setError('Username is already taken');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        username,
        email,
        createdAt: new Date().toISOString()
      });

      // Reserve username
      await setDoc(doc(db, 'usernames', username), {
        uid: user.uid
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already has a profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        // User already exists, just redirect
        navigate('/dashboard');
      } else {
        // New user - need to set username
        // For now, use email prefix or displayName
        const suggestedUsername = (user.displayName || user.email.split('@')[0])
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        
        // Check if username is available
        const usernameDoc = await getDoc(doc(db, 'usernames', suggestedUsername));
        let finalUsername = suggestedUsername;
        
        if (usernameDoc.exists()) {
          // Add random number if taken
          finalUsername = suggestedUsername + Math.floor(Math.random() * 1000);
        }

        // Create user profile
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName || user.email.split('@')[0],
          username: finalUsername,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString()
        });

        // Reserve username
        await setDoc(doc(db, 'usernames', finalUsername), {
          uid: user.uid
        });

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google signup error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '900',
          fontFamily: '"Archivo Black", sans-serif',
          color: '#1e293b',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          Create Account
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#64748b',
          marginBottom: '32px',
          fontSize: '15px'
        }}>
          Join Official You and claim your link
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            color: '#991b1b',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
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
              placeholder="John Doe"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Username *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setUsername(val);
                  checkUsername(val);
                }}
                placeholder="yourname"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${usernameAvailable === true ? '#10b981' : usernameAvailable === false ? '#ef4444' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = usernameAvailable === true ? '#10b981' : usernameAvailable === false ? '#ef4444' : '#667eea'}
                onBlur={(e) => e.target.style.borderColor = usernameAvailable === true ? '#10b981' : usernameAvailable === false ? '#ef4444' : '#e2e8f0'}
              />
              {username.length >= 3 && (
                <div style={{
                  fontSize: '12px',
                  marginTop: '4px',
                  color: usernameAvailable ? '#10b981' : '#ef4444'
                }}>
                  {usernameAvailable ? '✓ Username available' : '✗ Username taken'}
                </div>
              )}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '4px'
            }}>
              Your link: offu.io/{username || 'username'}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !usernameAvailable}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !usernameAvailable ? '#cbd5e1' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading || !usernameAvailable ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading && usernameAvailable) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          gap: '12px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          type="button"
          style={{
            width: '100%',
            padding: '14px',
            background: 'white',
            color: '#1e293b',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.background = '#f8fafc';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = 'white';
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login"
            style={{
              color: '#667eea',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
