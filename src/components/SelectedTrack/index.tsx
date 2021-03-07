import React, { useRef, useEffect } from 'react';
import { Track } from 'types/Track';
import { Rect, isRect } from 'types/Rect';
import { Text, isText } from 'types/Text';
import styles from './styles.module.css';

interface SelectedTrackInterface {
  track: Track;
  setTrack: (n: Track) => void;
}

const SelectedTrack = ({ track, setTrack }: SelectedTrackInterface) => {
  const element = track.elements[0];

  const num = (inputString: string): number => {
    return isNaN(Number(inputString)) ? 0 : Number(inputString);
  }

  const handleUpdate = (field: string, value: string) => {
    const trackCopy = {...track};
    const elementCopy = trackCopy.elements[0];
    if (isRect(elementCopy)) {
      switch(field) {
        case 'x': elementCopy.x = num(value); break;
        case 'y': elementCopy.y = num(value); break;
        case 'width': elementCopy.width = num(value); break;
        case 'height': elementCopy.height = num(value); break;
        case 'color': elementCopy.color = value; break;
      }
    }

    if (isText(elementCopy)) {
      switch(field) {
        case 'x': elementCopy.x = num(value); break;
        case 'y': elementCopy.y = num(value); break;
        case 'font': elementCopy.font = value; break;
        case 'content': elementCopy.content = value; break;
        case 'color': elementCopy.color = value; break;
      }
    }

    switch(field) {
      case 'duration': elementCopy.duration = num(value); break;
      case 'start': elementCopy.start = num(value); break;
    }

    setTrack(trackCopy);
  }

  if (isRect(element)) {
    return (
      <>
        <label>
          x <input value={element.x} onChange={e => handleUpdate('x', e.target.value)} />
        </label>
        <label>
          y <input value={element.y} onChange={e => handleUpdate('y', e.target.value)} />
        </label>
        <label>
          width <input value={element.width} onChange={e => handleUpdate('width', e.target.value)} />
        </label>
        <label>
          height <input value={element.height} onChange={e => handleUpdate('height', e.target.value)} />
        </label>
        <label>
          color <input value={element.color} onChange={e => handleUpdate('color', e.target.value)} />
        </label>
        <label>
          start <input value={element.start} onChange={e => handleUpdate('start', e.target.value)} />
        </label>
        <label>
          duration <input value={element.duration} onChange={e => handleUpdate('duration', e.target.value)} />
        </label>
      </>
    )
  }

  if (isText(element)) {
    return (
      <>
        <label>
          x <input value={element.x} onChange={e => handleUpdate('x', e.target.value)} />
        </label>
        <label>
          y <input value={element.y} onChange={e => handleUpdate('y', e.target.value)} />
        </label>
        <label>
          font <input value={element.font} onChange={e => handleUpdate('font', e.target.value)} />
        </label>
        <label>
          content <input value={element.content} onChange={e => handleUpdate('content', e.target.value)} />
        </label>
        <label>
          color <input value={element.color} onChange={e => handleUpdate('color', e.target.value)} />
        </label>
        <label>
          start <input value={element.start} onChange={e => handleUpdate('start', e.target.value)} />
        </label>
        <label>
          duration <input value={element.duration} onChange={e => handleUpdate('duration', e.target.value)} />
        </label>
      </>
    )
  }

  return null;
};

export default SelectedTrack;
