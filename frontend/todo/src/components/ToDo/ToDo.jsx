import React from 'react';
import axios from 'axios';
import './ToDo.css';

function Task({ todo, todos, setTodos }) {
  const API_URL = "http://localhost:8080/api/v1/tasks";

  function handleDelete(toDoToDelete) {
    axios.delete(`${API_URL}/${toDoToDelete.id}`).then(() => {
      const updatedTodos = todos.filter((task) => task != todo);
      updatedTodos.forEach((task) => {
        console.log(task);
        if (task.index > toDoToDelete.index) task.index--;
        axios.patch(`${API_URL}/${task.id}`, { index: task.index })
      });
      setTodos(updatedTodos);
    });
  }

  function handleCheckOff(todo) {
    const newArray = todos.map((task) => {
      if (task !== todo) return task;
      let checked = !todo.done;
      axios.patch(`${API_URL}/${todo.id}`, { done: checked });
      return { ...todo, done: checked };
    });
    setTodos(newArray);
  }

  return (
    <div className="task-container">
      <input type="checkbox" checked={todo.done} onChange={() => handleCheckOff(todo)} />
      <p>{todo.text}</p>
      <button onClick={() => handleDelete(todo)}>x</button>
    </div>
  )
}

export default Task;