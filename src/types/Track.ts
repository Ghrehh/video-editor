import { Rect } from 'types/Rect';
import { Text } from 'types/Text';
import { Audio } from 'types/Audio';

export interface Track {
  name: string;
  elements: (Rect|Text|Audio)[];
}
