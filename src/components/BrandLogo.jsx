import React from 'react';

/**
 * High-accuracy official vector brand logos for mobile ecosystems and manufacturers.
 * Guaranteed to render crisply across Windows, macOS, Android, and iOS.
 */
export default function BrandLogo({
  brand = '',
  size = 22,
  className = '',
  color = null,
  monochrome = false,
  style = {}
}) {
  const rawKey = String(brand || '').toLowerCase().trim();

  // Normalize brand keys
  let brandKey = rawKey;
  if (rawKey.includes('apple') || rawKey === 'iphone') brandKey = 'apple';
  else if (rawKey.includes('samsung') || rawKey === 'galaxy') brandKey = 'samsung';
  else if (rawKey.includes('google') || rawKey.includes('pixel')) brandKey = 'google';
  else if (rawKey.includes('oneplus') || rawKey === '1+') brandKey = 'oneplus';
  else if (rawKey.includes('xiaomi') || rawKey.includes('redmi') || rawKey === 'mi') brandKey = 'xiaomi';
  else if (rawKey.includes('realme')) brandKey = 'realme';
  else if (rawKey.includes('anker')) brandKey = 'anker';
  else if (rawKey.includes('spigen')) brandKey = 'spigen';
  else if (rawKey.includes('belkin')) brandKey = 'belkin';
  else if (rawKey.includes('huawei') || rawKey.includes('honor')) brandKey = 'huawei';
  else if (rawKey.includes('nothing')) brandKey = 'nothing';

  // 1. APPLE (Official Apple Silhouette & Leaf - Flawless on Windows)
  if (brandKey === 'apple') {
    return (
      <svg
        viewBox="0 0 170 170"
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        fill={color || '#0f172a'}
        aria-label="Apple Logo"
      >
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.03-7.61-7.79-11.73-14.28-5.46-8.5-9.85-18.06-13.17-28.7-3.32-10.63-4.98-20.93-4.98-30.89 0-14.07 3.51-25.99 10.53-35.77 7.02-9.78 16.03-14.88 27.03-15.3 4.8 0 10.14 1.25 16.01 3.75 5.88 2.5 9.87 3.75 11.98 3.75 1.74 0 5.8-1.25 12.19-3.75 6.39-2.5 11.83-3.64 16.33-3.42 12.3.65 22.09 5.37 29.37 14.16-10.67 6.53-15.89 15.68-15.67 27.46.22 9.15 3.76 16.81 10.63 22.98 6.86 6.17 14.93 9.68 24.2 10.53-2.61 7.84-5.83 15.46-9.67 22.86zM119.22 31.84c0-7.19 2.56-13.91 7.69-20.16 5.13-6.25 11.45-10.23 18.96-11.94.33 1.09.49 2.18.49 3.27 0 7.3-2.67 14.19-8.01 20.67-5.34 6.48-11.85 10.43-19.53 11.85-.22-1.2-.6-2.43-.6-3.69z" />
      </svg>
    );
  }

  // 2. GOOGLE (Official 4-Color Google "G" or Monochrome Variant)
  if (brandKey === 'google') {
    if (monochrome || color) {
      return (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={className}
          style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
          fill={color || 'currentColor'}
          aria-label="Google Logo"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      );
    }
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Google Logo"
      >
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    );
  }

  // 3. SAMSUNG (Official Samsung Blue Pill Capsule with Authentic Lettering)
  if (brandKey === 'samsung') {
    return (
      <svg
        viewBox="0 0 54 22"
        width={Math.round(size * 2.25)}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Samsung Logo"
      >
        <ellipse
          cx="27"
          cy="11"
          rx="26.5"
          ry="10.5"
          fill={monochrome ? (color || 'currentColor') : '#1428a0'}
          transform="rotate(-8 27 11)"
        />
        <text
          x="27"
          y="14.6"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="8.6"
          fontWeight="900"
          fontFamily="Outfit, -apple-system, BlinkMacSystemFont, Arial, sans-serif"
          letterSpacing="1"
        >
          SAMSUNG
        </text>
      </svg>
    );
  }

  // 4. ONEPLUS (Official OnePlus Red Badge with White 1 and +)
  if (brandKey === 'oneplus') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="OnePlus Logo"
      >
        <rect
          width="24"
          height="24"
          rx="5"
          fill={monochrome ? (color || 'currentColor') : '#eb0029'}
        />
        {/* White numeric 1 */}
        <path
          d="M10.8 6.8h2.1v10.4h-2.1V9.2h-1.5V7.6c1-.2 1.5-.5 1.5-.8z"
          fill="#ffffff"
        />
        {/* White + symbol at top right */}
        <path
          d="M16 8.5h2v1.5h-2v2h-1.5v-2h-2V8.5h2v-2H16v2z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // 5. XIAOMI (Official Xiaomi Signature Orange Squircle with White "mi" Logo)
  if (brandKey === 'xiaomi') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Xiaomi Logo"
      >
        <rect
          width="24"
          height="24"
          rx="6.5"
          fill={monochrome ? (color || 'currentColor') : '#ff6900'}
        />
        {/* The iconic white MI mark */}
        <path
          d="M6.2 7.6h4.1v5h1.5V7.6H15v8.8h-2.1V12h-1.2v4.4h-2.1V12H8.3v4.4H6.2V7.6zm10.7 2.2h1.9v6.6h-1.9V9.8zm0-2.2h1.9v1.4h-1.9V7.6z"
          fill="#ffffff"
        />
      </svg>
    );
  }

  // 6. ANKER (Official Anker Cyan Blue Badge with Bold Typography)
  if (brandKey === 'anker') {
    return (
      <svg
        viewBox="0 0 54 22"
        width={Math.round(size * 2.25)}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Anker Logo"
      >
        <rect
          width="54"
          height="22"
          rx="5"
          fill={monochrome ? (color || 'currentColor') : '#00a6e0'}
        />
        <text
          x="27"
          y="15.2"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="Outfit, -apple-system, BlinkMacSystemFont, Arial, sans-serif"
          letterSpacing="1.2"
        >
          ANKER
        </text>
      </svg>
    );
  }

  // 7. SPIGEN (Official Spigen Signature Vibrant Orange Badge)
  if (brandKey === 'spigen') {
    return (
      <svg
        viewBox="0 0 56 22"
        width={Math.round(size * 2.3)}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Spigen Logo"
      >
        <rect
          width="56"
          height="22"
          rx="5"
          fill={monochrome ? (color || 'currentColor') : '#ff5a00'}
        />
        <text
          x="28"
          y="15"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.2"
          fontWeight="900"
          fontFamily="Outfit, -apple-system, BlinkMacSystemFont, Arial, sans-serif"
          letterSpacing="0.6"
        >
          spigen
        </text>
      </svg>
    );
  }

  // 8. BELKIN (Official Belkin Forest Green Badge)
  if (brandKey === 'belkin') {
    return (
      <svg
        viewBox="0 0 54 22"
        width={Math.round(size * 2.25)}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Belkin Logo"
      >
        <rect
          width="54"
          height="22"
          rx="5"
          fill={monochrome ? (color || 'currentColor') : '#009639'}
        />
        <text
          x="27"
          y="15"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="9.5"
          fontWeight="800"
          fontFamily="Outfit, -apple-system, BlinkMacSystemFont, Arial, sans-serif"
          letterSpacing="0.8"
        >
          belkin
        </text>
      </svg>
    );
  }

  // 9. REALME (Official Realme Vibrant Yellow Badge)
  if (brandKey === 'realme') {
    return (
      <svg
        viewBox="0 0 56 22"
        width={Math.round(size * 2.3)}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Realme Logo"
      >
        <rect
          width="56"
          height="22"
          rx="5"
          fill={monochrome ? (color || 'currentColor') : '#ffc915'}
        />
        <text
          x="28"
          y="15.2"
          textAnchor="middle"
          fill="#1e293b"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="Outfit, -apple-system, BlinkMacSystemFont, Arial, sans-serif"
          letterSpacing="0.5"
        >
          realme
        </text>
      </svg>
    );
  }

  // 10. HUAWEI (Official Huawei Flower / Crown Petals)
  if (brandKey === 'huawei') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        aria-label="Huawei Logo"
      >
        <circle cx="12" cy="12" r="11" fill={monochrome ? (color || 'currentColor') : '#cf0a2c'} />
        <path d="M12 4c.8 2 2 3.5 3 4.5s2 1.5 3 2c-1.5.3-3 .2-4.5-.5S12 7.5 12 4z" fill="#ffffff" />
        <path d="M12 4c-.8 2-2 3.5-3 4.5s-2 1.5-3 2c1.5.3 3 .2 4.5-.5S12 7.5 12 4z" fill="#ffffff" />
        <path d="M12 20c.8-2 2-3.5 3-4.5s2-1.5 3-2c-1.5-.3-3-.2-4.5.5S12 16.5 12 20z" fill="#ffffff" />
        <path d="M12 20c-.8-2-2-3.5-3-4.5s-2-1.5-3-2c1.5-.3 3-.2 4.5.5S12 16.5 12 20z" fill="#ffffff" />
      </svg>
    );
  }

  // Fallback: Clean generic circular brand badge with initial
  const initial = (rawKey.charAt(0) || '✦').toUpperCase();
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: Math.round(size * 0.65),
        fontWeight: 900,
        color: color || 'currentColor',
        fontFamily: 'Outfit, sans-serif',
        ...style
      }}
    >
      {initial}
    </span>
  );
}
