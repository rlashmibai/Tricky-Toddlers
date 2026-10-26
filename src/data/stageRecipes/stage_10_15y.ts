import { Recipe, AgeGroupData } from '../foodGuideData';

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
      localName: "\u0938\u0924\u094d\u0924\u0942 \u092a\u0930\u093e\u0920\u093e / \u0b9a\u0ba4\u0bcd\u0ba4\u0bc1 \u0bae\u0bbe\u0bb5\u0bc1 \u0baa\u0bb0\u0bcb\u0b9f\u0bcd\u0b9f\u0bbe",
      prepTime: "15 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Whole wheat flour dough",
        "1/2 cup Roasted Bengal gram flour (sattu)",
        "1 tablespoon Chopped coriander",
        "onions",
        "and ajwain",
        "1 teaspoon Mustard oil and lemon juice for stuffing",
        "1 teaspoon Ghee for pan roasting"
      ],
      instructions: [
        "Mix sattu with chopped onion, coriander, ajwain, lemon juice, and a drop of mustard oil.",
        "Stuff a ball of whole wheat dough with 2 tbsp of sattu filling.",
        "Roll gently and roast on tawa with ghee until crisp and aromatic.",
        "Serve with mint chutney and fresh curd."
      ],
      benefits: "Sattu is a powerhouse of native plant protein and iron, sustaining energy for hours.",
      safety: "Do not overfill dough ball to prevent tearing while rolling.",
      icon: "\ud83e\uded3"
    },
    {
      id: '10_15_years_rec_2',
      name: "High-Protein Paneer or Egg Bhurji Multigrain Toast",
      localName: "\u092a\u0928\u0940\u0930/\u0905\u0902\u0921\u093e \u092d\u0941\u0930\u094d\u091c\u0940 \u091f\u094b\u0938\u094d\u091f / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0bae\u0bc1\u0b9f\u0bcd\u0b9f\u0bc8 \u0b9f\u0bcb\u0bb8\u0bcd\u0b9f\u0bcd",
      prepTime: "8 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "2 Organic eggs or 100g Fresh paneer",
        "1 Finely chopped onion",
        "tomato",
        "and green bell pepper",
        "2 slices Toasted multigrain sourdough or bread",
        "1 teaspoon Butter",
        "cumin",
        "and turmeric"
      ],
      instructions: [
        "Saut\u00e9 cumin, onions, tomatoes, and bell peppers in butter.",
        "Whisk eggs or crumble paneer and scramble on medium heat for 3-4 minutes.",
        "Season with mild black pepper, turmeric, and fresh coriander.",
        "Mound generously over toasted multigrain bread."
      ],
      benefits: "Delivers 18-20g of complete biological protein to kickstart academic mornings.",
      safety: "Cook eggs thoroughly; keep paneer tender without rubberiness.",
      icon: "\ud83c\udf73"
    },
    {
      id: '10_15_years_rec_3',
      name: "Savory Vegetable & Sprout Masala Oats",
      localName: "\u092e\u0938\u093e\u0932\u093e \u0913\u091f\u094d\u0938 / \u0bae\u0b9a\u0bbe\u0bb2\u0bbe \u0b93\u0b9f\u0bcd\u0bb8\u0bcd",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Rolled oats",
        "1/4 cup Steamed moong sprouts & sweet corn",
        "1/2 teaspoon Cumin",
        "turmeric",
        "and pinch of black pepper",
        "1.5 cups Water and fresh coriander"
      ],
      instructions: [
        "Saut\u00e9 cumin and veggies in half a teaspoon of ghee.",
        "Add rolled oats, sprouts, water, and mild turmeric.",
        "Simmer for 6-8 minutes until thick, porridge-like, and comforting.",
        "Top with freshly chopped coriander and a drop of lemon juice."
      ],
      benefits: "Beta-glucan fibers support metabolic health and prevent mid-morning fatigue.",
      safety: "Ensure oats are cooked until completely soft.",
      icon: "\ud83e\udd63"
    },
    {
      id: '10_15_years_rec_4',
      name: "Protein-Rich Chole Bowl with Brown Rice & Salad",
      localName: "\u091b\u094b\u0932\u0947 \u092c\u094d\u0930\u093e\u0909\u0928 \u0930\u093e\u0907\u0938 / \u0b95\u0bca\u0ba3\u0bcd\u0b9f\u0b95\u0bcd\u0b95\u0b9f\u0bb2\u0bc8 \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "15 mins",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "3/4 cup Soaked boiled chickpeas (chana)",
        "1 cup Steamed brown rice or basmati",
        "1 Onion-tomato masala gravy with ginger",
        "garlic",
        "and cumin",
        "1/2 cup Onion rings",
        "cucumber",
        "and lemon"
      ],
      instructions: [
        "Pressure cook soaked chickpeas with a tea bag or bay leaf until tender.",
        "Simmer in rich onion, tomato, ginger, garlic, and coriander spice gravy for 15 mins.",
        "Serve with steaming brown rice and a side of fresh crunchy salad."
      ],
      benefits: "Ideal pre-teen muscle-building lunch with 15g protein and slow-digesting carbs.",
      safety: "Ensure chickpeas are well-cooked to prevent bloating.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '10_15_years_rec_5',
      name: "Homestyle Low-Fat Dal Makhani with Phulka",
      localName: "\u0918\u0930 \u0915\u0940 \u0926\u093e\u0932 \u092e\u0916\u0928\u0940 / \u0baa\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1 \u0bae\u0b95\u0bcd\u0b95\u0bbe\u0ba9\u0bbf",
      prepTime: "15 mins",
      cookTime: "30 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Whole black urad dal & kidney beans",
        "1 Tomato puree and ginger-garlic paste",
        "1 tablespoon Fresh cream or milk & 1 tsp butter (low fat homestyle)",
        "2 Soft whole wheat phulkas"
      ],
      instructions: [
        "Slow cook black dal and rajma until meltingly soft.",
        "Simmer with fresh tomato puree and ginger for 20 minutes.",
        "Finish with a splash of milk and 1 tsp butter instead of heavy restaurant cream.",
        "Serve with hot phulkas and onion salad."
      ],
      benefits: "High iron, calcium, and plant protein without saturated heavy restaurant fats.",
      safety: "Slow cooking makes black urad dal light on digestion.",
      icon: "\ud83c\udf72"
    },
    {
      id: '10_15_years_rec_6',
      name: "Garden Palak Paneer with Brown Rice Pulao",
      localName: "\u092a\u093e\u0932\u0915 \u092a\u0928\u0940\u0930 \u092a\u0941\u0932\u093e\u0935 / \u0baa\u0bbe\u0bb2\u0b95\u0bcd \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0baa\u0bc1\u0bb2\u0bbe\u0bb5\u0bcd",
      prepTime: "12 mins",
      cookTime: "18 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups Blanched spinach puree",
        "100g Firm fresh paneer cubes",
        "1 cup Cooked jeera brown rice",
        "1 teaspoon Ghee",
        "garlic",
        "and mild spices"
      ],
      instructions: [
        "Saut\u00e9 golden minced garlic in ghee, then add vibrant green spinach puree.",
        "Simmer with mild spices and fold in paneer cubes.",
        "Serve with warm cumin-scented brown rice and fresh salad."
      ],
      benefits: "Delivers essential magnesium, zinc, and calcium for teenage bone mineralization.",
      safety: "Wash spinach leaves thoroughly before blanching.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '10_15_years_rec_7',
      name: "Panchmel Dal (5 Lentils) with Multigrain Roti",
      localName: "\u092a\u0902\u091a\u092e\u0947\u0932 \u0926\u093e\u0932 \u0930\u094b\u091f\u0940 / \u0baa\u0b9e\u0bcd\u0b9a \u0baa\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1 \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "20 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Mixed lentils (Moong",
        "Masoor",
        "Toor",
        "Chana",
        "Urad)",
        "1 Tomato",
        "ginger",
        "and cumin tadka in ghee",
        "2 Warm multigrain rotis",
        "1/2 cup Fresh cucumber kachumber"
      ],
      instructions: [
        "Pressure cook the 5-lentil mix with turmeric and salt until tender.",
        "Temper with ghee, cumin seeds, ginger, and fresh tomatoes.",
        "Whisk dal and serve warm with multigrain rotis."
      ],
      benefits: "Complete amino acid profile from 5 distinct lentils supports rapid growth and tissue repair.",
      safety: "Whisk well so the dal is smooth and comforting.",
      icon: "\ud83c\udf72"
    },
    {
      id: '10_15_years_rec_8',
      name: "High-Protein Soya Chunk & Pea Curry with Rice",
      localName: "\u0938\u094b\u092f\u093e \u091a\u0902\u0915\u094d\u0938 \u0915\u0930\u0940 / \u0b9a\u0bcb\u0baf\u0bbe \u0b95\u0bc1\u0bb4\u0bae\u0bcd\u0baa\u0bc1",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Soya chunks",
        "boiled and squeezed",
        "1/4 cup Sweet green peas",
        "1 cup Steamed rice or 2 rotis",
        "1 Onion-tomato ginger gravy"
      ],
      instructions: [
        "Boil soya chunks in water with a pinch of salt. Rinse in cold water and squeeze dry.",
        "Saut\u00e9 onions, tomatoes, and peas in a pan with mild spices.",
        "Add soya chunks and 1 cup water. Simmer for 10 minutes so chunks absorb flavors.",
        "Serve with hot rice or rotis."
      ],
      benefits: "Contains over 50% protein by weight, ideal for sports recovery and teenage energy.",
      safety: "Squeeze out boiling water thoroughly to ensure soft, juicy texture.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '10_15_years_rec_9',
      name: "Gujarati Spiced Kadhi with Moong Khichdi",
      localName: "\u0915\u0922\u093c\u0940 \u0916\u093f\u091a\u0921\u093c\u0940 / \u0bae\u0bcb\u0bb0\u0bcd \u0b95\u0bc1\u0bb4\u0bae\u0bcd\u0baa\u0bc1 \u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0b9f\u0bbf",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Warm moong dal khichdi",
        "1 cup Besan and buttermilk kadhi",
        "1/2 teaspoon Mustard",
        "methi seeds",
        "and curry leaf tadka"
      ],
      instructions: [
        "Whisk fresh curd and besan with water and turmeric until smooth.",
        "Simmer with a tempering of mustard, fenugreek seeds, and curry leaves.",
        "Pour warm, soothing kadhi over freshly cooked moong dal khichdi."
      ],
      benefits: "Aids evening digestion, calms the nervous system, and provides probiotics.",
      safety: "Keep kadhi on medium heat and stir constantly so it does not split.",
      icon: "\ud83e\udd63"
    },
    {
      id: '10_15_years_rec_10',
      name: "Zesty Peanut & Kala Chana Chaat",
      localName: "\u091a\u0928\u093e \u092e\u0942\u0902\u0917\u092b\u0932\u0940 \u091a\u093e\u091f / \u0bb5\u0bc7\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0b9f\u0bb2\u0bc8 \u0b9a\u0bc1\u0ba3\u0bcd\u0b9f\u0bb2\u0bcd",
      prepTime: "8 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Boiled brown chickpeas (kala chana)",
        "1/4 cup Roasted peanuts",
        "1/4 cup Diced cucumber",
        "onions",
        "and tomatoes",
        "1 tablespoon Fresh lemon juice",
        "chaat masala",
        "and mint"
      ],
      instructions: [
        "Combine warm boiled kala chana with roasted crunchy peanuts.",
        "Toss with diced fresh veggies, chaat masala, and lemon juice.",
        "Serve in a bowl with toothpicks or small spoons."
      ],
      benefits: "Super-rich in plant iron, dietary fiber, and healthy monounsaturated fats.",
      safety: "Ensure chickpeas are well-boiled.",
      icon: "\ud83e\udd57"
    },
    {
      id: '10_15_years_rec_11',
      name: "Tawa-Grilled Herb Paneer Tikka Cubes",
      localName: "\u092a\u0928\u0940\u0930 \u091f\u093f\u0915\u094d\u0915\u093e / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0b9f\u0bbf\u0b95\u0bcd\u0b95\u0bbe",
      prepTime: "15 mins",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "150g Fresh paneer",
        "cut into 1-inch cubes",
        "1/4 cup Hung curd (Greek yogurt) marinade with kasuri methi & ajwain",
        "1/2 Diced bell peppers and onions",
        "1 teaspoon Mustard oil"
      ],
      instructions: [
        "Marinate paneer cubes and veggies in spiced curd and mustard oil for 15 minutes.",
        "Sear on a hot tawa with a few drops of oil until charred golden on all sides.",
        "Sprinkle chaat masala and fresh coriander."
      ],
      benefits: "Provides instant protein recovery after school sports or dance rehearsals.",
      safety: "Use toothpicks or child-safe skewers without sharp points.",
      icon: "\ud83c\udf62"
    },
    {
      id: '10_15_years_rec_12',
      name: "Ragi & Roasted Sesame Calcium Balls",
      localName: "\u0930\u093e\u0917\u0940 \u0924\u093f\u0932 \u0932\u0921\u094d\u0921\u0942 / \u0bb0\u0bbe\u0b95\u0bbf \u0b8e\u0bb3\u0bcd\u0bb3\u0bc1 \u0b89\u0bb0\u0bc1\u0ba3\u0bcd\u0b9f\u0bc8",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Ragi flour",
        "roasted",
        "2 tablespoons White sesame seeds (til)",
        "roasted",
        "3 tablespoons Organic jaggery powder",
        "1.5 tablespoons Pure desi ghee"
      ],
      instructions: [
        "Roast ragi flour in ghee on low flame until aromatic (6 mins).",
        "Add roasted sesame seeds and jaggery powder. Mix while warm.",
        "Roll into golf-ball-sized laddoos while warm."
      ],
      benefits: "Highest natural vegetarian calcium source for teenage skeletal bone density.",
      safety: "Store in an airtight jar for up to 2 weeks.",
      icon: "\ud83e\uddc6"
    },
    {
      id: '10_15_years_rec_13',
      name: "Nutty Banana & Chia Seed Power Shake",
      localName: "\u092c\u0928\u093e\u0928\u093e \u092a\u0940\u0ba9\u091f \u0936\u0947\u0915 / \u0bb5\u0bbe\u0bb4\u0bc8\u0baa\u0bcd\u0baa\u0bb4 \u0bb8\u0bcd\u0bae\u0bc2\u0ba4\u0bcd\u0ba4\u0bbf",
      prepTime: "5 mins",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 Large ripe banana",
        "1 cup Cold milk or almond milk",
        "1 tablespoon Natural unsweetened peanut butter",
        "1 teaspoon Soaked chia seeds",
        "1 Soft date for natural sweetness"
      ],
      instructions: [
        "Blend banana, milk, peanut butter, and date until thick and frosty.",
        "Stir in pre-soaked chia seeds.",
        "Pour into a tall sports glass and drink after evening training."
      ],
      benefits: "Replenishes glycogen stores, delivers potassium, and provides omega-3 fatty acids.",
      safety: "Soak chia seeds for at least 15 minutes before adding to shake.",
      icon: "\ud83e\udd64"
    },
    {
      id: '10_15_years_rec_14',
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
      id: '10_15_years_rec_15',
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
      id: '10_15_years_rec_16',
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
      id: '10_15_years_rec_17',
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
      id: '10_15_years_rec_18',
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
      id: '10_15_years_rec_19',
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
      id: '10_15_years_rec_20',
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
      id: '10_15_years_rec_21',
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
      id: '10_15_years_rec_22',
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
      id: '10_15_years_rec_23',
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
      id: '10_15_years_rec_24',
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
      id: '10_15_years_rec_25',
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
      id: '10_15_years_rec_26',
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
      id: '10_15_years_rec_27',
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
      id: '10_15_years_rec_28',
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
