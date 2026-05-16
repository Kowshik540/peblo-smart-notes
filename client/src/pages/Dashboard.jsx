import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, authHeaders);
      setNotes(res.data);
    } catch (error) {
      console.error('Fetch Notes Error:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create note
  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter title and content.');
      return;
    }

    try {
      await axios.post(
        `${API}/notes`,
        { title, content },
        authHeaders
      );

      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Create Note Error:', error);
      alert('Failed to create note.');
    }
  };

  // Select note
  const openNote = (note) => {
    setSelectedNote(note);
    setSummary(note.summary || '');
  };

  // Generate AI Summary
  const generateSummary = async () => {
    if (!selectedNote) {
      alert('Please select a note first.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/ai/${selectedNote._id}/generate-summary`,
        {},
        authHeaders
      );

      const generatedSummary =
        res.data.summary ||
        'Summary generated successfully.';

      setSummary(generatedSummary);

      // Update selected note
      setSelectedNote({
        ...selectedNote,
        summary: generatedSummary,
      });

      // Refresh notes list
      fetchNotes();
    } catch (error) {
      console.error('Generate Summary Error:', error);
      alert(
        error.response?.data?.message ||
          'Failed to generate summary.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Peblo AI Notes</h1>

      {/* Create Note */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
        />

        <button onClick={createNote}>Create Note</button>
      </div>

      {/* Notes List */}
      <h2>Your Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ marginBottom: '10px' }}>
            <button onClick={() => openNote(note)}>
              {note.title}
            </button>
          </li>
        ))}
      </ul>

      {/* Selected Note */}
      {selectedNote && (
        <div style={{ marginTop: '30px' }}>
          <h2>{selectedNote.title}</h2>
          <p>{selectedNote.content}</p>

          <button
            onClick={generateSummary}
            disabled={loading}
            style={{
              padding: '10px 20px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading
              ? 'Generating...'
              : 'Generate AI Summary'}
          </button>

          {summary && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f4f4f4',
                borderRadius: '8px',
              }}
            >
              <h3>AI Summary</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}