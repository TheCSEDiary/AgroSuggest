import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { crops } from '../data/crops'
import CropDetailCard from './CropDetailCard'

const categories = ['Field Crops', 'Vegetables', 'Fruits', 'Plantation Crops', 'Flowers & Spices']

export default function Catalogue() {
  const [selectedCrop, setSelectedCrop] = useState(null)

  const getChartData = (crop) => {
    const sameCategory = crops.filter(c => c.category === crop.category && c.id !== crop.id).slice(0, 4)
    return [
      { name: crop.name.split(' ')[0], water: crop.waterScore, fill: '#059669' },
      ...sameCategory.map(c => ({ name: c.name.split(' ')[0], water: c.waterScore, fill: '#d1d5db' }))
    ]
  }

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        FOR FARMERS IN KARNATAKA
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>Crop Catalogue</h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Browse our comprehensive guide. Tap on any crop below to see its growing requirements and data analysis.
      </p>

      {categories.map((category) => {
        const categoryCrops = crops.filter(crop => crop.category === category)
        
        return (
          <div key={category} style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #e5e7eb' }}>
              {category}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {categoryCrops.map((crop) => (
                <div 
                  key={crop.id} 
                  onClick={() => setSelectedCrop(crop)}
                  style={{ 
                    background: 'white', padding: '24px 20px', borderRadius: '12px', 
                    border: selectedCrop?.id === crop.id ? '2px solid #059669' : '1px solid #e5e7eb',
                    cursor: 'pointer', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                  }}
                >
                  <h4 style={{ margin: 0, color: '#111827', fontSize: '16px', fontWeight: '600' }}>{crop.name}</h4>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {selectedCrop && (
        <CropDetailCard crop={selectedCrop} onClose={() => setSelectedCrop(null)} context="Crop Catalogue">
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              💧 Relative Water Requirement Analysis
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getChartData(selectedCrop)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="water" radius={[4, 4, 0, 0]}>
                  {getChartData(selectedCrop).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '10px' }}>
              Comparison of water needs (Higher score = More water needed)
            </p>
          </div>
        </CropDetailCard>
      )}
    </div>
  )
}