import React, { memo } from 'react';
import { connect } from 'react-redux';
import { editNote as editNoteServer, 
    removeNote as removeNoteServer 
} from '../../models/AppModel';
import {
    editNoteAction,
    removeNoteAction
} from '../../store/actions';

const Note = ({
    noteName,
    noteTime,
    noteId,
    dayId,
    editNoteDispatch,
    removeNoteDispatch
}) => {
    const editNote = async () => {
        let newNoteName = prompt('Введите фамилию пациента', noteName);
        if (!newNoteName) return;
        newNoteName = newNoteName.trim();
        if (!newNoteName || newNoteName === noteName) return;
        const info = await editNoteServer({ dayId, noteId, newNoteName });
        console.log(info);
        editNoteDispatch({ dayId, noteId, newNoteName });
    };

    const removeNote = async () => {
        if (noteName) {    
            // eslint-disable-next-line no-restricted-globals
            if (confirm(`Пациент '${noteName}' будет удален из расписания. Продолжить?`)) {
                const info = await removeNoteServer({ dayId, noteId });
                console.log(info);
                removeNoteDispatch({ dayId, noteId });
            }
        }
    };

    return (
        <div className="card-task">
            <div className="card-task-text">
                <span className="card-task-time">{noteTime}</span> 
                {noteName && <span>{noteName}</span>}
            </div>
            <div className="card-task-icons">
                <div className="card-task-icons-first-row">
                    <span 
                        className="card-task-icon card-task-icon-edit"
                        onClick={editNote}
                    >
                    </span>
                </div>
                <div className="card-task-icons-second-row">
                    <span 
                        className="card-task-icon card-task-icon-delete"
                        onClick={removeNote}
                    >
                    </span>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = dispatch =>({
    editNoteDispatch: ({ dayId, noteId, newNoteName }) =>
        dispatch(editNoteAction({ dayId, noteId, newNoteName })),
    removeNoteDispatch: ({ dayId, noteId }) => 
        dispatch(removeNoteAction({ dayId, noteId }))
});

export default connect(
    null, 
    mapDispatchToProps
)(memo(Note));