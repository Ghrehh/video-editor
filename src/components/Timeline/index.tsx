import React from 'react';

interface TrackElement {
  name: string;
  start: number;
  duration: number;
}

interface Track {
  name: string;
  elements: TrackElement[];
}

class Timeline extends React.Component<{ tracks: Track[] }> {

  render() {
    return (
      <div>
        {this.props.tracks.map(track => {
          return (
            null
          )
        })}
      </div>
    );
  }
};

export default Timeline;
