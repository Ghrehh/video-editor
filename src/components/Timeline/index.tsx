import React, { useRef, useEffect, MouseEvent } from 'react';
import styles from './styles.module.css';
import { Track } from 'types/Track';

interface TimelineInterface {
  tracks: Track[];
  cursor: number;
  setCursor: (n: number) => void;
  setTracks: (n: Track[]) => void;
  selectedTrack: number;
  setSelectedTrack: (n: number) => void;
  frameRate: number;
}

const Timeline = ({
  tracks,
  cursor,
  setCursor,
  setTracks,
  selectedTrack,
  setSelectedTrack,
  frameRate
}: TimelineInterface) => {
  const trackControlsRef: React.RefObject<HTMLDivElement> = useRef(null);
  const tracksRef: React.RefObject<HTMLDivElement> = useRef(null);
  const cursorRef: React.RefObject<HTMLDivElement> = useRef(null);
  const cursorHandleRef: React.RefObject<HTMLDivElement> = useRef(null);

  const getProjectLength = () => {
    let longest = 0;
    tracks.forEach((track) => {
      track.elements.forEach((element) => {
        const length = element.start + element.duration;
        if (length > longest) longest = length;
      });
    })

    return longest;
  }

  useEffect(() => {
    const trackControlsContainer = trackControlsRef.current;
    const tracksContainer = tracksRef.current;
    const cursorHandle = cursorHandleRef.current;
    const cursor = cursorRef.current;
    if (!trackControlsContainer || !tracksContainer || !cursorHandle || !cursor) return;
    const trackControls = Array.from(trackControlsContainer.children)
    const tracks = Array.from(tracksContainer.children)

    trackControls.forEach((trackControl, i) => {
      const track = tracks[i];
      if (!track || !trackControl) return;
      if (!(track instanceof HTMLElement)) return;
      if (!(trackControl instanceof HTMLElement)) return;

      track.style.height = `${trackControl.getBoundingClientRect().height}px`
    })

    cursor.style.width = `${getProjectLength()}px`

    cursorHandle.style.height = '100%';
    cursorHandle.style.height = `${
      trackControlsContainer.getBoundingClientRect().height +
      cursorHandle.getBoundingClientRect().height
    }px`
  });

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
        <div ref={cursorRef} className={styles.cursor} onClick={handleCursorClick}>
          <div
            ref={cursorHandleRef}
            className={styles.handle}
            style={{ left: `${cursor}px` }}
          />
        </div>
        <div className={styles.tracks} ref={tracksRef}>
          {tracks.map((track, i) => {
            return (
              <div
                onClick={() => setSelectedTrack(i)}
                className={styles.track}
                style={{
                  border: i === selectedTrack ? '4px solid red' : 'none',
                  left: track.elements[0]?.start / frameRate,
                  width: track.elements[0]?.duration / frameRate
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
