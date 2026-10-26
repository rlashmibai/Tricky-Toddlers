export type MealCategory = 'Morning' | 'Lunch' | 'Dinner' | 'Snacks';

export interface Recipe {
  id: string;
  name: string;
  localName?: string;
  prepTime: string;
  cookTime: string;
  category?: MealCategory;
  region?: string;
  ingredients: string[];
  instructions: string[];
  benefits: string;
  safety: string;
  icon: string;
}

export interface AgeGroupData {
  id: string;
  ageLimit: string;
  title: string;
  guidelines: string;
  milestones: string[];
  recipes: Recipe[];
}

export const baseAgeStagesData: AgeGroupData[] = [
  {
    id: '0_6_months',
    ageLimit: '0 - 6 Months',
    title: 'Early Milk & Preparation Stage',
    guidelines: 'Exclusive breastfeeding or formula is medically recommended. No solids are needed yet, but watch for signs of swallowing readiness and neck stability toward month 5 or 6.',
    milestones: [
      'Can hold head up and maintain upright posture when supported.',
      'Shows intense curiosity in what parents are eating, leaning forward.',
      'Extrusion reflex (spitting out items with tongue) starts to decline.'
    ],
    recipes: [
      {
        id: 'apple_puree',
        name: 'Silky Smooth Apple Purée',
        localName: 'महीन सेब प्यूरी / ஆப்பிள் கூழ்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 Sweet Apple (Gala or Fuji)',
          'Breastmilk or Formula (for thinning)',
          'Water for steaming'
        ],
        instructions: [
          'Peel, core, and chop the apple into small even cubes.',
          'Steam the cubes in a steamer or small saucepan with a cup of water for about 8-10 minutes until completely tender.',
          'Transfer the soft apple pieces to a blender and puree until absolutely silky, with zero lumps.',
          'Stir in a splash of breastmilk or warm formula to thin it down to a familiar liquid-like consistency.'
        ],
        benefits: 'Extremely easy on the tender digestive system, hypoallergenic, and provides essential dietary fibers.',
        safety: 'Make sure it is processed to a perfect runny puree. Never add honey, salt, or sugar.',
        icon: '🍎'
      },
      {
        id: 'banana_mash',
        name: 'Smooth Creamy Banana Mash',
        localName: 'केला मैश / பிசைந்த வாழைப்பழம்',
        prepTime: '3 mins',
        cookTime: '0 mins',
        ingredients: [
          '1/2 Ripe Banana (with brown spots)',
          '1-2 teaspoons Breastmilk or formula'
        ],
        instructions: [
          'Peel the ripe banana and slice a clean half into a sterile glass bowl.',
          'Use a sterile baby fork to thoroughly mash the banana until completely liquefied and smooth.',
          'Whisk in a little breastmilk or formula to achieve a runny, warm consistency so the baby swallows easily.'
        ],
        benefits: 'Rich in potassium, easily metabolized carbohydrates, and requires absolutely no stove cooking.',
        safety: 'Ensure the banana is completely ripe (with tiny brown speckles) to ensure easy digestion and prevent constipation.',
        icon: '🍌'
      },
      {
        id: 'ragi_kanji_starter',
        name: 'Traditional Thin Ragi Gruel',
        localName: 'रागी कांजी / ராகி கஞ்சி',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '1 teaspoon Pure Sprouted Ragi Powder',
          '1/2 cup Water',
          '1 teaspoon Breastmilk (optional, added at the end)'
        ],
        instructions: [
          'Whisk sprouted ragi powder and water in a small pan until no lumps remain.',
          'Place on medium-low heat and cook, stirring continuously to prevent burning or clotting.',
          'Simmer for 6-8 minutes until the mixture turns glossy and fully cooked.',
          'Let it cool completely to lukewarm temperature. Stir in a teaspoon of breastmilk right before serving.'
        ],
        benefits: 'Packed with calcium, iron, and dietary fiber, forming a sturdy traditional grain starter.',
        safety: 'Always cool down thoroughly. Keep the gruel extremely thin for a 6-month-old starter.',
        icon: '🌾'
      },
      {
        id: 'avocado_silk',
        name: 'Velvety Brain-Boosting Avocado Cream',
        localName: 'एवोकैडो मैश / வெண்ணெய் பழக் கூழ்',
        prepTime: '4 mins',
        cookTime: '0 mins',
        ingredients: [
          '1/4 Ripe Avocado',
          '1 tablespoon Breastmilk or Formula'
        ],
        instructions: [
          'Scoop out the flesh of a perfectly ripe, soft avocado.',
          'Mash it with a fork or strain it through a fine-mesh sterile sieve to remove any stringy pulp.',
          'Blend in warm breastmilk or formula until it reaches a warm, ultra-creamy consistency.'
        ],
        benefits: 'Excellent source of monounsaturated fatty acids (healthy fats) essential for active baby brain development.',
        safety: 'Feed immediately. Avocado oxidizes (turns brown) rapidly once exposed to air.',
        icon: '🥑'
      },
      {
        id: 'pear_puree_silk',
        name: 'Steamed Sweet Pear Silk',
        localName: 'नाशपाती प्यूरी / பேரிக்காய் கூழ்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '1 Ripe Pear (peeled and cored)',
          'Breastmilk or water for thinning'
        ],
        instructions: [
          'Peel pear completely and remove seeds and woody core.',
          'Steam until fork tender for 8 minutes.',
          'Puree in a blender until silky smooth, thinning with breastmilk.'
        ],
        benefits: 'Very mild on the stomach, promotes gentle digestion, and prevents infant constipation.',
        safety: 'Always discard pear skin and seeds before cooking.',
        icon: '🍐'
      },
      {
        id: 'papaya_puree_smooth',
        name: 'Tender Sweet Papaya Purée',
        localName: 'पपीता प्यूरी / பப்பாளி கூழ்',
        prepTime: '4 mins',
        cookTime: '0 mins',
        ingredients: [
          '2 tablespoons Sweet ripe papaya flesh',
          '1 teaspoon Breastmilk'
        ],
        instructions: [
          'Scoop orange flesh from a fully ripe sweet papaya.',
          'Mash with a clean fork and press through a fine sieve.',
          'Add a spoonful of breastmilk and serve immediately.'
        ],
        benefits: 'Rich in vitamin C, vitamin A, and papain enzymes that aid healthy digestion.',
        safety: 'Use only naturally ripe sweet papaya, never semi-ripe or raw papaya.',
        icon: '🍈'
      },
      {
        id: 'rice_kanji_clear',
        name: 'Gentle Clear Rice Kanji Water',
        localName: 'चावल का मांड / அரிசி கஞ்சி நீர்',
        prepTime: '5 mins',
        cookTime: '15 mins',
        ingredients: [
          '2 tablespoons White Rice',
          '1.5 cups Water'
        ],
        instructions: [
          'Boil rice with plenty of water until the grains burst and turn soft.',
          'Strain the rich, starchy broth through a clean muslin cloth.',
          'Serve lukewarm in small sips using a baby spoon.'
        ],
        benefits: 'Extremely soothing starter liquid that is naturally hypoallergenic and calming.',
        safety: 'Strain out all solid rice grains completely. Do not add salt or sugar.',
        icon: '🍚'
      },
      {
        id: 'carrot_water_clear',
        name: 'Sweet Carrot Broth & Thin Purée',
        localName: 'गाजर का अर्क / கேரட் சாறு',
        prepTime: '5 mins',
        cookTime: '12 mins',
        ingredients: [
          '1 Small Red or Orange Carrot (peeled)',
          '1 cup Water'
        ],
        instructions: [
          'Chop carrot into small rounds and steam until melt-in-mouth soft.',
          'Blend with the steaming water until very light and thin.',
          'Strain through a fine strainer to ensure zero lumps.'
        ],
        benefits: 'Loaded with beta-carotene for immune health and ocular eye development.',
        safety: 'Do not add any seasoning. Check temperature on your wrist before feeding.',
        icon: '🥕'
      },
      {
        id: 'pumpkin_soup_thin',
        name: 'Strained Kaddu (Yellow Pumpkin) Broth',
        localName: 'कद्दू का पानी / பூசணி நீர்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Yellow Pumpkin cubes',
          '1 cup Water'
        ],
        instructions: [
          'Steam pumpkin cubes until fork tender.',
          'Blend thoroughly with steaming water until smooth and watery.',
          'Strain through a sieve for a smooth liquid gold starter.'
        ],
        benefits: 'Gentle on little tummies, easy to digest, and mildly sweet naturally.',
        safety: 'Ensure all pumpkin skin and seeds are completely removed beforehand.',
        icon: '🎃'
      },
      {
        id: 'prune_water_puree',
        name: 'Gentle Stewed Prune Juice & Purée',
        localName: 'आलूबुखारा प्यूरी / உலர் பிளம் கூழ்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '2 Dried Pitted Prunes',
          '1/2 cup Warm Water'
        ],
        instructions: [
          'Soak pitted prunes in warm water for 30 minutes until plump.',
          'Simmer for 5 minutes, then blend into a liquid-smooth syrup.',
          'Strain well to remove any fibrous residue.'
        ],
        benefits: 'Natural pediatric remedy for mild constipation and hard stools.',
        safety: 'Serve in small quantities (1-2 teaspoons only).',
        icon: '🫐'
      }
    ]
  },
  {
    id: '6_8_months',
    ageLimit: '6 - 8 Months',
    title: 'First Thick Purées',
    guidelines: 'Introduce 2-3 single-ingredient meals a day. Monitor new ingredients for 3 days to rule out allergic reactions. Avoid cow\'s milk as a beverage, honey, salt, and refined sugars.',
    milestones: [
      'Uses entire hand to grasp or scoop up items (palmar grasp).',
      'Can move foods from the front of the mouth to the back to swallow.',
      'Puts toys and objects directly into the mouth to explore textures.'
    ],
    recipes: [
      {
        id: 'dal_pani',
        name: 'Moong Dal Water (Clear Lentil Soup)',
        localName: 'मूंग दाल का पानी / பருப்பு நீர்',
        prepTime: '5 mins',
        cookTime: '15 mins',
        ingredients: [
          '2 tablespoons Yellow Moong Dal (washed)',
          '1 cup Water',
          'A tiny pinch of Turmeric powder (Haldi)'
        ],
        instructions: [
          'Wash the moong dal thoroughly under clean running water.',
          'Pressure cook or boil the dal with 1 cup of water and turmeric until completely mushy and dissolved (approx 3-4 whistles).',
          'Mash the dal fully inside the hot water, then strain the golden liquid through a clean sieve.',
          'Serve the warm, nutritious lentil broth in a baby cup.'
        ],
        benefits: 'Highly digestible protein broth that is gentle on baby\'s developing digestive tract.',
        safety: 'Serve clear dal water. Do not add any salt, black pepper, or tempering (tadka) at this tender age.',
        icon: '🥣'
      },
      {
        id: 'sweet_potato_puree',
        name: 'Golden Sweet Potato Purée',
        localName: 'शकरकंद प्यूरी / சர்க்கரைவள்ளி கூழ்',
        prepTime: '5 mins',
        cookTime: '12 mins',
        ingredients: [
          '1 Medium Sweet Potato',
          'Water for boiling/steaming',
          'A pinch of roasted Cumin (Jeera) powder'
        ],
        instructions: [
          'Peel and wash the sweet potato, cutting it into small uniform rounds.',
          'Steam or pressure cook until a fork passes through them with absolute ease.',
          'Blend with a small splash of the steaming water and cumin powder to create a comforting, golden, smooth puree.'
        ],
        benefits: 'Rich in beta-carotene, dietary fiber, and Vitamin A, which supports healthy eyesight.',
        safety: 'Ensure the sweet potato has no fibrous hard chunks remaining.',
        icon: '🍠'
      },
      {
        id: 'pumpkin_carrot',
        name: 'Carrot & Pumpkin Velvet Blend',
        localName: 'कद्दू और गाजर प्यूरी / பூசணி கேரட் கலவை',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Chopped Yellow Pumpkin',
          '1/4 cup Chopped Peeled Carrot',
          '1/2 cup Water'
        ],
        instructions: [
          'Clean, peel, and chop the pumpkin and carrots into tiny cubes.',
          'Steam them together until fully softened.',
          'Puree in a blender until smooth. Warm slightly and serve.'
        ],
        benefits: 'Naturally sweet and highly soothing for teething babies. High in antioxidants.',
        safety: 'Only buy fresh pumpkin. Ensure the puree contains no tough fiber threads.',
        icon: '🎃'
      },
      {
        id: 'stewed_pear_puree',
        name: 'Teething Soother Stewed Pear Purée',
        localName: 'पका हुआ नाशपाती प्यूरी / பேரிக்காய் கூழ்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '1 Ripe Pear',
          'Water for steaming'
        ],
        instructions: [
          'Peel the pear, cut it in half, and scoop out the seeds and hard center.',
          'Chop into cubes and steam for 8 minutes until mushy.',
          'Blend or mash thoroughly. Serve lukewarm or cool to soothe sore gums.'
        ],
        benefits: 'Aids bowel movements, gentle on sensitive stomachs, and has high water content.',
        safety: 'Always skin the pear completely as pear skin can be hard to swallow and digest.',
        icon: '🍐'
      },
      {
        id: 'ragi_apple_porridge',
        name: 'Sprouted Ragi & Stewed Apple Porridge',
        localName: 'रागी सेब दलिया / ராகி ஆப்பிள் கூழ்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 tablespoon Sprouted Ragi Flour',
          '1/2 Apple (steamed and puréed)',
          '1 cup Water',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Mix ragi flour in water without lumps.',
          'Cook on low heat stirring constantly for 7 minutes until glossy.',
          'Stir in the steamed apple puree and drop of ghee. Cook for 1 more minute and cool.'
        ],
        benefits: 'Iron and calcium powerhouse combined with natural pectin from apples.',
        safety: 'Ensure ragi is thoroughly cooked to avoid tummy ache.',
        icon: '🌾'
      },
      {
        id: 'oats_banana_mash',
        name: 'Warm Oats & Mashed Banana Porridge',
        localName: 'ओट्स केला मैश / ஓட்ஸ் வாழைப்பழம் கூழ்',
        prepTime: '5 mins',
        cookTime: '7 mins',
        ingredients: [
          '2 tablespoons Powdered Rolled Oats',
          '1/2 Ripe Banana (mashed)',
          '1 cup Water'
        ],
        instructions: [
          'Boil powdered oats with water for 5 minutes until creamy.',
          'Turn off flame and mix in the mashed ripe banana.',
          'Whisk well to form a lump-free breakfast porridge.'
        ],
        benefits: 'Provides steady energy, promotes fullness, and aids sound sleep.',
        safety: 'Never add cow milk before 12 months; use water or breastmilk.',
        icon: '🥣'
      },
      {
        id: 'beetroot_potato_puree',
        name: 'Rosy Beetroot & Potato Purée',
        localName: 'चुकंदर आलू प्यूरी / பீட்ரூட் உருளைக்கிழங்கு கூழ்',
        prepTime: '5 mins',
        cookTime: '12 mins',
        ingredients: [
          '1/4 Beetroot (peeled and diced)',
          '1/2 Small Potato (peeled and diced)',
          'Water for steaming'
        ],
        instructions: [
          'Steam beetroot and potato together until completely tender.',
          'Blend to a smooth, vibrant pink puree with a little warm water.',
          'Serve lukewarm.'
        ],
        benefits: 'High in iron, folate, and potassium with a vibrant natural color.',
        safety: 'Introduce in small quantities as beetroot is earthy and fibrous.',
        icon: '🥔'
      },
      {
        id: 'lauki_moong_soup',
        name: 'Gentle Bottle Gourd (Lauki) & Moong Soup',
        localName: 'लौकी मूंग का सूप / சுரைக்காய் பாசிப்பருப்பு சூப்',
        prepTime: '5 mins',
        cookTime: '12 mins',
        ingredients: [
          '1/2 cup Peeled Lauki cubes',
          '1 tablespoon Yellow Moong Dal',
          'Pinch of Cumin powder'
        ],
        instructions: [
          'Pressure cook lauki and moong dal with 1 cup water for 3 whistles.',
          'Blend and strain into a silky, comforting soup.',
          'Stir in a pinch of roasted jeera powder.'
        ],
        benefits: 'Cooling, extremely easy to digest, and hydrates the body naturally.',
        safety: 'Taste the lauki raw beforehand to ensure it is not bitter.',
        icon: '🥒'
      },
      {
        id: 'spinach_potato_mash',
        name: 'Mild Palak & Potato Purée',
        localName: 'पालक आलू प्यूरी / கீரை உருளைக்கிழங்கு கூழ்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '5-6 Fresh washed Spinach leaves',
          '1/2 Small Boiled Potato',
          'Pinch of roasted Cumin'
        ],
        instructions: [
          'Blanch clean spinach leaves in boiling water for 2 minutes and cool immediately.',
          'Blend blanched spinach with boiled potato and cumin into a silky green mash.',
          'Warm gently before serving.'
        ],
        benefits: 'Packed with plant-based iron, magnesium, and dietary fiber.',
        safety: 'Blanch spinach quickly to preserve nutrients without turning bitter.',
        icon: '🥬'
      },
      {
        id: 'apple_cinnamon_stew',
        name: 'Warm Spiced Stewed Apple Mash',
        localName: 'दालचीनी सेब मैश / இலவங்கப்பட்டை ஆப்பிள் மசியல்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 Sweet Apple (peeled & diced)',
          'A tiny speck of Ceylon Cinnamon powder',
          '1/2 cup Water'
        ],
        instructions: [
          'Cook chopped apple with water on medium heat until mushy.',
          'Add a microscopic speck of true Ceylon cinnamon powder.',
          'Mash finely with a fork and serve warm.'
        ],
        benefits: 'Cinnamon adds gentle warmth and natural aromatics to expand palate.',
        safety: 'Use only a tiny hint of cinnamon powder; avoid cassia cinnamon.',
        icon: '🍏'
      }
    ]
  },
  {
    id: '8_10_months',
    ageLimit: '8 - 10 Months',
    title: 'Mashed & Soft Textures',
    guidelines: 'Progress from smooth purees to lumpy, thick mashes. Introduce multiple ingredient mixes. Encourage grabbing soft foods with fingers. Introduce curd (yogurt) and well-cooked pulses.',
    milestones: [
      'Begins using the pincer grasp (thumb and index finger) to pick up objects.',
      'Attempts to chew lumpy foods, moving jaw up and down.',
      'Can sit independently in a high chair with ease.'
    ],
    recipes: [
      {
        id: 'baby_khichdi',
        name: 'Baby\'s First Ghee Khichdi',
        localName: 'शिशु मूंग दाल खिचड़ी / பருப்பு கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '2 tablespoons Rice',
          '1 tablespoon Yellow Moong Dal',
          'A tiny pinch of Turmeric',
          '1/4 teaspoon Pure Desi Ghee',
          '1.5 cups Water'
        ],
        instructions: [
          'Wash the rice and lentil together and soak in warm water for 15 minutes.',
          'In a pressure cooker, add the soaked rice, dal, water, and turmeric.',
          'Cook for 4-5 whistles until the grains are extremely soft and over-cooked.',
          'Mash it well with a clean heavy ladle and stir in the pure ghee. Serve lukewarm.'
        ],
        benefits: 'A complete protein meal providing balanced amino acids, easily digestible carbs, and healthy fats.',
        safety: 'Gently mash the lentils. Do not leave whole grains or hard skins. Keep it moist.',
        icon: '🍲'
      },
      {
        id: 'suji_kheer',
        name: 'Golden Ghee-Roasted Suji Porridge',
        localName: 'सूजी हलवा / ரவா கஞ்சி',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 tablespoon Semolina (Suji)',
          '1/4 teaspoon Ghee',
          '1 cup Water',
          '2 tablespoons fresh Apple Purée (for natural sweetness)'
        ],
        instructions: [
          'Heat ghee in a pan, add suji, and roast on low heat until it turns aromatic and slightly golden.',
          'Slowly pour in the water, whisking vigorously to avoid any lumps.',
          'Cook on low heat for 5 minutes until it thickens into a soft paste.',
          'Turn off the stove. Whisk in the apple puree for natural fruity sweetness.'
        ],
        benefits: 'Calorie-dense starter, roasted semolina is easily digested and satisfying.',
        safety: 'Do not add white sugar. Rely purely on the natural sweetness of cooked apples or pears.',
        icon: '🥣'
      },
      {
        id: 'curd_idli',
        name: 'Yogurt Mashed Idli Bites',
        localName: 'दही इडली मैश / தயிர் இட்லி மசியல்',
        prepTime: '5 mins',
        cookTime: '5 mins',
        ingredients: [
          '1 Soft Steamed Idli',
          '3 tablespoons fresh home-made curd (yogurt)',
          'A tiny pinch of roasted Cumin (Jeera) powder'
        ],
        instructions: [
          'Crumble the soft steamed idli thoroughly in a sterile baby bowl.',
          'Pour in fresh, non-sour whisked yogurt and cumin powder.',
          'Mash it with a spoon until it forms a soft, lumpy, comforting mix.'
        ],
        benefits: 'Excellent source of natural probiotics for healthy gut bacteria, calcium, and protein.',
        safety: 'Ensure the curd is fresh and not sour, which could upset the baby\'s throat or stomach.',
        icon: '💿'
      },
      {
        id: 'avocado_egg_yolk',
        name: 'Brain-Growth Egg Yolk & Avocado Mash',
        localName: 'अंडे की जर्दी और एवोकैडो / முட்டை மஞ்சள்கரு வெண்ணெய் பழ மசியல்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 Hard-Boiled Egg Yolk (Only yellow)',
          '1/4 Ripe Avocado'
        ],
        instructions: [
          'Boil an egg for 10-12 minutes until fully hard. Peel and separate the yellow yolk (discard white for now).',
          'Mash the hot egg yolk together with ripe avocado in a bowl.',
          'Stir in a drop of hot water or breastmilk to make the texture soft and moist.'
        ],
        benefits: 'Packed with iron, DHA, and Choline which are critical for rapid cognitive and nervous system development.',
        safety: 'Avoid egg whites until 10-12 months as they are more likely to trigger allergic reactions. Cook yolk thoroughly.',
        icon: '🥚'
      },
      {
        id: 'paneer_vegetable_mash',
        name: 'Soft Paneer & Boiled Pea Mash',
        localName: 'पनीर और मटर मैश / பன்னீர் பட்டாணி மசியல்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '2 tablespoons Fresh Crumbled Paneer',
          '2 tablespoons Sweet Green Peas (boiled soft)',
          '1/4 teaspoon Ghee',
          'Pinch of Cumin powder'
        ],
        instructions: [
          'Boil green peas until they squish effortlessly between fingers.',
          'Mash peas with paneer, warm ghee, and cumin in a bowl.',
          'Serve as a chunky, soft textured meal.'
        ],
        benefits: 'Rich in protein, calcium, and vitamins essential for bone growth.',
        safety: 'Squish all peas flat so none remain round whole spheres.',
        icon: '🧀'
      },
      {
        id: 'ragi_banana_sheera',
        name: 'Ghee-Roasted Ragi Sheera',
        localName: 'रागी शीरा / ராகி சீரா',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '2 tablespoons Ragi flour',
          '1/2 Ripe Banana (mashed)',
          '1/2 teaspoon Ghee',
          '1 cup Water'
        ],
        instructions: [
          'Roast ragi flour in ghee over gentle heat until fragrant.',
          'Add water slowly while stirring to avoid any lumps.',
          'Cook until thick and glossy. Fold in mashed banana and serve lukewarm.'
        ],
        benefits: 'Wholesome combination of iron, calcium, and natural carbs.',
        safety: 'Do not add sugar or jaggery at this age stage.',
        icon: '🌾'
      },
      {
        id: 'moong_dal_chawal',
        name: 'Soft Mashed Moong Dal Chawal with Jeera Ghee',
        localName: 'दाल चावल मिक्सी / பருப்பு சாதம்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '2 tablespoons White Rice',
          '2 tablespoons Moong dal',
          '1/4 teaspoon Ghee infused with roasted jeera',
          'Pinch of Turmeric'
        ],
        instructions: [
          'Pressure cook rice and moong dal together with turmeric until super soft.',
          'Mash with a ladle to a thick, porridge-like consistency.',
          'Mix in cumin-scented ghee and serve warm.'
        ],
        benefits: 'Comforting, traditional Indian staple promoting muscle growth and digestion.',
        safety: 'Ensure rice grains are soft enough to be squashed with gentle tongue pressure.',
        icon: '🍛'
      },
      {
        id: 'steamed_carrot_sticks',
        name: 'Tender Steamed Carrot & Zucchini Soft Sticks',
        localName: 'उबली गाजर स्टिक्स / கேரட் விரல் துண்டுகள்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1 Carrot cut into thick finger-length batons',
          '1/2 Zucchini cut into batons',
          'Water for steaming'
        ],
        instructions: [
          'Cut vegetables into thick finger-sized batons.',
          'Steam until completely tender and squishable between thumb and forefinger.',
          'Allow to cool slightly and present for self-feeding exploration.'
        ],
        benefits: 'Encourages the development of independent pincer grasp and chewing confidence.',
        safety: 'Must be soft enough to smash easily with your fingers; never serve hard carrots.',
        icon: '🥕'
      },
      {
        id: 'mashed_dalia_khichdi',
        name: 'Broken Wheat (Dalia) & Veggie Mash',
        localName: 'दलिया खिचड़ी / கோதுமை ரவை கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '2 tablespoons Roasted Dalia (Broken Wheat)',
          '1 tablespoon Yellow Moong dal',
          '1 tablespoon Finely chopped carrot',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Pressure cook dalia, moong dal, and carrots with 1.5 cups water for 4 whistles.',
          'Mash thoroughly with the back of a ladle.',
          'Stir in ghee and serve warm.'
        ],
        benefits: 'High dietary fiber helps regulate bowel movements and gut flora.',
        safety: 'Ensure dalia is well-cooked and soft, not chewy.',
        icon: '🌾'
      },
      {
        id: 'sweet_potato_methi_mash',
        name: 'Sweet Potato & Fresh Methi Leaf Mash',
        localName: 'शकरकंद मेथी मैश / சர்க்கரைவள்ளி வெந்தயக்கீரை மசியல்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 Sweet Potato (peeled & cubed)',
          '1 tablespoon Tender Methi (fenugreek) leaves (finely chopped)',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Steam sweet potato cubes and methi leaves together until sweet potato is mushy.',
          'Mash with a fork, blending sweet and slightly earthy green flavors.',
          'Stir in ghee and serve.'
        ],
        benefits: 'Introduces mildly earthy greens balanced by natural sweet potato sugars.',
        safety: 'Use only tender methi leaves, finely chopped, avoiding tough stems.',
        icon: '🍠'
      }
    ]
  },
  {
    id: '10_12_months',
    ageLimit: '10 - 12 Months',
    title: 'Chunky Finger Foods',
    guidelines: 'Transition to soft-chopped table foods. Encourage self-feeding with fingers. Baby can chew soft solid lumps with their gums. Continue offering a wide variety of flavors.',
    milestones: [
      'Picks up small foods easily and feeds self with precision.',
      'Can chew soft foods like boiled potatoes, soft carrots, and pasta easily.',
      'Shows preference for specific tastes and tries to grab parents\' spoons.'
    ],
    recipes: [
      {
        id: 'jeera_paneer',
        name: 'Soft Jeera Paneer Bites',
        localName: 'जीरा पनीर / சீரக பன்னீர் துண்டுகள்',
        prepTime: '5 mins',
        cookTime: '5 mins',
        ingredients: [
          '50g Fresh Soft Paneer or Tofu',
          '1/4 teaspoon Butter or Ghee',
          'A tiny pinch of Cumin (Jeera) powder',
          'A pinch of Turmeric'
        ],
        instructions: [
          'Cut paneer into small, child-friendly cubes (easy to hold with tiny fingers).',
          'Heat ghee in a pan and toss the paneer cubes gently for 1-2 minutes until warm and soft.',
          'Sprinkle cumin and turmeric powder. Let it cool slightly before serving.'
        ],
        benefits: 'Fabulous source of calcium, healthy fats, and protein. Soft texture is perfect for teething gums.',
        safety: 'Do not fry the paneer until hard or crispy, keep it melt-in-the-mouth soft.',
        icon: '🧀'
      },
      {
        id: 'banana_oats_pancake',
        name: 'Banana & Oats Mini Pancakes',
        localName: 'केला ओट्स पैनकेक / வாழைப்பழம் ஓட்ஸ் பான்கேக்',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '2 tablespoons Powdered Rolled Oats',
          '1/2 Ripe Banana (mashed)',
          '3-4 tablespoons Milk or water',
          'A drop of Ghee for frying'
        ],
        instructions: [
          'In a bowl, mix powdered oats, mashed banana, and milk into a thick pourable batter.',
          'Grease a non-stick griddle with a tiny bit of ghee.',
          'Pour small silver-dollar sized pancakes and cook on low heat for 2-3 minutes per side until fully cooked and soft.',
          'Break into small bite-sized pieces and serve.'
        ],
        benefits: 'High fiber, complex carbs for steady energy, and naturally sweet without sugar.',
        safety: 'Make sure the pancake is soft and moist, serve in tiny hand-held pieces.',
        icon: '🥞'
      },
      {
        id: 'carrot_cheela',
        name: 'Soft Besan Carrot Cheela',
        localName: 'बेसन गाजर चीला / கடலை மாவு கேரட் அடை',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '3 tablespoons Besan (Gram Flour)',
          '2 tablespoons Finely Grated Carrot',
          'A pinch of Turmeric and Cumin powder',
          'Water to make batter',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Whisk gram flour, grated carrot, spices, and water into a thin smooth batter.',
          'Heat a pan with ghee, pour a thin ladles-worth of batter, and spread gently.',
          'Cook on medium heat until golden brown on both sides. Ensure the grated carrot is fully softened.'
        ],
        benefits: 'High protein, iron, and loaded with essential beta-carotenes from the grated carrots.',
        safety: 'Grate carrots extremely fine so they do not pose a choking hazard.',
        icon: '🍳'
      },
      {
        id: 'dahi_rice',
        name: 'Soothing Creamy Curd Rice',
        localName: 'दही चावल / தயிர் சாதம்',
        prepTime: '5 mins',
        cookTime: '5 mins',
        ingredients: [
          '1/2 cup Well-cooked Rice (mashed)',
          '3 tablespoons Fresh Yogurt',
          '1 teaspoon Milk (to reduce sourness)',
          'A tiny pinch of Cumin powder'
        ],
        instructions: [
          'Mash hot cooked rice thoroughly with the back of a spoon until completely mushy.',
          'Let it cool, then mix in yogurt, milk, and a tiny pinch of cumin powder.',
          'Stir into a creamy, smooth spoonable dish.'
        ],
        benefits: 'Provides cooling relief for teething inflammation, is easily digestible, and supports gut health.',
        safety: 'Never serve ice-cold. Keep it at comfortable room temperature.',
        icon: '🍚'
      },
      {
        id: 'steamed_vegetable_idli',
        name: 'Mini Tricolor Veggie Idlis',
        localName: 'सब्जी इडली / மினி காய்கறி இட்லி',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Fermented Idli Batter',
          '1 tablespoon Finely grated carrot',
          '1 tablespoon Finely grated beetroot',
          'Drop of Ghee'
        ],
        instructions: [
          'Divide batter into two portions: stir carrot into one, beetroot into the other.',
          'Pour into greased mini-idli moulds.',
          'Steam for 8-10 minutes until fluffy. Cut into quarters for finger food.'
        ],
        benefits: 'Fermented grains aid digestion while colorful veggies add micronutrients.',
        safety: 'Cut mini idlis into bite-sized quarters so baby cannot choke.',
        icon: '⚪'
      },
      {
        id: 'moong_chilla_strips',
        name: 'Sprouted Moong Chilla Finger Strips',
        localName: 'मूंग चीला स्ट्रिप्स / பாசிப்பயறு தோசை துண்டுகள்',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '1/2 cup Soaked Moong Dal paste',
          'Pinch of Cumin and Turmeric',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Grind soaked moong into a smooth batter with water and cumin.',
          'Spread thinly on a hot tawa with a drizzle of ghee.',
          'Cook until tender and soft on both sides, then slice into finger strips.'
        ],
        benefits: 'Power-packed plant protein with minimal fat, ideal for self-feeding.',
        safety: 'Keep the chilla soft and thin so it melts in the mouth without catching.',
        icon: '🫓'
      },
      {
        id: 'soft_poha_veggie',
        name: 'Soft Mild Veggie Poha',
        localName: 'नरम पोहा / மென்மையான அவல் கிச்சடி',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '1/2 cup Thick Poha (flattened rice, washed soft)',
          '2 tablespoons Boiled green peas & grated carrot',
          'Pinch of Turmeric & Cumin',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Wash poha in a colander until completely softened and soaked.',
          'Heat ghee, add cumin, turmeric, and boiled veggies.',
          'Toss softened poha gently and steam covered for 2 minutes.'
        ],
        benefits: 'Light, iron-rich, and easy for developing teeth to chew.',
        safety: 'Ensure poha is moist and soft, never dry or flaky.',
        icon: '🌾'
      },
      {
        id: 'egg_yolk_scramble_soft',
        name: 'Soft Butter Egg Scramble with Turmeric',
        localName: 'अंडा भुर्जी / மென்மையான முட்டை பொரியல்',
        prepTime: '3 mins',
        cookTime: '5 mins',
        ingredients: [
          '1 Egg (whisked)',
          '1 teaspoon Butter or Ghee',
          'Pinch of Turmeric powder'
        ],
        instructions: [
          'Whisk egg thoroughly with turmeric and a tablespoon of water.',
          'Melt butter in a small pan over very low heat.',
          'Pour egg and gently stir until velvety soft curds form; do not overcook.'
        ],
        benefits: 'High biological value protein, choline for brain development, and vitamins.',
        safety: 'Ensure eggs are fully cooked through, but soft and custard-like.',
        icon: '🍳'
      },
      {
        id: 'sweet_potato_tikki',
        name: 'Baked Sweet Potato & Green Pea Patty',
        localName: 'शकरकंद टिक्की / சர்க்கரைவள்ளி கட்லெட்',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Boiled mashed sweet potato',
          '2 tablespoons Mashed green peas',
          '1 tablespoon Roasted oats flour for binding',
          'Drop of Ghee'
        ],
        instructions: [
          'Mix sweet potato, mashed peas, and oats flour into a soft dough.',
          'Shape into small toddler patties.',
          'Pan-sear in ghee on low heat until golden on both sides.'
        ],
        benefits: 'High dietary fiber and beta-carotene with a delicious natural sweetness.',
        safety: 'Make sure the crust remains soft, not brittle or hard.',
        icon: '🧆'
      },
      {
        id: 'mango_hung_curd',
        name: 'Fresh Mango & Hung Curd Swirl',
        localName: 'आम श्रीखंड / மாம்பழ தயிர் மசியல்',
        prepTime: '5 mins',
        cookTime: '0 mins',
        ingredients: [
          '3 tablespoons Fresh thick hung curd',
          '2 tablespoons Fresh sweet ripe mango purée',
          'Pinch of Cardamom powder'
        ],
        instructions: [
          'Whisk hung curd and fresh sweet mango puree until creamy.',
          'Sprinkle a tiny hint of cardamom powder.',
          'Serve at room temperature.'
        ],
        benefits: 'Packed with gut-friendly probiotics, protein, and vitamin A.',
        safety: 'Use only sweet naturally ripe mangoes, avoiding sour fruits.',
        icon: '🥭'
      }
    ]
  },
  {
    id: '12_24_months',
    ageLimit: '1 - 2 Years',
    title: 'Toddler Table Foods',
    guidelines: 'Transition to standard family table foods. Cow\'s milk can be introduced as a beverage. Honey, pinch of salt, and mild spices are safe. Offer 3 meals and 2 healthy snacks daily.',
    milestones: [
      'Feeds self independently with a spoon, though still messy.',
      'Has many teeth, can chew and tear varying solid food textures.',
      'Enjoys mimicking parents\' eating actions and drinking from an open cup.'
    ],
    recipes: [
      {
        id: 'veggie_upma',
        name: 'Mild Savory Vegetable Upma',
        localName: 'सब्जी उपमा / காய்கறி உப்புமா',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '3 tablespoons Semolina (Rava)',
          '1 tablespoon Finely chopped boiled Peas & Carrots',
          '1/4 teaspoon Ghee',
          'A pinch of Mustard seeds and Curry leaf',
          '1/4 teaspoon Salt'
        ],
        instructions: [
          'Dry roast rava in a pan on low heat until slightly fragrant. Set aside.',
          'Heat ghee, add mustard seeds and a curry leaf. Add chopped veggies and sauté.',
          'Pour in 1 cup of water and salt, bringing it to a boil.',
          'Slowly add rava while stirring continuously to prevent clumps. Cover and cook on low for 3 mins.'
        ],
        benefits: 'Iron-rich, easy-to-chew savory cereal filled with colorful, vitamins-loaded veggies.',
        safety: 'Chop peas and carrots into tiny, soft-boiled pieces. Remove curry leaf before serving.',
        icon: '🌾'
      },
      {
        id: 'aloo_paratha',
        name: 'Soft Ghee-brushed Aloo Paratha',
        localName: 'नरम आलू पराठा / மென்மையான உருளைக்கிழங்கு பரோட்டா',
        prepTime: '15 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Whole Wheat Flour',
          '1/4 cup Boiled Mashed Potato',
          'A pinch of Cumin powder, Coriander powder, and Salt',
          '1/2 teaspoon Ghee'
        ],
        instructions: [
          'Knead flour and water into a very soft dough. Rest for 10 minutes.',
          'Mash the potato with a pinch of cumin, coriander, and salt.',
          'Roll out a small dough ball, stuff with potato, roll gently, and roast on hot tawa brushing with ghee until soft and golden.'
        ],
        benefits: 'Packed with clean carbohydrates, healthy fats, and dietary fiber for energetic toddlers.',
        safety: 'Brush with ghee to keep it very soft. Cut into thin, manageable strips for easy self-feeding.',
        icon: '🫓'
      },
      {
        id: 'berry_oats',
        name: 'Creamy Oats & Berry Porridge',
        localName: 'ओट्स और बेरी दलिया / ஓட்ஸ் பெர்ரி கஞ்சி',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '3 tablespoons Rolled Oats',
          '1/2 cup Milk (Cow\'s milk or Breastmilk)',
          '1 tablespoon Finely chopped Strawberries/Blueberries',
          '1/2 teaspoon Honey or Jaggery (Optional)'
        ],
        instructions: [
          'Cook oats in milk and water over medium heat for 5-6 minutes until soft and creamy.',
          'Stir in the finely chopped berries and honey.',
          'Let it simmer for 1 more minute, then cool and serve warm.'
        ],
        benefits: 'High in antioxidants, calcium, and beta-glucan fiber which helps sustain energy.',
        safety: 'Honey is now perfectly safe for toddlers over 12 months. Do not feed honey to babies under 1 year.',
        icon: '🥣'
      },
      {
        id: 'mini_uttapam',
        name: 'Mini Steamed Veggie Uttapams',
        localName: 'मिनी उत्तपम / மினி ஊத்தப்பம்',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '1/2 cup fermented Dosa Batter',
          '2 tablespoons finely grated carrot and beetroot',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Heat a griddle and grease with ghee. Pour small circles of dosa batter.',
          'Sprinkle the grated carrots and beets on top of each mini pancake.',
          'Drizzle ghee, flip, and cook well on both sides until soft and spongy.'
        ],
        benefits: 'Fermented foods are wonderful for digestion and gut flora. Spongy texture is fun to hold.',
        safety: 'Ensure veggies are finely grated so they cook thoroughly and become soft.',
        icon: '🥞'
      },
      {
        id: 'palak_paneer_rice',
        name: 'Mild Palak Paneer with Soft Steamed Rice',
        localName: 'पालक पनीर चावल / பாலக் பன்னீர் சாதம்',
        prepTime: '10 mins',
        cookTime: '12 mins',
        ingredients: [
          '1/2 cup Boiled Rice',
          '1/4 cup Mild Spinach Purée',
          '2 tablespoons Soft Paneer cubes',
          '1/4 teaspoon Ghee and pinch of Cumin'
        ],
        instructions: [
          'Warm ghee in a pan, toss paneer cubes and spinach puree gently.',
          'Stir in soft cooked rice and a pinch of salt.',
          'Simmer for 2 minutes and serve warm with a spoonful of yogurt.'
        ],
        benefits: 'Rich in iron, vitamin K, and bone-building calcium.',
        safety: 'Ensure paneer cubes are soft and manageable for toddler teeth.',
        icon: '🍛'
      },
      {
        id: 'sprouted_ragi_dosa',
        name: 'Crispy Sprouted Ragi & Ghee Dosa',
        localName: 'रागी डोसा / ராகி தோசை',
        prepTime: '5 mins',
        cookTime: '6 mins',
        ingredients: [
          '1/2 cup Sprouted Ragi flour and rice batter',
          '1/2 teaspoon Ghee',
          'Pinch of Salt'
        ],
        instructions: [
          'Mix ragi batter with a pinch of salt and water to pouring consistency.',
          'Pour thin circle on a hot tawa and drizzle ghee.',
          'Flip when golden and serve with mild coconut chutney.'
        ],
        benefits: 'Superior calcium content builds strong toddler bones and teeth.',
        safety: 'Serve rolled or cut into strips for easy handling.',
        icon: '🌯'
      },
      {
        id: 'methi_thepla_soft',
        name: 'Soft Gujarati Methi Thepla Strips',
        localName: 'मेथी थेपला / வெந்தயக்கீரை சப்பாத்தி',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '1/2 cup Whole wheat flour',
          '2 tablespoons Finely chopped fresh Methi leaves',
          '1 tablespoon Fresh curd (for softness)',
          'Pinch of Turmeric, Cumin, and Ghee'
        ],
        instructions: [
          'Knead flour, methi, curd, and spices into a very soft pliable dough.',
          'Roll thin and roast quickly on high heat brushing with ghee so it remains super soft.',
          'Cut into finger strips.'
        ],
        benefits: 'Fenugreek leaves provide iron, minerals, and aid healthy gut digestion.',
        safety: 'Cook quickly on hot tawa so it stays tender and does not harden.',
        icon: '🫓'
      },
      {
        id: 'rajma_mashed_bowl',
        name: 'Soft Stewed Rajma & Rice Bowl',
        localName: 'राजमा चावल / ராஜ்மா சாதம்',
        prepTime: '10 mins',
        cookTime: '20 mins',
        ingredients: [
          '1/4 cup Overcooked soft Rajma (Kidney beans)',
          '1/2 cup Soft steamed rice',
          '1/4 teaspoon Ghee and pinch of Cumin'
        ],
        instructions: [
          'Pressure cook soaked rajma until totally soft and squishy.',
          'Mash beans slightly with gravy and fold into warm rice with ghee.',
          'Serve at a warm, pleasant temperature.'
        ],
        benefits: 'Excellent source of complex carbs, zinc, and muscle-strengthening plant protein.',
        safety: 'Always mash the kidney beans so no tough skins or round shapes remain.',
        icon: '🥣'
      },
      {
        id: 'vegetable_dalia_khichdi',
        name: 'Wholesome Cracked Wheat Veggie Khichdi',
        localName: 'दलिया वेज खिचड़ी / கோதுமை ரவை கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '1/4 cup Roasted Dalia',
          '2 tablespoons Moong Dal',
          '2 tablespoons Chopped beans & carrots',
          '1/2 teaspoon Ghee'
        ],
        instructions: [
          'Pressure cook dalia, dal, and vegetables with water for 3-4 whistles.',
          'Open cooker and stir vigorously with ghee to create a comforting thick porridge.',
          'Serve with fresh home curd.'
        ],
        benefits: 'Sustained energy release without glycemic spikes, keeping toddlers active.',
        safety: 'Cook until cracked wheat is soft and fluffy.',
        icon: '🍲'
      },
      {
        id: 'banana_walnut_muffin',
        name: 'Jaggery Sweetened Whole Wheat Banana Muffin',
        localName: 'केला मफिन / வாழைப்பழம் மஃபின்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '1/2 cup Whole wheat flour',
          '1 Ripe Banana (mashed)',
          '1 tablespoon Jaggery powder',
          '1 tablespoon Melted butter or Ghee',
          '1/4 cup Milk'
        ],
        instructions: [
          'Whisk mashed banana, jaggery, and melted butter together.',
          'Fold in flour and milk to make a thick batter.',
          'Spoon into muffin cups and steam or bake for 15 minutes until spongy.'
        ],
        benefits: 'Completely refined-sugar free snack loaded with potassium and wholesome grains.',
        safety: 'Let muffins cool completely before offering in bite sizes.',
        icon: '🧁'
      }
    ]
  },
  {
    id: '24_36_months',
    ageLimit: '2 - 3 Years',
    title: 'Independent Eating',
    guidelines: 'Toddlers eat 3 meals and 2-3 snacks daily. Encourage using kid-friendly forks and spoons. Offer varying food textures and diverse flavor profiles. Involve them in safe kitchen prep.',
    milestones: [
      'Uses child cutlery with decent control.',
      'Chews complex textures (like meats, raw fruits, and rotis) with ease.',
      'Vocalizes clear opinions on likes and dislikes, showing active independence.'
    ],
    recipes: [
      {
        id: 'cheese_dosa_roll',
        name: 'Multi-Grain Cheesy Dosa Roll',
        localName: 'चीज डोसा रोल / சீஸ் தோசை சுருள்',
        prepTime: '10 mins',
        cookTime: '5 mins',
        ingredients: [
          '1/2 cup Multi-Grain (Ragi, Oats, Rice) Batter',
          '1 tablespoon Grated Mild Cheddar or Paneer',
          '1/4 teaspoon Butter'
        ],
        instructions: [
          'Spread multi-grain batter on a hot tawa into a circular thin crepe.',
          'Add butter and let it cook until golden. Sprinkle cheese evenly on top.',
          'Once cheese melts, roll the dosa into a tight cylinder and slice into bite-sized pinwheels.'
        ],
        benefits: 'High calcium, iron, and energy dense. The fun "pinwheel" shape makes it highly appealing to toddlers.',
        safety: 'Let it cool down slightly so the melted cheese inside does not burn the child\'s mouth.',
        icon: '🌯'
      },
      {
        id: 'veggie_pulao',
        name: 'Rainbow Veggie Garden Pulao',
        localName: 'वेजिटेबल पुलाव / காய்கறி புலாவ்',
        prepTime: '15 mins',
        cookTime: '15 mins',
        ingredients: [
          '1/2 cup Basmati Rice (washed and soaked)',
          '1/4 cup Mixed Veggies (soft peas, finely chopped carrots, sweet corn)',
          'A pinch of mild spices (Cardamom, Cumin, tiny Cinnamon stick)',
          '1 teaspoon Ghee',
          'Water as needed'
        ],
        instructions: [
          'Heat ghee in a pressure cooker. Add cardamom and cumin.',
          'Add veggies and sauté for 2 minutes. Stir in the soaked rice and water.',
          'Pressure cook for 2 whistles. Fluff with a fork and serve with yogurt.'
        ],
        benefits: 'Aromatic, highly visual with vibrant veggies, teaches texture chewing, and is highly nutritious.',
        safety: 'Ensure sweet corn or whole peas are cooked extremely soft to prevent choking.',
        icon: '🍚'
      },
      {
        id: 'dates_laddus',
        name: 'No-Sugar Dates & Oats Energy Balls',
        localName: 'खजूर और ओट्स लड्डू / பேரீச்சம்பழ லட்டு',
        prepTime: '10 mins',
        cookTime: '5 mins',
        ingredients: [
          '1/2 cup Soft Pitted Dates',
          '1/4 cup Toasted powdered Oats',
          '1 tablespoon powdered Almonds/Cashews',
          '1/2 teaspoon Ghee'
        ],
        instructions: [
          'Grind pitting dates in a food processor to form a sticky paste.',
          'Heat ghee in a pan, lightly toast oats and nut powder for 2 minutes.',
          'Mix date paste with roasted oats and nuts. Roll into tiny, bite-sized balls.'
        ],
        benefits: 'Iron-rich, high fiber, completely sugar-free natural sweet treat that provides instant energy.',
        safety: 'Form small balls that are easily chewable. Ensure almonds are fully powdered with no large shards.',
        icon: '🧆'
      },
      {
        id: 'beetroot_idli',
        name: 'Steamed Pink Beetroot Mini Idlis',
        localName: 'चुकंदर इडली / பீட்ரூட் மினி இட்லி',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Idli Batter',
          '2 tablespoons Fresh Beetroot juice (extracted by grating & squeezing)',
          'A drop of Ghee for greasing'
        ],
        instructions: [
          'Whisk beetroot juice into the idli batter to turn it a beautiful, bright pink.',
          'Grease a mini-idli plate with ghee and pour the pink batter.',
          'Steam for 8-10 minutes until spongy. Serve with mild coconut chutney.'
        ],
        benefits: 'Rich in dietary nitrates, potassium, and folate. The fun pink color entices picky eaters.',
        safety: 'Ensure the idlis are fluffy and soft. Serve in bite-sized pieces.',
        icon: '🔴'
      },
      {
        id: 'paneer_kathi_roll',
        name: 'Soft Whole Wheat Paneer Kathi Roll',
        localName: 'पनीर काठी रोल / பன்னீர் சுருள் ரோல்',
        prepTime: '10 mins',
        cookTime: '8 mins',
        ingredients: [
          '1 Thin Whole Wheat Roti',
          '1/4 cup Soft sautéed paneer fingers & finely shredded capsicum',
          '1 tablespoon Mild mint yogurt dip',
          '1/4 teaspoon Ghee'
        ],
        instructions: [
          'Sauté paneer fingers and bell pepper lightly with cumin and a pinch of salt.',
          'Spread mint yogurt dip on a warm soft whole wheat roti.',
          'Place paneer in center, roll tightly into a wrap, and cut diagonally.'
        ],
        benefits: 'High protein and calcium wrapped in a fun handheld format that kids love.',
        safety: 'Ensure roti is soft and veggies are cooked tender.',
        icon: '🌯'
      },
      {
        id: 'ragi_cacao_pancake',
        name: 'Ragi & Raw Cacao Fluffy Pancakes',
        localName: 'रागी चॉकलेट पैनकेक / ராகி சாக்லேட் பான்கேக்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        ingredients: [
          '1/4 cup Sprouted Ragi flour',
          '1/4 cup Wheat flour',
          '1 teaspoon Raw unsweetened Cacao powder',
          '1 tablespoon Jaggery powder',
          '1/2 cup Milk'
        ],
        instructions: [
          'Whisk dry flours, cacao, jaggery, and milk into a smooth batter.',
          'Ladle small pancakes onto a buttered griddle.',
          'Cook for 2 minutes on each side until puffed and soft.'
        ],
        benefits: 'Delivers high iron and calcium masked with chocolatey goodness without refined sugar.',
        safety: 'Use pure unsweetened cacao powder, not caffeinated cocoa or chocolate syrup.',
        icon: '🥞'
      },
      {
        id: 'vegetable_cutlet_tawa',
        name: 'Tawa Crisp Mixed Vegetable & Oats Cutlets',
        localName: 'वेज कटलेट / காய்கறி கட்லெட்',
        prepTime: '15 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Boiled mashed potatoes, carrots & peas',
          '3 tablespoons Roasted oats powder',
          'Pinch of Cumin and Chaat masala',
          '1 teaspoon Ghee'
        ],
        instructions: [
          'Mix boiled mashed vegetables with oats powder and mild spices.',
          'Form into heart or star shapes with cookie cutters.',
          'Shallow pan-sear in ghee until golden on both sides.'
        ],
        benefits: 'Fun shapes engage picky toddlers while sneaking in 3 distinct vegetables and fiber.',
        safety: 'Ensure the crust is soft-crisp, not hard or sharp.',
        icon: '⭐'
      },
      {
        id: 'curd_vermicelli_upma',
        name: 'Roasted Semi-dry Vermicelli (Seviyan) Upma',
        localName: 'सेवई उपमा / சேமியா உப்புமா',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Roasted whole wheat vermicelli',
          '2 tablespoons Finely diced carrots and peas',
          '1/4 teaspoon Mustard seeds and Ghee',
          '1 cup Water'
        ],
        instructions: [
          'Sauté mustard seeds and veggies in ghee.',
          'Add water and bring to a boil.',
          'Add roasted vermicelli, cover, and simmer for 5 minutes until water is absorbed and noodles are tender.'
        ],
        benefits: 'Fun noodle-like texture that toddlers can enjoy practicing with child forks.',
        safety: 'Cool down so steam inside the noodles does not surprise little mouths.',
        icon: '🍜'
      },
      {
        id: 'besan_ladoo_jaggery',
        name: 'Roasted Besan & Jaggery Toddler Bites',
        localName: 'बेसन गुड़ लड्डू / கடலை மாவு லட்டு',
        prepTime: '10 mins',
        cookTime: '10 mins',
        ingredients: [
          '1/2 cup Besan (gram flour)',
          '2 tablespoons Pure Desi Ghee',
          '2 tablespoons Organic Jaggery powder',
          'Pinch of Cardamom'
        ],
        instructions: [
          'Roast besan in ghee on medium-low heat until nutty and aromatic (8-10 mins).',
          'Turn off flame, allow to cool slightly, then stir in jaggery powder and cardamom.',
          'Shape into small marble-sized round balls.'
        ],
        benefits: 'Concentrated source of protein, healthy fats, and iron for healthy weight gain.',
        safety: 'Make marble-sized balls that toddlers can easily take small bites from.',
        icon: '🧆'
      },
      {
        id: 'mild_pot_pulao',
        name: 'Soft Stewed Paneer or Veggie Rice Pot',
        localName: 'पनीर खिचड़ी पुलाव / பன்னீர் புலாவ் சாதம்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        ingredients: [
          '1/2 cup Rice',
          '1/4 cup Paneer or Tofu cubes',
          '2 tablespoons Peas and chopped sweet corn',
          '1 teaspoon Ghee & mild spices'
        ],
        instructions: [
          'Sauté paneer, peas, and cumin in ghee.',
          'Add washed rice and 1.5 cups water.',
          'Pressure cook for 2 whistles until soft and moist, fluff, and serve warm with raita.'
        ],
        benefits: 'A balanced complete meal containing all essential macronutrients and vitamins.',
        safety: 'Cut paneer into small cubes and ensure peas and corn are completely tender.',
        icon: '🍲'
      }
    ]
  }
];

import { allAgeStagesData } from './stageRecipes';

// Helper to determine recipe category smoothly with smart fallbacks
export const getRecipeCategory = (recipe: Recipe): MealCategory => {
  if (recipe.category) return recipe.category;

  const text = (recipe.name + ' ' + (recipe.localName || '') + ' ' + recipe.instructions.join(' ')).toLowerCase();
  
  if (text.includes('pancake') || text.includes('dosa') || text.includes('idli') || text.includes('cheela') || 
      text.includes('poha') || text.includes('upma') || text.includes('porridge') || text.includes('kanji') ||
      text.includes('breakfast') || text.includes('paratha') || text.includes('toast') || text.includes('bhurji toast')) {
    return 'Morning';
  }
  if (text.includes('khichdi') || text.includes('rice') || text.includes('pulao') || text.includes('biryani') ||
      text.includes('dal') || text.includes('rajma') || text.includes('chole') || text.includes('curd rice') ||
      text.includes('sambar') || text.includes('chana') || text.includes('curry')) {
    return 'Lunch';
  }
  if (text.includes('soup') || text.includes('stew') || text.includes('wrap') || text.includes('roll') ||
      text.includes('phulka') || text.includes('roti') || text.includes('bhakri') || text.includes('light') || text.includes('dinner')) {
    return 'Dinner';
  }
  return 'Snacks';
};

export const ageStagesData: AgeGroupData[] = allAgeStagesData;

