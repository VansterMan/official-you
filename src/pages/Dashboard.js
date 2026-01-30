// src/pages/Dashboard.js - Phase 3: With Links Management
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { 
  ExternalLink, LogOut, User, Upload, MapPin, Mail, Phone, 
  Plus, Trash2, ChevronUp, ChevronDown, Link as LinkIcon,
  Linkedin, Facebook, Instagram, Youtube, Twitter, 
  Music, Share2, Globe
} from 'lucide-react';
import Logo from '../components/Logo';

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
  
  // Social media links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    lemon8: '',
    pinterest: '',
    youtube: '',
    bluesky: '',
    twitter: '',
    mastodon: ''
  });
  
  // Custom links
  const [customLinks, setCustomLinks] = useState([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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
          setSocialLinks(data.socialLinks || {
            linkedin: '',
            facebook: '',
            instagram: '',
            tiktok: '',
            lemon8: '',
            pinterest: '',
            youtube: '',
            bluesky: '',
            twitter: '',
            mastodon: ''
          });
          setCustomLinks(data.customLinks || []);
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
        socialLinks,
        customLinks,
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

    if (!file.type.startsWith('image/')) {
      setSaveMessage('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setSaveMessage('');

    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
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

  const addCustomLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      setSaveMessage('Please enter both title and URL');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const newLink = {
      id: Date.now(),
      title: newLinkTitle,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`
    };

    setCustomLinks([...customLinks, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const deleteCustomLink = (id) => {
    setCustomLinks(customLinks.filter(link => link.id !== id));
  };

  const moveCustomLink = (index, direction) => {
    const newLinks = [...customLinks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newLinks.length) return;
    
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    setCustomLinks(newLinks);
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Logo size={32} />
            <h1 style={{
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: '"Archivo Black", sans-serif',
              color: '#1e293b'
            }}>
              Official You
            </h1>
          </div>

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
        {/* Save Message */}
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
            <User size={24} color="#0A9D93" />
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
              color: '#0A9D93'
            }}>
              offu.io/{profile?.username}
            </div>
          </div>

          <form onSubmit={handleSave}>
            {/* Profile Picture Upload */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: photoURL ? `url(${photoURL})` : 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
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
                  <Upload size={16} color="#0A9D93" />
                </div>
              </div>
              {uploading && (
                <div style={{ fontSize: '14px', color: '#0A9D93', fontWeight: '500' }}>
                  Uploading...
                </div>
              )}
            </div>

            {/* Basic Info Fields - continuing from where it was cut off... */}
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
                background: saving ? '#cbd5e1' : 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </form>
        </div>

        {/* Social Media Links Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Social Media Links
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '24px'
          }}>
            Add your social media profiles. Leave blank if you don't use a platform.
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* LinkedIn */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Linkedin size={18} color="#0A66C2" />
                LinkedIn
              </label>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                placeholder="https://linkedin.com/in/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Facebook */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Facebook size={18} color="#1877F2" />
                Facebook
              </label>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                placeholder="https://facebook.com/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Instagram */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Instagram size={18} color="#E4405F" />
                Instagram
              </label>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                placeholder="https://instagram.com/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* TikTok */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Music size={18} color="#000000" />
                TikTok
              </label>
              <input
                type="url"
                value={socialLinks.tiktok}
                onChange={(e) => setSocialLinks({...socialLinks, tiktok: e.target.value})}
                placeholder="https://tiktok.com/@yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Lemon8 */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Share2 size={18} color="#FFD600" />
                Lemon8
              </label>
              <input
                type="url"
                value={socialLinks.lemon8}
                onChange={(e) => setSocialLinks({...socialLinks, lemon8: e.target.value})}
                placeholder="https://lemon8-app.com/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Pinterest */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Share2 size={18} color="#E60023" />
                Pinterest
              </label>
              <input
                type="url"
                value={socialLinks.pinterest}
                onChange={(e) => setSocialLinks({...socialLinks, pinterest: e.target.value})}
                placeholder="https://pinterest.com/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* YouTube */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Youtube size={18} color="#FF0000" />
                YouTube
              </label>
              <input
                type="url"
                value={socialLinks.youtube}
                onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                placeholder="https://youtube.com/@yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* BlueSky */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Globe size={18} color="#1185FE" />
                BlueSky
              </label>
              <input
                type="url"
                value={socialLinks.bluesky}
                onChange={(e) => setSocialLinks({...socialLinks, bluesky: e.target.value})}
                placeholder="https://bsky.app/profile/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* X (Twitter) */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Twitter size={18} color="#000000" />
                X (Twitter)
              </label>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                placeholder="https://twitter.com/yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Mastodon */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                <Share2 size={18} color="#6364FF" />
                Mastodon
              </label>
              <input
                type="url"
                value={socialLinks.mastodon}
                onChange={(e) => setSocialLinks({...socialLinks, mastodon: e.target.value})}
                placeholder="https://mastodon.social/@yourprofile"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Custom Links Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Custom Links
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '24px'
          }}>
            Add custom links to your website, blog, store, or anything else!
          </p>

          {/* Add New Link Form */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Link Title
              </label>
              <input
                type="text"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="My Website"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                URL
              </label>
              <input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <button
              onClick={addCustomLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} />
              Add Link
            </button>
          </div>

          {/* Existing Links List */}
          {customLinks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {customLinks.map((link, index) => (
                <div
                  key={link.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  {/* Link Icon */}
                  <LinkIcon size={20} color="#0A9D93" />

                  {/* Link Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '4px'
                    }}>
                      {link.title}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#64748b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {link.url}
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => moveCustomLink(index, 'up')}
                      disabled={index === 0}
                      style={{
                        padding: '6px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.5 : 1
                      }}
                    >
                      <ChevronUp size={18} color="#64748b" />
                    </button>

                    <button
                      onClick={() => moveCustomLink(index, 'down')}
                      disabled={index === customLinks.length - 1}
                      style={{
                        padding: '6px',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        cursor: index === customLinks.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === customLinks.length - 1 ? 0.5 : 1
                      }}
                    >
                      <ChevronDown size={18} color="#64748b" />
                    </button>

                    <button
                      onClick={() => deleteCustomLink(link.id)}
                      style={{
                        padding: '6px',
                        background: 'white',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#64748b',
              fontSize: '14px'
            }}>
              No custom links yet. Add your first link above!
            </div>
          )}
        </div>

        {/* Remember to Save Reminder */}
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          color: '#92400e',
          textAlign: 'center'
        }}>
          💡 <strong>Remember:</strong> Click "Save All Changes" at the top to save your profile and links!
        </div>
      </div>
    </div>
  );
}
