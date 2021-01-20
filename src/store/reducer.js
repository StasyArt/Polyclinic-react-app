import {
    DOWNLOAD_DAYS,
    ADD_DAY,
    EDIT_NOTE,
    REMOVE_NOTE,
    REMOVE_DAY,
} from './actions';

const initialState = {
    days: []
};

export default function reducer(state = initialState, { type, payload }) {
    switch (type) {
        case DOWNLOAD_DAYS:
            return {
                ...state,
                days: payload
            };

        case ADD_DAY:
            return {
                ...state,
                days: [
                    ...state.days,
                    {
                        dayDate: payload.dayDate,
                        dayChange: payload.dayChange,
                        notes: payload.notes
                    }
                ]
            };

        case REMOVE_DAY:
            const removedDay = state.days[payload];
            const days = state.days.filter(
                day => day !== removedDay
            );

            return {
                ...state,
                days: days
            };

        case EDIT_NOTE:
            return {
                ...state,
                days: state.days.map(
                    (day, index) => index !== payload.dayId
                        ? { ...day }
                        : {
                            ...day,
                            notes: day.notes.map(
                                (note, noteIndex) => {
                                    if(noteIndex === payload.noteId) {
                                        note.noteName = payload.newNoteName;
                                    }
                                    return note;
                                }
                            ) 
                        } 
                )
            };

        case REMOVE_NOTE:
            const notes = state.days[payload.dayId].notes.map(
                (note, index) => {
                    if (index === payload.noteId) {
                        note.noteName = '';    
                    }
                    return note;
                }
            );

            return {
                ...state,
                days: state.days.map(
                    (day, index) => index !== payload.dayId 
                    ? {
                        ...day
                    }
                    : { 
                        ...day,
                        notes 
                    }
                )
            };  
            
        default:
            return state;    
    }
}