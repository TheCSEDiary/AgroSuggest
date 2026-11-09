import { useState } from 'react'

const schemes = [
  {
    id: 1,
    title: 'PM-KISAN Samman Nidhi',
    tag: 'Central Govt',
    tagColor: '#2563eb',
    description: 'Income support scheme providing direct financial assistance to all landholding farmer families across the country.',
    eligibility: 'All landholding farmer families with cultivable landholding.',
    benefit: '₹6,000 per year in 3 equal installments.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    tag: 'Central Govt',
    tagColor: '#2563eb',
    description: 'Crop insurance scheme to support farmers in case of crop failure due to natural calamities, pests, or diseases.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
    benefit: 'Low premium rates (2% for Kharif, 1.5% for Rabi). Full claim settlement for crop loss.',
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 3,
    title: 'Rythu Bandhu (Karnataka Specific)',
    tag: 'State Govt',
    tagColor: '#059669',
    description: 'Investment support scheme to help farmers meet initial expenses for agriculture and horticulture crops.',
    eligibility: 'All farmers in Karnataka owning cultivable land.',
    benefit: '₹10,000 per acre per year for two crops.',
    link: '#'
  },
  {
    id: 4,
    title: 'Soil Health Card Scheme',
    tag: 'Central Govt',
    tagColor: '#2563eb',
    description: 'Provides farmers with a printed report containing the nutrient status of their soil and recommendations for fertilizers.',
    eligibility: 'All farmers across India.',
    benefit: 'Free soil testing and customized fertilizer recommendations to reduce costs and improve yield.',
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    id: 5,
    title: 'Kisan Credit Card (KCC)',
    tag: 'Financial',
    tagColor: '#9333ea',
    description: 'Provides farmers with timely and adequate credit for their agricultural needs at a highly subsidized interest rate.',
    eligibility: 'All farmers, fishermen, and animal husbandry farmers.',
    benefit: 'Credit limit up to ₹3 Lakhs at 4% interest rate (with subvention).',
    link: '#'
  },
  {
    id: 6,
    title: 'PM Krishi Sinchai Yojana (Micro Irrigation)',
    tag: 'Central Govt',
    tagColor: '#2563eb',
    description: 'Subsidy for installing drip and sprinkler irrigation systems to improve water use efficiency.',
    eligibility: 'All farmers installing micro-irrigation systems.',
    benefit: 'Up to 55% subsidy for small/marginal farmers and 45% for others.',
    link: '#'
  }
]

export default function GovtSchemes() {
  const [selectedScheme, setSelectedScheme] = useState(null)

  return (
    <div>
      <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
        FINANCIAL SUPPORT
      </p>
      <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '8px', lineHeight: '1.1' }}>
        Government Schemes Hub
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.6' }}>
        Explore active Central and Karnataka State Government agricultural schemes. Check your eligibility and apply directly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {schemes.map(scheme => (
          <div 
            key={scheme.id} 
            onClick={() => setSelectedScheme(scheme)}
            style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '16px', 
              border: selectedScheme?.id === scheme.id ? '2px solid #059669' : '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ background: scheme.tagColor, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                {scheme.tag}
              </span>
            </div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: '#111827' }}>
              {scheme.title}
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
              {scheme.description}
            </p>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                💰 {scheme.benefit}
              </p>
            </div>
            <button style={{ width: '100%', padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              View Details & Apply
            </button>
          </div>
        ))}
      </div>

      {/* MODAL FOR SELECTED SCHEME */}
      {selectedScheme && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedScheme(null)}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '500px', width: '90%', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedScheme(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            
            <span style={{ background: selectedScheme.tagColor, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
              {selectedScheme.tag}
            </span>
            <h2 style={{ margin: '12px 0', fontSize: '24px', fontWeight: '700', color: '#111827' }}>{selectedScheme.title}</h2>
            <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>{selectedScheme.description}</p>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Eligibility</h4>
              <p style={{ margin: 0, color: '#111827', fontWeight: '500' }}>{selectedScheme.eligibility}</p>
            </div>
            
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#059669', textTransform: 'uppercase' }}>Key Benefit</h4>
              <p style={{ margin: 0, color: '#065f46', fontWeight: '600', fontSize: '16px' }}>{selectedScheme.benefit}</p>
            </div>

            <a 
              href={selectedScheme.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', textAlign: 'center', padding: '14px', background: '#2d5016', color: 'white', textDecoration: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '16px' }}
            >
              Apply on Official Portal →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}