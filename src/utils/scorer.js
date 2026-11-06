// This file contains the rule-based scoring logic.
// It compares the farmer's inputs against each crop's requirements
// and returns a ranked list with match scores and reasons.

/**
 * Scores a single crop against the farmer's inputs.
 * Each of the 4 categories (soil, season, rainfall, water) is worth 25 points.
 * Total possible score: 100.
 */
function scoreOneCrop(crop, inputs) {
  let score = 0;
  const reasons = [];

  // 1. Soil match (25 points)
  if (crop.soils.includes(inputs.soil)) {
    score += 25;
    reasons.push(`grows well in ${inputs.soil} soil`);
  }

  // 2. Season match (25 points)
  if (crop.seasons.includes(inputs.season)) {
    score += 25;
    reasons.push(`suited to the ${inputs.season} season`);
  }

  // 3. Rainfall match (25 points)
  if (crop.rainfall.includes(inputs.rainfall)) {
    score += 25;
    reasons.push(`tolerates ${inputs.rainfall} rainfall`);
  }

  // 4. Water availability match (25 points)
  if (crop.water.includes(inputs.water)) {
    score += 25;
    reasons.push(`works with ${inputs.water}`);
  }

  return { score, reasons };
}

/**
 * Takes the farmer's inputs and the full crop catalogue.
 * Returns a list of crops, each with a score and reasons,
 * sorted from best match to worst. Crops with 0 score are filtered out.
 */
export function scoreCrops(inputs, crops) {
  const results = crops
    .map((crop) => {
      const { score, reasons } = scoreOneCrop(crop, inputs);
      return {
        id: crop.id,
        name: crop.name,
        score,
        reasons,
        details: crop.details,
      };
    })
    // Remove crops that don't match at all
    .filter((crop) => crop.score > 0)
    // Sort from highest score to lowest
    .sort((a, b) => b.score - a.score);

  return results;
}