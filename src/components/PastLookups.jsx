import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PastLookups() {
  const { user } = useAuth()
  const [lookups, setLookups] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch saved lookups when the component loads
  useEffect(() => {
    if (user) {
      fetchLookups()
    }
  }, [user])

  async function fetchLookups() {
    setLoading(true)
    const { data, error } = await supabase
      .from('saved_lookups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching lookups:', error)
    } else {
      setLookups(data || [])
    }
    setLoading(false)
  }

  async function deleteLookup(id) {
    const { error } = await supabase.from('saved_lookups').delete().eq('id', id)
    if (!error) {
      // Remove it from the screen immediately
      setLookups(lookups.filter(lookup => lookup.id !== id))
    }
  }

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading your saved lookups...</p>

  if (lookups.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '12px' }}>
        <h3 style={{ color: '#2d5016' }}>No saved lookups yet</h3>
        <p style={{ color: '#666' }}>Go to the Recommendation tab and save a crop you like!</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <h2 style={{ color: '#2d5016', marginBottom: '15px' }}>My Past Lookups</h2>
      
      {lookups.map((lookup) => (
        <div key={lookup.id} style={{ background: 'white', padding: '16px', borderRadius: '10px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d5016', fontSize: '18px' }}>🌾 {lookup.top_crop}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                Saved on: {new Date(lookup.created_at).toLocaleDateString()}
              </p>
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#444' }}>
                <strong>Conditions:</strong> {lookup.inputs.soil} soil • {lookup.inputs.season} • {lookup.inputs.rainfall} rainfall • {lookup.inputs.water}
              </div>
            </div>
            <button 
              onClick={() => deleteLookup(lookup.id)}
              style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}