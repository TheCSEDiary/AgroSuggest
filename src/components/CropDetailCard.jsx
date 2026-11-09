import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { cropPrices } from '../data/prices'

export default function CropDetailCard({ crop, onClose, context = '', children }) {
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Pro-move: Stop the audio if the user closes the card or switches crops
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [crop]);

  const priceData = cropPrices[crop.id] || { msp: 'N/A', market: 'N/A', trend: 'stable' }

  const handleSave = async () => {
    setSaving(true)
    setMsg('')
    try {
      const { error } = await supabase.from('saved_lookups').insert({
        inputs: { context: context, soil: crop.soils[0] }, 
        top_crop: crop.name 
      })
      if (error) setMsg('Error saving. Check console.')
      else {
        setMsg('Saved to My Lookups successfully! ✅')
        setTimeout(() => setMsg(''), 3000)
      }
    } catch (err) { setMsg('Failed to save.') }
    setSaving(false)
  }

  // The Text-to-Speech Logic
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Construct a natural-sounding sentence
    const textToRead = `Growing guidance for ${crop.name}. 
                        Best soils: ${crop.soils.join(', ')}. 
                        Sowing window: ${crop.details.sowingWindow}. 
                        Water needs: ${crop.details.waterNeeds}. 
                        Duration: ${crop.details.duration}. 
                        Key tip: ${crop.details.tips}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1;
    utterance.lang = 'en-IN'; // Set to Indian English for Karnataka context!

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  return (
    <div style={{ background: '#f0f7f0', padding: '28px', borderRadius: '16px', marginTop: '30px', border: '1px solid #d0e8d0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#2d5016', margin: 0, fontSize: '22px', fontWeight: '600' }}>
          Growing Guidance: {crop.name}
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* --- NEW SPEAKER BUTTON --- */}
          <button 
            onClick={handleSpeak} 
            title={isSpeaking ? "Stop reading" : "Read aloud"}
            style={{ 
              background: isSpeaking ? '#dcfce7' : '#ffffff', 
              color: isSpeaking ? '#166534' : '#4b5563', 
              border: '1px solid #d1d5db', 
              padding: '8px 12px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
          </button>

          <button onClick={onClose} style={{ background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Close
          </button>
        </div>
      </div>
      
      <DetailRow label="Best Soils" value={crop.soils.join(', ')} />
      <DetailRow label="Sowing Window" value={crop.details.sowingWindow} />
      <DetailRow label="Water Needs" value={crop.details.waterNeeds} />
      <DetailRow label="Duration" value={crop.details.duration} />
      <DetailRow label="Key Tip" value={crop.details.tips} italic />

      {/* Financial Insights */}
      <div style={{ marginTop: '24px', background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#111827', textTransform: 'uppercase', letterSpacing: '1px' }}>
          💰 Financial Insights (₹ per Quintal)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Govt. MSP</p>
            <h3 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '24px', fontWeight: '700' }}>
              {priceData.msp === 0 ? 'N/A' : `₹${priceData.msp}`}
            </h3>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Avg. Market Price</p>
            <h3 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '24px', fontWeight: '700' }}>
              {priceData.market === 'N/A' ? 'N/A' : `₹${priceData.market}`}
            </h3>
            {priceData.trend && (
              <span style={{ fontSize: '12px', fontWeight: '600', color: priceData.trend === 'up' ? '#16a34a' : priceData.trend === 'down' ? '#dc2626' : '#ca8a04' }}>
                {priceData.trend === 'up' ? '📈 Rising' : priceData.trend === 'down' ? '📉 Falling' : '➡️ Stable'}
              </span>
            )}
          </div>
        </div>
        {priceData.note && <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Note: {priceData.note}</p>}
      </div>

      {children && <div style={{ marginTop: '24px' }}>{children}</div>}

      <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #d0e8d0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={handleSave} disabled={saving}
          style={{ background: saving ? '#9ca3af' : '#2d5016', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '15px' }}
        >
          {saving ? 'Saving...' : '💾 Save to My Lookups'}
        </button>
        {msg && <span style={{ color: msg.includes('Error') ? '#dc2626' : '#2d5016', fontWeight: '600', fontSize: '14px' }}>{msg}</span>}
      </div>
    </div>
  )
}

function DetailRow({ label, value, italic }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <strong style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</strong>
      <p style={{ margin: '6px 0 0 0', fontSize: '16px', color: '#1a1a1a', fontStyle: italic ? 'italic' : 'normal', lineHeight: '1.5' }}>{value}</p>
    </div>
  )
}