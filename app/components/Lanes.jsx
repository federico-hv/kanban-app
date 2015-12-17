import React from 'react';
import Lane from './Lane.jsx';
import LaneActions from '../actions/LaneActions';

export default class Lanes extends React.Component {
  static propTypes = {
    items: React.PropTypes.array
  };

  render() {
    const lanes = this.props.items;

    return <div className="lanes">{lanes.map(this.renderLane)}</div>;
  }

  renderLane(lane) {
    return <Lane onMove={LaneActions.moveLane} className="lane" key={lane.id} lane={lane} />;
  }
}
