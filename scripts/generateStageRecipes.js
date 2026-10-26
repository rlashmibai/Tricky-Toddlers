const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/stageRecipes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to escape strings
const esc = (s) => (s ? s.replace(/'/g, "\\'") : '');

// Master recipe generator per stage
function generateStageFiles() {
  const stages = [
    {
      id: '0_6_months',
      file: 'stage_0_6m.ts',
      ageLimit: '0 - 6 Months',
      title: 'Early Milk & Preparation Stage',
      focus: 'Silky single-ingredient purees and swallow readiness testing',
      mornings: [
        ['Silky Apple Purée', 'सेब प्यूरी / ஆப்பிள் கூழ்', '5 mins', '8 mins', '🍎', ['1 Sweet Gala Apple', '1 tbsp Breastmilk or Formula', 'Water for steaming'], ['Peel, core, and dice apple.', 'Steam for 8 mins until tender.', 'Blend until completely silky smooth.', 'Thin with warm milk.'], 'Easy on baby tummy, rich in gentle pectin fiber.', 'Ensure zero lumps. Never add honey or sugar.'],
        ['Velvety Ripe Pear Purée', 'नाशपाती प्यूरी / பேரிக்காய் கூழ்', '5 mins', '6 mins', '🍐', ['1 Ripe Soft Pear', '1 tbsp Warm breastmilk or boiled water'], ['Peel and core ripe soft pear.', 'Steam lightly for 5-6 mins.', 'Puree finely until watery smooth.', 'Serve at lukewarm temperature.'], 'Mild on tender stomach and prevents early constipation.', 'Test temperature on your wrist before feeding.'],
        ['Steamed Carrot Silk', 'गाजर प्यूरी / கேரட் கூழ்', '5 mins', '10 mins', '🥕', ['1 Sweet Orange Carrot', 'Water for boiling', 'Splash of Breastmilk'], ['Wash, peel and thinly slice carrot.', 'Steam until fork-tender.', 'Puree with cooking water to silky runny texture.', 'Mix in splash of milk.'], 'Packed with beta-carotene for healthy eyes and skin.', 'Strain through a mesh sieve if any tiny fibers remain.'],
        ['Golden Sweet Potato Mash', 'शकरकंद प्यूरी / சர்க்கரைவள்ளிக்கிழங்கு கூழ்', '5 mins', '12 mins', '🍠', ['1 Small Sweet Potato', 'Breastmilk or Formula to thin'], ['Boil sweet potato until very soft.', 'Peel skin away.', 'Mash with breastmilk until completely runny and lump-free.', 'Offer 1 small baby spoonful.'], 'Excellent source of complex vitamin A and natural sweetness.', 'Do not thicken; keep runny for safe swallow reflex.'],
        ['Creamy Yellow Pumpkin Purée', 'कद्दू प्यूरी / பூசணிக்காய் கூழ்', '5 mins', '10 mins', '🎃', ['1/2 cup Diced yellow pumpkin (Kaddu)', 'Water for steaming'], ['Steam pumpkin cubes for 10 mins until meltingly soft.', 'Blend into a smooth, watery soup-like consistency.', 'Cool completely before offering.'], 'Very soothing on baby digestion and rich in antioxidants.', 'Introduce as a single vegetable over 3 consecutive days.'],
        ['Tender Bottle Gourd (Lauki) Water', 'लौकी का पानी / சுரைக்காய் சாறு', '5 mins', '8 mins', '🥒', ['1/2 cup Peeled Lauki cubes', '1 cup Filtered water'], ['Boil lauki in water until translucent.', 'Puree and strain into a light broth.', 'Cool and feed 1-2 teaspoons.'], 'Cooling and hydrating; gentle introduction to vegetable flavors.', 'Discard any bitter lauki.'],
        ['Steamed Papaya Nectar', 'पपीता प्यूरी / பப்பாளி கூழ்', '4 mins', '0 mins', '🥭', ['1/4 cup Ripe soft papaya', 'Splash of cooled boiled water'], ['Scoop soft orange papaya flesh.', 'Puree in a baby food mill until watery smooth.', 'Serve freshly prepared.'], 'Contains papain enzymes that aid gentle digestion.', 'Only use naturally sweet, fully ripe papaya.'],
        ['Stewed Peach Puree', 'आड़ू प्यूरी / பீச் கூழ்', '5 mins', '8 mins', '🍑', ['1 Ripe fresh peach', 'Water for steaming'], ['Blanch peach in boiling water for 1 min, peel skin.', 'Steam sliced peach for 5 mins until tender.', 'Puree until velvet smooth.'], 'Provides vitamin C and gentle hydration.', 'Never feed canned peach syrup.'],
        ['Steamed Butternut Squash Velvet', 'बटरनट स्क्वैश / பூசணி கூழ்', '5 mins', '10 mins', '🥣', ['1/2 cup Peeled squash cubes', 'Warm breastmilk'], ['Steam squash cubes until tender.', 'Blend with breastmilk to liquid consistency.', 'Cool to room temperature.'], 'Naturally creamy texture without any dairy additives.', 'Ensure no skin fragments enter puree.'],
        ['Smooth Banana Cream', 'केला मैश / பிசைந்த வாழைப்பழம்', '3 mins', '0 mins', '🍌', ['1/2 Ripe spotty banana', '1 tbsp Breastmilk'], ['Mash banana with a sterile fork.', 'Add warm breastmilk and whisk into a liquid cream.', 'Feed immediately with a soft silicone spoon.'], 'Provides quick gentle energy and potassium.', 'Use bananas with brown sugar spots for easy digestion.']
      ]
    }
  ];

  console.log('Script initialized.');
}

generateStageFiles();
