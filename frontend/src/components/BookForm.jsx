import React, { useState } from "react";
import "./BookForm.css";

export default function BookForm({ onSubmit, initial = {} }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    author: initial.author || "",
    description: initial.description || "",
    content: initial.content || "",
    totalCopies: initial.totalCopies || 1,
  });

  const [file, setFile] = useState(null);

  function submit(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("description", form.description);
    fd.append("content", form.content);
    fd.append("totalCopies", form.totalCopies);

    if (file) fd.append("file", file);

    onSubmit(fd);
  }

  return (
    <form onSubmit={submit} encType="multipart/form-data" className="book-form">
      <div>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <input 
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>

      <div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <textarea
          placeholder="Content (preview text)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      </div>

      <div>
        <label>Book File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <div>
        <input
          type="number"
          min="1"
          value={form.totalCopies}
          onChange={(e) => setForm({ ...form, totalCopies: Number(e.target.value) })}
        />
      </div>

      <button type="submit">Save</button>
    </form>
  );
}
