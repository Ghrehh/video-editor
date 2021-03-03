- Any html media element like canvas, audio, video can have .captureStream
  called on it. This is good but for instance you can't run through an audio or
video track and get it into memory instantaneously, you need to sit through it.

- Blobs can be added and casted as webm, but there's no way to easily
  concatenate audio and video together.
