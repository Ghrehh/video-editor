import { Track } from 'types/Track';
import { isRect } from 'types/Rect';
import { isText } from 'types/Text';

const render = (
  canvas: HTMLCanvasElement,
  cursor: number,
  tracks: Track[]
) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tracks.forEach(track => {
      track.elements.forEach(element => {
        if (cursor >= element.start && cursor <= element.start + element.duration) {
          if (isRect(element)) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height)
          } else if (isText(element)) {
            ctx.fillStyle = element.color;
            ctx.font = element.font;
            ctx.fillText(element.content, element.x, element.y);
          }
        }
      });
    });
}

export default render
