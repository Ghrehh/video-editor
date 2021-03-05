import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface TrackElement {
  name: string;
  start: number;
  duration: number;
}

interface Track {
  name: string;
  elements: TrackElement[];
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const isRect = (thing: any): thing is Rect => {
  return (
    typeof thing === 'object' &&
    'x' in thing &&
    'y' in thing &&
    'width' in thing &&
    'height' in thing &&
    'color' in thing
  )
}

const Canvas = ({ tracks, cursor }: { tracks: Track[], cursor: number }) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tracks.forEach(track => {
      track.elements.forEach(element => {
        if (cursor >= element.start && cursor <= element.start + element.duration) {
          if (isRect(element)) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height)
          }
        }
      });
    });
  });

  return (
    <div className={styles.canvasContainer}>
      <canvas
        className={styles.canvas} 
        width={1600}
        height={900}
        ref={canvasRef}
      />
    </div>
  );
};

export default Canvas;
