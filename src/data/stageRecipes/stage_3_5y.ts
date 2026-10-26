import { Recipe, AgeGroupData } from '../foodGuideData';

export const stageData_3_5_years: AgeGroupData = {
  id: '3_5_years',
  ageLimit: '3 - 5 Years',
  title: "Preschool Active Explorer",
  guidelines: "Preschoolers need balanced energy for high physical activity, cognitive play, and immune defense. Offer 3 solid meals and 2 nutritious snacks. Keep portions colorful and easy to eat.",
  milestones: [
    "Eats completely independently using regular child spoons and forks.",
    "Enjoys varied textures including crunchy raw cucumber, carrots, and soft rotis.",
    "Develops taste preferences and can help wash veggies or mix batters."
  ],
  recipes: [
    {
      id: '3_5_years_rec_1',
      name: "Fluffy Ragi & Banana Pancakes",
      localName: "\u0930\u093e\u0917\u0940 \u0915\u0947\u0932\u093e \u092a\u0948\u0928\u0915\u0947\u0915 / \u0bb0\u0bbe\u0b95\u0bbf \u0bb5\u0bbe\u0bb4\u0bc8\u0baa\u0bcd\u0baa\u0bb4 \u0b85\u0baa\u0bcd\u0baa\u0bae\u0bcd",
      prepTime: "8 mins",
      cookTime: "7 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Sprouted Ragi flour",
        "1 Ripe mashed banana",
        "1/4 cup Milk",
        "1 teaspoon Jaggery powder",
        "1/2 teaspoon Ghee for pan"
      ],
      instructions: [
        "In a mixing bowl, mash the ripe banana with a fork until smooth.",
        "Whisk in ragi flour, jaggery, and milk until you get a smooth pancake batter.",
        "Heat a tawa with a drop of ghee. Pour small circles of batter.",
        "Cook on medium heat for 2 minutes on each side until cooked through. Serve warm."
      ],
      benefits: "Rich in iron, calcium, and natural fruit sweetness. Keeps active preschoolers energized all morning.",
      safety: "Make small palm-sized pancakes so kids can easily hold and bite them.",
      icon: "\ud83e\udd5e"
    },
    {
      id: '3_5_years_rec_2',
      name: "Stuffed Moong Dal & Paneer Cheela",
      localName: "\u092e\u0942\u0902\u0917 \u0926\u093e\u0932 \u092a\u0928\u0940\u0930 \u091a\u0940\u0932\u093e / \u0baa\u0bbe\u0b9a\u0bbf\u0baa\u0bcd\u0baa\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1 \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0b85\u0b9f\u0bc8",
      prepTime: "10 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Soaked yellow moong dal batter",
        "3 tablespoons Grated fresh paneer",
        "1 tablespoon Finely grated carrots",
        "Pinch of cumin powder and mild salt",
        "1 teaspoon Ghee"
      ],
      instructions: [
        "Blend soaked moong dal into a smooth pouring batter with cumin and a pinch of salt.",
        "Spread a ladle of batter on a warm tawa into a round crepe.",
        "Drizzle a little ghee on edges. Scatter grated paneer and carrot on top.",
        "Fold in half once golden brown and slice into triangles. Serve with curd."
      ],
      benefits: "High vegetarian protein from moong dal and paneer supports muscle growth and steady attention in preschool.",
      safety: "Keep spices very gentle and avoid whole peppercorns.",
      icon: "\ud83e\uded3"
    },
    {
      id: '3_5_years_rec_3',
      name: "Steamed Vegetable Oats Mini Idlis",
      localName: "\u0913\u091f\u094d\u0938 \u0935\u0947\u091c \u0907\u0921\u0932\u0940 / \u0b93\u0b9f\u0bcd\u0bb8\u0bcd \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b87\u0b9f\u0bcd\u0bb2\u0bbf",
      prepTime: "10 mins",
      cookTime: "12 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Powdered roasted oats",
        "1/4 cup Curd (yogurt)",
        "2 tablespoons Grated carrot & green peas",
        "1/4 teaspoon Mustard seeds and curry leaves tempering"
      ],
      instructions: [
        "Mix powdered oats, curd, water, and veggies into an idli batter.",
        "Let batter rest for 5 minutes. Spoon into greased mini idli moulds.",
        "Steam for 10-12 minutes until a toothpick inserted comes out clean.",
        "Serve with mild coconut chutney or warm dal."
      ],
      benefits: "Gentle soluble fiber from oats aids smooth digestion and bowel regularity.",
      safety: "Cool to warm room temperature before serving to little ones.",
      icon: "\u26aa"
    },
    {
      id: '3_5_years_rec_4',
      name: "Mild Vegetable Poha with Sweet Peas",
      localName: "\u0935\u0947\u091c\u093f\u091f\u0947\u092c\u0932 \u092a\u094b\u0939\u093e / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b85\u0bb5\u0bb2\u0bcd \u0b89\u0baa\u0bcd\u0baa\u0bc1\u0bae\u0bbe",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Thick flattened rice (poha)",
        "rinsed",
        "1/4 cup Steamed green peas and diced carrots",
        "1/2 teaspoon Cumin seeds & turmeric",
        "1 teaspoon Lemon juice and fresh coriander"
      ],
      instructions: [
        "Rinse poha in a colander and drain completely for 5 minutes.",
        "Heat a teaspoon of ghee or oil in a pan. Splutter cumin seeds and add turmeric.",
        "Add steamed peas, carrots, and drained poha. Gently toss for 3 minutes on low heat.",
        "Turn off heat, squeeze fresh lemon juice, and garnish with chopped coriander."
      ],
      benefits: "Light on the stomach yet packed with iron and easy-to-digest carbs.",
      safety: "Ensure peas are soft-cooked so they smash easily when pressed.",
      icon: "\ud83e\udd63"
    },
    {
      id: '3_5_years_rec_5',
      name: "Cooling Curd Rice with Pomegranate Pearls",
      localName: "\u0926\u0939\u0940 \u091a\u093e\u0935\u0932 / \u0ba4\u0baf\u0bbf\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "5 mins",
      cookTime: "10 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Soft-cooked mashed rice",
        "1/2 cup Fresh homemade curd (dahi)",
        "2 tablespoons Fresh pomegranate seeds",
        "1/4 cup Grated cucumber or carrot",
        "1/2 teaspoon Mustard & curry leaf ghee tadka"
      ],
      instructions: [
        "Mash warm soft rice thoroughly in a bowl. Let it cool down.",
        "Mix in fresh curd, a splash of milk, and grated cucumber.",
        "Pour a mild ghee tempering of mustard seeds and curry leaves.",
        "Top with sweet pomegranate pearls right before serving."
      ],
      benefits: "Rich in natural gut probiotics, calcium, and cooling electrolytes for hot afternoons.",
      safety: "Use sweet, seedless or tender pomegranate pearls that are easy to chew.",
      icon: "\ud83c\udf5a"
    },
    {
      id: '3_5_years_rec_6',
      name: "Creamy Mild Palak Paneer with Jeera Rice",
      localName: "\u092a\u093e\u0932\u0915 \u092a\u0928\u0940\u0930 \u091c\u0940\u0930\u093e \u0930\u093e\u0907\u0938 / \u0baa\u0bbe\u0bb2\u0b95\u0bcd \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Fresh spinach leaves",
        "blanched & pureed",
        "1/2 cup Soft paneer cubes",
        "1/2 cup Soft cumin (jeera) rice",
        "1 teaspoon Butter or ghee",
        "mild cumin & turmeric"
      ],
      instructions: [
        "Blanch washed spinach in boiling water for 2 minutes, then blend into a green puree.",
        "Warm ghee in a pan, add cumin and turmeric, then stir in spinach puree.",
        "Add soft bite-sized paneer cubes and simmer for 4 minutes with a pinch of salt.",
        "Serve warm over soft fragrant jeera rice."
      ],
      benefits: "Provides bioavailable iron, vitamin A, and bone-strengthening calcium.",
      safety: "Keep spices mild. Cut paneer into soft, bite-sized cubes.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '3_5_years_rec_7',
      name: "Yellow Dal Tadka with Soft Phulka & Ghee",
      localName: "\u0926\u093e\u0932 \u0924\u0921\u093c\u0915\u093e \u092b\u0941\u0932\u094d\u0915\u093e / \u0ba4\u0bbe\u0bb2\u0bcd \u0baa\u0bc1\u0bb2\u0bcd\u0b95\u0bbe \u0bb0\u0bca\u0b9f\u0bcd\u0b9f\u0bbf",
      prepTime: "10 mins",
      cookTime: "20 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Toor dal or yellow moong dal",
        "1 Finely chopped tomato",
        "1/2 teaspoon Ghee with jeera & hing",
        "1-2 Fresh soft whole wheat phulkas"
      ],
      instructions: [
        "Pressure cook dal with tomato, turmeric, and 1.5 cups water until mushy.",
        "Whisk dal smoothly and season with mild ghee tadka of cumin.",
        "Tear soft warm phulka into small bite-sized pieces and dip into dal.",
        "Serve with a small spoon of mild carrot salad."
      ],
      benefits: "Classic Indian complete protein meal providing essential amino acids and complex carbs.",
      safety: "Tear rotis into bite-sized pieces so child chews comfortably.",
      icon: "\ud83c\udf72"
    },
    {
      id: '3_5_years_rec_8',
      name: "Moong Dal & Garden Veggie Khichdi",
      localName: "\u092e\u0942\u0902\u0917 \u0926\u093e\u0932 \u0935\u0947\u091c \u0916\u093f\u091a\u0921\u093c\u0940 / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0baa\u0bb0\u0bc1\u0baa\u0bcd\u0baa\u0bc1 \u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0b9f\u0bbf",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/4 cup Rice and 1/4 cup Yellow Moong Dal",
        "1/2 cup Mixed diced carrots",
        "bottle gourd (lauki)",
        "and beans",
        "1 teaspoon Pure desi ghee",
        "1/4 teaspoon Cumin powder & turmeric"
      ],
      instructions: [
        "Wash rice and dal together. Saut\u00e9 cumin and chopped veggies in ghee.",
        "Add rice, dal, and 2.5 cups of water for a soft, comforting texture.",
        "Pressure cook for 3 whistles until soft and meltingly tender.",
        "Mash lightly with the back of a ladle and top with half a spoon of ghee."
      ],
      benefits: "Supreme comfort food, completely balanced, and extremely gentle on the stomach.",
      safety: "Ensure all vegetable pieces are thoroughly soft and cooked.",
      icon: "\ud83e\udd63"
    },
    {
      id: '3_5_years_rec_9',
      name: "Silky Carrot-Tomato Soup with Wheat Croutons",
      localName: "\u0917\u093e\u091c\u0930 \u091f\u092e\u093e\u091f\u0930 \u0938\u0942\u092a / \u0b95\u0bc7\u0bb0\u0b9f\u0bcd \u0ba4\u0b95\u0bcd\u0b95\u0bbe\u0bb3\u0bbf \u0b9a\u0bc2\u0baa\u0bcd",
      prepTime: "8 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 Sweet carrot and 2 ripe tomatoes",
        "1 slice Whole wheat bread",
        "toasted & cubed",
        "1/2 teaspoon Butter and mild salt",
        "1/4 cup Warm milk or vegetable broth"
      ],
      instructions: [
        "Steam chopped carrots and tomatoes until very soft. Blend into a smooth soup.",
        "Strain into a small pot, add milk and butter, and simmer for 3 minutes.",
        "Cut toasted bread into fun little square croutons.",
        "Let child dip the crunchy croutons into the warm soup."
      ],
      benefits: "High in beta-carotene for healthy eyes and vitamin C for immunity.",
      safety: "Ensure soup is comfortably warm, not hot, before serving.",
      icon: "\ud83c\udf75"
    },
    {
      id: '3_5_years_rec_10',
      name: "Mild Paneer Bhurji Soft Roll",
      localName: "\u092a\u0928\u0940\u0930 \u092d\u0941\u0930\u094d\u091c\u0940 \u0930\u094b\u0932 / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0baa\u0bc1\u0bb0\u0bcd\u0b9c\u0bbf \u0b9a\u0bc1\u0bb0\u0bc1\u0bb3\u0bcd",
      prepTime: "8 mins",
      cookTime: "10 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Crumbled fresh paneer",
        "2 tablespoons Diced tomatoes and boiled sweet corn",
        "1 Soft whole wheat chapati",
        "1/2 teaspoon Ghee and mild cumin"
      ],
      instructions: [
        "Saut\u00e9 cumin, tomatoes, and corn in ghee until soft.",
        "Add crumbled paneer, a pinch of turmeric and salt, and cook for 2 minutes.",
        "Spread warm paneer bhurji across a soft chapati.",
        "Roll up into a snug wrap and cut into two toddler-friendly halves."
      ],
      benefits: "Nutrient-dense protein meal that keeps preschoolers full and promotes uninterrupted sleep.",
      safety: "Keep wrap tightly rolled so filling does not spill.",
      icon: "\ud83c\udf2f"
    },
    {
      id: '3_5_years_rec_11',
      name: "Ruby Beetroot Pulao with Cucumber Raita",
      localName: "\u091a\u0941\u0915\u0902\u0926\u0930 \u092a\u0941\u0932\u093e\u0935 / \u0baa\u0bc0\u0b9f\u0bcd\u0bb0\u0bc2\u0b9f\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Steamed rice",
        "1/4 cup Grated beetroot",
        "1/2 teaspoon Ghee & cumin seeds",
        "1/4 cup Fresh yogurt with grated cucumber"
      ],
      instructions: [
        "Saut\u00e9 cumin and grated beetroot in ghee for 4 minutes until tender.",
        "Fold in warm cooked rice until rice takes on a vibrant pink ruby color.",
        "Whisk fresh curd with grated cucumber for a cooling raita dip.",
        "Serve the colorful plate to make dinner fun and inviting."
      ],
      benefits: "Naturally sweet flavor from beetroot boosts iron levels and red blood cells.",
      safety: "Grate beetroot finely so it melts into the rice easily.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '3_5_years_rec_12',
      name: "Crunchy Ghee Roasted Foxnuts (Makhana)",
      localName: "\u092d\u0941\u0928\u093e \u092e\u0916\u093e\u0928\u093e / \u0bb5\u0bb1\u0bc1\u0ba4\u0bcd\u0ba4 \u0ba4\u0bbe\u0bae\u0bb0\u0bc8 \u0bb5\u0bbf\u0ba4\u0bc8",
      prepTime: "2 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Phool Makhana (foxnuts)",
        "1 teaspoon Desi ghee",
        "1/8 teaspoon Turmeric and pinch of rock salt"
      ],
      instructions: [
        "Heat ghee in a pan on medium-low heat.",
        "Add makhana and roast slowly for 4-5 minutes, tossing regularly.",
        "Once crispy, sprinkle turmeric and salt. Toss well and let cool."
      ],
      benefits: "Light, crunchy calcium-rich snack without any trans-fats or artificial preservatives.",
      safety: "Check each makhana for hard black shell remnants before roasting.",
      icon: "\ud83c\udf7f"
    },
    {
      id: '3_5_years_rec_13',
      name: "Warm Steamed Butter Corn Cups",
      localName: "\u0938\u094d\u0935\u0940\u091f \u0915\u0949\u0930\u094d\u0928 \u091a\u093e\u091f / \u0b9a\u0bcb\u0bb3 \u0b9a\u0bbe\u0b9f\u0bcd",
      prepTime: "5 mins",
      cookTime: "5 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Steamed sweet corn kernels",
        "1/2 teaspoon Homemade butter",
        "1/4 teaspoon Cumin powder and drops of lemon juice"
      ],
      instructions: [
        "Steam sweet corn until juicy and soft.",
        "Toss while hot with butter, cumin powder, and a squeeze of lemon juice.",
        "Serve in a small colorful cup with a child spoon."
      ],
      benefits: "Loaded with dietary fiber, lutein for vision, and quick natural energy.",
      safety: "Ensure corn kernels are soft and thoroughly steamed.",
      icon: "\ud83c\udf3d"
    },
    {
      id: '3_5_years_rec_14',
      name: "Soft Date & Almond Energy Bite",
      localName: "\u0916\u091c\u0942\u0930 \u092c\u093e\u0926\u093e\u092e \u0932\u0921\u094d\u0921\u0942 / \u0baa\u0bc7\u0bb0\u0bc0\u0b9a\u0bcd\u0b9a\u0bae\u0bcd\u0baa\u0bb4 \u0bb2\u0b9f\u0bcd\u0b9f\u0bc1",
      prepTime: "10 mins",
      cookTime: "2 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Soft pitted Medjool dates",
        "2 tablespoons Finely powdered almonds & cashews",
        "1 tablespoon Desi ghee",
        "Pinch of cardamom powder"
      ],
      instructions: [
        "Pulse soft dates in a blender until they form a sticky paste.",
        "Warm ghee in a pan, add date paste and nut powders, and stir for 2 minutes.",
        "Cool until touchable and roll into small marble-sized balls."
      ],
      benefits: "Natural energy booster with zero added white sugar. High in magnesium and iron.",
      safety: "Always use finely powdered nuts for preschoolers to eliminate any choking risk.",
      icon: "\ud83e\uddc6"
    },
    {
      id: '3_5_years_rec_15',
      name: "Creamy Banana & Cardamom Milkshake",
      localName: "\u0915\u0947\u0932\u093e \u0916\u091c\u0942\u0930 \u0936\u0947\u0915 / \u0bb5\u0bbe\u0bb4\u0bc8\u0baa\u0bcd\u0baa\u0bb4 \u0baa\u0bbe\u0bb2\u0bcd",
      prepTime: "4 mins",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 Ripe sweet banana",
        "1 cup Whole milk (warmed & cooled)",
        "1 Soft date (soaked in warm water)",
        "Pinch of aromatic cardamom"
      ],
      instructions: [
        "Place banana, soaked date, and cardamom into a blender jar.",
        "Add milk and blend for 1 minute until creamy and froth-topped.",
        "Pour into a cup and serve fresh with an open sipper or straw."
      ],
      benefits: "Potassium, calcium, and healthy calories supporting active play and bone growth.",
      safety: "Do not add ice cubes; serve at gentle room temperature.",
      icon: "\ud83e\udd64"
    },
    {
      id: '3_5_years_rec_16',
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
      id: '3_5_years_rec_17',
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
      id: '3_5_years_rec_18',
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
      id: '3_5_years_rec_19',
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
      id: '3_5_years_rec_20',
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
      id: '3_5_years_rec_21',
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
      id: '3_5_years_rec_22',
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
      id: '3_5_years_rec_23',
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
      id: '3_5_years_rec_24',
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
      id: '3_5_years_rec_25',
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
      id: '3_5_years_rec_26',
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
      id: '3_5_years_rec_27',
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
      id: '3_5_years_rec_28',
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
      id: '3_5_years_rec_29',
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
      id: '3_5_years_rec_30',
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
