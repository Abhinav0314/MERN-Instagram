import { useRef, useState } from "react";

function TodoCard() {
  const inputRef = useRef();
  const [todos, setTodos] = useState([]);

  function handleSubmit() {
    const value = inputRef.current.value.trim();

    if (!value) return;

    setTodos((prev) => [...prev, value]);
    inputRef.current.value = "";
  }

  return (
    <div className="p-2">
      <h4 className="text-center text-primary mb-3">
        Todo Form
      </h4>

      <div className="card p-2 mb-3">
        <h6 className="fw-bold">Tasks</h6>

        <div>
          {todos.map((todo, index) => (
            <div key={index}>{todo}</div>
          ))}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        className="form-control mb-3"
        placeholder="Enter task..."
      />

      <button
        onClick={handleSubmit}
        className="btn btn-primary"
      >
        Add Task
      </button>
    </div>
  );
}

export default TodoCard;