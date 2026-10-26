const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/stageRecipes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to escape single quotes
const esc = (s) => (s ? s.replace(/'/g, "\\'") : '');

function formatRecipe(r, stageId) {
  return `  {
    id: '${stageId}_${r.id}',
    name: '${esc(r.name)}',
    localName: '${esc(r.localName)}',
    prepTime: '${esc(r.prepTime)}',
    cookTime: '${esc(r.cookTime)}',
    category: '${r.category}',
    ingredients: [
${r.ingredients.map(i => `      '${esc(i)}'`).join(',\n')}
    ],
    instructions: [
${r.instructions.map(i => `      '${esc(i)}'`).join(',\n')}
    ],
    benefits: '${esc(r.benefits)}',
    safety: '${esc(r.safety)}',
    icon: '${r.icon}'
  }`;
}

// Master Stage Definitions
const stageConfigs = [
  {
    id: '0_6_months',
    filename: 'stage_0_6m.ts',
    ageLimit: '0 - 6 Months',
    title: 'Early Milk & Preparation Stage',
    mornings: [
      { id: 'm1', name: 'Silky Smooth Apple Purée', localName: 'सेब प्यूरी / ஆப்பிள் கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🍎',
        ingredients: ['1 Sweet Apple (Gala or Fuji)', '1-2 tbsp Breastmilk or Formula', 'Water for steaming'],
        instructions: ['Peel, core and cut apple into small cubes.', 'Steam for 8 mins until tender.', 'Blend until completely silky and thin with warm breastmilk.'],
        benefits: 'Hypoallergenic and rich in natural pectin for gentle baby digestion.',
        safety: 'Ensure zero lumps. Never add honey, cow milk, or sugar.'
      },
      { id: 'm2', name: 'Velvety Steamed Pear Purée', localName: 'नाशपाती प्यूरी / பேரிக்காய் கூழ்', prepTime: '5 mins', cookTime: '6 mins', icon: '🍐',
        ingredients: ['1 Soft Ripe Pear', '1 tbsp Warm boiled water or breastmilk'],
        instructions: ['Peel and core ripe pear.', 'Steam lightly for 6 mins until soft.', 'Puree finely until watery smooth and serve warm.'],
        benefits: 'Eases infant bowel movements naturally with gentle dietary fibers.',
        safety: 'Always test temperature on wrist before feeding baby.'
      },
      { id: 'm3', name: 'Golden Carrot Silk', localName: 'गाजर प्यूरी / கேரட் கூழ்', prepTime: '5 mins', cookTime: '10 mins', icon: '🥕',
        ingredients: ['1 Sweet Red Carrot', 'Water for steaming', 'Splash of breastmilk'],
        instructions: ['Peel and thinly slice carrot.', 'Steam until fork-tender (approx 10 mins).', 'Blend with cooking liquid and breastmilk to a runny consistency.'],
        benefits: 'High beta-carotene supports vision and cellular growth.',
        safety: 'Strain through a baby mesh sieve if any tiny fibers remain.'
      },
      { id: 'm4', name: 'Sweet Potato Velvet Spoon', localName: 'शकरकंद प्यूरी / சர்க்கரைவள்ளிக்கிழங்கு கூழ்', prepTime: '5 mins', cookTime: '12 mins', icon: '🍠',
        ingredients: ['1 Small Sweet Potato', 'Breastmilk or Formula to thin'],
        instructions: ['Boil sweet potato until very soft.', 'Peel away skin.', 'Mash with breastmilk until completely runny and silky.'],
        benefits: 'Complex carbohydrates provide sustained, gentle energy.',
        safety: 'Keep watery thin for beginner swallowing reflexes.'
      },
      { id: 'm5', name: 'Yellow Pumpkin Nectar', localName: 'कद्दू प्यूरी / பூசணிக்காய் கூழ்', prepTime: '5 mins', cookTime: '10 mins', icon: '🎃',
        ingredients: ['1/2 cup Diced yellow pumpkin (Kaddu)', 'Filtered water'],
        instructions: ['Steam pumpkin cubes for 10 mins until soft.', 'Puree into a smooth, watery soup-like consistency.', 'Feed 1-2 small baby spoons.'],
        benefits: 'Soothing on sensitive infant stomachs and easy to digest.',
        safety: 'Introduce alone for 3 consecutive days to watch for sensitivities.'
      },
      { id: 'm6', name: 'Bottle Gourd (Lauki) Broth', localName: 'लौकी का अर्क / சுரைக்காய் சாறு', prepTime: '5 mins', cookTime: '8 mins', icon: '🥒',
        ingredients: ['1/2 cup Peeled Lauki cubes', '1 cup Water'],
        instructions: ['Boil fresh lauki in water until translucent.', 'Puree and pass through a fine sieve into a mild broth.', 'Feed lukewarm with a spoon.'],
        benefits: 'Very cooling, hydrating, and prevents tummy stiffness.',
        safety: 'Never use bitter bottle gourd.'
      },
      { id: 'm7', name: 'Stewed Ripe Peach Purée', localName: 'आड़ू प्यूरी / பீச் கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🍑',
        ingredients: ['1 Soft Ripe Peach', 'Water for steaming'],
        instructions: ['Blanch in hot water and peel skin.', 'Steam sliced peach for 5 mins.', 'Blend into a runny, sweet puree.'],
        benefits: 'Contains vitamin C and gentle natural fruit sugars.',
        safety: 'Use fresh ripe fruit only, avoid canned syrups.'
      },
      { id: 'm8', name: 'Creamy Papaya Nectar', localName: 'पपीता प्यूरी / பப்பாளி கூழ்', prepTime: '4 mins', cookTime: '0 mins', icon: '🥭',
        ingredients: ['1/4 cup Ripe soft papaya', 'Splash of warm breastmilk'],
        instructions: ['Scoop soft papaya flesh.', 'Puree thoroughly in baby blender.', 'Thin with milk and serve fresh.'],
        benefits: 'Rich in natural papain enzymes that aid smooth digestion.',
        safety: 'Only use fully ripe, sweet papaya.'
      },
      { id: 'm9', name: 'Steamed Zucchini Puree', localName: 'तोरी प्यूरी / பீர்க்கங்காய் கூழ்', prepTime: '5 mins', cookTime: '6 mins', icon: '🥬',
        ingredients: ['1/2 Small tender zucchini, peeled', 'Water for steaming'],
        instructions: ['Peel and slice tender zucchini.', 'Steam for 5-6 mins.', 'Puree until silky smooth with zero bits.'],
        benefits: 'High moisture and gentle fiber soothe baby bowels.',
        safety: 'Peel skin completely for first-time introductions.'
      },
      { id: 'm10', name: 'Butternut Squash Velvet', localName: 'स्क्वैश प्यूरी / பூசணி ப்யூரி', prepTime: '5 mins', cookTime: '10 mins', icon: '🥣',
        ingredients: ['1/2 cup Peeled butternut squash', '1 tbsp Breastmilk'],
        instructions: ['Steam squash cubes until tender.', 'Blend with breastmilk to liquid consistency.', 'Cool to room temperature.'],
        benefits: 'Naturally creamy texture without dairy additives.',
        safety: 'Ensure no skin fragments enter puree.'
      },
      { id: 'm11', name: 'Ripe Banana Silk Cream', localName: 'केला क्रीम / வாழைப்பழம் கூழ்', prepTime: '3 mins', cookTime: '0 mins', icon: '🍌',
        ingredients: ['1/2 Ripe spotty banana', '1 tbsp Breastmilk'],
        instructions: ['Mash banana thoroughly with a sterile fork.', 'Add warm breastmilk and whisk into a liquid cream.', 'Feed immediately with silicone spoon.'],
        benefits: 'Provides gentle calories and potassium for weight gain.',
        safety: 'Use bananas with brown spots for easy digestion.'
      },
      { id: 'm12', name: 'Steamed Beetroot Rose Purée', localName: 'चुकंदर प्यूरी / பீட்ரூட் கூழ்', prepTime: '5 mins', cookTime: '15 mins', icon: '🟣',
        ingredients: ['1/4 Small beetroot, peeled and diced', 'Water for steaming', 'Breastmilk to thin'],
        instructions: ['Steam diced beetroot until completely tender.', 'Blend into a silky bright puree.', 'Thin with breastmilk.'],
        benefits: 'High iron and dietary minerals for healthy blood formation.',
        safety: 'Feed just 1-2 teaspoons as first introduction.'
      },
      { id: 'm13', name: 'Steamed Green Pea Velvet', localName: 'मटर प्यूरी / பட்டாணி கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🟢',
        ingredients: ['1/3 cup Sweet fresh tender peas', 'Water for boiling'],
        instructions: ['Boil sweet peas until soft.', 'Puree in blender, then pass through a fine sieve to remove skins.', 'Thin with warm water.'],
        benefits: 'Plant protein and folate for brain and cell development.',
        safety: 'Always strain to discard pea skin shells.'
      },
      { id: 'm14', name: 'Tender Ridge Gourd (Turai) Mash', localName: 'तुरई प्यूरी / பீர்க்கங்காய் சாறு', prepTime: '5 mins', cookTime: '8 mins', icon: '🥒',
        ingredients: ['1/2 cup Peeled tender turai', 'Pinch of roasted cumin powder (optional)'],
        instructions: ['Steam turai until tender.', 'Blend into a light, watery puree.', 'Feed lukewarm.'],
        benefits: 'Mild on kidneys and helps soothe digestive colic.',
        safety: 'Peel ridges deeply to keep puree silky.'
      },
      { id: 'm15', name: 'Stewed Plum Nectar', localName: 'आलूबुखारा प्यूरी / பிளம்ஸ் கூழ்', prepTime: '5 mins', cookTime: '6 mins', icon: '🟣',
        ingredients: ['1 Sweet ripe purple plum', 'Water for steaming'],
        instructions: ['Steam pitted plum halves for 5 mins.', 'Peel off tart skin.', 'Puree sweet flesh until runny.'],
        benefits: 'Gentle, natural relief for infant hard stools.',
        safety: 'Remove skin to avoid sour taste for early eaters.'
      },
      { id: 'm16', name: 'Steamed Apple & Prune Drops', localName: 'सेब प्रून प्यूरी / ஆப்பிள் பிளம் கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🍎',
        ingredients: ['1/2 Apple, peeled', '1 Dried pitted prune, soaked', 'Water'],
        instructions: ['Steam apple and soaked prune together.', 'Blend into a smooth paste and thin with breastmilk.', 'Feed 1-2 spoonfuls.'],
        benefits: 'Supports intestinal gut flora and regular soft stools.',
        safety: 'Ensure prune is 100% pit-free before blending.'
      },
      { id: 'm17', name: 'Avocado Silk Mash', localName: 'एवोकाडो मैश / வெண்ணெய் பழம்', prepTime: '3 mins', cookTime: '0 mins', icon: '🥑',
        ingredients: ['1/4 Ripe buttery avocado', '1 tbsp Warm breastmilk'],
        instructions: ['Scoop ripe avocado flesh.', 'Mash with fork until completely smooth and whisk with milk.', 'Serve immediately.'],
        benefits: 'Healthy monosaturated fatty acids for rapid infant brain growth.',
        safety: 'Prepare fresh; do not store leftover avocado puree.'
      },
      { id: 'm18', name: 'Steamed Sweet Melon Purée', localName: 'खरबूजा प्यूरी / முலாம் பழம் கூழ்', prepTime: '5 mins', cookTime: '0 mins', icon: '🍈',
        ingredients: ['1/4 cup Ripe sweet musk melon', 'Filtered water'],
        instructions: ['Remove seeds and peel completely.', 'Puree flesh in baby blender until fluid.', 'Offer at room temperature.'],
        benefits: 'High hydration and electrolytes for warm days.',
        safety: 'Strain any seed fibers carefully.'
      },
      { id: 'm19', name: 'Steamed Yellow Moong Water (Dal Ka Paani)', localName: 'मूंग दाल का पानी / பாசிப்பருப்பு தண்ணீர்', prepTime: '5 mins', cookTime: '15 mins', icon: '🥣',
        ingredients: ['2 tbsp Washed yellow moong dal', '1 cup Water', 'Pinch of roasted jeera powder'],
        instructions: ['Pressure cook dal in 1 cup water until soft.', 'Skim the clear, nutrient-rich top liquid.', 'Stir in a pinch of jeera and serve warm.'],
        benefits: 'Traditional Indian first protein food; light on tiny bellies.',
        safety: 'Do not feed thick dal yet; use only clear top liquid.'
      },
      { id: 'm20', name: 'Boiled Rice Starch Water (Kanji Paani)', localName: 'चावल का मांड / கஞ்சி தண்ணீர்', prepTime: '5 mins', cookTime: '15 mins', icon: '🍚',
        ingredients: ['2 tbsp Organic white or red rice', '1.5 cups Water'],
        instructions: ['Boil rice in excess water until rice is mushy.', 'Strain the thick warm rice water into a cup.', 'Feed with baby spoon.'],
        benefits: 'Easily digestible starch that settles sensitive infant stomachs.',
        safety: 'Ensure liquid is cooled to lukewarm.'
      },
      { id: 'm21', name: 'Steamed Chayote Squash Velvet', localName: 'चौ-चौ प्यूरी / பெங்களூர் கத்திரிக்காய் கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🍐',
        ingredients: ['1/2 cup Peeled chayote squash', 'Warm water'],
        instructions: ['Steam until tender.', 'Puree into a fluid texture with warm water.', 'Serve warm.'],
        benefits: 'Mild taste helps infant transition to subtle vegetable flavors.',
        safety: 'Remove center seed core before steaming.'
      },
      { id: 'm22', name: 'Steamed Ripe Mango Nectar (Seasonal)', localName: 'आम प्यूरी / மாம்பழ கூழ்', prepTime: '5 mins', cookTime: '0 mins', icon: '🥭',
        ingredients: ['1/4 cup Sweet Alphonso or Banganapalli mango', 'Warm breastmilk'],
        instructions: ['Puree soft mango pulp.', 'Pass through a sieve to remove any stringy fibers.', 'Whisk with breastmilk and feed.'],
        benefits: 'Rich in vitamin A, vitamin C, and natural fruit antioxidants.',
        safety: 'Introduce in very small amounts to ensure no rash.'
      },
      { id: 'm23', name: 'Steamed Cauliflower Floret Silk', localName: 'फूलगोभी प्यूरी / காலிஃபிளவர் கூழ்', prepTime: '5 mins', cookTime: '10 mins', icon: '🥦',
        ingredients: ['2 Clean cauliflower florets', 'Water for steaming'],
        instructions: ['Steam florets until soft.', 'Puree with cooking liquid until completely smooth.', 'Feed 1-2 spoons.'],
        benefits: 'Provides vitamin C and plant phytonutrients.',
        safety: 'Serve in daytime to monitor if baby has any gas.'
      },
      { id: 'm24', name: 'Steamed Sweet Corn Milk', localName: 'स्वीट कॉर्न रस / சோள பால்', prepTime: '5 mins', cookTime: '10 mins', icon: '🌽',
        ingredients: ['1/3 cup Tender sweet corn kernels', 'Warm water'],
        instructions: ['Boil corn kernels until soft.', 'Blend with water and strain through double-layer cheesecloth.', 'Feed sweet corn milk with spoon.'],
        benefits: 'Gentle natural sweetness and plant carbohydrates.',
        safety: 'Always strain completely to eliminate corn skins.'
      },
      { id: 'm25', name: 'Steamed Ripe Fig (Anjeer) Broth', localName: 'अंजीर प्यूरी / அத்திப்பழம் சாறு', prepTime: '5 mins', cookTime: '8 mins', icon: '🟤',
        ingredients: ['1 Fresh soft ripe fig', 'Water for steaming'],
        instructions: ['Peel and steam fresh fig for 5 mins.', 'Puree finely and strain to remove tiny seed grit.', 'Feed lukewarm.'],
        benefits: 'Rich in natural dietary iron and potassium.',
        safety: 'Strain seeds thoroughly for infants under 6 months.'
      },
      { id: 'm26', name: 'Tender Ash Gourd (Petha) Water', localName: 'पेठा का पानी / சாம்பல் பூசணி சாறு', prepTime: '5 mins', cookTime: '8 mins', icon: '🥣',
        ingredients: ['1/2 cup Peeled ash gourd', 'Filtered water'],
        instructions: ['Boil ash gourd until clear.', 'Puree and strain into a refreshing broth.', 'Serve warm.'],
        benefits: 'Deeply alkaline, hydrating, and calming for baby digestion.',
        safety: 'Ensure ash gourd is fresh and sweet, not sour.'
      },
      { id: 'm27', name: 'Steamed Blueberry Nectar', localName: 'ब्लूबेरी प्यूरी / ப்ளூபெர்ரி கூழ்', prepTime: '5 mins', cookTime: '5 mins', icon: '🫐',
        ingredients: ['1/4 cup Fresh blueberries', 'Water for steaming'],
        instructions: ['Steam berries for 4 mins until skins pop.', 'Blend and strain through fine mesh to remove skins.', 'Mix with milk.'],
        benefits: 'Potent anthocyanin antioxidants for developing cells.',
        safety: 'Always strain out outer berry skins.'
      },
      { id: 'm28', name: 'Steamed Parsnip Velvet', localName: 'पार्सनिप प्यूरी / முள்ளங்கி வகை கூழ்', prepTime: '5 mins', cookTime: '10 mins', icon: '🥕',
        ingredients: ['1/2 Tender parsnip, peeled', 'Breastmilk to thin'],
        instructions: ['Steam until soft.', 'Puree with milk into a runny cream.', 'Feed lukewarm.'],
        benefits: 'Naturally sweet and earthy root vegetable rich in folate.',
        safety: 'Discard hard woody core before steaming.'
      },
      { id: 'm29', name: 'Steamed Spinach & Apple Spoon', localName: 'पालक सेब प्यूरी / கீரை ஆப்பிள் கூழ்', prepTime: '5 mins', cookTime: '8 mins', icon: '🥬',
        ingredients: ['4 Tender baby spinach leaves', '1/2 Apple, peeled', 'Water'],
        instructions: ['Steam spinach and apple together for 6 mins.', 'Blend into a silky green cream.', 'Thin with warm breastmilk.'],
        benefits: 'Iron from spinach paired with vitamin C from apple for maximum absorption.',
        safety: 'Use tender baby spinach leaves with stems removed.'
      },
      { id: 'm30', name: 'Steamed Sprouted Ragi Water', localName: 'रागी का पानी / ராகி பால் கஞ்சி', prepTime: '5 mins', cookTime: '10 mins', icon: '🥣',
        ingredients: ['1 tbsp Sprouted ragi powder', '1 cup Water'],
        instructions: ['Dissolve ragi powder in water without lumps.', 'Cook on low heat, stirring constantly until shiny and runny.', 'Strain and serve lukewarm.'],
        benefits: 'Traditional superfood packed with calcium and natural iron.',
        safety: 'Keep very thin and watery for early weaning.'
      }
    ]
  }
];

console.log('Building stage generators...');
