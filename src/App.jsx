import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import RecommendForm from './components/RecommendForm'
import PastLookups from './components/PastLookups'
import Catalogue from './components/Catalogue'

function AppContent() {
  const { user, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('recommend')

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading... TESTING 123</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      
      {/* --- NAVBAR --- */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 40px', 
        background: 'white',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: '#2d5016', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px'
          }}>
            🌱
          </div>
          <span style={{ fontWeight: '600', fontSize: '18px', color: '#1a1a1a' }}>Karnataka Crop Advisor</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavButton active={activeTab === 'recommend'} onClick={() => setActiveTab('recommend')}>Recommend</NavButton>
          <NavButton active={activeTab === 'catalogue'} onClick={() => setActiveTab('catalogue')}>Crops</NavButton>
          <NavButton active={activeTab === 'past'} onClick={() => setActiveTab('past')}>My lookups</NavButton>
          <button 
            onClick={signOut}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              background: 'none', 
              border: 'none', 
              color: '#666', 
              cursor: 'pointer', 
              padding: '10px 16px',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            <span style={{ fontSize: '18px' }}>↪</span> Sign out
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {activeTab === 'recommend' && <RecommendForm />}
        {activeTab === 'catalogue' && <Catalogue />}
        {activeTab === 'past' && <PastLookups />}
      </main>

    </div>
  )
}

function NavButton({ active, onClick, children }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        background: 'none', 
        border: 'none', 
        color: active ? '#2d5016' : '#666', 
        cursor: 'pointer', 
        padding: '10px 16px',
        fontSize: '15px',
        fontWeight: active ? '600' : '500',
        borderBottom: active ? '2px solid #2d5016' : '2px solid transparent',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </button>
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
