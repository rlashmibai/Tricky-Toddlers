import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_24_36_months: AgeGroupData = {
  id: '24_36_months',
  ageLimit: '24 - 36 Months',
  title: "Independent Eating",
  guidelines: "Toddlers eat 3 meals and 2-3 snacks daily. Encourage using kid-friendly forks and spoons. Offer varying food textures and diverse flavor profiles. Involve them in safe kitchen prep.",
  milestones: [
    "Uses child cutlery with decent control.",
    "Chews complex textures (like meats, raw fruits, and rotis) with ease.",
    "Vocalizes clear opinions on likes and dislikes, showing active independence."
  ],
  recipes: [
    {
      id: '24_36_months_rec_1',
      name: "Multi-Grain Cheesy Dosa Roll",
      localName: "चीज डोसा रोल / சீஸ் தோசை சுருள்",
      prepTime: "10 mins (+ 10 mins resting)",
      cookTime: "6 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup multi-grain batter (ragi flour, oats flour, and rice-urad batter)",
        "2 tbsp grated mild cheddar or fresh grated paneer",
        "1 tbsp very finely grated carrot (optional)",
        "1/2 tsp unsalted butter or pure desi ghee",
        "1 pinch roasted cumin powder",
        "1 pinch mild salt (if batter is unsalted)",
        "1 to 2 tbsp clean water (to adjust batter consistency)"
      ],
      instructions: [
        "Firstly, whisk the multi-grain batter with a splash of water and cumin powder until smooth and pourable; rest 10 minutes.",
        "Grate mild cheddar or fresh paneer finely into a small bowl so it melts rapidly.",
        "Heat a flat non-stick skillet or cast-iron tawa on medium flame and lightly grease with ¼ teaspoon butter.",
        "Pour a ladle of batter onto the center and spread smoothly in a circular motion into a thin 6-inch crepe.",
        "Drizzle ¼ teaspoon melted butter around edges and cook 90 seconds until crisp-golden underneath.",
        "Flip briefly for 20 seconds if needed, then flip back right side up and lower flame to minimum.",
        "Scatter grated cheese (and optional finely grated carrot) evenly across the warm dosa surface.",
        "Cover with a lid for 30 seconds until cheese melts creamy without burning the bottom.",
        "Roll the dosa snugly into a neat cylinder using a spatula, let cool 1 minute, slice into soft pinwheels, and serve."
      ],
      benefits: "High calcium, dietary iron, and complex grain energy presented as playful hand-held dosa pinwheels.",
      safety: "Let pinwheels cool for 1–2 minutes so hot melted cheese inside never burns the child's palate.",
      icon: "🌯"
    },
    {
      id: '24_36_months_rec_2',
      name: "Rainbow Veggie Garden Pulao",
      localName: "वेजिटेबल पुलाव / காய்கறி புலாவ்",
      prepTime: "15 mins (+ 20 mins soaking)",
      cookTime: "15 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup long-grain basmati rice (washed cleanly)",
        "2 tbsp very finely diced bright orange carrot",
        "2 tbsp sweet tender green peas",
        "2 tbsp sweet corn kernels (boiled soft)",
        "2 tbsp finely chopped pink onion or mild red bell pepper",
        "1 tsp pure desi ghee",
        "1/2 tsp cumin seeds (jeera) & 1 small green cardamom pod",
        "1 tiny ½-inch Ceylon cinnamon piece (remove before serving)",
        "1/4 tsp turmeric powder & 1/4 tsp salt",
        "1 cup clean drinking water"
      ],
      instructions: [
        "Firstly, rinse basmati rice 3 times cleanly, soak in fresh water for 20 minutes, and drain completely.",
        "Prep and dice carrots, bell peppers, and onions evenly into small toddler-friendly cubes.",
        "Heat 1 teaspoon desi ghee in a pressure cooker on low-to-medium flame; add cumin seeds, lightly crushed cardamom, and cinnamon.",
        "Sauté chopped onions for 1 minute until soft, then toss in carrots, sweet peas, and sweet corn.",
        "Stir gently for 2 minutes with turmeric powder and salt until veggies gleam bright in ghee.",
        "Add the drained soaked rice and fold gently so delicate grains stay intact.",
        "Pour in 1 cup water, stir once cleanly, and close the pressure cooker lid.",
        "Cook for 2 whistles on medium flame, turn off heat, and let steam rest undisturbed for 8 minutes.",
        "Pick out the whole cinnamon piece and cardamom pod cleanly, fluff with a fork, cool slightly, and serve with fresh yogurt."
      ],
      benefits: "Visual rainbow colors encourage adventurous toddler eating while delivering beta-carotene, fiber, and comforting carbs.",
      safety: "Ensure peas and sweet corn are completely soft (steam extra for younger 2-year-olds) and remove whole spices before serving.",
      icon: "🍚"
    },
    {
      id: '24_36_months_rec_3',
      name: "No-Sugar Dates & Oats Energy Balls",
      localName: "खजूर और ओट्स लड्डू / பேரீச்சம்பழ லட்டு",
      prepTime: "10 mins",
      cookTime: "5 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup soft pitted Medjool or Kimia dates",
        "1/4 cup rolled oats (dry-roasted and finely powdered)",
        "2 tbsp finely powdered almonds and cashews (zero large shards)",
        "1/2 tsp pure desi ghee",
        "1/4 tsp green cardamom (elaichi) powder",
        "1 tsp dry-roasted white sesame seeds (optional)"
      ],
      instructions: [
        "Firstly, inspect every pitted date carefully to confirm zero pits remain, then chop roughly.",
        "Pulse the chopped dates in a small food processor or mixer jar into a thick sticky paste.",
        "Heat ½ teaspoon pure ghee in a dry pan on low flame; roast rolled oats powder and nut powder for 2–3 minutes until warm and nutty.",
        "Add cardamom powder and optional toasted sesame seeds into the pan and turn off the heat.",
        "Add the sticky date paste directly into the warm roasted oat-nut mixture.",
        "Mix thoroughly with a spatula, then wait 1 minute until comfortably warm to handle.",
        "Grease your palms with a drop of ghee and knead the mixture together cleanly for 30 seconds until uniform.",
        "Pinch small portions and roll firmly into smooth, marble-sized toddler energy bites.",
        "Serve 1–2 bites fresh with milk, or store airtight for up to 10 days."
      ],
      benefits: "Zero-added-sugar natural energy packed with plant iron, omega fats, calcium, and soluble oat fiber.",
      safety: "Grind almonds and cashews into a completely fine powder—never leave crunchy nut chunks for toddlers under 4.",
      icon: "🧆"
    },
    {
      id: '24_36_months_rec_4',
      name: "Steamed Pink Beetroot Mini Idlis",
      localName: "चुकंदर इडली / பீட்ரூட் மினி இட்லி",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fresh fermented idli batter (thick consistency)",
        "2 tbsp fresh steamed or raw beetroot purée (smooth)",
        "1 tiny pinch roasted cumin (jeera) powder",
        "1 tiny pinch salt (if batter is unsalted)",
        "1/2 tsp pure ghee (for greasing moulds and optional drizzle)",
        "2 tbsp mild fresh coconut chutney (for dipping)"
      ],
      instructions: [
        "Firstly, peel and grate fresh beetroot, blend with 1 tablespoon water into a completely smooth ruby purée (or squeeze out juice).",
        "Stir 2 tablespoons smooth beetroot purée and cumin powder into the idli batter until evenly vibrant pink.",
        "Bring 2 inches of water to a steady simmer in an idli steamer pot.",
        "Grease mini-idli mould cavities cleanly with ½ teaspoon melted ghee.",
        "Spoon the bright pink batter into each mini cavity cleanly without overfilling.",
        "Place trays inside the hot steamer, cover tightly, and steam on medium flame for 8 to 10 minutes.",
        "Test doneness by inserting a clean toothpick into the center—it must come out completely clean.",
        "Cool 3 minutes, gently scoop out mini idlis with a wet spoon, halve them if offering to younger 2-year-olds, and serve with coconut chutney."
      ],
      benefits: "Bright pink color delights picky toddlers while delivering gut probiotics, folate, potassium, and iron.",
      safety: "Keep mini idlis soft and moist; pair with mild coconut dip for easy swallowing.",
      icon: "🔴"
    },
    {
      id: '24_36_months_rec_5',
      name: "Soft Whole Wheat Paneer Kathi Roll",
      localName: "पनीर काठी रोल / பன்னீர் சுருள் ரோல்",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 large soft whole wheat roti or phulka",
        "1/3 cup fresh soft paneer cut into thin 2-inch finger strips",
        "2 tbsp very thinly sliced green & red capsicum (bell pepper)",
        "1 tbsp finely sliced mild sweet onion (optional)",
        "1 tbsp mild mint-coriander yogurt dip",
        "1/2 tsp pure desi ghee",
        "1/4 tsp roasted cumin powder & 1 pinch mild chaat masala",
        "1 pinch salt"
      ],
      instructions: [
        "Firstly, heat ½ teaspoon ghee in a non-stick skillet on low-to-medium flame.",
        "Add thinly sliced capsicum and mild onion; sauté gently for 2–3 minutes until softened and slightly sweet.",
        "Toss in the paneer finger strips, cumin powder, mild chaat masala, and pinch of salt.",
        "Stir carefully for 90 seconds until paneer warms through cleanly without turning crisp or dry, then turn off heat.",
        "Warm a fresh soft whole wheat roti on a tawa for 20 seconds so it stays supple and rolls easily without cracking.",
        "Lay the warm roti flat on a clean plate and spread 1 tablespoon mint-yogurt dip evenly down the center.",
        "Arrange the soft paneer fingers and tender veggies along the center line.",
        "Fold the bottom edge slightly and roll snugly into a tight handheld wrap; slice diagonally into two halves and serve warm."
      ],
      benefits: "Complete protein and calcium tucked inside an easy handheld roti wrap ideal for independent toddlers.",
      safety: "Ensure capsicum strips are sautéed completely soft and roti stays supple rather than stiff.",
      icon: "🌯"
    },
    {
      id: '24_36_months_rec_6',
      name: "Ragi & Raw Cacao Fluffy Pancakes",
      localName: "रागी चॉकलेट पैनकेक / ராகி சாக்லேட் பான்கேக்",
      prepTime: "6 mins (+ 5 mins resting)",
      cookTime: "8 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup sprouted ragi (finger millet) flour",
        "1/4 cup whole wheat flour (atta)",
        "1 tsp pure organic unsweetened cacao powder (or carob powder)",
        "1 tbsp organic jaggery powder (or 2 tbsp mashed ripe banana)",
        "1/2 cup warm whole milk (plus 1 tbsp if batter thickens)",
        "1/4 tsp baking powder & 1 tiny pinch cardamom powder",
        "1 tsp unsalted butter or ghee (for pan cooking)"
      ],
      instructions: [
        "Firstly, sift the sprouted ragi flour, whole wheat flour, unsweetened cacao powder, and baking powder together into a mixing bowl.",
        "Dissolve organic jaggery powder completely in warm milk (strain through a small sieve if any grit exists).",
        "Slowly pour the sweetened warm milk and cardamom into the dry flours while whisking gently.",
        "Mix until a thick, glossy, lump-free pancake batter forms; let rest 5 minutes.",
        "Heat a flat non-stick pan over low flame and grease lightly with melted butter or ghee.",
        "Pour 2 tablespoons of batter per pancake onto the pan to make fluffy 3-inch silver-dollar rounds.",
        "Cook covered on low flame for 2 minutes until tiny bubbles dot the surface.",
        "Flip gently with a thin spatula, cook 90 seconds more until puffed and cooked through inside, cool slightly, and serve warm."
      ],
      benefits: "High iron and bone calcium disguised in a gentle cacao flavor with zero refined white sugar.",
      safety: "Use mild raw cacao/carob lightly rather than heavy caffeine cocoa or sugary chocolate syrups.",
      icon: "🥞"
    },
    {
      id: '24_36_months_rec_7',
      name: "Tawa Crisp Mixed Vegetable & Oats Cutlets",
      localName: "वेज कटलेट / காய்கறி கட்லெட்",
      prepTime: "15 mins",
      cookTime: "10 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup boiled and smoothly mashed potato & sweet carrot mix",
        "2 tbsp boiled green peas (lightly mashed)",
        "3 tbsp dry-roasted rolled oats powder",
        "1 tbsp finely chopped fresh coriander leaves",
        "1/4 tsp roasted cumin (jeera) powder",
        "1/4 tsp mild chaat masala or amchur (dry mango) powder",
        "1/4 tsp salt",
        "1.5 tsp pure desi ghee (for pan-roasting)"
      ],
      instructions: [
        "Firstly, boil or steam potato, peeled carrot, and green peas until completely fork-tender, then drain excess moisture thoroughly.",
        "Mash the warm veggies smoothly in a mixing bowl using a fork or masher.",
        "Stir in roasted oats powder, chopped coriander, cumin powder, mild chaat masala, and salt.",
        "Mix cleanly into a soft, non-sticky dough that holds shape easily (add 1 tsp extra oats powder if too wet).",
        "Flatten on a clean greased plate to ½-inch thickness and stamp out fun star, heart, or circle shapes with cookie cutters.",
        "Heat 1 teaspoon ghee in a flat skillet on low-to-medium flame.",
        "Arrange the cutlets evenly on the pan and roast slowly for 3 to 4 minutes until lightly golden underneath.",
        "Drizzle remaining ghee on top, flip carefully, roast 3–4 more minutes until crisp outside and tender inside, cool slightly, and serve."
      ],
      benefits: "Sneaks three colorful vegetables and heart-healthy oat fiber into playful cut-out shapes kids happily pick up.",
      safety: "Pan-roast in minimal ghee so crust stays tender-crisp rather than sharp or hard.",
      icon: "⭐"
    },
    {
      id: '24_36_months_rec_8',
      name: "Roasted Semi-dry Vermicelli (Seviyan) Upma",
      localName: "सेवई उपमा / சேமியா உப்புமா",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup whole wheat or suji vermicelli (broken into 1.5-inch pieces)",
        "2 tbsp very finely diced carrot & tender green peas",
        "1 tbsp finely chopped onion (optional)",
        "1 tsp pure homemade ghee",
        "1/4 tsp black mustard seeds (rai) & 3 fresh curry leaves",
        "1 tiny pinch turmeric powder (haldi)",
        "1/4 tsp salt",
        "1 cup clean hot drinking water",
        "1 tsp fresh lemon juice & chopped coriander (optional garnish)"
      ],
      instructions: [
        "Firstly, if using unroasted vermicelli, dry-roast gently in a pan on low flame for 3 minutes until light golden, then set aside.",
        "Boil or steam diced carrot and green peas until soft; keep 1 cup water boiling in a kettle.",
        "Heat 1 teaspoon ghee in a heavy pan on low flame; pop mustard seeds and add torn curry leaves.",
        "Add optional chopped onion and sautéed carrots-peas; cook gently 1–2 minutes with turmeric and salt.",
        "Pour in 1 cup hot water and bring to a gentle simmer.",
        "Drop in the roasted vermicelli evenly, stir once cleanly so strands separate without clumping.",
        "Cover with a tight lid and cook on low flame for 4 to 5 minutes until all water absorbs and noodles feel soft.",
        "Turn off the stove, let rest covered for 2 minutes, fluff gently with a fork, add a squeeze of lemon, and serve warm."
      ],
      benefits: "Noodle-like savory texture builds toddler fork-twirling coordination alongside iron and B vitamins.",
      safety: "Let trapped steam vent and cool 2–3 minutes before handing bowl to your toddler.",
      icon: "🍜"
    },
    {
      id: '24_36_months_rec_9',
      name: "Roasted Besan & Jaggery Toddler Bites",
      localName: "बेसन गुड़ लड्डू / கடலை மாவு லட்டு",
      prepTime: "8 mins",
      cookTime: "10 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fine or slightly coarse besan (gram flour)",
        "2 tbsp pure homemade desi ghee",
        "2 tbsp organic jaggery powder (lump-free)",
        "1/4 tsp green cardamom (elaichi) powder",
        "1 tbsp finely powdered roasted almonds or melon seeds (optional)"
      ],
      instructions: [
        "Firstly, sift the besan cleanly into a bowl so zero dry lumps roast unevenly.",
        "Heat 2 tablespoons pure desi ghee in a heavy-bottomed kadhai over the very lowest flame.",
        "Add the sifted besan and stir continuously with a flat spatula, pressing against the pan base.",
        "Roast slowly on low flame for 8 to 10 minutes—never leave unattended—until the flour deepens to golden beige, turns slightly loose, and smells deliciously nutty.",
        "Turn off the stove immediately and transfer the hot roasted besan into a wide mixing plate to stop carryover cooking.",
        "Let cool for 4–5 minutes until warm (never piping hot, or jaggery melts hard).",
        "Sprinkle in jaggery powder, cardamom powder, and optional fine nut powder.",
        "Knead thoroughly with clean hands until completely smooth and evenly sweetened, then roll into small marble-sized bites."
      ],
      benefits: "Rich chickpea protein, natural iron from jaggery, and pure desi ghee supporting healthy weight gain.",
      safety: "Keep bites marble-sized so toddlers take small chewable nibbles cleanly; avoid jagged nut shards.",
      icon: "🧆"
    },
    {
      id: '24_36_months_rec_10',
      name: "Soft Stewed Paneer or Veggie Rice Pot",
      localName: "पनीर खिचड़ी पुलाव / பன்னீர் புலாவ் சாதம்",
      prepTime: "10 mins (+ 20 mins soaking)",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup white basmati or Sona Masoori rice (washed and soaked)",
        "1/3 cup fresh soft paneer cubes (½-inch dice)",
        "2 tbsp sweet boiled green peas & sweet corn",
        "2 tbsp finely grated carrot",
        "1 tsp pure desi ghee",
        "1/2 tsp cumin seeds (jeera) & 1 tiny pinch turmeric powder",
        "1/4 tsp salt",
        "1.25 cups clean drinking water",
        "2 tbsp fresh plain curd or mild raita (for serving)"
      ],
      instructions: [
        "Firstly, rinse rice cleanly 3 times, soak in water for 20 minutes, and drain.",
        "Heat 1 teaspoon ghee in a pressure cooker on low-to-medium flame; crackle cumin seeds.",
        "Add grated carrot, peas, and sweet corn; sauté gently for 2 minutes with turmeric and salt.",
        "Stir in the drained rice and small soft paneer cubes gently.",
        "Pour in 1.25 cups water (slightly more than standard 1:2 ratio so rice finishes ultra-soft for toddlers).",
        "Seal the cooker lid and cook for 2 to 3 whistles on medium heat, then let steam release naturally.",
        "Fluff gently with a fork, verify peas and corn are completely tender, cool slightly, and serve warm with raita."
      ],
      benefits: "Complete one-pot meal delivering dairy protein, phosphorus, B vitamins, and gentle carbs.",
      safety: "Ensure paneer cubes stay soft and sweet corn/peas squish easily between fingers.",
      icon: "🍲"
    },
    ...buildSharedCoreRecipes('24_36_months', 11)
  ]
};
