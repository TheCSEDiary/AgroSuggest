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
  { id: 'mustard', name: 'Mustard', soils: ['loamy', 'red', 'sandy'], seasons: ['rabi'], rainfall: ['low', 'medium'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'October to November', waterNeeds: 'Low to Medium', duration: '110 to 130 days', tips: 'Light irrigation at branching boosts seed yield.' } },
  { id: 'tomato', name: 'Tomato', soils: ['loamy', 'red', 'black'], seasons: ['rabi', 'summer'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov (Rabi), Jan-Feb (Summer)', waterNeeds: 'Medium - requires regular watering', duration: '90 to 120 days', tips: 'Stake the plants to keep fruits off the ground.' } },
  { id: 'onion', name: 'Onion', soils: ['loamy', 'red', 'black'], seasons: ['kharif', 'rabi'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov (Rabi), Jun-Jul (Kharif)', waterNeeds: 'Medium - stop watering before harvest', duration: '120 to 150 days', tips: 'Onion maggot is a common pest; use crop rotation.' } },
  { id: 'brinjal', name: 'Brinjal (Eggplant)', soils: ['loamy', 'red', 'black'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jun-Jul (Kharif), Oct-Nov (Rabi)', waterNeeds: 'Medium to High', duration: '100 to 140 days', tips: 'Remove side shoots to encourage larger fruits.' } },
  { id: 'chilli', name: 'Chilli', soils: ['loamy', 'red', 'black'], seasons: ['kharif', 'rabi'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jun-Jul (Kharif), Oct-Nov (Rabi)', waterNeeds: 'Medium - avoid waterlogging', duration: '120 to 150 days', tips: 'Spray neem oil to prevent aphid attacks.' } },
  { id: 'okra', name: 'Okra (Bhendi)', soils: ['loamy', 'red', 'sandy'], seasons: ['kharif', 'summer'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Feb-Mar (Summer), Jun-Jul (Kharif)', waterNeeds: 'Medium', duration: '45 to 60 days', tips: 'Harvest pods when they are 3-4 inches long for best taste.' } },
  { id: 'beans', name: 'Beans (French Beans)', soils: ['loamy', 'red', 'black'], seasons: ['rabi', 'summer'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov (Rabi), Jan-Feb (Summer)', waterNeeds: 'Medium', duration: '50 to 60 days', tips: 'Pick beans regularly to encourage more flowering.' } },
  { id: 'carrot', name: 'Carrot', soils: ['sandy', 'loamy'], seasons: ['rabi'], rainfall: ['low'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov', waterNeeds: 'Medium - keep soil consistently moist', duration: '70 to 90 days', tips: 'Sandy loam soil is best for straight, long roots.' } },
  { id: 'cabbage', name: 'Cabbage', soils: ['loamy', 'clay', 'black'], seasons: ['rabi'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Sep-Oct', waterNeeds: 'High - requires regular watering', duration: '90 to 120 days', tips: 'Watch out for cabbage butterflies and their caterpillars.' } },
  { id: 'cauliflower', name: 'Cauliflower', soils: ['loamy', 'clay', 'black'], seasons: ['rabi'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Sep-Oct', waterNeeds: 'High', duration: '90 to 120 days', tips: 'Tie the outer leaves over the curd to keep it white.' } },
  { id: 'spinach', name: 'Spinach (Palak)', soils: ['loamy', 'sandy', 'red'], seasons: ['rabi', 'summer'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov (Rabi), Feb-Mar (Summer)', waterNeeds: 'Medium', duration: '30 to 45 days', tips: 'Harvest outer leaves first to allow the center to keep growing.' } },
  { id: 'pumpkin', name: 'Pumpkin', soils: ['loamy', 'sandy', 'red'], seasons: ['kharif', 'summer'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jan-Feb (Summer), Jun-Jul (Kharif)', waterNeeds: 'Medium to High', duration: '90 to 120 days', tips: 'Allow vines to spread; they need a lot of space.' } },
  { id: 'cucumber', name: 'Cucumber', soils: ['loamy', 'sandy'], seasons: ['summer', 'rabi'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Feb-Mar (Summer), Oct-Nov (Rabi)', waterNeeds: 'High - requires frequent watering', duration: '50 to 70 days', tips: 'Provide a trellis for the vines to climb.' } },
  { id: 'mango', name: 'Mango', soils: ['loamy', 'red', 'laterite'], seasons: ['summer'], rainfall: ['medium', 'high'], water: ['good irrigation', 'rainfed only'], details: { sowingWindow: 'Jun-Jul (Monsoon planting)', waterNeeds: 'Low once established, High when young', duration: '3 to 5 years to bear fruit', tips: 'Prune dead branches after harvest to encourage new growth.' } },
  { id: 'banana', name: 'Banana', soils: ['loamy', 'clay', 'black'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['high'], water: ['good irrigation'], details: { sowingWindow: 'Year-round (Best: Jun-Jul or Oct-Nov)', waterNeeds: 'Very High - requires daily watering', duration: '11 to 15 months', tips: 'Remove side suckers to direct energy to the main plant.' } },
  { id: 'papaya', name: 'Papaya', soils: ['loamy', 'sandy', 'red'], seasons: ['kharif', 'summer'], rainfall: ['medium', 'high'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jun-Jul (Kharif), Feb-Mar (Summer)', waterNeeds: 'High - but no waterlogging', duration: '9 to 12 months', tips: 'Plant in raised beds to prevent root rot.' } },
  { id: 'guava', name: 'Guava', soils: ['loamy', 'red', 'black', 'laterite'], seasons: ['summer'], rainfall: ['low', 'medium', 'high'], water: ['rainfed only', 'limited irrigation'], details: { sowingWindow: 'Aug-Sep (Monsoon planting)', waterNeeds: 'Low to Medium', duration: '2 to 3 years to bear fruit', tips: 'Bag the fruits when they are marble-sized to protect from fruit flies.' } },
  { id: 'pomegranate', name: 'Pomegranate', soils: ['loamy', 'red', 'black'], seasons: ['summer'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Feb-Mar or Jul-Aug', waterNeeds: 'Low - highly drought tolerant', duration: '2 to 3 years to bear fruit', tips: 'Prune heavily after harvest to encourage new fruiting branches.' } },
  { id: 'sapota', name: 'Sapota (Chikoo)', soils: ['loamy', 'red', 'black', 'laterite'], seasons: ['summer'], rainfall: ['medium', 'high'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jun-Jul (Monsoon planting)', waterNeeds: 'Medium', duration: '3 to 4 years to bear fruit', tips: 'Grafting is highly recommended for better fruit quality.' } },
  { id: 'lime', name: 'Lime / Lemon', soils: ['loamy', 'red', 'sandy'], seasons: ['summer'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Feb-Mar or Aug-Sep', waterNeeds: 'Medium', duration: '2 to 3 years to bear fruit', tips: 'Apply lime to the soil if the leaves start turning yellow.' } },
  { id: 'coconut', name: 'Coconut', soils: ['sandy', 'loamy', 'laterite'], seasons: ['summer'], rainfall: ['high'], water: ['good irrigation', 'rainfed only'], details: { sowingWindow: 'May-Jun (Pre-monsoon)', waterNeeds: 'High - thrives in coastal humidity', duration: '5 to 7 years to bear fruit', tips: 'Grow leguminous cover crops between palms to improve soil.' } },
  { id: 'arecanut', name: 'Arecanut (Betel Nut)', soils: ['loamy', 'red', 'laterite'], seasons: ['summer'], rainfall: ['high'], water: ['good irrigation'], details: { sowingWindow: 'May-Jun', waterNeeds: 'High - requires shade when young', duration: '4 to 5 years to bear fruit', tips: 'Intercrop with banana or pepper for extra income.' } },
  { id: 'coffee', name: 'Coffee', soils: ['loamy', 'red', 'laterite'], seasons: ['kharif'], rainfall: ['high'], water: ['good irrigation', 'rainfed only'], details: { sowingWindow: 'May-Jun', waterNeeds: 'High - needs shade', duration: '3 to 4 years to bear fruit', tips: 'Shade-grown coffee produces higher quality beans.' } },
  { id: 'black-pepper', name: 'Black Pepper', soils: ['loamy', 'red', 'laterite'], seasons: ['kharif'], rainfall: ['high'], water: ['good irrigation', 'rainfed only'], details: { sowingWindow: 'May-Jun (Monsoon)', waterNeeds: 'High - requires a support tree', duration: '3 to 4 years to bear fruit', tips: 'Train the vines up areca or coconut palms.' } },
  { id: 'marigold', name: 'Marigold', soils: ['loamy', 'red', 'sandy'], seasons: ['kharif', 'rabi', 'summer'], rainfall: ['low', 'medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Year-round (Best: Oct-Nov)', waterNeeds: 'Medium', duration: '45 to 60 days', tips: 'Pinch the tips to encourage bushier growth and more flowers.' } },
  { id: 'jasmine', name: 'Jasmine (Mallige)', soils: ['loamy', 'red', 'laterite'], seasons: ['kharif', 'rabi'], rainfall: ['medium', 'high'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Jun-Jul or Oct-Nov', waterNeeds: 'Medium to High', duration: 'Perennial (Flowers in 1 year)', tips: 'Prune after the main flowering season to encourage new blooms.' } },
  { id: 'rose', name: 'Rose', soils: ['loamy', 'clay'], seasons: ['rabi'], rainfall: ['medium'], water: ['limited irrigation', 'good irrigation'], details: { sowingWindow: 'Oct-Nov', waterNeeds: 'Medium - water at the base, not leaves', duration: 'Perennial (Flowers in 3-4 months)', tips: 'Use neem oil spray to prevent black spot and aphids.' } },
  { id: 'turmeric', name: 'Turmeric', soils: ['loamy', 'red', 'black', 'laterite'], seasons: ['kharif'], rainfall: ['high'], water: ['good irrigation'], details: { sowingWindow: 'Jun-Jul', waterNeeds: 'High - requires well-drained soil', duration: '7 to 9 months', tips: 'Harvest when the leaves start drying and turning yellow.' } },
  { id: 'ginger', name: 'Ginger', soils: ['loamy', 'red', 'laterite'], seasons: ['kharif'], rainfall: ['high'], water: ['good irrigation'], details: { sowingWindow: 'May-Jun', waterNeeds: 'High - thrives in shade', duration: '6 to 8 months', tips: 'Intercrop with arecanut or coconut for natural shade.' } },
  { id: 'cardamom', name: 'Cardamom', soils: ['loamy', 'red', 'laterite'], seasons: ['kharif'], rainfall: ['high'], water: ['good irrigation', 'rainfed only'], details: { sowingWindow: 'May-Jun', waterNeeds: 'High - needs heavy shade', duration: '3 years to bear fruit', tips: 'Only grows well in the hilly, shaded regions of Karnataka.' } }
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
  const [voiceText, setVoiceText] = useState('')
  const [listening, setListening] = useState(false)

  // --- VOICE COMMAND LOGIC ---
  const handleVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported. Please use Chrome.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setListening(true);
    setVoiceText('Listening...');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceText(`Heard: "${transcript}"`);
      setListening(false);
      
      // Smart keyword matching
      if (transcript.includes('black')) setInputs(prev => ({...prev, soil: 'black'}));
      else if (transcript.includes('red')) setInputs(prev => ({...prev, soil: 'red'}));
      else if (transcript.includes('loamy')) setInputs(prev => ({...prev, soil: 'loamy'}));
      else if (transcript.includes('clay')) setInputs(prev => ({...prev, soil: 'clay'}));
      else if (transcript.includes('sandy')) setInputs(prev => ({...prev, soil: 'sandy'}));
      else if (transcript.includes('laterite')) setInputs(prev => ({...prev, soil: 'laterite'}));
      
      if (transcript.includes('kharif')) setInputs(prev => ({...prev, season: 'kharif'}));
      else if (transcript.includes('rabi')) setInputs(prev => ({...prev, season: 'rabi'}));
      else if (transcript.includes('summer')) setInputs(prev => ({...prev, season: 'summer'}));
      
      if (transcript.includes('medium')) setInputs(prev => ({...prev, rainfall: 'medium'}));
      else if (transcript.includes('high')) setInputs(prev => ({...prev, rainfall: 'high'}));
      else if (transcript.includes('low')) setInputs(prev => ({...prev, rainfall: 'low'}));
      
      if (transcript.includes('limited')) setInputs(prev => ({...prev, water: 'limited irrigation'}));
      else if (transcript.includes('good')) setInputs(prev => ({...prev, water: 'good irrigation'}));
      else if (transcript.includes('rainfed')) setInputs(prev => ({...prev, water: 'rainfed only'}));
    };

    recognition.onerror = (event) => {
      setVoiceText('Error: ' + event.error);
      setListening(false);
    };
    
    recognition.onend = () => setListening(false);
  }

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
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: '#059669', fontSize: '13px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '16px', textTransform: 'uppercase', margin: 0 }}>
          FOR FARMERS IN KARNATAKA
        </p>
        <h1 style={{ fontSize: '52px', fontWeight: '700', color: '#111827', lineHeight: '1.1', margin: '0 0 10px 0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Tell us about your field.
        </h1>
        <h1 style={{ fontSize: '52px', fontWeight: '700', color: '#065f46', lineHeight: '1.1', margin: '0 0 24px 0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          We'll tell you what to sow.
        </h1>
        <p style={{ fontSize: '18px', color: '#4b5563', maxWidth: '600px', lineHeight: '1.6', margin: 0 }}>
          Four simple questions about your soil, season, rainfall and water. We compare them with the major crops grown across Karnataka and rank the ones that fit best.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <SectionTitle>Soil Type</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {soilOptions.map(soil => (
              <OptionButton key={soil} selected={inputs.soil === soil} onClick={() => handleChange('soil', soil)}>
                {soil.charAt(0).toUpperCase() + soil.slice(1)}
              </OptionButton>
            ))}
          </div>

          <SectionTitle>Season</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {seasonOptions.map(season => (
              <OptionButton key={season.value} selected={inputs.season === season.value} onClick={() => handleChange('season', season.value)}>
                {season.label}
              </OptionButton>
            ))}
          </div>

          <SectionTitle>Rainfall</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {rainfallOptions.map(r => (
              <OptionButton key={r} selected={inputs.rainfall === r} onClick={() => handleChange('rainfall', r)}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </OptionButton>
            ))}
          </div>

          <SectionTitle>Water Availability</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {waterOptions.map(w => (
              <OptionButton key={w} selected={inputs.water === w} onClick={() => handleChange('water', w)}>
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </OptionButton>
            ))}
          </div>

          {/* --- VOICE COMMAND BUTTON --- */}
          <button 
            onClick={handleVoiceCommand}
            type="button"
            disabled={listening}
            style={{ 
              width: '100%', padding: '14px', marginBottom: '8px', 
              background: listening ? '#dcfce7' : 'white', 
              color: '#059669', border: '2px solid #059669', borderRadius: '10px', 
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.2s'
            }}
          >
            {listening ? '🎙️ Listening...' : '🎙️ Use Voice Command'}
          </button>
          
          {/* Shows what the AI heard */}
          {voiceText && (
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#059669', marginBottom: '20px', fontStyle: 'italic', minHeight: '20px' }}>
              {voiceText}
            </p>
          )}

          <button onClick={handleRecommend} style={{ width: '100%', padding: '16px', background: '#2d5016', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}>
            Get Recommendations
          </button>
        </div>

        <div style={{ background: '#f5f3ef', padding: '28px', borderRadius: '16px', border: '1px solid #e8e4dd' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginTop: 0, marginBottom: '12px' }}>
            Grown widely in Karnataka
          </h3>
          <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
            Our catalogue covers the state's main field crops — from rainfed ragi in the south to sugarcane and paddy in the irrigated belts.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Ragi', 'Jowar', 'Paddy', 'Groundnut', 'Cotton', 'Tur', 'Bengal gram'].map(crop => (
              <li key={crop} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', fontSize: '15px', color: '#333' }}>
                <span style={{ width: '8px', height: '8px', background: '#2d5016', borderRadius: '50%' }}></span>
                {crop}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {hasSearched && (
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
              {results.length > 0 ? `Top Recommendations (${results.length})` : 'No perfect matches found'}
            </h2>
            {results.length > 0 && (
              <button onClick={handleSave} disabled={saving} style={{ background: '#2d5016', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                {saving ? 'Saving...' : '💾 Save Lookup'}
              </button>
            )}
          </div>
          {saveMsg && <p style={{ color: '#2d5016', fontWeight: '600', marginBottom: '20px' }}>{saveMsg}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {results.map((crop) => (
              <div key={crop.id} onClick={() => setSelectedCrop(crop)} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: selectedCrop?.id === crop.id ? '2px solid #2d5016' : '1px solid #eee', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, color: '#1a1a1a', fontSize: '18px', fontWeight: '600' }}>{crop.name}</h4>
                  <span style={{ background: crop.score === 100 ? '#e8f3e0' : '#fff3cd', color: crop.score === 100 ? '#2d5016' : '#856404', padding: '4px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px' }}>
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

      {selectedCrop && (
        <div style={{ background: '#f0f7f0', padding: '28px', borderRadius: '16px', marginTop: '30px', border: '1px solid #d0e8d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#2d5016', margin: 0, fontSize: '22px', fontWeight: '600' }}>
              Growing Guidance: {selectedCrop.name}
            </h3>
            <button onClick={() => setSelectedCrop(null)} style={{ background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
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
  return <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '1.5px', marginBottom: '12px', textTransform: 'uppercase' }}>{children}</h3>
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '14px 12px', background: selected ? '#f0f7f0' : 'white', color: selected ? '#2d5016' : '#333', border: selected ? '2px solid #2d5016' : '1px solid #ddd', borderRadius: '10px', fontSize: '14px', fontWeight: selected ? '600' : '500', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </button>
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