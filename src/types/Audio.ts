export interface Audio {
  identifier: 'Audio';
  name: string;
  start: number;
  duration: number;
  url: string;
}

export const isAudio = (thing: any): thing is Audio => {
  return (
    typeof thing === 'object' &&
    'identifier' in thing &&
    thing.identifier === 'Audio'
  )
}
