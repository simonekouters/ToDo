import React, { useState } from 'react';
import { useEffect } from 'react';
import ToDoForm from '../ToDoForm/ToDoForm';
import ToDo from '../ToDo/ToDo';
import axios from 'axios';
import './ToDoList.css';
function ToDoList() {
  const [todos, setTodos] = useState([]);
  const API_URL = "http://localhost:8080/api/v1/tasks";

  useEffect(() => {
    axios(API_URL).then((response) =>  {
      console.log("Response from API:", response.data);
      let newTodos = response.data.map((todo) => {
        const { id, index, text, enabled, done } = todo;
        return { id, index, text, enabled, done};
    });
    setTodos(newTodos);
  })
  .catch((error) => {
    console.error("Error fetching the tasks: ", error);
  });
  }, []);

  function handleReorder() {
  
  }

  return (
    <div className="list-container">
      <h1>To Do</h1>
      <ToDoForm todos={todos} setTodos={setTodos}/>
      <div className="tasks">
        {todos.map(todo => (
          <ToDo key={todo.id} todo={todo} todos={todos} setTodos={setTodos} />
        ))}
      </div>
    </div>
  );
}

export default ToDoList;