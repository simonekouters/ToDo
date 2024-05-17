import React, { useState } from 'react';
import { useEffect } from 'react';
import { Reorder } from "framer-motion";
import ToDoForm from '../ToDoForm/ToDoForm';
import ToDo from '../ToDo/ToDo';
import axios from 'axios';
import './ToDoList.css';

function ToDoList() {
  const [todos, setTodos] = useState([]);
  const API_URL = "http://localhost:8080/api/v1/tasks";

  const sortedTodos = todos.slice().sort((a, b) => Number(a.order) - Number(b.order));

  useEffect(() => {
    axios(API_URL).then((response) => {
      console.log("Response from API:", response.data);
      let newTodos = response.data.map((todo) => {
        const { id, index, text, enabled, done } = todo;
        return { id, index, text, enabled, done };
      });
      setTodos(newTodos);
    })
      .catch((error) => {
        console.error("Error fetching the tasks: ", error);
      });
  }, []);

  function handleReorder(newTodos) {
    newTodos.forEach((todo, index) => {
      todo.index = index;
      axios.patch(`${API_URL}/${todo.id}`, todo);
    });
    setTodos(newTodos);
  }

  return (
    <div className="list-container">
      <h1>To Do</h1>
      <ToDoForm todos={todos} setTodos={setTodos} />
      <Reorder.Group axis="y" values={sortedTodos} onReorder={handleReorder}>
        {sortedTodos.map(todo => (
          <Reorder.Item key={todo.id} value={todo}>
            <ToDo todo={todo} todos={todos} setTodos={setTodos} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}

export default ToDoList;