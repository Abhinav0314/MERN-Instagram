import React, { useState, useEffect } from 'react';

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerId);
          return 100;
        }
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(timerId);
  }, []);

  const handleReset = () => {
    setProgress(0);
  };

  return (
    <div className="card shadow-sm p-3 border-success border-3">
      <h4 className="text-center text-success mb-3">Progress Bar</h4>
      
      <div className="progress mb-3" style={{ height: '25px' }}>
        <div 
          className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
          role="progressbar" 
          style={{ width: `${progress}%` }} 
          aria-valuenow={progress} 
          aria-valuemin="0" 
          aria-valuemax="100"
        >
          {progress}%
        </div>
      </div>
      
      <div className="text-center">
        <button className="btn btn-outline-success btn-sm" onClick={handleReset}>Reset Progress</button>
      </div>
    </div>
  );
}

export default ProgressBar;
