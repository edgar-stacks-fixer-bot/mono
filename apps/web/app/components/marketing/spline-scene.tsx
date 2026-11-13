import { type ComponentType, useEffect, useRef, useState } from 'react';

import type { SplineProps } from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { css } from 'leather-styles/css';
import { Box, type BoxProps } from 'leather-styles/jsx';

import { SplineErrorBoundary } from './spline-error-boundary';
import { useInViewport } from './use-in-viewport';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

const preloadMargin = '300px';

async function loadSpline() {
  const splineModule = await import('@splinetool/react-spline');
  return splineModule.default;
}

interface SplineSceneProps extends Omit<BoxProps, 'width' | 'height'> {
  scene: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
}

export function SplineScene({ scene, poster, alt, width, height, ...props }: SplineSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [Spline, setSpline] = useState<ComponentType<SplineProps> | null>(null);
  const applicationRef = useRef<Application | null>(null);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNearViewport = useInViewport(wrapperRef, { rootMargin: preloadMargin, once: true });
  const isVisible = useInViewport(wrapperRef);

  useEffect(() => {
    if (import.meta.env.SSR || !isNearViewport || prefersReducedMotion) return;

    let isCancelled = false;
    async function prepareSpline() {
      const component = await loadSpline();
      if (!isCancelled) setSpline(() => component);
    }

    void prepareSpline();

    return () => {
      isCancelled = true;
    };
  }, [isNearViewport, prefersReducedMotion]);

  useEffect(() => {
    const application = applicationRef.current;
    if (!isReady || !application) return;
    if (isVisible) application.play();
    else application.stop();
  }, [isReady, isVisible]);

  function onLoad(application: Application) {
    applicationRef.current = application;
    setIsReady(true);
  }

  function onError() {
    applicationRef.current = null;
    setIsReady(false);
  }

  const posterImage = (
    <img
      src={poster}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={css({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'opacity 0.3s',
      })}
      style={{ opacity: isReady ? 0 : 1 }}
    />
  );

  return (
    <Box
      ref={wrapperRef}
      position="relative"
      width="100%"
      style={{ aspectRatio: `${width} / ${height}` }}
      {...props}
    >
      {posterImage}
      {Spline && !prefersReducedMotion && (
        <SplineErrorBoundary fallback={null} onError={onError}>
          <Box
            aria-hidden
            position="absolute"
            inset={0}
            transition="opacity 0.3s"
            style={{ opacity: isReady ? 1 : 0 }}
          >
            <Spline scene={scene} onLoad={onLoad} style={{ width: '100%', height: '100%' }} />
          </Box>
        </SplineErrorBoundary>
      )}
    </Box>
  );
}
