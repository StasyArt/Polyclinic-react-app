import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { addDay as addDayServer,
    getDays as getDaysServer
} from '../../models/AppModel.js';
import {
    addDayAction,
    downloadDaysAction
} from '../../store/actions';
import Day from '../Day/Day';
import './App.css';

function makeInitnotesFromHourBounds(leftBound, rightBound) {
    const N = (rightBound - leftBound) * 60 / 20 + 1;
    let notesArr = [];

    for (let i = 0; i < N; i++) {
        const minutes = (leftBound * 60 + i * 20);
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        notesArr[i] = {noteName: '', noteTime: `${hour}:${minute ? minute : '00'}`};
    }
    return notesArr;
}

class App extends PureComponent {
    state = {
        isInputShown: false,
        dateInputValue: '',
        changeInputValue: 'day'
    };

    async componentDidMount() {
        const days = await getDaysServer();
        this.props.downloadDaysDispatch(days);
    }

    showInput = () => this.setState({ isInputShown: true });

    onDateInputChange = ({ target: { value } }) => this.setState({
        dateInputValue: value
    });

    onChangeInputChange = ({ target: { value } }) => this.setState({
        changeInputValue: value
    });

    createDay = async () => {
        if (this.state.dateInputValue && this.state.changeInputValue) {
            let bound = [];
            let change = '';
            if (this.state.changeInputValue === 'day') {
                bound = [8, 14];
                change = 'Первая смена';
            }
            else if (this.state.changeInputValue === 'evening') {
                bound = [14, 20];
                change = 'Вторая смена';
            }
            else {
                bound = [8, 14];
                change = 'Первая смена';
            }

            let tmpArr = makeInitnotesFromHourBounds(bound[0], bound[1]);

            const info = await addDayServer({
                dayDate: this.state.dateInputValue,
                dayChange: change,
                notes: [...tmpArr]
            });
            console.log(info);

            this.props.addDayDispatch({ 
                dayDate: this.state.dateInputValue, 
                dayChange: change,
                notes: [...tmpArr]
             });
        }

        this.setState({
            isInputShown: false,
            dateInputValue: '',
            changeInputValue: 'day'
        })
    }

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.setState({
                isInputShown: false,
                dateInputValue: '',
                changeInputValue: 'day'
            });
            
            return;
        }
    };

    render() {
        const { isInputShown, dateInputValue, changeInputValue } = this.state;
        const { days } = this.props;

        return (
            <Fragment>
                <header id="main-header">
                    <div className="header-logo"></div>
                    <div className="header-name">ИМА Вижн. Центр ортокератологии, контроля миопии и сложной коррекции зрения.</div>
                    <div className="header-space"></div>
                    <div className="header-address">г. Москва, Ленинский проспект, дом 2а, этаж 4а</div>
                </header>
                <div className="main-flex">
                    <div className="doctor-box">
                        <div className="doctor-photo"></div>
                        <div className="doctor-name">Вержанская Татьяна Юрьевна</div>
                        <div className="doctor-text">Врач-офтальмолог высшей категории, 
                            <br />кандидат медицинских наук , 
                            <br />Член Европейской Академии ортокератологии и контроля миопии
                        </div>
                    </div>
                    <main id="main-content-container">
                        <div id="main-content">
                            {days.map((day, index) => (
                                <Day 
                                    dayDate={day.dayDate}
                                    dayChange={day.dayChange}
                                    dayId={index}
                                    notes={day.notes}
                                    key={`list${index}`}
                                />
                            ))}    
                            <div className="element-container">
                                <div className="card card-add-list-container">         
                                    {!isInputShown && (
                                        <span id="add-list-button"
                                            className="card-add-list-button" 
                                            onClick={this.showInput}
                                        >
                                            Добавить день...
                                        </span>
                                    )}
                                    {isInputShown && (
                                        <Fragment>
                                            <label htmlFor="add-list-input-date">Введите дату: </label>
                                            <input
                                                type="date"
                                                id="add-list-input-date"
                                                className="card-add-list-input"
                                                value={dateInputValue}
                                                onChange={this.onDateInputChange}
                                                onKeyDown={this.onKeyDown}
                                            />
                                            
                                            <label htmlFor="add-list-input-change">Выберите смену: </label>
                                            <select
                                                id="add-list-input-change"
                                                className="card-add-list-input"
                                                value={changeInputValue}
                                                onChange={this.onChangeInputChange}
                                                onKeyDown={this.onKeyDown}
                                                size="2"
                                            >
                                                <option value="day">Первая смена</option>
                                                <option value="evening">Вторая смена</option>
                                            </select>
                                            <span id="create-list-button"
                                                className="card-create-list-button" 
                                                onClick={this.createDay}
                                            >
                                                Создать
                                            </span>
                                        </Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = ({ days }) => ({ days });

const mapDispatchToProps = dispatch => ({
    addDayDispatch: ({ dayDate, dayChange, notes }) => 
        dispatch(addDayAction({ dayDate, dayChange, notes })),
    downloadDaysDispatch: (days) => 
        dispatch(downloadDaysAction(days))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (App);