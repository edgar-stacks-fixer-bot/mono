import { useEffect, useRef, useState } from 'react';

import { css } from 'leather-styles/css';
import { Box, type BoxProps } from 'leather-styles/jsx';
import type { AnimationItem, AnimationSegment } from 'lottie-web';

import { useInViewport } from './use-in-viewport';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

const preloadMargin = '200px';

async function loadLottie() {
  const lottieModule = await import('lottie-web/build/player/lottie_light');
  return lottieModule.default;
}

interface LottieAnimationProps extends Omit<BoxProps, 'width' | 'height'> {
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
  loop?: boolean;
  replayOnEnter?: boolean;
  segment?: AnimationSegment;
}

export function LottieAnimation({
  src,
  poster,
  alt,
  width,
  height,
  loop = true,
  replayOnEnter = false,
  segment,
  ...props
}: LottieAnimationProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isReady, setIsReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isNearViewport = useInViewport(wrapperRef, { rootMargin: preloadMargin, once: true });
  const isVisible = useInViewport(wrapperRef);
  const segmentStart = segment?.[0];
  const segmentEnd = segment?.[1];

  useEffect(() => {
    const container = containerRef.current;
    if (import.meta.env.SSR || !container || !isNearViewport || prefersReducedMotion) return;

    let isCancelled = false;

    async function startAnimation(container: HTMLDivElement) {
      const lottie = await loadLottie();
      if (isCancelled) return;
      const animation = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: src,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      });
      animation.addEventListener('DOMLoaded', () => {
        if (!isCancelled) setIsReady(true);
      });
      animationRef.current = animation;
    }

    void startAnimation(container);

    return () => {
      isCancelled = true;
      animationRef.current?.destroy();
      animationRef.current = null;
      setIsReady(false);
    };
  }, [src, isNearViewport, prefersReducedMotion]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!isReady || !animation) return;

    if (!isVisible) {
      animation.pause();
      return;
    }

    animation.loop = loop;

    if (segmentStart !== undefined && segmentEnd !== undefined) {
      animation.playSegments([segmentStart, segmentEnd], true);
      return;
    }

    if (replayOnEnter) {
      animation.goToAndPlay(0, true);
      return;
    }

    animation.play();
  }, [isReady, isVisible, loop, replayOnEnter, segmentStart, segmentEnd]);

  return (
    <Box
      ref={wrapperRef}
      position="relative"
      width="100%"
      style={{ aspectRatio: `${width} / ${height}` }}
      {...props}
    >
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
          transition: 'opacity 0.2s',
        })}
        style={{ opacity: isReady ? 0 : 1 }}
      />
      <Box
        ref={containerRef}
        aria-hidden
        position="absolute"
        inset={0}
        opacity={isReady ? 1 : 0}
        pointerEvents="none"
      />
    </Box>
  );
}
