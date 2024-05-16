import React, { useState } from 'react';

function ToDoForm() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleAdd(e) {
    e.preventDefault(); 
    if (!todo.trim()) return;
    setTodos(prevTodos => [...prevTodos, todo]);
    setTodo("");
  }

  return (
    <div className="form-container">
      <form action="submit" onSubmit={handleAdd}>
        <input type="text" placeholder="Enter a task" value={todo} onChange={handleInputChange}/>
        <button>+</button>
      </form>

      {/* dit moet in todolist component: */}
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoForm;