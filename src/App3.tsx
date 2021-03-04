import React, { useEffect, useRef, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import vid from './quick.mov';
import tune from './tune.m4a';
import dog1 from './dog1.jpeg';
import dog2 from './dog2.jpeg';
import song from './wow.mp3';

function App() {
  const vidRef: React.RefObject<HTMLVideoElement> = useRef(null);
  const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
  const ffmpeg = createFFmpeg({ log: true });
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const perform = async () => {
      await ffmpeg.load();
      ffmpeg.FS('writeFile', 'vid.mov', await fetchFile(vid));
      ffmpeg.FS('writeFile', 'tune.m4a', await fetchFile(tune));
      await ffmpeg.run('-i', 'vid.mov', '-i', 'tune.m4a', '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', 'test.mp4');
      const data = ffmpeg.FS('readFile', 'test.mp4');
      setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
    }

      perform();
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
      <video controls src={videoSrc} />
      <canvas />
    </>
  );
}

export default App;
