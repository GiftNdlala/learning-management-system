import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/LogoText.css';

const LogoText = ({ variant = 'default' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'login':
        return {
          fontSize: '3rem',
          color: 'transparent',
          background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          textShadow: 'none',
          animation: 'none'
        };
      case 'sidebar':
        return {
          fontSize: '2.5rem',
          color: '#fff',
          textShadow: `
            0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px #fff,
            0 0 42px #8231D2,
            0 0 82px #8231D2,
            0 0 92px #8231D2
          `,
          animation: 'textGlow 2s infinite alternate'
        };
      default:
        return {
          fontSize: '4rem',
          color: '#fff',
          textShadow: `
            0 0 7px #fff,
            0 0 10px #fff,
            0 0 21px #fff,
            0 0 42px #8231D2,
            0 0 82px #8231D2,
            0 0 92px #8231D2
          `,
          animation: 'textGlow 2s infinite alternate'
        };
    }
  };

  const getSubtitleStyles = () => {
    switch (variant) {
      case 'login':
        return {
          color: '#475569',
          fontSize: '0.875rem',
          textShadow: 'none'
        };
      case 'sidebar':
        return {
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.8rem',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.7)'
        };
      default:
        return {
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.9rem',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.7)'
        };
    }
  };

  return (
    <Box sx={{ textAlign: 'center', mb: variant === 'sidebar' ? 1 : variant === 'login' ? 0 : 4 }}>
      <Typography
        variant="h1"
        className="glowing-text"
        sx={{
          ...getStyles(),
          fontWeight: 900,
          letterSpacing: '0.1em',
          mb: 1,
          fontFamily: "'Arial Black', sans-serif"
        }}
      >
        AFRINEXEL
      </Typography>
      {variant !== 'login' && (
        <div className="rainbow-line">
          <div className="glow-effect"></div>
        </div>
      )}
      <Typography
        variant="h6"
        sx={{
          ...getSubtitleStyles(),
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        LEARNING MANAGEMENT SYSTEM
      </Typography>
      {variant !== 'login' && (
        <style>
          {`
            @keyframes textGlow {
              0% {
                text-shadow: 
                  0 0 7px #fff,
                  0 0 10px #fff,
                  0 0 21px #fff,
                  0 0 42px #8231D2,
                  0 0 82px #8231D2,
                  0 0 92px #8231D2;
              }
              100% {
                text-shadow: 
                  0 0 10px #fff,
                  0 0 20px #fff,
                  0 0 30px #fff,
                  0 0 60px #8231D2,
                  0 0 100px #8231D2,
                  0 0 120px #8231D2;
              }
            }
          `}
        </style>
      )}
    </Box>
  );
};

export default LogoText; 