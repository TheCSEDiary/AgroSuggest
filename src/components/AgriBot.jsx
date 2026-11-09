import { useState, useRef, useEffect } from 'react'

// Smart Knowledge Base for the Chatbot
const knowledgeBase = [
  { 
    keywords: ['hello', 'hi', 'namaste', 'hey'], 
    response: "Namaste! 🌾 I am AgriBot, your virtual farming assistant. You can ask me about MSP, government schemes, fertilizers, or weather!" 
  },
  { 
    keywords: ['msp', 'price', 'cost', 'support price'], 
    response: "The Minimum Support Price (MSP) varies by crop. For example, Paddy is ₹2300/quintal and Ragi is ₹3500/quintal. You can check exact, updated prices in the 'Crops' or 'Compare' tabs!" 
  },
  { 
    keywords: ['pm-kisan', 'kisan', 'subsidy', 'scheme', 'money'], 
    response: "PM-KISAN provides ₹6,000 per year in 3 equal installments to all landholding farmer families. You can find eligibility details and apply via the 'Schemes' tab." 
  },
  { 
    keywords: ['fertilizer', 'urea', 'dap', 'mop', 'manure'], 
    response: "Fertilizer requirements depend entirely on your crop and soil type. Use our 'Calculator' tab to get the exact kilograms of Urea, DAP, and seeds needed for your land size!" 
  },
  { 
    keywords: ['disease', 'pest', 'yellow', 'spots', 'worm'], 
    response: "If you notice diseased leaves or pests, I recommend consulting your local Krishi Vigyan Kendra (KVK) or agricultural officer immediately for targeted treatment." 
  },
  { 
    keywords: ['weather', 'rain', 'temperature', 'monsoon'], 
    response: "You can check real-time, live weather conditions, humidity, and wind speed for your specific district in the 'Live Weather' tab!" 
  },
  { 
    keywords: ['soil', 'black', 'red', 'loamy', 'test'], 
    response: "Knowing your soil is the first step to a good harvest! The Government of India provides free soil testing under the 'Soil Health Card Scheme'. Check the 'Schemes' tab for more info." 
  }
]

export default function AgriBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Namaste! 🌾 I am AgriBot. How can I assist you with your farming today?" }
  ])
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const getBotResponse = (userText) => {
    const lowerText = userText.toLowerCase()
    
    // Find the first matching knowledge base entry
    const match = knowledgeBase.find(item => 
      item.keywords.some(keyword => lowerText.includes(keyword))
    )

    return match ? match.response : "I'm not sure about that specific detail, but you can find comprehensive information in our 'Catalogue', 'Schemes', or 'Calculator' tabs! 🌱"
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    
    // Simulate typing delay for realism
    setTimeout(() => {
      const botResponse = { sender: 'bot', text: getBotResponse(input) }
      setMessages(prev => [...prev, botResponse])
    }, 600)

    setInput('')
  }

  const quickReplies = ["What is the MSP for Ragi?", "Tell me about PM-KISAN", "How much Urea do I need?"]

  return (
    <>
      {/* CHAT WINDOW */}
      {isOpen && (
        <div style={{ 
          position: 'fixed', bottom: '90px', right: '24px', width: '350px', 
          background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
          border: '1px solid #e5e7eb', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ background: '#059669', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>AgriBot</h4>
                <p style={{ margin: 0, fontSize: '11px', opacity: 0.9 }}>Online • Virtual Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>

          {/* Messages Area */}
          <div style={{ height: '300px', overflowY: 'auto', padding: '16px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#059669' : 'white',
                color: msg.sender === 'user' ? 'white' : '#111827',
                padding: '10px 14px', borderRadius: '12px', 
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                fontSize: '14px', lineHeight: '1.5', maxWidth: '85%',
                boxShadow: msg.sender === 'bot' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div style={{ padding: '8px 16px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickReplies.map((reply, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { setInput(reply); }}
                  style={{ background: 'white', border: '1px solid #059669', color: '#059669', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '12px', background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask a farming question..."
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#059669', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', fontWeight: '600' }}>
              ➤
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TOGGLE BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'fixed', bottom: '24px', right: '24px', width: '60px', height: '60px', 
          background: '#059669', color: 'white', border: 'none', borderRadius: '50%', 
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)', cursor: 'pointer', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </>
  )
}