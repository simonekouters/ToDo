import { useState } from 'react';
import './App.css';
import ToDoList from './components/ToDoList/ToDoList';

function App() {
    return (
        <div className="todo-container">
            <ToDoList />
        </div>
    );
}

export default App;
