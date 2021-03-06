import { Rect } from 'types/Rect';
import { Text } from 'types/Text';

export interface Track {
  name: string;
  elements: (Rect|Text)[];
}
