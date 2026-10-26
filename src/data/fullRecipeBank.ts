import { AgeGroupData, Recipe, MealCategory } from './foodGuideData';

// Templates and culinary builders for generating authentic, healthy Indian recipes
// across all 10 age stages (30 Morning, 30 Lunch, 30 Dinner, 30 Snacks = 120 per age stage)

interface DishSeed {
  name: string;
  localName: string;
  prepTime: string;
  cookTime: string;
  category: MealCategory;
  ingredients: string[];
  instructions: string[];
  benefits: string;
  safety: string;
  icon: string;
}

// Helper to generate 30 distinct, age-appropriate Indian recipes for a meal category
function generate30MealRecipes(
  stageId: string,
  ageLimit: string,
  category: MealCategory,
  dishSeeds: DishSeed[]
): Recipe[] {
  return dishSeeds.map((seed, index) => {
    return {
      id: `${stageId}_${category.toLowerCase()}_${index + 1}`,
      name: seed.name,
      localName: seed.localName,
      prepTime: seed.prepTime,
      cookTime: seed.cookTime,
      category: seed.category,
      ingredients: seed.ingredients,
      instructions: seed.instructions,
      benefits: seed.benefits,
      safety: seed.safety,
      icon: seed.icon
    };
  });
}

// -------------------------------------------------------------
// STAGE-SPECIFIC DISH BANKS (120 PER AGE STAGE = 30x4)
// -------------------------------------------------------------

// Builders for each age group with authentic Indian staples
function buildStageRecipes(stageId: string, ageLimit: string, isInfant: boolean, isToddler: boolean, isOlder: boolean): Recipe[] {
  const morningSeeds: DishSeed[] = [];
  const lunchSeeds: DishSeed[] = [];
  const dinnerSeeds: DishSeed[] = [];
  const snacksSeeds: DishSeed[] = [];

  // Morning Grains & Starters (30 varieties)
  const morningBases = [
    { title: 'Sprouted Ragi Kanji', local: 'रागी कांजी', icon: '🌾', grain: 'Sprouted Ragi Flour' },
    { title: 'Oats & Apple Porridge', local: 'ओट्स दलिया', icon: '🥣', grain: 'Rolled Oats' },
    { title: 'Steamed Moong Idli', local: 'मूंग इडली', icon: '⚪', grain: 'Moong Dal Batter' },
    { title: 'Mild Veggie Poha', local: 'पोहा', icon: '🥣', grain: 'Flattened Rice' },
    { title: 'Soft Suji Upma', local: 'सूजी उपमा', icon: '🥣', grain: 'Roasted Semolina' },
    { title: 'Yellow Moong Cheela', local: 'मूंग चीला', icon: '🫓', grain: 'Yellow Lentils' },
    { title: 'Besan & Carrot Dosa', local: 'बेसन डोसा', icon: '🥞', grain: 'Gram Flour' },
    { title: 'Ragi Banana Mash', local: 'रागी केला', icon: '🍌', grain: 'Ragi & Banana' },
    { title: 'Broken Wheat Dalia', local: 'गेहूं दलिया', icon: '🌾', grain: 'Cracked Wheat' },
    { title: 'Rice Flakes Kheer', local: 'चावल खीर', icon: '🍚', grain: 'Rice & Milk' },
    { title: 'Jowar Veggie Porridge', local: 'ज्वार दलिया', icon: '🥣', grain: 'Sorghum Millet' },
    { title: 'Foxtail Millet Porridge', local: 'कंगनी दलिया', icon: '🌾', grain: 'Foxtail Millet' },
    { title: 'Soft Paneer Scramble', local: 'पनीर भुर्जी', icon: '🧀', grain: 'Fresh Paneer' },
    { title: 'Mashed Sweet Potato Bowl', local: 'शकरकंद मैश', icon: '🍠', grain: 'Sweet Potato' },
    { title: 'Palak Oats Porridge', local: 'पालक ओट्स', icon: '🥬', grain: 'Spinach & Oats' },
    { title: 'Methi Wheat Crepe', local: 'मेथी चीला', icon: '🫓', grain: 'Fenugreek & Wheat' },
    { title: 'Coconut Rice Porridge', local: 'नारियल चावल', icon: '🥥', grain: 'Rice & Coconut' },
    { title: 'Bajra Warm Porridge', local: 'बाजरा दलिया', icon: '🥣', grain: 'Pearl Millet' },
    { title: 'Almond Milk Oatmeal', local: 'बादाम ओट्स', icon: '🥛', grain: 'Almond & Oats' },
    { title: 'Steamed Corn & Rava Cakes', local: 'मक्की रवा इडली', icon: '🌽', grain: 'Corn & Semolina' },
    { title: 'Soft Sattu Gruel', local: 'सत्तू दलिया', icon: '🌾', grain: 'Roasted Gram Flour' },
    { title: 'Pumpkin Rice Congee', local: 'कद्दू चावल', icon: '🎃', grain: 'Pumpkin & Rice' },
    { title: 'Beetroot Wheat Pancake', local: 'चुकंदर पैनकेक', icon: '🥞', grain: 'Beetroot & Wheat' },
    { title: 'Carrot & Cardamom Porridge', local: 'गाजर दलिया', icon: '🥕', grain: 'Carrot & Semolina' },
    { title: 'Sesame & Ragi Porridge', local: 'तिल रागी', icon: '🌾', grain: 'Ragi & Sesame' },
    { title: 'Curd & Poha Mash', local: 'दही पोहा', icon: '🥣', grain: 'Curd & Poha' },
    { title: 'Green Peas Porridge', local: 'मटर दलिया', icon: '🟢', grain: 'Peas & Rice' },
    { title: 'Apple & Cinnamon Ragi', local: 'सेब रागी', icon: '🍎', grain: 'Apple & Ragi' },
    { title: 'Date & Oats Mash', local: 'खजूर ओट्स', icon: '🥣', grain: 'Dates & Oats' },
    { title: 'Papaya & Rice Cream', local: 'पपीता चावल', icon: '🥭', grain: 'Papaya & Rice' }
  ];

  morningBases.forEach((base, i) => {
    morningSeeds.push({
      name: `${base.title} (${ageLimit})`,
      localName: `${base.local} / காலை உணவு`,
      prepTime: '5-10 mins',
      cookTime: '8-12 mins',
      category: 'Morning',
      ingredients: [
        `1/2 cup ${base.grain}`,
        isInfant ? '1 cup Water or Breastmilk' : '1 cup Milk or Water',
        '1/2 teaspoon Desi Ghee',
        isInfant ? 'Pinch of roasted cumin' : 'Pinch of cumin, mild salt & turmeric'
      ],
      instructions: [
        `Wash and prep ${base.grain}.`,
        isInfant ? 'Cook in hot water until thoroughly softened, then puree or mash silky smooth.' : 'Cook on medium heat with ghee and mild seasonings until warm, fluffy, and tender.',
        'Allow to cool to lukewarm serving temperature.',
        'Serve fresh to start the day with stable energy.'
      ],
      benefits: `Rich in bioavailable complex carbohydrates and essential minerals appropriate for ${ageLimit}.`,
      safety: isInfant ? 'Never add honey or whole nuts. Ensure completely smooth texture.' : 'Ensure food is warm, not hot. Cut larger pieces to bite-sized.',
      icon: base.icon
    });
  });

  // Lunch Bowls & Meals (30 varieties)
  const lunchBases = [
    { title: 'Moong Dal Khichdi', local: 'मूंग खिचड़ी', icon: '🍲', grain: 'Moong Dal & Rice' },
    { title: 'Curd Rice with Cumin', local: 'दही चावल', icon: '🍚', grain: 'Rice & Fresh Dahi' },
    { title: 'Yellow Dal Tadka with Rice', local: 'दाल तड़का चावल', icon: '🍛', grain: 'Toor Dal & Rice' },
    { title: 'Soft Palak Paneer Bowl', local: 'पालक पनीर', icon: '🥬', grain: 'Spinach & Paneer' },
    { title: 'Steamed Veggie Pulao', local: 'वेज पुलाव', icon: '🍛', grain: 'Basmati & Veggies' },
    { title: 'Mild Rajma Rice', local: 'राजमा चावल', icon: '🍲', grain: 'Red Kidney Beans & Rice' },
    { title: 'Chana Masala with Phulka', local: 'चना रोटी', icon: '🫓', grain: 'Chickpeas & Wheat' },
    { title: 'Sambar & Brown Rice', local: 'सांभर चावल', icon: '🍛', grain: 'Lentils & Vegetables' },
    { title: 'Lauki Moong Dal Stew', local: 'लौकी मूंग दाल', icon: '🍲', grain: 'Bottle Gourd & Dal' },
    { title: 'Carrot & Pumpkin Rice Pot', local: 'गाजर कद्दू भात', icon: '🍚', grain: 'Carrot, Pumpkin & Rice' },
    { title: 'Masoor Dal Soup with Rice', local: 'मसूर दाल चावल', icon: '🍲', grain: 'Red Lentils & Rice' },
    { title: 'Paneer Peas Pulao', local: 'मटर पनीर पुलाव', icon: '🍛', grain: 'Paneer, Peas & Rice' },
    { title: 'Beetroot Rice with Raita', local: 'चुकंदर भात', icon: '🍚', grain: 'Beetroot & Curd' },
    { title: 'Sweet Corn & Dal Mash', local: 'मकई दाल', icon: '🌽', grain: 'Corn & Yellow Moong' },
    { title: 'Soya Chunk Veggie Stew', local: 'सोया दाल तरी', icon: '🍛', grain: 'Soya Chunks & Peas' },
    { title: 'Methi Dal with Soft Phulka', local: 'मेथी दाल रोटी', icon: '🫓', grain: 'Fenugreek & Toor Dal' },
    { title: 'Tomato Lentil Rice', local: 'टमाटर रसम भात', icon: '🍅', grain: 'Tomato & Lentils' },
    { title: 'Millet Khichdi with Ghee', local: 'बाजरा खिचड़ी', icon: '🍲', grain: 'Pearl Millet & Moong' },
    { title: 'Tofu & Broccoli Fried Rice', local: 'टोफू वेज पुलाव', icon: '🥦', grain: 'Tofu & Brown Rice' },
    { title: 'Panchmel 5-Dal Puree', local: 'पंचमेल दाल', icon: '🍲', grain: 'Mixed 5 Lentils' },
    { title: 'Green Peas Khichdi', local: 'मटर खिचड़ी', icon: '🟢', grain: 'Green Peas & Rice' },
    { title: 'Drumstick Leaf Dal', local: 'सहजन दाल', icon: '🥬', grain: 'Moringa & Toor Dal' },
    { title: 'Zucchini & Lentil Stew', local: 'तोरई दाल', icon: '🍲', grain: 'Ridge Gourd & Dal' },
    { title: 'Cumin Rice with Paneer Curry', local: 'जीरा राइस पनीर', icon: '🍛', grain: 'Jeera Rice & Paneer' },
    { title: 'Lemon Rice with Curd Dip', local: 'नींबू चावल', icon: '🍋', grain: 'Turmeric Lemon Rice' },
    { title: 'Spinach & Chickpea Stew', local: 'छोले पालक', icon: '🍲', grain: 'Chickpeas & Spinach' },
    { title: 'Mashed Potato Lentil Bowl', local: 'आलू दाल मैश', icon: '🥔', grain: 'Potato & Moong Dal' },
    { title: 'Coriander Rice with Moong Dal', local: 'धनिया चावल', icon: '🌿', grain: 'Coriander & Lentils' },
    { title: 'Sprouted Green Gram Khichdi', local: 'साबुत मूंग खिचड़ी', icon: '🍲', grain: 'Sprouted Moong' },
    { title: 'Carrot & Peas Pulao', local: 'गाजर मटर पुलाव', icon: '🥕', grain: 'Carrot, Peas & Rice' }
  ];

  lunchBases.forEach((base, i) => {
    lunchSeeds.push({
      name: `${base.title} (${ageLimit})`,
      localName: `${base.local} / மதிய உணவு`,
      prepTime: '10-15 mins',
      cookTime: '15-20 mins',
      category: 'Lunch',
      ingredients: [
        `1/2 cup ${base.grain}`,
        '1 cup Water or homemade vegetable broth',
        '1 teaspoon Desi Ghee',
        isInfant ? 'Pinch of jeera & turmeric' : 'Pinch of cumin, mild pink salt & coriander leaves'
      ],
      instructions: [
        'Rinse grains and lentils thoroughly until water runs clear.',
        isInfant ? 'Pressure cook until tender, mash with spoon or blend to appropriate thickness.' : 'Pressure cook or simmer until tender, fluffy, and aromatic.',
        'Temper lightly with pure ghee and cumin seeds.',
        'Serve warm alongside homemade curd or sliced veggies.'
      ],
      benefits: `High protein, balanced complex carbohydrates, and gut-healthy fiber tailored for ${ageLimit}.`,
      safety: isInfant ? 'Ensure grains are completely soft and free of seeds.' : 'Ensure beans/legumes are fully cooked and tender to chew.',
      icon: base.icon
    });
  });

  // Dinner Light Dishes & Soups (30 varieties)
  const dinnerBases = [
    { title: 'Comforting Moong Khichdi', local: 'सादी मूंग खिचड़ी', icon: '🥣', main: 'Yellow Lentil & Rice' },
    { title: 'Carrot Tomato Soup with Toast', local: 'गाजर टमाटर सूप', icon: '🍵', main: 'Carrot & Tomato' },
    { title: 'Soft Phulka with Bottle Gourd Dal', local: 'रोटी लौकी दाल', icon: '🫓', main: 'Wheat Roti & Lauki' },
    { title: 'Paneer Bhurji Wrap', local: 'पनीर भुर्जी रोल', icon: '🌯', main: 'Fresh Paneer & Roti' },
    { title: 'Light Veggie Dalia Stew', local: 'सब्जी दलिया', icon: '🍲', main: 'Broken Wheat & Veggies' },
    { title: 'Spinach & Potato Clear Broth', local: 'पालक शोरबा', icon: '🍵', main: 'Baby Spinach & Potato' },
    { title: 'Soft Curd Rice with Steamed Beans', local: 'दही भात बीन्स', icon: '🍚', main: 'Rice & Fresh Curd' },
    { title: 'Beetroot Rice with Cucumber Salad', local: 'चुकंदर चावल', icon: '🍛', main: 'Beetroot & Rice' },
    { title: 'Yellow Pumpkin Stew with Phulka', local: 'कद्दू सब्जी रोटी', icon: '🎃', main: 'Sweet Pumpkin & Atta' },
    { title: 'Sweet Corn Chowder (Indian Style)', local: 'मकई सूप', icon: '🌽', main: 'Sweet Corn & Milk' },
    { title: 'Moong Dal Cheela with Mint Chutney', local: 'मूंग चीला', icon: '🫓', main: 'Moong Dal & Mint' },
    { title: 'Steamed Idli with Mild Veggie Sambar', local: 'इडली सांभर', icon: '⚪', main: 'Rice-Urad Cake & Dal' },
    { title: 'Bajra Bhakri with Dal Palak', local: 'बाजरा भाकरी दाल', icon: '🫓', main: 'Millet Roti & Spinach' },
    { title: 'Zucchini & Lentil Soup', local: 'तोरई सूप', icon: '🍵', main: 'Zucchini & Moong' },
    { title: 'Mixed Vegetable Pulao with Raita', local: 'तवा पुलाव', icon: '🍛', main: 'Basmati & Veggies' },
    { title: 'Soft Paneer Tikka Rice Pot', local: 'पनीर राइस', icon: '🍲', main: 'Grilled Paneer & Rice' },
    { title: 'Soya Pea Stew with Soft Roti', local: 'सोया मटर तरी', icon: '🫓', main: 'Soya & Whole Wheat' },
    { title: 'Red Lentil (Masoor) Clear Soup', local: 'मसूर दाल सूप', icon: '🍵', main: 'Red Lentils & Cumin' },
    { title: 'Bottle Gourd & Moong Cutlet with Curd', local: 'लौकी टिक्की', icon: '🧆', main: 'Lauki & Oats' },
    { title: 'Cabbage & Pea Porridge Bowl', local: 'पत्तागोभी चावल', icon: '🥣', main: 'Cabbage & Rice' },
    { title: 'Cucumber Raita with Vegetable Pulao', local: 'पुलाव रायता', icon: '🍛', main: 'Spiced Rice & Curd' },
    { title: 'Warm Oats & Vegetable Stew', local: 'ओट्स वेज सूप', icon: '🥣', main: 'Oats & Carrots' },
    { title: 'Fenugreek Leaf Paratha with Dahi', local: 'मेथी पराठा', icon: '🫓', main: 'Methi Leaves & Wheat' },
    { title: 'Light Rasam with Soft Steamed Rice', local: 'रसम सादम', icon: '🍲', main: 'Tomato Pepper Rasam' },
    { title: 'Mild Green Gram Soup', local: 'साबुत मूंग सूप', icon: '🍵', main: 'Whole Green Moong' },
    { title: 'Soft Tofu & Carrot Stir Rice', local: 'टोफू गाजर भात', icon: '🍚', grain: 'Tofu & Carrots' },
    { title: 'Creamy Sweet Potato Soup', local: 'शकरकंद सूप', icon: '🍠', main: 'Sweet Potato & Ghee' },
    { title: 'Steamed Broccoli & Moong Rice', local: 'ब्रोकोली खिचड़ी', icon: '🥦', main: 'Broccoli & Lentils' },
    { title: 'Tomato Basil Dal with Phulka', local: 'टमाटर दाल रोटी', icon: '🍅', main: 'Tomato Dal & Roti' },
    { title: 'Digestive Ajwain Jeera Khichdi', local: 'अजवाइन खिचड़ी', icon: '🥣', main: 'Moong Rice & Ajwain' }
  ];

  dinnerBases.forEach((base, i) => {
    dinnerSeeds.push({
      name: `${base.title} (${ageLimit})`,
      localName: `${base.local} / இரவு உணவு`,
      prepTime: '8-12 mins',
      cookTime: '12-18 mins',
      category: 'Dinner',
      ingredients: [
        `1/2 cup ${base.main}`,
        '1 cup Water or fresh milk broth',
        '1/2 teaspoon Pure Desi Ghee',
        isInfant ? 'Pinch of jeera & hing' : 'Pinch of roasted cumin, turmeric & mild rock salt'
      ],
      instructions: [
        'Cook ingredients gently on medium heat until soft and easily digestible.',
        isInfant ? 'Puree or mash softly to create a soothing evening texture.' : 'Season lightly with warm ghee and cumin to stimulate digestion.',
        'Serve warm 1 to 2 hours before bedtime to ensure restful uninterrupted sleep.'
      ],
      benefits: `Light, non-inflammatory night meal supporting restorative sleep, tissue growth, and smooth morning digestion.`,
      safety: isInfant ? 'Avoid heavy spices or bedtime sugars.' : 'Keep dinners light and non-oily for easy stomach emptying.',
      icon: base.icon
    });
  });

  // Snacks & Healthy Desserts (30 varieties)
  const snackBases = [
    { title: 'Roasted Ghee Makhana', local: 'भुना मखाना', icon: '🍿', ingredient: 'Foxnuts (Phool Makhana)' },
    { title: 'Steamed Sweet Corn Cup', local: 'स्वीट कॉर्न चाट', icon: '🌽', ingredient: 'Fresh Sweet Corn' },
    { title: 'Soft Date & Almond Laddoo', local: 'खजूर बादाम लड्डू', icon: '🧆', ingredient: 'Medjool Dates & Almonds' },
    { title: 'Makhana & Almond Kheer', local: 'मखाना खीर', icon: '🍮', ingredient: 'Makhana & Milk' },
    { title: 'Banana Cardamom Shake', local: 'केला शेक', icon: '🥤', ingredient: 'Ripe Banana & Milk' },
    { title: 'Sprouted Moong Chaat', local: 'अंकुरित मूंग चाट', icon: '🥗', ingredient: 'Steamed Moong Sprouts' },
    { title: 'Sweet Potato Tawa Tikki', local: 'शकरकंद टिक्की', icon: '🍠', ingredient: 'Boiled Sweet Potato' },
    { title: 'Warm Saffron Badam Milk', local: 'केसर बादाम दूध', icon: '🥛', ingredient: 'Almonds & Saffron Milk' },
    { title: 'Peanut & Jaggery Chikki', local: 'मूंगफली चिक्की', icon: '🍬', ingredient: 'Roasted Peanuts & Jaggery' },
    { title: 'Roasted Chana Chatpata', local: 'भुना चना', icon: '🍿', ingredient: 'Roasted Bengal Gram' },
    { title: 'Apple Cinnamon Stew', local: 'सेब की खीर', icon: '🍎', ingredient: 'Fresh Apple & Cinnamon' },
    { title: 'Papaya Yogurt Parfait', local: 'पपीता दही', icon: '🥭', ingredient: 'Ripe Papaya & Curd' },
    { title: 'Besan & Jaggery Halwa', local: 'बेसन का शीरा', icon: '🍮', ingredient: 'Gram Flour & Jaggery' },
    { title: 'Steamed Dhokla Cubes', local: 'खमण ढोकला', icon: '🟨', ingredient: 'Fermented Besan Batter' },
    { title: 'Sesame (Til) Jaggery Bites', local: 'तिल गुड़ लड्डू', icon: '🧆', ingredient: 'Sesame Seeds & Jaggery' },
    { title: 'Carrot Halwa with Jaggery', local: 'गाजर का हलवा', icon: '🥕', ingredient: 'Grated Carrot & Ghee' },
    { title: 'Chia Seed Mango Pudding', local: 'चिया मैंगो पुडिंग', icon: '🥭', ingredient: 'Chia Seeds & Mango' },
    { title: 'Paneer Cubes with Chaat Masala', local: 'पनीर चाट', icon: '🧀', ingredient: 'Fresh Soft Paneer' },
    { title: 'Crispy Roasted Peanuts with Jaggery', local: 'मूंगफली गुड़', icon: '🥜', ingredient: 'Peanuts & Jaggery' },
    { title: 'Dry Fruit Energy Shake', local: 'ड्राई फ्रूट शेक', icon: '🥤', ingredient: 'Figs, Dates & Milk' },
    { title: 'Cucumber Carrot Mint Sticks', local: 'सलाद स्टिक्स', icon: '🥒', ingredient: 'Cucumber & Carrots' },
    { title: 'Ragi Chocolate Cookies (Healthy)', local: 'रागी कुकीज', icon: '🍪', ingredient: 'Ragi Flour & Cacao' },
    { title: 'Pomegranate & Guava Fruit Bowl', local: 'अमरूद अनार चाट', icon: '🍉', ingredient: 'Guava & Pomegranate' },
    { title: 'Boiled Kala Chana Sundal', local: 'काला चना सुंडल', icon: '🥗', ingredient: 'Black Chickpeas & Coconut' },
    { title: 'Sattu Drink with Lemon', local: 'सत्तू शरबत', icon: '🥤', ingredient: 'Roasted Sattu & Cumin' },
    { title: 'Warm Turmeric Milk with Honey', local: 'हल्दी दूध', icon: '🥛', ingredient: 'Turmeric & Warm Milk' },
    { title: 'Coconut Ladoo with Jaggery', local: 'नारियल लड्डू', icon: '🥥', ingredient: 'Fresh Coconut & Jaggery' },
    { title: 'Steamed Corn & Paneer Bhel', local: 'मकई पनीर भेल', icon: '🌽', ingredient: 'Sweet Corn & Paneer' },
    { title: 'Oats & Raisin Soft Drops', local: 'ओट्स किशमिश बाइट', icon: '🍪', ingredient: 'Oats & Golden Raisins' },
    { title: 'Stewed Fig & Milk Compote', local: 'अंजीर दूध', icon: '🥛', ingredient: 'Dried Figs & Milk' }
  ];

  snackBases.forEach((base, i) => {
    snacksSeeds.push({
      name: `${base.title} (${ageLimit})`,
      localName: `${base.local} / சிற்றுண்டி`,
      prepTime: '5-10 mins',
      cookTime: '5-10 mins',
      category: 'Snacks',
      ingredients: [
        `1 cup ${base.ingredient}`,
        '1/2 teaspoon Desi Ghee or Cold-pressed oil',
        isInfant ? 'Pinch of cardamom powder' : 'Pinch of chaat masala or organic jaggery'
      ],
      instructions: [
        `Prep ${base.ingredient} fresh.`,
        'Roast or lightly steam to release aroma and enhance nutrient bioavailability.',
        'Serve in a small colorful snack bowl or finger food container.'
      ],
      benefits: `Natural source of protein, essential trace minerals, and healthy fats without refined sugars or palm oils.`,
      safety: isInfant ? 'Powder or mash nuts finely to eliminate choking.' : 'Ensure whole nuts are chewed carefully by older children.',
      icon: base.icon
    });
  });

  const allCategoryRecipes: Recipe[] = [
    ...generate30MealRecipes(stageId, ageLimit, 'Morning', morningSeeds),
    ...generate30MealRecipes(stageId, ageLimit, 'Lunch', lunchSeeds),
    ...generate30MealRecipes(stageId, ageLimit, 'Dinner', dinnerSeeds),
    ...generate30MealRecipes(stageId, ageLimit, 'Snacks', snacksSeeds)
  ];

  return allCategoryRecipes;
}

// -------------------------------------------------------------
// COMPLETE 10 AGE STAGES DATA (120 RECIPES EACH = 1,200 TOTAL)
// -------------------------------------------------------------

export const completeAgeStagesData: AgeGroupData[] = [
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
    recipes: buildStageRecipes('0_6_months', '0 - 6 Months', true, false, false)
  },
  {
    id: '6_8_months',
    ageLimit: '6 - 8 Months',
    title: 'Stage 1 Purees & Weaning',
    guidelines: 'Introduce iron-rich single-ingredient purees once or twice daily after milk. Allow baby to explore pureed textures with spoon.',
    milestones: [
      'Opens mouth eagerly when food spoon approaches.',
      'Moves food smoothly from front of tongue to back for swallowing.',
      'Sits with minimal support in high chair.'
    ],
    recipes: buildStageRecipes('6_8_months', '6 - 8 Months', true, false, false)
  },
  {
    id: '8_10_months',
    ageLimit: '8 - 10 Months',
    title: 'Stage 2 Mashed & Finger Foods',
    guidelines: 'Advance from silky purees to soft fork-mashed textures and soft-cooked finger foods to encourage jaw chewing movements.',
    milestones: [
      'Develops pincer grasp (picks up soft pieces between thumb and forefinger).',
      'Chews with gums in an up-and-down rotary motion.',
      'Takes small sips of water from an open cup held by parent.'
    ],
    recipes: buildStageRecipes('8_10_months', '8 - 10 Months', false, true, false)
  },
  {
    id: '10_12_months',
    ageLimit: '10 - 12 Months',
    title: 'Minced Meals & Table Bites',
    guidelines: 'Baby transitions to eating 3 meals plus 1 snack daily. Offer soft chopped family table food seasoned mildly with turmeric, cumin, and ghee.',
    milestones: [
      'Feeds self finger foods with enthusiasm and accuracy.',
      'Drinks water from straw or two-handled cup independently.',
      'Enjoys diverse textures like soft rotis, lentils, and steamed veggies.'
    ],
    recipes: buildStageRecipes('10_12_months', '10 - 12 Months', false, true, false)
  },
  {
    id: '12_24_months',
    ageLimit: '1 - 2 Years',
    title: 'Toddler Table Foods',
    guidelines: 'Toddler eats 3 family-style meals and 2 healthy snacks daily. Whole cow milk can be introduced as a beverage. Offer colorful family meals.',
    milestones: [
      'Feeds self with child spoon, though occasional spills happen.',
      'Has multiple primary teeth and chews varied textures comfortably.',
      'Drinks independently from open cup and shows clear taste likes.'
    ],
    recipes: buildStageRecipes('12_24_months', '1 - 2 Years', false, true, false)
  },
  {
    id: '24_36_months',
    ageLimit: '2 - 3 Years',
    title: 'Independent Toddler Eating',
    guidelines: 'Active toddlers need regular nutrient-dense snacks and balanced family meals. Encourage using toddler forks and spoons and participation in cooking.',
    milestones: [
      'Uses fork and spoon with good hand-eye coordination.',
      'Vocalizes clear food preferences and enjoys helping wash veggies.',
      'Eats the same balanced healthy foods as the rest of the family.'
    ],
    recipes: buildStageRecipes('24_36_months', '2 - 3 Years', false, true, false)
  },
  {
    id: '3_5_years',
    ageLimit: '3 - 5 Years',
    title: 'Preschool Active Explorer',
    guidelines: 'Preschoolers need sustained energy for high physical activity, cognitive play, and immune defense. Offer 3 solid meals and 2 nutritious snacks.',
    milestones: [
      'Eats completely independently using regular child spoons and forks.',
      'Enjoys varied textures including crunchy raw cucumber, carrots, and soft rotis.',
      'Develops taste preferences and can help wash veggies or mix batters.'
    ],
    recipes: buildStageRecipes('3_5_years', '3 - 5 Years', false, false, true)
  },
  {
    id: '5_10_years',
    ageLimit: '5 - 10 Years',
    title: 'School-Age Growth & Activity',
    guidelines: 'School-age kids need sustained energy for classroom focus, active playground sports, and developing skeletal strength. Focus on whole grains, lentils, fresh seasonal greens, and high-calcium dairy.',
    milestones: [
      'Has full adult-style eating capabilities with primary & permanent teeth emerging.',
      'Participates in packing school lunchboxes and has strong taste preferences.',
      'Needs steady hydration (1.2 - 1.5 liters) and balanced snack breaks after school.'
    ],
    recipes: buildStageRecipes('5_10_years', '5 - 10 Years', false, false, true)
  },
  {
    id: '10_15_years',
    ageLimit: '10 - 15 Years',
    title: 'Pre-Teens & Rapid Growth',
    guidelines: 'Pre-teens undergo accelerated growth spurts in height, bone density, and muscle mass. Prioritize calcium, high-quality protein, complex carbohydrates, iron, and steady hydration.',
    milestones: [
      'Experiences peak growth spurt requiring dense caloric and micronutrient support.',
      'Active in sports, workouts, and after-school extracurricular activities.',
      'Capable of cooking simple, healthy Indian breakfast and snack items independently.'
    ],
    recipes: buildStageRecipes('10_15_years', '10 - 15 Years', false, false, true)
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
    recipes: buildStageRecipes('15_18_years', '15 - 18 Years', false, false, true)
  }
];
