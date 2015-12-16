/*
    - Store is imported
    - Actions are imported to call them on certain events
 */
import AltContainer from 'alt-container'; //Subscribes and unsubscribes the component to the LaneStore automatically
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

/**
 * Decorators are calls to higher order functions that return the function they received as parameter with added functionality
 */
@DragDropContext(HTML5Backend)
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
