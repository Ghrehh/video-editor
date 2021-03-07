import React, { useRef, useEffect } from 'react';
import { Track } from 'types/Track';
import render from 'lib/canvas';
import styles from './styles.module.css';

const Canvas = ({ tracks, cursor }: { tracks: Track[], cursor: number }) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    render(canvas, cursor, tracks);
  });

  return (
    <div className={styles.canvasContainer}>
      <canvas
        className={styles.canvas} 
        width={800}
        height={450}
        ref={canvasRef}
      />
    </div>
  );
};

export default Canvas;
