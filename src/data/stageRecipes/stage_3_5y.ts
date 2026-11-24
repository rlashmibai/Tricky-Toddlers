import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_3_5_years: AgeGroupData = {
  id: '3_5_years',
  ageLimit: '3 - 5 Years',
  title: "Preschool Active Explorer",
  guidelines: "Preschoolers need balanced energy for high physical activity, cognitive play, and immune defense. Offer 3 solid meals and 2 nutritious snacks. Keep portions colorful and easy to eat.",
  milestones: [
    "Eats completely independently using regular child spoons and forks.",
    "Enjoys varied textures including crunchy raw cucumber, carrots, and soft rotis.",
    "Develops taste preferences and can help wash veggies or mix batters."
  ],
  recipes: [
    {
      id: '3_5_years_rec_1',
      name: "Fluffy Ragi & Banana Pancakes",
      localName: "रागी केला पैनकेक / ராகி வாழைப்பழ அப்பம்",
      prepTime: "8 mins (+ 5 mins resting)",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup pure sprouted ragi (finger millet) flour",
        "2 tbsp whole wheat flour (for extra fluffiness)",
        "1 large ripe sweet banana (peeled and mashed)",
        "1/3 cup whole milk (plus 1–2 tbsp water if needed)",
        "1 tsp organic jaggery powder",
        "1/4 tsp baking powder & 1 pinch green cardamom powder",
        "1 tsp pure desi ghee (for pan cooking)"
      ],
      instructions: [
        "Firstly, mash the ripe banana completely smooth in a mixing bowl using a clean fork.",
        "Add jaggery powder and milk, whisking briskly until smooth and uniform.",
        "Sift in the sprouted ragi flour, whole wheat flour, baking powder, and cardamom powder.",
        "Stir gently with a whisk until a thick, smooth, pourable pancake batter forms; let rest 5 minutes.",
        "Heat a flat griddle or non-stick skillet on low flame and brush with ¼ teaspoon ghee.",
        "Pour 2-tablespoon scoops of batter onto the skillet to form neat 3-inch palm-sized pancakes.",
        "Cover loosely for 90 seconds on low heat until tiny bubbles rise across the surface.",
        "Flip carefully, drizzle a tiny drop of ghee along edges, cook 2 more minutes until springy inside, cool slightly, and serve warm."
      ],
      benefits: "Packed with bioavailable ragi calcium, natural iron, and potassium to fuel busy preschool mornings.",
      safety: "Cook thoroughly on low flame so center sets completely soft without burning dark outside.",
      icon: "🥞"
    },
    {
      id: '3_5_years_rec_2',
      name: "Stuffed Moong Dal & Paneer Cheela",
      localName: "मूंग दाल पनीर चीला / பாசிப்பருப்பு பன்னீர் அடை",
      prepTime: "10 mins (+ 3 hrs soaking)",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup split yellow moong dal (soaked 3 hours and drained)",
        "1/2 inch fresh ginger piece & 2 tbsp clean water (for grinding)",
        "1/3 cup finely grated fresh soft paneer",
        "2 tbsp finely grated carrot & 1 tbsp chopped coriander",
        "1/4 tsp roasted cumin (jeera) powder & 1/4 tsp turmeric powder",
        "1/4 tsp salt (or to taste)",
        "1 tsp pure homemade desi ghee (for cooking)"
      ],
      instructions: [
        "Firstly, drain soaked yellow moong dal cleanly and transfer into a mixer jar with ginger and 2 tablespoons fresh water.",
        "Grind into a completely smooth, lump-free, pourable crepe batter; transfer to a bowl and stir in turmeric, cumin, and salt.",
        "In a small bowl, gently mix grated paneer, finely grated carrot, chopped coriander, and a tiny pinch of salt.",
        "Heat a cast-iron or non-stick tawa over medium-low flame and brush with ¼ teaspoon ghee.",
        "Pour a ladle of moong batter in the center and spread spirally outward into a neat 6-inch round crepe.",
        "Drizzle ½ teaspoon ghee along edges and cook for 2 minutes until the underside turns crisp-golden.",
        "Flip carefully, cook the second side 1 minute, flip back, and scatter the paneer-carrot stuffing down the center.",
        "Fold neatly in half like a crescent or taco, slice into triangles, and serve warm with fresh plain curd."
      ],
      benefits: "High vegetarian protein from dal and paneer supports steady muscle growth and classroom focus.",
      safety: "Keep spices gentle without whole peppercorns or fiery green chilies.",
      icon: "🫓"
    },
    {
      id: '3_5_years_rec_3',
      name: "Steamed Vegetable Oats Mini Idlis",
      localName: "ओट्स वेज इडली / ஓட்ஸ் காய்கறி இட்லி",
      prepTime: "10 mins (+ 10 mins resting)",
      cookTime: "12 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup dry-roasted rolled oats, ground into fine rava-like powder",
        "2 tbsp fine Bombay suji (semolina)",
        "1/3 cup fresh plain curd (yogurt)",
        "2 to 3 tbsp clean water (to adjust batter)",
        "2 tbsp finely grated carrot & soft boiled peas",
        "1/2 tsp pure ghee + 1/4 tsp mustard seeds & 4 chopped curry leaves",
        "1/4 tsp salt & 1/4 tsp baking soda or fruit salt (added right before steaming)"
      ],
      instructions: [
        "Firstly, dry-roast rolled oats for 3 minutes, cool completely, and pulse into a coarse semolina-like meal.",
        "Heat ½ teaspoon ghee in a tiny tadka pan, pop mustard seeds and finely chopped curry leaves, and set aside.",
        "In a mixing bowl, whisk oats powder, fine suji, curd, salt, and 2–3 tablespoons water into a thick idli batter.",
        "Fold in grated carrot, boiled mashed peas, and the prepared tempering; let the batter rest 10 minutes.",
        "Bring 2 inches of water to a boil in an idli steamer and brush mini-idli cavities lightly with ghee.",
        "Stir baking soda gently into the rested batter until light and airy, then spoon evenly into moulds.",
        "Steam covered on medium flame for 10 to 12 minutes until puffed and springy (verify with a clean toothpick).",
        "Cool 3 minutes, scoop out warm mini idlis cleanly, and serve with mild fresh coconut chutney or warm dal."
      ],
      benefits: "Soluble beta-glucan oats fiber promotes smooth digestion while probiotic curd keeps idlis fluffy.",
      safety: "Let mini idlis cool down to comfortable warmth before offering to preschoolers.",
      icon: "⚪"
    },
    {
      id: '3_5_years_rec_4',
      name: "Mild Vegetable Poha with Sweet Peas",
      localName: "वेजिटेबल पोहा / காய்கறி அவல் உப்புமா",
      prepTime: "6 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup thick flattened rice (poha)",
        "1/4 cup steamed sweet green peas & tiny diced carrot",
        "2 tbsp finely chopped onion (optional)",
        "1 tsp pure ghee or groundnut oil",
        "1/4 tsp cumin seeds (jeera) & 1/4 tsp turmeric powder",
        "1/4 tsp salt & 1/2 tsp sugar (optional)",
        "1 tbsp water (for steaming soft)",
        "1 tsp fresh lemon juice & 1 tbsp chopped coriander leaves"
      ],
      instructions: [
        "Firstly, place thick poha in a strainer and rinse under clean water for 15–20 seconds—never soak submerged.",
        "Drain completely and leave sitting in the strainer for 5 minutes so flakes absorb moisture evenly without turning mushy.",
        "Sprinkle turmeric powder and salt lightly over the rested poha and fluff gently with clean fingers.",
        "Heat 1 teaspoon ghee or oil in a wide pan on medium-low flame; splutter cumin seeds gently.",
        "Add optional chopped onion and sauté 2 minutes until translucent, then stir in steamed peas and tender carrot dices.",
        "Fold in the seasoned softened poha gently from the bottom up.",
        "Splash 1 tablespoon water evenly across the surface, cover with a lid, and steam on lowest flame for 2–3 minutes.",
        "Turn off heat, squeeze fresh lemon juice over top, garnish with chopped coriander, and serve warm."
      ],
      benefits: "Quick iron-friendly energy meal where vitamin C from lemon maximizes plant iron absorption.",
      safety: "Steam peas completely soft and keep flakes moist so the poha never feels dry.",
      icon: "🥣"
    },
    {
      id: '3_5_years_rec_5',
      name: "Cooling Curd Rice with Pomegranate Pearls",
      localName: "दही चावल / தயிர் சாதம்",
      prepTime: "6 mins",
      cookTime: "10 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup soft-cooked white rice",
        "1/2 cup fresh homemade full-fat curd (non-sour dahi)",
        "2 tbsp warm whole milk (to keep creamy)",
        "1/4 cup finely grated crisp cucumber & sweet carrot",
        "2 tbsp sweet juicy pomegranate pearls",
        "1/2 tsp pure ghee + 1/4 tsp mustard seeds & 4 curry leaves",
        "1/4 tsp salt & 1 tbsp chopped fresh coriander"
      ],
      instructions: [
        "Firstly, mash warm soft-cooked rice thoroughly with a spoon in a large bowl and cool down to room temperature.",
        "Stir 2 tablespoons milk and salt smoothly into the cooled mashed rice.",
        "Whisk fresh non-sour homemade curd until silky smooth and fold thoroughly into the rice.",
        "Mix in finely grated fresh cucumber and sweet grated carrot for gentle crunch and hydration.",
        "Heat ½ teaspoon ghee in a small tempering spoon; pop mustard seeds cleanly and fry curry leaves until crisp.",
        "Pour the fragrant warm tempering over the curd rice and fold in chopped coriander leaves.",
        "Scatter vibrant ruby pomegranate pearls across the top right before serving at comfortable room temperature."
      ],
      benefits: "Live yogurt probiotics cool summer heat, soothe digestion, and deliver bone-building calcium.",
      safety: "Use sweet tender pomegranate seeds; serve at comfortable room warmth rather than ice-cold.",
      icon: "🍚"
    },
    {
      id: '3_5_years_rec_6',
      name: "Creamy Mild Palak Paneer with Jeera Rice",
      localName: "पालक पनीर जीरा राइस / பாலக் பன்னீர் சாதம்",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups fresh baby spinach (palak) leaves, washed cleanly",
        "1/2 cup soft fresh paneer cut into ½-inch cubes",
        "1 small ripe tomato (chopped) & 1 clove garlic (minced)",
        "1/2 cup cooked fragrant cumin (jeera) rice",
        "1 tsp unsalted butter or pure ghee",
        "1/4 tsp cumin powder & 1/4 tsp turmeric powder",
        "1/4 tsp salt (or to taste)",
        "1 tbsp fresh cream or 2 tbsp whole milk (for silkiness)"
      ],
      instructions: [
        "Firstly, wash spinach 3 times thoroughly, blanch in boiling water for 2 minutes, immediately cool in cold water, and blend into a bright green puree.",
        "Heat 1 teaspoon butter or ghee in a skillet on low-to-medium flame; sauté minced garlic for 20 seconds.",
        "Add chopped tomato and cook gently for 3–4 minutes until completely soft and mushy.",
        "Pour in the fresh spinach puree, cumin powder, turmeric, and salt, stirring gently for 2–3 minutes on low flame.",
        "Swirl in 1–2 tablespoons milk or fresh cream to balance earthy greens with velvety richness.",
        "Add the bite-sized paneer cubes and simmer gently for 2–3 minutes (never overcook or paneer hardens).",
        "Serve warm spooned generously alongside fluffy cumin-scented jeera rice."
      ],
      benefits: "Dense iron, folate, vitamin A, and high-quality dairy calcium supporting active preschooler growth.",
      safety: "Keep paneer cubes small and soft; avoid strong chili or harsh garam masala.",
      icon: "🍛"
    },
    {
      id: '3_5_years_rec_7',
      name: "Yellow Dal Tadka with Soft Phulka & Ghee",
      localName: "दाल तड़का फुल्का / தால் புல்கா ரொட்டி",
      prepTime: "10 mins (+ 20 mins soaking)",
      cookTime: "18 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup split yellow moong or toor dal (washed & soaked 20 mins)",
        "1 ripe tomato (finely chopped)",
        "1/4 tsp turmeric powder & 1/4 tsp salt",
        "1.5 cups clean drinking water",
        "1 tsp pure desi ghee (divided)",
        "1/2 tsp cumin seeds (jeera) & 1 pinch hing (asafoetida)",
        "1 tbsp chopped fresh coriander",
        "2 fresh soft whole wheat phulkas + 4 thin cucumber rounds"
      ],
      instructions: [
        "Firstly, drain soaked dal and pressure cook with finely chopped tomato, turmeric, salt, and 1.5 cups water for 3–4 whistles.",
        "Wait for cooker pressure to release naturally, then whisk the cooked dal smoothly with a ladle.",
        "Heat ½ teaspoon ghee in a tiny tadka pan on low flame; add cumin seeds and asafoetida until fragrant.",
        "Pour the aromatic tadka over the smooth dal, adjust thickness with hot water if needed, and simmer 2 minutes.",
        "Garnish generously with chopped fresh coriander leaves.",
        "Brush two warm whole wheat phulkas with the remaining ½ teaspoon ghee and tear into kid-friendly dippable bites.",
        "Serve warm in a divided kids' plate alongside crunchy cucumber rounds."
      ],
      benefits: "Complete amino-acid Indian staple offering gentle plant protein, iron, and slow-release carbs.",
      safety: "Tear rotis cleanly and let hot dal cool slightly before letting preschoolers dip.",
      icon: "🍲"
    },
    {
      id: '3_5_years_rec_8',
      name: "Moong Dal & Garden Veggie Khichdi",
      localName: "मूंग दाल वेज खिचड़ी / காய்கறி பருப்பு கிச்சடி",
      prepTime: "10 mins (+ 15 mins soaking)",
      cookTime: "15 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup raw white rice (washed)",
        "1/4 cup split yellow moong dal (washed)",
        "1/2 cup finely diced carrot, peeled sweet lauki, and French beans",
        "1 tsp pure desi ghee (divided)",
        "1/2 tsp cumin seeds (jeera) & 1/4 tsp turmeric powder",
        "1/4 tsp salt",
        "2.5 cups clean drinking water",
        "3 tbsp fresh homemade curd (for serving)"
      ],
      instructions: [
        "Firstly, wash rice and yellow moong dal together 3 times cleanly and soak in water for 15 minutes.",
        "Peel, taste-check lauki (ensure not bitter), and dice lauki, carrot, and French beans into neat ¼-inch cubes.",
        "Heat ½ teaspoon ghee in a pressure cooker on low-to-medium flame; crackle cumin seeds.",
        "Add the diced garden vegetables and sauté gently for 2 minutes until bright.",
        "Stir in drained rice-dal, turmeric powder, and salt cleanly.",
        "Pour in 2.5 cups water, stir well, and pressure cook for 3 whistles until grains and veggies turn meltingly soft.",
        "Let pressure drop naturally, open cooker, mash lightly with the back of a ladle, and swirl in remaining ½ tsp ghee.",
        "Cool slightly and serve warm with a cooling bowl of plain curd."
      ],
      benefits: "Ultra-balanced gentle gut meal supplying complete plant protein, hydration, and colorful vitamins.",
      safety: "Check lauki is sweet before cooking and make sure vegetables squish cleanly.",
      icon: "🥣"
    },
    {
      id: '3_5_years_rec_9',
      name: "Silky Carrot-Tomato Soup with Wheat Croutons",
      localName: "गाजर टमाटर सूप / கேரட் தக்காளி சூப்",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 medium sweet red or orange carrot (peeled and sliced)",
        "2 medium ripe red tomatoes (roughly chopped)",
        "1 small slice whole wheat bread, toasted and cut into ½-inch cubes",
        "1 tsp unsalted butter (divided)",
        "1 clove garlic (lightly crushed, optional)",
        "1.5 cups clean water or mild vegetable stock",
        "1/4 cup warm whole milk (optional, for creaminess)",
        "1/4 tsp salt & 1 tiny pinch mild black pepper"
      ],
      instructions: [
        "Firstly, wash, peel, and slice the sweet carrot and chop the ripe red tomatoes.",
        "Melt ½ teaspoon butter in a small pressure cooker or saucepan; sauté garlic 15 seconds until fragrant.",
        "Add carrot slices, chopped tomatoes, salt, and 1.5 cups water; cook covered 12–15 minutes (or 3 whistles) until carrots mash cleanly.",
        "Cool slightly, blend into a silky bright orange-red soup, and strain cleanly through a wire sieve into a clean pot.",
        "Add warm milk (optional) and black pepper, then simmer gently on low flame for 2–3 minutes.",
        "Meanwhile, brush whole wheat bread lightly with remaining ½ teaspoon butter and toast crisp on a tawa on low heat.",
        "Cut toasted bread into playful tiny square croutons.",
        "Pour comfortably warm (never scalding) soup into a bowl and float crunchy croutons right before serving."
      ],
      benefits: "Loaded with immune-boosting vitamin C, lycopene, and beta-carotene for evening nourishment.",
      safety: "Wait until soup cools to pleasant sipping warmth; croutons soften quickly once dipped.",
      icon: "🍵"
    },
    {
      id: '3_5_years_rec_10',
      name: "Mild Paneer Bhurji Soft Roll",
      localName: "पनीर भुर्जी रोल / பன்னீர் புர்ஜி சுருள்",
      prepTime: "8 mins",
      cookTime: "10 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fresh crumbled soft paneer",
        "2 tbsp finely diced ripe tomato & 2 tbsp steamed sweet corn",
        "1 tbsp finely chopped fresh coriander leaves",
        "1 soft warm whole wheat chapati",
        "1/2 tsp pure desi ghee",
        "1/4 tsp cumin seeds (jeera) & 1 tiny pinch turmeric",
        "1/4 tsp mild salt"
      ],
      instructions: [
        "Firstly, crumble fresh soft paneer finely between clean fingers and steam sweet corn until tender.",
        "Heat ½ teaspoon ghee in a skillet on low-to-medium flame and pop cumin seeds cleanly.",
        "Add finely diced tomato and turmeric powder; sauté 2 minutes until tomatoes turn soft and juicy.",
        "Stir in the steamed sweet corn and crumbled paneer along with mild salt.",
        "Cook gently on low heat for 2 minutes only, tossing evenly until heated through without drying.",
        "Turn off stove and stir in fresh chopped coriander leaves.",
        "Warm a soft chapati, spoon the savory paneer bhurji along the center, roll snugly, and cut into two easy halves."
      ],
      benefits: "Casein-rich dairy protein keeps preschoolers satiated through the night for peaceful sleep.",
      safety: "Steam sweet corn soft and tuck roll edges cleanly so filling stays inside.",
      icon: "🌯"
    },
    {
      id: '3_5_years_rec_11',
      name: "Ruby Beetroot Pulao with Cucumber Raita",
      localName: "चुकंदर पुलाव / பீட்ரூட் சாதம்",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup cooked basmati rice (fluffy)",
        "1/4 cup very finely grated fresh ruby beetroot",
        "2 tbsp steamed green peas (optional)",
        "1 tsp pure desi ghee",
        "1/4 tsp cumin seeds (jeera) & 1 pinch mild pav bhaji or garam masala",
        "1/4 tsp salt",
        "1/3 cup fresh plain curd + 2 tbsp finely grated cucumber (for raita)"
      ],
      instructions: [
        "Firstly, peel and finely grate the fresh beetroot onto a clean plate.",
        "Heat 1 teaspoon ghee in a wide pan on low flame and crackle cumin seeds.",
        "Add the finely grated beetroot and sauté gently covered for 4–5 minutes until tender and naturally sweet.",
        "Sprinkle in salt, mild spice, and optional steamed peas, stirring cleanly.",
        "Fold in warm cooked basmati rice gently for 2 minutes until every grain glows vibrant magenta ruby.",
        "Meanwhile, whisk fresh curd with finely grated cucumber and a tiny pinch of roasted cumin for cooling raita.",
        "Let pulao cool slightly and serve the colorful pink plate paired with cucumber raita."
      ],
      benefits: "Vibrant natural ruby pigment excites selective preschoolers while boosting dietary iron and folate.",
      safety: "Cook grated beetroot completely tender so strands blend seamlessly with rice.",
      icon: "🍛"
    },
    {
      id: '3_5_years_rec_12',
      name: "Crunchy Ghee Roasted Foxnuts (Makhana)",
      localName: "भुना मखाना / வறுத்த தாமரை விதை",
      prepTime: "2 mins",
      cookTime: "6 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup whole white lotus seeds (phool makhana)",
        "1 tsp pure homemade desi ghee",
        "1/8 tsp pure turmeric powder (haldi)",
        "1/4 tsp roasted cumin (jeera) powder",
        "1/4 tsp mild rock salt (sendha namak)"
      ],
      instructions: [
        "Firstly, inspect every makhana puff and pick off any hard dark shell bits stuck on the surface.",
        "Heat 1 teaspoon desi ghee in a heavy-bottomed pan over the lowest flame.",
        "Add the foxnuts and roast slowly for 5 to 6 minutes, stirring continuously so every side crisps evenly.",
        "Test crunchiness by crushing one puff between your fingers—if it snaps cleanly into crisp powder, it is ready.",
        "Turn off the stove immediately while pan is still hot, sprinkle turmeric, cumin powder, and rock salt.",
        "Toss briskly for 30 seconds until every puff turns golden and evenly seasoned.",
        "Spread onto a cool wide plate for 3 minutes until crisp and cool, then serve fresh or store airtight."
      ],
      benefits: "Guilt-free calcium and antioxidant crunch with zero palm oil, preservatives, or trans fats.",
      safety: "Roast until 100% crisp so puffs dissolve cleanly when chewed rather than turning gummy.",
      icon: "🍿"
    },
    {
      id: '3_5_years_rec_13',
      name: "Warm Steamed Butter Corn Cups",
      localName: "स्वीट कॉर्न चाट / சோள சாட்",
      prepTime: "5 mins",
      cookTime: "6 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup sweet corn kernels (fresh or frozen)",
        "1 tsp pure homemade butter",
        "1/4 tsp roasted cumin (jeera) powder",
        "1/4 tsp mild chaat masala & 1/4 tsp salt",
        "1 tsp fresh lemon juice",
        "1 tbsp finely chopped fresh coriander leaves"
      ],
      instructions: [
        "Firstly, rinse sweet corn kernels and place into a steamer basket over boiling water.",
        "Cover tightly and steam on medium flame for 5 to 6 minutes until plump, juicy, and bite-soft.",
        "Transfer the hot steamed sweet corn immediately into a dry steel mixing bowl.",
        "Drop in 1 teaspoon butter and toss until melted completely over every warm kernel.",
        "Sprinkle cumin powder, mild chaat masala, salt, and chopped coriander; squeeze fresh lemon juice on top.",
        "Toss briskly until evenly seasoned, cool slightly for 1 minute, and serve in colorful little snack cups with a child spoon."
      ],
      benefits: "Rich in eye-protecting lutein, B vitamins, and fiber for active afternoon play.",
      safety: "Steam kernels thoroughly soft and supervise younger 3-year-olds eating loose kernels with a spoon.",
      icon: "🌽"
    },
    {
      id: '3_5_years_rec_14',
      name: "Soft Date & Almond Energy Bite",
      localName: "खजूर बादाम लड्डू / பேரீச்சம்பழ லட்டு",
      prepTime: "10 mins",
      cookTime: "3 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup soft seedless Medjool dates (pitted and chopped)",
        "2 tbsp finely powdered almonds and cashews",
        "1 tsp pure desi ghee",
        "1/4 tsp green cardamom (elaichi) powder",
        "1 tsp dry-roasted desiccated coconut (optional, for rolling)"
      ],
      instructions: [
        "Firstly, check every date carefully to confirm all pits are removed, then pulse in a mixer jar to a thick paste.",
        "Heat 1 teaspoon desi ghee in a small pan on very low flame.",
        "Add the finely powdered almonds and cashews and warm gently for 1 minute until fragrant.",
        "Add the date paste and cardamom powder; turn off heat immediately and fold together smoothly with a spatula.",
        "Once cool enough to touch safely, knead cleanly for 30 seconds until unified.",
        "Pinch small marble-sized portions, roll firmly between greased palms into smooth spheres, and lightly dust in coconut if desired.",
        "Serve 1–2 sweet bites fresh or pack airtight for healthy preschool snack boxes."
      ],
      benefits: "Zero refined sugar natural energy dense in magnesium, vitamin E, and plant iron.",
      safety: "Always grind almonds and cashews finely with zero hard shards for preschoolers.",
      icon: "🧆"
    },
    {
      id: '3_5_years_rec_15',
      name: "Creamy Banana & Cardamom Milkshake",
      localName: "केला खजूर शेक / வாழைப்பழ பால்",
      prepTime: "5 mins (+ 15 mins soaking)",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 ripe sweet banana (peeled and sliced)",
        "1 cup boiled and cooled whole milk",
        "1 soft seedless date (soaked 15 mins in warm milk)",
        "1/4 tsp green cardamom (elaichi) powder",
        "1/2 tsp finely powdered almonds or cashews (optional)"
      ],
      instructions: [
        "Firstly, pit 1 soft date and soak it in 2 tablespoons warm milk for 15 minutes until completely soft.",
        "Peel and slice the ripe banana into clean rounds and place into a blender jar.",
        "Add the soaked date along with its milk, cardamom powder, and optional fine nut powder.",
        "Pour in half the milk first and blend at high speed for 30 seconds until totally smooth with zero date flecks.",
        "Pour in remaining milk and blend 15 seconds more until creamy and lightly frothy.",
        "Serve immediately at pleasant room temperature in a fun cup with a wide straw or open sipper."
      ],
      benefits: "Rich in potassium, calcium, natural prebiotics, and calming cardamom for post-play recovery.",
      safety: "Avoid adding ice cubes or freezing cold milk which can irritate sensitive throats.",
      icon: "🥤"
    },
    ...buildSharedCoreRecipes('3_5_years', 16)
  ]
};
