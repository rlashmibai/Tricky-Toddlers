import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_12_24_months: AgeGroupData = {
  id: '12_24_months',
  ageLimit: '12 - 24 Months',
  title: "Toddler Table Foods",
  guidelines: "Transition to standard family table foods. Cow's whole milk can now be introduced alongside balanced family meals. Continue prioritizing iron-rich legumes, leafy greens, healthy fats, and chewable textures with minimal added salt or sugar.",
  milestones: [
    "Feeds self independently with a spoon, though still messy.",
    "Has many teeth, can chew and tear varying solid food textures.",
    "Enjoys mimicking parents and family members eating table food at dinner."
  ],
  recipes: [
    {
      id: '12_24_months_rec_1',
      name: "Mild Savory Vegetable Upma",
      localName: "सब्जी उपमा / காய்கறி உப்புமா",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3 tbsp fine semolina (Bombay rava / suji)",
        "2 tbsp very finely chopped carrot & soft green peas",
        "1 tbsp finely chopped fresh coriander leaves",
        "1/2 tsp pure homemade desi ghee",
        "1/4 tsp black mustard seeds (rai)",
        "3 fresh curry leaves (finely torn or removed before serving)",
        "1 pinch turmeric powder (optional)",
        "1/4 tsp salt (or a light toddler pinch)",
        "1 cup clean hot drinking water"
      ],
      instructions: [
        "Firstly, dry-roast the semolina (rava) in a heavy pan on low flame for 3 minutes until warm and fragrant without browning, then transfer to a dry plate.",
        "Steam or boil the finely chopped carrots and green peas for 5 minutes until fork-tender; squish peas gently flat for toddlers.",
        "Bring 1 cup of water to a rolling boil in a separate kettle or small vessel and keep ready.",
        "Heat ½ teaspoon ghee in the pan on low flame, add mustard seeds, and let them pop cleanly before adding torn curry leaves.",
        "Toss in the soft-boiled carrots and peas and sauté gently for 1 minute with a light pinch of turmeric and salt.",
        "Carefully pour in the 1 cup hot water and bring it to a brisk simmer.",
        "Reduce flame to minimum and drizzle in the roasted rava in a steady thin stream while stirring continuously to prevent lumps.",
        "Cover with a tight lid and cook on lowest flame for 3 minutes until the rava swells soft, moist, and fluffy.",
        "Turn off the stove, fluff lightly with a fork, garnish with chopped coriander, cool to lukewarm, and serve fresh."
      ],
      benefits: "Iron-friendly savory semolina cereal combined with vitamin-rich soft veggies and butterfat energy.",
      safety: "Remove whole curry leaves before serving and squish peas lightly so toddlers under 2 chew safely.",
      icon: "🌾"
    },
    {
      id: '12_24_months_rec_2',
      name: "Soft Ghee-brushed Aloo Paratha",
      localName: "नरम आलू पराठा / மென்மையான உருளைக்கிழங்கு பரோட்டா",
      prepTime: "15 mins (+ 10 mins resting)",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup whole wheat flour (atta)",
        "3 tbsp warm water or milk (to knead extra-soft dough)",
        "1/4 cup boiled and smoothly mashed potato (no lumps)",
        "1 tbsp finely chopped fresh coriander leaves",
        "1/4 tsp roasted cumin (jeera) powder",
        "1/4 tsp coriander (dhania) powder",
        "1/4 tsp mild salt (or light pinch)",
        "1 tsp pure homemade desi ghee (for dough and roasting)",
        "1 tbsp dry whole wheat flour (for dusting)"
      ],
      instructions: [
        "Firstly, mix whole wheat flour and ¼ teaspoon ghee in a bowl; add warm water gradually and knead for 4 minutes into a very soft, pliable dough.",
        "Cover the dough with a damp cloth and rest it for 10 minutes so the paratha rolls easily without turning tough.",
        "Meanwhile, mash the boiled potato completely smooth with cumin powder, coriander powder, chopped coriander, and mild salt.",
        "Divide dough into two equal balls and mash filling into two small lemon-sized portions.",
        "Flatten one dough ball with dusted flour, press a shallow well in the center, and place the spiced mashed potato inside.",
        "Gather the dough edges cleanly to seal, pinch off any excess, flatten gently with your palm, and dust lightly with dry atta.",
        "Roll evenly with gentle strokes into a 5-inch disc without letting stuffing tear out.",
        "Place onto a heated tawa on medium flame; flip after 25 seconds when light bubbles appear.",
        "Brush ½ teaspoon ghee on both sides and press lightly with a spatula until soft golden-brown spots form.",
        "Cool slightly, slice into soft toddler-sized strips or triangles, and serve warm with fresh curd."
      ],
      benefits: "Clean complex carbs, potassium, and healthy ghee fats supporting active toddler mobility and weight gain.",
      safety: "Brush lightly with ghee and stack covered briefly so the paratha stays pillowy soft rather than crisp-dry.",
      icon: "🫓"
    },
    {
      id: '12_24_months_rec_3',
      name: "Creamy Oats & Berry Porridge",
      localName: "ओट्स और बेरी दलिया / ஓட்ஸ் பெர்ரி கஞ்சி",
      prepTime: "5 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3 tbsp rolled oats (pulsed lightly if finer texture preferred)",
        "1/2 cup whole cow's milk (or fortified plant milk)",
        "1/4 cup clean drinking water",
        "2 tbsp finely chopped ripe strawberries or halved blueberries",
        "1/2 tsp raw honey or organic jaggery powder (safe for 12m+)",
        "1 tiny pinch Ceylon cinnamon powder",
        "1/4 tsp pure butter or almond butter (optional)"
      ],
      instructions: [
        "Firstly, wash fresh strawberries or blueberries thoroughly and chop them into tiny, quartered toddler-safe pieces.",
        "Heat a small heavy-bottomed saucepan on low flame and dry-toast the rolled oats for 90 seconds until lightly aromatic.",
        "Pour in ¼ cup water and ½ cup whole milk while stirring steadily.",
        "Bring to a gentle simmer on low-to-medium heat, then reduce flame to minimum.",
        "Cook for 5 to 6 minutes, stirring continuously from the bottom until the oats thicken into a velvety porridge.",
        "Fold in the chopped berries and Ceylon cinnamon powder; simmer for 1 more minute so berries soften and turn juicy.",
        "Turn off the stove and let the porridge cool for 2 minutes before stirring in ½ teaspoon honey or jaggery.",
        "Test warmth on your inner wrist, verify all berries are soft-squished, and feed warm by spoon."
      ],
      benefits: "Anthocyanin antioxidants from berries, calcium from milk, and soluble beta-glucan fiber for steady toddler energy.",
      safety: "Quarter whole blueberries cleanly so no round berry can slip whole down the windpipe; honey is safe from 12 months onward.",
      icon: "🥣"
    },
    {
      id: '12_24_months_rec_4',
      name: "Mini Steamed Veggie Uttapams",
      localName: "मिनी उत्तपम / மினி ஊத்தப்பம்",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fresh fermented dosa/idli batter (thick consistency)",
        "2 tbsp very finely grated fresh carrot",
        "2 tbsp very finely grated beetroot",
        "1 tbsp finely chopped fresh coriander leaves",
        "1 tiny pinch roasted cumin powder (optional)",
        "1/2 tsp pure homemade ghee (for griddling)"
      ],
      instructions: [
        "Firstly, wash, peel, and finely grate the carrot and beetroot onto a clean plate; mix gently with chopped coriander.",
        "Stir the fermented batter until smooth and thick enough to hold shapes (not runny).",
        "Heat a flat skillet or tawa on low-to-medium flame and brush lightly with ¼ teaspoon ghee.",
        "Pour small silver-dollar ladles (2 tbsp each) of batter onto the griddle to form 3-inch mini uttapams.",
        "Immediately scatter 1 tablespoon of the colorful grated carrot-beetroot mix on top of each pancake.",
        "Press the veggies gently into the wet batter with the back of a spoon so they adhere cleanly.",
        "Drizzle a drop of ghee around the edges, cover tightly with a lid, and steam-cook on low flame for 2–3 minutes.",
        "Flip gently once set and cook the veggie side down for 90 seconds until veggies turn tender and sweet.",
        "Cool slightly on a plate, cut into soft quarters, and serve warm with mild curd or coconut chutney."
      ],
      benefits: "Gut-friendly fermented rice-lentil batter enriched with colorful iron, folate, and beta-carotene.",
      safety: "Cover with a lid while cooking so grated vegetables steam soft inside without drying out.",
      icon: "🥞"
    },
    {
      id: '12_24_months_rec_5',
      name: "Mild Palak Paneer with Soft Steamed Rice",
      localName: "पालक पनीर चावल / பாலக் பன்னீர் சாதம்",
      prepTime: "10 mins",
      cookTime: "12 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup cooked soft steamed white rice",
        "1 cup fresh tender baby spinach (palak) leaves, washed",
        "1/3 cup soft homemade paneer, diced into small ½-inch cubes",
        "1/2 small ripe tomato (finely chopped)",
        "1/2 tsp pure desi ghee",
        "1/4 tsp cumin seeds (jeera) & 1 tiny clove garlic (minced)",
        "1 tiny pinch turmeric powder",
        "1/4 tsp mild salt (or light pinch)",
        "2 tbsp fresh plain curd (for serving)"
      ],
      instructions: [
        "Firstly, wash fresh spinach leaves 3 times cleanly, blanch in boiling water for 90 seconds, then cool in cold water and blend into a smooth green puree.",
        "Heat ½ teaspoon desi ghee in a small pan over low flame; add cumin seeds and minced garlic for 15 seconds until fragrant.",
        "Add finely chopped tomato and sauté gently for 3 minutes until completely soft and mushy.",
        "Stir in the bright green spinach puree, turmeric powder, and light salt; simmer gently on low flame for 3 minutes.",
        "Gently fold in the small soft paneer cubes and splash in 1–2 tablespoons warm water if overly thick.",
        "Simmer 2 minutes only so paneer stays pillowy soft without turning chewy.",
        "Serve warm spooned alongside or gently mixed into soft steamed rice with a spoonful of fresh curd."
      ],
      benefits: "Bone-strengthening calcium and protein paired with vitamin K, folate, and vibrant green iron.",
      safety: "Keep paneer cubes small and tender; avoid excess chili or garam masala for toddlers.",
      icon: "🍛"
    },
    {
      id: '12_24_months_rec_6',
      name: "Crispy Sprouted Ragi & Ghee Dosa",
      localName: "रागी डोसा / ராகி தோசை",
      prepTime: "8 mins (+ 10 mins resting)",
      cookTime: "6 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup pure sprouted ragi (finger millet) flour",
        "1/4 cup fermented idli/dosa batter (or rice flour + 2 tbsp curd)",
        "1/3 cup clean drinking water (as needed for thin batter)",
        "1/4 tsp cumin powder",
        "1/4 tsp salt (light toddler pinch)",
        "1/2 tsp pure homemade ghee (for roasting)",
        "2 tbsp mild fresh coconut chutney (for dipping)"
      ],
      instructions: [
        "Firstly, whisk sprouted ragi flour and fermented batter together in a bowl, adding water gradually until smooth and pourable.",
        "Stir in cumin powder and mild salt; let the batter rest for 10 minutes to hydrate evenly.",
        "Heat a flat skillet or cast-iron tawa on medium flame until moderately hot, then reduce to low-medium.",
        "Brush lightly with a drop of ghee and pour one ladle of batter onto the center.",
        "Spread quickly in gentle circular motion into a thin 6-inch crepe (leave slightly thicker for softer chewing if preferred).",
        "Drizzle ½ teaspoon ghee along the edges and top center.",
        "Cook for 2 minutes until edges lift and base turns crisp-golden, then flip briefly for 30 seconds to ensure full cooking.",
        "Transfer onto a plate, roll warmly or slice into soft bite-sized strips, and serve with mild coconut chutney."
      ],
      benefits: "High natural calcium and sprouted iron supporting growing toddler bones and healthy hemoglobin.",
      safety: "Slice crisp edges away if too brittle, or serve warm while still supple for 12–18 month toddlers.",
      icon: "🌯"
    },
    {
      id: '12_24_months_rec_7',
      name: "Soft Gujarati Methi Thepla Strips",
      localName: "मेथी थेपला / வெந்தயக்கீரை சப்பாத்தி",
      prepTime: "12 mins (+ 15 mins resting)",
      cookTime: "8 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup whole wheat flour (atta)",
        "2 tbsp finely chopped fresh tender methi (fenugreek) leaves",
        "1 tbsp fresh plain curd (for tenderness)",
        "1/4 tsp pure turmeric powder (haldi)",
        "1/4 tsp roasted cumin (jeera) powder",
        "1 tiny pinch ajwain (carom seeds)",
        "1/4 tsp salt (light pinch)",
        "1/2 tsp pure desi ghee (for kneading and brushing)",
        "2 to 3 tbsp warm water (as needed to knead)"
      ],
      instructions: [
        "Firstly, wash fresh tender methi leaves thoroughly, discard stems, and chop the leaves very finely.",
        "In a bowl, combine whole wheat flour, chopped methi leaves, curd, turmeric, cumin powder, ajwain, salt, and ¼ tsp ghee.",
        "Rub the ingredients together evenly so leaves coat uniformly in flour.",
        "Add warm water 1 teaspoon at a time and knead for 4 minutes into a smooth, soft, non-sticky dough; rest covered for 15 minutes.",
        "Divide into 3 small balls, dust lightly with wheat flour, and roll each into a thin, even 5-inch round.",
        "Heat a tawa on medium-high flame; lay the rolled thepla flat and cook 20 seconds until tiny surface bubbles appear.",
        "Flip, brush lightly with ¼ teaspoon ghee, flip again, and press gently for 15–20 seconds until golden spots form.",
        "Remove quickly so it never dries crisp; wrap in a soft cloth for 1 minute, slice into finger strips, and serve warm with curd."
      ],
      benefits: "Iron-rich fenugreek greens with digestive carom seeds (ajwain) in a soft handheld flatbread.",
      safety: "Roast quickly over medium-high heat so the flatbread stays ultra-soft and moist rather than leathery.",
      icon: "🫓"
    },
    {
      id: '12_24_months_rec_8',
      name: "Soft Stewed Rajma & Rice Bowl",
      localName: "राजमा चावल / ராஜ்மா சாதம்",
      prepTime: "12 mins (+ overnight soaking)",
      cookTime: "22 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup dried red kidney beans (rajma), soaked overnight",
        "1/2 cup soft-cooked steamed rice",
        "1 small ripe red tomato (finely pureed or grated)",
        "1/2 tsp pure desi ghee",
        "1/4 tsp cumin seeds (jeera) & 1 pinch hing",
        "1/4 tsp mild turmeric & coriander powder",
        "1/4 tsp salt (light toddler pinch)",
        "1.5 cups clean water (for pressure cooking)"
      ],
      instructions: [
        "Firstly, drain overnight-soaked rajma, rinse freshly, and place into a pressure cooker with 1.5 cups water and a pinch of salt.",
        "Cook for 6 to 7 whistles on medium flame until every kidney bean crushes completely smoothly between fingers.",
        "Meanwhile, heat ½ teaspoon ghee in a small pan on low flame; add cumin seeds and asafoetida until fragrant.",
        "Add grated tomato, turmeric, and coriander powder; simmer 4 minutes until tomatoes turn rich and jammy.",
        "Pour the boiled rajma along with ¼ cup of its cooking broth into the tomato pan.",
        "Using a potato masher or back of a ladle, gently mash half to three-quarters of the kidney beans to create a thick, smooth gravy.",
        "Simmer gently on low flame for 5 minutes until creamy and well blended.",
        "Cool slightly to lukewarm and fold generously into soft steamed rice so every mouthful is moist and easy to swallow."
      ],
      benefits: "Rich plant protein, zinc, folate, and slow-burning carbohydrates supporting toddler growth and fullness.",
      safety: "Mash rajma thoroughly with its creamy gravy—whole firm kidney bean skins can be difficult for 12–18m toddlers.",
      icon: "🥣"
    },
    {
      id: '12_24_months_rec_9',
      name: "Wholesome Cracked Wheat Veggie Khichdi",
      localName: "दलिया वेज खिचड़ी / கோதுமை ரவை கிச்சடி",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup dry-roasted broken wheat (dalia)",
        "2 tbsp split yellow moong dal (washed)",
        "2 tbsp finely chopped tender carrots & French beans",
        "1/2 tsp pure homemade desi ghee",
        "1/4 tsp cumin seeds (jeera)",
        "1 tiny pinch turmeric powder (haldi)",
        "1/4 tsp salt (light toddler pinch)",
        "1.5 cups clean drinking water",
        "2 tbsp fresh homemade curd (for serving)"
      ],
      instructions: [
        "Firstly, dry-roast the broken wheat (dalia) in a dry pan on low flame for 2 minutes until aromatic, then transfer out.",
        "Wash the yellow moong dal cleanly 3 times and soak 10 minutes; finely dice peeled carrots and French beans.",
        "Heat ½ teaspoon pure desi ghee in a pressure cooker on low flame; crackle cumin seeds gently.",
        "Add diced carrots and beans and sauté 2 minutes before adding roasted dalia and drained moong dal.",
        "Sprinkle in turmeric and light salt, pour in 1.5 cups clean water, and stir thoroughly.",
        "Seal the cooker lid and cook for 4 whistles on medium heat, then let steam release naturally.",
        "Open the lid, stir vigorously with a spoon (or mash lightly) until soft, creamy, and porridge-like.",
        "Cool down to lukewarm and serve topped with a drop of fresh ghee alongside plain curd."
      ],
      benefits: "Sustained complex energy and insoluble dietary fiber preventing toddler constipation without sugar spikes.",
      safety: "Ensure dalia grains are fully swollen, soft, and moist rather than sticky or firm.",
      icon: "🍲"
    },
    {
      id: '12_24_months_rec_10',
      name: "Jaggery Sweetened Whole Wheat Banana Muffin",
      localName: "केला मफिन / வாழைப்பழம் மஃபின்",
      prepTime: "10 mins",
      cookTime: "18 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup whole wheat flour (atta)",
        "1 large ripe sweet banana (peeled and mashed smooth)",
        "1 tbsp organic jaggery powder",
        "1 tbsp melted unsalted butter or pure desi ghee",
        "1/4 cup warm whole milk (plus 1 tbsp if needed)",
        "1/4 tsp baking powder & 1 pinch baking soda",
        "1/4 tsp green cardamom or Ceylon cinnamon powder",
        "1/4 tsp butter or oil (for greasing mini muffin moulds)"
      ],
      instructions: [
        "Firstly, preheat an oven to 180°C (or prepare a steamer pot with water) and lightly grease 4–5 mini muffin cups.",
        "In a clean mixing bowl, mash the ripe banana completely smooth using a fork.",
        "Add jaggery powder, melted butter or ghee, and warm milk; whisk smoothly until jaggery dissolves cleanly.",
        "Place a small sieve over the bowl and sift in whole wheat flour, baking powder, baking soda, and cardamom/cinnamon.",
        "Fold dry and wet ingredients gently with a spatula just until combined (do not over-mix or muffins turn dense).",
        "Spoon the thick batter evenly into the greased mini muffin moulds, filling two-thirds full.",
        "Bake at 180°C for 16–18 minutes (or steam covered for 15 minutes) until risen and golden.",
        "Insert a clean toothpick into the center—if it comes out dry, remove from heat and cool completely on a rack.",
        "Break into soft, fluffy bite-sized toddler chunks and serve fresh or store airtight for up to 2 days."
      ],
      benefits: "Refined-sugar-free wholesome baked snack packed with potassium, iron-rich jaggery, and whole grain fiber.",
      safety: "Always cool muffins down completely so steam trapped inside does not burn toddler fingers or mouth.",
      icon: "🧁"
    },
    ...buildSharedCoreRecipes('12_24_months', 11)
  ]
};
