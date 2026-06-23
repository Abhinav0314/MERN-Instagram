import { useRef, useState } from "react";

function RefCard() {
  const inputRef1 = useRef("Abhinav is a good boy.");
  const [renderTrigger, setRenderTrigger] = useState(0);

  const handleInput = (e) => {
    inputRef1.current = e.target.value;
    console.log(inputRef1.current);
  };

  return (
    <div className="p-2">
      <h4 className="text-center text-warning mb-3">
        Ref Dashboard
      </h4>

      <div className="card p-2 mb-3 bg-light">
        <h6 className="fw-bold text-warning">Current Ref Value:</h6>
        <div>{inputRef1.current}</div>
      </div>

      <input 
        onChange={handleInput} 
        className="form-control mb-3" 
        type="text" 
        placeholder="Type to update ref..."
      />

      <button 
        onClick={() => {
            // Re-render to show updated ref value
            setRenderTrigger(renderTrigger + 1);
        }} 
        className="btn btn-warning text-white fw-bold"
      >
        Trigger Render to see Ref
      </button>
    </div>
  );
}

export default RefCard;
