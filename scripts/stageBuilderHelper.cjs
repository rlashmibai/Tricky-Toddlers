const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/stageRecipes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const esc = (s) => (s ? s.replace(/'/g, "\\'") : '');

// Generates an array of 30 distinct recipes for a specific meal category
function makeRecipes(stageId, category, baseList) {
  // ensure we have at least 30 items
  return baseList.slice(0, 30).map((r, idx) => {
    return {
      id: `${stageId}_${category.toLowerCase()}_${idx + 1}`,
      name: r.name,
      localName: r.localName || '',
      prepTime: r.prepTime || '5 mins',
      cookTime: r.cookTime || '12 mins',
      category: category,
      region: r.region || 'Pan-Indian',
      ingredients: r.ingredients,
      instructions: r.instructions,
      benefits: r.benefits,
      safety: r.safety,
      icon: r.icon || '🍲'
    };
  });
}

function outputStageFile(filename, stageId, ageLimit, title, guidelines, milestones, morningList, lunchList, dinnerList, snackList) {
  const morningRecipes = makeRecipes(stageId, 'Morning', morningList);
  const lunchRecipes = makeRecipes(stageId, 'Lunch', lunchList);
  const dinnerRecipes = makeRecipes(stageId, 'Dinner', dinnerList);
  const snackRecipes = makeRecipes(stageId, 'Snacks', snackList);

  const allRecipes = [...morningRecipes, ...lunchRecipes, ...dinnerRecipes, ...snackRecipes];

  const content = `import { Recipe, AgeGroupData } from '../foodGuideData';

export const stageData_${stageId}: AgeGroupData = {
  id: '${stageId}',
  ageLimit: '${esc(ageLimit)}',
  title: '${esc(title)}',
  guidelines: '${esc(guidelines)}',
  milestones: [
${milestones.map(m => `    '${esc(m)}'`).join(',\n')}
  ],
  recipes: [
${allRecipes.map(r => `    {
      id: '${r.id}',
      name: '${esc(r.name)}',
      localName: '${esc(r.localName)}',
      prepTime: '${esc(r.prepTime)}',
      cookTime: '${esc(r.cookTime)}',
      category: '${r.category}',
      region: '${esc(r.region)}',
      ingredients: [
${r.ingredients.map(i => `        '${esc(i)}'`).join(',\n')}
      ],
      instructions: [
${r.instructions.map(i => `        '${esc(i)}'`).join(',\n')}
      ],
      benefits: '${esc(r.benefits)}',
      safety: '${esc(r.safety)}',
      icon: '${r.icon}'
    }`).join(',\n')}
  ]
};
`;

  fs.writeFileSync(path.join(outDir, filename), content, 'utf8');
  console.log(`Generated ${filename}: ${allRecipes.length} recipes (Morning: ${morningRecipes.length}, Lunch: ${lunchRecipes.length}, Dinner: ${dinnerRecipes.length}, Snacks: ${snackRecipes.length})`);
}

module.exports = { outputStageFile };
