import React from 'react';
import Note from './Note.jsx';

export default class Notes extends React.Component {

  //ES7 syntax -> Use with stage 0
  static propTypes = {
    items   : React.PropTypes.array,
    onEdit  : React.PropTypes.func,
    onDelete: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.renderNote = this.renderNote.bind(this);
  }

  render() {
    const notes = this.props.items;

    return <ul className="notes">{notes.map(this.renderNote)}</ul>;
  }

  renderNote(note) {
    return (
      <li className="note" key={note.id}>
        <Note
          task={note.task}
          onEdit={this.props.onEdit.bind(null, note.id)}
          onDelete={this.props.onDelete.bind(null, note.id)}/>
      </li>
    );
  }
}
