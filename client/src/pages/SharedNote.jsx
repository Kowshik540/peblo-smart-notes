import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function SharedNote() {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    api.get(`/shared/${shareId}`).then((res) => setNote(res.data));
  }, [shareId]);

  if (!note) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="container">
      <h1>{note.title}</h1>
      <p>{note.content}</p>

      {note.aiSummary && (
        <div className="ai-box">
          <strong>AI Summary:</strong>
          <pre>{note.aiSummary}</pre>
        </div>
      )}
    </div>
  );
}
