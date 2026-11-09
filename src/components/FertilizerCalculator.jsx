import { useState } from 'react'

// Fertilizer & Seed Requirements per Acre for major Karnataka crops
const cropRequirements = {
  'paddy': { seeds: 20, urea: 100, dap: 50, mop: 25, note: 'Apply in 3 splits' },
  'ragi': { seeds: 5, urea: 80, dap: 40, mop: 20, note: 'Basal + top dressing' },
  'jowar': { seeds: 8, urea: 80, dap: 40, mop: 20, note: 'Rainfed: reduce by 25%' },
  'maize': { seeds: 10, urea: 120, dap: 60, mop: 30, note: 'High nitrogen feeder' },
  'groundnut': { seeds: 100, urea: 40, dap: 100, mop: 50, note: 'Gypsum @ 200kg/acre at pegging' },
  'sunflower': { seeds: 3, urea: 80, dap: 60, mop: 40, note: 'Boron application recommended' },
  'sugarcane': { seeds: 3000, urea: 200, dap: 100, mop: 100, note: 'Apply in 4-5 splits' },
  'cotton': { seeds: 2, urea: 120, dap: 80, mop: 60, note: 'Hybrid varieties need more N' },
  'tur': { seeds: 8, urea: 25, dap: 80, mop: 40, note: 'Low nitrogen, high phosphorus' },
  'tomato': { seeds: 0.2, urea: 100, dap: 100, mop: 60, note: 'Heavy feeder, add FYM 20t/acre' },
  'onion': { seeds: 4, urea: 100, dap: 80, mop: 60, note: 'Avoid excess nitrogen' },
  'chilli': { seeds: 0.4, urea: 100, dap: 100, mop: 60, note: 'Add micronutrients' },
  'coconut': { seeds: 60, urea: 300, dap: 140, mop: 300, note: 'Per acre (100 palms)' },
  'coffee': { seeds: 0, urea: 100, dap: 100, mop: 100, note: 'Per acre mature plantation' },
  'banana': { seeds: 650, urea: 200, dap: 200, mop: 300, note: 'Suckers count, high K needed' }
}

export default function FertilizerCalculator() {
  const [selectedCrop, setSelectedCrop] = useState('')
  const [acres, setAcres] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    if (!selectedCrop || !acres) return
    
    const req = cropRequirements[selectedCrop]
    const acreValue = parseFloat(acres)
    
    setResult({
      seeds: (req.seeds * acreValue).toFixed(2),
      urea: (req.urea * acreValue).toFixed(1),
      dap: (req.dap * acreValue).toFixed(1),
      mop: (req.mop * acreValue).toFixed(1),
      note: req.note
    })
  }

  const reset = () => {
    setSelectedCrop('')
    setAcres('')
    setResult(null)
  }

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        FARMING TOOLS
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        Fertilizer & Seed Calculator
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Calculate exact fertilizer and seed requirements for your farm. Enter your crop type and land size to get precise recommendations.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* INPUT SECTION */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '600', color: '#111827' }}>
            Enter Farm Details
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Select Crop
            </label>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px', background: 'white' }}
            >
              <option value="">-- Choose Crop --</option>
              <option value="paddy">Paddy (Rice)</option>
              <option value="ragi">Ragi (Finger Millet)</option>
              <option value="jowar">Jowar (Sorghum)</option>
              <option value="maize">Maize (Corn)</option>
              <option value="groundnut">Groundnut</option>
              <option value="sunflower">Sunflower</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="cotton">Cotton</option>
              <option value="tur">Tur (Pigeon Pea)</option>
              <option value="tomato">Tomato</option>
              <option value="onion">Onion</option>
              <option value="chilli">Chilli</option>
              <option value="coconut">Coconut</option>
              <option value="coffee">Coffee</option>
              <option value="banana">Banana</option>
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Land Size (in Acres)
            </label>
            <input 
              type="number" 
              step="0.1"
              min="0.1"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              placeholder="e.g., 2.5"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={calculate}
              disabled={!selectedCrop || !acres}
              style={{ 
                flex: 1, 
                padding: '14px', 
                background: (!selectedCrop || !acres) ? '#9ca3af' : '#059669', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: (!selectedCrop || !acres) ? 'not-allowed' : 'pointer', 
                fontWeight: '600', 
                fontSize: '15px' 
              }}
            >
              Calculate Requirements
            </button>
            <button 
              onClick={reset}
              style={{ 
                padding: '14px 24px', 
                background: '#f3f4f6', 
                color: '#374151', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '15px' 
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div style={{ background: '#f0fdf4', padding: '32px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
          {!result ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>🧮</div>
              <p style={{ fontSize: '16px' }}>Enter your farm details to see fertilizer requirements</p>
            </div>
          ) : (
            <div>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '600', color: '#059669' }}>
                Requirements for {acres} Acre(s)
              </h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <ResultCard label="Seeds Required" value={`${result.seeds} kg`} icon="🌱" color="#059669" />
                <ResultCard label="Urea (Nitrogen)" value={`${result.urea} kg`} icon="️" color="#2563eb" />
                <ResultCard label="DAP (Phosphorus)" value={`${result.dap} kg`} icon="🔬" color="#7c3aed" />
                <ResultCard label="MOP/Potash" value={`${result.mop} kg`} icon="🧪" color="#dc2626" />
              </div>

              {result.note && (
                <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#166534', fontWeight: '600' }}>
                    💡 Application Tip: {result.note}
                  </p>
                </div>
              )}

              <div style={{ marginTop: '24px', padding: '16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                  <strong>Note:</strong> These are general recommendations. For precise dosage, get your soil tested at the nearest Krishi Vigyan Kendra.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultCard({ label, value, icon, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontSize: '32px' }}>{icon}</div>
      <div>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{label}</p>
        <h4 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color }}>{value}</h4>
      </div>
    </div>
  )
}