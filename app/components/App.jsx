import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';


export default class App extends React.Component {

  render() {
    return (
      <div>
        <button className="add-lane" onClick={this.addItem}>+</button>
        {/* This removes the need of pubsub to store */}
        <AltContainer
          stores={[LaneStore]}
          inject={{
            items: () => LaneStore.getState().lanes || []
          }}
        >
          <Lanes />
        </AltContainer>
      </div>
    );
  }

  addItem() {
    LaneActions.create({name: 'New lane'});
  }

};
