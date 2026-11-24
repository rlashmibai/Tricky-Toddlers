import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_5_10_years: AgeGroupData = {
  id: '5_10_years',
  ageLimit: '5 - 10 Years',
  title: "School Age & Growth Spurt",
  guidelines: "School-age kids need sustained energy for classroom focus, active playground sports, and developing skeletal strength. Focus on whole grains, lentils, fresh seasonal greens, and high-calcium dairy.",
  milestones: [
    "Has full adult-style eating capabilities with primary & permanent teeth emerging.",
    "Participates in packing school lunchboxes and has strong taste preferences.",
    "Needs steady hydration (1.2 - 1.5 liters) and balanced snack breaks after school."
  ],
  recipes: [
    {
      id: '5_10_years_rec_1',
      name: "Iron-Rich Fresh Methi Paratha with Dahi",
      localName: "मेथी पराठा दही / வெந்தயக்கீரை பரோட்டா",
      prepTime: "12 mins (+ 15 mins resting)",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup whole wheat flour (atta)",
        "1/2 cup fresh fenugreek (methi) leaves, stems discarded & finely chopped",
        "2 tbsp fresh plain curd (for softness)",
        "1/4 tsp ajwain (carom seeds), crushed",
        "1/4 tsp pure turmeric powder & 1/2 tsp coriander-cumin powder",
        "1/4 tsp salt (or to taste)",
        "1.5 tsp pure desi ghee (for dough and roasting)",
        "3 to 4 tbsp warm water (to knead)",
        "1/2 cup fresh creamy curd (for serving)"
      ],
      instructions: [
        "Firstly, wash fresh methi leaves cleanly 3 times to remove all soil grit, strip away thick stems, pat dry, and chop finely.",
        "In a large mixing bowl, combine whole wheat flour, chopped methi, crushed ajwain, turmeric, coriander-cumin powder, and salt.",
        "Add ½ teaspoon ghee and 2 tablespoons curd, rubbing thoroughly into the flour.",
        "Gradually add warm water a little at a time and knead for 4–5 minutes into a smooth, pliable dough; cover and rest 15 minutes.",
        "Divide into 4 smooth dough balls, dust lightly with dry whole wheat flour, and roll into even 6-inch rounds.",
        "Heat a tawa on medium-high flame; lay one paratha flat and cook 25 seconds until small surface bubbles appear.",
        "Flip, brush with ¼ teaspoon ghee, flip again, and press gently with a spatula until golden speckled on both sides.",
        "Stack cleanly in a casserole or wrap in parchment, and serve hot alongside cooling fresh curd."
      ],
      benefits: "Rich natural iron and dietary fiber from fresh methi paired with digestive ajwain and probiotic curd.",
      safety: "Rinse methi leaves thoroughly in a colander to remove every trace of field soil.",
      icon: "🫓"
    },
    {
      id: '5_10_years_rec_2',
      name: "Crispy Multigrain Dosa with Coconut Dip",
      localName: "मल्टीग्रेन डोसा / தானிய தோசை",
      prepTime: "6 mins (+ 10 mins resting)",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup multigrain dosa batter (ragi, jowar, rice & urad dal blend)",
        "1/4 tsp cumin seeds or mild salt (as needed)",
        "2 to 3 tbsp clean water (to adjust batter consistency)",
        "1 tsp pure desi ghee or cold-pressed sesame oil",
        "3 tbsp fresh coconut & roasted chana dal chutney (for dipping)"
      ],
      instructions: [
        "Firstly, check batter consistency and stir in 2–3 tablespoons water so it pours smoothly from a ladle.",
        "Heat a seasoned cast-iron or non-stick tawa on medium flame until evenly hot (sprinkle a drop of water—it should sizzle briskly).",
        "Wipe the tawa clean with a damp cloth and lower flame slightly before pouring.",
        "Pour a full ladle of multigrain batter onto the center and spread swiftly in outward spiral circles into a thin 8-inch crepe.",
        "Drizzle 1 teaspoon ghee or sesame oil around the edges and lightly over the center.",
        "Cook on medium flame for 2 minutes until edges turn crisp and lift away from the pan naturally.",
        "Fold cleanly into a crisp cone or triangle (flip briefly for 20 seconds if a softer texture is preferred).",
        "Serve immediately alongside mild, nutty fresh coconut & roasted chana dal chutney."
      ],
      benefits: "Low-glycemic complex ancient grains (ragi + jowar) keep school-age kids alert without mid-morning crashes.",
      safety: "Blend coconut chutney mildly without sharp green chilies for comfortable eating.",
      icon: "🥞"
    },
    {
      id: '5_10_years_rec_3',
      name: "Savory Besan & Bell Pepper Chilla",
      localName: "बेसन वेज चीला / கடலை மாவு அடை",
      prepTime: "10 mins (+ 5 mins resting)",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3/4 cup fine besan (chickpea / gram flour)",
        "2 tbsp fine rice flour or oats (optional, for light crispness)",
        "1/4 cup very finely diced red/green bell peppers, onion & ripe tomato",
        "1 tbsp finely chopped fresh coriander leaves",
        "1/4 tsp ajwain (carom seeds) & 1/4 tsp turmeric powder",
        "1/4 tsp roasted cumin powder & 1/4 tsp salt",
        "1/2 cup clean water (as needed for batter)",
        "1 tsp cold-pressed oil or pure ghee (for pan cooking)"
      ],
      instructions: [
        "Firstly, sift besan into a mixing bowl and stir in optional rice flour, turmeric, cumin, ajwain, and salt.",
        "Gradually pour in ½ cup water while whisking vigorously until a smooth, lump-free, pourable batter forms; rest 5 minutes.",
        "Finely dice bell peppers, onion, tomato, and coriander, then fold evenly into the batter.",
        "Heat a flat skillet or tawa on medium-low flame and brush lightly with oil or ghee.",
        "Pour a ladle of batter onto the hot surface and spread gently into a 6-inch round savory pancake.",
        "Drizzle a few drops of oil around edges and cook covered briefly for 2 minutes until golden brown underneath.",
        "Flip carefully, press lightly with a spatula, and cook 2 more minutes until fragrant and cooked completely inside.",
        "Cut into neat triangles and serve warm with mint chutney or fresh curd."
      ],
      benefits: "High chickpea protein and vitamin C from bell peppers fuel concentration through school classes.",
      safety: "Dice vegetables evenly small and cook thoroughly on medium-low flame so raw besan taste disappears.",
      icon: "🫓"
    },
    {
      id: '5_10_years_rec_4',
      name: "Semolina & Roasted Peanut Veggie Upma",
      localName: "वेजिटेबल उपमा / காய்கறி உப்புமா",
      prepTime: "8 mins",
      cookTime: "12 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Bombay rava / fine suji (semolina)",
        "1/4 cup finely diced carrots, sweet green peas & French beans",
        "1 tbsp unsalted roasted peanuts (whole or halved)",
        "1 tsp pure desi ghee",
        "1/4 tsp mustard seeds, 1/4 tsp chana dal & 5 fresh curry leaves",
        "1/4 tsp salt (or to taste)",
        "1.25 cups boiling hot drinking water",
        "1 tsp fresh lemon juice & 1 tbsp chopped coriander"
      ],
      instructions: [
        "Firstly, dry-roast semolina in a thick pan on low flame for 3–4 minutes until fragrant and dry without browning; transfer out.",
        "Boil 1.25 cups drinking water in a separate vessel and keep hot.",
        "Heat 1 teaspoon ghee in the pan on low flame; pop mustard seeds, add chana dal until golden, then add curry leaves and roasted peanuts.",
        "Toss in the diced carrots, beans, and peas; sauté gently for 3 minutes until bright and half-tender.",
        "Pour the 1.25 cups hot water and salt into the sautéed veggies and bring to a rolling boil.",
        "Reduce flame to minimum and slowly pour in roasted rava in a steady stream while stirring continuously.",
        "Cover tightly and simmer on low flame for 3 minutes until water absorbs cleanly and grains turn fluffy.",
        "Turn off stove, fluff gently with a fork, squeeze lemon juice and coriander over top, and serve warm."
      ],
      benefits: "Combines crunchy peanut healthy fats and vitamin-packed veggies with quick-absorbing semolina carbs.",
      safety: "Confirm zero peanut allergy before adding roasted peanuts; halve nuts for younger 5-year-olds.",
      icon: "🥣"
    },
    {
      id: '5_10_years_rec_5',
      name: "Home-Style Rajma Masala with Steamed Rice",
      localName: "राजमा चावल / ராஜ்மா சாதம்",
      prepTime: "15 mins (+ overnight soaking)",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup dried red kidney beans (rajma), soaked overnight",
        "1 cup cooked fluffy basmati rice",
        "1 medium onion (finely chopped) & 2 ripe tomatoes (pureed)",
        "1 tsp ginger-garlic paste",
        "1 tsp pure desi ghee or oil",
        "1/2 tsp cumin seeds, 1/4 tsp turmeric, 1 tsp coriander powder & 1/4 tsp mild garam masala",
        "1/2 tsp salt (or to taste)",
        "1/2 cup crisp diced cucumber-tomato kachumber & lemon wedges (for serving)"
      ],
      instructions: [
        "Firstly, drain overnight-soaked rajma, rinse freshly, and pressure cook with 2 cups fresh water and ¼ tsp salt for 5–6 whistles until completely tender.",
        "Heat 1 teaspoon ghee or oil in a kadhai on medium-low flame; splutter cumin seeds.",
        "Add finely chopped onions and sauté for 4–5 minutes until soft and light golden.",
        "Stir in ginger-garlic paste and sauté 1 minute until raw smell vanishes, then add fresh tomato puree.",
        "Add turmeric, coriander powder, and remaining salt; cook covered 5–6 minutes until rich masala thickens cleanly.",
        "Pour in the boiled rajma along with its flavorful dark cooking broth and mash a spoonful gently to thicken gravy.",
        "Simmer gently uncovered on low flame for 10 minutes, finishing with mild garam masala and chopped fresh coriander.",
        "Ladle hot rajma generously over steaming basmati rice and serve alongside crisp kachumber salad and lemon wedges."
      ],
      benefits: "Powerhouse plant protein, iron, and soluble fiber supporting rapid school-age growth spurts.",
      safety: "Soak kidney beans at least 8 hours and cook until melt-in-mouth soft for easy digestion.",
      icon: "🍛"
    },
    {
      id: '5_10_years_rec_6',
      name: "Paneer Bhurji with Warm Multigrain Rotis",
      localName: "पनीर भुर्जी रोटी / பன்னீர் புர்ஜி சப்பாத்தி",
      prepTime: "10 mins",
      cookTime: "12 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup freshly crumbled soft paneer",
        "1 small onion (finely chopped) & 1 medium tomato (finely chopped)",
        "2 tbsp finely diced green capsicum",
        "1 tsp pure desi ghee",
        "1/2 tsp cumin seeds (jeera) & 1/4 tsp turmeric powder",
        "1/2 tsp mild pav bhaji or kitchen king masala",
        "1/4 tsp salt & 1 tbsp chopped fresh coriander",
        "2 warm soft multigrain rotis (wheat, ragi & barley) + lemon wedges"
      ],
      instructions: [
        "Firstly, crumble fresh paneer evenly with clean fingers (or grate coarsely) and keep ready.",
        "Heat 1 teaspoon desi ghee in a wide pan on medium-low flame; crackle cumin seeds cleanly.",
        "Add finely chopped onions and sauté for 3 minutes until soft and translucent.",
        "Add diced capsicum and chopped tomatoes; cook 3 minutes until tomatoes soften into a moist base.",
        "Sprinkle in turmeric, mild spice blend, and salt; stir well for 30 seconds.",
        "Fold in the crumbled paneer gently and toss on low flame for 2 to 3 minutes just until heated through cleanly.",
        "Do NOT overcook on high heat or paneer loses moisture and turns dry; garnish with fresh coriander.",
        "Serve piping hot alongside two warm ghee-brushed multigrain rotis and fresh lemon wedges."
      ],
      benefits: "High biological-value casein protein and bone-building calcium paired with complex multigrain fiber.",
      safety: "Cook paneer gently on low flame so curds remain moist, fluffy, and easy to chew.",
      icon: "🍲"
    },
    {
      id: '5_10_years_rec_7',
      name: "Wholesome Vegetable Sambar Rice with Ghee",
      localName: "सांभर चावल / சாம்பார் சாதம்",
      prepTime: "12 mins (+ 20 mins soaking)",
      cookTime: "20 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/3 cup raw rice & 1/4 cup toor dal (washed & soaked 20 mins)",
        "1/2 cup diced pumpkin, carrot, and deseeded soft drumstick pulp",
        "1 tbsp mild tamarind extract (soaked & strained)",
        "1 tbsp mild homemade sambar powder & 1/4 tsp turmeric",
        "1/2 tsp salt (or to taste) & 2.5 cups water",
        "1 tsp pure desi ghee + 1/4 tsp mustard seeds, 1 pinch hing & 5 curry leaves"
      ],
      instructions: [
        "Firstly, pressure cook soaked toor dal and rice together with 2 cups water and turmeric for 4 whistles until very soft.",
        "In a wide saucepan, boil diced carrots and pumpkin in ½ cup water + tamarind extract, sambar powder, and salt for 7–8 minutes until tender.",
        "Lightly mash the cooked dal-rice mixture and fold it smoothly into the simmering vegetable sambar pot.",
        "Adjust consistency with a splash of hot water and simmer together gently for 4–5 minutes so flavors meld.",
        "Heat 1 teaspoon desi ghee in a small tadka pan; pop mustard seeds, asafoetida, and crisp curry leaves.",
        "Pour the fragrant tempering over the hot sambar rice, stir in chopped fresh coriander, and serve warm."
      ],
      benefits: "Lentils, diverse South Indian vegetables, and antioxidant turmeric unite in a deeply nourishing lunch.",
      safety: "Scoop out soft drumstick pulp rather than leaving woody outer pods for kids under 7.",
      icon: "🍛"
    },
    {
      id: '5_10_years_rec_8',
      name: "Mild Kabuli Chana Masala with Jeera Rice",
      localName: "चना मसाला जीरा राइस / கொண்டகடலை சாதம்",
      prepTime: "12 mins (+ overnight soaking)",
      cookTime: "22 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup dried white chickpeas (kabuli chana), soaked overnight",
        "1 cup cooked fluffy jeera rice",
        "1 medium onion & 2 ripe tomatoes (blended into smooth puree)",
        "1 tsp ginger-garlic paste",
        "1/2 tsp roasted cumin powder, 1 tsp coriander powder & 1/4 tsp mild amchur (dry mango)",
        "1/4 tsp turmeric & 1/2 tsp salt",
        "1 tsp pure ghee or oil & 1 tbsp chopped coriander"
      ],
      instructions: [
        "Firstly, drain overnight-soaked chickpeas and pressure cook with 2 cups fresh water and ¼ tsp salt for 5–6 whistles until completely tender.",
        "Heat 1 teaspoon ghee or oil in a heavy pan on medium-low flame; sauté finely blended onion-tomato puree with ginger-garlic paste.",
        "Stir in turmeric, coriander powder, cumin powder, and remaining salt; cook covered 6–7 minutes until raw tomato taste disappears.",
        "Tip in the tender boiled chickpeas along with ¾ cup of their cooking liquid.",
        "Mash a few chickpeas gently against the side of the pot to naturally thicken the gravy.",
        "Sprinkle mild amchur powder and simmer gently covered on low flame for 8–10 minutes.",
        "Garnish with fresh coriander and ladle hot over fragrant jeera rice."
      ],
      benefits: "Rich in folate, dietary iron, and sustained protein energy ideal for playground sports days.",
      safety: "Cook chickpeas completely soft until they squish easily between two fingers.",
      icon: "🍲"
    },
    {
      id: '5_10_years_rec_9',
      name: "Green Spinach & Yellow Moong Khichdi",
      localName: "पालक मूंग खिचड़ी / கீரை கிச்சடி",
      prepTime: "10 mins (+ 15 mins soaking)",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup raw rice & 1/4 cup yellow moong dal (washed & soaked 15 mins)",
        "1 cup fresh baby spinach (palak) leaves, blanched & pureed",
        "1 tsp pure desi ghee",
        "1/2 tsp cumin seeds (jeera) & 1 clove garlic (minced)",
        "1/4 tsp turmeric & 1/4 tsp salt",
        "2.25 cups clean drinking water",
        "1/3 cup fresh cooling curd & 1 dry-roasted papad (for serving)"
      ],
      instructions: [
        "Firstly, blanch washed spinach in boiling water for 90 seconds, chill in cold water, and blend into a bright green puree.",
        "Pressure cook drained rice and moong dal with turmeric, salt, and 2.25 cups water for 3 whistles until soft.",
        "Heat 1 teaspoon desi ghee in a wide pan on low flame; sauté cumin seeds and minced garlic for 20 seconds.",
        "Pour in the emerald spinach puree and cook gently for 2 minutes until raw leafiness disappears.",
        "Fold the warm cooked khichdi smoothly into the spinach base, adding a splash of hot water if needed for creamy consistency.",
        "Simmer 2 minutes gently on lowest flame, transfer to dinner bowls, and serve lukewarm with fresh curd and dry-roasted papad."
      ],
      benefits: "Gentle pre-bed dinner combining plant iron, vitamin K, folate, and easy-to-digest protein.",
      safety: "Prepare fresh daily and dry-roast papad over flame/microwave rather than deep-frying.",
      icon: "🥣"
    },
    {
      id: '5_10_years_rec_10',
      name: "Golden Paneer & Green Pea Tawa Pulao",
      localName: "पनीर तवा पुलाव / பன்னீர் புலாவ்",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup cooked cooled basmati rice (fluffy separate grains)",
        "1/2 cup fresh paneer cubes (½-inch dice)",
        "1/4 cup steamed sweet peas & finely diced mixed bell peppers",
        "1 small tomato (finely chopped)",
        "1 tsp pure desi ghee or butter",
        "1/2 tsp cumin seeds & 1/2 tsp mild pav bhaji masala",
        "1/4 tsp turmeric & 1/4 tsp salt",
        "1/2 cup cool cucumber-boondi raita (for serving)"
      ],
      instructions: [
        "Firstly, heat ½ teaspoon ghee in a wide flat tawa or skillet on medium-low flame and pan-sear paneer cubes for 2 minutes until lightly golden; remove aside.",
        "Add remaining ½ teaspoon ghee to the tawa and crackle cumin seeds cleanly.",
        "Toss in chopped tomatoes, diced bell peppers, and steamed green peas; sauté 3 minutes until soft.",
        "Sprinkle in turmeric, mild pav bhaji masala, and salt, tossing evenly for 30 seconds.",
        "Add the cooked cooled basmati rice and fold gently from the sides with a flat spatula so rice grains stay unbroken.",
        "Return the golden seared paneer cubes to the tawa and toss gently for 1–2 minutes until piping hot.",
        "Garnish with fresh coriander and serve warm paired with cool boondi raita."
      ],
      benefits: "Balanced amino acids and calcium from golden paneer fueling overnight cellular growth and bone strength.",
      safety: "Keep spice blend mild and dice bell peppers small for comfortable eating.",
      icon: "🍛"
    },
    {
      id: '5_10_years_rec_11',
      name: "Sweet Bottle Gourd (Lauki) & Chana Dal with Roti",
      localName: "लौकी चना दाल / சுரைக்காய் தால்",
      prepTime: "12 mins (+ 30 mins soaking)",
      cookTime: "18 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup split Bengal gram (chana dal), soaked 30 mins",
        "1 cup peeled, deseeded sweet bottle gourd (lauki), diced ½-inch",
        "1 ripe tomato (finely chopped)",
        "1/4 tsp turmeric & 1/4 tsp salt",
        "1.5 cups clean drinking water",
        "1 tsp pure desi ghee + 1/2 tsp cumin seeds & 1 pinch hing",
        "2 warm soft whole wheat rotis"
      ],
      instructions: [
        "Firstly, taste a tiny sliver of raw peeled lauki to verify it is sweet and discard immediately if bitter.",
        "Drain soaked chana dal and place into a pressure cooker with diced lauki, chopped tomato, turmeric, salt, and 1.5 cups water.",
        "Pressure cook on medium flame for 4 whistles until chana dal is soft yet holds pleasant bite and lauki melts tender.",
        "Heat 1 teaspoon ghee in a small tadka pan; crackle cumin seeds and asafoetida cleanly.",
        "Pour the fragrant ghee tempering over the hot dal and mash lightly with a ladle to create creamy broth.",
        "Simmer uncovered 2 minutes, garnish with fresh coriander, and serve hot alongside whole wheat rotis."
      ],
      benefits: "Hydrating bottle gourd plus protein-and-fiber rich chana dal calms digestion after busy school days.",
      safety: "Always taste-check raw bottle gourd beforehand to rule out any bitter gourd.",
      icon: "🍲"
    },
    {
      id: '5_10_years_rec_12',
      name: "Crunchy Sprouted Moong Chaat with Lemon",
      localName: "अंकुरित मूंग भेल / முளைகட்டிய பயறு சாட்",
      prepTime: "10 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup fresh green moong bean sprouts",
        "1/4 cup finely diced crisp cucumber & ripe deseeded tomato",
        "2 tbsp finely diced boiled potato",
        "2 tbsp fresh sweet pomegranate pearls (optional)",
        "1/2 tsp roasted cumin (jeera) powder & 1/4 tsp mild chaat masala",
        "1/4 tsp rock salt (or to taste)",
        "1 tbsp fresh lemon juice & 2 tbsp chopped fresh coriander"
      ],
      instructions: [
        "Firstly, rinse green moong sprouts cleanly and steam in a covered steamer for 4 to 5 minutes until tender (never serve raw sprouts).",
        "Cool the steamed sprouts completely in a wide mixing bowl.",
        "Dice crisp cucumber, tomato, and boiled potato neatly into small bite-sized cubes.",
        "Add the diced veggies and pomegranate pearls into the bowl with the cooled sprouts.",
        "Sprinkle roasted cumin powder, mild chaat masala, and rock salt evenly across the mix.",
        "Squeeze fresh lemon juice generously over top and toss briskly with chopped coriander until brightly coated.",
        "Serve immediately in snack bowls for a crunchy, refreshing post-school energy boost."
      ],
      benefits: "Sprouting unlocks enzymes and boosts vitamin C alongside vegetarian protein and gut fiber.",
      safety: "Always lightly steam sprouts for 4–5 minutes to eliminate raw-sprout bacterial risks.",
      icon: "🥗"
    },
    {
      id: '5_10_years_rec_13',
      name: "Tawa-Crisped Sweet Potato & Paneer Tikki",
      localName: "शकरकंद पनीर टिक्की / சர்க்கரைவள்ளி கட்லெட்",
      prepTime: "12 mins",
      cookTime: "10 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup boiled, peeled & smoothly mashed sweet potato (shakarkand)",
        "1/4 cup finely grated fresh paneer",
        "2 to 3 tbsp dry-roasted rolled oats powder (for crisp binding)",
        "1/2 tsp roasted cumin powder & 1/4 tsp mild chaat masala",
        "1/4 tsp salt & 1 tbsp finely chopped fresh coriander",
        "1.5 tsp pure desi ghee (for tawa pan-roasting)",
        "2 tbsp fresh green mint-coriander chutney (for dipping)"
      ],
      instructions: [
        "Firstly, steam or boil sweet potatoes until fork-tender, peel cleanly, and mash smooth in a mixing bowl.",
        "Add grated paneer, oats powder, cumin powder, chaat masala, salt, and chopped coriander.",
        "Mix thoroughly into a pliable dough; adjust with 1 tsp extra oats powder if sticky.",
        "Grease your palms lightly with ghee and shape into 5–6 neat, plump ½-inch mini patties.",
        "Heat 1 teaspoon ghee on a flat tawa or skillet over low-to-medium flame.",
        "Place the patties evenly on the skillet and roast slowly for 4 minutes until crisp golden-brown underneath.",
        "Drizzle remaining ghee on top, flip gently, roast 4 more minutes on the second side, and serve hot with mint chutney."
      ],
      benefits: "Complex low-GI carbs, vitamin A beta-carotene, and dairy protein in a crispy non-deep-fried snack.",
      safety: "Shallow pan-roast in minimal ghee so kids enjoy crisp flavor without heavy fried grease.",
      icon: "🧆"
    },
    {
      id: '5_10_years_rec_14',
      name: "Rich Makhana & Almond Kheer with Jaggery",
      localName: "मखाना खीर / தாமரை விதை பாயாசம்",
      prepTime: "6 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup white lotus seeds (phool makhana)",
        "2 cups full-cream whole cow's milk",
        "1/2 tsp pure desi ghee (for roasting makhana)",
        "2 tbsp organic jaggery powder (added OFF the heat)",
        "5 blanched almonds (finely chopped) & 4 pistachios (slivered)",
        "1 tiny pinch saffron (kesar) strands & 1/4 tsp cardamom powder"
      ],
      instructions: [
        "Firstly, heat ½ teaspoon ghee in a heavy pan on low flame and roast makhana for 4–5 minutes until crisp.",
        "Set aside one-fourth of crisp makhana whole, and coarsely crush the remaining three-fourths in a dry grinder or rolling pin.",
        "Bring 2 cups whole milk to a gentle boil in a deep heavy saucepan, then drop to low flame.",
        "Add crushed and whole makhana, saffron strands, and chopped almonds; simmer gently for 10–12 minutes stirring often.",
        "Cook until milk thickens creamy by about one-fourth and crushed makhana melts velvety smooth.",
        "Stir in cardamom powder and TURN OFF THE STOVE COMPLETELY; wait 2 minutes for boiling to settle.",
        "Whisk in jaggery powder thoroughly until dissolved (preventing milk curdling), garnish with pistachios, and serve warm or chilled."
      ],
      benefits: "Calcium and magnesium powerhouse Indian dessert sweetened cleanly with unrefined jaggery.",
      safety: "Always turn off the stove and cool slightly before stirring in jaggery so the milk stays creamy and never splits.",
      icon: "🍮"
    },
    {
      id: '5_10_years_rec_15',
      name: "Traditional Saffron & Almond Golden Milk",
      localName: "बादाम केसर दूध / பாதாம் பால்",
      prepTime: "5 mins (+ overnight soaking almonds)",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups fresh whole cow's milk",
        "6 raw almonds (soaked overnight, peeled cleanly)",
        "1/4 cup warm milk (for grinding almond paste)",
        "4 strands pure saffron (kesar)",
        "1/4 tsp green cardamom (elaichi) powder",
        "1 tsp raw honey or organic jaggery powder (to taste)"
      ],
      instructions: [
        "Firstly, slip off the skins from overnight-soaked almonds and grind with 2 tablespoons milk into a completely smooth paste.",
        "Soak saffron strands in 1 tablespoon warm milk for 5 minutes to release deep golden aroma.",
        "Bring remaining whole milk to a gentle simmer in a heavy saucepan over low-to-medium flame.",
        "Whisk in the smooth almond paste, saffron milk, and cardamom powder cleanly.",
        "Simmer gently on low flame for 5 minutes, stirring continuously so it turns creamy and rich without scorching.",
        "Turn off the stove, let cool slightly to comfortable warm drinking temperature, and stir in honey or jaggery.",
        "Pour into mugs, sprinkle a sliver of pistachio on top, and enjoy as a calming evening drink."
      ],
      benefits: "Vitamin E from peeled almonds, soothing tryptophan, and calming saffron promote memory and deep sleep.",
      safety: "Wait until milk cools slightly before adding raw honey and test warmth before serving.",
      icon: "🥛"
    },
    ...buildSharedCoreRecipes('5_10_years', 16)
  ]
};
