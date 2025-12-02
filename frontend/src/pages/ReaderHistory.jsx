import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./ReaderHistory.css";

export default function ReaderHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const data = await apiFetch("/issues/my");
    setHistory(data);
  }

  return (
    <div className="history-container">
      
      <h1 className="history-title">📖 Your Issued Books History</h1>

      <div className="history-list">
        {history.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.85 }}>
            You haven't issued any books yet.
          </p>
        )}

        {history.map((h) => (
          <div key={h._id} className="history-card">
            <div className="history-book-title">
              {h.book?.title || "Unknown Book"}
            </div>

            <div className="history-info">
              <strong>Author:</strong> {h.book?.author}
            </div>

            <div className="history-info">
              <strong>Issued On:</strong> {new Date(h.issuedAt).toLocaleDateString()}
            </div>

            {h.returnedAt && (
              <div className="history-info">
                <strong>Returned On:</strong> {new Date(h.returnedAt).toLocaleDateString()}
              </div>
            )}

            <div
              className={
                "returned-status " + (h.returned ? "returned-yes" : "returned-no")
              }
            >
              {h.returned ? "Returned" : "Not Returned"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
