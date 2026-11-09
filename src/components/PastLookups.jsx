import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { crops } from '../data/crops'
import CropDetailCard from './CropDetailCard'

export default function PastLookups() {
  const [lookups, setLookups] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCrop, setSelectedCrop] = useState(null)

  useEffect(() => {
    fetchLookups()
  }, [])

  const fetchLookups = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('saved_lookups')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setLookups(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await supabase.from('saved_lookups').delete().eq('id', id)
    fetchLookups()
  }

  // Foolproof matching (case-insensitive)
  const findCropByName = (cropName) => {
    if (!cropName) return null
    return crops.find(c => c.name.toLowerCase() === cropName.toLowerCase()) || null
  }

  if (loading) return <p style={{ fontSize: '18px', color: '#666' }}>Loading your saved lookups...</p>

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        YOUR SAVED DATA
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        My Lookups
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Review and manage your saved crop recommendations. Click on any crop below to see its full growing guidance flashcard.
      </p>

      {lookups.length === 0 ? (
        <div style={{ background: '#f9fafb', padding: '40px', borderRadius: '12px', textAlign: 'center', border: '1px dashed #d1d5db' }}>
          <p style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>
            You haven't saved any lookups yet. <br/>
            Go to the <strong>Recommend</strong> or <strong>District Map</strong> tab to save some!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {lookups.map((lookup) => {
            const cropData = findCropByName(lookup.top_crop)
            
            return (
              <div 
                key={lookup.id} 
                style={{ 
                  background: 'white', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  border: '1px solid #e5e7eb', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Clickable Area */}
                <div 
                  style={{ cursor: cropData ? 'pointer' : 'default', flex: 1 }} 
                  onClick={() => cropData && setSelectedCrop(cropData)}
                >
                  <h3 style={{ margin: '0 0 8px 0', color: '#2d5016', fontSize: '20px', fontWeight: '600' }}>
                    🌾 {lookup.top_crop}
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    Saved from: <strong>{lookup.inputs?.context || 'Recommendation Form'}</strong> • {new Date(lookup.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(lookup.id)}
                  style={{ 
                    background: '#fee2e2', 
                    color: '#991b1b', 
                    border: 'none', 
                    padding: '10px 16px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '14px',
                    marginLeft: '16px'
                  }}
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* The Magic: Opens the Master Flashcard when clicked */}
      {selectedCrop && (
        <CropDetailCard 
          crop={selectedCrop} 
          onClose={() => setSelectedCrop(null)} 
          context="Past Lookups"
        />
      )}
    </div>
  )
}