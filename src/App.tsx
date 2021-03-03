import React, { useEffect, useRef } from 'react';
import vid from './test.mp4';
import dog1 from './dog1.jpeg';
import dog2 from './dog2.jpeg';

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
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

  const record = () => {
    const canvas = canvasRef.current;
    if (!canvas) return alert('oh no!');

    const chunks: Blob[] = [];
    const stream = canvas.captureStream(25 /*fps*/);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp9",
      videoBitsPerSecond: 2500000
    });

    mediaRecorder.start();

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

    setTimeout(() => mediaRecorder.stop(), 10000);

  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) playCanvas(canvas, 'green');

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
      <canvas ref={canvasRef}/>
      <button onClick={record}>RECORD</button>
      <video controls ref={vidRef} />
    </>
  );
}

export default App;
