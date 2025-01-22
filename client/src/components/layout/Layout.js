import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import 'particles.js/particles';

const Layout = () => {
  useEffect(() => {
    window.particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#400'
        },
        shape: {
          type: 'circle'
        },
        opacity: {
          value: 0.5,
          random: false
        },
        size: {
          value: 3,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          value: '#400',
          opacity: 0.5,
          width: 1
        },
        move: {
          enable: true,
          speed: 3,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'bounce'
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          resize: true
        }
      },
      retina_detect: true
    });
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh'
    }}>
      <div id="particles-js" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }} />
      <Outlet />
    </div>
  );
};

export default Layout;