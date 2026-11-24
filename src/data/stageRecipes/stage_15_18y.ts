import { Recipe, AgeGroupData } from '../foodGuideData';
import { buildSharedCoreRecipes } from './sharedCoreRecipes';

export const stageData_15_18_years: AgeGroupData = {
  id: '15_18_years',
  ageLimit: '15 - 18 Years',
  title: "Adolescent & Young Adult Peak Energy",
  guidelines: "Teenagers have metabolic demands approaching adult athletic levels. Rapid hormonal development, intense academic exam prep, and high sports activity require clean whole foods, dense iron, zinc, complex carbs, and clean hydration.",
  milestones: [
    "Adult metabolic capacity with intense caloric requirements during sports and exam seasons.",
    "Makes independent nutrition choices in school, college, and social outings.",
    "Benefits from meal-prep routines, wholesome snacking habits, and avoiding junk food."
  ],
  recipes: [
    {
      id: '15_18_years_rec_1',
      name: "High-Protein Whole Wheat Paneer Kathi Roll",
      localName: "पनीर काठी रोल / பன்னீர் காட்டி ரோல்",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "100g fresh firm paneer cut into ½-inch strips",
        "1 large soft whole wheat chapati / roti wrap",
        "1/4 cup thinly sliced mixed bell peppers & crisp onion rings",
        "1.5 tbsp tangy mint-coriander chutney",
        "1 tsp pure desi ghee (for sautéing & warming wrap)",
        "1/2 tsp roasted cumin powder, 1/2 tsp chaat masala & 1/4 tsp Kashmiri chili",
        "1/4 tsp salt & 1 tsp fresh lemon juice"
      ],
      instructions: [
        "Firstly, slice paneer cleanly into even 2-inch finger strips and thinly julienne bell peppers and onions.",
        "Heat 1 teaspoon ghee in a wide skillet on medium-high flame; add peppers and onions and stir-fry briskly for 90 seconds so they stay slightly crisp.",
        "Toss in paneer strips, cumin powder, chaat masala, Kashmiri chili, and salt; sear 2 minutes until edges turn golden.",
        "Turn off stove, squeeze fresh lemon juice over the paneer filling, and mix cleanly.",
        "Warm a large soft whole wheat roti on a tawa for 20 seconds so it stays pliable.",
        "Spread mint-coriander chutney evenly across the center of the warm roti.",
        "Line the spiced paneer strips, peppers, and crisp onion down the center, roll tightly in parchment paper, slice diagonally, and take on the go."
      ],
      benefits: "Supplies 22g+ high-quality dairy protein paired with complex whole wheat energy for peak teen stamina.",
      safety: "Wrap snugly in clean parchment paper so the roll stays tidy during school or college commutes.",
      icon: "🌯"
    },
    {
      id: '15_18_years_rec_2',
      name: "Protein-Packed Besan & Sprouted Oats Cheela",
      localName: "बेसन ओट्स चीला / கடலை மாவு ஓட்ஸ் அடை",
      prepTime: "10 mins (+ 10 mins resting)",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fine besan (chickpea flour)",
        "1/4 cup dry-roasted rolled oats, ground into fine flour",
        "2 tbsp finely grated paneer & 2 tbsp finely chopped fresh spinach",
        "1 tbsp finely chopped onion & 1/2 tsp grated ginger",
        "1/2 tsp ajwain (carom seeds), 1/4 tsp turmeric & 1/4 tsp cracked black pepper",
        "1/4 tsp salt & 2/3 cup clean water (as needed for batter)",
        "1 tsp cold-pressed oil or ghee (for cooking)"
      ],
      instructions: [
        "Firstly, dry-roast rolled oats for 2 minutes, grind fine, and whisk together with besan, ajwain, turmeric, black pepper, and salt.",
        "Pour in water gradually while whisking briskly into a smooth, pourable batter; cover and rest 10 minutes so oat flour hydrates.",
        "Fold chopped spinach, onion, and grated ginger into the rested batter cleanly.",
        "Heat a non-stick or cast-iron tawa on medium flame and brush lightly with oil or ghee.",
        "Pour a generous ladle of batter onto the center and spread spirally into a 7-inch thin crepe.",
        "Drizzle a few drops of oil around edges, scatter grated paneer across the top, and cook 2 minutes until golden underneath.",
        "Flip briefly for 60 seconds until crisp-edged and cooked through inside, fold in half, and serve hot with tomato relish and spiced curd."
      ],
      benefits: "Dual-fiber besan + oat matrix stabilizes teen blood sugar cleanly while preventing mid-morning fatigue.",
      safety: "Cook on steady medium flame so chickpea flour cooks thoroughly with zero raw bitterness.",
      icon: "🫓"
    },
    {
      id: '15_18_years_rec_3',
      name: "Morning Sprout & Boiled Egg / Tofu Power Bowl",
      localName: "अंडा स्प्राउट्स सलाद / முட்டை சுண்டல் கிண்ணம்",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "2 farm-fresh eggs (hard-boiled & quartered) OR 100g firm grilled tofu cubes",
        "1/2 cup steamed green moong & brown kala chana sprouts",
        "1/4 cup diced crisp cucumber, ripe tomato & fresh mint leaves",
        "1 tsp extra-virgin olive oil or melted ghee",
        "1/2 tsp roasted cumin powder, 1/4 tsp cracked black pepper & 1/4 tsp salt",
        "1 tbsp fresh lemon juice & 1 slice toasted whole grain bread (for serving)"
      ],
      instructions: [
        "Firstly, place eggs in water and boil 9–10 minutes until yolks set firm (or sear seasoned firm tofu cubes in a skillet until golden).",
        "Steam green moong and kala chana sprouts in a covered steamer for 5 minutes until tender, then cool slightly.",
        "Dice crisp cucumber and ripe tomato evenly and place into a wide breakfast bowl along with chopped mint.",
        "Add the steamed sprouts into the bowl and whisk olive oil, lemon juice, cumin, black pepper, and salt directly over them.",
        "Toss well until every sprout and vegetable piece shines cleanly.",
        "Peel and slice/quarter the boiled eggs (or arrange hot grilled tofu cubes) right on top, sprinkle extra pepper, and serve with warm toast."
      ],
      benefits: "High choline and bioavailable protein accelerate neurotransmitter synthesis, memory recall, and athletic repair.",
      safety: "Steam sprouts 5 minutes and boil eggs fully 9–10 minutes for safe daily consumption.",
      icon: "🥗"
    },
    {
      id: '15_18_years_rec_4',
      name: "Hearty Punjabi Rajma with Quinoa & Brown Rice",
      localName: "राजमा क्विनोआ / ராஜ்மா சாதம்",
      prepTime: "15 mins (+ overnight soaking)",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup dried red kidney beans (rajma), soaked overnight",
        "1/2 cup brown rice + 1/4 cup rinsed quinoa (cooked together)",
        "1 large onion (finely chopped) & 2 large ripe tomatoes (pureed)",
        "1 tsp ginger-garlic paste & 1 tsp pure desi ghee",
        "1/2 tsp cumin seeds, 1/4 tsp turmeric, 1 tsp coriander powder & 1/2 tsp garam masala",
        "1/2 tsp salt & 1/2 cup crisp kachumber salad + 1 roasted papad"
      ],
      instructions: [
        "Firstly, pressure cook overnight-soaked rajma with 2.5 cups fresh water and ¼ tsp salt for 5–6 whistles until completely tender.",
        "Cook rinsed brown rice and quinoa together with 2 cups water until fluffy and light.",
        "Heat 1 teaspoon ghee in a heavy pan on medium flame; splutter cumin seeds and sauté chopped onions golden brown.",
        "Add ginger-garlic paste for 1 minute, then stir in fresh tomato puree, turmeric, coriander powder, and remaining salt.",
        "Cook masala covered 6 minutes until rich, then pour in boiled rajma and its dark cooking broth.",
        "Mash a spoonful lightly to thicken gravy, add garam masala, and simmer gently 10 minutes before serving over warm quinoa-brown rice with kachumber and roasted papad."
      ],
      benefits: "Delivers 20g+ complete protein, potassium, and sustained low-GI energy for sports and college study.",
      safety: "Soak kidney beans thoroughly overnight and rinse quinoa well so zero bitterness remains.",
      icon: "🍛"
    },
    {
      id: '15_18_years_rec_5',
      name: "Homestyle Chole with Baked Multigrain Kulcha",
      localName: "होममेड छोले कुलचा / சுண்டல் குல்சா",
      prepTime: "15 mins (+ overnight soaking)",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup dried white chickpeas (kabuli chana), soaked overnight",
        "1 black tea bag (or 2 dried amla pieces) for deep color while boiling",
        "2 ripe tomatoes (pureed) & 1 onion (finely chopped)",
        "1 tsp ginger-garlic paste & 1 tbsp chole masala + 1 tsp crushed anardana",
        "1 tsp ghee/oil & 1/2 tsp salt",
        "2 whole wheat or multigrain kulchas (tawa-toasted with ½ tsp ghee)",
        "2 tbsp tangy sirka pickled onions & 2 tbsp green mint chutney"
      ],
      instructions: [
        "Firstly, drain overnight-soaked chickpeas and pressure cook with 3 cups water, ¼ tsp salt, and tea bag/dried amla for 5–6 whistles until soft.",
        "Discard tea bag cleanly, reserving the dark mineral-rich chickpea cooking broth.",
        "Heat 1 teaspoon oil or ghee in a kadhai; sauté chopped onions golden and cook ginger-garlic paste 1 minute.",
        "Add tomato puree, chole masala, crushed anardana, and remaining salt; sauté covered 6 minutes until thickened.",
        "Pour in boiled chickpeas and dark broth, simmering uncovered 12 minutes until glossy and thick.",
        "Meanwhile, lightly brush multigrain kulchas with ghee and toast on a hot tawa until puffed and crisp-golden.",
        "Serve steaming hot chole topped with julienned ginger alongside warm kulchas, sirka onions, and mint chutney."
      ],
      benefits: "Vitamin C from amla and pomegranate seeds dramatically boosts plant iron absorption for growing teens.",
      safety: "Toast kulchas lightly on a hot tawa rather than deep-frying or smothering in heavy butter.",
      icon: "🍲"
    },
    {
      id: '15_18_years_rec_6',
      name: "Fragrant Soya & Vegetable Dum Biryani",
      localName: "सोया वेज बिरयानी / சோயா பிரியாணி",
      prepTime: "15 mins (+ 25 mins soaking rice)",
      cookTime: "22 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup boiled, rinsed & thoroughly squeezed soya chunks",
        "1 cup aged long-grain basmati rice (washed, soaked & 75% par-boiled)",
        "1/2 cup sliced onions, diced carrots & green peas",
        "1/4 cup thick fresh curd + 1 tsp ginger-garlic paste + 1 tbsp biryani masala (marinade)",
        "2 tbsp fresh chopped mint & coriander leaves + 1 tbsp saffron milk (optional)",
        "1.5 tsp pure desi ghee, 1 bay leaf, 2 cloves & 1 cardamom pod",
        "1/2 tsp salt & 1/2 cup cool cucumber-mint raita"
      ],
      instructions: [
        "Firstly, toss squeezed boiled soya chunks with curd, ginger-garlic paste, biryani masala, half the mint-coriander, and salt; marinate 15 minutes.",
        "Par-boil soaked basmati rice with bay leaf, cloves, and cardamom until 75% cooked (firm core inside), then drain cleanly.",
        "Heat 1 teaspoon ghee in a heavy pot; sauté sliced onions 6 minutes until deep caramelized golden (birista), reserving a spoon for garnish.",
        "Add carrots, peas, and marinated soya chunks into the pot and cook on medium heat for 5–6 minutes until gravy coats chunks thickly.",
        "Lower flame to minimum, layer the par-boiled fluffy rice evenly over the soya base, and drizzle saffron milk, mint, and ½ tsp ghee on top.",
        "Seal the pot tightly with a heavy lid (or foil) and dum-cook on very low heat for 12 minutes.",
        "Rest 5 minutes before fluffing gently from the bottom up, and serve hot with cooling mint-cucumber raita."
      ],
      benefits: "One of the highest plant-protein sports meals pairing complete soya amino acids with fragrant carbs.",
      safety: "Squeeze excess water thoroughly out of soya chunks before marinating so they absorb spice deeply.",
      icon: "🍛"
    },
    {
      id: '15_18_years_rec_7',
      name: "Dal Palak with Traditional Bajra or Jowar Roti",
      localName: "दाल पालक बाजरा रोटी / கீரை பருப்பு கம்பு ரொட்டி",
      prepTime: "15 mins (+ 20 mins soaking)",
      cookTime: "20 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup split toor or moong dal (washed & soaked 20 mins)",
        "1.5 cups fresh spinach (palak) leaves, finely chopped",
        "1 ripe tomato (chopped) & 3 cloves garlic (crushed)",
        "1 tsp pure desi ghee + 1/2 tsp cumin seeds & 1 pinch hing (for dal)",
        "1 cup bajra (pearl millet) or jowar (sorghum) flour + 1/2 cup hot water (for bhakri)",
        "1/2 tsp salt & 1 tsp pure ghee (to brush hot bhakris) + 1 small lemon & jaggery cube"
      ],
      instructions: [
        "Firstly, pressure cook soaked dal with chopped tomato, turmeric, salt, and 2 cups water for 3–4 whistles until soft.",
        "Stir finely chopped fresh spinach directly into the hot cooked dal and simmer gently 4–5 minutes until tender.",
        "Heat 1 teaspoon ghee in a tadka spoon, fry crushed garlic golden with cumin seeds and hing, and pour over the steaming dal palak.",
        "For millet rotis, pour hot water gradually into bajra or jowar flour and knead firmly with your palm heel for 3–4 minutes until smooth and crack-free.",
        "Pat or gently roll dough balls into rustic 6-inch rotis and cook on a hot tawa, misting briefly with water so they puff soft.",
        "Brush hot millet bhakris generously with pure ghee and serve immediately alongside dal palak, lemon, and a small jaggery bite."
      ],
      benefits: "Ancient gluten-free Indian millets deliver zinc, magnesium, and stamina-sustaining complex fiber.",
      safety: "Knead millet flour with hot water and eat warm with ghee for smooth night digestion.",
      icon: "🫓"
    },
    {
      id: '15_18_years_rec_8',
      name: "Spiced Paneer Tikka Rice Bowl with Green Chutney",
      localName: "पनीर टिक्का राइस बाउल / பன்னீர் டிக்கா சாதக் கிண்ணம்",
      prepTime: "12 mins (+ 15 mins marination)",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "120g fresh paneer cut into 1-inch cubes",
        "1/2 cup thick diced bell peppers & red onions",
        "2 tbsp thick curd + 1/2 tsp ginger-garlic paste + 1/2 tsp tandoori/garam masala",
        "1 tsp cold-pressed oil or ghee + 1/2 tsp salt",
        "1 cup cooked steaming jeera rice or fluffy quinoa",
        "2 tbsp refreshing mint-yogurt dressing & 1 tsp fresh lemon juice"
      ],
      instructions: [
        "Firstly, whisk thick curd, ginger-garlic paste, tandoori masala, and salt in a bowl; coat paneer cubes, peppers, and onions for 15 minutes.",
        "Heat 1 teaspoon oil or ghee on a hot cast-iron skillet or tawa on medium-high flame.",
        "Arrange marinated paneer and veggies in a single layer without crowding and sear 2 minutes per side until blistered golden.",
        "Spoon warm fragrant jeera rice or quinoa into a wide dinner bowl as the hearty base.",
        "Heap the hot seared paneer cubes, caramelized onions, and crisp-tender peppers on top.",
        "Drizzle cooling mint-yogurt dressing and fresh lemon juice generously over the bowl and serve immediately."
      ],
      benefits: "High evening protein prevents late-night junk food cravings while rebuilding muscle after workouts.",
      safety: "Cook paneer briskly over medium-high heat in minimal oil so it stays juicy inside.",
      icon: "🍲"
    },
    {
      id: '15_18_years_rec_9',
      name: "Light Yellow Moong Clear Soup with Multigrain Toast",
      localName: "मूंग दाल सूप / பாசிப்பருப்பு சூப்",
      prepTime: "5 mins (+ 15 mins soaking)",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup split yellow moong dal (washed & soaked 15 mins)",
        "3 cups clean drinking water",
        "1/4 tsp pure turmeric powder (haldi) & 1/2 tsp salt",
        "1 tsp pure desi ghee + 1/2 tsp cumin seeds & 1/2 tsp freshly cracked black pepper",
        "1 tsp fresh lemon juice & 1 tbsp chopped fresh coriander",
        "1 slice toasted multigrain garlic bread (for serving)"
      ],
      instructions: [
        "Firstly, drain soaked yellow moong dal and pressure cook with 3 cups water, turmeric, and salt for 4 whistles until completely dissolved.",
        "Whisk the hot dal vigorously with a wire whisk into a smooth, frothy, comforting lentil broth.",
        "Heat 1 teaspoon desi ghee in a tiny tadka pan; crackle cumin seeds and freshly cracked black pepper for 10 seconds.",
        "Pour the sizzling pepper-cumin tempering directly into the hot moong soup.",
        "Squeeze fresh lemon juice and sprinkle chopped coriander leaves right into the pot.",
        "Serve piping hot in mugs alongside warm crunchy multigrain garlic toast during late-night study sessions."
      ],
      benefits: "Ultra-light, soothing nighttime protein soup that keeps students warm and alert without heavy sleepiness.",
      safety: "Check temperature carefully before sipping and keep pepper brisk yet comfortable.",
      icon: "🍵"
    },
    {
      id: '15_18_years_rec_10',
      name: "Chatpata Roasted Chana & Peanut Mix",
      localName: "भुना चना चाट / வறுத்த கடலை சாட்",
      prepTime: "6 mins",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup crisp skin-on roasted Bengal gram (bhuna chana)",
        "1/4 cup dry-roasted peanuts & 8 roughly chopped almonds",
        "1/4 cup finely chopped crisp onion, tomato & green coriander",
        "1/2 tsp chaat masala & 1/4 tsp roasted cumin powder",
        "1/4 tsp black salt",
        "1 tbsp fresh lemon juice"
      ],
      instructions: [
        "Firstly, combine crisp roasted bhuna chana, roasted peanuts, and chopped almonds in a wide dry mixing bowl.",
        "Finely chop fresh onion, deseeded tomato, and bright green coriander leaves.",
        "Add the chopped veggies directly into the crunchy legume-nut mix right when ready to eat.",
        "Sprinkle chaat masala, roasted cumin powder, and black salt evenly across the bowl.",
        "Squeeze fresh lemon juice on top, toss rapidly with a spoon so chana stays ultra-crunchy, and eat immediately."
      ],
      benefits: "Skin-on roasted chana packs clean plant protein and insoluble fiber that shuts down fried-chip cravings.",
      safety: "Mix in fresh tomatoes and lemon right before eating so the roasted chana keeps its crunch.",
      icon: "🍿"
    },
    {
      id: '15_18_years_rec_11',
      name: "Warm Almond & Dried Fig (Anjeer) Milk",
      localName: "बादाम अंजीर दूध / அத்திப்பழ பாதாம் பால்",
      prepTime: "5 mins (+ 20 mins soaking figs)",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups fresh whole milk",
        "2 dried figs (anjeer), soaked in warm water 20 mins & finely chopped",
        "6 almonds (soaked, peeled & crushed/chopped fine)",
        "4 strands pure saffron (kesar)",
        "1/4 tsp green cardamom (elaichi) powder"
      ],
      instructions: [
        "Firstly, soak dried figs in ¼ cup warm water for 20 minutes until soft, then chop finely (or pulse into a chunky paste).",
        "Peel soaked almonds and crush coarsely with a mortar and pestle.",
        "Bring 1.5 cups whole milk to a gentle boil in a saucepan, then reduce to low flame.",
        "Stir in the chopped figs, crushed almonds, saffron strands, and cardamom powder.",
        "Simmer gently on low heat for 7–8 minutes until milk turns thick, creamy, and naturally sweetened by figs.",
        "Pour into a warm mug and drink 30 minutes before sleep for mental relaxation and deep exam recovery."
      ],
      benefits: "Naturally sweet iron, magnesium, and calcium beverage promoting memory consolidation and restful sleep.",
      safety: "Soak dried figs fully until soft before chopping so they simmer smoothly into the milk.",
      icon: "🥛"
    },
    {
      id: '15_18_years_rec_12',
      name: "Nutty Peanut & Jaggery Energy Chikki",
      localName: "मूंगफली गुड़ चिक्की / கடலை மிட்டாய்",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup dry-roasted, skinless split peanuts",
        "3/4 cup crushed organic dark or golden jaggery (gud)",
        "1 tbsp clean drinking water (to melt jaggery smoothly)",
        "1 tsp pure desi ghee (plus extra for greasing surface & rolling pin)",
        "1/4 tsp green cardamom powder (optional)"
      ],
      instructions: [
        "Firstly, grease a flat steel board or parchment sheet and a rolling pin lightly with pure ghee and keep ready.",
        "Heat 1 teaspoon ghee, crushed jaggery, and 1 tablespoon water in a heavy pan over very low flame, stirring steadily.",
        "Once jaggery melts and bubbles frothy (about 5–6 mins), test readiness by dropping a tiny bead into cold water—it MUST snap cleanly like glass (hard-crack stage).",
        "Immediately turn off the stove, stir in optional cardamom and the warm roasted split peanuts rapidly.",
        "Pour the hot mixture onto the greased surface immediately before it hardens.",
        "Roll briskly with the greased rolling pin into an even ¼-inch slab and score cleanly into squares while still warm.",
        "Cool completely for 20 minutes until brittle, snap cleanly along scored lines, and store airtight up to 1 month."
      ],
      benefits: "Portable, zero-preservative snack rich in plant iron, healthy fats, and protein for exam energy.",
      safety: "Keep flame very low while boiling jaggery and wait until completely cool before snapping squares.",
      icon: "🍬"
    },
    ...buildSharedCoreRecipes('15_18_years', 13)
  ]
};
