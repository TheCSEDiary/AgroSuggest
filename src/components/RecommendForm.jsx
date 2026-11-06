import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { scoreCrops } from '../utils/scorer'

const crops = [
  { id: 'paddy', name: 'Paddy (Rice)', soils: ['clay', 'loamy', 'laterite'], seasons: ['kharif', 'summer'], rainfall: ['medium', 'high'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'June to July (Kharif), Jan to Feb (Summer)', waterNeeds: 'High - requires standing water in early stages', duration: '110 to 140 days', tips: 'Ensure proper field leveling for uniform water.' } },
  { id: 'ragi', name: 'Ragi (Finger Millet)', soils: ['red', 'loamy', 'black', 'laterite'], seasons: ['kharif', 'summer'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July', waterNeeds: 'Low to Medium - highly drought tolerant', duration: '100 to 120 days', tips: 'Excellent for dryland farming. Do not let water stagnate.' } },
  { id: 'jowar', name: 'Jowar (Sorghum)', soils: ['black', 'red', 'loamy'], seasons: ['kharif', 'rabi'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)', waterNeeds: 'Low - very drought resistant', duration: '110 to 130 days', tips: 'Rabi jowar needs residual soil moisture.' } },
  { id: 'maize', name: 'Maize (Corn)', soils: ['loamy', 'red', 'black'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['medium', 'high'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)', waterNeeds: 'Medium to High', duration: '90 to 110 days', tips: 'Needs well-drained soil.' } },
  { id: 'bajra', name: 'Bajra (Pearl Millet)', soils: ['sandy', 'loamy', 'red'], seasons: ['kharif', 'rabi'], rainfall: ['low'], water: ['rainfed only'], details: { sowingWindow: 'June to July', waterNeeds: 'Very Low', duration: '80 to 100 days', tips: 'Best suited for sandy soils. Avoid waterlogging.' } },
  { id: 'groundnut', name: 'Groundnut', soils: ['sandy', 'loamy', 'red', 'laterite'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July (Kharif), Dec to Jan (Summer)', waterNeeds: 'Low to Medium', duration: '110 to 130 days', tips: 'Apply gypsum at flowering to improve pod filling.' } },
  { id: 'sunflower', name: 'Sunflower', soils: ['black', 'red', 'loamy'], seasons: ['kharif', 'rabi'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)', waterNeeds: 'Medium', duration: '90 to 110 days', tips: 'Keep bees nearby for better pollination.' } },
  { id: 'sugarcane', name: 'Sugarcane', soils: ['clay', 'loamy', 'black', 'red'], seasons: ['kharif', 'summer'], rainfall: ['high'], water: ['good irrigation'], details: { sowingWindow: 'Jan to Feb (Spring), June to July (Autumn)', waterNeeds: 'Very High', duration: '12 to 18 months', tips: 'Earthing up is crucial to prevent lodging.' } },
  { id: 'cotton', name: 'Cotton', soils: ['black', 'red', 'loamy'], seasons: ['kharif'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'April to May', waterNeeds: 'Medium', duration: '150 to 180 days', tips: 'Monitor closely for bollworms.' } },
  { id: 'tur', name: 'Tur (Pigeon Pea)', soils: ['red', 'black', 'loamy', 'laterite'], seasons: ['kharif', 'rabi'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July (Kharif), Sept to Oct (Rabi)', waterNeeds: 'Low', duration: '150 to 180 days', tips: 'Prune the top 10cm after 45 days to encourage branching.' } },
  { id: 'bengal-gram', name: 'Bengal Gram (Chickpea)', soils: ['black', 'loamy', 'red'], seasons: ['rabi'], rainfall: ['low'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'October to November', waterNeeds: 'Low', duration: '100 to 120 days', tips: 'Treat seeds with Rhizobium culture before sowing.' } },
  { id: 'horse-gram', name: 'Horse Gram', soils: ['red', 'laterite', 'sandy'], seasons: ['rabi', 'summer'], rainfall: ['low'], water: ['rainfed only'], details: { sowingWindow: 'October to November (Rabi), Feb to March (Summer)', waterNeeds: 'Very Low', duration: '90 to 120 days', tips: 'Excellent catch crop. Requires almost no fertilizer.' } },
  { id: 'sesame', name: 'Sesame (Gingelly)', soils: ['sandy', 'loamy', 'red', 'laterite'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'June to July (Kharif), Feb to March (Summer)', waterNeeds: 'Low', duration: '90 to 110 days', tips: 'Sow in ridges to prevent water stagnation.' } },
  { id: 'mustard', name: 'Mustard', soils: ['loamy', 'red', 'sandy'], seasons: ['rabi'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'October to November', waterNeeds: 'Low to Medium', duration: '110 to 130 days', tips: 'Light irrigation at branching boosts seed yield.' } }
]

export default function RecommendForm() {
  const [inputs, setInputs] = useState({ soil: '', season: '', rainfall: '', water: '' })
  const [results, setResults] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const handleRecommend = (e) => {
    e.preventDefault()
    if (!inputs.soil || !inputs.season || !inputs.rainfall || !inputs.water) {
      alert('Please fill in all fields to get a recommendation.')
      return
    }
    const scoredResults = scoreCrops(inputs, crops)
    setResults(scoredResults)
    setHasSearched(true)
    setSelectedCrop(null)
    setSaveMsg('')
  }

  const handleSave = async () => {
    if (results.length === 0) return
    setSaving(true)
    setSaveMsg('')
    
    // Save the inputs and the top recommended crop name
    const { error } = await supabase.from('saved_lookups').insert({
      inputs: inputs,
      top_crop: results[0].name 
    })

    if (error) {
      setSaveMsg('Error saving. Please try again.')
    } else {
      setSaveMsg('Lookup saved successfully! ✅')
      setTimeout(() => setSaveMsg(''), 3000)
    }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h2 style={{ color: '#2d5016', marginBottom: '15px', fontSize: '20px' }}>Tell us about your field</h2>
        <form onSubmit={handleRecommend}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Soil Type</label>
            <select name="soil" value={inputs.soil} onChange={handleChange} required style={selectStyle}>
              <option value="">Select soil type</option>
              <option value="sandy">Sandy</option><option value="loamy">Loamy</option><option value="clay">Clay</option>
              <option value="black">Black</option><option value="red">Red</option><option value="laterite">Laterite</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Season</label>
            <select name="season" value={inputs.season} onChange={handleChange} required style={selectStyle}>
              <option value="">Select season</option>
              <option value="kharif">Kharif (Monsoon)</option><option value="rabi">Rabi (Winter)</option><option value="summer">Summer</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Rainfall Level</label>
            <select name="rainfall" value={inputs.rainfall} onChange={handleChange} required style={selectStyle}>
              <option value="">Select rainfall</option>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Water Availability</label>
            <select name="water" value={inputs.water} onChange={handleChange} required style={selectStyle}>
              <option value="">Select water availability</option>
              <option value="rainfed only">Rainfed only</option><option value="limited irrigation">Limited irrigation</option><option value="good irrigation">Good irrigation</option>
            </select>
          </div>
          <button type="submit" style={buttonStyle}>Get Recommendations</button>
        </form>
      </div>

      {hasSearched && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#2d5016', margin: 0 }}>
              {results.length > 0 ? `Top Recommendations (${results.length})` : 'No perfect matches found.'}
            </h3>
            {results.length > 0 && (
              <button onClick={handleSave} disabled={saving} style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                {saving ? 'Saving...' : '💾 Save Lookup'}
              </button>
            )}
          </div>
          
          {saveMsg && <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '15px' }}>{saveMsg}</p>}

          {results.map((crop) => (
            <div key={crop.id} onClick={() => setSelectedCrop(crop)} style={{ background: 'white', padding: '16px', borderRadius: '10px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', border: selectedCrop?.id === crop.id ? '2px solid #2d5016' : '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: '#1f2d1f', fontSize: '18px' }}>{crop.name}</h4>
                <span style={{ background: crop.score === 100 ? '#e8f3e0' : '#fff3cd', color: crop.score === 100 ? '#2d5016' : '#856404', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                  {crop.score}% Match
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>{crop.reasons.join(' • ')}</p>
            </div>
          ))}
        </div>
      )}

      {selectedCrop && (
        <div style={{ background: '#f0f7f0', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid #d0e8d0' }}>
          <h3 style={{ color: '#2d5016', marginBottom: '15px' }}>Growing Guidance: {selectedCrop.name}</h3>
          <div style={{ marginBottom: '12px' }}><strong style={{ fontSize: '14px', color: '#333' }}>Sowing Window:</strong><p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.sowingWindow}</p></div>
          <div style={{ marginBottom: '12px' }}><strong style={{ fontSize: '14px', color: '#333' }}>Water Needs:</strong><p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.waterNeeds}</p></div>
          <div style={{ marginBottom: '12px' }}><strong style={{ fontSize: '14px', color: '#333' }}>Duration:</strong><p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.duration}</p></div>
          <div><strong style={{ fontSize: '14px', color: '#333' }}>Key Tip:</strong><p style={{ margin: '4px 0 0 0', fontSize: '15px', fontStyle: 'italic' }}>{selectedCrop.details.tips}</p></div>
          <button onClick={() => setSelectedCrop(null)} style={{ marginTop: '15px', background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Close Details</button>
        </div>
      )}
    </div>
  )
}

const selectStyle = { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', background: 'white' }
const buttonStyle = { width: '100%', padding: '14px', background: '#2d5016', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }