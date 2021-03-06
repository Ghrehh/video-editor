export interface Text {
  identifier: 'Text';
  name: string;
  start: number;
  duration: number;
  x: number;
  y: number;
  content: string;
  font: string;
  color: string;
}

export const isText = (thing: any): thing is Text => {
  return (
    typeof thing === 'object' &&
    'identifier' in thing &&
    thing.identifier === 'Text'
  )
}
