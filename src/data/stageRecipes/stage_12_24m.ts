import { Recipe, AgeGroupData } from '../foodGuideData';

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
      localName: "\u0938\u092c\u094d\u091c\u0940 \u0909\u092a\u092e\u093e / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b89\u0baa\u0bcd\u0baa\u0bc1\u0bae\u0bbe",
      prepTime: "10 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3 tablespoons Semolina (Rava)",
        "1 tablespoon Finely chopped boiled Peas & Carrots",
        "1/4 teaspoon Ghee",
        "A pinch of Mustard seeds and Curry leaf",
        "1/4 teaspoon Salt"
      ],
      instructions: [
        "Dry roast rava in a pan on low heat until slightly fragrant. Set aside.",
        "Heat ghee, add mustard seeds and a curry leaf. Add chopped veggies and saut\u00e9.",
        "Pour in 1 cup of water and salt, bringing it to a boil.",
        "Slowly add rava while stirring continuously to prevent clumps. Cover and cook on low for 3 mins."
      ],
      benefits: "Iron-rich, easy-to-chew savory cereal filled with colorful, vitamins-loaded veggies.",
      safety: "Chop peas and carrots into tiny, soft-boiled pieces. Remove curry leaf before serving.",
      icon: "\ud83c\udf3e"
    },
    {
      id: '12_24_months_rec_2',
      name: "Soft Ghee-brushed Aloo Paratha",
      localName: "\u0928\u0930\u092e \u0906\u0932\u0942 \u092a\u0930\u093e\u0920\u093e / \u0bae\u0bc6\u0ba9\u0bcd\u0bae\u0bc8\u0baf\u0bbe\u0ba9 \u0b89\u0bb0\u0bc1\u0bb3\u0bc8\u0b95\u0bcd\u0b95\u0bbf\u0bb4\u0b99\u0bcd\u0b95\u0bc1 \u0baa\u0bb0\u0bcb\u0b9f\u0bcd\u0b9f\u0bbe",
      prepTime: "15 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Whole Wheat Flour",
        "1/4 cup Boiled Mashed Potato",
        "A pinch of Cumin powder",
        "Coriander powder",
        "and Salt",
        "1/2 teaspoon Ghee"
      ],
      instructions: [
        "Knead flour and water into a very soft dough. Rest for 10 minutes.",
        "Mash the potato with a pinch of cumin, coriander, and salt.",
        "Roll out a small dough ball, stuff with potato, roll gently, and roast on hot tawa brushing with ghee until soft and golden."
      ],
      benefits: "Packed with clean carbohydrates, healthy fats, and dietary fiber for energetic toddlers.",
      safety: "Brush with ghee to keep it very soft. Cut into thin, manageable strips for easy self-feeding.",
      icon: "\ud83e\uded3"
    },
    {
      id: '12_24_months_rec_3',
      name: "Creamy Oats & Berry Porridge",
      localName: "\u0913\u091f\u094d\u0938 \u0914\u0930 \u092c\u0947\u0930\u0940 \u0926\u0932\u093f\u092f\u093e / \u0b93\u0b9f\u0bcd\u0bb8\u0bcd \u0baa\u0bc6\u0bb0\u0bcd\u0bb0\u0bbf \u0b95\u0b9e\u0bcd\u0b9a\u0bbf",
      prepTime: "5 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3 tablespoons Rolled Oats",
        "1/2 cup Milk (Cow\\'s milk or Breastmilk)",
        "1 tablespoon Finely chopped Strawberries/Blueberries",
        "1/2 teaspoon Honey or Jaggery (Optional)"
      ],
      instructions: [
        "Cook oats in milk and water over medium heat for 5-6 minutes until soft and creamy.",
        "Stir in the finely chopped berries and honey.",
        "Let it simmer for 1 more minute, then cool and serve warm."
      ],
      benefits: "High in antioxidants, calcium, and beta-glucan fiber which helps sustain energy.",
      safety: "Honey is now perfectly safe for toddlers over 12 months. Do not feed honey to babies under 1 year.",
      icon: "\ud83e\udd63"
    },
    {
      id: '12_24_months_rec_4',
      name: "Mini Steamed Veggie Uttapams",
      localName: "\u092e\u093f\u0928\u0940 \u0909\u0924\u094d\u0924\u092a\u092e / \u0bae\u0bbf\u0ba9\u0bbf \u0b8a\u0ba4\u0bcd\u0ba4\u0baa\u0bcd\u0baa\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup fermented Dosa Batter",
        "2 tablespoons finely grated carrot and beetroot",
        "1/4 teaspoon Ghee"
      ],
      instructions: [
        "Heat a griddle and grease with ghee. Pour small circles of dosa batter.",
        "Sprinkle the grated carrots and beets on top of each mini pancake.",
        "Drizzle ghee, flip, and cook well on both sides until soft and spongy."
      ],
      benefits: "Fermented foods are wonderful for digestion and gut flora. Spongy texture is fun to hold.",
      safety: "Ensure veggies are finely grated so they cook thoroughly and become soft.",
      icon: "\ud83e\udd5e"
    },
    {
      id: '12_24_months_rec_5',
      name: "Mild Palak Paneer with Soft Steamed Rice",
      localName: "\u092a\u093e\u0932\u0915 \u092a\u0928\u0940\u0930 \u091a\u093e\u0935\u0932 / \u0baa\u0bbe\u0bb2\u0b95\u0bcd \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "12 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Boiled Rice",
        "1/4 cup Mild Spinach Pur\u00e9e",
        "2 tablespoons Soft Paneer cubes",
        "1/4 teaspoon Ghee and pinch of Cumin"
      ],
      instructions: [
        "Warm ghee in a pan, toss paneer cubes and spinach puree gently.",
        "Stir in soft cooked rice and a pinch of salt.",
        "Simmer for 2 minutes and serve warm with a spoonful of yogurt."
      ],
      benefits: "Rich in iron, vitamin K, and bone-building calcium.",
      safety: "Ensure paneer cubes are soft and manageable for toddler teeth.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '12_24_months_rec_6',
      name: "Crispy Sprouted Ragi & Ghee Dosa",
      localName: "\u0930\u093e\u0917\u0940 \u0921\u094b\u0938\u093e / \u0bb0\u0bbe\u0b95\u0bbf \u0ba4\u0bcb\u0b9a\u0bc8",
      prepTime: "5 mins",
      cookTime: "6 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Sprouted Ragi flour and rice batter",
        "1/2 teaspoon Ghee",
        "Pinch of Salt"
      ],
      instructions: [
        "Mix ragi batter with a pinch of salt and water to pouring consistency.",
        "Pour thin circle on a hot tawa and drizzle ghee.",
        "Flip when golden and serve with mild coconut chutney."
      ],
      benefits: "Superior calcium content builds strong toddler bones and teeth.",
      safety: "Serve rolled or cut into strips for easy handling.",
      icon: "\ud83c\udf2f"
    },
    {
      id: '12_24_months_rec_7',
      name: "Soft Gujarati Methi Thepla Strips",
      localName: "\u092e\u0947\u0925\u0940 \u0925\u0947\u092a\u0932\u093e / \u0bb5\u0bc6\u0ba8\u0bcd\u0ba4\u0baf\u0b95\u0bcd\u0b95\u0bc0\u0bb0\u0bc8 \u0b9a\u0baa\u0bcd\u0baa\u0bbe\u0ba4\u0bcd\u0ba4\u0bbf",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Whole wheat flour",
        "2 tablespoons Finely chopped fresh Methi leaves",
        "1 tablespoon Fresh curd (for softness)",
        "Pinch of Turmeric",
        "Cumin",
        "and Ghee"
      ],
      instructions: [
        "Knead flour, methi, curd, and spices into a very soft pliable dough.",
        "Roll thin and roast quickly on high heat brushing with ghee so it remains super soft.",
        "Cut into finger strips."
      ],
      benefits: "Fenugreek leaves provide iron, minerals, and aid healthy gut digestion.",
      safety: "Cook quickly on hot tawa so it stays tender and does not harden.",
      icon: "\ud83e\uded3"
    },
    {
      id: '12_24_months_rec_8',
      name: "Soft Stewed Rajma & Rice Bowl",
      localName: "\u0930\u093e\u091c\u092e\u093e \u091a\u093e\u0935\u0932 / \u0bb0\u0bbe\u0b9c\u0bcd\u0bae\u0bbe \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "20 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup Overcooked soft Rajma (Kidney beans)",
        "1/2 cup Soft steamed rice",
        "1/4 teaspoon Ghee and pinch of Cumin"
      ],
      instructions: [
        "Pressure cook soaked rajma until totally soft and squishy.",
        "Mash beans slightly with gravy and fold into warm rice with ghee.",
        "Serve at a warm, pleasant temperature."
      ],
      benefits: "Excellent source of complex carbs, zinc, and muscle-strengthening plant protein.",
      safety: "Always mash the kidney beans so no tough skins or round shapes remain.",
      icon: "\ud83e\udd63"
    },
    {
      id: '12_24_months_rec_9',
      name: "Wholesome Cracked Wheat Veggie Khichdi",
      localName: "\u0926\u0932\u093f\u092f\u093e \u0935\u0947\u091c \u0916\u093f\u091a\u0921\u093c\u0940 / \u0b95\u0bcb\u0ba4\u0bc1\u0bae\u0bc8 \u0bb0\u0bb5\u0bc8 \u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0b9f\u0bbf",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup Roasted Dalia",
        "2 tablespoons Moong Dal",
        "2 tablespoons Chopped beans & carrots",
        "1/2 teaspoon Ghee"
      ],
      instructions: [
        "Pressure cook dalia, dal, and vegetables with water for 3-4 whistles.",
        "Open cooker and stir vigorously with ghee to create a comforting thick porridge.",
        "Serve with fresh home curd."
      ],
      benefits: "Sustained energy release without glycemic spikes, keeping toddlers active.",
      safety: "Cook until cracked wheat is soft and fluffy.",
      icon: "\ud83c\udf72"
    },
    {
      id: '12_24_months_rec_10',
      name: "Jaggery Sweetened Whole Wheat Banana Muffin",
      localName: "\u0915\u0947\u0932\u093e \u092e\u092b\u093f\u0928 / \u0bb5\u0bbe\u0bb4\u0bc8\u0baa\u0bcd\u0baa\u0bb4\u0bae\u0bcd \u0bae\u0b83\u0baa\u0bbf\u0ba9\u0bcd",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Whole wheat flour",
        "1 Ripe Banana (mashed)",
        "1 tablespoon Jaggery powder",
        "1 tablespoon Melted butter or Ghee",
        "1/4 cup Milk"
      ],
      instructions: [
        "Whisk mashed banana, jaggery, and melted butter together.",
        "Fold in flour and milk to make a thick batter.",
        "Spoon into muffin cups and steam or bake for 15 minutes until spongy."
      ],
      benefits: "Completely refined-sugar free snack loaded with potassium and wholesome grains.",
      safety: "Let muffins cool completely before offering in bite sizes.",
      icon: "\ud83e\uddc1"
    },
    {
      id: '12_24_months_rec_11',
      name: "Soft Multigrain Khichdi with Ghee",
      localName: "\u092e\u0932\u094d\u091f\u0940\u0917\u094d\u0930\u0947\u0928 \u0916\u093f\u091a\u0921\u093c\u0940 / \u0baa\u0bb2\u0ba4\u0bbe\u0ba9\u0bbf\u0baf \u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0b9f\u0bbf",
      prepTime: "8 mins",
      cookTime: "15 mins",
      category: 'Lunch',
      region: 'North',
      ingredients: [
        "Rice and mixed lentils",
        "Chopped carrots & beans",
        "Desi ghee",
        "Pinch of jeera and turmeric"
      ],
      instructions: [
        "Wash grains and lentils; saute cumin and veggies in ghee.",
        "Add 3 cups water and pressure cook for 3 whistles until very soft.",
        "Mash gently and serve with fresh curd."
      ],
      benefits: "Complete vegetarian protein, dietary fiber, and healthy fats.",
      safety: "Ensure vegetables are soft and tender.",
      icon: "\ud83c\udf72"
    },
    {
      id: '12_24_months_rec_12',
      name: "Mild Vegetable Poha with Peas",
      localName: "\u092a\u094b\u0939\u093e / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b85\u0bb5\u0bb2\u0bcd",
      prepTime: "5 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'West',
      ingredients: [
        "Flattened rice (poha)",
        "Steamed peas & potatoes",
        "Turmeric and mustard seeds",
        "Lemon juice"
      ],
      instructions: [
        "Rinse poha and drain.",
        "Saute mild mustard seeds and veggies in ghee.",
        "Toss in softened poha with turmeric and steam covered for 2 minutes."
      ],
      benefits: "Rich in bioavailable non-heme iron and easily digestible complex carbohydrates.",
      safety: "Keep peas soft and mashed for younger eaters.",
      icon: "\ud83e\udd63"
    },
    {
      id: '12_24_months_rec_13',
      name: "Soft Methi Thepla with Curd",
      localName: "\u092e\u0947\u0925\u0940 \u0925\u0947\u092a\u0932\u093e / \u0bb5\u0bc6\u0ba8\u0bcd\u0ba4\u0baf \u0b9a\u0baa\u0bcd\u0baa\u0bbe\u0ba4\u0bcd\u0ba4\u0bbf",
      prepTime: "8 mins",
      cookTime: "6 mins",
      category: 'Morning',
      region: 'West',
      ingredients: [
        "Whole wheat flour (atta)",
        "Fresh chopped methi leaves",
        "Turmeric and ajwain",
        "Desi ghee"
      ],
      instructions: [
        "Knead soft dough with methi, spices, and splash of water.",
        "Roll thin flatbreads and cook on tawa with drops of ghee.",
        "Serve warm with cooling curd."
      ],
      benefits: "High dietary iron, vitamins A & K, and aids natural digestion.",
      safety: "Roll soft and brush with ghee to keep tender.",
      icon: "\ud83e\uded3"
    },
    {
      id: '12_24_months_rec_14',
      name: "Steamed Corn & Veggie Dhokla",
      localName: "\u0935\u0947\u091c \u0922\u094b\u0915\u0932\u093e / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b9f\u0bcb\u0b95\u0bcd\u0bb3\u0bbe",
      prepTime: "8 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'West',
      ingredients: [
        "Besan (gram flour)",
        "Sweet corn puree",
        "Pinch of turmeric",
        "Mild mustard seasoning"
      ],
      instructions: [
        "Mix besan, corn puree, and water into batter.",
        "Steam in greased tray for 12-15 minutes until spongy.",
        "Cut into soft squares and serve warm."
      ],
      benefits: "Light, steamed vegetarian protein with zero oil frying.",
      safety: "Cut into bite-sized portions.",
      icon: "\ud83d\udfe1"
    },
    {
      id: '12_24_months_rec_15',
      name: "Homestyle Yellow Dal Tadka with Phulka",
      localName: "\u0926\u093e\u0932 \u0924\u0921\u093c\u0915\u093e \u092b\u0941\u0932\u094d\u0915\u093e / \u0ba4\u0bbe\u0bb2\u0bcd \u0ba4\u0b9f\u0bcd\u0b95\u0bbe \u0bb0\u0bca\u0b9f\u0bcd\u0b9f\u0bbf",
      prepTime: "8 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'North',
      ingredients: [
        "Toor or moong dal",
        "Ripe tomatoes and cumin",
        "Desi ghee",
        "Soft whole wheat phulka"
      ],
      instructions: [
        "Cook dal with turmeric until tender.",
        "Tempering of jeera and tomatoes in ghee.",
        "Serve warm with soft phulkas torn into pieces."
      ],
      benefits: "Essential amino acids, iron, and sustained dinner comfort.",
      safety: "Tear phulka into soft pieces and dip in warm dal.",
      icon: "\ud83c\udf72"
    },
    {
      id: '12_24_months_rec_16',
      name: "Creamy Curd Rice with Pomegranate",
      localName: "\u0926\u0939\u0940 \u092d\u093e\u0924 / \u0ba4\u0baf\u0bbf\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Lunch',
      region: 'South',
      ingredients: [
        "Soft cooked rice",
        "Fresh home-set dahi (curd)",
        "Mustard & curry leaf tempering in ghee",
        "Pomegranate pearls"
      ],
      instructions: [
        "Mash cooked rice warmly, stir in fresh curd and splash of milk.",
        "Add mild tempering.",
        "Top with sweet juicy pomegranate pearls."
      ],
      benefits: "Active probiotic cultures, gut soothe, and bone calcium.",
      safety: "Ensure pomegranate seeds are soft and easy to chew.",
      icon: "\ud83c\udf5a"
    },
    {
      id: '12_24_months_rec_17',
      name: "Ghee Roasted Makhana (Foxnuts)",
      localName: "\u092d\u0941\u0928\u093e \u092e\u0916\u093e\u0928\u093e / \u0bb5\u0bb1\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bbe\u0bae\u0bb0\u0bc8 \u0bb5\u0bbf\u0ba4\u0bc8",
      prepTime: "2 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'North',
      ingredients: [
        "Foxnuts (phool makhana)",
        "Desi ghee",
        "Pinch of roasted jeera powder"
      ],
      instructions: [
        "Heat ghee in heavy-bottom pan.",
        "Roast makhana on low flame until crisp and crunchy.",
        "Toss with jeera powder."
      ],
      benefits: "Dense calcium, magnesium, and antioxidant fiber snack.",
      safety: "Check each makhana for hardness before serving.",
      icon: "\ud83c\udf7f"
    },
    {
      id: '12_24_months_rec_18',
      name: "Oats & Banana Cinnamon Porridge",
      localName: "\u0913\u091f\u094d\u0938 \u0926\u0932\u093f\u092f\u093e / \u0b93\u0b9f\u0bcd\u0bb8\u0bcd \u0b95\u0b9e\u0bcd\u0b9a\u0bbf",
      prepTime: "3 mins",
      cookTime: "7 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "Rolled oats",
        "Mashed ripe banana",
        "Whole milk or almond milk",
        "Pinch of Ceylon cinnamon"
      ],
      instructions: [
        "Simmer oats in milk until creamy and thick.",
        "Fold in mashed sweet banana and cinnamon.",
        "Serve warm."
      ],
      benefits: "Beta-glucan soluble fiber for healthy cholesterol and sustained energy.",
      safety: "Serve lukewarm, check sweetness naturally from banana.",
      icon: "\ud83e\udd63"
    },
    {
      id: '12_24_months_rec_19',
      name: "Paneer & Green Peas Pulao",
      localName: "\u092a\u0928\u0940\u0930 \u092e\u091f\u0930 \u092a\u0941\u0932\u093e\u0935 / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0baa\u0bc1\u0bb2\u0bbe\u0bb5\u0bcd",
      prepTime: "8 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'North',
      ingredients: [
        "Basmati rice",
        "Fresh paneer cubes",
        "Sweet green peas",
        "Whole mild spices and ghee"
      ],
      instructions: [
        "Saute cumin and paneer cubes in ghee.",
        "Add washed rice, peas, and water.",
        "Pressure cook 2 whistles and fluff with fork."
      ],
      benefits: "Complete dairy protein, complex carbs, and phosphorus.",
      safety: "Cut paneer into small soft cubes.",
      icon: "\ud83c\udf72"
    },
    {
      id: '12_24_months_rec_20',
      name: "Sprouted Ragi Malt Drink",
      localName: "\u0930\u093e\u0917\u0940 \u092e\u093e\u0932\u094d\u091f / \u0bb0\u0bbe\u0b95\u0bbf \u0bae\u0bbe\u0bb2\u0bcd\u0b9f\u0bcd",
      prepTime: "3 mins",
      cookTime: "6 mins",
      category: 'Morning',
      region: 'South',
      ingredients: [
        "Sprouted ragi flour",
        "Warm milk or water",
        "Organic jaggery or date powder",
        "Cardamom"
      ],
      instructions: [
        "Mix ragi flour in cold water until smooth.",
        "Simmer on low heat with milk until glossy.",
        "Flavour with cardamom and jaggery."
      ],
      benefits: "Dense calcium (344 mg/100g) building strong bones and teeth.",
      safety: "Cool down completely before drinking.",
      icon: "\ud83e\udd5b"
    },
    {
      id: '12_24_months_rec_21',
      name: "Carrot Tomato Soup with Croutons",
      localName: "\u0917\u093e\u091c\u0930 \u091f\u092e\u093e\u091f\u0930 \u0938\u0942\u092a / \u0b95\u0bc7\u0bb0\u0b9f\u0bcd \u0ba4\u0b95\u0bcd\u0b95\u0bbe\u0bb3\u0bbf \u0b9a\u0bc2\u0baa\u0bcd",
      prepTime: "8 mins",
      cookTime: "12 mins",
      category: 'Dinner',
      region: 'North',
      ingredients: [
        "Fresh red carrots",
        "Ripe tomatoes",
        "Butter or olive oil",
        "Pinch of black pepper and toast cubes"
      ],
      instructions: [
        "Steam carrots and tomatoes until tender; blend and strain.",
        "Simmer with a dab of butter.",
        "Serve warm with whole wheat croutons."
      ],
      benefits: "Beta-carotene, lycopene, and vitamin C immunity boost.",
      safety: "Ensure soup is not hot; soften croutons in soup.",
      icon: "\ud83c\udf72"
    },
    {
      id: '12_24_months_rec_22',
      name: "Mixed Dry Fruit & Date Ladoo",
      localName: "\u0916\u091c\u0942\u0930 \u0921\u094d\u0930\u093e\u0908 \u092b\u094d\u0930\u0942\u091f \u0932\u0921\u094d\u0921\u0942 / \u0baa\u0bc7\u0bb0\u0bc0\u0b9a\u0bcd\u0b9a\u0bae\u0bcd\u0baa\u0bb4 \u0bb2\u0b9f\u0bcd\u0b9f\u0bc1",
      prepTime: "10 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "Soft seedless dates",
        "Roasted almonds and cashews (powdered)",
        "Desi ghee"
      ],
      instructions: [
        "Saute date puree in ghee until soft.",
        "Mix in powdered roasted nuts.",
        "Roll into mini bite-sized energy balls."
      ],
      benefits: "Concentrated iron, healthy omega fats, and zero refined sugar.",
      safety: "Nuts must be finely ground to prevent choking.",
      icon: "\ud83e\uddc6"
    },
    {
      id: '12_24_months_rec_23',
      name: "Palak Paneer with Soft Steamed Rice",
      localName: "\u092a\u093e\u0932\u0915 \u092a\u0928\u0940\u0930 \u092d\u093e\u0924 / \u0baa\u0bbe\u0bb2\u0b95\u0bcd \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "8 mins",
      cookTime: "12 mins",
      category: 'Lunch',
      region: 'North',
      ingredients: [
        "Fresh spinach leaves (pureed)",
        "Soft paneer cubes",
        "Cumin and ghee",
        "Steamed rice"
      ],
      instructions: [
        "Blanch and puree spinach.",
        "Simmer with paneer cubes and mild cumin ghee.",
        "Mix with soft steamed warm rice."
      ],
      benefits: "Iron, calcium, and folate supporting growth and blood vitality.",
      safety: "Ensure spinach puree is smooth and paneer is soft.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '12_24_months_rec_24',
      name: "Moong Dal Cheela with Mint Curd",
      localName: "\u092e\u0942\u0902\u0917 \u0926\u093e\u0932 \u091a\u0940\u0932\u093e / \u0baa\u0bbe\u0b9a\u0bbf\u0baa\u0bcd\u0baa\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1 \u0b85\u0b9f\u0bc8",
      prepTime: "8 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'North',
      ingredients: [
        "Soaked yellow moong dal batter",
        "Grated carrots and paneer",
        "Desi ghee"
      ],
      instructions: [
        "Spread ladle of moong batter on warm tawa.",
        "Top with grated paneer and drizzle ghee.",
        "Fold golden and slice into finger strips."
      ],
      benefits: "High vegetarian protein and dietary iron.",
      safety: "Slice into soft finger strips for easy chewing.",
      icon: "\ud83e\uded3"
    },
    {
      id: '12_24_months_rec_25',
      name: "Moong Sprout & Sweet Corn Chaat",
      localName: "\u092e\u0942\u0902\u0917 \u0915\u0949\u0930\u094d\u0928 \u091a\u093e\u091f / \u0bae\u0bc1\u0bb3\u0bc8\u0b95\u0b9f\u0bcd\u0b9f\u0bbf\u0baf \u0baa\u0baf\u0bb1\u0bc1 \u0b9a\u0bbe\u0b9f\u0bcd",
      prepTime: "5 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "Steamed sprouted moong",
        "Steamed sweet corn",
        "Pinch of chaat masala & lemon juice"
      ],
      instructions: [
        "Steam sprouted moong and sweet corn until tender.",
        "Toss in a bowl with fresh lemon juice and cumin.",
        "Serve warm or room temperature."
      ],
      benefits: "Bioavailable vitamin C, dietary fiber, and plant protein.",
      safety: "Always steam sprouts thoroughly before serving.",
      icon: "\ud83e\udd57"
    }
  ]
};
