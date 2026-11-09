import { useState } from 'react'
import { crops } from '../data/crops'
import { cropPrices } from '../data/prices'

export default function CropComparator() {
  const [crop1Id, setCrop1Id] = useState('')
  const [crop2Id, setCrop2Id] = useState('')

  const crop1 = crops.find(c => c.id === crop1Id)
  const crop2 = crops.find(c => c.id === crop2Id)
  const price1 = crop1 ? cropPrices[crop1.id] : null
  const price2 = crop2 ? cropPrices[crop2.id] : null

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        DECISION MAKING TOOL
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        Crop Comparison
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Select two crops to compare their agricultural requirements and financial potential side-by-side.
      </p>

      {/* SELECTORS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <select value={crop1Id} onChange={(e) => setCrop1Id(e.target.value)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '16px', fontWeight: '600', background: 'white' }}>
          <option value="">Select First Crop</option>
          {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={crop2Id} onChange={(e) => setCrop2Id(e.target.value)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '16px', fontWeight: '600', background: 'white' }}>
          <option value="">Select Second Crop</option>
          {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* COMPARISON GRID */}
      {crop1 && crop2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 1fr', gap: '1px', background: '#e5e7eb', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          
          {/* Headers */}
          <div style={{ background: '#f9fafb', padding: '24px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>Feature</div>
          <div style={{ background: '#f0fdf4', padding: '24px', fontWeight: '700', color: '#059669', fontSize: '18px' }}>{crop1.name}</div>
          <div style={{ background: '#eff6ff', padding: '24px', fontWeight: '700', color: '#2563eb', fontSize: '18px' }}>{crop2.name}</div>

          {/* Rows */}
          <ComparisonRow label="Best Soils" val1={crop1.soils.join(', ')} val2={crop2.soils.join(', ')} />
          <ComparisonRow label="Seasons" val1={crop1.seasons.join(', ')} val2={crop2.seasons.join(', ')} />
          <ComparisonRow label="Rainfall" val1={crop1.rainfall.join(', ')} val2={crop2.rainfall.join(', ')} />
          <ComparisonRow label="Water Needs" val1={crop1.details.waterNeeds} val2={crop2.details.waterNeeds} />
          <ComparisonRow label="Duration" val1={crop1.details.duration} val2={crop2.details.duration} />
          
          <ComparisonRow 
            label="Govt. MSP" 
            val1={price1?.msp ? `₹${price1.msp}/q` : 'N/A'} 
            val2={price2?.msp ? `₹${price2.msp}/q` : 'N/A'} 
            highlight
          />
          <ComparisonRow 
            label="Market Price" 
            val1={price1?.market ? `₹${price1.market}/q` : 'N/A'} 
            val2={price2?.market ? `₹${price2.market}/q` : 'N/A'} 
            highlight
          />
        </div>
      )}
    </div>
  )
}

function ComparisonRow({ label, val1, val2, highlight }) {
  return (
    <>
      <div style={{ background: 'white', padding: '20px 24px', fontWeight: '600', color: '#374151', display: 'flex', alignItems: 'center' }}>{label}</div>
      <div style={{ background: 'white', padding: '20px 24px', color: highlight ? '#059669' : '#111827', fontWeight: highlight ? '700' : '400', fontSize: '15px' }}>{val1}</div>
      <div style={{ background: 'white', padding: '20px 24px', color: highlight ? '#2563eb' : '#111827', fontWeight: highlight ? '700' : '400', fontSize: '15px' }}>{val2}</div>
    </>
  )
}