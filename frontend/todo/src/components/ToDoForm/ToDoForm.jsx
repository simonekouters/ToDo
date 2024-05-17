import React, { useState } from 'react';
import axios from 'axios';
import './ToDoForm.css';

function ToDoForm({ todos, setTodos }) {
  const API_URL = "http://localhost:8080/api/v1/tasks";
  const [todo, setTodo] = useState({text: ""});

  function handleInputChange(e) {
    setTodo({...todo, text: e.target.value});
  }

  function handleAdd(e) {
    e.preventDefault(); 
    if (!todo.text.trim()) return;

    axios.post(API_URL, { id: todo.id, text: todo.text, index: todos.length })
    .then((response) => {
      const newTask = response.data;
      setTodos([...todos, newTask]);
      setTodo({text: "", done: false, index: todos.length});
    })
    .catch((error) => {
      console.error("Error adding task: ", error);
    })
  }

  return (
    <form className="todo-form" action="submit" onSubmit={handleAdd}>
      <input 
        type="text" 
        placeholder="Enter a task" 
        value={todo.text} 
        onChange={handleInputChange} 
        autoFocus
        />
      <button>+</button>
    </form>
  );
}

export default ToDoForm;