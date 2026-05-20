import React from 'react';
import { ReactLenis } from 'lenis/react';

/**
 * SmoothScroll component wraps the app context in Lenis to enable silky smooth momentum scroll.
 */
export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
      {children}
    </ReactLenis>
  );
}
