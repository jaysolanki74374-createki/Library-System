import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./ReaderBooks.css";

export default function ReaderBooks() {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("az");

  const [selected, setSelected] = useState(null); // <--- Book details panel
  const [reading, setReading] = useState(null);

  useEffect(() => {
    loadBooks();
    loadIssues();
  }, []);

  async function loadBooks() {
    setBooks(await apiFetch("/books"));
  }

  async function loadIssues() {
    setIssues(await apiFetch("/issues/my"));
  }

  function isIssued(bookId) {
    return issues.some((i) => i.book?._id === bookId && !i.returned);
  }

  function readBook(book) {
    if (!isIssued(book._id)) {
      alert("You must issue this book before reading it.");
      return;
    }

    if (book.filePath) {
      window.open("http://localhost:5000" + book.filePath, "_blank");
    } else {
      setReading(book);
    }
  }

  async function issueBook(id) {
    await apiFetch("/issues/issue/" + id, { method: "POST" });
    alert("Book issued successfully!");
    loadBooks();
    loadIssues();
  }

  // Search
  const filtered = books.filter((b) =>
    (b.title + b.author + b.description)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "za") return b.title.localeCompare(a.title);
    if (sort === "new") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === "old") return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <div className="books-container">

      {/* TOP BAR */}
      <div className="books-header">
        <input
          className="books-input"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="books-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="az">Title A–Z</option>
          <option value="za">Title Z–A</option>
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
        </select>
      </div>

      {/* BOOK GRID */}
      <div className="books-grid">
        {sorted.map((b) => (
          <div
            key={b._id}
            className="book-card"
            onClick={() => setSelected(b)}     // <--- SHOW DETAILS ON CLICK
          >
            <div className="book-title">{b.title}</div>
            <div className="book-author">by {b.author}</div>
            <div className="book-info">
              Copies: {b.availableCopies}/{b.totalCopies}
            </div>
          </div>
        ))}
      </div>

      {/* BOOK DETAILS PANEL */}
      {selected && (
        <div className="details-panel">
          <h2>{selected.title}</h2>
          <p><strong>Author:</strong> {selected.author}</p>
          <p><strong>Description:</strong> {selected.description}</p>
          <p><strong>Available:</strong> {selected.availableCopies}/{selected.totalCopies}</p>

          <div className="details-buttons">
            <button
              className="btn read"
              onClick={() => readBook(selected)}
              disabled={!isIssued(selected._id)}
            >
              Read
            </button>

            {!isIssued(selected._id) && (
              <button className="btn issue" onClick={() => issueBook(selected._id)}>
                Issue
              </button>
            )}

            <button className="btn close" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* TEXT READER */}
      {reading && (
        <div className="reader-content">
          <h3>{reading.title}</h3>
          <pre>{reading.content || "No text available"}</pre>
          <button className="btn close" onClick={() => setReading(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
