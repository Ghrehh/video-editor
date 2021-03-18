import React, { useRef, useEffect } from 'react';
import { Track } from 'types/Track';
import render from 'lib/canvas';
import styles from './styles.module.css';

interface CanvasInterface {
  tracks: Track[];
  cursor: number;
  selectedTrack: number;
  changeSelectedTrack: (n: Track) => void;
}

const Canvas = ({ tracks, cursor, selectedTrack, changeSelectedTrack }: CanvasInterface) => {
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    render(canvas, cursor, tracks, selectedTrack);
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
