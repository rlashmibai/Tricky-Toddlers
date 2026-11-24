import { Recipe } from '../foodGuideData';

interface CoreRecipeTemplate extends Omit<Recipe, 'id'> {}

const coreTemplates: CoreRecipeTemplate[] = [
  {
    name: "Soft Multigrain Khichdi with Ghee",
    localName: "मल्टीग्रेन खिचड़ी / பலதானிய கிச்சடி",
    prepTime: "10 mins (+ 20 mins soaking)",
    cookTime: "15 mins",
    category: 'Lunch',
    region: 'North',
    ingredients: [
      "1/3 cup raw white or brown rice (washed)",
      "2 tbsp yellow moong dal",
      "1 tbsp red masoor dal",
      "2 tbsp finely diced carrots & French beans",
      "1 tbsp green peas",
      "1 tsp pure desi ghee",
      "1/2 tsp cumin seeds (jeera)",
      "1/4 tsp pure turmeric powder (haldi)",
      "1 pinch asafoetida (hing)",
      "1/4 tsp salt (or to taste)",
      "2.5 cups clean drinking water",
      "3 tbsp fresh plain curd & chopped coriander (for serving)"
    ],
    instructions: [
      "Firstly, wash the rice, yellow moong dal, and red masoor dal together 3 times under running water until clear.",
      "Soak the rinsed rice and lentils in fresh water for 20 minutes, then drain completely.",
      "Peel and finely dice the carrots and French beans into small, even ¼-inch cubes.",
      "Heat 1 teaspoon desi ghee in a pressure cooker on low-to-medium flame; add cumin seeds and asafoetida until they crackle cleanly.",
      "Add the diced carrots, beans, and green peas, and sauté gently for 2 minutes until glossy.",
      "Stir in the drained rice and lentils, turmeric powder, and salt, tossing gently for 1 minute.",
      "Pour in 2.5 cups drinking water, stir well, and seal the pressure cooker lid.",
      "Cook on medium flame for 3 to 4 whistles until grains and lentils soften completely, then let pressure release naturally.",
      "Open the lid, mash lightly with the back of a ladle until creamy yet softly textured, and adjust warmth.",
      "Serve warm topped with a tiny drizzle of ghee, chopped coriander, and fresh cooling curd on the side."
    ],
    benefits: "Balanced amino-acid complete protein paired with dietary fiber, iron, and fat-soluble vitamins aided by desi ghee.",
    safety: "For younger toddlers (12–24m), mash peas gently and ensure vegetables squish easily; adjust salt modestly for under-2s.",
    icon: "🍲"
  },
  {
    name: "Mild Vegetable Poha with Peas",
    localName: "पोहा / காய்கறி அவல்",
    prepTime: "8 mins",
    cookTime: "10 mins",
    category: 'Morning',
    region: 'West',
    ingredients: [
      "1 cup thick flattened rice (poha)",
      "1/4 cup small boiled potato cubes",
      "2 tbsp sweet steamed green peas",
      "2 tbsp finely chopped onion (optional)",
      "1 tsp pure desi ghee or cold-pressed groundnut oil",
      "1/4 tsp mustard seeds (rai)",
      "5–6 fresh curry leaves",
      "1/4 tsp pure turmeric powder (haldi)",
      "1/4 tsp salt (or to taste)",
      "1/2 tsp sugar (optional, for balance)",
      "2 tbsp warm water (for steaming)",
      "1 tsp fresh lemon juice & 1 tbsp chopped coriander (for garnish)"
    ],
    instructions: [
      "Firstly, place thick poha in a wide strainer and rinse gently under cool running water for 20 seconds—never soak in a bowl.",
      "Shake off excess water and let the rinsed poha rest in the strainer for 5 minutes so every flake turns soft yet separate.",
      "Sprinkle turmeric powder and salt gently over the resting poha and toss lightly with your fingertips.",
      "Heat 1 teaspoon ghee or oil in a heavy pan on medium-low flame; add mustard seeds and let them splutter completely.",
      "Toss in fresh curry leaves and finely chopped onion; sauté gently for 2 minutes until onions turn translucent.",
      "Add the small boiled potato cubes and steamed green peas, stirring gently for 2 minutes to warm through.",
      "Fold in the seasoned, softened poha carefully from the sides so flakes do not break into mush.",
      "Sprinkle 2 tablespoons warm water evenly across the top, cover with a tight lid, and steam on lowest flame for 2–3 minutes.",
      "Turn off the stove, squeeze fresh lemon juice over the poha, and garnish with finely chopped fresh coriander.",
      "Let cool slightly until comfortable warmth, squish peas for toddlers under 2, and serve fresh."
    ],
    benefits: "Light, iron-rich breakfast pairing vitamin C (lemon juice) with flattened rice to maximize iron absorption.",
    safety: "Keep poha moist by steaming covered; remove whole curry leaves and squish peas flat for children under 24 months.",
    icon: "🥣"
  },
  {
    name: "Soft Methi Thepla with Curd",
    localName: "मेथी थेपला / வெந்தய சப்பாத்தி",
    prepTime: "12 mins (+ 15 mins resting)",
    cookTime: "8 mins",
    category: 'Morning',
    region: 'West',
    ingredients: [
      "1 cup whole wheat flour (atta)",
      "2 tbsp besan (gram flour, for tenderness)",
      "1/2 cup tightly packed fresh methi (fenugreek) leaves, finely chopped",
      "2 tbsp fresh plain curd (yogurt, for softness)",
      "1/4 tsp pure turmeric powder (haldi)",
      "1/2 tsp coriander-cumin (dhana-jeera) powder",
      "1/4 tsp ajwain (carom seeds), crushed between palms",
      "1/4 tsp salt (or to taste)",
      "1 tsp pure ghee or oil (plus extra for roasting)",
      "3 to 4 tbsp warm water (as needed to knead)",
      "1/3 cup fresh cooling curd (for serving)"
    ],
    instructions: [
      "Firstly, wash fresh methi leaves 3 times cleanly, strip away all fibrous stems, pat dry, and chop finely.",
      "In a wide mixing bowl, take whole wheat flour, besan, chopped methi, turmeric, dhana-jeera powder, crushed ajwain, and salt.",
      "Add 1 teaspoon ghee and 2 tablespoons fresh curd; rub thoroughly into the flour so the spices and leaves distribute evenly.",
      "Gradually add warm water 1 tablespoon at a time (methi releases moisture as you knead).",
      "Knead for 4 to 5 minutes into a smooth, supple, non-sticky dough; cover and rest for 15 minutes.",
      "Divide the dough into 4–5 small lime-sized balls and dust lightly with dry whole wheat flour.",
      "Roll each ball thinly and evenly into a 6-inch circle using light, gentle rolling pressure.",
      "Heat a tawa on medium-high flame; place the rolled thepla on the hot griddle and cook for 20 seconds until tiny bubbles rise.",
      "Flip, brush ½ teaspoon ghee lightly over the top, flip again, and press gently with a spatula for 20 seconds until golden spots appear.",
      "Stack wrapped in a clean cloth to keep pillowy soft; tear into finger strips for younger kids and serve warm with fresh curd."
    ],
    benefits: "Fenugreek leaves provide natural iron, vitamin K, and fiber while curd keeps the flatbread tender and gut-friendly.",
    safety: "Roast quickly on medium-hot tawa so theplas stay pliable and soft rather than drying into crisp crackers.",
    icon: "🫓"
  },
  {
    name: "Steamed Corn & Veggie Dhokla",
    localName: "वेज ढोकला / காய்கறி டோக்ளா",
    prepTime: "10 mins (+ 10 mins resting)",
    cookTime: "15 mins",
    category: 'Snacks',
    region: 'West',
    ingredients: [
      "1/2 cup fine besan (chickpea / gram flour)",
      "2 tbsp semolina (fine suji)",
      "1/4 cup fresh sweet corn kernels (steamed & coarsely crushed)",
      "2 tbsp very finely grated carrot",
      "3 tbsp fresh plain curd (slightly tangy or mild)",
      "1/4 cup clean water (to make thick batter)",
      "1/4 tsp turmeric powder (haldi)",
      "1/4 tsp ginger paste (optional)",
      "1/4 tsp salt",
      "1/2 tsp fruit salt / baking soda + few drops lemon juice",
      "1 tsp oil (for greasing & tempering) + 1/4 tsp mustard seeds & 4 curry leaves"
    ],
    instructions: [
      "Firstly, grease a flat steel thali or steaming tin lightly with oil and bring 2 inches of water to a boil in a wide steamer.",
      "In a mixing bowl, whisk besan, semolina, curd, turmeric, ginger paste, and salt with ¼ cup water into a smooth lump-free batter.",
      "Fold in the coarsely crushed sweet corn and finely grated carrot, then cover and let the batter rest for 10 minutes.",
      "Just before steaming, stir in fruit salt (or baking soda with a drop of lemon juice) gently until the batter turns light and frothy.",
      "Immediately pour the aerated batter into the greased steaming tray and tap gently to level.",
      "Place inside the hot steamer, cover with a lid wrapped in a clean cloth (to catch drips), and steam on medium flame for 12–15 minutes.",
      "Insert a clean knife into the center; if it comes out completely clean, turn off the stove and cool for 5 minutes.",
      "For tempering, heat ½ tsp oil in a small tadka pan, pop mustard seeds and curry leaves, add 2 tbsp water, and simmer 15 seconds.",
      "Cut the spongy dhokla into neat bite-sized squares, spoon the warm tempering evenly over every piece, garnish with coriander, and serve."
    ],
    benefits: "Light, zero-deep-fry steamed chickpea protein snack paired with vitamin-rich sweet corn and carrots.",
    safety: "Ensure sweet corn kernels are crushed before mixing so toddlers never get whole slippery corn kernels.",
    icon: "🟡"
  },
  {
    name: "Homestyle Yellow Dal Tadka with Phulka",
    localName: "दाल तड़का फुल्का / தால் தட்கா ரொட்டி",
    prepTime: "10 mins (+ 20 mins soaking)",
    cookTime: "15 mins",
    category: 'Dinner',
    region: 'North',
    ingredients: [
      "1/3 cup split toor or yellow moong dal (washed)",
      "1 small ripe red tomato (finely chopped)",
      "1.5 cups clean drinking water",
      "1/4 tsp turmeric powder (haldi)",
      "1/2 tsp pure desi ghee",
      "1/2 tsp cumin seeds (jeera)",
      "1 clove garlic (finely minced, optional)",
      "1 pinch asafoetida (hing)",
      "1/4 tsp salt (or to taste)",
      "2 soft whole wheat phulkas (brushed with a drop of ghee)",
      "1 tbsp finely chopped fresh coriander leaves"
    ],
    instructions: [
      "Firstly, wash the toor or yellow moong dal 3 times cleanly and soak in water for 20 minutes to improve digestibility.",
      "Drain and place the dal into a pressure cooker with 1.5 cups fresh water, turmeric powder, and salt.",
      "Pressure cook for 3 to 4 whistles on medium flame until completely soft, then let pressure drop naturally.",
      "Whisk the cooked dal smoothly inside the pot using a wooden mathani or ladle until creamy.",
      "Heat ½ teaspoon pure desi ghee in a small tadka pan over low flame; add cumin seeds and asafoetida until fragrant.",
      "Add minced garlic (if using) and sauté 15 seconds without browning, then tip in finely chopped tomatoes.",
      "Cook the tomatoes on low-to-medium flame for 3–4 minutes until completely soft and mushy.",
      "Pour the cooked dal into the pan (or pour tadka over the dal), adjust with a splash of hot water, and simmer 2 minutes.",
      "Garnish with chopped fresh coriander leaves and serve warm alongside torn soft ghee-brushed phulka pieces."
    ],
    benefits: "Classic plant protein, iron, and slow-release dinner nutrition with digestive jeera-hing tempering.",
    safety: "For children under 24 months, soak small torn phulka strips directly in the warm dal until melt-in-mouth soft.",
    icon: "🍲"
  },
  {
    name: "Creamy Curd Rice with Pomegranate",
    localName: "दही भात / தயிர் சாதம்",
    prepTime: "8 mins",
    cookTime: "12 mins",
    category: 'Lunch',
    region: 'South',
    ingredients: [
      "1/2 cup short-grain rice (Sona Masoori or Ponni, washed)",
      "1.5 cups clean drinking water (for soft cooking)",
      "1/2 cup fresh homemade non-sour curd (dahi)",
      "2 tbsp warm whole milk (keeps curd rice creamy, prevents souring)",
      "1/2 tsp pure ghee or sesame oil",
      "1/4 tsp mustard seeds (rai) & 1/4 tsp urad dal (optional for older kids)",
      "4 fresh curry leaves & 1 pinch hing",
      "1/4 tsp salt (or to taste)",
      "2 tbsp sweet juicy pomegranate pearls (anar) & 1 tbsp finely grated carrot"
    ],
    instructions: [
      "Firstly, wash rice cleanly and pressure cook with 1.5 cups water for 3–4 whistles until slightly extra soft.",
      "Transfer the hot cooked rice into a wide mixing bowl and mash well with the back of a spoon while still warm.",
      "Allow the mashed rice to cool down completely to lukewarm/room temperature before adding yogurt.",
      "Stir 2 tablespoons milk and salt into the cooled mashed rice so grains separate smoothly.",
      "Whisk fresh homemade curd until velvety smooth and fold it thoroughly into the rice.",
      "In a tiny tadka spoon, heat ½ teaspoon ghee on low flame; pop mustard seeds, curry leaves, and a pinch of hing.",
      "Pour the aromatic warm tempering over the curd rice and mix in finely grated sweet carrot.",
      "Top with juicy pomegranate pearls right before serving at comfortable room temperature (never chilled straight from fridge)."
    ],
    benefits: "Natural probiotics protect gut immunity while delivering bone calcium, cooling hydration, and vitamin C.",
    safety: "Ensure pomegranate seeds are crushed or omitted for children under 24 months if they do not yet chew seeds well.",
    icon: "🍚"
  },
  {
    name: "Ghee Roasted Makhana (Foxnuts)",
    localName: "भुना मखाना / வறுத்த தாமரை விதை",
    prepTime: "2 mins",
    cookTime: "7 mins",
    category: 'Snacks',
    region: 'North',
    ingredients: [
      "1.5 cups whole white foxnuts (phool makhana)",
      "1 tsp pure desi ghee",
      "1/4 tsp roasted cumin (jeera) powder",
      "1/4 tsp pure turmeric powder (haldi)",
      "1/4 tsp mild rock salt or chaat masala (optional, age-appropriate)"
    ],
    instructions: [
      "Firstly, spread out the foxnuts on a plate and remove any dark hard shell husks stuck to the outside.",
      "Heat a heavy-bottomed kadhai or thick frying pan on the very lowest flame.",
      "Add the whole makhana dry first (optional) or directly with 1 teaspoon melted desi ghee.",
      "Roast slowly on low flame for 6 to 7 minutes, stirring continuously from the bottom so none scorch.",
      "Test crunchiness by pressing one foxnut between your fingers—it should snap cleanly with a crisp crack rather than feel chewy.",
      "Keep the flame at lowest setting, sprinkle in turmeric, roasted jeera powder, and salt/chaat masala.",
      "Toss briskly for 30 seconds until every puffy foxnut is evenly coated in golden spiced ghee.",
      "Turn off the stove and spread the roasted makhana on a wide steel plate to cool completely.",
      "Check crispness again before serving; store leftovers immediately in a dry airtight glass jar for up to 2 weeks."
    ],
    benefits: "Light, gluten-free snack packed with calcium, magnesium, potassium, and plant antioxidants.",
    safety: "Roast until 100% crisp—chewy half-roasted makhana sticks to the palate. For under-2s, crush coarsely before offering.",
    icon: "🍿"
  },
  {
    name: "Oats & Banana Cinnamon Porridge",
    localName: "ओट्स दलिया / ஓட்ஸ் கஞ்சி",
    prepTime: "4 mins",
    cookTime: "8 mins",
    category: 'Morning',
    region: 'Pan-Indian',
    ingredients: [
      "1/3 cup old-fashioned rolled oats",
      "1 cup whole milk (or almond milk / half milk, half water)",
      "1/2 ripe sweet banana (mashed or finely sliced)",
      "1/4 tsp true Ceylon cinnamon (dalchini) powder",
      "1/2 tsp chia seeds or flaxseed powder (optional)",
      "1 tsp pure ghee or almond butter (optional, for creaminess)",
      "1/2 tsp jaggery powder or date syrup (optional, for 12m+)"
    ],
    instructions: [
      "Firstly, dry-roast the rolled oats in a small saucepan on low flame for 2 minutes until lightly nutty.",
      "Pour in 1 cup whole milk (or milk-water mix) and stir well to coat the oats.",
      "Bring to a gentle simmer over low-to-medium flame, then reduce heat to low.",
      "Cook uncovered for 5 to 6 minutes, stirring regularly from the bottom until creamy and thick.",
      "Meanwhile, mash half of a ripe banana in a bowl using a clean fork (reserve a few soft thin slices for older kids).",
      "Stir Ceylon cinnamon powder and optional flaxseed/chia into the simmering oats during the final minute.",
      "Turn off the stove and fold in the mashed ripe banana and ghee/almond butter until glossy and naturally sweet.",
      "Transfer to a warm bowl, let cool down to lukewarm, top with optional soft banana coins, and serve fresh."
    ],
    benefits: "Rich in beta-glucan soluble fiber, potassium, calcium, and warming Ceylon cinnamon for sustained morning focus.",
    safety: "Test temperature carefully since thick porridge retains heat inside; omit jaggery/honey for under-12m babies.",
    icon: "🥣"
  },
  {
    name: "Paneer & Green Peas Pulao",
    localName: "पनीर मटर पुलाव / பன்னீர் புலாவ்",
    prepTime: "10 mins (+ 20 mins soaking)",
    cookTime: "15 mins",
    category: 'Dinner',
    region: 'North',
    ingredients: [
      "1/2 cup aged basmati rice (washed and soaked)",
      "1/3 cup fresh soft paneer, cut into small ½-inch cubes",
      "1/4 cup sweet green peas (fresh or thawed frozen)",
      "1/4 cup finely chopped onion & 2 tbsp finely grated carrot",
      "1.5 tsp pure desi ghee",
      "1/2 tsp cumin seeds (jeera) & 1 small green cardamom pod (lightly crushed)",
      "1 small piece bay leaf (tej patta) & 1/2 inch cinnamon stick (discard before serving)",
      "1/4 tsp salt (or to taste)",
      "1 cup clean drinking water (plus 1 tbsp extra for softer grains)"
    ],
    instructions: [
      "Firstly, wash basmati rice cleanly 3 times, soak in water for 20 minutes, and drain completely.",
      "Heat ½ teaspoon ghee in a pressure cooker on low flame and lightly sauté the paneer cubes for 1 minute until warmed (keep soft, don't brown hard), then remove to a plate.",
      "Add the remaining 1 teaspoon ghee to the cooker along with cumin seeds, crushed cardamom, cinnamon, and bay leaf until fragrant.",
      "Add chopped onion and grated carrot; sauté gently for 2 minutes until soft and aromatic.",
      "Stir in the green peas and drained soaked basmati rice gently with a flat spatula so rice grains do not snap.",
      "Add 1 cup water and salt, stir gently once, and fold the sautéed soft paneer cubes back in.",
      "Cover the lid and pressure cook on medium flame for 2 whistles, then turn off heat and let steam settle for 10 minutes.",
      "Open the lid, pick out whole bay leaf and cinnamon stick cleanly, and fluff the fragrant pulao gently with a fork.",
      "Cool slightly and serve warm alongside fresh cucumber raita or plain homemade curd."
    ],
    benefits: "Protein-packed cottage cheese paired with fragrant complex rice carbs, B vitamins, and bone-building phosphorus.",
    safety: "Always remove whole spices (cardamom pod, bay leaf, cinnamon stick) and keep paneer soft and small-cubed for toddlers.",
    icon: "🍲"
  },
  {
    name: "Sprouted Ragi Malt Drink",
    localName: "रागी माल्ट / ராகி மால்ட்",
    prepTime: "3 mins",
    cookTime: "7 mins",
    category: 'Morning',
    region: 'South',
    ingredients: [
      "1.5 tbsp pure sprouted ragi (finger millet) flour",
      "1/4 cup room-temperature clean drinking water (for slurry)",
      "1 cup whole milk (or thin coconut/almond milk)",
      "1 tsp organic jaggery powder or soft date paste",
      "1 pinch green cardamom (elaichi) powder",
      "1/2 tsp finely powdered roasted almonds (optional, for kids 2y+)"
    ],
    instructions: [
      "Firstly, place sprouted ragi flour into a cold heavy-bottomed saucepan.",
      "Add ¼ cup room-temperature water and whisk vigorously until a completely smooth, lump-free cocoa-colored slurry forms.",
      "Pour in 1 cup milk (or water-milk blend) and stir well before turning on the stove.",
      "Switch on low flame and stir continuously in one direction so millet starch never scorches or clumps at the bottom.",
      "Simmer steadily for 5 to 6 minutes after it starts steaming gently, until the malt thickens slightly and turns silky glossy.",
      "Turn off the stove and stir in organic jaggery powder, cardamom powder, and optional fine almond powder.",
      "Stir until the jaggery dissolves completely; strain through a small sieve if any tiny grain skin floated up.",
      "Pour into a favorite mug, allow to cool to comfortable warm drinking temperature, and serve fresh."
    ],
    benefits: "Powerhouse natural calcium (344 mg/100g) plus bioavailable iron from sprouted ragi supporting bone density and growth.",
    safety: "Cook ragi thoroughly for 5–6 minutes before serving to prevent tummy ache; test warmth carefully before handing cup.",
    icon: "🥛"
  },
  {
    name: "Carrot Tomato Soup with Croutons",
    localName: "गाजर टमाटर सूप / கேரட் தக்காளி சூப்",
    prepTime: "10 mins",
    cookTime: "15 mins",
    category: 'Dinner',
    region: 'North',
    ingredients: [
      "2 medium ripe red tomatoes, washed and roughly chopped",
      "1 medium sweet red or orange carrot, peeled and sliced",
      "1 small slice beetroot (optional, for natural ruby color)",
      "1 tsp unsalted butter or olive oil",
      "1 clove garlic (lightly crushed) & 1 tiny bay leaf (optional)",
      "1.5 cups clean drinking water or vegetable stock",
      "1/4 tsp mild freshly ground black pepper & 1/4 tsp salt",
      "1 slice whole wheat bread, toasted crisp and cut into small cubes (croutons)"
    ],
    instructions: [
      "Firstly, wash, peel, and slice the carrot and chop the ripe tomatoes cleanly.",
      "Melt 1 teaspoon butter in a pressure cooker or saucepan on low flame; sauté garlic and bay leaf for 30 seconds.",
      "Toss in the sliced carrots, chopped tomatoes, and beetroot slice; sauté for 2 minutes until tomatoes soften slightly.",
      "Add 1.5 cups water and salt, seal the cooker (or cover pot), and cook for 3 whistles / 12 minutes until carrots mash effortlessly.",
      "Remove the bay leaf, allow the cooked veggies and broth to cool slightly, then blend until completely velvety smooth.",
      "Pass the soup through a medium-fine strainer into a clean pot to catch tomato skins and seeds.",
      "Simmer on low flame for 2 minutes, adjusting thickness with hot water if needed and finishing with mild black pepper.",
      "Meanwhile, toast a slice of whole wheat bread in a dry pan with a brush of butter until golden, then dice into small bite-sized croutons.",
      "Pour warm (never scalding) soup into a bowl and float a few croutons on top just before serving so they soften slightly."
    ],
    benefits: "Concentrated lycopene, beta-carotene, and vitamin C that strengthen respiratory immunity during seasonal changes.",
    safety: "Ensure soup cools to comfortably warm temperature; let croutons soften briefly in the soup for younger toddlers.",
    icon: "🍲"
  },
  {
    name: "Mixed Dry Fruit & Date Ladoo",
    localName: "खजूर ड्राई फ्रूट लड्डू / பேரீச்சம்பழ லட்டு",
    prepTime: "12 mins",
    cookTime: "6 mins",
    category: 'Snacks',
    region: 'Pan-Indian',
    ingredients: [
      "1 cup soft seedless Medjool or Kimia dates (pitted and finely chopped)",
      "2 tbsp almonds, dry-roasted and powdered/chopped fine",
      "2 tbsp cashews, dry-roasted and powdered/chopped fine",
      "2 tbsp walnuts or pistachios (optional), powdered fine",
      "1 tbsp pumpkin seeds or white sesame seeds (lightly toasted)",
      "1 tsp pure desi ghee",
      "1/4 tsp green cardamom (elaichi) powder"
    ],
    instructions: [
      "Firstly, check every single date to verify all pits and hard caps are removed, then chop or pulse into a sticky coarse paste.",
      "Dry-roast the almonds, cashews, walnuts, and seeds in a heavy pan on low flame for 3–4 minutes until aromatic; cool and grind fine for under-4s (or chop finely for older kids).",
      "Heat 1 teaspoon pure desi ghee in the same pan over lowest flame.",
      "Add the chopped date paste and press gently with a spatula for 2 to 3 minutes until the dates warm, soften, and turn pliable.",
      "Turn off the stove immediately so the date sugars never harden into caramel.",
      "Tip in the roasted nut-seed mixture and cardamom powder into the warm date base.",
      "Knead and fold thoroughly while comfortably warm to touch until all nuts bind evenly into the dark date mixture.",
      "Grease your palms with a tiny drop of ghee, pinch small portions, and roll firmly between your palms into smooth mini ladoos.",
      "Cool completely on a plate; store in an airtight box in a cool spot for up to 2–3 weeks."
    ],
    benefits: "Naturally sweetened zero-sugar energy bite rich in iron, zinc, magnesium, and brain-healthy omega fats.",
    safety: "For children under 4 years, nuts and seeds MUST be ground into a smooth powder (no chunky nut shards) to avoid choking.",
    icon: "🧆"
  },
  {
    name: "Palak Paneer with Soft Steamed Rice",
    localName: "पालक पनीर भात / பாலக் பன்னீர் சாதம்",
    prepTime: "10 mins",
    cookTime: "12 mins",
    category: 'Lunch',
    region: 'North',
    ingredients: [
      "1 cup tightly packed fresh baby spinach (palak) leaves, stems trimmed",
      "1/3 cup fresh soft paneer cubes (½-inch dice)",
      "1/2 cup cooked soft steamed rice",
      "1 small ripe tomato (chopped) & 1/4 small onion (finely chopped)",
      "1 tsp pure desi ghee",
      "1/2 tsp cumin seeds (jeera) & 1 clove garlic (minced)",
      "1 pinch turmeric powder & 1 pinch mild kasuri methi (optional)",
      "1/4 tsp salt (or to taste)"
    ],
    instructions: [
      "Firstly, wash fresh spinach leaves 3 times cleanly; blanch in boiling water for 2 minutes, then immediately plunge into cold water.",
      "Blend the blanched spinach smoothly into a vibrant green puree (do not over-blend warm).",
      "Heat 1 teaspoon ghee in a pan on low-to-medium flame; add cumin seeds and minced garlic for 20 seconds.",
      "Add chopped onion and tomato and sauté for 3–4 minutes until tomatoes break down cleanly.",
      "Add turmeric, salt, and optional crushed kasuri methi, then stir in the smooth spinach puree.",
      "Simmer on low flame for 3 minutes until raw greens aroma vanishes and the gravy turns glossy green.",
      "Drop in the soft paneer cubes and simmer 2 minutes gently (do not overboil paneer or it becomes chewy).",
      "Serve warm spooned generously over soft steamed rice, mixed lightly together for effortless eating."
    ],
    benefits: "Delivers folate, vitamin K, plant iron, and complete calcium-rich dairy protein in one appetizing green bowl.",
    safety: "Cook spinach fresh and avoid reheating leftovers multiple times; keep paneer cubes small and tender.",
    icon: "🍛"
  },
  {
    name: "Moong Dal Cheela with Mint Curd",
    localName: "मूंग दाल चीला / பாசிப்பருப்பு அடை",
    prepTime: "10 mins (+ 3 hrs soaking)",
    cookTime: "10 mins",
    category: 'Morning',
    region: 'North',
    ingredients: [
      "1/2 cup split yellow moong dal (soaked 3 hours and drained)",
      "1/2 inch fresh ginger piece & 2 tbsp water (for grinding)",
      "2 tbsp finely grated fresh carrot",
      "2 tbsp finely grated soft paneer",
      "1 tbsp finely chopped fresh coriander leaves",
      "1/4 tsp turmeric powder (haldi) & 1/4 tsp cumin powder",
      "1/4 tsp salt (or to taste)",
      "1 tsp pure desi ghee (for cooking on tawa)",
      "3 tbsp fresh mint curd dip (whisked curd + 1 tsp fresh mint puree)"
    ],
    instructions: [
      "Firstly, rinse the soaked yellow moong dal cleanly and drain off all soaking water.",
      "Grind the drained moong dal with fresh ginger and 2–3 tablespoons fresh water into a smooth, pourable pancake batter.",
      "Pour into a bowl and whisk in turmeric, cumin powder, salt, and chopped coriander; rest 5 minutes.",
      "Mix the grated carrot and grated paneer gently in a small bowl for the nutritious topping.",
      "Heat a flat tawa or skillet on medium-low flame and brush lightly with ¼ teaspoon ghee.",
      "Pour a ladle of moong batter onto the center and spread in gentle spiral motion into a soft 5-inch round.",
      "Scatter the grated carrot-paneer topping evenly over the wet surface and press lightly with a spatula.",
      "Drizzle ½ teaspoon ghee around edges, cover briefly for 1 minute, then flip and cook 2 minutes until golden brown.",
      "Fold softly, slice into neat kid-friendly strips or triangles, and serve warm with cooling mint curd dip."
    ],
    benefits: "High biological-value lentil + dairy protein combined with beta-carotene and gut-friendly probiotic mint dip.",
    safety: "Keep the cheela slightly thick and soft rather than paper-crisp for toddlers under 3 years.",
    icon: "🫓"
  },
  {
    name: "Moong Sprout & Sweet Corn Chaat",
    localName: "मूंग कॉर्न चाट / முளைகட்டிய பயறு சாட்",
    prepTime: "8 mins",
    cookTime: "6 mins",
    category: 'Snacks',
    region: 'Pan-Indian',
    ingredients: [
      "1/2 cup fresh sprouted green moong beans",
      "1/3 cup sweet corn kernels",
      "2 tbsp finely diced cucumber (peeled & deseeded)",
      "2 tbsp finely diced ripe tomato (deseeded)",
      "1 tbsp finely chopped fresh coriander leaves",
      "1/4 tsp roasted cumin (jeera) powder",
      "1/4 tsp mild chaat masala (or black salt)",
      "1 tsp fresh lemon juice",
      "1/2 tsp cold-pressed olive oil or melted ghee (optional)"
    ],
    instructions: [
      "Firstly, wash fresh green moong sprouts thoroughly and place them with sweet corn kernels into a steamer basket.",
      "Steam over boiling water covered for 5 to 6 minutes until both sprouts and corn kernels turn tender and bite-soft (never serve sprouts raw to young children).",
      "Drain and allow the steamed sprouts and corn to cool down cleanly in a mixing bowl.",
      "Finely dice peeled cucumber, ripe tomato, and fresh coriander leaves.",
      "For toddlers under 24 months, lightly pulse or crush the steamed corn and sprouts briefly with a fork for safe chewing.",
      "Combine the steamed moong sprouts, sweet corn, diced cucumber, tomato, and coriander in the mixing bowl.",
      "Sprinkle in roasted cumin powder, mild chaat masala, fresh lemon juice, and optional drop of olive oil.",
      "Toss thoroughly until every bean and kernel glistens evenly with zesty seasoning, and serve fresh immediately."
    ],
    benefits: "Sprouting boosts enzyme bioavailability and vitamin C while sweet corn supplies B vitamins, lutein, and natural energy.",
    safety: "CRITICAL: Always steam green moong sprouts thoroughly—never feed raw sprouts to infants or young children due to bacterial risk.",
    icon: "🥗"
  }
];

export const buildSharedCoreRecipes = (stagePrefix: string, startNumber: number): Recipe[] => {
  return coreTemplates.map((tpl, idx) => ({
    ...tpl,
    id: `${stagePrefix}_rec_${startNumber + idx}`
  }));
};
