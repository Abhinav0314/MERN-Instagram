import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  const [age, setAge] = useState(18);

  useEffect(() => {
    console.log(`Counter changed to ${count}`);
  }, [count]);

  useEffect(() => {
    console.log(`Age changed to ${age}`);
  }, [age]);

  useEffect(() => {
    console.log("Counter Component Mounted");

    return () => {
      console.log("Counter Component Unmounted");
    };
  }, []);

  return (
    <div className="p-2">
      <h4 className="text-center text-success mb-3">
        Counter Dashboard
      </h4>

      <div className="card p-2 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Count:</strong> {count}
          </span>

          <div>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => setCount(count + 1)}
            >
              +
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => setCount(count - 1)}
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="card p-2">
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Age:</strong> {age}
          </span>

          <div>
            <button
              className="btn btn-success btn-sm me-2"
              onClick={() => setAge(age + 1)}
            >
              +
            </button>

            <button
              className="btn btn-warning btn-sm"
              onClick={() => setAge(age - 1)}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;