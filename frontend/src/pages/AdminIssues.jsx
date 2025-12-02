import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import "./AdminIssues.css";

export default function AdminIssues(){
  const [issues, setIssues] = useState([]);

  async function fetchIssues(){
    const data = await apiFetch('/issues');
    setIssues(data);
  }

  useEffect(()=> { fetchIssues(); }, []);

  async function markReturn(issueId){
    try {
      await apiFetch('/issues/return/' + issueId, { method: 'POST' });
      fetchIssues();
    } catch (err) { alert(err.message || 'Error'); }
  }

return (
  <div className="admin-issues-container">
    <h2 className="admin-issues-title">Admin - Issued Books</h2>

    <div className="issue-list">
      {issues.map((i) => (
        <div key={i._id} className="issue-card">
          <div className="issue-info"><strong>Book:</strong> {i.book?.title}</div>
          <div className="issue-info"><strong>User:</strong> {i.user?.name} ({i.user?.email})</div>
          <div className="issue-info"><strong>Issued:</strong> {new Date(i.issueDate).toLocaleString()}</div>
          <div className="issue-info">
            <strong>Returned:</strong>{" "}
            {i.returned ? `Yes at ${new Date(i.returnDate).toLocaleString()}` : "No"}
          </div>

          {!i.returned && (
            <button className="return-btn" onClick={() => markReturn(i._id)}>
              Mark as returned
            </button>
          )}

          <hr className="issue-line" />
        </div>
      ))}
    </div>
  </div>
);
}
