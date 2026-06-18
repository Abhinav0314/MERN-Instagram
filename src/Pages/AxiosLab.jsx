import { useEffect, useState } from "react";
import axios from "axios";

function AxiosCard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((response) => {
      setUsers([...response.data]);
    });
  }, []);

  return (
    <div className="card shadow-sm p-3 border-info border-3">
      <h4 className="text-center text-info mb-3">
        Axios Users Dashboard
      </h4>

      <div className="row row-cols-1 row-cols-md-2 g-3">
        {users.map((user) => (
          <div className="col" key={user.id}>
            <div className="card h-100 p-2 shadow-sm">
              <h6 className="fw-bold mb-1 text-info">User: {user.username}</h6>
              <p className="mb-0 text-muted small">Address: {user.address.street}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AxiosCard;
