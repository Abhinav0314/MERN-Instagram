import React, { useState, useEffect } from 'react';

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="card shadow-sm p-4 border-primary border-3 text-center">
      <h4 className="text-primary mb-3">Digital Clock</h4>
      <div className="display-4 fw-bold font-monospace bg-dark text-light p-3 rounded">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default DigitalClock;
