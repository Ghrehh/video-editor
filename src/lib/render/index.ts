import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import tune from 'tune.m4a';

const ffmpeg = createFFmpeg({ log: true });

const createDemuxer = (count: number): string => {
  let text = '';
  for (let i = 0; i < count; i++) {
    text += `file '${i}.png'\n`
    text += 'duration 0.041\n'
  }
  text += `file '${count - 1}.png'`

  const blob = new Blob([text], {type: 'text/plain'})
  return URL.createObjectURL(blob);
}

const render = async (values: string[]): Promise<string> => {
  await ffmpeg.load();
  const filePromises: Promise<Uint8Array>[] = values.map(value => fetchFile(value));
  const files = await Promise.all(filePromises);
  files.forEach((file, index) => ffmpeg.FS('writeFile', `${index}.png`, file))
  const demuxer = createDemuxer(files.length);
  ffmpeg.FS('writeFile', 'demuxer.txt', await fetchFile(demuxer));
  ffmpeg.FS('writeFile', 'tune.m4a', await fetchFile(tune));
  const command = '-f concat -i demuxer.txt -i tune.m4a -c:v libx264 -c:a copy -b:a 192k -pix_fmt yuv420p test.mp4'.split(' ');
  await ffmpeg.run(...command);
  const data = ffmpeg.FS('readFile', 'test.mp4');
  return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

export default render;
