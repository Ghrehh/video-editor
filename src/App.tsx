import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Canvas from 'components/Canvas';
import Timeline from 'components/Timeline';
import SelectedTrack from 'components/SelectedTrack';
import drawTracks from 'lib/canvas'; 
import render from 'lib/render';
import tune from 'tune.m4a';
import { Track } from 'types/Track';

const num = (inputString: string): number => {
  return isNaN(Number(inputString)) ? 0 : Number(inputString);
}

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [rendering, setRendering] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [frameRate, setFrameRate] = useState(25);
  const [audioUrl, setAudioUrl] = useState('');
  const [tracks, setTracks] = useState<Track[]>([
    {
      name: 'Rect',
      elements: [
        {
          name: 'Rect',
          start: 0,
          duration: 1000,
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
      name: 'Rect',
      elements: [
        {
          name: 'Rect',
          start: 1000,
          duration: 2000,
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
      name: 'Text',
      elements: [
        {
          identifier: 'Text',
          name: 'text',
          start: 500,
          duration: 500,
          x: 100,
          y: 100,
          content: 'I am some text',
          font: '48px serif',
          color: 'green'
        }
      ]
    },
    {
      name: 'Text',
      elements: [
        {
          identifier: 'Text',
          name: 'text',
          start: 3000,
          duration: 700,
          x: 300,
          y: 300,
          content: 'I should be last',
          font: '48px serif',
          color: 'green'
        }
      ]
    },
  ]);

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

  const handleRender = () => {
    setRendering(true);
    const go = () => {
      const canvas = document.createElement('canvas');
      canvas.width= 800;
      canvas.height = 450;
      const urls: string[] = [];

      for (let i = 0; i < getProjectLength(); i+= 1000 / frameRate) {
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
      render(urls, frameRate, audioUrl).then(videoUrl => {
        setRendering(false)
        setVideoSrc(videoUrl);
      });
    }

    // called with a slight delay as toDataUrl seems to block everything else;
    setTimeout(go, 1);
  }

  const updateTrack = (trackId: number, updatedTrack: Track) => {
    const tracksCopy = [...tracks];
    tracksCopy[trackId] = updatedTrack;
    setTracks(tracksCopy);
  }

  const handleAddText = () => {
    const tracksCopy = [...tracks];
    tracksCopy.push(
      {
        name: 'Text',
        elements: [
          {
            identifier: 'Text',
            name: 'text',
            start: 0,
            duration: 2000,
            x: 100,
            y: 100,
            content: 'I am some text',
            font: '48px serif',
            color: 'green'
          }
        ]
      }
    )
    setTracks(tracksCopy);
  }

  useEffect(() => {
    const audio = document.createElement('audio');
    audio.ondurationchange = () => {
      if (isNaN(audio.duration) || audio.duration === Infinity) return;
      //otherwise
      console.log(audio.duration);
      const tracksCopy = [...tracks];
      tracksCopy.push(
        {
          name: 'Audio',
          elements: [
            {
              identifier: 'Audio',
              name: 'song',
              start: 0,
              duration: Math.round(audio.duration * 1000),
              url: tune,
              type: 'mp3'
            }
          ]
        }
      )
      setTracks(tracksCopy);
      setAudioUrl(tune);
    }
    audio.src = tune;

  }, [])

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    audio.ondurationchange = () => {
      if (isNaN(audio.duration) || audio.duration === Infinity) return;
      const tracksCopy = [...tracks];
      tracksCopy.push(
        {
          name: 'Audio',
          elements: [
            {
              identifier: 'Audio',
              name: 'song',
              start: 0,
              duration: Math.round(audio.duration * 1000),
              url,
              type: 'mp3'
            }
          ]
        }
      )
      setTracks(tracksCopy);
      setAudioUrl(url);
    }
    audio.src = url;
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
      <label>
        Frame Rate
        <input value={frameRate} onChange={e => setFrameRate(num(e.target.value))} />
      </label>
      <label>
        Upload Audio (only MP3s will work for now)
        <input type="file" id="input" onChange={e => handleFileUpload(e.target.files)}/>
      </label>
      <Canvas tracks={tracks} cursor={cursor} />
      {tracks[selectedTrack] && <SelectedTrack setTrack={(updatedTrack: Track) => updateTrack(selectedTrack, updatedTrack)} track={tracks[selectedTrack]}
      />}
      <Timeline
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        setTracks={setTracks}
        tracks={tracks}
        cursor={cursor}
        setCursor={setCursor}
        frameRate={frameRate}
      />
      <button onClick={handleAddText}>Add Text</button>
      <button onClick={handleRender}>Render</button>
    </>
  );
}

export default App;
