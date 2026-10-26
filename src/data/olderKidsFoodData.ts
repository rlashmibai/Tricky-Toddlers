import { AgeGroupData, Recipe } from './foodGuideData';

export const olderStagesData: AgeGroupData[] = [
  {
    id: '3_5_years',
    ageLimit: '3 - 5 Years',
    title: 'Preschool Active Explorer',
    guidelines: 'Preschoolers need balanced energy for high physical activity, cognitive play, and immune defense. Offer 3 solid meals and 2 nutritious snacks. Keep portions colorful and easy to eat.',
    milestones: [
      'Eats completely independently using regular child spoons and forks.',
      'Enjoys varied textures including crunchy raw cucumber, carrots, and soft rotis.',
      'Develops taste preferences and can help wash veggies or mix batters.'
    ],
    recipes: [
      // Morning
      {
        id: 'ragi_banana_pancakes_3_5',
        name: 'Fluffy Ragi & Banana Pancakes',
        localName: 'रागी केला पैनकेक / ராகி வாழைப்பழ அப்பம்',
        prepTime: '8 mins',
        cookTime: '7 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Sprouted Ragi flour',
          '1 Ripe mashed banana',
          '1/4 cup Milk',
          '1 teaspoon Jaggery powder',
          '1/2 teaspoon Ghee for pan'
        ],
        instructions: [
          'In a mixing bowl, mash the ripe banana with a fork until smooth.',
          'Whisk in ragi flour, jaggery, and milk until you get a smooth pancake batter.',
          'Heat a tawa with a drop of ghee. Pour small circles of batter.',
          'Cook on medium heat for 2 minutes on each side until cooked through. Serve warm.'
        ],
        benefits: 'Rich in iron, calcium, and natural fruit sweetness. Keeps active preschoolers energized all morning.',
        safety: 'Make small palm-sized pancakes so kids can easily hold and bite them.',
        icon: '🥞'
      },
      {
        id: 'moong_dal_cheela_paneer_3_5',
        name: 'Stuffed Moong Dal & Paneer Cheela',
        localName: 'मूंग दाल पनीर चीला / பாசிப்பருப்பு பன்னீர் அடை',
        prepTime: '10 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Soaked yellow moong dal batter',
          '3 tablespoons Grated fresh paneer',
          '1 tablespoon Finely grated carrots',
          'Pinch of cumin powder and mild salt',
          '1 teaspoon Ghee'
        ],
        instructions: [
          'Blend soaked moong dal into a smooth pouring batter with cumin and a pinch of salt.',
          'Spread a ladle of batter on a warm tawa into a round crepe.',
          'Drizzle a little ghee on edges. Scatter grated paneer and carrot on top.',
          'Fold in half once golden brown and slice into triangles. Serve with curd.'
        ],
        benefits: 'High vegetarian protein from moong dal and paneer supports muscle growth and steady attention in preschool.',
        safety: 'Keep spices very gentle and avoid whole peppercorns.',
        icon: '🫓'
      },
      {
        id: 'vegetable_oats_idli_3_5',
        name: 'Steamed Vegetable Oats Mini Idlis',
        localName: 'ओट्स वेज इडली / ஓட்ஸ் காய்கறி இட்லி',
        prepTime: '10 mins',
        cookTime: '12 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Powdered roasted oats',
          '1/4 cup Curd (yogurt)',
          '2 tablespoons Grated carrot & green peas',
          '1/4 teaspoon Mustard seeds and curry leaves tempering'
        ],
        instructions: [
          'Mix powdered oats, curd, water, and veggies into an idli batter.',
          'Let batter rest for 5 minutes. Spoon into greased mini idli moulds.',
          'Steam for 10-12 minutes until a toothpick inserted comes out clean.',
          'Serve with mild coconut chutney or warm dal.'
        ],
        benefits: 'Gentle soluble fiber from oats aids smooth digestion and bowel regularity.',
        safety: 'Cool to warm room temperature before serving to little ones.',
        icon: '⚪'
      },
      {
        id: 'poha_peas_carrot_3_5',
        name: 'Mild Vegetable Poha with Sweet Peas',
        localName: 'वेजिटेबल पोहा / காய்கறி அவல் உப்புமா',
        prepTime: '5 mins',
        cookTime: '10 mins',
        category: 'Morning',
        ingredients: [
          '1 cup Thick flattened rice (poha), rinsed',
          '1/4 cup Steamed green peas and diced carrots',
          '1/2 teaspoon Cumin seeds & turmeric',
          '1 teaspoon Lemon juice and fresh coriander'
        ],
        instructions: [
          'Rinse poha in a colander and drain completely for 5 minutes.',
          'Heat a teaspoon of ghee or oil in a pan. Splutter cumin seeds and add turmeric.',
          'Add steamed peas, carrots, and drained poha. Gently toss for 3 minutes on low heat.',
          'Turn off heat, squeeze fresh lemon juice, and garnish with chopped coriander.'
        ],
        benefits: 'Light on the stomach yet packed with iron and easy-to-digest carbs.',
        safety: 'Ensure peas are soft-cooked so they smash easily when pressed.',
        icon: '🥣'
      },

      // Lunch
      {
        id: 'curd_rice_pomegranate_3_5',
        name: 'Cooling Curd Rice with Pomegranate Pearls',
        localName: 'दही चावल / தயிர் சாதம்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Soft-cooked mashed rice',
          '1/2 cup Fresh homemade curd (dahi)',
          '2 tablespoons Fresh pomegranate seeds',
          '1/4 cup Grated cucumber or carrot',
          '1/2 teaspoon Mustard & curry leaf ghee tadka'
        ],
        instructions: [
          'Mash warm soft rice thoroughly in a bowl. Let it cool down.',
          'Mix in fresh curd, a splash of milk, and grated cucumber.',
          'Pour a mild ghee tempering of mustard seeds and curry leaves.',
          'Top with sweet pomegranate pearls right before serving.'
        ],
        benefits: 'Rich in natural gut probiotics, calcium, and cooling electrolytes for hot afternoons.',
        safety: 'Use sweet, seedless or tender pomegranate pearls that are easy to chew.',
        icon: '🍚'
      },
      {
        id: 'palak_paneer_rice_bowl_3_5',
        name: 'Creamy Mild Palak Paneer with Jeera Rice',
        localName: 'पालक पनीर जीरा राइस / பாலக் பன்னீர் சாதம்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Fresh spinach leaves, blanched & pureed',
          '1/2 cup Soft paneer cubes',
          '1/2 cup Soft cumin (jeera) rice',
          '1 teaspoon Butter or ghee, mild cumin & turmeric'
        ],
        instructions: [
          'Blanch washed spinach in boiling water for 2 minutes, then blend into a green puree.',
          'Warm ghee in a pan, add cumin and turmeric, then stir in spinach puree.',
          'Add soft bite-sized paneer cubes and simmer for 4 minutes with a pinch of salt.',
          'Serve warm over soft fragrant jeera rice.'
        ],
        benefits: 'Provides bioavailable iron, vitamin A, and bone-strengthening calcium.',
        safety: 'Keep spices mild. Cut paneer into soft, bite-sized cubes.',
        icon: '🍛'
      },
      {
        id: 'dal_palak_phulka_3_5',
        name: 'Yellow Dal Tadka with Soft Phulka & Ghee',
        localName: 'दाल तड़का फुल्का / தால் புல்கா ரொட்டி',
        prepTime: '10 mins',
        cookTime: '20 mins',
        category: 'Lunch',
        ingredients: [
          '1/2 cup Toor dal or yellow moong dal',
          '1 Finely chopped tomato',
          '1/2 teaspoon Ghee with jeera & hing',
          '1-2 Fresh soft whole wheat phulkas'
        ],
        instructions: [
          'Pressure cook dal with tomato, turmeric, and 1.5 cups water until mushy.',
          'Whisk dal smoothly and season with mild ghee tadka of cumin.',
          'Tear soft warm phulka into small bite-sized pieces and dip into dal.',
          'Serve with a small spoon of mild carrot salad.'
        ],
        benefits: 'Classic Indian complete protein meal providing essential amino acids and complex carbs.',
        safety: 'Tear rotis into bite-sized pieces so child chews comfortably.',
        icon: '🍲'
      },
      {
        id: 'khichdi_veggie_butter_3_5',
        name: 'Moong Dal & Garden Veggie Khichdi',
        localName: 'मूंग दाल वेज खिचड़ी / காய்கறி பருப்பு கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Lunch',
        ingredients: [
          '1/4 cup Rice and 1/4 cup Yellow Moong Dal',
          '1/2 cup Mixed diced carrots, bottle gourd (lauki), and beans',
          '1 teaspoon Pure desi ghee',
          '1/4 teaspoon Cumin powder & turmeric'
        ],
        instructions: [
          'Wash rice and dal together. Sauté cumin and chopped veggies in ghee.',
          'Add rice, dal, and 2.5 cups of water for a soft, comforting texture.',
          'Pressure cook for 3 whistles until soft and meltingly tender.',
          'Mash lightly with the back of a ladle and top with half a spoon of ghee.'
        ],
        benefits: 'Supreme comfort food, completely balanced, and extremely gentle on the stomach.',
        safety: 'Ensure all vegetable pieces are thoroughly soft and cooked.',
        icon: '🥣'
      },

      // Dinner
      {
        id: 'carrot_tomato_soup_toast_3_5',
        name: 'Silky Carrot-Tomato Soup with Wheat Croutons',
        localName: 'गाजर टमाटर सूप / கேரட் தக்காளி சூப்',
        prepTime: '8 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1 Sweet carrot and 2 ripe tomatoes',
          '1 slice Whole wheat bread, toasted & cubed',
          '1/2 teaspoon Butter and mild salt',
          '1/4 cup Warm milk or vegetable broth'
        ],
        instructions: [
          'Steam chopped carrots and tomatoes until very soft. Blend into a smooth soup.',
          'Strain into a small pot, add milk and butter, and simmer for 3 minutes.',
          'Cut toasted bread into fun little square croutons.',
          'Let child dip the crunchy croutons into the warm soup.'
        ],
        benefits: 'High in beta-carotene for healthy eyes and vitamin C for immunity.',
        safety: 'Ensure soup is comfortably warm, not hot, before serving.',
        icon: '🍵'
      },
      {
        id: 'paneer_bhurji_wrap_3_5',
        name: 'Mild Paneer Bhurji Soft Roll',
        localName: 'पनीर भुर्जी रोल / பன்னீர் புர்ஜி சுருள்',
        prepTime: '8 mins',
        cookTime: '10 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Crumbled fresh paneer',
          '2 tablespoons Diced tomatoes and boiled sweet corn',
          '1 Soft whole wheat chapati',
          '1/2 teaspoon Ghee and mild cumin'
        ],
        instructions: [
          'Sauté cumin, tomatoes, and corn in ghee until soft.',
          'Add crumbled paneer, a pinch of turmeric and salt, and cook for 2 minutes.',
          'Spread warm paneer bhurji across a soft chapati.',
          'Roll up into a snug wrap and cut into two toddler-friendly halves.'
        ],
        benefits: 'Nutrient-dense protein meal that keeps preschoolers full and promotes uninterrupted sleep.',
        safety: 'Keep wrap tightly rolled so filling does not spill.',
        icon: '🌯'
      },
      {
        id: 'beetroot_rice_raita_3_5',
        name: 'Ruby Beetroot Pulao with Cucumber Raita',
        localName: 'चुकंदर पुलाव / பீட்ரூட் சாதம்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Steamed rice',
          '1/4 cup Grated beetroot',
          '1/2 teaspoon Ghee & cumin seeds',
          '1/4 cup Fresh yogurt with grated cucumber'
        ],
        instructions: [
          'Sauté cumin and grated beetroot in ghee for 4 minutes until tender.',
          'Fold in warm cooked rice until rice takes on a vibrant pink ruby color.',
          'Whisk fresh curd with grated cucumber for a cooling raita dip.',
          'Serve the colorful plate to make dinner fun and inviting.'
        ],
        benefits: 'Naturally sweet flavor from beetroot boosts iron levels and red blood cells.',
        safety: 'Grate beetroot finely so it melts into the rice easily.',
        icon: '🍛'
      },

      // Snacks & Healthy Desserts
      {
        id: 'roasted_makhana_turmeric_3_5',
        name: 'Crunchy Ghee Roasted Foxnuts (Makhana)',
        localName: 'भुना मखाना / வறுத்த தாமரை விதை',
        prepTime: '2 mins',
        cookTime: '5 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Phool Makhana (foxnuts)',
          '1 teaspoon Desi ghee',
          '1/8 teaspoon Turmeric and pinch of rock salt'
        ],
        instructions: [
          'Heat ghee in a pan on medium-low heat.',
          'Add makhana and roast slowly for 4-5 minutes, tossing regularly.',
          'Once crispy, sprinkle turmeric and salt. Toss well and let cool.'
        ],
        benefits: 'Light, crunchy calcium-rich snack without any trans-fats or artificial preservatives.',
        safety: 'Check each makhana for hard black shell remnants before roasting.',
        icon: '🍿'
      },
      {
        id: 'sweet_corn_chaat_3_5',
        name: 'Warm Steamed Butter Corn Cups',
        localName: 'स्वीट कॉर्न चाट / சோள சாட்',
        prepTime: '5 mins',
        cookTime: '5 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Steamed sweet corn kernels',
          '1/2 teaspoon Homemade butter',
          '1/4 teaspoon Cumin powder and drops of lemon juice'
        ],
        instructions: [
          'Steam sweet corn until juicy and soft.',
          'Toss while hot with butter, cumin powder, and a squeeze of lemon juice.',
          'Serve in a small colorful cup with a child spoon.'
        ],
        benefits: 'Loaded with dietary fiber, lutein for vision, and quick natural energy.',
        safety: 'Ensure corn kernels are soft and thoroughly steamed.',
        icon: '🌽'
      },
      {
        id: 'dryfruit_ladoo_jaggery_3_5',
        name: 'Soft Date & Almond Energy Bite',
        localName: 'खजूर बादाम लड्डू / பேரீச்சம்பழ லட்டு',
        prepTime: '10 mins',
        cookTime: '2 mins',
        category: 'Snacks',
        ingredients: [
          '1/2 cup Soft pitted Medjool dates',
          '2 tablespoons Finely powdered almonds & cashews',
          '1 tablespoon Desi ghee',
          'Pinch of cardamom powder'
        ],
        instructions: [
          'Pulse soft dates in a blender until they form a sticky paste.',
          'Warm ghee in a pan, add date paste and nut powders, and stir for 2 minutes.',
          'Cool until touchable and roll into small marble-sized balls.'
        ],
        benefits: 'Natural energy booster with zero added white sugar. High in magnesium and iron.',
        safety: 'Always use finely powdered nuts for preschoolers to eliminate any choking risk.',
        icon: '🧆'
      },
      {
        id: 'banana_date_smoothie_3_5',
        name: 'Creamy Banana & Cardamom Milkshake',
        localName: 'केला खजूर शेक / வாழைப்பழ பால்',
        prepTime: '4 mins',
        cookTime: '0 mins',
        category: 'Snacks',
        ingredients: [
          '1 Ripe sweet banana',
          '1 cup Whole milk (warmed & cooled)',
          '1 Soft date (soaked in warm water)',
          'Pinch of aromatic cardamom'
        ],
        instructions: [
          'Place banana, soaked date, and cardamom into a blender jar.',
          'Add milk and blend for 1 minute until creamy and froth-topped.',
          'Pour into a cup and serve fresh with an open sipper or straw.'
        ],
        benefits: 'Potassium, calcium, and healthy calories supporting active play and bone growth.',
        safety: 'Do not add ice cubes; serve at gentle room temperature.',
        icon: '🥤'
      }
    ]
  },

  {
    id: '5_10_years',
    ageLimit: '5 - 10 Years',
    title: 'School Age & Growth Spurt',
    guidelines: 'School-age kids need sustained energy for classroom focus, active playground sports, and developing skeletal strength. Focus on whole grains, lentils, fresh seasonal greens, and high-calcium dairy.',
    milestones: [
      'Has full adult-style eating capabilities with primary & permanent teeth emerging.',
      'Participates in packing school lunchboxes and has strong taste preferences.',
      'Needs steady hydration (1.2 - 1.5 liters) and balanced snack breaks after school.'
    ],
    recipes: [
      // Morning
      {
        id: 'methi_paratha_curd_5_10',
        name: 'Iron-Rich Fresh Methi Paratha with Dahi',
        localName: 'मेथी पराठा दही / வெந்தயக்கீரை பரோட்டா',
        prepTime: '12 mins',
        cookTime: '10 mins',
        category: 'Morning',
        ingredients: [
          '1 cup Whole wheat flour (atta)',
          '1/2 cup Fresh fenugreek (methi) leaves, finely chopped',
          '1/4 teaspoon Ajwain (carom seeds) and turmeric',
          '1 teaspoon Ghee for roasting',
          '1/2 cup Fresh creamy curd'
        ],
        instructions: [
          'Wash and finely chop fresh methi leaves.',
          'Knead atta with methi leaves, ajwain, turmeric, and water into a smooth dough.',
          'Roll into medium round parathas and cook on a hot tawa with ghee until speckled golden.',
          'Serve hot with a side of thick curd.'
        ],
        benefits: 'Ajwain aids digestion while fenugreek delivers high natural iron and dietary fiber.',
        safety: 'Ensure methi leaves are thoroughly washed to remove all soil sediment.',
        icon: '🫓'
      },
      {
        id: 'multigrain_dosa_chutney_5_10',
        name: 'Crispy Multigrain Dosa with Coconut Dip',
        localName: 'मल्टीग्रेन डोसा / தானிய தோசை',
        prepTime: '5 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '1 cup Multigrain batter (Ragi, Rice, Urad, and Jowar)',
          '1 teaspoon Ghee or sesame oil',
          '2 tablespoons Fresh coconut & roasted chana dal chutney'
        ],
        instructions: [
          'Heat a cast-iron tawa and pour a ladle of multigrain batter.',
          'Spread in spiral motions into a crisp crepe.',
          'Drizzle a little ghee on the perimeter and cook until crisp and golden.',
          'Roll and serve with mild coconut chutney.'
        ],
        benefits: 'Low glycemic index complex grains provide slow, sustained energy for school mornings.',
        safety: 'Serve with mild chutney without fiery green chilies.',
        icon: '🥞'
      },
      {
        id: 'besan_vegetable_chilla_5_10',
        name: 'Savory Besan & Bell Pepper Chilla',
        localName: 'बेसन वेज चीला / கடலை மாவு அடை',
        prepTime: '8 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '3/4 cup Besan (chickpea flour)',
          '1/4 cup Finely diced onions, tomatoes, and bell peppers',
          '1/2 teaspoon Cumin and ajwain seeds',
          '1 teaspoon Oil for cooking'
        ],
        instructions: [
          'Whisk besan with water into a smooth crepe consistency batter.',
          'Fold in finely diced bell peppers, tomatoes, and ajwain.',
          'Pour batter on a hot pan and cook on both sides until crispy and fragrant.',
          'Cut into fun triangles for a quick school breakfast.'
        ],
        benefits: 'Plant-based chickpea protein keeps kids alert and focused through morning classes.',
        safety: 'Dice vegetables finely so the chilla cooks evenly.',
        icon: '🫓'
      },
      {
        id: 'vegetable_upma_peanuts_5_10',
        name: 'Semolina & Roasted Peanut Veggie Upma',
        localName: 'वेजिटेबल उपमा / காய்கறி உப்புமா',
        prepTime: '8 mins',
        cookTime: '12 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Roasted semolina (sooji or rava)',
          '1/4 cup Diced carrots, peas, and green beans',
          '1 tablespoon Roasted crunchy peanuts',
          '1 teaspoon Ghee, mustard seeds, and curry leaves'
        ],
        instructions: [
          'Heat ghee, splutter mustard seeds, curry leaves, and roasted peanuts.',
          'Sauté veggies until half-tender, then pour in 1.25 cups of water and bring to a boil.',
          'Slowly pour in roasted rava while stirring continuously to prevent lumps.',
          'Cover and simmer on low for 3 minutes. Fluff with a fork and serve.'
        ],
        benefits: 'Good source of healthy fats and protein from peanuts combined with complex carbs.',
        safety: 'Ensure child has no peanut allergies before adding whole roasted nuts.',
        icon: '🥣'
      },

      // Lunch
      {
        id: 'rajma_chawal_salad_5_10',
        name: 'Home-Style Rajma Masala with Steamed Rice',
        localName: 'राजमा चावल / ராஜ்மா சாதம்',
        prepTime: '15 mins',
        cookTime: '25 mins',
        category: 'Lunch',
        ingredients: [
          '1/2 cup Soaked red kidney beans (rajma)',
          '1 cup Cooked basmati rice',
          '1 Tomato and onion gravy with ginger-garlic and cumin',
          '1/2 cup Fresh cucumber & tomato kachumber'
        ],
        instructions: [
          'Pressure cook soaked rajma until melt-in-the-mouth soft (5 whistles).',
          'Simmer in a mild tomato-onion gravy seasoned with cumin and coriander for 10 mins.',
          'Ladle hot aromatic rajma over steamed rice.',
          'Serve with freshly squeezed lemon juice and crunchy cucumber slices.'
        ],
        benefits: 'High protein and dietary fiber supporting steady adolescent growth and bowel health.',
        safety: 'Ensure kidney beans are soaked overnight and cooked until completely soft.',
        icon: '🍛'
      },
      {
        id: 'paneer_bhurji_multigrain_roti_5_10',
        name: 'Paneer Bhurji with Warm Multigrain Rotis',
        localName: 'पनीर भुर्जी रोटी / பன்னீர் புர்ஜி சப்பாத்தி',
        prepTime: '10 mins',
        cookTime: '12 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Crumbled fresh paneer',
          '1 Diced onion and tomato',
          '2 Multigrain rotis (wheat, ragi, barley)',
          '1 teaspoon Desi ghee & mild spices'
        ],
        instructions: [
          'Sauté diced onions, tomatoes, and mild spices in ghee.',
          'Toss in fresh crumbled paneer and cook for 3 minutes on low flame.',
          'Serve alongside warm, soft multigrain rotis and lemon wedges.'
        ],
        benefits: 'Excellent vegetarian source of high-biological value dairy protein and calcium.',
        safety: 'Do not overcook paneer to keep it moist and tender.',
        icon: '🍲'
      },
      {
        id: 'sambar_rice_potato_roast_5_10',
        name: 'Wholesome Vegetable Sambar Rice with Ghee',
        localName: 'सांभर चावल / சாம்பார் சாதம்',
        prepTime: '10 mins',
        cookTime: '20 mins',
        category: 'Lunch',
        ingredients: [
          '1/2 cup Cooked toor dal & rice',
          '1/2 cup Drumstick, pumpkin, and carrot pieces',
          '1 tablespoon Sambar powder & tamarind extract',
          '1 teaspoon Ghee for tempering'
        ],
        instructions: [
          'Boil vegetables in tamarind water with turmeric and sambar powder.',
          'Add boiled toor dal and soft cooked rice. Mix well and simmer for 5 minutes.',
          'Temper with ghee, mustard seeds, and curry leaves.',
          'Serve warm with crispy roasted potato slices.'
        ],
        benefits: 'Combines lentils, diverse vegetables, and spices for an antioxidant-rich lunch.',
        safety: 'Remove hard drumstick fibers before giving to younger school kids.',
        icon: '🍛'
      },
      {
        id: 'chana_masala_rice_5_10',
        name: 'Mild Kabuli Chana Masala with Jeera Rice',
        localName: 'चना मसाला जीरा राइस / கொண்டக்கடலை சாதம்',
        prepTime: '12 mins',
        cookTime: '20 mins',
        category: 'Lunch',
        ingredients: [
          '1/2 cup Soaked white chickpeas (kabuli chana)',
          '1 cup Cooked jeera rice',
          '1 Onion-tomato puree with cumin and amchur (dry mango)',
          '1 teaspoon Ghee'
        ],
        instructions: [
          'Boil chickpeas until tender and easily mashed between fingers.',
          'Simmer in a tangy tomato-cumin gravy for 10 minutes.',
          'Garnish with fresh coriander and serve over fragrant jeera rice.'
        ],
        benefits: 'Packed with folate, iron, and slow-release energy for sports-active children.',
        safety: 'Ensure chickpeas are soft-cooked throughout.',
        icon: '🍲'
      },

      // Dinner
      {
        id: 'moong_palak_khichdi_5_10',
        name: 'Green Spinach & Yellow Moong Khichdi',
        localName: 'पालक मूंग खिचड़ी / கீரை கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Rice and Moong Dal (equal parts)',
          '1 cup Pureed fresh baby spinach',
          '1 teaspoon Ghee & crushed cumin',
          '1/2 cup Fresh roasted papad and curd'
        ],
        instructions: [
          'Cook rice and moong dal in a pressure cooker with 2.5 cups water until soft.',
          'Warm ghee in a pan, sauté cumin, and stir in spinach puree for 2 minutes.',
          'Fold in the warm khichdi until bright emerald green. Serve with cool curd.'
        ],
        benefits: 'Easy on the digestive system before bed, promoting restful night sleep.',
        safety: 'Serve lukewarm with roasted, not deep-fried, papad.',
        icon: '🥣'
      },
      {
        id: 'paneer_pulao_raita_5_10',
        name: 'Golden Paneer & Green Pea Tawa Pulao',
        localName: 'पनीर तवा पुलाव / பன்னீர் புலாவ்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1 cup Steamed basmati rice',
          '1/2 cup Pan-seared paneer cubes',
          '1/4 cup Sweet peas & finely chopped bell peppers',
          '1/2 cup Boondi raita'
        ],
        instructions: [
          'Pan-sear paneer cubes in ghee until golden.',
          'Sauté peas and bell peppers with cumin and mild garam masala.',
          'Toss in cooked rice gently to keep grains long and fluffy.',
          'Serve with chilled boondi raita.'
        ],
        benefits: 'Provides high quality casein protein and essential amino acids for overnight growth.',
        safety: 'Ensure peppers are diced small and soft-cooked.',
        icon: '🍛'
      },
      {
        id: 'lauki_chana_dal_roti_5_10',
        name: 'Sweet Bottle Gourd (Lauki) & Chana Dal with Roti',
        localName: 'लौकी चना दाल / சுரைக்காய் தால்',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Chana dal, soaked 30 mins',
          '1 cup Diced sweet bottle gourd (lauki/doodhi)',
          '2 Soft whole wheat rotis',
          '1 teaspoon Ghee, cumin & turmeric'
        ],
        instructions: [
          'Pressure cook chana dal and bottle gourd cubes with turmeric and salt.',
          'Add a fragrant tempering of cumin seeds in ghee.',
          'Mash lightly and serve hot with fresh whole wheat rotis.'
        ],
        benefits: 'Hydrating, high in fiber, and very soothing for active kids after a long school day.',
        safety: 'Always taste bottle gourd before cooking to ensure it is not bitter.',
        icon: '🍲'
      },

      // Snacks & Healthy Desserts
      {
        id: 'sprout_bhel_lemon_5_10',
        name: 'Crunchy Sprouted Moong Chaat with Lemon',
        localName: 'अंकुरित मूंग भेल / முளைகட்டிய பயறு சாட்',
        prepTime: '10 mins',
        cookTime: '0 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Steamed green moong sprouts',
          '1/4 cup Diced cucumber, tomatoes, and boiled potato',
          '1/2 teaspoon Roasted cumin powder & chaat masala',
          '1 tablespoon Fresh lemon juice & coriander'
        ],
        instructions: [
          'Steam moong sprouts for 3 minutes to make them tender and digestible.',
          'Toss with diced vegetables, cumin powder, chaat masala, and lemon juice.',
          'Serve in a crunchy bowl for an energizing after-school snack.'
        ],
        benefits: 'Sprouting multiplies vitamin C and antioxidant bioavailability for high immunity.',
        safety: 'Light steaming of sprouts prevents bacterial contamination.',
        icon: '🥗'
      },
      {
        id: 'sweet_potato_cutlet_5_10',
        name: 'Tawa-Crisped Sweet Potato & Paneer Tikki',
        localName: 'शकरकंद पनीर टिक्की / சர்க்கரைவள்ளிக்கிழங்கு கட்லெட்',
        prepTime: '12 mins',
        cookTime: '10 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Boiled & mashed sweet potato (shakarkand)',
          '1/4 cup Grated fresh paneer',
          '2 tablespoons Roasted oat flour for binding',
          '1 teaspoon Ghee for pan roasting'
        ],
        instructions: [
          'Mix mashed sweet potato, paneer, oat flour, cumin, and mild salt.',
          'Shape into small flat burger-style patties.',
          'Shallow fry on a tawa with ghee for 4 minutes each side until golden and crispy.',
          'Serve with mint-coriander chutney.'
        ],
        benefits: 'Complex carbs with low glycemic impact, high vitamin A, and healthy fats.',
        safety: 'Shallow fry with minimal ghee instead of deep-frying.',
        icon: '🧆'
      },
      {
        id: 'makhana_kheer_jaggery_5_10',
        name: 'Rich Makhana & Almond Kheer with Jaggery',
        localName: 'मखाना खीर / தாமரை விதை பாயாசம்',
        prepTime: '5 mins',
        cookTime: '15 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Foxnuts (makhana), coarsely crushed',
          '2 cups Full cream cow milk',
          '2 tablespoons Jaggery powder (added after cooking)',
          '4 Crushed almonds and pinch of saffron'
        ],
        instructions: [
          'Roast makhana in 1/2 tsp ghee and pulse half of it coarsely.',
          'Simmer milk with crushed makhana, saffron, and almonds for 10 mins until thick.',
          'Turn off heat. Let it cool slightly, then stir in jaggery powder.',
          'Serve warm or chilled as a nutritious dessert.'
        ],
        benefits: 'High calcium and magnesium dessert without refined white sugar.',
        safety: 'Always turn off heat before adding jaggery to prevent milk from curdling.',
        icon: '🍮'
      },
      {
        id: 'badam_milk_kesar_5_10',
        name: 'Traditional Saffron & Almond Golden Milk',
        localName: 'बादाम केसर दूध / பாதாம் பால்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        category: 'Snacks',
        ingredients: [
          '1.5 cups Fresh whole milk',
          '1 tablespoon Soaked & peeled almond paste',
          'Pinch of Saffron (kesar) strands and cardamom',
          '1 teaspoon Honey or jaggery'
        ],
        instructions: [
          'Blend soaked peeled almonds with 2 tbsp of warm milk into a paste.',
          'Bring milk to a gentle boil with almond paste and saffron strands.',
          'Simmer for 5 minutes until fragrant and creamy.',
          'Sweeten with honey or jaggery and serve warm before bedtime.'
        ],
        benefits: 'Rich in vitamin E and natural tryptophan, promoting muscle repair and restful sleep.',
        safety: 'Serve at comforting warm drinking temperature.',
        icon: '🥛'
      }
    ]
  },

  {
    id: '10_15_years',
    ageLimit: '10 - 15 Years',
    title: 'Pre-Teens & Rapid Growth',
    guidelines: 'Pre-teens undergo accelerated growth spurts in height, bone density, and muscle mass. Prioritize calcium, high-quality protein, complex carbohydrates, iron, and steady hydration for academic stamina and sports.',
    milestones: [
      'Experiences peak growth spurt requiring dense caloric and micronutrient support.',
      'Active in sports, workouts, and after-school extracurricular activities.',
      'Capable of cooking simple, healthy Indian breakfast and snack items independently.'
    ],
    recipes: [
      // Morning
      {
        id: 'sattu_power_paratha_10_15',
        name: 'Bihari Spiced Sattu Paratha with Mint Dip',
        localName: 'सत्तू पराठा / சத்து மாவு பரோட்டா',
        prepTime: '15 mins',
        cookTime: '10 mins',
        category: 'Morning',
        ingredients: [
          '1 cup Whole wheat flour dough',
          '1/2 cup Roasted Bengal gram flour (sattu)',
          '1 tablespoon Chopped coriander, onions, and ajwain',
          '1 teaspoon Mustard oil and lemon juice for stuffing',
          '1 teaspoon Ghee for pan roasting'
        ],
        instructions: [
          'Mix sattu with chopped onion, coriander, ajwain, lemon juice, and a drop of mustard oil.',
          'Stuff a ball of whole wheat dough with 2 tbsp of sattu filling.',
          'Roll gently and roast on tawa with ghee until crisp and aromatic.',
          'Serve with mint chutney and fresh curd.'
        ],
        benefits: 'Sattu is a powerhouse of native plant protein and iron, sustaining energy for hours.',
        safety: 'Do not overfill dough ball to prevent tearing while rolling.',
        icon: '🫓'
      },
      {
        id: 'egg_paneer_bhurji_toast_10_15',
        name: 'High-Protein Paneer or Egg Bhurji Multigrain Toast',
        localName: 'पनीर/अंडा भुर्जी टोस्ट / பன்னீர் முட்டை டோஸ்ட்',
        prepTime: '8 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '2 Organic eggs or 100g Fresh paneer',
          '1 Finely chopped onion, tomato, and green bell pepper',
          '2 slices Toasted multigrain sourdough or bread',
          '1 teaspoon Butter, cumin, and turmeric'
        ],
        instructions: [
          'Sauté cumin, onions, tomatoes, and bell peppers in butter.',
          'Whisk eggs or crumble paneer and scramble on medium heat for 3-4 minutes.',
          'Season with mild black pepper, turmeric, and fresh coriander.',
          'Mound generously over toasted multigrain bread.'
        ],
        benefits: 'Delivers 18-20g of complete biological protein to kickstart academic mornings.',
        safety: 'Cook eggs thoroughly; keep paneer tender without rubberiness.',
        icon: '🍳'
      },
      {
        id: 'masala_oats_sprouts_10_15',
        name: 'Savory Vegetable & Sprout Masala Oats',
        localName: 'मसाला ओट्स / மசாலா ஓட்ஸ்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Rolled oats',
          '1/4 cup Steamed moong sprouts & sweet corn',
          '1/2 teaspoon Cumin, turmeric, and pinch of black pepper',
          '1.5 cups Water and fresh coriander'
        ],
        instructions: [
          'Sauté cumin and veggies in half a teaspoon of ghee.',
          'Add rolled oats, sprouts, water, and mild turmeric.',
          'Simmer for 6-8 minutes until thick, porridge-like, and comforting.',
          'Top with freshly chopped coriander and a drop of lemon juice.'
        ],
        benefits: 'Beta-glucan fibers support metabolic health and prevent mid-morning fatigue.',
        safety: 'Ensure oats are cooked until completely soft.',
        icon: '🥣'
      },

      // Lunch
      {
        id: 'chole_brown_rice_bowl_10_15',
        name: 'Protein-Rich Chole Bowl with Brown Rice & Salad',
        localName: 'छोले ब्राउन राइस / கொண்டக்கடலை சாதம்',
        prepTime: '15 mins',
        cookTime: '25 mins',
        category: 'Lunch',
        ingredients: [
          '3/4 cup Soaked boiled chickpeas (chana)',
          '1 cup Steamed brown rice or basmati',
          '1 Onion-tomato masala gravy with ginger, garlic, and cumin',
          '1/2 cup Onion rings, cucumber, and lemon'
        ],
        instructions: [
          'Pressure cook soaked chickpeas with a tea bag or bay leaf until tender.',
          'Simmer in rich onion, tomato, ginger, garlic, and coriander spice gravy for 15 mins.',
          'Serve with steaming brown rice and a side of fresh crunchy salad.'
        ],
        benefits: 'Ideal pre-teen muscle-building lunch with 15g protein and slow-digesting carbs.',
        safety: 'Ensure chickpeas are well-cooked to prevent bloating.',
        icon: '🍛'
      },
      {
        id: 'dal_makhani_healthy_10_15',
        name: 'Homestyle Low-Fat Dal Makhani with Phulka',
        localName: 'घर की दाल मखनी / பருப்பு மக்கானி',
        prepTime: '15 mins',
        cookTime: '30 mins',
        category: 'Lunch',
        ingredients: [
          '1/2 cup Whole black urad dal & kidney beans',
          '1 Tomato puree and ginger-garlic paste',
          '1 tablespoon Fresh cream or milk & 1 tsp butter (low fat homestyle)',
          '2 Soft whole wheat phulkas'
        ],
        instructions: [
          'Slow cook black dal and rajma until meltingly soft.',
          'Simmer with fresh tomato puree and ginger for 20 minutes.',
          'Finish with a splash of milk and 1 tsp butter instead of heavy restaurant cream.',
          'Serve with hot phulkas and onion salad.'
        ],
        benefits: 'High iron, calcium, and plant protein without saturated heavy restaurant fats.',
        safety: 'Slow cooking makes black urad dal light on digestion.',
        icon: '🍲'
      },
      {
        id: 'palak_paneer_jeera_pulao_10_15',
        name: 'Garden Palak Paneer with Brown Rice Pulao',
        localName: 'पालक पनीर पुलाव / பாலக் பன்னீர் புலாவ்',
        prepTime: '12 mins',
        cookTime: '18 mins',
        category: 'Lunch',
        ingredients: [
          '1.5 cups Blanched spinach puree',
          '100g Firm fresh paneer cubes',
          '1 cup Cooked jeera brown rice',
          '1 teaspoon Ghee, garlic, and mild spices'
        ],
        instructions: [
          'Sauté golden minced garlic in ghee, then add vibrant green spinach puree.',
          'Simmer with mild spices and fold in paneer cubes.',
          'Serve with warm cumin-scented brown rice and fresh salad.'
        ],
        benefits: 'Delivers essential magnesium, zinc, and calcium for teenage bone mineralization.',
        safety: 'Wash spinach leaves thoroughly before blanching.',
        icon: '🍛'
      },

      // Dinner
      {
        id: 'mixed_lentil_tadka_roti_10_15',
        name: 'Panchmel Dal (5 Lentils) with Multigrain Roti',
        localName: 'पंचमेल दाल रोटी / பஞ்ச பருப்பு சாதம்',
        prepTime: '10 mins',
        cookTime: '20 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Mixed lentils (Moong, Masoor, Toor, Chana, Urad)',
          '1 Tomato, ginger, and cumin tadka in ghee',
          '2 Warm multigrain rotis',
          '1/2 cup Fresh cucumber kachumber'
        ],
        instructions: [
          'Pressure cook the 5-lentil mix with turmeric and salt until tender.',
          'Temper with ghee, cumin seeds, ginger, and fresh tomatoes.',
          'Whisk dal and serve warm with multigrain rotis.'
        ],
        benefits: 'Complete amino acid profile from 5 distinct lentils supports rapid growth and tissue repair.',
        safety: 'Whisk well so the dal is smooth and comforting.',
        icon: '🍲'
      },
      {
        id: 'soya_chunk_veggie_curry_10_15',
        name: 'High-Protein Soya Chunk & Pea Curry with Rice',
        localName: 'सोया चंक्स करी / சோயா குழம்பு',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1 cup Soya chunks, boiled and squeezed',
          '1/4 cup Sweet green peas',
          '1 cup Steamed rice or 2 rotis',
          '1 Onion-tomato ginger gravy'
        ],
        instructions: [
          'Boil soya chunks in water with a pinch of salt. Rinse in cold water and squeeze dry.',
          'Sauté onions, tomatoes, and peas in a pan with mild spices.',
          'Add soya chunks and 1 cup water. Simmer for 10 minutes so chunks absorb flavors.',
          'Serve with hot rice or rotis.'
        ],
        benefits: 'Contains over 50% protein by weight, ideal for sports recovery and teenage energy.',
        safety: 'Squeeze out boiling water thoroughly to ensure soft, juicy texture.',
        icon: '🍛'
      },
      {
        id: 'vegetable_khichdi_kadhi_10_15',
        name: 'Gujarati Spiced Kadhi with Moong Khichdi',
        localName: 'कढ़ी खिचड़ी / மோர் குழம்பு கிச்சடி',
        prepTime: '10 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1 cup Warm moong dal khichdi',
          '1 cup Besan and buttermilk kadhi',
          '1/2 teaspoon Mustard, methi seeds, and curry leaf tadka'
        ],
        instructions: [
          'Whisk fresh curd and besan with water and turmeric until smooth.',
          'Simmer with a tempering of mustard, fenugreek seeds, and curry leaves.',
          'Pour warm, soothing kadhi over freshly cooked moong dal khichdi.'
        ],
        benefits: 'Aids evening digestion, calms the nervous system, and provides probiotics.',
        safety: 'Keep kadhi on medium heat and stir constantly so it does not split.',
        icon: '🥣'
      },

      // Snacks & Healthy Desserts
      {
        id: 'masala_peanut_sprout_chaat_10_15',
        name: 'Zesty Peanut & Kala Chana Chaat',
        localName: 'चना मूंगफली चाट / வேர்க்கடலை சுண்டல்',
        prepTime: '8 mins',
        cookTime: '5 mins',
        category: 'Snacks',
        ingredients: [
          '1/2 cup Boiled brown chickpeas (kala chana)',
          '1/4 cup Roasted peanuts',
          '1/4 cup Diced cucumber, onions, and tomatoes',
          '1 tablespoon Fresh lemon juice, chaat masala, and mint'
        ],
        instructions: [
          'Combine warm boiled kala chana with roasted crunchy peanuts.',
          'Toss with diced fresh veggies, chaat masala, and lemon juice.',
          'Serve in a bowl with toothpicks or small spoons.'
        ],
        benefits: 'Super-rich in plant iron, dietary fiber, and healthy monounsaturated fats.',
        safety: 'Ensure chickpeas are well-boiled.',
        icon: '🥗'
      },
      {
        id: 'paneer_tikka_skewers_10_15',
        name: 'Tawa-Grilled Herb Paneer Tikka Cubes',
        localName: 'पनीर टिक्का / பன்னீர் டிக்கா',
        prepTime: '15 mins',
        cookTime: '8 mins',
        category: 'Snacks',
        ingredients: [
          '150g Fresh paneer, cut into 1-inch cubes',
          '1/4 cup Hung curd (Greek yogurt) marinade with kasuri methi & ajwain',
          '1/2 Diced bell peppers and onions',
          '1 teaspoon Mustard oil'
        ],
        instructions: [
          'Marinate paneer cubes and veggies in spiced curd and mustard oil for 15 minutes.',
          'Sear on a hot tawa with a few drops of oil until charred golden on all sides.',
          'Sprinkle chaat masala and fresh coriander.'
        ],
        benefits: 'Provides instant protein recovery after school sports or dance rehearsals.',
        safety: 'Use toothpicks or child-safe skewers without sharp points.',
        icon: '🍢'
      },
      {
        id: 'ragi_dryfruit_laddoo_10_15',
        name: 'Ragi & Roasted Sesame Calcium Balls',
        localName: 'रागी तिल लड्डू / ராகி எள்ளு உருண்டை',
        prepTime: '10 mins',
        cookTime: '8 mins',
        category: 'Snacks',
        ingredients: [
          '1/2 cup Ragi flour, roasted',
          '2 tablespoons White sesame seeds (til), roasted',
          '3 tablespoons Organic jaggery powder',
          '1.5 tablespoons Pure desi ghee'
        ],
        instructions: [
          'Roast ragi flour in ghee on low flame until aromatic (6 mins).',
          'Add roasted sesame seeds and jaggery powder. Mix while warm.',
          'Roll into golf-ball-sized laddoos while warm.'
        ],
        benefits: 'Highest natural vegetarian calcium source for teenage skeletal bone density.',
        safety: 'Store in an airtight jar for up to 2 weeks.',
        icon: '🧆'
      },
      {
        id: 'banana_peanut_smoothie_10_15',
        name: 'Nutty Banana & Chia Seed Power Shake',
        localName: 'बनाना पीனट शेक / வாழைப்பழ ஸ்மூத்தி',
        prepTime: '5 mins',
        cookTime: '0 mins',
        category: 'Snacks',
        ingredients: [
          '1 Large ripe banana',
          '1 cup Cold milk or almond milk',
          '1 tablespoon Natural unsweetened peanut butter',
          '1 teaspoon Soaked chia seeds',
          '1 Soft date for natural sweetness'
        ],
        instructions: [
          'Blend banana, milk, peanut butter, and date until thick and frosty.',
          'Stir in pre-soaked chia seeds.',
          'Pour into a tall sports glass and drink after evening training.'
        ],
        benefits: 'Replenishes glycogen stores, delivers potassium, and provides omega-3 fatty acids.',
        safety: 'Soak chia seeds for at least 15 minutes before adding to shake.',
        icon: '🥤'
      }
    ]
  },

  {
    id: '15_18_years',
    ageLimit: '15 - 18 Years',
    title: 'Adolescent & Young Adult Peak Energy',
    guidelines: 'Teenagers have metabolic demands approaching adult athletic levels. Rapid hormonal development, intense academic exam prep, and high sports activity require clean whole foods, dense iron, zinc, complex carbs, and clean hydration.',
    milestones: [
      'Adult metabolic capacity with intense caloric requirements during sports and exam seasons.',
      'Makes independent nutrition choices in school, college, and social outings.',
      'Benefits from meal-prep routines, wholesome snacking habits, and avoiding junk food.'
    ],
    recipes: [
      // Morning
      {
        id: 'paneer_kathi_roll_15_18',
        name: 'High-Protein Whole Wheat Paneer Kathi Roll',
        localName: 'पनीर काठी रोल / பன்னீர் காட்டி ரோல்',
        prepTime: '10 mins',
        cookTime: '10 mins',
        category: 'Morning',
        ingredients: [
          '100g Fresh paneer strips',
          '1 Large whole wheat chapati/wrap',
          '1/4 cup Sliced bell peppers, onions, and mint chutney',
          '1 teaspoon Ghee and chaat masala'
        ],
        instructions: [
          'Sauté paneer strips and bell peppers with chaat masala in a spoon of ghee.',
          'Warm the whole wheat roti on a tawa.',
          'Spread tangy mint chutney, line with spiced paneer, onions, and peppers.',
          'Roll up tightly in parchment paper for a grab-and-go morning breakfast.'
        ],
        benefits: 'Provides over 22g protein, sustained complex carbs, and essential fats for all-day focus.',
        safety: 'Wrap securely in parchment so teens can eat cleanly on their way to school or college.',
        icon: '🌯'
      },
      {
        id: 'besan_oats_cheela_15_18',
        name: 'Protein-Packed Besan & Sprouted Oats Cheela',
        localName: 'बेसन ओट्स चीला / கடலை மாவு ஓட்ஸ் அடை',
        prepTime: '8 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '1/2 cup Besan & 1/4 cup Powdered oats',
          '2 tablespoons Grated paneer and finely chopped spinach',
          '1/2 teaspoon Ajwain, turmeric, and crushed black pepper',
          '1 teaspoon Oil for pan'
        ],
        instructions: [
          'Mix besan, powdered oats, water, spinach, and spices into a pouring batter.',
          'Spread onto a hot tawa into a crisp crepe.',
          'Sprinkle grated paneer on top, cook both sides until golden brown.',
          'Serve with tomato relish and spiced curd.'
        ],
        benefits: 'High dietary fiber keeps blood sugar steady, avoiding mid-morning sugar crashes.',
        safety: 'Cook over medium flame to ensure chickpea flour cooks thoroughly.',
        icon: '🫓'
      },
      {
        id: 'boiled_egg_sprout_salad_15_18',
        name: 'Morning Sprout & Boiled Egg / Tofu Power Bowl',
        localName: 'अंडा स्प्राउट्स सलाद / முட்டை சுண்டல் கிண்ணம்',
        prepTime: '10 mins',
        cookTime: '8 mins',
        category: 'Morning',
        ingredients: [
          '2 Boiled eggs (sliced) or 100g Firm grilled tofu cubes',
          '1/2 cup Steamed green moong & kala chana sprouts',
          '1/4 cup Diced tomatoes, cucumbers, and fresh mint',
          '1 teaspoon Extra virgin olive oil or ghee & lemon juice'
        ],
        instructions: [
          'Toss steamed sprouts with diced cucumber, tomatoes, and mint.',
          'Dress with lemon juice, a drop of cold-pressed oil, salt, and black pepper.',
          'Arrange boiled egg slices or grilled tofu on top and serve with warm toast.'
        ],
        benefits: 'Pure muscle fuel with high choline for brain neurotransmission and memory recall.',
        safety: 'Boil eggs for 8-10 minutes until yolk is fully set.',
        icon: '🥗'
      },

      // Lunch
      {
        id: 'rajma_masala_quinoa_15_18',
        name: 'Hearty Punjabi Rajma with Quinoa & Brown Rice',
        localName: 'राजमा क्विनोआ / ராஜ்மா சாதம்',
        prepTime: '15 mins',
        cookTime: '25 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Cooked red kidney beans in rich spiced tomato gravy',
          '1 cup Steamed brown rice or quinoa',
          '1/2 cup Crisp kachumber salad and roasted papad',
          '1 tablespoon Fresh coriander & lemon'
        ],
        instructions: [
          'Slow simmer boiled kidney beans with ginger, garlic, tomatoes, and aromatic Indian spices.',
          'Serve steaming hot over fluffy brown rice or quinoa.',
          'Pair with crunchy cucumber salad and roasted papad.'
        ],
        benefits: 'Delivers 20g+ complete protein, slow-burning carbs, and high dietary potassium.',
        safety: 'Cook rajma until completely soft to aid protein assimilation.',
        icon: '🍛'
      },
      {
        id: 'chole_multigrain_bhature_healthy_15_18',
        name: 'Homestyle Chole with Baked Multigrain Kulcha',
        localName: 'होममेड छोले कुल्चा / சுண்டல் குல்சா',
        prepTime: '15 mins',
        cookTime: '25 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Cooked kabuli chana in dark amla-tea infused gravy',
          '2 Whole wheat or multigrain kulchas (tawa toasted)',
          'Pickled onions and green mint chutney'
        ],
        instructions: [
          'Simmer chickpeas with anar dana (pomegranate seeds) and garam masala for deep flavor.',
          'Toast multigrain kulcha with a light brushing of ghee.',
          'Serve with sirka (vinegar) onions and spicy mint dip.'
        ],
        benefits: 'High iron absorption enhanced by natural vitamin C from amla and pomegranate.',
        safety: 'Lightly toast on tawa with ghee instead of deep-frying.',
        icon: '🍲'
      },
      {
        id: 'soya_matar_biryani_15_18',
        name: 'Fragrant Soya & Vegetable Dum Biryani',
        localName: 'सोया वेज बिरयानी / சோயா பிரியாணி',
        prepTime: '15 mins',
        cookTime: '20 mins',
        category: 'Lunch',
        ingredients: [
          '1 cup Soya chunks, marinated in curd and biryani spices',
          '1 cup Long-grain basmati rice',
          '1/2 cup Sliced onions, carrots, and sweet peas',
          '1/2 cup Mint-cucumber raita'
        ],
        instructions: [
          'Sauté sliced onions until golden. Add marinated soya chunks and veggies.',
          'Layer partially cooked basmati rice over the soya curry, seal pot, and dum-cook for 12 mins.',
          'Gently fluff and serve with cooling cucumber raita.'
        ],
        benefits: 'One of the highest vegetarian protein density dishes, excellent for sports teens.',
        safety: 'Squeeze soaked soya chunks completely before marinating for top texture.',
        icon: '🍛'
      },

      // Dinner
      {
        id: 'dal_palak_bajra_bhakri_15_18',
        name: 'Dal Palak with Traditional Bajra or Jowar Roti',
        localName: 'दाल पालक बाजरा रोटी / கீரை பருப்பு கம்பு ரொட்டி',
        prepTime: '15 mins',
        cookTime: '20 mins',
        category: 'Dinner',
        ingredients: [
          '1 cup Yellow dal cooked with fresh chopped spinach',
          '1-2 Freshly made Bajra (pearl millet) or Jowar (sorghum) rotis',
          '1 teaspoon Desi ghee with garlic-jeera tempering',
          '1 Slice of fresh lemon and jaggery cube'
        ],
        instructions: [
          'Cook toor dal and fresh spinach until tender. Temper with roasted garlic and cumin in ghee.',
          'Flatten pearl millet flour on a board into rustic thin bhakris and cook on hot tawa.',
          'Brush bhakri with ghee and serve with hot dal palak and a tiny cube of jaggery.'
        ],
        benefits: 'Ancient Indian millets provide zinc, iron, magnesium, and insoluble fiber for stamina.',
        safety: 'Eat millets warm with ghee for effortless digestion.',
        icon: '🫓'
      },
      {
        id: 'tawa_paneer_tikka_bowl_15_18',
        name: 'Spiced Paneer Tikka Rice Bowl with Green Chutney',
        localName: 'पनीर टिक्का राइस बाउल / பன்னீர் டிக்கா சாதக் கிண்ணம்',
        prepTime: '12 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '120g Fresh paneer cubes, spiced & seared',
          '1 cup Steamed jeera rice or quinoa',
          '1/2 cup Grilled onions, capsicum, and lemon juice',
          '2 tablespoons Mint-yogurt dressing'
        ],
        instructions: [
          'Pan-sear marinated paneer cubes and peppers until blistered and golden.',
          'Assemble over a bed of warm jeera rice.',
          'Drizzle refreshing mint yogurt chutney over the top.'
        ],
        benefits: 'High protein dinner that repairs muscles and keeps teens satiated without late-night junk cravings.',
        safety: 'Use non-stick or cast-iron tawa to minimize excess cooking oils.',
        icon: '🍲'
      },
      {
        id: 'moong_dal_soup_toast_15_18',
        name: 'Light Yellow Moong Clear Soup with Multigrain Toast',
        localName: 'मूंग दाल सूप / பாசிப்பருப்பு சூப்',
        prepTime: '5 mins',
        cookTime: '15 mins',
        category: 'Dinner',
        ingredients: [
          '1/2 cup Yellow moong dal',
          '1/4 teaspoon Turmeric, crushed black pepper, and cumin',
          '1 teaspoon Ghee & squeeze of fresh lemon',
          '1 slice Whole wheat garlic toast'
        ],
        instructions: [
          'Pressure cook moong dal with 3 cups of water and turmeric until completely dissolved.',
          'Whisk smoothly into a clear, soothing soup.',
          'Add a hot tadka of ghee, cumin, and black pepper. Finish with lemon juice.',
          'Serve with warm whole wheat garlic toast.'
        ],
        benefits: 'Ultimate light digestive supper during intensive late-night study sessions and exam weeks.',
        safety: 'Serve hot and comforting.',
        icon: '🍵'
      },

      // Snacks & Healthy Desserts
      {
        id: 'roasted_chickpea_chaat_15_18',
        name: 'Chatpata Roasted Chana & Peanut Mix',
        localName: 'भुना चना चाट / வறுத்த கடலை சாட்',
        prepTime: '5 mins',
        cookTime: '0 mins',
        category: 'Snacks',
        ingredients: [
          '1/2 cup Roasted Bengal gram with skin (bhuna chana)',
          '1/4 cup Roasted peanuts and almonds',
          '1/4 cup Chopped onions, tomatoes, green coriander',
          '1 teaspoon Chaat masala & fresh lemon juice'
        ],
        instructions: [
          'Toss roasted chana, peanuts, and almonds in a bowl.',
          'Add chopped onions, tomatoes, coriander, chaat masala, and fresh lemon.',
          'Mix thoroughly for an instant high-protein crunchy study snack.'
        ],
        benefits: 'Skin-on roasted chana delivers huge fiber, zero cholesterol, and curbs junk cravings.',
        safety: 'Eat freshly made so the chana maintains its satisfying crunch.',
        icon: '🍿'
      },
      {
        id: 'badam_anjeer_doodh_15_18',
        name: 'Warm Almond & Dried Fig (Anjeer) Milk',
        localName: 'बादाम अंजीर दूध / அத்திப்பழ பாதாம் பால்',
        prepTime: '5 mins',
        cookTime: '8 mins',
        category: 'Snacks',
        ingredients: [
          '1.5 cups Milk',
          '2 Dried figs (anjeer), soaked & chopped',
          '6 Crushed almonds',
          'Pinch of Saffron & cardamom'
        ],
        instructions: [
          'Chop soaked figs into tiny pieces.',
          'Simmer milk with chopped figs, crushed almonds, and cardamom for 8 minutes.',
          'Pour into a mug and drink warm before sleep.'
        ],
        benefits: 'Rich in iron, magnesium, and natural melatonin for deep mental relaxation and memory consolidation.',
        safety: 'Soak figs for 20 minutes in warm water before chopping.',
        icon: '🥛'
      },
      {
        id: 'dryfruit_peanut_chikki_15_18',
        name: 'Nutty Peanut & Jaggery Energy Chikki',
        localName: 'मूंगफली गुड़ चिक्की / கடலை மிட்டாய்',
        prepTime: '5 mins',
        cookTime: '10 mins',
        category: 'Snacks',
        ingredients: [
          '1 cup Roasted split peanuts',
          '3/4 cup Organic jaggery (gud)',
          '1 teaspoon Ghee'
        ],
        instructions: [
          'Melt jaggery with 1 tsp ghee on low heat until it reaches hard-ball consistency.',
          'Stir in roasted peanuts quickly.',
          'Pour onto greased parchment, roll flat with a rolling pin, and score into squares.',
          'Let cool completely into brittle crunchy squares.'
        ],
        benefits: 'Fast, clean plant fuel with zero artificial sugars or palm oils.',
        safety: 'Allow to cool completely before snapping into crisp squares.',
        icon: '🍬'
      }
    ]
  }
];
