import { css } from 'leather-styles/css';

interface StillImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function StillImage({ src, alt, width, height }: StillImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={css({ display: 'block', width: '100%', maxW: '390px', height: 'auto' })}
    />
  );
}
