import React, { useState, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');

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

  // 3. Edit a message
  const handleEdit = (msg) => {
    setEditingId(msg._id);
    setEditName(msg.name);
    setEditMessage(msg.message);
  };

  // 4. Save edited message
  const handleSaveEdit = async (id) => {
    if (!editName || !editMessage) return alert("Please fill out both fields!");

    try {
      console.log("Saving message with ID:", id);
      const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, message: editMessage })
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        console.log("Message updated successfully!");
        setEditingId(null);
        fetchMessages(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert("Failed to update message: " + (errorData.error || response.statusText));
      }
    } catch (error) {
      console.error("Error updating message:", error);
      alert("Error: " + error.message);
    }
  };

  // 5. Delete a message
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting message:", error);
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
            <div key={msg._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
              {editingId === msg._id ? (
                <>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    style={{ padding: '8px', fontSize: '14px', width: '100%', marginBottom: '10px' }}
                  />
                  <textarea 
                    value={editMessage} 
                    onChange={(e) => setEditMessage(e.target.value)} 
                    style={{ padding: '8px', fontSize: '14px', width: '100%', height: '80px', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleSaveEdit(msg._id)} 
                      style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <strong>{msg.name}</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#555' }}>{msg.message}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => handleEdit(msg)} 
                      style={{ padding: '6px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(msg._id)} 
                      style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
