export interface Rect {
  identifier: 'Rect';
  name: string;
  start: number;
  duration: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const isRect = (thing: any): thing is Rect => {
  return (
    typeof thing === 'object' &&
    'identifier' in thing &&
    thing.identifier === 'Rect'
  );
}
