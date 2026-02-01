// src/pages/Profile.js - Phase 3: Display Links
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Mail, Phone, Linkedin, Facebook, Instagram, Youtube, Twitter, Music, Share2, Globe, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Footer from '../components/Footer';

// Defined outside the component so they don't change between renders
const socialLabels = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X (Twitter)',
  tiktok: 'TikTok',
  lemon8: 'Lemon8',
  pinterest: 'Pinterest',
  bluesky: 'BlueSky',
  mastodon: 'Mastodon'
};

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
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

  // useMemo must be before any early returns — React hooks must always run in the same order
  const { allLinks, hasLinks } = useMemo(() => {
    if (!profile) return { allLinks: [], hasLinks: false };

    let links = [];

    if (profile.links && Array.isArray(profile.links) && profile.links.length > 0) {
      links = profile.links;
    } else {
      // Fall back to old format for migration
      if (profile.socialLinks) {
        Object.entries(profile.socialLinks).forEach(([platform, url]) => {
          if (url && url.trim() !== '') {
            links.push({ id: `social-${platform}`, type: 'social', platform, title: socialLabels[platform] || platform, url });
          }
        });
      }
      if (profile.customLinks && Array.isArray(profile.customLinks)) {
        profile.customLinks.forEach(link => {
          links.push({ ...link, type: 'custom' });
        });
      }
    }

    return { allLinks: links, hasLinks: links.length > 0 };
  }, [profile]);

  // Helper to get the icon for a social platform — called during render, not a hook
  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: <Linkedin size={20} />,
      facebook: <Facebook size={20} />,
      instagram: <Instagram size={20} />,
      youtube: <Youtube size={20} />,
      twitter: <Twitter size={20} />,
      tiktok: <Music size={20} />,
      lemon8: <Share2 size={20} />,
      pinterest: <Share2 size={20} />,
      bluesky: <Globe size={20} />,
      mastodon: <Share2 size={20} />
    };
    return icons[platform] || <LinkIcon size={20} />;
  };

  // Early returns are safe here — all hooks have already run above
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
        background: 'linear-gradient(135deg, #0A4D4A 0%, #005A8D 100%)',
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
              color: '#0A9D93',
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
            background: profile.photoURL ? `url(${profile.photoURL})` : 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
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
                    color: '#0A9D93',
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
                    color: '#0A9D93',
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

        {/* Links Section */}
        {hasLinks ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {allLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 24px',
                  background: 'linear-gradient(135deg, #0A9D93 0%, #0077B6 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(10, 157, 147, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 157, 147, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(10, 157, 147, 0.2)';
                }}
              >
                {link.type === 'social' 
                  ? getSocialIcon(link.platform) 
                  : <LinkIcon size={20} />
                }
                <span style={{ flex: 1 }}>{link.title}</span>
                <ExternalLink size={18} />
              </a>
            ))}
          </div>
        ) : (
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
              No Links Yet
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '15px'
            }}>
              {profile.fullName.split(' ')[0]} hasn't added any links yet
            </p>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
