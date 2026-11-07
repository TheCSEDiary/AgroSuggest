import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function PastLookups() {
  const { user } = useAuth()
  const [lookups, setLookups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchLookups()
  }, [user])

  async function fetchLookups() {
    setLoading(true)
    const { data, error } = await supabase
      .from('saved_lookups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error:', error)
    else setLookups(data || [])
    setLoading(false)
  }

  async function deleteLookup(id) {
    const { error } = await supabase.from('saved_lookups').delete().eq('id', id)
    if (!error) setLookups(lookups.filter(l => l.id !== id))
  }

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading your saved lookups...</p>

  return (
    <div>
      <p style={{ color: '#2d5016', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
        For farmers in Karnataka
      </p>
      <h1 style={{ fontSize: '40px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>My Past Lookups</h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
        All the crops you've saved from previous recommendations.
      </p>

      {lookups.length === 0 ? (
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #eee', textAlign: 'center' }}>
          <h3 style={{ color: '#2d5016', marginBottom: '10px' }}>No saved lookups yet</h3>
          <p style={{ color: '#666' }}>Go to the Recommend tab and save a crop you like!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {lookups.map((lookup) => (
            <div key={lookup.id} style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '14px', 
              border: '1px solid #eee',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#2d5016', fontSize: '20px', fontWeight: '600' }}>
                  🌾 {lookup.top_crop}
                </h3>
                <button 
                  onClick={() => deleteLookup(lookup.id)}
                  style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
                >
                  Delete
                </button>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#999' }}>
                Saved on {new Date(lookup.created_at).toLocaleDateString()}
              </p>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                <strong>Conditions:</strong> {lookup.inputs.soil} soil • {lookup.inputs.season} • {lookup.inputs.rainfall} rainfall • {lookup.inputs.water}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}