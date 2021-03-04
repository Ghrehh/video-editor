import React, { useEffect, useRef, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import tune from './tune.m4a';
import png from './png.png';
import dog1 from './dog1.jpeg';
import dog2 from './dog2.jpeg';

function App() {
  const [currentText, setCurrentText] = useState('');
  const [texts, setTexts] = useState<string[]>([]);
  const ffmpeg = createFFmpeg({ log: true });
  const [videoSrc, setVideoSrc] = useState('');

  const handleSubmit = () => {
    setTexts(texts.concat([currentText]));
    setCurrentText('');
  }

  const handleRender = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.font = '48px serif';
    ctx.fillStyle = "#ff0000";

    const urls: string[] = [];

    texts.forEach(text => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(text, 10, 50);
      urls.push(canvas.toDataURL());
    })

    urls.forEach(value => {
      console.log(value);
      const image = document.createElement('img');
      image.src = value;
      document.body.appendChild(image);
    })
    perform(urls);


  }

  const perform = async (values: string[]) => {
    await ffmpeg.load();
    const filePromises: Promise<Uint8Array>[] = values.map(value => {
      return fetchFile(value);
    });

    const files = await Promise.all(filePromises);
    files.forEach((file, index) => {
      ffmpeg.FS('writeFile', `${index}.png`, file);
    })
    ffmpeg.FS('writeFile', 'tune.m4a', await fetchFile(tune));
    const command = '-framerate 1 -pattern_type glob -i *.png -i tune.m4a -c:v libx264 -c:a copy -b:a 192k -pix_fmt yuv420p test.mp4'.split(' ');
    await ffmpeg.run(...command);
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  }

  return (
    <>
      <input value={currentText} onChange={e => setCurrentText(e.target.value)} />
      <button onClick={handleSubmit}>Add</button>
      <br />
      <br />
      <ol>
        {texts.map(text => (
          <li>{text}</li>
        ))}
      </ol>
      <button onClick={handleRender}>Render</button>

      <video controls src={videoSrc} />
    </>
  );
}

export default App;
