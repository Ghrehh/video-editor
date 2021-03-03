import React, { useEffect, useRef } from 'react';
import vid from './test.mp4';
import dog1 from './dog1.jpeg';
import dog2 from './dog2.jpeg';
import song from './wow.mp3';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

interface CanvasMediaStream extends MediaStreamTrack {
  requestFrame(): void
}

const isCanvasMediaStream = (stream: CanvasMediaStream | MediaStreamTrack): stream is CanvasMediaStream => {
  return (stream as CanvasMediaStream).requestFrame !== undefined;
}

function App() {

  const vidRef: React.RefObject<HTMLVideoElement> = useRef(null);
  const canvasRef: React.RefObject<CanvasElement> = useRef(null);

  const playCanvas = (canvas: CanvasElement, color: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 150, 100);

    setTimeout(() => playCanvas(canvas, color === 'red' ? 'green': 'red'), 1000);
  }

  const setCanvas = (color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return alert('oh no!');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(10, 10, 150, 100);
  }

  const record = () => {
    const canvas = canvasRef.current;
    if (!canvas) return alert('oh no!');

    const chunks: Blob[] = [];
    const stream = canvas.captureStream(0);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
      videoBitsPerSecond: 2500000
    });


    mediaRecorder.ondataavailable = (event) => {
      console.log('event');
      chunks.push(event.data);
    }

    mediaRecorder.onstop = function (event) {
      console.log('stopped');
      console.log(chunks);
        var blob = new Blob(chunks, {
            type: "video/webm"
        });
        const url = URL.createObjectURL(blob);
      const current = vidRef.current;
      if (current) {
        current.src = url;
      }
    }

    mediaRecorder.start();

    const track = stream.getTracks()[0]

    if (!track) return;
    const requestFrame = () => {
      if (isCanvasMediaStream(track)) {
        track.requestFrame();
      }
    }
    setTimeout(() => {
      setCanvas('red')
      requestFrame()
    }, 500);
    setTimeout(() => {
      setCanvas('green')
      requestFrame()
    }, 1000);
    setTimeout(() => {
      setCanvas('red')
      requestFrame()
    }, 1500);
    setTimeout(() => mediaRecorder.stop(), 2000);


  }

  useEffect(() => {
    console.log(song);
    const canvas = canvasRef.current;
    //if (canvas) playCanvas(canvas, 'green');

    fetch(song).then(r => {
      return r.blob()
    }).then(audioblob => {
      fetch(vid).then(r => {
        return r.blob()
      }).then(videoblob => {
        const current = vidRef.current;
        if (current) {
          const part = [videoblob, videoblob];
          const newBlob = new Blob(part, {
            type: "video/webm"
          });
          current.src = URL.createObjectURL(newBlob);
        }
      });
    })

    /*
    fetch(vid).then(r => {
      return r.blob()
    }).then(blob => {
      const current = vidRef.current;
      if (current) {
        current.src = URL.createObjectURL(blob);
      }
    });*/
  }, []);

  return (
    <>
      <audio controls src={song} />
      <canvas ref={canvasRef}/>
      <button onClick={record}>RECORD</button>
      <video controls ref={vidRef} />
    </>
  );
}

export default App;
