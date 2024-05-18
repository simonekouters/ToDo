import React, { useState } from 'react';
import axios from 'axios';
import './ToDo.css';
import '@fortawesome/fontawesome-free/css/all.css';

function ToDo({ todo, todos, setTodos }) {
  const API_URL = "http://localhost:8080/api/v1/tasks";
  const [editedText, setEditedText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  async function handleDelete(toDoToDelete) {
    try {
      await axios.delete(`${API_URL}/${toDoToDelete.id}`);
      let updatedTodos = todos.filter((task) => task !== toDoToDelete);
  
      const promises = updatedTodos.map((task) => {
        if (task.index > toDoToDelete.index) {
          task.index--;
          return axios.patch(`${API_URL}/${task.id}`, {index: task.index});
        }
      });
      await Promise.all(promises);
  
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  }
  
  async function handleCheckOff(todoToCheck) {
    try {
      const updatedTodos = todos.map((task) => {
        if (task !== todoToCheck) return task;
        let checked = !todoToCheck.done;
        return {...task, done: checked};
      });
      
      await axios.patch(`${API_URL}/${todoToCheck.id}`, { done: !todoToCheck.done });
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
  }

  function handleInputChange(e) {
    setEditedText(e.target.value);
  }

  async function handleSave() {
    const updatedTodos = todos.map(todoToUpdate => {
      if (todoToUpdate !== todo) {
        return todoToUpdate;
      }
      return { ...todo, text: editedText };
    });
    
    try {
      await axios.patch(`${API_URL}/${todo.id}`, { text: editedText });
      setTodos(updatedTodos);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
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
            onBlur={handleSave}
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

export default ToDo;