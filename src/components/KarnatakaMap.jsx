import { useState } from 'react'
import { ComposableMap, Marker } from 'react-simple-maps'
import { crops } from '../data/crops' 
import CropDetailCard from './CropDetailCard' 

const cropEmojis = {
  'Paddy': '🌾', 'Ragi': '🌾', 'Jowar': '🌾', 'Maize': '🌽', 'Bajra': '🌾',
  'Groundnut': '🥜', 'Sunflower': '🌻', 'Sugarcane': '🎋', 'Cotton': '☁️',
  'Tur': '🫘', 'Bengal Gram': '🫘', 'Horse Gram': '🫘', 'Sesame': '🌱', 'Mustard': '🌼',
  'Tomato': '🍅', 'Onion': '🧅', 'Brinjal': '🍆', 'Chilli': '🌶️', 'Okra': '🥒',
  'Beans': '🫛', 'Carrot': '🥕', 'Cabbage': '🥬', 'Cauliflower': '🥦', 'Spinach': '🍃',
  'Pumpkin': '🎃', 'Cucumber': '🥒', 'Mango': '🥭', 'Banana': '🍌', 'Papaya': '🍈',
  'Guava': '🍐', 'Pomegranate': '🍎', 'Sapota': '🥝', 'Lime': '🍋',
  'Coconut': '🥥', 'Arecanut': '🌴', 'Coffee': '☕', 'Black Pepper': '🌶️',
  'Marigold': '🌼', 'Jasmine': '🌸', 'Rose': '🌹', 'Turmeric': '🟡', 'Ginger': '🫚',
  'Cardamom': '🌿', 'Mulberry': '🍃', 'Silkworm': '🐛', 'Wheat': '🌾'
}

const districts = {
  'Bengaluru Urban': { crops: ['Tomato', 'Carrot', 'Beans', 'Marigold'], soil: 'Red Loamy', rainfall: 'Medium' },
  'Mysuru': { crops: ['Sugarcane', 'Paddy', 'Arecanut'], soil: 'Red Loamy', rainfall: 'High' },
  'Belagavi': { crops: ['Sugarcane', 'Jowar', 'Groundnut'], soil: 'Black', rainfall: 'Medium' },
  'Dharwad': { crops: ['Cotton', 'Jowar', 'Chilli'], soil: 'Black', rainfall: 'Medium' },
  'Raichur': { crops: ['Paddy', 'Cotton', 'Tur'], soil: 'Black/Red', rainfall: 'Low' },
  'Kalaburagi': { crops: ['Tur', 'Jowar', 'Bengal Gram'], soil: 'Black', rainfall: 'Low' },
  'Bidar': { crops: ['Tur', 'Jowar', 'Sunflower'], soil: 'Black', rainfall: 'Low' },
  'Vijayapura': { crops: ['Jowar', 'Wheat', 'Sunflower'], soil: 'Black', rainfall: 'Low' },
  'Bagalkot': { crops: ['Sugarcane', 'Cotton', 'Jowar'], soil: 'Black', rainfall: 'Low' },
  'Gadag': { crops: ['Cotton', 'Jowar', 'Sunflower'], soil: 'Red/Black', rainfall: 'Low' },
  'Haveri': { crops: ['Paddy', 'Arecanut', 'Banana'], soil: 'Red', rainfall: 'Medium' },
  'Uttara Kannada': { crops: ['Paddy', 'Coconut', 'Arecanut'], soil: 'Laterite', rainfall: 'High' },
  'Shivamogga': { crops: ['Paddy', 'Arecanut', 'Coconut'], soil: 'Red/Black', rainfall: 'High' },
  'Dakshina Kannada': { crops: ['Paddy', 'Coconut', 'Arecanut'], soil: 'Laterite', rainfall: 'Very High' },
  'Udupi': { crops: ['Paddy', 'Coconut', 'Arecanut'], soil: 'Laterite', rainfall: 'Very High' },
  'Chikkamagaluru': { crops: ['Coffee', 'Paddy', 'Arecanut'], soil: 'Red', rainfall: 'High' },
  'Hassan': { crops: ['Coffee', 'Paddy', 'Arecanut'], soil: 'Red', rainfall: 'High' },
  'Kodagu': { crops: ['Coffee', 'Black Pepper', 'Paddy'], soil: 'Red', rainfall: 'Very High' },
  'Mandya': { crops: ['Sugarcane', 'Paddy', 'Ragi'], soil: 'Red/Black', rainfall: 'Medium' },
  'Tumakuru': { crops: ['Coconut', 'Arecanut', 'Ragi'], soil: 'Red', rainfall: 'Medium' },
  'Kolar': { crops: ['Mulberry', 'Groundnut', 'Tomato'], soil: 'Red', rainfall: 'Low' },
  'Chikkaballapura': { crops: ['Mulberry', 'Groundnut', 'Ragi'], soil: 'Red', rainfall: 'Low' },
  'Ramanagara': { crops: ['Mulberry', 'Groundnut', 'Ragi'], soil: 'Red', rainfall: 'Low' },
  'Chitradurga': { crops: ['Groundnut', 'Cotton', 'Jowar'], soil: 'Red', rainfall: 'Low' },
  'Davangere': { crops: ['Cotton', 'Groundnut', 'Paddy'], soil: 'Red/Black', rainfall: 'Medium' },
  'Ballari': { crops: ['Cotton', 'Paddy', 'Groundnut'], soil: 'Red/Black', rainfall: 'Low' },
  'Koppal': { crops: ['Cotton', 'Jowar', 'Paddy'], soil: 'Black/Red', rainfall: 'Low' },
  'Yadgir': { crops: ['Tur', 'Jowar', 'Paddy'], soil: 'Black', rainfall: 'Low' },
  'Chamarajanagara': { crops: ['Sugarcane', 'Silkworm', 'Paddy'], soil: 'Red', rainfall: 'Medium' }
}

const districtCoordinates = {
  'Bengaluru Urban': [77.59, 12.97], 'Mysuru': [76.64, 12.30], 'Belagavi': [74.50, 15.86],
  'Dharwad': [75.32, 15.46], 'Raichur': [77.35, 16.21], 'Kalaburagi': [76.80, 17.33],
  'Bidar': [77.53, 17.91], 'Vijayapura': [75.71, 16.83], 'Bagalkot': [75.69, 16.17],
  'Gadag': [75.62, 15.42], 'Haveri': [75.43, 14.56], 'Uttara Kannada': [74.50, 14.53],
  'Shivamogga': [75.56, 13.93], 'Dakshina Kannada': [75.25, 12.84], 'Udupi': [74.88, 13.34],
  'Chikkamagaluru': [75.77, 13.32], 'Hassan': [76.10, 13.00], 'Kodagu': [75.80, 12.42],
  'Mandya': [76.90, 12.52], 'Tumakuru': [77.10, 13.34], 'Kolar': [78.13, 13.14],
  'Chikkaballapura': [77.73, 13.43], 'Ramanagara': [77.28, 12.72], 'Chitradurga': [76.40, 14.22],
  'Davangere': [75.92, 14.46], 'Ballari': [76.92, 15.14], 'Koppal': [76.15, 15.35],
  'Yadgir': [77.14, 16.77], 'Chamarajanagara': [76.94, 11.92]
}

export default function KarnatakaMap() {
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [selectedCrop, setSelectedCrop] = useState(null)

  const activeData = selectedDistrict ? districts[selectedDistrict] : null

  // Helper to find the full crop object from the Master List
  const findCropObject = (cropName) => {
    return crops.find(c => c.name.toLowerCase().includes(cropName.toLowerCase()))
  }

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        FOR FARMERS IN KARNATAKA
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        Karnataka District Network
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Click on any green dot to reveal the major crops grown in that district. Click a crop card to see full details and save it!
      </p>

      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2500, center: [76.5, 13.5] }} style={{ width: '100%', height: '100%' }}>
          {Object.entries(districtCoordinates).map(([name, coords]) => (
            <Marker key={name} coordinates={coords} onClick={() => { setSelectedDistrict(name); setSelectedCrop(null); }}>
              <circle r={selectedDistrict === name ? 8 : 5} fill={selectedDistrict === name ? '#ef4444' : '#059669'} stroke="white" strokeWidth={1.5} style={{ transition: 'all 0.2s ease', cursor: 'pointer' }} />
              {selectedDistrict === name && (
                <text x={12} y={-12} style={{ fontSize: '14px', fontWeight: 'bold', fill: '#111827', fontFamily: 'sans-serif', pointerEvents: 'none' }}>{name}</text>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {activeData && !selectedCrop && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ color: '#059669', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
                {selectedDistrict} District
              </h3>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '15px' }}>
                Soil: <strong>{activeData.soil}</strong> • Rainfall: <strong>{activeData.rainfall}</strong>
              </p>
            </div>
            <button onClick={() => setSelectedDistrict(null)} style={{ background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Clear Selection
            </button>
          </div>

          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Major Crops Grown Here:
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {activeData.crops.map((cropName, idx) => {
              const fullCrop = findCropObject(cropName)
              return (
                <div 
                  key={idx} 
                  onClick={() => fullCrop && setSelectedCrop(fullCrop)}
                  style={{ 
                    background: 'white', padding: '24px 20px', borderRadius: '12px', border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center',
                    textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{cropEmojis[cropName] || '🌱'}</div>
                  <h5 style={{ margin: 0, color: '#111827', fontSize: '16px', fontWeight: '600' }}>{cropName}</h5>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selectedCrop && (
        <CropDetailCard 
          crop={selectedCrop} 
          onClose={() => setSelectedCrop(null)} 
          context={`${selectedDistrict} District Map`} 
        />
      )}
    </div>
  )
}