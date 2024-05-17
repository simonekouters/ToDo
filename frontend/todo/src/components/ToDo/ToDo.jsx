import React, { useState } from 'react';
import axios from 'axios';
import './ToDo.css';
import '@fortawesome/fontawesome-free/css/all.css';

function Task({ todo, todos, setTodos }) {
  const API_URL = "http://localhost:8080/api/v1/tasks";
  const [editedText, setEditedText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  function handleDelete(toDoToDelete) {
    axios.delete(`${API_URL}/${toDoToDelete.id}`).then(() => {
      const updatedTodos = todos.filter((task) => task != toDoToDelete);
      updatedTodos.forEach((task) => {
        if (task.index > toDoToDelete.index) task.index--;
        axios.patch(`${API_URL}/${task.id}`, { index: task.index })
      });
      setTodos(updatedTodos);
    });
  }

  function handleCheckOff(todo) {
    const newArray = todos.map((task) => {
      if (task !== todo) {
        return task;
      }
      let checked = !todo.done;
      axios.patch(`${API_URL}/${todo.id}`, { done: checked });
      return { ...todo, done: checked };
    });
    setTodos(newArray);
  }

  function handleInputChange(e) {
    setEditedText(e.target.value);
  }

  function handleSave() {
    const updatedTodos = todos.map(todoToUpdate => {
      if (todoToUpdate !== todo) {
        return todoToUpdate;
      }
      axios.patch(`${API_URL}/${todoToUpdate.id}`, { text: editedText });
      return { ...todo, text: editedText };
    });
    setTodos(updatedTodos);
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  return (
    <div className="task-container">
      <div className="checkbox-and-text">
        <input 
          type="checkbox" 
          className="check-off-box" 
          checked={todo.done} 
          onChange={() => handleCheckOff(todo)} 
        />
        {isEditing ? (
          <input 
            type="text" 
            value={editedText}
            onChange={handleInputChange} 
            onBlur={() => handleSave}
            onKeyDown={e => e.key === `Enter` ? handleSave() : ''}
            spellCheck="false"
            autoFocus
          />
        ) : (
          <p className={todo.done ? 'completed' : 'task'} onClick={handleEdit}>{todo.text}</p>
        )}
      </div>
      <button onClick={() => handleDelete(todo)}>x</button>
    </div>
  )
}

export default Task;