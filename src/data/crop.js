// This is our master catalogue of crops suitable for Karnataka.
// Each crop has its requirements and growing details.

export const crops = [
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    soils: ['clay', 'loamy', 'laterite'],
    seasons: ['kharif', 'summer'],
    rainfall: ['medium', 'high'],
    water: ['limited irrigation', 'good irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Jan to Feb (Summer)',
      waterNeeds: 'High - requires standing water in early stages',
      duration: '110 to 140 days',
      tips: 'Ensure proper field leveling for uniform water. Transplanting healthy seedlings gives better yield.'
    }
  },
  {
    id: 'ragi',
    name: 'Ragi (Finger Millet)',
    soils: ['red', 'loamy', 'black', 'laterite'],
    seasons: ['kharif', 'summer'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July',
      waterNeeds: 'Low to Medium - highly drought tolerant',
      duration: '100 to 120 days',
      tips: 'Excellent for dryland farming. Do not let water stagnate; it harms the crop.'
    }
  },
  {
    id: 'jowar',
    name: 'Jowar (Sorghum)',
    soils: ['black', 'red', 'loamy'],
    seasons: ['kharif', 'rabi'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)',
      waterNeeds: 'Low - very drought resistant',
      duration: '110 to 130 days',
      tips: 'Rabi jowar needs residual soil moisture. Protect the crop from birds during grain filling.'
    }
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    soils: ['loamy', 'red', 'black'],
    seasons: ['kharif', 'rabi', 'summer'],
    rainfall: ['medium', 'high'],
    water: ['limited irrigation', 'good irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)',
      waterNeeds: 'Medium to High - critical at tasseling stage',
      duration: '90 to 110 days',
      tips: 'Needs well-drained soil. Ensure adequate nitrogen fertilizer for best cob size.'
    }
  },
  {
    id: 'bajra',
    name: 'Bajra (Pearl Millet)',
    soils: ['sandy', 'loamy', 'red'],
    seasons: ['kharif', 'rabi'],
    rainfall: ['low'],
    water: ['rainfed only'],
    details: {
      sowingWindow: 'June to July',
      waterNeeds: 'Very Low - thrives in arid conditions',
      duration: '80 to 100 days',
      tips: 'Best suited for sandy soils where other crops fail. Avoid waterlogging completely.'
    }
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    soils: ['sandy', 'loamy', 'red', 'laterite'],
    seasons: ['kharif', 'rabi', 'summer'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Dec to Jan (Summer)',
      waterNeeds: 'Low to Medium - needs moisture at pegging stage',
      duration: '110 to 130 days',
      tips: 'Apply gypsum at flowering to improve pod filling. Harvest before pods sprout in soil.'
    }
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    soils: ['black', 'red', 'loamy'],
    seasons: ['kharif', 'rabi'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Oct to Nov (Rabi)',
      waterNeeds: 'Medium - critical at head formation',
      duration: '90 to 110 days',
      tips: 'Keep bees nearby for better pollination. Harvest when the back of the head turns yellow.'
    }
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    soils: ['clay', 'loamy', 'black', 'red'],
    seasons: ['kharif', 'summer'],
    rainfall: ['high'],
    water: ['good irrigation'],
    details: {
      sowingWindow: 'Jan to Feb (Spring), June to July (Autumn)',
      waterNeeds: 'Very High - requires regular watering',
      duration: '12 to 18 months',
      tips: 'Earthing up (mounding soil around base) is crucial to prevent lodging (falling over).'
    }
  },
  {
    id: 'cotton',
    name: 'Cotton',
    soils: ['black', 'red', 'loamy'],
    seasons: ['kharif'],
    rainfall: ['medium'],
    water: ['limited irrigation', 'good irrigation'],
    details: {
      sowingWindow: 'April to May (with pre-monsoon showers)',
      waterNeeds: 'Medium - needs water during boll formation',
      duration: '150 to 180 days',
      tips: 'Monitor closely for bollworms. Maintain proper spacing for air circulation.'
    }
  },
  {
    id: 'tur',
    name: 'Tur (Pigeon Pea / Red Gram)',
    soils: ['red', 'black', 'loamy', 'laterite'],
    seasons: ['kharif', 'rabi'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Sept to Oct (Rabi)',
      waterNeeds: 'Low - deep roots help survive dry spells',
      duration: '150 to 180 days',
      tips: 'Prune the top 10cm after 45 days to encourage branching. Watch for pod borers.'
    }
  },
  {
    id: 'bengal-gram',
    name: 'Bengal Gram (Chickpea)',
    soils: ['black', 'loamy', 'red'],
    seasons: ['rabi'],
    rainfall: ['low'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'October to November',
      waterNeeds: 'Low - excess moisture causes fungal diseases',
      duration: '100 to 120 days',
      tips: 'Treat seeds with Rhizobium culture before sowing. Ensure good drainage in the field.'
    }
  },
  {
    id: 'horse-gram',
    name: 'Horse Gram',
    soils: ['red', 'laterite', 'sandy'],
    seasons: ['rabi', 'summer'],
    rainfall: ['low'],
    water: ['rainfed only'],
    details: {
      sowingWindow: 'October to November (Rabi), Feb to March (Summer)',
      waterNeeds: 'Very Low - grows well in poor soils',
      duration: '90 to 120 days',
      tips: 'Excellent catch crop. Requires almost no fertilizer or chemical inputs.'
    }
  },
  {
    id: 'sesame',
    name: 'Sesame (Gingelly)',
    soils: ['sandy', 'loamy', 'red', 'laterite'],
    seasons: ['kharif', 'rabi', 'summer'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'June to July (Kharif), Feb to March (Summer)',
      waterNeeds: 'Low - highly sensitive to waterlogging',
      duration: '90 to 110 days',
      tips: 'Sow in ridges to prevent water stagnation. Harvest when lower leaves turn yellow and drop.'
    }
  },
  {
    id: 'mustard',
    name: 'Mustard',
    soils: ['loamy', 'red', 'sandy'],
    seasons: ['rabi'],
    rainfall: ['low', 'medium'],
    water: ['rainfed only', 'limited irrigation'],
    details: {
      sowingWindow: 'October to November',
      waterNeeds: 'Low to Medium - needs moisture at flowering',
      duration: '110 to 130 days',
      tips: 'Light irrigation at branching and flowering stages boosts seed yield significantly.'
    }
  }
];