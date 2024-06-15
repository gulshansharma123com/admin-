import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const localizer = momentLocalizer(moment);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', type: 'number', width: 110 },
];

const rows = [
    { id: 1, name: 'John Doe', age: 35 },
    { id: 2, name: 'Jane Smith', age: 42 },
    { id: 3, name: 'Alice Johnson', age: 29 },
];

const chartData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
];

const events = [
    {
        id: 0,
        title: 'Board meeting',
        start: new Date(2023, 5, 20, 10, 0),
        end: new Date(2023, 5, 20, 12, 0),
    },
    {
        id: 1,
        title: 'Team lunch',
        start: new Date(2023, 5, 21, 12, 0),
        end: new Date(2023, 5, 21, 13, 0),
    },
];

const initialTasks = {
    todo: [
        { id: 'task-1', content: 'Task 1' },
        { id: 'task-2', content: 'Task 2' },
    ],
    inProgress: [
        { id: 'task-3', content: 'Task 3' },
    ],
    done: [
        { id: 'task-4', content: 'Task 4' },
    ],
};

function App() {
    const [theme, setTheme] = useState('light');
    const [tasks, setTasks] = useState(initialTasks);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const sourceColumn = tasks[source.droppableId];
        const destColumn = tasks[destination.droppableId];
        const sourceItems = [...sourceColumn];
        const destItems = [...destColumn];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setTasks({
            ...tasks,
            [source.droppableId]: sourceItems,
            [destination.droppableId]: destItems,
        });
    };

    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={currentTheme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        Toggle Theme
                    </Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Data Table
                            </Typography>
                            <div style={{ height: 400, width: '100%' }}>
                                <DataGrid rows={rows} columns={columns} pageSize={5} />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Bar Chart
                            </Typography>
                            <BarChart
                                width={500}
                                height={300}
                                data={chartData}
                                margin={{
                                    top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pv" fill="#8884d8" />
                                <Bar dataKey="uv" fill="#82ca9d" />
                            </BarChart>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Calendar
                            </Typography>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Kanban Board
                            </Typography>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Grid container spacing={2}>
                                    {Object.entries(tasks).map(([columnId, column], index) => (
                                        <Grid item xs={4} key={columnId}>
                                            <Typography variant="subtitle1" gutterBottom>{columnId}</Typography>
                                            <Droppable droppableId={columnId}>
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ background: 'lightgrey', padding: 8, minHeight: 500 }}>
                                                        {column.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            userSelect: 'none',
                                                                            padding: 16,
                                                                            margin: '0 0 8px 0',
                                                                            minHeight: '50px',
                                                                            backgroundColor: '#456C86',
                                                                            color: 'white',
                                                                            ...provided.draggableProps.style,
                                                                        }}
                                                                    >
                                                                        {task.content}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </Grid>
                                    ))}
                                </Grid>
                            </DragDropContext>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;
