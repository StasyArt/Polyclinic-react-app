const DOWNLOAD_DAYS = 'DOWNLOAD_DAYS';
const ADD_DAY = 'ADD_DAY';
const REMOVE_DAY = 'REMOVE_DAY';
const EDIT_NOTE = 'EDIT_NOTE';
const REMOVE_NOTE = 'REMOVE_NOTE';

const downloadDaysAction = (days) => ({
    type: DOWNLOAD_DAYS,
    payload: days
});

const addDayAction = ({ dayDate, dayChange, notes }) => ({
    type: ADD_DAY,
    payload: {
        dayDate,
        dayChange,
        notes
    }
});

const removeNotelistAction = dayId => ({
    type: REMOVE_DAY,
    payload: dayId
});

const editNoteAction = ({ dayId, noteId, newNoteName }) => ({
    type: EDIT_NOTE,
    payload: {
        dayId,
        noteId,
        newNoteName
    }
});

const removeNoteAction = ({ dayId, noteId }) => ({
    type: REMOVE_NOTE,
    payload: {
        dayId,
        noteId
    }
});

export {
    DOWNLOAD_DAYS,
    ADD_DAY,
    REMOVE_DAY,
    EDIT_NOTE,
    REMOVE_NOTE,
    downloadDaysAction,
    addDayAction,
    removeNotelistAction,
    editNoteAction,
    removeNoteAction
};
