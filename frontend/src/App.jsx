import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('tickets')

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏫 Smart Campus Operations Hub</h1>
        <p>Incident Tickets Module</p>
      </header>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('tickets')}>My Tickets</button>
        <button onClick={() => setActiveTab('create')}>Create Ticket</button>
      </div>

      <div className="content">
        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'create' && <TicketForm />}
      </div>
    </div>
  )
}

// Ticket List Component
function TicketList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch tickets on load
  useState(() => {
    fetch('http://localhost:8081/api/tickets')
      .then(res => res.json())
      .then(data => {
        setTickets(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching tickets:', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading tickets...</div>

  return (
    <div className="ticket-list">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found. Create your first ticket!</p>
      ) : (
        tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <h3>{ticket.resourceName}</h3>
            <p><strong>Category:</strong> {ticket.category}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p>{ticket.description}</p>
          </div>
        ))
      )}
    </div>
  )
}

// Ticket Form Component
function TicketForm() {
  const [formData, setFormData] = useState({
    resourceName: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    preferredContact: ''
  })
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed')
      return
    }
    setImages([...images, ...files])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Create form data for file upload
    const submitData = new FormData()
    submitData.append('resourceName', formData.resourceName)
    submitData.append('category', formData.category)
    submitData.append('description', formData.description)
    submitData.append('priority', formData.priority)
    submitData.append('preferredContact', formData.preferredContact)
    
    images.forEach(image => {
      submitData.append('images', image)
    })

    try {
      const response = await fetch('http://localhost:8081/api/tickets', {
        method: 'POST',
        body: submitData
      })
      
      if (response.ok) {
        alert('Ticket created successfully!')
        setFormData({
          resourceName: '',
          category: '',
          description: '',
          priority: 'MEDIUM',
          preferredContact: ''
        })
        setImages([])
      } else {
        alert('Failed to create ticket')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating ticket')
    }
    setSubmitting(false)
  }

  return (
    <div className="ticket-form">
      <h2>Create Incident Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Resource Name:</label>
          <input
            type="text"
            name="resourceName"
            value={formData.resourceName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="PROJECTOR">Projector</option>
            <option value="AC">Air Conditioner</option>
            <option value="COMPUTER">Computer</option>
            <option value="LAB">Lab Equipment</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Preferred Contact:</label>
          <input
            type="text"
            name="preferredContact"
            value={formData.preferredContact}
            onChange={handleChange}
            placeholder="Email or phone number"
          />
        </div>

        <div>
          <label>Images (Max 3):</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <div className="image-preview">
            {images.map((img, idx) => (
              <span key={idx}>{img.name}</span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  )
}

export default App