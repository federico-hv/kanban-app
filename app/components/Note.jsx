import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteSource = {
  beginDrag(props) {
    return {
      id: props.id
    };
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      console.log('NOTES: ', sourceId, targetId);
      targetProps.onMove({sourceId, targetId});
    }
  }
};

@DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging       : monitor.isDragging() // map isDragging() state to isDragging prop
}))

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))


export default class Note extends React.Component {
  static propTypes = {
    task             : React.PropTypes.string,
    onEdit           : React.PropTypes.func, //This is a callback
    onDelete         : React.PropTypes.func,
    children         : React.PropTypes.element, //Note has only one child which will be the Editable component, thus the element type
    connectDragSource: React.PropTypes.func,
    connectDropTarget: React.PropTypes.func,
    isDragging       : React.PropTypes.func,
    id               : React.PropTypes.string,
    onMove           : React.PropTypes.func
  };

  constructor(props){
    super(props);
    this.finishEdit = this.finishEdit.bind(this);
    this.checkEnter = this.checkEnter.bind(this);
    this.edit       = this.edit.bind(this);
    this.renderEdit = this.renderEdit.bind(this);
    this.renderTask = this.renderTask.bind(this);

    this.state = {
      editing: false
    };
  }

  render() {
    const {connectDragSource, connectDropTarget, isDragging,
    onMove, id, ...props} = this.props;

    return connectDragSource(connectDropTarget(
      <li style={{
        opacity: isDragging ? 0 : 1
      }} {...props}>{props.children}</li>
    ));
  }

  renderEdit() {
    return (
      <input type="text"
        autoFocus={true}
        defaultValue={this.props.task}
        onBlur={this.finishEdit}
        onKeyPress={this.checkEnter} />
    );
  }

  renderTask() {
    const onDelete = this.props.onDelete;

    return (
      <div onClick={this.edit}>
        <span className="task">{this.props.task}</span>
        {onDelete ? this.renderDelete() : null }
      </div>
    );
  }

  renderDelete() {
    return <button className="delete" onClick={this.props.onDelete}>x</button>;
  }

  edit() {
    this.setState({
      editing: true
    });
  }

  checkEnter(e) {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  }

  finishEdit(e) {
    this.props.onEdit(e.target.value);

    this.setState({
      editing: false
    });
  }
}
