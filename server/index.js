const express = require('express');
const app = express();
const { readData, writeData } = require('./utils');
const port = 4321;
const hostname = 'localhost';

let days = [];

// Middleware разрешения CORS-запросов
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Middleware для логирования запросов 
app.use((request, response, next) => {
    console.log(
        (new Date()).toISOString(),
        request.method,
        request.originalUrl
    );
    next();
});

// Middleware для правильного представления request.body
app.use(express.json());

app.options('/*', (request, response) => {
    response.statusCode = 200;
    response.send('OK');
});

app.get('/days', async (request, response) => {
    days = await readData();
    response.setHeader('Content-Type', 'application/json');
    response.json(days);
});

app.post('/days', async (request, response) => {
    days.push(request.body);
    await writeData(days);

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({
        info: `Day '${request.body.dayDate}' was successfully added`
    });
});

app.patch('/days/:dayId/notes/:noteId', async (request, response) => {
    const { newNoteName } = request.body;
    const dayId = Number(request.params.dayId);
    const noteId = Number(request.params.noteId);

    let oldNoteName = days[dayId].notes[noteId].noteName;
    days[dayId].notes[noteId].noteName = newNoteName;
    await writeData(days);

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({
        info: `Patient '${oldNoteName}' was successfully changed in day
        '${days[dayId].dayDate}' to '${newNoteName}'`
    });
});

app.delete('/days/:dayId', async (request, response) => {
    const dayId = Number(request.params.dayId);

    for (let i = 0; i < days[dayId].length; i++) {
        if (days[dayId].notes[i].noteName) {
            response.setHeader('Content-Type', 'application/json');
            response.status(403).json({
                error: `Can't delete non-empty day '${days[dayId].dayDate}'`
            });
        }
    }

    const removedDay = days[dayId];
    days = days.filter(
        (day, index) => index !== dayId
    );
    await writeData(days);

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({
        info: `Day '${removedDay.dayDate}' was successfully deleted`
    });
});

app.delete('/days/:dayId/notes/:noteId', async (request, response) => {
    const dayId = Number(request.params.dayId);
    const noteId = Number(request.params.noteId);
    
    const removedNoteName = days[dayId].notes[noteId].noteName;
    days[dayId].notes = days[dayId].notes.map(
        (note, index) => {
            if (index === noteId) {
                note.noteName = '';    
            }
            return note;
        }
    );

    await writeData(days);
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({
        info: `Patient '${removedNoteName}' was successfully deleted from day
        '${days[dayId].dayDate}'`
    });
});

app.listen(port, hostname, (err) => {
    if (err) {
        console.error('Error: ', err);
    }
    console.log(`Server is working on ${hostname}:${port}`);
});