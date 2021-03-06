import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Canvas from 'components/Canvas';
import Timeline from 'components/Timeline';
import drawTracks from 'lib/canvas'; 
import render from 'lib/render';
import { Track } from 'types/Track';

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [rendering, setRendering] = useState(false);
  const [cursor, setCursor] = useState(0);

  const [tracks, setTracks] = useState<Track[]>([
    {
      name: 'Video',
      elements: [
        {
          name: 'Rect',
          start: 0,
          duration: 200,
          identifier: 'Rect',
          x: 10,
          y: 10,
          width: 400,
          height: 60,
          color: 'red'
        }
      ]
    },
    {
      name: 'Video',
      elements: [
        {
          name: 'Rect',
          start: 100,
          duration: 200,
          identifier: 'Rect',
          x: 25,
          y: 25,
          width: 40,
          height: 60,
          color: 'blue'
        }
      ]
    },
    {
      name: 'Video',
      elements: [
        {
          identifier: 'Text',
          name: 'text',
          start: 50,
          duration: 200,
          x: 100,
          y: 100,
          content: 'I am some text',
          font: '48px serif',
          color: 'green'
        }
      ]
    },
  ]);

  const handleRender = () => {
    setRendering(true);
    const go = () => {
      const canvas = document.createElement('canvas');
      canvas.width= 1600;
      canvas.height = 900;
      const urls: string[] = [];

      for (let i = 0; i < 300; i++) {
        drawTracks(canvas, i, tracks);
        urls.push(canvas.toDataURL());
      }

      /*
      urls.forEach(value => {
        const image = document.createElement('img');
        image.src = value;
        document.body.appendChild(image);
      })
      */
      render(urls).then(videoUrl => {
        setRendering(false)
        setVideoSrc(videoUrl);
      });
    }

    // called with a slight delay as toDataUrl seems to block everything else;
    setTimeout(go, 1);
  }

  if (videoSrc !== '') {
    return <video style={{ width: '100%' }} controls src={videoSrc} />
  }

  if (rendering) {
    return (
      <p>rendering</p>
    )
  }

  return (
    <>
      <Canvas  tracks={tracks} cursor={cursor} />
      <Timeline setTracks={setTracks} tracks={tracks} cursor={cursor} setCursor={setCursor}/>
      <button onClick={handleRender}>Render</button>
    </>
  );
}

export default App;
