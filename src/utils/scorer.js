// This is the brain of the Recommendation Engine.
// It compares user inputs against the Master Crop List and assigns a score out of 100.

export function scoreCrops(inputs, crops) {
  return crops.map(crop => {
    let score = 0;
    let reasons = [];

    // 1. Soil Match (25 points)
    if (crop.soils.includes(inputs.soil)) {
      score += 25;
      reasons.push(`Thrives in ${inputs.soil} soil`);
    } else {
      reasons.push(`Not ideal for ${inputs.soil} soil`);
    }

    // 2. Season Match (25 points)
    if (crop.seasons.includes(inputs.season)) {
      score += 25;
      reasons.push(`Perfect for ${inputs.season} season`);
    } else {
      reasons.push(`Not recommended for ${inputs.season}`);
    }

    // 3. Rainfall Match (25 points)
    if (crop.rainfall.includes(inputs.rainfall)) {
      score += 25;
      reasons.push(`Matches ${inputs.rainfall} rainfall`);
    } else {
      reasons.push(`Requires different rainfall`);
    }

    // 4. Water Match (25 points)
    if (crop.water.includes(inputs.water)) {
      score += 25;
      reasons.push(`Fits ${inputs.water} setup`);
    } else {
      reasons.push(`Water needs mismatch`);
    }

    return {
      ...crop,
      score,
      reasons
    };
  })
  .sort((a, b) => b.score - a.score) // Sort highest score first
  .filter(crop => crop.score >= 50);  // Only show crops that match at least 2 criteria
}