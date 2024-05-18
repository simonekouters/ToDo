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

  const sortedTodos = todos.slice().sort((a, b) => Number(a.index) - Number(b.index));

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios(API_URL);
        const data = await response.data;
        setTodos(data);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    }
    getData();
  }, []);

  async function handleReorder(newTodos) {
    const promises = newTodos.map((todo, index) => {
      todo.index = index;
      return axios.patch(`${API_URL}/${todo.id}`, { index: todo.index });
    });

    try {
      await Promise.all(promises);
      setTodos(newTodos);
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
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