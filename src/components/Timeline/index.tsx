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

const Timeline = ({ tracks }: { tracks: Track[] }) => {
  const trackControlsRef: React.RefObject<HTMLDivElement> = useRef(null);
  const tracksRef: React.RefObject<HTMLDivElement> = useRef(null);


  useEffect(() => {
    const trackControlsContainer = trackControlsRef.current;
    const tracksContainer = tracksRef.current;
    if (!trackControlsContainer || !tracksContainer) return;
    const trackControls = Array.from(trackControlsContainer.children)
    const tracks = Array.from(tracksContainer.children)

    trackControls.forEach((trackControl, i) => {
      const track = tracks[i];
      if (!track || !trackControl) return;
      if (!(track instanceof HTMLElement)) return;
      if (!(trackControl instanceof HTMLElement)) return;

      track.style.height = `${trackControl.getBoundingClientRect().height}px`
    })
  }, []);

  return (
    <div className={styles.timeline}>
      <div className={styles.rightColumn}>
        <div className={styles.headerEquivalent} />
        <div ref={trackControlsRef}>
          {tracks.map(track => {
            return (
              <div className={styles.trackControl}>
                {track.name}
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.leftColumn}>
        <div className={styles.header} />
        <div className={styles.tracks} ref={tracksRef}>
          {tracks.map(track => {
            return (
              <div
                className={styles.track}
                style={{
                  left: track.elements[0]?.start,
                  width: track.elements[0]?.duration
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
