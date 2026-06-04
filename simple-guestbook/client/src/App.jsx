import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // 1. Fetch saved messages from backend when the page opens
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 2. Send a new message to the backend database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return alert("Please fill out both fields!");

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });

      if (response.ok) {
        setName('');
        setMessage('');
        fetchMessages(); // Refresh the list instantly
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>-,-Welcome to Ramisa's short notebook-,-</h2>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <textarea 
          placeholder="Write a message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          style={{ padding: '10px', fontSize: '16px', height: '80px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#9a2fe7', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          Submit Message
        </button>
      </form>

      {/* Messages List */}
      <h3>Recent Messages</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.length === 0 ? <p>No messages yet. Be the first!</p> : 
          messages.map((msg) => (
            <div key={msg._key || msg._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              <strong>{msg.name}</strong>
              <p style={{ margin: '5px 0 0 0', color: '#555' }}>{msg.message}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
