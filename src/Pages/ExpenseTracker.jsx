import React, { useState } from 'react';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const newExpense = {
      id: Date.now(),
      description: desc,
      amount: parseFloat(amount)
    };

    setExpenses([...expenses, newExpense]);
    setDesc('');
    setAmount('');
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="card shadow-sm p-3 border-danger border-3">
      <h4 className="text-center text-danger mb-3">Expense Tracker</h4>
      
      <div className="card p-3 mb-3 bg-light border-0">
        <h5 className="fw-bold mb-0">Total Expenses: <span className="text-danger">₹{total.toFixed(2)}</span></h5>
      </div>

      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="input-group mb-2">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Expense description..." 
            value={desc} 
            onChange={(e) => setDesc(e.target.value)} 
          />
          <input 
            type="number" 
            className="form-control" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            step="0.01"
          />
          <button type="submit" className="btn btn-danger">Add</button>
        </div>
      </form>

      <ul className="list-group">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
            {expense.description}
            <span className="badge bg-danger rounded-pill">${expense.amount.toFixed(2)}</span>
          </li>
        ))}
        {expenses.length === 0 && <li className="list-group-item text-center text-muted">No expenses recorded yet.</li>}
      </ul>
    </div>
  );
}

export default ExpenseTracker;
