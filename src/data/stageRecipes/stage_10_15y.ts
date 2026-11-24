import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_10_15_years: AgeGroupData = {
  id: '10_15_years',
  ageLimit: '10 - 15 Years',
  title: "Pre-Teens & Rapid Growth",
  guidelines: "Pre-teens undergo accelerated growth spurts in height, bone density, and muscle mass. Prioritize calcium, high-quality protein, complex carbohydrates, iron, and steady hydration for academic stamina and sports.",
  milestones: [
    "Experiences peak growth spurt requiring dense caloric and micronutrient support.",
    "Active in sports, workouts, and after-school extracurricular activities.",
    "Capable of cooking simple, healthy Indian breakfast and snack items independently."
  ],
  recipes: [
    {
      id: '10_15_years_rec_1',
      name: "Bihari Spiced Sattu Paratha with Mint Dip",
      localName: "सत्तू पराठा / சத்து மாவு பரோட்டா",
      prepTime: "15 mins (+ 15 mins resting)",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup whole wheat flour (atta) + 4–5 tbsp warm water (for kneading)",
        "1/2 cup roasted Bengal gram flour (chana sattu)",
        "2 tbsp very finely chopped onion & 2 tbsp chopped fresh coriander",
        "1/2 tsp grated ginger & 1/2 tsp crushed garlic (optional)",
        "1/4 tsp ajwain (carom seeds) & 1/4 tsp kalonji (nigella seeds, optional)",
        "1 tsp cold-pressed mustard oil & 1 tsp fresh lemon juice",
        "1/2 tsp salt (divided for dough and stuffing)",
        "1.5 tsp pure desi ghee (for tawa roasting)",
        "3 tbsp mint-coriander chutney & fresh curd (for serving)"
      ],
      instructions: [
        "Firstly, knead whole wheat flour with a pinch of salt and warm water into a soft, smooth dough; cover and rest 15 minutes.",
        "In a clean bowl, mix roasted sattu flour with finely chopped onion, coriander, ginger, ajwain, kalonji, and salt.",
        "Drizzle in 1 teaspoon mustard oil, fresh lemon juice, and 1–2 teaspoons water, rubbing between fingers until crumbly-moist (should clump slightly when pressed).",
        "Divide rested dough into 4 equal lime-sized balls; flatten one into a shallow cup dusted with flour.",
        "Place 2 tablespoons of spiced sattu filling into the center, gather pleats tightly to seal, and flatten gently.",
        "Roll gently and evenly into a 6-inch disc without tearing the edges.",
        "Cook on a heated tawa over medium flame for 30 seconds, flip, brush lightly with ghee, and roast both sides until crisp golden brown.",
        "Serve piping hot paired with fresh mint chutney and cooling yogurt."
      ],
      benefits: "Roasted chana sattu delivers dense native plant protein, iron, and fiber keeping pre-teens energized for hours.",
      safety: "Keep stuffing moist enough to bind cleanly without spilling dry sattu powder while rolling.",
      icon: "🫓"
    },
    {
      id: '10_15_years_rec_2',
      name: "High-Protein Paneer or Egg Bhurji Multigrain Toast",
      localName: "पनीर/अंडा भुर्जी टोस्ट / பன்னீர் முட்டை டோஸ்ட்",
      prepTime: "8 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "2 organic whole eggs (whisked) OR 100g fresh crumbled paneer",
        "1/4 cup finely chopped onion, tomato & green bell pepper",
        "2 slices hearty multigrain sourdough or whole wheat bread",
        "1 tsp unsalted butter or pure ghee (plus extra for toast)",
        "1/4 tsp cumin seeds, 1/4 tsp turmeric & 1/4 tsp freshly cracked black pepper",
        "1/4 tsp salt & 1 tbsp chopped fresh coriander leaves"
      ],
      instructions: [
        "Firstly, finely dice the onion, tomato, and green bell pepper cleanly.",
        "Toast the multigrain bread slices lightly in a dry pan or toaster with a thin swipe of butter until crisp-golden.",
        "Melt 1 teaspoon butter in a skillet on medium-low flame and crackle cumin seeds.",
        "Sauté chopped onions and bell peppers for 2 minutes until soft, then add tomatoes, turmeric, and salt for 2 more minutes.",
        "Pour in whisked eggs (or fold in crumbled paneer), stirring gently with a spatula.",
        "Cook eggs on low flame for 2–3 minutes just until soft, fluffy curds set completely (or toss paneer 2 minutes so it stays moist).",
        "Finish with freshly cracked black pepper and chopped coriander, heap generously onto crisp multigrain toast, and serve hot."
      ],
      benefits: "Delivers 18–20g complete protein alongside brain-healthy choline and complex multigrain carbs.",
      safety: "Ensure scrambled eggs are cooked through completely without runny whites while staying velvety soft.",
      icon: "🍳"
    },
    {
      id: '10_15_years_rec_3',
      name: "Savory Vegetable & Sprout Masala Oats",
      localName: "मसाला ओट्स / மசாலா ஓட்ஸ்",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup old-fashioned rolled oats",
        "1/4 cup steamed moong sprouts & sweet corn kernels",
        "2 tbsp finely diced carrots & green peas",
        "1/2 tsp pure desi ghee",
        "1/4 tsp cumin seeds (jeera) & 1/4 tsp turmeric powder",
        "1/4 tsp mild black pepper & 1/4 tsp salt",
        "1.5 cups clean drinking water",
        "1 tsp fresh lemon juice & 1 tbsp chopped fresh coriander"
      ],
      instructions: [
        "Firstly, steam green moong sprouts and sweet corn for 4 minutes until tender.",
        "Heat ½ teaspoon ghee in a heavy saucepan over medium-low flame and pop cumin seeds.",
        "Add finely diced carrots and peas; sauté gently for 2 minutes until bright.",
        "Toss in rolled oats and toast lightly with the veggies for 1 minute until nutty.",
        "Pour in 1.5 cups drinking water, turmeric, salt, and black pepper, stirring evenly.",
        "Simmer gently on low-to-medium flame for 6 to 7 minutes, stirring regularly until creamy and porridge-thick.",
        "Fold in steamed moong sprouts and sweet corn during the last minute, garnish with coriander and lemon juice, and serve hot."
      ],
      benefits: "Beta-glucan soluble fibers stabilize morning blood glucose and sustain pre-teen school stamina.",
      safety: "Steam sprouts thoroughly beforehand and cook oats until completely tender.",
      icon: "🥣"
    },
    {
      id: '10_15_years_rec_4',
      name: "Protein-Rich Chole Bowl with Brown Rice & Salad",
      localName: "छोले ब्राउन राइस / கொண்டகடலை சாதம்",
      prepTime: "15 mins (+ overnight soaking)",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "3/4 cup dried white chickpeas (kabuli chana), soaked overnight",
        "1 cup cooked fluffy brown rice or aged basmati",
        "1 medium onion (chopped) & 2 ripe tomatoes (pureed)",
        "1 tsp ginger-garlic paste & 1 bay leaf (or 1 black tea bag for color while boiling)",
        "1 tsp oil or pure ghee",
        "1 tsp chole masala, 1/2 tsp coriander powder & 1/4 tsp roasted cumin",
        "1/2 tsp salt & 1/2 cup crisp cucumber-onion salad + lemon wedges"
      ],
      instructions: [
        "Firstly, drain overnight-soaked chickpeas and pressure cook with 2.5 cups fresh water, bay leaf (optional tea bag), and ¼ tsp salt for 5–6 whistles until completely tender.",
        "Heat 1 teaspoon oil or ghee in a heavy kadhai on medium flame; sauté chopped onions for 4–5 minutes until rich golden.",
        "Add ginger-garlic paste for 1 minute, then pour in fresh tomato puree, chole masala, coriander, cumin, and remaining salt.",
        "Cook the masala covered for 6–7 minutes until thick and aromatic.",
        "Discard tea bag/bay leaf from boiled chickpeas and pour chickpeas plus 1 cup dark cooking broth into the masala.",
        "Crush a small spoonful of chickpeas lightly against the pot wall and simmer uncovered 10 minutes until rich and glossy.",
        "Garnish with fresh coriander and ladle over steaming brown rice alongside crisp lemon-dressed salad."
      ],
      benefits: "Packs ~16g plant protein, iron, folate, and slow-burning whole-grain brown rice carbohydrates.",
      safety: "Ensure chickpeas are fully tender to support effortless digestion and nutrient uptake.",
      icon: "🍛"
    },
    {
      id: '10_15_years_rec_5',
      name: "Homestyle Low-Fat Dal Makhani with Phulka",
      localName: "घर की दाल मखनी / பருப்பு மக்கானி",
      prepTime: "15 mins (+ overnight soaking)",
      cookTime: "30 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup whole black urad dal + 2 tbsp red kidney beans (rajma), soaked overnight",
        "2 ripe red tomatoes (blended smooth)",
        "1 tsp ginger-garlic paste",
        "1 tsp pure butter + 1 tbsp whole milk (or light fresh cream)",
        "1/2 tsp mild Kashmiri red chili powder (for vibrant color without harsh heat) & 1/4 tsp garam masala",
        "1/2 tsp crushed kasuri methi (dried fenugreek) & 1/2 tsp salt",
        "2 soft whole wheat phulkas + crisp sliced onion rings"
      ],
      instructions: [
        "Firstly, wash soaked whole black urad dal thoroughly by rubbing cleanly between palms so dark dust rinses clear, then drain.",
        "Pressure cook urad dal and rajma with 3 cups water and ¼ tsp salt on low-medium flame for 6–7 whistles until creamy soft.",
        "Melt 1 teaspoon butter in a heavy pan on low flame; sauté ginger-garlic paste for 45 seconds.",
        "Pour in fresh tomato puree, Kashmiri chili powder, and remaining salt; simmer 6 minutes until thickened cleanly.",
        "Add the cooked black dal with its thick broth and mash roughly one-fourth of the lentils with a heavy ladle.",
        "Simmer gently covered on lowest flame for 15–18 minutes, stirring occasionally so the dal turns velvety.",
        "Stir in 1 tablespoon milk, garam masala, and crushed kasuri methi; serve hot with soft whole wheat phulkas and crisp onions."
      ],
      benefits: "Rich in bone calcium, iron, and high lentil protein without excess heavy restaurant butter/cream.",
      safety: "Soak and slow-simmer whole black urad dal thoroughly so it stays light on digestion.",
      icon: "🍲"
    },
    {
      id: '10_15_years_rec_6',
      name: "Garden Palak Paneer with Brown Rice Pulao",
      localName: "पालक पनीर पुलाव / பாலக் பன்னீர் புலாவ்",
      prepTime: "12 mins",
      cookTime: "18 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups fresh spinach (palak) leaves, blanched & smoothly pureed",
        "100g fresh firm paneer cut into ¾-inch cubes",
        "1 small onion & 1 small tomato (finely chopped)",
        "2 cloves garlic (finely minced) & 1/2 inch grated ginger",
        "1 tsp pure desi ghee",
        "1/2 tsp cumin seeds, 1/4 tsp turmeric & 1/4 tsp mild garam masala",
        "1/2 tsp salt & 1 cup cooked cumin brown rice"
      ],
      instructions: [
        "Firstly, wash spinach cleanly 3 times, blanch 2 minutes in boiling water, chill in cold water, and blend into a bright emerald puree.",
        "Heat 1 teaspoon ghee in a pan on medium-low flame; crackle cumin seeds and sauté minced garlic and ginger 30 seconds.",
        "Add chopped onions and sauté 3 minutes until soft, then add tomatoes and cook 3 minutes until mushy.",
        "Stir in turmeric, salt, and smooth spinach puree; simmer gently on low flame for 4 minutes.",
        "Fold in fresh paneer cubes and mild garam masala, simmering 2–3 minutes so paneer stays tender and absorbs flavor.",
        "Serve steaming hot alongside fragrant cumin-scented brown rice and crunchy kachumber."
      ],
      benefits: "Delivers concentrated iron, magnesium, zinc, and calcium critical for pre-teen skeletal mineralization.",
      safety: "Rinse spinach leaves thoroughly to eliminate grit and avoid over-boiling once paneer goes in.",
      icon: "🍛"
    },
    {
      id: '10_15_years_rec_7',
      name: "Panchmel Dal (5 Lentils) with Multigrain Roti",
      localName: "पंचमेल दाल रोटी / பஞ்ச பருப்பு சாதம்",
      prepTime: "12 mins (+ 25 mins soaking)",
      cookTime: "20 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup mixed 5 lentils (equal parts yellow moong, masoor, toor, chana & urad dal)",
        "1 medium ripe tomato (finely chopped)",
        "1 tsp grated ginger & 1/2 tsp cumin seeds",
        "1 tsp pure desi ghee",
        "1/4 tsp turmeric powder, 1/2 tsp coriander powder & 1 pinch hing",
        "1/2 tsp salt & 2 cups clean drinking water",
        "2 warm multigrain rotis + 1/2 cup fresh cucumber kachumber"
      ],
      instructions: [
        "Firstly, rinse the 5-lentil blend 3 times cleanly, soak in fresh water for 25 minutes, and drain.",
        "Pressure cook the soaked lentils with 2 cups water, turmeric, and salt for 4 whistles until tender.",
        "Whisk the cooked dal smoothly with a ladle until all 5 dals meld into a rich golden gravy.",
        "Heat 1 teaspoon desi ghee in a tadka pan on low flame; pop cumin seeds and asafoetida.",
        "Add grated ginger and chopped tomatoes, cooking 3–4 minutes with coriander powder until soft.",
        "Pour the sizzling tadka directly over the hot dal, simmer 2 minutes, garnish with fresh coriander, and serve with warm multigrain rotis."
      ],
      benefits: "Five distinct pulses combine complementary amino acids, B vitamins, and iron for rapid tissue growth.",
      safety: "Soak mixed lentils (especially chana and urad) cleanly beforehand so all cook evenly soft.",
      icon: "🍲"
    },
    {
      id: '10_15_years_rec_8',
      name: "High-Protein Soya Chunk & Pea Curry with Rice",
      localName: "सोया चंक्स करी / சோயா குழம்பு",
      prepTime: "12 mins",
      cookTime: "18 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup dry soya chunks (nutri nuggets)",
        "1/4 cup sweet green peas",
        "1 medium onion (finely chopped) & 2 ripe tomatoes (pureed)",
        "1 tsp ginger-garlic paste",
        "1 tsp oil or ghee + 1/2 tsp cumin seeds",
        "1/4 tsp turmeric, 1 tsp coriander powder & 1/2 tsp mild garam masala",
        "1/2 tsp salt & 1 cup clean water",
        "1 cup steamed basmati rice (or 2 whole wheat rotis)"
      ],
      instructions: [
        "Firstly, boil 3 cups water with a pinch of salt; drop in soya chunks, boil 5 minutes until doubled and spongy, then drain and rinse in cold water.",
        "Squeeze every soya chunk firmly between clean palms to press out all excess starchy boiling water (this removes raw smell and absorbs gravy better).",
        "Heat 1 teaspoon oil or ghee in a pan on medium flame; crackle cumin seeds and sauté chopped onions golden.",
        "Add ginger-garlic paste for 45 seconds, then stir in fresh tomato puree, turmeric, coriander powder, and salt.",
        "Cook masala covered for 5 minutes until rich, then toss in the squeezed soya chunks and green peas.",
        "Pour in 1 cup water, cover, and simmer on low flame for 8–10 minutes so chunks soak up spicy gravy.",
        "Finish with garam masala and fresh coriander, and serve piping hot with steamed rice or rotis."
      ],
      benefits: "Over 50% clean vegetarian protein by dry weight—exceptional for muscle recovery after sports practice.",
      safety: "Always boil and squeeze soya chunks thoroughly before simmering in gravy for juicy texture.",
      icon: "🍛"
    },
    {
      id: '10_15_years_rec_9',
      name: "Gujarati Spiced Kadhi with Moong Khichdi",
      localName: "कढ़ी खिचड़ी / மோர் குழம்பு கிச்சடி",
      prepTime: "10 mins",
      cookTime: "16 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup fresh plain curd (slightly tangy) + 1.5 cups water",
        "2 tbsp fine besan (chickpea flour)",
        "1/2 tsp grated ginger & 1 tiny mild green chili (optional/slit)",
        "1/2 tsp jaggery & 1/2 tsp salt",
        "1 tsp pure desi ghee + 1/2 tsp mustard seeds, 1/4 tsp fenugreek (methi) seeds & 6 curry leaves",
        "1 tiny pinch hing & 1 cup warm moong dal khichdi (prepared separately)"
      ],
      instructions: [
        "Firstly, whisk curd and besan together in a deep bowl until zero lumps remain.",
        "Gradually whisk in 1.5 cups water, ginger, salt, and jaggery until smooth and frothy.",
        "Pour into a heavy saucepan over medium flame and stir continuously until it comes to a gentle boil (prevents curdling).",
        "Lower flame to minimum and simmer gently for 8–10 minutes, stirring occasionally so raw besan taste cooks away cleanly.",
        "Meanwhile, heat 1 teaspoon ghee in a tadka pan; pop mustard seeds, methi seeds, hing, slit mild chili, and curry leaves.",
        "Pour the aromatic sizzling tempering directly over the simmering kadhi, garnish with coriander, and ladle generously over hot moong khichdi."
      ],
      benefits: "Calming evening meal blending probiotic buttermilk, ginger, and light lentil khichdi.",
      safety: "Stir steadily while bringing kadhi to its initial boil so the yogurt base stays silky smooth.",
      icon: "🥣"
    },
    {
      id: '10_15_years_rec_10',
      name: "Zesty Peanut & Kala Chana Chaat",
      localName: "चना मूंगफली चाट / வேர்க்கடலை சுண்டல்",
      prepTime: "10 mins (+ overnight soaking)",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup brown chickpeas (kala chana), soaked overnight & pressure cooked tender",
        "1/4 cup dry-roasted crunchy peanuts",
        "1/4 cup finely diced crisp cucumber, onion & ripe tomato",
        "1 tbsp finely chopped fresh coriander & mint leaves",
        "1/2 tsp roasted cumin powder & 1/2 tsp chaat masala",
        "1/4 tsp black salt (kala namak)",
        "1 tbsp fresh lemon juice"
      ],
      instructions: [
        "Firstly, pressure cook soaked kala chana in salted water for 4–5 whistles until tender yet intact, then drain.",
        "Dry-roast peanuts on low flame until crisp and rub off loose skins cleanly.",
        "Finely dice cucumber, onion, and ripe tomato and place into a wide mixing bowl.",
        "Add the warm or cooled boiled kala chana and crunchy roasted peanuts into the bowl.",
        "Sprinkle roasted cumin powder, chaat masala, and black salt evenly across the top.",
        "Squeeze fresh lemon juice and toss vigorously with chopped mint and coriander until every piece shines; serve immediately."
      ],
      benefits: "High iron, slow-digesting protein, and monounsaturated fats for sustained after-school focus.",
      safety: "Ensure brown chickpeas cook fully tender so they chew easily without bloating.",
      icon: "🥗"
    },
    {
      id: '10_15_years_rec_11',
      name: "Tawa-Grilled Herb Paneer Tikka Cubes",
      localName: "पनीर टिक्का / பன்னீர் டிக்கா",
      prepTime: "15 mins (+ 15 mins marination)",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "150g fresh firm paneer cut into 1-inch cubes",
        "1/2 cup diced red/green bell peppers & onion petals",
        "1/4 cup thick hung curd (Greek yogurt)",
        "1 tsp ginger-garlic paste",
        "1/2 tsp roasted cumin powder, 1/4 tsp turmeric & 1/2 tsp Kashmiri chili powder",
        "1 tsp crushed kasuri methi & 1/4 tsp ajwain",
        "1/2 tsp salt & 1 tsp mustard oil (or ghee)",
        "1 tsp lemon juice & chaat masala (for finishing)"
      ],
      instructions: [
        "Firstly, whisk thick hung curd in a wide bowl with ginger-garlic paste, turmeric, Kashmiri chili, cumin, kasuri methi, ajwain, salt, and mustard oil.",
        "Gently fold in the 1-inch paneer cubes, bell pepper squares, and onion petals so every cube coats smoothly.",
        "Cover and marinate for 15–20 minutes so flavors infuse into the paneer.",
        "Thread onto wooden skewers (or arrange flat without skewers) cleanly.",
        "Heat a cast-iron tawa or grill pan on medium flame and brush lightly with oil.",
        "Sear the marinated paneer and veggies for 2 minutes per side until lightly blistered and golden brown.",
        "Transfer onto a plate, sprinkle chaat masala and squeeze fresh lemon juice over top, and serve hot with mint chutney."
      ],
      benefits: "Instant post-sport dairy protein and vitamin C from blistered peppers supporting tissue repair.",
      safety: "Keep skewers flat or slide cubes onto a plate before serving to avoid accidental pointy pokes.",
      icon: "🍢"
    },
    {
      id: '10_15_years_rec_12',
      name: "Ragi & Roasted Sesame Calcium Balls",
      localName: "रागी तिल लड्डू / ராகி எள்ளு உருண்டை",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup pure sprouted ragi (finger millet) flour",
        "2 tbsp white sesame seeds (safed til)",
        "3 tbsp organic jaggery powder (lump-free)",
        "1.5 tbsp pure homemade desi ghee",
        "1/4 tsp green cardamom (elaichi) powder",
        "1 tbsp finely chopped roasted peanuts or almonds (optional)"
      ],
      instructions: [
        "Firstly, dry-roast white sesame seeds in a heavy pan on low flame for 2 minutes until they begin to pop gently, then set aside.",
        "Melt 1.5 tablespoons pure desi ghee in the same pan over lowest flame.",
        "Add ragi flour and roast slowly for 6 minutes, stirring continuously until rich nutty aroma rises.",
        "Turn off the stove immediately, stir in the roasted sesame seeds, optional nuts, and cardamom powder.",
        "Allow mixture to cool for 2–3 minutes until just comfortably warm to touch.",
        "Sprinkle in jaggery powder and knead cleanly with warm hands until completely uniform.",
        "Roll firmly between your palms into smooth golf-ball-sized ladoos; cool completely and store airtight up to 2 weeks."
      ],
      benefits: "Ragi + sesame seeds create one of nature's densest plant-based calcium combinations for bone growth.",
      safety: "Stir continuously while roasting ragi on low flame—dark ragi masks burning easily by sight, so trust the nutty aroma.",
      icon: "🧆"
    },
    {
      id: '10_15_years_rec_13',
      name: "Nutty Banana & Chia Seed Power Shake",
      localName: "बनाना पीनट शेक / வாழைப்பழ ஸ்மூத்தி",
      prepTime: "5 mins (+ 15 mins soaking chia)",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 large ripe banana (peeled and sliced)",
        "1 cup chilled or cool whole milk (or almond milk)",
        "1 tbsp natural unsweetened peanut butter",
        "1 tsp chia seeds (pre-soaked in 2 tbsp water for 15 mins)",
        "1 soft pitted date (or 1 tsp honey)",
        "1 pinch cinnamon powder (optional)"
      ],
      instructions: [
        "Firstly, stir chia seeds into 2 tablespoons drinking water and soak for 15 minutes until gel-coated.",
        "Place sliced ripe banana, natural peanut butter, pitted soft date, and optional cinnamon into a blender jar.",
        "Pour in half the milk first and blend at high speed for 30 seconds until completely thick and creamy.",
        "Add remaining milk and blend 15 seconds more until frothy.",
        "Pour into a tall sports glass and stir in the pre-soaked gel chia seeds smoothly with a spoon.",
        "Drink fresh immediately after evening sports practice or study sessions."
      ],
      benefits: "Replenishes muscle glycogen, delivers electrolytes, and packs plant omega-3 fats from soaked chia.",
      safety: "Always pre-soak chia seeds in water for at least 15 minutes before stirring into drinks.",
      icon: "🥤"
    },
    ...buildSharedCoreRecipes('10_15_years', 14)
  ]
};
