import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import RecommendForm from './components/RecommendForm'
import PastLookups from './components/PastLookups'
import Catalogue from './components/Catalogue'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  
  // This state remembers which tab the user clicked
  const [activeTab, setActiveTab] = useState('recommend')

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading AgroSuggest...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* --- HEADER --- */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2d5016', fontSize: '24px', margin: 0 }}>AgroSuggest 🌾</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: '#555' }}>{user.email}</span>
          <button 
            onClick={signOut} 
            style={{ padding: '8px 16px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* --- NAVIGATION TABS --- */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('recommend')}
          style={{ 
            padding: '10px 16px', 
            background: activeTab === 'recommend' ? '#2d5016' : '#f0f0f0', 
            color: activeTab === 'recommend' ? 'white' : '#333', 
            border: 'none', 
            borderRadius: '8px 8px 0 0', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          🌱 Recommend
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          style={{ 
            padding: '10px 16px', 
            background: activeTab === 'past' ? '#2d5016' : '#f0f0f0', 
            color: activeTab === 'past' ? 'white' : '#333', 
            border: 'none', 
            borderRadius: '8px 8px 0 0', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          📂 My Lookups
        </button>
        <button 
          onClick={() => setActiveTab('catalogue')}
          style={{ 
            padding: '10px 16px', 
            background: activeTab === 'catalogue' ? '#2d5016' : '#f0f0f0', 
            color: activeTab === 'catalogue' ? 'white' : '#333', 
            border: 'none', 
            borderRadius: '8px 8px 0 0', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}
        >
          📚 Catalogue
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main>
        {activeTab === 'recommend' && <RecommendForm />}
        {activeTab === 'past' && <PastLookups />}
        {activeTab === 'catalogue' && <Catalogue />}
      </main>

    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App