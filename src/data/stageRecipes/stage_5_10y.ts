import { Recipe, AgeGroupData } from '../foodGuideData';

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
      localName: "\u092e\u0947\u0925\u0940 \u092a\u0930\u093e\u0920\u093e \u0926\u0939\u0940 / \u0bb5\u0bc6\u0ba8\u0bcd\u0ba4\u0baf\u0b95\u0bcd\u0b95\u0bc0\u0bb0\u0bc8 \u0baa\u0bb0\u0bcb\u0b9f\u0bcd\u0b9f\u0bbe",
      prepTime: "12 mins",
      cookTime: "10 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Whole wheat flour (atta)",
        "1/2 cup Fresh fenugreek (methi) leaves",
        "finely chopped",
        "1/4 teaspoon Ajwain (carom seeds) and turmeric",
        "1 teaspoon Ghee for roasting",
        "1/2 cup Fresh creamy curd"
      ],
      instructions: [
        "Wash and finely chop fresh methi leaves.",
        "Knead atta with methi leaves, ajwain, turmeric, and water into a smooth dough.",
        "Roll into medium round parathas and cook on a hot tawa with ghee until speckled golden.",
        "Serve hot with a side of thick curd."
      ],
      benefits: "Ajwain aids digestion while fenugreek delivers high natural iron and dietary fiber.",
      safety: "Ensure methi leaves are thoroughly washed to remove all soil sediment.",
      icon: "\ud83e\uded3"
    },
    {
      id: '5_10_years_rec_2',
      name: "Crispy Multigrain Dosa with Coconut Dip",
      localName: "\u092e\u0932\u094d\u091f\u0940\u0917\u094d\u0930\u0947\u0928 \u0921\u094b\u0938\u093e / \u0ba4\u0bbe\u0ba9\u0bbf\u0baf \u0ba4\u0bcb\u0b9a\u0bc8",
      prepTime: "5 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Multigrain batter (Ragi",
        "Rice",
        "Urad",
        "and Jowar)",
        "1 teaspoon Ghee or sesame oil",
        "2 tablespoons Fresh coconut & roasted chana dal chutney"
      ],
      instructions: [
        "Heat a cast-iron tawa and pour a ladle of multigrain batter.",
        "Spread in spiral motions into a crisp crepe.",
        "Drizzle a little ghee on the perimeter and cook until crisp and golden.",
        "Roll and serve with mild coconut chutney."
      ],
      benefits: "Low glycemic index complex grains provide slow, sustained energy for school mornings.",
      safety: "Serve with mild chutney without fiery green chilies.",
      icon: "\ud83e\udd5e"
    },
    {
      id: '5_10_years_rec_3',
      name: "Savory Besan & Bell Pepper Chilla",
      localName: "\u092c\u0947\u0938\u0928 \u0935\u0947\u091c \u091a\u0940\u0932\u093e / \u0b95\u0b9f\u0bb2\u0bc8 \u0bae\u0bbe\u0bb5\u0bc1 \u0b85\u0b9f\u0bc8",
      prepTime: "8 mins",
      cookTime: "8 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "3/4 cup Besan (chickpea flour)",
        "1/4 cup Finely diced onions",
        "tomatoes",
        "and bell peppers",
        "1/2 teaspoon Cumin and ajwain seeds",
        "1 teaspoon Oil for cooking"
      ],
      instructions: [
        "Whisk besan with water into a smooth crepe consistency batter.",
        "Fold in finely diced bell peppers, tomatoes, and ajwain.",
        "Pour batter on a hot pan and cook on both sides until crispy and fragrant.",
        "Cut into fun triangles for a quick school breakfast."
      ],
      benefits: "Plant-based chickpea protein keeps kids alert and focused through morning classes.",
      safety: "Dice vegetables finely so the chilla cooks evenly.",
      icon: "\ud83e\uded3"
    },
    {
      id: '5_10_years_rec_4',
      name: "Semolina & Roasted Peanut Veggie Upma",
      localName: "\u0935\u0947\u091c\u093f\u091f\u0947\u092c\u0932 \u0909\u092a\u092e\u093e / \u0b95\u0bbe\u0baf\u0bcd\u0b95\u0bb1\u0bbf \u0b89\u0baa\u0bcd\u0baa\u0bc1\u0bae\u0bbe",
      prepTime: "8 mins",
      cookTime: "12 mins",
      category: 'Morning',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Roasted semolina (sooji or rava)",
        "1/4 cup Diced carrots",
        "peas",
        "and green beans",
        "1 tablespoon Roasted crunchy peanuts",
        "1 teaspoon Ghee",
        "mustard seeds",
        "and curry leaves"
      ],
      instructions: [
        "Heat ghee, splutter mustard seeds, curry leaves, and roasted peanuts.",
        "Saut\u00e9 veggies until half-tender, then pour in 1.25 cups of water and bring to a boil.",
        "Slowly pour in roasted rava while stirring continuously to prevent lumps.",
        "Cover and simmer on low for 3 minutes. Fluff with a fork and serve."
      ],
      benefits: "Good source of healthy fats and protein from peanuts combined with complex carbs.",
      safety: "Ensure child has no peanut allergies before adding whole roasted nuts.",
      icon: "\ud83e\udd63"
    },
    {
      id: '5_10_years_rec_5',
      name: "Home-Style Rajma Masala with Steamed Rice",
      localName: "\u0930\u093e\u091c\u092e\u093e \u091a\u093e\u0935\u0932 / \u0bb0\u0bbe\u0b9c\u0bcd\u0bae\u0bbe \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "15 mins",
      cookTime: "25 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Soaked red kidney beans (rajma)",
        "1 cup Cooked basmati rice",
        "1 Tomato and onion gravy with ginger-garlic and cumin",
        "1/2 cup Fresh cucumber & tomato kachumber"
      ],
      instructions: [
        "Pressure cook soaked rajma until melt-in-the-mouth soft (5 whistles).",
        "Simmer in a mild tomato-onion gravy seasoned with cumin and coriander for 10 mins.",
        "Ladle hot aromatic rajma over steamed rice.",
        "Serve with freshly squeezed lemon juice and crunchy cucumber slices."
      ],
      benefits: "High protein and dietary fiber supporting steady adolescent growth and bowel health.",
      safety: "Ensure kidney beans are soaked overnight and cooked until completely soft.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '5_10_years_rec_6',
      name: "Paneer Bhurji with Warm Multigrain Rotis",
      localName: "\u092a\u0928\u0940\u0930 \u092d\u0941\u0930\u094d\u091c\u0940 \u0930\u094b\u091f\u0940 / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0baa\u0bc1\u0bb0\u0bcd\u0b9c\u0bbf \u0b9a\u0baa\u0bcd\u0baa\u0bbe\u0ba4\u0bcd\u0ba4\u0bbf",
      prepTime: "10 mins",
      cookTime: "12 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Crumbled fresh paneer",
        "1 Diced onion and tomato",
        "2 Multigrain rotis (wheat",
        "ragi",
        "barley)",
        "1 teaspoon Desi ghee & mild spices"
      ],
      instructions: [
        "Saut\u00e9 diced onions, tomatoes, and mild spices in ghee.",
        "Toss in fresh crumbled paneer and cook for 3 minutes on low flame.",
        "Serve alongside warm, soft multigrain rotis and lemon wedges."
      ],
      benefits: "Excellent vegetarian source of high-biological value dairy protein and calcium.",
      safety: "Do not overcook paneer to keep it moist and tender.",
      icon: "\ud83c\udf72"
    },
    {
      id: '5_10_years_rec_7',
      name: "Wholesome Vegetable Sambar Rice with Ghee",
      localName: "\u0938\u093e\u0902\u092d\u0930 \u091a\u093e\u0935\u0932 / \u0b9a\u0bbe\u0bae\u0bcd\u0baa\u0bbe\u0bb0\u0bcd \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "10 mins",
      cookTime: "20 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Cooked toor dal & rice",
        "1/2 cup Drumstick",
        "pumpkin",
        "and carrot pieces",
        "1 tablespoon Sambar powder & tamarind extract",
        "1 teaspoon Ghee for tempering"
      ],
      instructions: [
        "Boil vegetables in tamarind water with turmeric and sambar powder.",
        "Add boiled toor dal and soft cooked rice. Mix well and simmer for 5 minutes.",
        "Temper with ghee, mustard seeds, and curry leaves.",
        "Serve warm with crispy roasted potato slices."
      ],
      benefits: "Combines lentils, diverse vegetables, and spices for an antioxidant-rich lunch.",
      safety: "Remove hard drumstick fibers before giving to younger school kids.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '5_10_years_rec_8',
      name: "Mild Kabuli Chana Masala with Jeera Rice",
      localName: "\u091a\u0928\u093e \u092e\u0938\u093e\u0932\u093e \u091c\u0940\u0930\u093e \u0930\u093e\u0907\u0938 / \u0b95\u0bca\u0ba3\u0bcd\u0b9f\u0b95\u0bcd\u0b95\u0b9f\u0bb2\u0bc8 \u0b9a\u0bbe\u0ba4\u0bae\u0bcd",
      prepTime: "12 mins",
      cookTime: "20 mins",
      category: 'Lunch',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Soaked white chickpeas (kabuli chana)",
        "1 cup Cooked jeera rice",
        "1 Onion-tomato puree with cumin and amchur (dry mango)",
        "1 teaspoon Ghee"
      ],
      instructions: [
        "Boil chickpeas until tender and easily mashed between fingers.",
        "Simmer in a tangy tomato-cumin gravy for 10 minutes.",
        "Garnish with fresh coriander and serve over fragrant jeera rice."
      ],
      benefits: "Packed with folate, iron, and slow-release energy for sports-active children.",
      safety: "Ensure chickpeas are soft-cooked throughout.",
      icon: "\ud83c\udf72"
    },
    {
      id: '5_10_years_rec_9',
      name: "Green Spinach & Yellow Moong Khichdi",
      localName: "\u092a\u093e\u0932\u0915 \u092e\u0942\u0902\u0917 \u0916\u093f\u091a\u0921\u093c\u0940 / \u0b95\u0bc0\u0bb0\u0bc8 \u0b95\u0bbf\u0b9a\u0bcd\u0b9a\u0b9f\u0bbf",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Rice and Moong Dal (equal parts)",
        "1 cup Pureed fresh baby spinach",
        "1 teaspoon Ghee & crushed cumin",
        "1/2 cup Fresh roasted papad and curd"
      ],
      instructions: [
        "Cook rice and moong dal in a pressure cooker with 2.5 cups water until soft.",
        "Warm ghee in a pan, saut\u00e9 cumin, and stir in spinach puree for 2 minutes.",
        "Fold in the warm khichdi until bright emerald green. Serve with cool curd."
      ],
      benefits: "Easy on the digestive system before bed, promoting restful night sleep.",
      safety: "Serve lukewarm with roasted, not deep-fried, papad.",
      icon: "\ud83e\udd63"
    },
    {
      id: '5_10_years_rec_10',
      name: "Golden Paneer & Green Pea Tawa Pulao",
      localName: "\u092a\u0928\u0940\u0930 \u0924\u0935\u093e \u092a\u0941\u0932\u093e\u0935 / \u0baa\u0ba9\u0bcd\u0ba9\u0bc0\u0bb0\u0bcd \u0baa\u0bc1\u0bb2\u0bbe\u0bb5\u0bcd",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Steamed basmati rice",
        "1/2 cup Pan-seared paneer cubes",
        "1/4 cup Sweet peas & finely chopped bell peppers",
        "1/2 cup Boondi raita"
      ],
      instructions: [
        "Pan-sear paneer cubes in ghee until golden.",
        "Saut\u00e9 peas and bell peppers with cumin and mild garam masala.",
        "Toss in cooked rice gently to keep grains long and fluffy.",
        "Serve with chilled boondi raita."
      ],
      benefits: "Provides high quality casein protein and essential amino acids for overnight growth.",
      safety: "Ensure peppers are diced small and soft-cooked.",
      icon: "\ud83c\udf5b"
    },
    {
      id: '5_10_years_rec_11',
      name: "Sweet Bottle Gourd (Lauki) & Chana Dal with Roti",
      localName: "\u0932\u094c\u0915\u0940 \u091a\u0928\u093e \u0926\u093e\u0932 / \u0b9a\u0bc1\u0bb0\u0bc8\u0b95\u0bcd\u0b95\u0bbe\u0baf\u0bcd \u0ba4\u0bbe\u0bb2\u0bcd",
      prepTime: "10 mins",
      cookTime: "15 mins",
      category: 'Dinner',
      region: 'Pan-Indian',
      ingredients: [
        "1/2 cup Chana dal",
        "soaked 30 mins",
        "1 cup Diced sweet bottle gourd (lauki/doodhi)",
        "2 Soft whole wheat rotis",
        "1 teaspoon Ghee",
        "cumin & turmeric"
      ],
      instructions: [
        "Pressure cook chana dal and bottle gourd cubes with turmeric and salt.",
        "Add a fragrant tempering of cumin seeds in ghee.",
        "Mash lightly and serve hot with fresh whole wheat rotis."
      ],
      benefits: "Hydrating, high in fiber, and very soothing for active kids after a long school day.",
      safety: "Always taste bottle gourd before cooking to ensure it is not bitter.",
      icon: "\ud83c\udf72"
    },
    {
      id: '5_10_years_rec_12',
      name: "Crunchy Sprouted Moong Chaat with Lemon",
      localName: "\u0905\u0902\u0915\u0941\u0930\u093f\u0924 \u092e\u0942\u0902\u0917 \u092d\u0947\u0932 / \u0bae\u0bc1\u0bb3\u0bc8\u0b95\u0b9f\u0bcd\u0b9f\u0bbf\u0baf \u0baa\u0baf\u0bb1\u0bc1 \u0b9a\u0bbe\u0b9f\u0bcd",
      prepTime: "10 mins",
      cookTime: "0 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Steamed green moong sprouts",
        "1/4 cup Diced cucumber",
        "tomatoes",
        "and boiled potato",
        "1/2 teaspoon Roasted cumin powder & chaat masala",
        "1 tablespoon Fresh lemon juice & coriander"
      ],
      instructions: [
        "Steam moong sprouts for 3 minutes to make them tender and digestible.",
        "Toss with diced vegetables, cumin powder, chaat masala, and lemon juice.",
        "Serve in a crunchy bowl for an energizing after-school snack."
      ],
      benefits: "Sprouting multiplies vitamin C and antioxidant bioavailability for high immunity.",
      safety: "Light steaming of sprouts prevents bacterial contamination.",
      icon: "\ud83e\udd57"
    },
    {
      id: '5_10_years_rec_13',
      name: "Tawa-Crisped Sweet Potato & Paneer Tikki",
      localName: "\u0936\u0915\u0930\u0915\u0902\u0926 \u092a\u0928\u0940\u0930 \u091f\u093f\u0915\u094d\u0915\u0940 / \u0b9a\u0bb0\u0bcd\u0b95\u0bcd\u0b95\u0bb0\u0bc8\u0bb5\u0bb3\u0bcd\u0bb3\u0bbf\u0b95\u0bcd\u0b95\u0bbf\u0bb4\u0b99\u0bcd\u0b95\u0bc1 \u0b95\u0b9f\u0bcd\u0bb2\u0bc6\u0b9f\u0bcd",
      prepTime: "12 mins",
      cookTime: "10 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Boiled & mashed sweet potato (shakarkand)",
        "1/4 cup Grated fresh paneer",
        "2 tablespoons Roasted oat flour for binding",
        "1 teaspoon Ghee for pan roasting"
      ],
      instructions: [
        "Mix mashed sweet potato, paneer, oat flour, cumin, and mild salt.",
        "Shape into small flat burger-style patties.",
        "Shallow fry on a tawa with ghee for 4 minutes each side until golden and crispy.",
        "Serve with mint-coriander chutney."
      ],
      benefits: "Complex carbs with low glycemic impact, high vitamin A, and healthy fats.",
      safety: "Shallow fry with minimal ghee instead of deep-frying.",
      icon: "\ud83e\uddc6"
    },
    {
      id: '5_10_years_rec_14',
      name: "Rich Makhana & Almond Kheer with Jaggery",
      localName: "\u092e\u0916\u093e\u0928\u093e \u0916\u0940\u0930 / \u0ba4\u0bbe\u0bae\u0bb0\u0bc8 \u0bb5\u0bbf\u0ba4\u0bc8 \u0baa\u0bbe\u0baf\u0bbe\u0b9a\u0bae\u0bcd",
      prepTime: "5 mins",
      cookTime: "15 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1 cup Foxnuts (makhana)",
        "coarsely crushed",
        "2 cups Full cream cow milk",
        "2 tablespoons Jaggery powder (added after cooking)",
        "4 Crushed almonds and pinch of saffron"
      ],
      instructions: [
        "Roast makhana in 1/2 tsp ghee and pulse half of it coarsely.",
        "Simmer milk with crushed makhana, saffron, and almonds for 10 mins until thick.",
        "Turn off heat. Let it cool slightly, then stir in jaggery powder.",
        "Serve warm or chilled as a nutritious dessert."
      ],
      benefits: "High calcium and magnesium dessert without refined white sugar.",
      safety: "Always turn off heat before adding jaggery to prevent milk from curdling.",
      icon: "\ud83c\udf6e"
    },
    {
      id: '5_10_years_rec_15',
      name: "Traditional Saffron & Almond Golden Milk",
      localName: "\u092c\u093e\u0926\u093e\u092e \u0915\u0947\u0938\u0930 \u0926\u0942\u0927 / \u0baa\u0bbe\u0ba4\u0bbe\u0bae\u0bcd \u0baa\u0bbe\u0bb2\u0bcd",
      prepTime: "5 mins",
      cookTime: "8 mins",
      category: 'Snacks',
      region: 'Pan-Indian',
      ingredients: [
        "1.5 cups Fresh whole milk",
        "1 tablespoon Soaked & peeled almond paste",
        "Pinch of Saffron (kesar) strands and cardamom",
        "1 teaspoon Honey or jaggery"
      ],
      instructions: [
        "Blend soaked peeled almonds with 2 tbsp of warm milk into a paste.",
        "Bring milk to a gentle boil with almond paste and saffron strands.",
        "Simmer for 5 minutes until fragrant and creamy.",
        "Sweeten with honey or jaggery and serve warm before bedtime."
      ],
      benefits: "Rich in vitamin E and natural tryptophan, promoting muscle repair and restful sleep.",
      safety: "Serve at comforting warm drinking temperature.",
      icon: "\ud83e\udd5b"
    },
    {
      id: '5_10_years_rec_16',
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
      id: '5_10_years_rec_17',
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
      id: '5_10_years_rec_18',
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
      id: '5_10_years_rec_19',
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
      id: '5_10_years_rec_20',
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
      id: '5_10_years_rec_21',
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
      id: '5_10_years_rec_22',
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
      id: '5_10_years_rec_23',
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
      id: '5_10_years_rec_24',
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
      id: '5_10_years_rec_25',
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
      id: '5_10_years_rec_26',
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
      id: '5_10_years_rec_27',
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
      id: '5_10_years_rec_28',
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
      id: '5_10_years_rec_29',
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
      id: '5_10_years_rec_30',
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
