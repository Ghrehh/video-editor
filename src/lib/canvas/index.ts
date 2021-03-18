import { Track } from 'types/Track';
import { isRect } from 'types/Rect';
import { isText } from 'types/Text';

const render = (
  canvas: HTMLCanvasElement,
  cursor: number,
  tracks: Track[],
  selectedTrack?: number
) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    tracks.forEach((track, i) => {
      track.elements.forEach(element => {
        if (cursor >= element.start && cursor <= element.start + element.duration) {
          if (isRect(element)) {
            ctx.fillStyle = element.color;
            ctx.fillRect(element.x, element.y, element.width, element.height)
            if (typeof selectedTrack === 'number' && selectedTrack === i) {
              ctx.setLineDash([4, 2]);
              ctx.lineDashOffset = 4
              ctx.strokeStyle = 'black';
              ctx.strokeRect(element.x - 4, element.y - 4, element.width + 8, element.height + 8);
            }
          } else if (isText(element)) {
            ctx.fillStyle = element.color;
            ctx.font = element.font;
            ctx.fillText(element.content, element.x, element.y);
            if (typeof selectedTrack === 'number' && selectedTrack === i) {
              ctx.setLineDash([4, 2]);
              ctx.lineDashOffset = 4
              ctx.strokeStyle = 'black';
              const {  width } = ctx.measureText(element.content);
              ctx.strokeRect(element.x - 4, element.y - 4, width + 8, 48 + 8);
            }
          }
        }
      });
    });
}

export default render
