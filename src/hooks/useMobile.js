import { useState, useEffect } from 'react';
import { 
  isMobile, 
  isTablet, 
  isDesktop, 
  isIOS, 
  isAndroid, 
  isTouchDevice,
  getViewportDimensions,
  isLandscape,
  isPortrait,
  isPWAInstalled,
  onViewportResize
} from '../utils/mobile';

/**
 * Hook to detect mobile device and viewport changes
 * @returns {Object} Mobile detection state
 */
export const useMobile = () => {
  const [mobile, setMobile] = useState(false);
  const [tablet, setTablet] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [ios, setIOS] = useState(false);
  const [android, setAndroid] = useState(false);
  const [touchDevice, setTouchDevice] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [landscape, setLandscape] = useState(false);
  const [portrait, setPortrait] = useState(true);
  const [pwaInstalled, setPWAInstalled] = useState(false);

  useEffect(() => {
    // Initial check
    const updateState = () => {
      setMobile(isMobile());
      setTablet(isTablet());
      setDesktop(isDesktop());
      setIOS(isIOS());
      setAndroid(isAndroid());
      setTouchDevice(isTouchDevice());
      setViewport(getViewportDimensions());
      setLandscape(isLandscape());
      setPortrait(isPortrait());
      setPWAInstalled(isPWAInstalled());
    };

    updateState();

    // Listen for viewport changes
    const cleanup = onViewportResize(() => {
      updateState();
    });

    return cleanup;
  }, []);

  return {
    mobile,
    tablet,
    desktop,
    ios,
    android,
    touchDevice,
    viewport,
    landscape,
    portrait,
    pwaInstalled,
    isMobile: mobile,
    isTablet: tablet,
    isDesktop: desktop,
  };
};

export default useMobile;

