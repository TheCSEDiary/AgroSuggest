import { useState } from 'react'

// We put the data directly here to avoid any file import glitches
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

export default function Catalogue() {
  const [selectedCrop, setSelectedCrop] = useState(null)

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '10px' }}>
      <h2 style={{ color: '#2d5016', marginBottom: '15px' }}>Crop Catalogue</h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Tap on any crop below to see its growing requirements and tips.
      </p>

      {/* List of all crops */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
        {crops.map((crop) => (
          <div 
            key={crop.id} 
            onClick={() => setSelectedCrop(crop)}
            style={{ 
              background: 'white', 
              padding: '16px', 
              borderRadius: '10px', 
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)', 
              cursor: 'pointer', 
              textAlign: 'center',
              border: '1px solid #eee',
              transition: 'transform 0.1s'
            }}
          >
            <h4 style={{ margin: 0, color: '#2d5016', fontSize: '16px' }}>{crop.name}</h4>
          </div>
        ))}
      </div>

      {/* Detail View when a crop is tapped */}
      {selectedCrop && (
        <div style={{ background: '#f0f7f0', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid #d0e8d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#2d5016', margin: 0 }}>Growing Guidance: {selectedCrop.name}</h3>
            <button onClick={() => setSelectedCrop(null)} style={{ background: '#666', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>Best Soils:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.soils.join(', ')}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>Seasons:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.seasons.join(', ')}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>Sowing Window:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.sowingWindow}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>Water Needs:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.waterNeeds}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#333' }}>Duration:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px' }}>{selectedCrop.details.duration}</p>
          </div>
          <div>
            <strong style={{ fontSize: '14px', color: '#333' }}>Key Tip:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '15px', fontStyle: 'italic' }}>{selectedCrop.details.tips}</p>
          </div>
        </div>
      )}
    </div>
  )
}