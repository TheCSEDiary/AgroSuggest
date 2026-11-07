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

const soilOptions = ['sandy', 'loamy', 'clay', 'black', 'red', 'laterite']
const seasonOptions = [
  { value: 'kharif', label: 'Kharif (June – October)' },
  { value: 'rabi', label: 'Rabi (October – February)' },
  { value: 'summer', label: 'Summer (February – May)' }
]
const rainfallOptions = ['low', 'medium', 'high']
const waterOptions = ['rainfed only', 'limited irrigation', 'good irrigation']

export default function RecommendForm() {
  const [inputs, setInputs] = useState({ soil: '', season: '', rainfall: '', water: '' })
  const [results, setResults] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value })
  }

  const handleRecommend = () => {
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
    <div>
            {/* --- HERO SECTION --- */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ 
          color: '#059669', 
          fontSize: '13px', 
          fontWeight: '700', 
          letterSpacing: '1.5px', 
          marginBottom: '16px',
          textTransform: 'uppercase',
          margin: 0
        }}>
          FOR FARMERS IN INDIA
        </p>
        
        <h1 style={{ 
          fontSize: '52px', 
          fontWeight: '700', 
          color: '#111827', 
          lineHeight: '1.1', 
          margin: '0 0 10px 0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          Tell us about your field.
        </h1>
        
        <h1 style={{ 
          fontSize: '52px', 
          fontWeight: '700', 
          color: '#065f46', 
          lineHeight: '1.1', 
          margin: '0 0 24px 0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          We'll tell you what to sow.
        </h1>
        
        <p style={{ 
          fontSize: '18px', 
          color: '#4b5563', 
          maxWidth: '600px', 
          lineHeight: '1.6', 
          margin: 0 
        }}>
          Four simple questions about your soil, season, rainfall and water. We compare them with the major crops grown across Karnataka and rank the ones that fit best.
        </p>
      </div>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
        
        {/* LEFT: FORM */}
        <div style={{ 
          background: 'white', 
          padding: '32px', 
          borderRadius: '16px', 
          border: '1px solid #eee',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          
          {/* Soil Type */}
          <SectionTitle>SOIL TYPE</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {soilOptions.map(soil => (
              <OptionButton 
                key={soil} 
                selected={inputs.soil === soil} 
                onClick={() => handleChange('soil', soil)}
              >
                {soil.charAt(0).toUpperCase() + soil.slice(1)}
              </OptionButton>
            ))}
          </div>

          {/* Season */}
          <SectionTitle>SEASON</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {seasonOptions.map(season => (
              <OptionButton 
                key={season.value} 
                selected={inputs.season === season.value} 
                onClick={() => handleChange('season', season.value)}
              >
                {season.label}
              </OptionButton>
            ))}
          </div>

          {/* Rainfall */}
          <SectionTitle>RAINFALL</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {rainfallOptions.map(r => (
              <OptionButton 
                key={r} 
                selected={inputs.rainfall === r} 
                onClick={() => handleChange('rainfall', r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </OptionButton>
            ))}
          </div>

          {/* Water */}
          <SectionTitle>WATER AVAILABILITY</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {waterOptions.map(w => (
              <OptionButton 
                key={w} 
                selected={inputs.water === w} 
                onClick={() => handleChange('water', w)}
              >
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </OptionButton>
            ))}
          </div>

          <button 
            onClick={handleRecommend}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: '#2d5016', 
              color: 'white', 
              border: 'none', 
              borderRadius: '10px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Get Recommendations
          </button>
        </div>

        {/* RIGHT: INFO CARD */}
        <div style={{ 
          background: '#f5f3ef', 
          padding: '28px', 
          borderRadius: '16px',
          border: '1px solid #e8e4dd'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginTop: 0, marginBottom: '12px' }}>
            Grown widely in Karnataka
          </h3>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
            Our catalogue covers the state's main field crops — from rainfed ragi in the south to sugarcane and paddy in the irrigated belts.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Ragi', 'Jowar', 'Paddy', 'Groundnut', 'Cotton', 'Tur', 'Bengal gram'].map(crop => (
              <li key={crop} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '8px 0', 
                fontSize: '15px', 
                color: '#333' 
              }}>
                <span style={{ width: '8px', height: '8px', background: '#2d5016', borderRadius: '50%' }}></span>
                {crop}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      {hasSearched && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              {results.length > 0 ? `Top Recommendations (${results.length})` : 'No perfect matches found'}
            </h2>
            {results.length > 0 && (
              <button 
                onClick={handleSave} 
                disabled={saving} 
                style={{ 
                  background: '#2d5016', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {saving ? 'Saving...' : '💾 Save Lookup'}
              </button>
            )}
          </div>
          
          {saveMsg && <p style={{ color: '#2d5016', fontWeight: '600', marginBottom: '20px' }}>{saveMsg}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {results.map((crop) => (
              <div 
                key={crop.id} 
                onClick={() => setSelectedCrop(crop)}
                style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: selectedCrop?.id === crop.id ? '2px solid #2d5016' : '1px solid #eee',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>{crop.name}</h4>
                  <span style={{ 
                    background: crop.score === 100 ? '#e8f3e0' : '#fff3cd', 
                    color: crop.score === 100 ? '#2d5016' : '#856404', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontWeight: '600',
                    fontSize: '13px'
                  }}>
                    {crop.score}% Match
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                  {crop.reasons.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CROP DETAIL --- */}
      {selectedCrop && (
        <div style={{ 
          background: '#f0f7f0', 
          padding: '28px', 
          borderRadius: '16px', 
          marginTop: '30px', 
          border: '1px solid #d0e8d0' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2d5016', margin: 0, fontSize: '22px', fontWeight: '600' }}>
              Growing Guidance: {selectedCrop.name}
            </h3>
            <button 
              onClick={() => setSelectedCrop(null)} 
              style={{ background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
            >
              Close
            </button>
          </div>
          
          <DetailRow label="Sowing Window" value={selectedCrop.details.sowingWindow} />
          <DetailRow label="Water Needs" value={selectedCrop.details.waterNeeds} />
          <DetailRow label="Duration" value={selectedCrop.details.duration} />
          <DetailRow label="Key Tip" value={selectedCrop.details.tips} italic />
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 style={{ 
      fontSize: '12px', 
      fontWeight: '700', 
      color: '#1a1a1a', 
      letterSpacing: '1.5px', 
      marginBottom: '12px',
      textTransform: 'uppercase'
    }}>
      {children}
    </h3>
  )
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 12px',
        background: selected ? '#f0f7f0' : 'white',
        color: selected ? '#2d5016' : '#333',
        border: selected ? '2px solid #2d5016' : '1px solid #ddd',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: selected ? '600' : '500',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </button>
  )
}

function DetailRow({ label, value, italic }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <strong style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</strong>
      <p style={{ margin: '6px 0 0 0', fontSize: '16px', color: '#1a1a1a', fontStyle: italic ? 'italic' : 'normal', lineHeight: '1.5' }}>
        {value}
      </p>
    </div>
  )
}