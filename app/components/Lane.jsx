/*
   - Subs and Unsubs the component from NoteStore
   - Imports NoteActions to trigger events
   - Imports lane style
 */
import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';
import '../lane.css';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(!targetProps.lane.notes.length) {
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

const laneSource = {
  beginDrag(props) {
    return {
      id: props.lane.id
    };
  },
  isDragging(props, monitor) {
    return props.lane.id === monitor.getItem().id;
  }
};

const laneTarget = {
  hover(targetProps, monitor) {
    const targetId    = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId    = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

//Note stuff
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

//Lane stuff
@DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging       : monitor.isDragging() // map isDragging() state to isDragging prop
}))

@DropTarget(ItemTypes.LANE, laneTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

export default class Lane extends React.Component {
  static propTypes = {
    lane             : React.PropTypes.object,
    connectDropTarget: React.PropTypes.func,
    connectDragSource: React.PropTypes.func,
    isDragging       : React.PropTypes.bool
  };

  constructor(props) {
    super(props);

    const id = props.lane.id;

    this.addNote    = this.addNote.bind(this, id);
    this.deleteNote = this.deleteNote.bind(this, id);
    this.editName   = this.editName.bind(this, id);
  }

  render() {
    const {connectDragSource, connectDropTarget, isDragging, lane, ...props} = this.props;

    return connectDragSource(connectDropTarget(
      <div style={{
        opacity: isDragging ? 0 : 1
      }} {...props}> {/* Spread operator */}
        <div className="lane-header">
          <Editable className="lane-name" value={lane.name}
            onEdit={this.editName} />
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            items: () => NoteStore.get(lane.notes)
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    ));
  }

  addNote(laneId) {
    NoteActions.create({task: 'New task'});
    LaneActions.attachToLane({laneId});
  }

  editNote(id, task) {
    NoteActions.update({id, task});
  }

  deleteNote(laneId, noteId) {
    LaneActions.detachFromLane({laneId, noteId});
    NoteActions.delete(noteId);
  }

  editName(id, name) {
    if(name) {
      LaneActions.update({id, name});
    }
    else {
      LaneActions.delete(id);
    }
  }

}
