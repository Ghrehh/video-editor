import React, { useRef, useEffect, MouseEvent } from 'react';
import styles from './styles.module.css';
import { Track } from 'types/Track';

interface TimelineInterface {
  tracks: Track[];
  cursor: number;
  setCursor: (n: number) => void;
  setTracks: (n: any) => void;
}

const Timeline = ({ tracks, cursor, setCursor, setTracks }: TimelineInterface) => {
  const trackControlsRef: React.RefObject<HTMLDivElement> = useRef(null);
  const tracksRef: React.RefObject<HTMLDivElement> = useRef(null);
  const cursorHandleRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const trackControlsContainer = trackControlsRef.current;
    const tracksContainer = tracksRef.current;
    const cursorHandle = cursorHandleRef.current;
    if (!trackControlsContainer || !tracksContainer || !cursorHandle) return;
    const trackControls = Array.from(trackControlsContainer.children)
    const tracks = Array.from(tracksContainer.children)

    trackControls.forEach((trackControl, i) => {
      const track = tracks[i];
      if (!track || !trackControl) return;
      if (!(track instanceof HTMLElement)) return;
      if (!(trackControl instanceof HTMLElement)) return;

      track.style.height = `${trackControl.getBoundingClientRect().height}px`
    })

    cursorHandle.style.height = '100%';
    cursorHandle.style.height = `${
      trackControlsContainer.getBoundingClientRect().height +
      cursorHandle.getBoundingClientRect().height
    }px`
  }, []);

  const handleCursorClick = (e: MouseEvent) => {
    const target = e.target;
    console.log(e);
    if (target instanceof HTMLDivElement) {
      const location = e.clientX - target.getBoundingClientRect().left;
      if (location < 0) return setCursor(0);
      setCursor(location);
    }
  }
  
  const handleDelete = (trackToDelete: Track) => {
    setTracks(tracks.filter(track => track !== trackToDelete))
  }

  return (
    <div className={styles.timeline}>
      <div className={styles.rightColumn}>
        <div className={styles.cursorEquivalent} />
        <div ref={trackControlsRef}>
          {tracks.map((track) => {
            return (
              <div className={styles.trackControl}>
                {track.name}
                <br />
                <button onClick={() => handleDelete(track)}>Delete</button>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.leftColumn}>
        <div className={styles.cursor} onClick={handleCursorClick}>
          <div
            ref={cursorHandleRef}
            className={styles.handle}
            style={{ left: `${cursor}px` }}
          />
        </div>
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
