// Modern theme system for WeatherWise app
const WeatherTheme = {
  palette: {
    light: {
      // Primary colors
      primary: '#667eea',
      secondary: '#764ba2',
      
      // Background colors
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      card: 'rgba(255, 255, 255, 0.95)',
      
      // Text colors
      text: '#1f2937',
      textSecondary: '#6b7280',
      muted: '#9ca3af',
      
      // Accent colors
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      
      // Border and divider colors
      border: 'rgba(102, 126, 234, 0.2)',
      divider: 'rgba(156, 163, 175, 0.3)',
    },
    
    dark: {
      // Primary colors
      primary: '#667eea',
      secondary: '#764ba2',
      
      // Background colors
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      surface: 'rgba(51, 65, 85, 0.9)',
      card: 'rgba(71, 85, 105, 0.8)',
      
      // Text colors
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      muted: '#94a3b8',
      
      // Accent colors
      accent: '#60a5fa',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      
      // Border and divider colors
      border: 'rgba(255, 255, 255, 0.1)',
      divider: 'rgba(148, 163, 184, 0.2)',
    }
  },

  typography: {
    // Font families
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', system-ui, sans-serif",
    
    // Headings
    heading: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      margin: '0'
    },
    
    subheading: {
      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.015em',
      margin: '0'
    },
    
    // Body text
    body: {
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      fontWeight: '400',
      lineHeight: '1.6',
      margin: '0'
    },
    
    bodyLarge: {
      fontSize: 'clamp(1rem, 2.8vw, 1.125rem)',
      fontWeight: '400',
      lineHeight: '1.6',
      margin: '0'
    },
    
    // Small text
    caption: {
      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
      fontWeight: '500',
      lineHeight: '1.4',
      margin: '0'
    },
    
    // Temperature display
    temperature: {
      fontSize: 'clamp(3rem, 8vw, 5rem)',
      fontWeight: '800',
      lineHeight: '1',
      letterSpacing: '-0.02em'
    },
    
    temperatureSecondary: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: '700',
      lineHeight: '1',
      letterSpacing: '-0.01em'
    }
  },

  spacing: {
    // Base spacing scale
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    xxl: '3rem',     // 48px
    
    // Component specific spacing
    cardPadding: 'clamp(1rem, 3vw, 1.5rem)',
    sectionGap: 'clamp(1.5rem, 4vw, 2.5rem)',
    elementGap: 'clamp(0.75rem, 2vw, 1rem)',
    
    // Grid spacing
    gridGap: {
      sm: '0.75rem',
      md: '1rem', 
      lg: '1.5rem'
    }
  },

  radii: {
    // Border radius values
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    card: '16px',
    button: '12px',
    full: '50%'
  },

  shadow: {
    // Box shadows
    sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    md: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.1)',
    xl: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1)',
    
    // Theme-specific shadows
    card: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
    cardHover: '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.1)',
    cardDark: '0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.2)',
    cardDarkHover: '0 8px 30px rgba(0, 0, 0, 0.35), 0 4px 8px rgba(0, 0, 0, 0.25)',
    
    // Button shadows
    button: '0 4px 15px rgba(102, 126, 234, 0.2)',
    buttonHover: '0 6px 20px rgba(102, 126, 234, 0.3)',
    
    // Transitions
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionFast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  breakpoints: {
    // Screen size breakpoints
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    
    // Media query helpers
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    
    // Touch device detection
    touch: '(hover: none) and (pointer: coarse)',
    hover: '(hover: hover) and (pointer: fine)'
  },

  // Helper function to get current theme based on dark mode
  getCurrentTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    return isDark ? 'dark' : 'light';
  },

  // Helper function to get theme colors
  getThemeColors(theme = null) {
    const currentTheme = theme || this.getCurrentTheme();
    return this.palette[currentTheme];
  },

  // Initialize theme from localStorage
  initializeTheme() {
    const savedTheme = localStorage.getItem('darkTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'true' || (savedTheme === null && prefersDark);
    
    if (shouldUseDark) {
      document.body.classList.add('dark-theme');
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn) {
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
      }
    }
    
    return shouldUseDark ? 'dark' : 'light';
  }
};

// Make WeatherTheme available globally
window.WeatherTheme = WeatherTheme;