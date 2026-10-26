const { outputStageFile } = require('./stageBuilderHelper.cjs');
const fs = require('fs');
const path = require('path');

// Reusable Indian dishes with age-tailored variations
// Morning Breakfasts (Idlis, Dosas, Poha, Upma, Parathas, Theplas, Porridges, Cheelas)
const indianMorningBases = [
  { name: 'Steamed Rava Vegetable Idli', localName: 'रवा वेज इडली / ரவா இட்லி', icon: '⚪', main: 'Semolina & veggies',
    ing: ['Semolina (Rava)', 'Fresh curd (dahi)', 'Grated carrot and peas', 'Pinch of cumin and mild salt', 'Ghee for greasing'],
    steps: ['Mix rava, curd, and water into a smooth batter; rest for 10 minutes.', 'Stir in finely grated veggies and cumin.', 'Pour into greased idli plates and steam for 10 minutes until fluffy.', 'Serve warm with mild coconut chutney or warm dal.']
  },
  { name: 'Moong Dal & Paneer Cheela', localName: 'मूंग दाल पनीर चीला / பாசிப்பருப்பு அடை', icon: '🫓', main: 'Yellow moong & grated paneer',
    ing: ['Soaked yellow moong dal batter', 'Fresh grated paneer', 'Finely chopped coriander', 'Pinch of turmeric and cumin', 'Desi ghee'],
    steps: ['Grind soaked moong dal into a smooth pouring batter with cumin.', 'Spread a ladle of batter on a hot greased tawa.', 'Top with grated paneer and fold gently once golden.', 'Serve warm with fresh mint-curd dip.']
  },
  { name: 'Mild Vegetable Poha with Sweet Peas', localName: 'वेजिटेबल पोहा / காய்கறி அவல்', icon: '🥣', main: 'Flattened rice & veggies',
    ing: ['Thick flattened rice (poha)', 'Steamed green peas & diced potatoes', 'Mustard seeds and turmeric', 'Fresh lemon juice', 'Curry leaves and ghee'],
    steps: ['Rinse poha gently and drain completely.', 'Sauté mustard seeds, curry leaves, and veggies in ghee until soft.', 'Toss in softened poha, turmeric, and a splash of water; steam covered for 3 minutes.', 'Finish with lemon juice and serve warm.']
  },
  { name: 'Whole Wheat Methi Thepla', localName: 'मेथी थेपला / வெந்தயக்கீரை சப்பாத்தி', icon: '🫓', main: 'Fenugreek leaves & whole wheat',
    ing: ['Whole wheat flour (atta)', 'Fresh finely chopped methi leaves', 'Turmeric and ajwain seeds', 'Curd for soft dough', 'Ghee for roasting'],
    steps: ['Knead flour with methi, ajwain, turmeric, and curd into a soft pliable dough.', 'Roll out thin discs on a floured surface.', 'Cook on hot tawa with drops of ghee until soft specks appear.', 'Roll into soft finger-friendly rolls.']
  },
  { name: 'Sprouted Ragi & Banana Malt Porridge', localName: 'रागी माल्ट / ராகி கஞ்சி', icon: '🥣', main: 'Sprouted finger millet & banana',
    ing: ['Sprouted ragi flour', 'Milk or water', 'Mashed ripe banana', 'Crushed cardamom', 'Desi ghee'],
    steps: ['Mix ragi flour in cold water to make a lump-free slurry.', 'Simmer on low heat, stirring continuously until thick and glossy.', 'Stir in milk, mashed banana, and cardamom for natural sweetness.', 'Serve lukewarm with a dab of ghee.']
  },
  { name: 'Vegetable Daliya (Broken Wheat) Upma', localName: 'दलिया उपमा / கோதுமை ரவை உப்புமா', icon: '🍲', main: 'Broken wheat & carrots',
    ing: ['Roasted broken wheat (daliya)', 'Diced carrots, beans, and peas', 'Cumin seeds and ginger', 'Warm water', 'Ghee'],
    steps: ['Sauté cumin and ginger in ghee, then add diced vegetables.', 'Add roasted daliya and double the quantity of warm water.', 'Cover and simmer on low heat until tender and fluffy.', 'Garnish with fresh coriander.']
  },
  { name: 'Soft Paneer & Spinach Paratha', localName: 'पालक पनीर पराठा / பாலக் பன்னீர் சப்பாத்தி', icon: '🫓', main: 'Paneer & pureed spinach',
    ing: ['Whole wheat atta', 'Blanched spinach puree', 'Crumble paneer stuffing', 'Roasted cumin', 'Ghee'],
    steps: ['Knead flour with spinach puree to make vibrant green dough.', 'Stuff with spiced crumbled paneer and roll gently.', 'Tawa-roast with ghee until soft and golden on both sides.', 'Slice into fun finger triangles and serve with dahi.']
  },
  { name: 'Steamed Beetroot & Oats Idli', localName: 'चुकंदर ओट्स इडली / பீட்ரூட் ஓட்ஸ் இட்லி', icon: '⚪', main: 'Beetroot puree & oats powder',
    ing: ['Powdered rolled oats', 'Beetroot puree', 'Fresh yogurt', 'Mustard seeds tempering', 'Ghee'],
    steps: ['Whisk oats powder, beetroot puree, yogurt, and a splash of water.', 'Let rest for 5 minutes, then add mild mustard tempering.', 'Steam in idli moulds for 10-12 minutes until fluffy pink cakes form.', 'Serve warm.']
  },
  { name: 'Crispy Ragi & Curd Dosa', localName: 'रागी दोसा / ராகி தோசை', icon: '🥞', main: 'Ragi flour & buttermilk',
    ing: ['Ragi flour', 'Rice flour', 'Sour curd or buttermilk', 'Chopped coriander and cumin', 'Ghee'],
    steps: ['Mix flours with curd and water into a thin crepe batter.', 'Pour evenly on a sizzling tawa from outside in.', 'Drizzle ghee on edges until crisp and golden.', 'Fold and serve with tomato-lentil chutney.']
  },
  { name: 'Fluffy Scrambled Paneer (Bhurji) on Toast', localName: 'पनीर भुर्जी टोस्ट / பன்னீர் புர்ஜி', icon: '🥪', main: 'Crumbled paneer & whole wheat bread',
    ing: ['Fresh malai paneer crumbled', 'Finely diced tomato and capsicum', 'Turmeric and cumin powder', 'Whole wheat bread slices', 'Butter or ghee'],
    steps: ['Sauté tomatoes and capsicum in ghee with mild spices.', 'Add fresh paneer crumbles and toss gently for 2 minutes.', 'Spoon over toasted whole wheat bread slices.', 'Cut into bite-sized finger soldiers.']
  },
  { name: 'Steamed Sweet Corn & Semolina Dhokla', localName: 'कॉर्न ढोकला / மக்காச்சோளம் டோக்ளா', icon: '🟡', main: 'Sweet corn & semolina',
    ing: ['Coarse semolina (rava)', 'Sweet corn paste', 'Curd and lemon juice', 'Mustard seeds and curry leaves', 'Ghee'],
    steps: ['Mix semolina, sweet corn puree, curd, and water into a thick batter.', 'Steam in a greased plate for 15 minutes until set.', 'Temper with mustard seeds and curry leaves.', 'Cut into soft yellow squares.']
  },
  { name: 'Mixed Vegetable Vermicelli (Seviyan) Upma', localName: 'सेवई उपमा / சேமியா கிச்சடி', icon: '🍜', main: 'Roasted wheat vermicelli',
    ing: ['Roasted whole wheat vermicelli', 'Diced carrots, peas, and bell peppers', 'Mustard seeds and curry leaves', 'Water', 'Ghee'],
    steps: ['Sauté mustard seeds, curry leaves, and veggies in ghee.', 'Pour in water and bring to a rolling boil.', 'Add roasted vermicelli, cover with lid, and steam on low for 5 minutes.', 'Fluff with a fork and serve warm.']
  },
  { name: 'Sprouted Green Moong & Carrot Uttapam', localName: 'स्प्राउट्स उत्तपम / பாசிப்பயறு உத்தப்பம்', icon: '🥞', main: 'Sprouted moong & carrot',
    ing: ['Sprouted moong batter', 'Grated sweet carrots', 'Finely chopped mint', 'Ghee for tawa'],
    steps: ['Spread a thick ladle of moong batter onto a warm tawa.', 'Press grated carrots and mint onto the top surface.', 'Drizzle ghee, flip gently, and cook both sides until golden.', 'Serve warm with coconut dip.']
  },
  { name: 'Aloo & Ajwain Stuffed Soft Paratha', localName: 'आलू पराठा / உருளைக்கிழங்கு சப்பாத்தி', icon: '🫓', main: 'Mashed potatoes & carom seeds',
    ing: ['Boiled mashed potatoes', 'Whole wheat dough', 'Ajwain (carom seeds)', 'Coriander and turmeric', 'Ghee'],
    steps: ['Mash boiled potatoes with ajwain and mild herbs.', 'Stuff inside whole wheat dough ball and roll evenly.', 'Pan-sear in desi ghee until golden brown and soft.', 'Cut into quarters and serve with dahi.']
  },
  { name: 'Oats & Apple Cinnamon Porridge', localName: 'ओट्स सेब दलिया / ஓட்ஸ் ஆப்பிள் கஞ்சி', icon: '🥣', main: 'Rolled oats & sweet apple',
    ing: ['Rolled oats', 'Finely grated sweet apple', 'Warm cow milk or almond milk', 'Pinch of ground cinnamon', 'Crushed almonds (fine)'],
    steps: ['Simmer rolled oats in water and milk for 5 minutes.', 'Stir in grated apple and cinnamon powder.', 'Cook for 2 more minutes until creamy and aromatic.', 'Serve warm with a drizzle of honey or jaggery.']
  },
  { name: 'Kanchipuram Style Mild Pepper Idlis', localName: 'कांचीपुरम इडली / காஞ்சிபுரம் இட்லி', icon: '⚪', main: 'Fermented batter & mild cumin',
    ing: ['Idli rice and urad dal batter', 'Crushed cumin and ginger', 'Curry leaves', 'Ghee for greasing'],
    steps: ['Season fermented batter with crushed cumin and fresh ginger.', 'Steam in shallow cups lined with ghee for 12 minutes.', 'Unmould soft aromatic idlis.', 'Serve warm with coconut chutney.']
  },
  { name: 'Sweet Jaggery & Wheat Sheera (Halwa)', localName: 'आटा शीरा / கோதுமை அல்வா', icon: '🍯', main: 'Whole wheat flour & organic jaggery',
    ing: ['Whole wheat flour (atta)', 'Desi ghee', 'Organic jaggery syrup', 'Cardamom powder', 'Chopped soft dry fruits'],
    steps: ['Roast atta in generous ghee until deeply fragrant and golden.', 'Carefully pour in hot jaggery water while stirring to avoid lumps.', 'Cook until ghee separates from sides.', 'Flavour with cardamom and serve warm.']
  },
  { name: 'Besan & Grated Carrot Chilla', localName: 'बेसन गाजर चीला / கடலை மாவு அடை', icon: '🫓', main: 'Gram flour & carrots',
    ing: ['Besan (gram flour)', 'Finely grated carrot and coriander', 'Ajwain and turmeric', 'Warm water', 'Ghee'],
    steps: ['Whisk besan with water, ajwain, and turmeric into a crepe batter.', 'Fold in grated carrot.', 'Pour on hot tawa and cook both sides with ghee until golden crisp.', 'Serve with mint chutney.']
  },
  { name: 'Set Dosa with Mild Vegetable Sagu', localName: 'सेट दोसा / செட் தோசை', icon: '🥞', main: 'Soft spongy rice dosas',
    ing: ['Fermented rice-poha batter', 'Ghee for tawa', 'Mixed vegetable sagu (mild stew)'],
    steps: ['Pour small ladles of thick batter on tawa without spreading too thin.', 'Cover with lid to steam until spongy with lots of tiny pores.', 'Serve stacked warm with vegetable sagu.']
  },
  { name: 'Sattu & Herb Protein Stuffed Paratha', localName: 'सत्तू पराठा / சத்து சப்பாத்தி', icon: '🫓', main: 'Roasted gram flour & herbs',
    ing: ['Roasted gram sattu', 'Kalonji and ajwain', 'Lemon juice and coriander', 'Whole wheat dough', 'Mustard oil or ghee'],
    steps: ['Mix sattu with herbs, lemon juice, and drops of water for stuffing.', 'Pack inside dough and roll into round flatbread.', 'Roast on tawa until crisp and cooked through.', 'Serve warm with fresh yogurt.']
  },
  { name: 'Sweet Banana & Jaggery Appam', localName: 'उन्नियाप्पम / அப்பம்', icon: '🟤', main: 'Mashed banana & rice flour',
    ing: ['Rice flour', 'Ripe mashed banana', 'Jaggery syrup', 'Cardamom and coconut bits', 'Ghee'],
    steps: ['Combine rice flour, mashed banana, and warm jaggery syrup into a thick batter.', 'Spoon batter into appe (paniyaram) pan cavities with ghee.', 'Turn with skewer until golden on all sides.', 'Serve as a warm sweet breakfast.']
  },
  { name: 'Sprouted Kala Chana Cheela', localName: 'काला चना चीला / கொண்டைக்கடலை தோசை', icon: '🫓', main: 'Sprouted black chickpeas',
    ing: ['Soaked black chana batter', 'Ginger and cumin', 'Finely chopped onions and coriander', 'Ghee'],
    steps: ['Grind sprouted chana with ginger into a smooth batter.', 'Spread on hot tawa into a round crepe.', 'Cook until crisp and aromatic with ghee.', 'Serve with curd.']
  },
  { name: 'Mooli & Ajwain Soft Phulka Rolls', localName: 'मूली पराठा / முள்ளங்கி சப்பாத்தி', icon: '🫓', main: 'Grated radish & ajwain',
    ing: ['Grated sweet mooli squeezed dry', 'Whole wheat flour', 'Ajwain and green coriander', 'Ghee'],
    steps: ['Knead mooli directly with atta and spices without extra water.', 'Roll into soft phulkas and roast on hot tawa.', 'Brush with pure ghee and roll tightly.', 'Serve warm.']
  },
  { name: 'Sabudana & Peanut Soft Khichdi', localName: 'साबूदाना खिचड़ी / ஜவ்வரிசி கிச்சடி', icon: '⚪', main: 'Tapioca pearls & roasted peanuts',
    ing: ['Soaked fluffy sabudana', 'Roasted crushed peanuts', 'Boiled potato cubes', 'Cumin seeds and lemon', 'Ghee'],
    steps: ['Sauté cumin and potatoes in ghee.', 'Add soaked sabudana pearls and crushed peanuts.', 'Steam on low flame for 4 minutes until pearls turn translucent.', 'Finish with fresh lemon juice.']
  },
  { name: 'Foxtail Millet (Kangni) Veggie Upma', localName: 'कंगनी मिलेट उपमा / தினை உப்புமா', icon: '🍲', main: 'Foxtail millet & garden veggies',
    ing: ['Washed foxtail millet', 'Diced carrots, beans, and onions', 'Mustard seeds and curry leaves', 'Ghee'],
    steps: ['Roast millet lightly in ghee.', 'Sauté mustard seeds and veggies, add water and boil.', 'Add millet, simmer covered until water absorbs and grains fluff up.', 'Serve hot.']
  },
  { name: 'Paneer & Sweet Corn Stuffed Toasties', localName: 'पनीर कॉर्न टोस्ट / பன்னீர் சோள டோஸ்ட்', icon: '🥪', main: 'Paneer, corn & multi-grain bread',
    ing: ['Boiled sweet corn kernels', 'Crumble paneer', 'Mild Italian herbs and cumin', 'Multi-grain bread', 'Butter'],
    steps: ['Mix corn and paneer with herbs and a pinch of salt.', 'Layer between bread slices and toast on tawa until golden-crisp.', 'Cut diagonally into triangles.', 'Serve warm.']
  },
  { name: 'Gobi & Coriander Stuffed Paratha', localName: 'गोभी पराठा / காலிஃபிளவர் சப்பாத்தி', icon: '🫓', main: 'Finely grated cauliflower',
    ing: ['Grated cauliflower florets', 'Ajwain, turmeric, and coriander', 'Whole wheat dough', 'Desi ghee'],
    steps: ['Toss grated cauliflower with spices.', 'Seal inside atta peda and roll gently.', 'Roast on tawa with ghee on both sides.', 'Serve with chilled dahi.']
  },
  { name: 'Curd & Poha Soft Pancakes (Atukula Dosa)', localName: 'अतुकुला दोसा / அவல் தோசை', icon: '🥞', main: 'Poha & curd batter',
    ing: ['Soaked poha and rice batter', 'Curd', 'Baking soda pinch', 'Ghee'],
    steps: ['Grind poha, rice, and curd into a silky white batter.', 'Pour ladles on warm tawa without spreading for soft sponge dosas.', 'Cook covered for 2 minutes.', 'Serve with chutney.']
  },
  { name: 'Broken Wheat (Lapsi) Sweet Porridge', localName: 'लापसी / கோதுமை ரவை பாயாசம்', icon: '🥣', main: 'Cracked wheat & jaggery',
    ing: ['Broken wheat (daliya)', 'Pure desi ghee', 'Organic jaggery', 'Milk', 'Cardamom powder'],
    steps: ['Roast broken wheat in ghee until nutty and pinkish.', 'Pressure cook with water until soft.', 'Add jaggery syrup and warm milk; simmer for 5 minutes.', 'Serve warm.']
  },
  { name: 'Egg Bhurji or Tofu Scramble Wrap', localName: 'अंडा भुर्जी रोल / முட்டை புர்ஜி ரோல்', icon: '🌯', main: 'Eggs or tofu with soft roti',
    ing: ['Beaten eggs or crumbled tofu', 'Finely diced onion and tomato', 'Turmeric and coriander', 'Whole wheat roti', 'Ghee'],
    steps: ['Scramble eggs or tofu in a pan with veggies and mild spices.', 'Spoon along the center of a warm whole wheat roti.', 'Roll tightly into an easy-to-hold wrap.', 'Serve warm.']
  }
];

// Helper to adapt bases for different stages
function adaptMorning(bases, stage) {
  return bases.map((b, i) => {
    let name = b.name;
    let benefits = 'Packed with complex carbohydrates, essential plant proteins, and sustained energy for growing children.';
    let safety = 'Ensure proper temperature before serving. Cut into age-appropriate portions.';

    if (stage.id.includes('months')) {
      name = `Soft Baby ${b.name.replace('Toast', 'Mash').replace('Crispy', 'Soft')}`;
      benefits = 'Gentle on infant digestion, promotes early palate development and nutrient absorption.';
      safety = 'Ensure completely soft texture with zero hard seeds or whole nuts. Mash thoroughly.';
    } else if (stage.id.includes('15_18') || stage.id.includes('10_15')) {
      name = `High-Protein ${b.name}`;
      benefits = 'High calcium, iron, and slow-burning complex carbs support rapid athletic growth, bone density, and study stamina.';
      safety = 'Nutrient-dense breakfast to prevent morning fatigue and support active sports.';
    }

    return {
      name,
      localName: b.localName,
      prepTime: '10 mins',
      cookTime: '12 mins',
      icon: b.icon,
      ingredients: b.ing,
      instructions: b.steps,
      benefits,
      safety
    };
  });
}

// Lunch Base Dishes (Khichdi, Dal Rice, Rajma, Chole, Pulao, Curd Rice, Sambar, Sabzis with Phulka)
const indianLunchBases = [
  { name: 'Moong Dal & Carrot Comfort Khichdi', localName: 'मूंग दाल खिचड़ी / பருப்பு கிச்சடி', icon: '🍲',
    ing: ['1/4 cup Yellow moong dal', '1/4 cup Rice', '1/2 cup Diced carrots and peas', 'Pinch of turmeric and cumin seeds', '1 tsp Pure desi ghee'],
    steps: ['Wash rice and dal together until water runs clear.', 'Sauté cumin seeds and diced vegetables in ghee.', 'Add rice, dal, and 3 cups of water.', 'Pressure cook for 3-4 whistles until very soft and mushy.', 'Mash lightly and serve warm.']
  },
  { name: 'Authentic Curd Rice with Pomegranate', localName: 'दही चावल / தயிர் சாதம்', icon: '🍚',
    ing: ['1/2 cup Soft mashed boiled rice', '1/2 cup Fresh homemade curd (dahi)', 'Pinch of mustard seeds and curry leaves', '2 tbsp Pomegranate seeds or grated cucumber', '1/2 tsp Ghee'],
    steps: ['Warm rice slightly and mash thoroughly with a potato masher.', 'Mix in fresh curd and a splash of milk to maintain creamy texture.', 'Prepare tempering of mustard seeds and curry leaves in ghee; pour over rice.', 'Garnish with sweet pomegranate seeds and serve cool.']
  },
  { name: 'Homestyle Rajma (Kidney Bean) Curry with Jeera Rice', localName: 'राजमा चावल / ராஜ்மா சாதம்', icon: '🍛',
    ing: ['1/2 cup Overnight soaked red rajma', '1 cup Basmati or sona masoori rice', 'Pureed tomatoes, ginger, and cumin', 'Turmeric, coriander powder, and mild salt', '1 tbsp Ghee'],
    steps: ['Pressure cook soaked rajma until melt-in-mouth soft.', 'Simmer with tomato-ginger gravy and spices for 15 minutes.', 'Cook rice with cumin seeds in ghee.', 'Serve warm ladled over steaming rice.']
  },
  { name: 'Tender Paneer & Green Peas Pulao', localName: 'पनीर मटर पुलाव / பன்னீர் புலாவ்', icon: '🍲',
    ing: ['1/2 cup Rice', '1/3 cup Soft paneer cubes', '1/4 cup Sweet green peas', 'Mild whole spices (bay leaf, clove, cumin)', '1 tbsp Desi ghee'],
    steps: ['Sauté paneer cubes in ghee until slightly golden, set aside.', 'Sauté spices, peas, and soaked rice in the same pan.', 'Add water and cook covered until rice absorbs moisture and grains fluff.', 'Fold in soft paneer and serve with cucumber raita.']
  },
  { name: 'South Indian Sambar Sadam (Lentil Veggie Rice)', localName: 'सांभर सादम / சாம்பார் சாதம்', icon: '🍛',
    ing: ['1/4 cup Toor dal', '1/4 cup Rice', 'Drumstick, carrot, and pumpkin chunks', 'Mild sambar powder and tamarind extract', 'Ghee and curry leaves'],
    steps: ['Cook toor dal and rice together with vegetables until very soft.', 'Stir in mild sambar powder and tamarind extract.', 'Simmer for 5 minutes so flavours blend into the rice.', 'Temper with mustard and curry leaves in ghee; serve warm.']
  },
  { name: 'Palak Dal (Spinach Lentils) with Soft Phulkas', localName: 'पालक वाली दाल / பாலக் பருப்பு', icon: '🫓',
    ing: ['1/2 cup Yellow moong or toor dal', '1 cup Fresh washed spinach (palak)', 'Chopped tomatoes, cumin, and garlic', 'Whole wheat phulkas', 'Desi ghee'],
    steps: ['Pressure cook dal and spinach together until tender.', 'Temper with cumin, garlic, and tomatoes in ghee.', 'Simmer for 5 minutes and mash gently.', 'Serve with hot puffed phulkas brushed with ghee.']
  },
  { name: 'Chole (Chickpeas) Masala with Steamed Rice', localName: 'छोले चावल / கொண்டைக்கடலை சாதம்', icon: '🍛',
    ing: ['1/2 cup Soaked white kabuli chana', 'Tomato-onion mild gravy', 'Cumin, coriander, and amchur', 'Steamed rice', 'Ghee'],
    steps: ['Pressure cook chickpeas until meltingly soft.', 'Simmer in tomato gravy with gentle aromatic spices.', 'Mash a few chickpeas to thicken gravy naturally.', 'Serve warm over steamed rice.']
  },
  { name: 'Lauki & Chana Dal with Warm Chapati', localName: 'लौकी चना दाल / சுரைக்காய் கடலைப்பருப்பு', icon: '🍲',
    ing: ['1/4 cup Chana dal (soaked)', '1 cup Diced sweet bottle gourd (lauki)', 'Tomato, cumin, and turmeric', 'Whole wheat chapati', 'Ghee'],
    steps: ['Cook chana dal and lauki together in pressure cooker with turmeric.', 'Temper with cumin and tomato in ghee.', 'Simmer for 4 minutes until thick and aromatic.', 'Serve with warm soft chapatis.']
  },
  { name: 'Beetroot & Moong Dal Rice Bowl', localName: 'चुकंदर मूंग दाल चावल / பீட்ரூட் சாதம்', icon: '🟣',
    ing: ['1/4 cup Rice', '2 tbsp Yellow moong dal', '1/2 cup Finely grated beetroot', 'Cumin, ghee, and roasted cashews'],
    steps: ['Cook rice and dal with grated beetroot until colorful and soft.', 'Temper with cumin and a touch of ghee.', 'Stir well to blend the natural sweetness of beetroot with dal.', 'Serve warm with fresh curd.']
  },
  { name: 'Mild Tomato Rasam with Mashed Rice & Ghee', localName: 'रसम चावल / தக்காளி ரசம் சாதம்', icon: '🥣',
    ing: ['1/2 cup Soft mashed rice', 'Ripe tomato broth seasoned with cumin, black pepper, and curry leaves', 'Toor dal water', 'Pure desi ghee'],
    steps: ['Boil tomatoes with crushed cumin and mild pepper into a fragrant rasam broth.', 'Add a splash of dal water and simmer.', 'Pour generous spoonfuls over hot mashed rice.', 'Finish with melted desi ghee and serve.']
  },
  { name: 'Aloo Gobi Matar with Ajwain Roti', localName: 'आलू गोभी मटर / உருளை காலிஃபிளவர்', icon: '🫓',
    ing: ['Diced potatoes, cauliflower florets, and green peas', 'Tomato-cumin mild masala', 'Whole wheat ajwain rotis', 'Fresh coriander', 'Ghee'],
    steps: ['Steam potato cubes and cauliflower until fork tender.', 'Toss in pan with tomatoes, peas, cumin, and turmeric.', 'Cover and cook on low heat for 8 minutes.', 'Serve with hot ajwain rotis.']
  },
  { name: 'Panchmel Dal (Five Lentil Stew) with Rice', localName: 'पंचमेल दाल / பஞ்ச பருப்பு', icon: '🍲',
    ing: ['Equal parts Moong, Masoor, Toor, Chana, and Urad dal', 'Tomato, ginger, and cumin', 'Steamed rice', 'Ghee'],
    steps: ['Wash and pressure cook mixed lentils until completely tender.', 'Whisk into a rich, creamy consistency.', 'Temper with ginger, cumin, and ghee.', 'Serve poured over steaming rice.']
  },
  { name: 'Kadhi Pakora with Steamed Basmati Rice', localName: 'कढ़ी चावल / மோர் குழம்பு சாதம்', icon: '🍛',
    ing: ['Fresh sour curd whisked with besan (gram flour)', 'Steamed methi or palak dumplings', 'Mustard seeds, fenugreek, and curry leaves', 'Steamed basmati rice', 'Ghee'],
    steps: ['Whisk besan into spiced curd and water; simmer on low heat for 20 minutes.', 'Add soft steamed veggie dumplings.', 'Temper with mustard and fenugreek in ghee.', 'Serve hot over basmati rice.']
  },
  { name: 'Vegetable Biryani with Cucumber Mint Raita', localName: 'वेज बिरयानी / காய்கறி பிரியாணி', icon: '🍲',
    ing: ['Basmati rice', 'Carrots, beans, peas, and paneer cubes', 'Mild biryani spices (cardamom, cinnamon)', 'Fresh mint and coriander', 'Ghee'],
    steps: ['Sauté veggies and paneer with mild spices.', 'Layer partially cooked rice over vegetables in a heavy-bottomed pot.', 'Cover tightly and dum-cook on low heat for 15 minutes.', 'Serve warm with cool cucumber raita.']
  },
  { name: 'Bhakri with Pithla (Maharashtrian Gram Flour Curry)', localName: 'भाकरी पिठलं / கடலை மாவு பித்லா', icon: '🫓',
    ing: ['Besan (gram flour)', 'Cumin, mustard, and green coriander', 'Jowar (sorghum) flour for bhakri', 'Ghee'],
    steps: ['Cook besan paste in tempered water until thick, glossy, and savory.', 'Knead jowar flour with warm water and pat into flat bhakris.', 'Roast on tawa until puffed.', 'Serve warm with hot pithla.']
  },
  { name: 'Soft Dal Makhani (Homestyle Light) with Jeera Rice', localName: 'दाल मखनी / பருப்பு மக்கானி', icon: '🍲',
    ing: ['Whole black urad and rajma', 'Tomato puree and ginger', '1 tbsp Fresh cream and desi ghee', 'Jeera rice'],
    steps: ['Pressure cook black lentils until creamy and melt-in-mouth.', 'Simmer with tomato-ginger reduction for 25 minutes.', 'Stir in pure ghee and a spoon of fresh cream for velvety finish.', 'Serve warm with cumin rice.']
  },
  { name: 'Mushroom & Sweet Corn Matar Pulao', localName: 'मशरूम मटर पुलाव / காளான் புலாவ்', icon: '🍲',
    ing: ['Button mushrooms sliced', 'Sweet corn and green peas', 'Long grain rice', 'Mild spices and ghee'],
    steps: ['Sauté mushrooms and sweet corn in ghee until tender.', 'Add washed rice and water; cook covered until rice absorbs moisture.', 'Fluff gently and serve with dahi.']
  },
  { name: 'Sprouted Moong & Coconut Rice', localName: 'स्प्राउट्स कोकोनट राइस / முளைகட்டிய பயறு சாதம்', icon: '🥥',
    ing: ['Steamed sprouted green moong', 'Freshly grated coconut', 'Cooked rice', 'Mustard seeds and curry leaves', 'Coconut oil or ghee'],
    steps: ['Temper mustard seeds and curry leaves in coconut oil.', 'Toss in sprouted moong and grated coconut.', 'Gently fold into warm cooked rice.', 'Serve warm.']
  },
  { name: 'Bhindi (Okra) Masala with Phulkas', localName: 'भिंडी मसाला / வெண்டைக்காய் வதக்கல்', icon: '🫓',
    ing: ['Tender ladyfingers (bhindi) chopped dry', 'Onions and cumin powder', 'Amchur (dry mango) and turmeric', 'Whole wheat phulkas'],
    steps: ['Sauté bhindi on medium heat until no longer sticky.', 'Add onions, cumin, and mild mango powder for gentle tang.', 'Cook covered until tender.', 'Serve with soft ghee-brushed phulkas.']
  },
  { name: 'Sweet Pumpkin & Chana Dal Stew', localName: 'कद्दू चना दाल / பூசணி பருப்பு கூட்டு', icon: '🍲',
    ing: ['Yellow pumpkin (kaddu) cubes', 'Soaked chana dal', 'Coconut paste and cumin', 'Ghee'],
    steps: ['Pressure cook pumpkin and chana dal together.', 'Mash lightly and stir in fresh coconut paste.', 'Simmer for 3 minutes and temper with mustard.', 'Serve with steamed rice.']
  },
  { name: 'Lemon Rice with Roasted Peanuts & Carrot Sticks', localName: 'लेमन राइस / எலுமிச்சை சாதம்', icon: '🍋',
    ing: ['Steamed rice', 'Fresh lemon juice', 'Roasted crunchy peanuts', 'Mustard seeds, turmeric, and curry leaves', 'Ghee'],
    steps: ['Temper mustard, peanuts, and turmeric in ghee.', 'Stir in fresh lemon juice and salt.', 'Toss with cool steamed rice until evenly golden.', 'Serve with fresh crunchy carrot sticks.']
  },
  { name: 'Methi Matar Malai (Mild) with Multigrain Roti', localName: 'मेथी मटर मलाई / வெந்தயக்கீரை பட்டாணி கிரேவி', icon: '🫓',
    ing: ['Fresh fenugreek leaves (methi)', 'Sweet green peas', 'Cashew-milk paste', 'Mild spices and ghee', 'Multigrain rotis'],
    steps: ['Blanch methi leaves to remove bitterness.', 'Cook with sweet green peas and creamy cashew-milk gravy.', 'Simmer until thick and aromatic.', 'Serve with multigrain rotis.']
  },
  { name: 'Egg or Tofu Curry with Steamed Rice', localName: 'अंडा कढ़ी / முட்டை குழம்பு', icon: '🍛',
    ing: ['Hard boiled eggs or firm tofu cubes', 'Tomato-onion mild gravy', 'Turmeric, coriander, and cumin', 'Steamed rice', 'Ghee'],
    steps: ['Lightly pan-sear boiled eggs or tofu in ghee with a pinch of turmeric.', 'Simmer gently in aromatic tomato gravy for 10 minutes.', 'Serve ladled over hot steamed rice.']
  },
  { name: 'Cabbage & Moong Dal Poriyal with Rice', localName: 'पत्तागोभी मूंग दाल / முட்டைக்கோஸ் பொரியல்', icon: '🥬',
    ing: ['Finely shredded cabbage', 'Soaked yellow moong dal', 'Grated fresh coconut', 'Mustard seeds and curry leaves', 'Ghee'],
    steps: ['Sauté mustard seeds in ghee, then add cabbage and moong dal.', 'Sprinkle water, cover, and steam for 6 minutes until tender-crisp.', 'Finish with grated fresh coconut.', 'Serve with rice and rasam.']
  },
  { name: 'Baingan Bharta (Smoked Eggplant) with Phulka', localName: 'बैंगन भर्ता / கத்தரிக்காய் மசியல்', icon: '🍆',
    ing: ['Roasted peeled eggplant mash', 'Tomatoes, green peas, and cumin', 'Coriander', 'Whole wheat phulkas', 'Mustard oil or ghee'],
    steps: ['Roast eggplant on open flame until skin chars; peel and mash.', 'Sauté with tomatoes, cumin, and peas.', 'Cook until aromatic and thick.', 'Serve with warm phulkas.']
  },
  { name: 'Mixed Sprout Khichdi with Desi Ghee', localName: 'मिक्स स्प्राउट्स खिचड़ी / முளைகட்டிய தானிய கிச்சடி', icon: '🍲',
    ing: ['Sprouted moong, moth, and chana', 'Brown rice or millets', 'Cumin, ginger, and turmeric', 'Pure desi ghee'],
    steps: ['Sauté cumin and ginger in ghee.', 'Add mixed sprouts, washed rice, and water.', 'Pressure cook until grains and sprouts are soft.', 'Serve hot with fresh raita.']
  },
  { name: 'Paneer Butter Masala (Mild Toddler/Kid Friendly)', localName: 'पनीर बटर मसाला / பன்னீர் பட்டர் மசாலா', icon: '🍛',
    ing: ['Fresh soft paneer cubes', 'Ripe tomato-melon seed puree', 'Butter and pure ghee', 'Mild spices and cream', 'Phulkas'],
    steps: ['Simmer smooth tomato puree in butter with mild spices.', 'Add a splash of cream and soft paneer cubes.', 'Simmer on low for 3 minutes.', 'Serve with soft phulkas.']
  },
  { name: 'Drumstick & Lentil Stew (Murungakkai Kootu)', localName: 'सहजन दाल / முருங்கைக்காய் கூட்டு', icon: '🍲',
    ing: ['Tender drumstick pulp or pieces', 'Yellow moong dal', 'Coconut-cumin paste', 'Ghee tempering'],
    steps: ['Cook drumsticks and moong dal until tender.', 'Stir in ground coconut-cumin paste and simmer for 4 minutes.', 'Temper with mustard seeds and curry leaves.', 'Serve with warm rice.']
  },
  { name: 'Soya Chunks & Potato Mild Curry with Rice', localName: 'सोयाबीन आलू करी / சோயா குழம்பு', icon: '🍛',
    ing: ['Soft boiled soya chunks', 'Diced potatoes', 'Tomato-cumin gravy', 'Steamed rice', 'Ghee'],
    steps: ['Squeeze excess water from boiled soya chunks.', 'Simmer with potatoes in tomato gravy until flavors penetrate.', 'Serve hot over steamed rice.']
  },
  { name: 'Kashmiri Dum Aloo (Mild Yogurt Gravy) with Rice', localName: 'कश्मीरी दम आलू / உருளைக்கிழங்கு கிரேவி', icon: '🥔',
    ing: ['Baby potatoes fork-pricked', 'Whisked fresh curd (dahi)', 'Fennel seed powder and ginger powder', 'Steamed rice', 'Ghee'],
    steps: ['Pan-roast baby potatoes until golden.', 'Whisk curd with fennel and ginger powder.', 'Simmer potatoes in curd gravy on low flame until thick.', 'Serve warm with rice.']
  }
];

function adaptLunch(bases, stage) {
  return bases.map((b) => {
    let name = b.name;
    let benefits = 'Complete balanced meal providing high vegetarian proteins, complex carbs, and essential micronutrients.';
    let safety = 'Ensure all beans, lentils, and potatoes are cooked until completely soft. Test heat level before serving.';

    if (stage.id.includes('months')) {
      name = `Mashed Baby ${b.name.replace('Chole', 'Moong Dal').replace('Rajma', 'Lentil Puree')}`;
      benefits = 'Gentle on developing intestines, high iron and digestible protein for baby growth.';
      safety = 'Ensure completely lump-free or soft-mashed. No whole nuts or hard seeds.';
    } else if (stage.id.includes('15_18') || stage.id.includes('10_15')) {
      name = `Athlete Power ${b.name}`;
      benefits = 'Dense plant and dairy protein for rapid muscle synthesis, athletic recovery, and brain focus.';
      safety = 'High-protein wholesome meal to fuel growth spurts and sports.';
    }

    return {
      name,
      localName: b.localName,
      prepTime: '12 mins',
      cookTime: '20 mins',
      icon: b.icon,
      ingredients: b.ing,
      instructions: b.steps,
      benefits,
      safety
    };
  });
}

// Dinner Comfort Meals (Light soups, Daliya, Khichdi, Phulka with Lauki, Wraps, Momos, Stews)
const indianDinnerBases = [
  { name: 'Comforting Moong Dal & Veggie Khichdi', localName: 'हल्की मूंग खिचड़ी / எளிய கிச்சடி', icon: '🍲',
    ing: ['Yellow moong dal', 'Rice', 'Diced bottle gourd and carrots', 'Cumin seeds and ghee'],
    steps: ['Pressure cook dal and rice with double water until very soft.', 'Temper with cumin in pure ghee.', 'Serve warm with fresh dahi.']
  },
  { name: 'Warm Creamy Tomato & Carrot Shorba (Soup)', localName: 'टमाटर गाजर शोरबा / தக்காளி கேரட் சூப்', icon: '🥣',
    ing: ['Ripe red tomatoes', 'Sweet carrots', 'Cumin, ginger, and butter', 'Toasted whole wheat croutons'],
    steps: ['Boil tomatoes and carrots with ginger until tender.', 'Blend into a silky soup and strain.', 'Simmer with cumin and a touch of butter.', 'Serve warm with soft bread sticks.']
  },
  { name: 'Soft Jowar Bhakri with Dal Tadka', localName: 'ज्वार भाकरी दाल / சோள ரொட்டி பருப்பு', icon: '🫓',
    ing: ['Jowar (sorghum) flour', 'Warm water for kneading', 'Yellow moong dal', 'Ghee'],
    steps: ['Knead jowar flour with warm water into soft dough.', 'Pat into flat round bread and roast on tawa.', 'Serve with mild yellow dal tadka and ghee.']
  },
  { name: 'Vegetable Daliya (Broken Wheat) Porridge', localName: 'नमकीन दलिया / கோதுமை ரவை கஞ்சி', icon: '🥣',
    ing: ['Broken wheat', 'Diced zucchini, carrots, and peas', 'Cumin and turmeric', 'Ghee'],
    steps: ['Sauté cumin and veggies in ghee.', 'Add daliya and 3 cups of water.', 'Cook until grains are tender and porridge-like.', 'Serve warm.']
  },
  { name: 'Paneer Bhurji Stuffed Phulka Roll', localName: 'पनीर रोल / பன்னீர் ரோல்', icon: '🌯',
    ing: ['Fresh scrambled paneer', 'Mild tomatoes and cumin', 'Soft whole wheat phulka', 'Ghee'],
    steps: ['Scramble paneer with tomatoes and mild spices.', 'Lay across warm phulka.', 'Roll tightly and slice in half.', 'Serve with mint yogurt.']
  },
  { name: 'Yellow Pumpkin & Coconut Stew with Rice', localName: 'कद्दू नारियल स्टू / பூசணி தேங்காய் பால் ஸ்டூ', icon: '🍲',
    ing: ['Yellow pumpkin cubes', 'Fresh coconut milk', 'Curry leaves and cumin', 'Steamed rice'],
    steps: ['Simmer pumpkin cubes in light coconut milk until melting soft.', 'Add thick coconut milk and turn off heat.', 'Temper with curry leaves.', 'Serve with steamed rice.']
  },
  { name: 'Soft Missi Roti with Mint Curd Dip', localName: 'मिस्सी रोटी / கடலை மாவு சப்பாத்தி', icon: '🫓',
    ing: ['Whole wheat flour and besan', 'Ajwain and kasoori methi', 'Warm water', 'Ghee'],
    steps: ['Knead flours with ajwain and methi into pliable dough.', 'Roll out and roast on hot tawa until spotted with brown.', 'Brush with ghee and serve with curd.']
  },
  { name: 'Bottle Gourd (Lauki) & Moong Stew with Phulka', localName: 'घिया मूंग दाल / சுரைக்காய் பாசிப்பருப்பு', icon: '🍲',
    ing: ['Tender lauki cubes', 'Yellow moong dal', 'Cumin and coriander', 'Phulkas'],
    steps: ['Pressure cook lauki and moong dal together.', 'Temper with cumin and ghee.', 'Serve with soft phulkas.']
  },
  { name: 'Steamed Vegetable Momos with Clear Broth', localName: 'वेज मोमोज सूप / காய்கறி மோமோஸ்', icon: '🥟',
    ing: ['Whole wheat wrapper dough', 'Finely minced cabbage, carrot, and paneer', 'Ginger-garlic clear broth'],
    steps: ['Fill thin wheat circles with minced veggie mix and pleat.', 'Steam for 10 minutes until glossy.', 'Serve with warm soothing clear broth.']
  },
  { name: 'Sweet Potato & Lentil Puree Bowl', localName: 'शकरकंद दाल सूप / சர்க்கரைவள்ளிக்கிழங்கு பருப்பு', icon: '🍠',
    ing: ['Sweet potato cubes', 'Red masoor dal', 'Turmeric and cumin', 'Ghee'],
    steps: ['Boil sweet potato and masoor dal until tender.', 'Puree into a smooth, comforting soup.', 'Top with ghee and serve warm.']
  },
  { name: 'Soft Idli Crumbled in Warm Rasam', localName: 'इडली रसम / இட்லி ரசம்', icon: '⚪',
    ing: ['Steamed soft idlis', 'Warm tomato-cumin rasam', 'Pure desi ghee'],
    steps: ['Crumble fresh steamed idlis in a shallow bowl.', 'Ladle piping hot mild rasam over the idlis to absorb.', 'Drizzle with ghee and serve.']
  },
  { name: 'Spinach & Sweet Corn Rice Casserole', localName: 'पालक कॉर्न पुलाव / பாலக் சோளம் சாதம்', icon: '🥬',
    ing: ['Pureed baby spinach', 'Sweet corn kernels', 'Basmati rice', 'Ghee and cumin'],
    steps: ['Sauté cumin and sweet corn in ghee.', 'Add pureed spinach, washed rice, and water.', 'Cook covered until rice is tender and vibrant green.', 'Serve with dahi.']
  },
  { name: 'Moth Beans (Matki) Khichdi with Dahi', localName: 'मटकी खिचड़ी / பயறு கிச்சடி', icon: '🍲',
    ing: ['Soaked moth beans', 'Rice', 'Turmeric and cumin', 'Ghee'],
    steps: ['Cook moth beans and rice together until very soft.', 'Temper with cumin seeds in ghee.', 'Serve warm with fresh dahi.']
  },
  { name: 'Clear Vegetable & Noodle Stew', localName: 'वेजिटेबल सूप नूडल्स / காய்கறி சூப் நூடுல்ஸ்', icon: '🍜',
    ing: ['Whole wheat noodles', 'Shredded carrots, cabbage, and peas', 'Mild ginger-vegetable broth'],
    steps: ['Simmer veggies in seasoned broth.', 'Add whole wheat noodles and cook for 5 minutes.', 'Serve warm in deep bowls.']
  },
  { name: 'Ridge Gourd (Turai) Curry with Soft Roti', localName: 'तुरई की सब्जी / பீர்க்கங்காய் கூட்டு', icon: '🥒',
    ing: ['Peeled diced turai', 'Cumin, turmeric, and tomato', 'Phulkas'],
    steps: ['Sauté cumin and tomatoes in ghee.', 'Add turai cubes; cook covered without water as it releases natural juices.', 'Simmer until tender.', 'Serve with soft rotis.']
  },
  { name: 'Bajra (Pearl Millet) & Moong Khichdi', localName: 'बाजरा खिचड़ी / கம்பு கிச்சடி', icon: '🍲',
    ing: ['Coarsely crushed bajra', 'Yellow moong dal', 'Desi ghee and cumin'],
    steps: ['Pressure cook bajra and moong dal with 4 cups of water for 5 whistles.', 'Mash well and temper with cumin in hot ghee.', 'Serve warm with fresh buttermilk.']
  },
  { name: 'Tinda (Apple Gourd) Mild Curry with Phulka', localName: 'टिंडा सब्जी / கோவக்காய் வகை', icon: '🍲',
    ing: ['Peeled tender tinda cubes', 'Cumin and mild spices', 'Ghee and phulkas'],
    steps: ['Sauté cumin in ghee, add diced tinda and mild spices.', 'Cook covered on low heat until fork tender.', 'Serve with hot phulkas.']
  },
  { name: 'Beetroot & Paneer Soft Tikki Roll', localName: 'चुकंदर पनीर रोल / பீட்ரூட் பன்னீர் ரோல்', icon: '🌯',
    ing: ['Mashed beetroot and paneer', 'Whole wheat wrap', 'Mint yogurt spread'],
    steps: ['Pan-sear beetroot-paneer patties on tawa.', 'Wrap inside warm roti with a smear of mint yogurt.', 'Serve warm.']
  },
  { name: 'Moong Dal & Oats Porridge', localName: 'मूंग दाल ओट्स दलिया / பாசிப்பருப்பு ஓட்ஸ் கஞ்சி', icon: '🥣',
    ing: ['Yellow moong dal', 'Rolled oats', 'Cumin and turmeric', 'Ghee'],
    steps: ['Boil dal until soft, then stir in oats and water.', 'Simmer for 4 minutes until thick and creamy.', 'Temper with cumin and ghee; serve warm.']
  },
  { name: 'Stir-Fried Tofu or Paneer with Steamed Veggies', localName: 'टोफू वेजी स्टिर फ्राई / பன்னீர் காய்கறி வதக்கல்', icon: '🥗',
    ing: ['Paneer or tofu cubes', 'Steamed carrots, beans, and peas', 'Mild soy and cumin', 'Ghee'],
    steps: ['Pan-sear paneer cubes until light golden.', 'Toss in tender steamed vegetables with mild seasonings.', 'Serve warm.']
  },
  { name: 'Makhana (Foxnut) & Vegetable Soup', localName: 'मखाना वेज सूप / தாமரை விதை சூப்', icon: '🥣',
    ing: ['Roasted puffed makhana', 'Carrot-pumpkin puree', 'Cumin and mild pepper', 'Ghee'],
    steps: ['Simmer vegetable puree with water and spices.', 'Drop in roasted makhana to soften slightly.', 'Serve hot and comforting.']
  },
  { name: 'Kuttu (Buckwheat) or Singhara Soft Cheela', localName: 'कुट्टू चीला / பக்வீட் அடை', icon: '🫓',
    ing: ['Buckwheat flour', 'Grated boiled potato', 'Cumin and rock salt', 'Ghee'],
    steps: ['Mix buckwheat flour, grated potato, and water into batter.', 'Cook on tawa with ghee on both sides until soft-crisp.', 'Serve with dahi.']
  },
  { name: 'Carrot & Lentil Mash with Ghee Rice', localName: 'गाजर दाल चावल / கேரட் பருப்பு சாதம்', icon: '🥕',
    ing: ['Mashed carrots', 'Red lentils (masoor)', 'Steamed rice', 'Desi ghee'],
    steps: ['Cook carrots and lentils until soft.', 'Mash thoroughly with warm rice and melted ghee.', 'Serve lukewarm.']
  },
  { name: 'Sprouted Methi & Moong Soft Paratha', localName: 'मेथी पराठा / வெந்தய சப்பாத்தி', icon: '🫓',
    ing: ['Fresh tender methi leaves', 'Moong dal powder', 'Whole wheat atta', 'Ghee'],
    steps: ['Knead methi and moong into atta.', 'Roll out and cook on hot tawa.', 'Serve with warm dal.']
  },
  { name: 'Stewed Appam with Mild Veggie Coconut Stew', localName: 'अप्पम वेज स्टू / ஆப்பம் காய்கறி ஸ்டூ', icon: '🥞',
    ing: ['Fermented rice appams', 'Carrots, beans, and potato stew in coconut milk', 'Cardamom and curry leaves'],
    steps: ['Simmer veggies in coconut milk with mild whole spices.', 'Pour rich stew over soft spongy appams.', 'Serve warm.']
  },
  { name: 'Suji & Vegetable Soft Upma', localName: 'रवा उपमा / ரவா உப்புமா', icon: '🍲',
    ing: ['Semolina (rava)', 'Finely diced carrots and peas', 'Mustard seeds and ghee'],
    steps: ['Roast rava in ghee until fragrant.', 'Sauté veggies in tempered water and boil.', 'Whisk in rava and cook covered for 3 minutes.', 'Serve warm.']
  },
  { name: 'Zucchini & Lentil Clear Stew', localName: 'तोरई दाल सूप / சீமை சுரைக்காய் பருப்பு', icon: '🥒',
    ing: ['Zucchini cubes', 'Yellow moong dal', 'Cumin and lemon juice', 'Ghee'],
    steps: ['Boil zucchini and dal together until soft.', 'Puree partially to leave soft texture.', 'Temper with cumin and finish with lemon.', 'Serve warm.']
  },
  { name: 'Soft Poha with Steamed Carrots & Curd', localName: 'दही पोहा / தயிர் அவல்', icon: '🥣',
    ing: ['Soft soaked poha', 'Grated steamed carrot', 'Fresh curd', 'Pinch of roasted cumin'],
    steps: ['Mix soft poha with whisked curd and steamed carrot.', 'Top with roasted cumin.', 'Serve cool and soothing for light dinner.']
  },
  { name: 'Boiled Egg or Paneer Bhurji with Paratha', localName: 'अंडा पनीर भुर्जी / முட்டை பன்னீர்', icon: '🍳',
    ing: ['Eggs or paneer scrambled', 'Tomatoes and cumin', 'Soft whole wheat paratha'],
    steps: ['Scramble eggs or paneer in ghee with tomatoes.', 'Serve alongside soft warm parathas.']
  },
  { name: 'Cumin Flavored Warm Buttermilk Rice (Kadhi Sadam)', localName: 'कढ़ी चावल / மோர் குழம்பு சாதம்', icon: '🥣',
    ing: ['Soft steamed rice', 'Tempered buttermilk (chaach)', 'Cumin and ginger'],
    steps: ['Pour warm tempered buttermilk over soft rice.', 'Stir well and serve as a light, sleep-friendly dinner.']
  }
];

function adaptDinner(bases, stage) {
  return bases.map((b) => {
    let name = b.name;
    let benefits = 'Light on digestive tract, promotes restful nighttime sleep and steady recovery.';
    let safety = 'Ensure meal is finished at least 1-2 hours before bedtime for sound digestion.';

    if (stage.id.includes('months')) {
      name = `Gentle Evening Baby ${b.name.replace('Roll', 'Puree').replace('Bhakri', 'Spoon')}`;
      benefits = 'Comforts baby tummy before night sleep, easy to digest with zero acidity.';
      safety = 'Feed 30 minutes before sleep routine. Ensure temperature is lukewarm.';
    } else if (stage.id.includes('15_18') || stage.id.includes('10_15')) {
      name = `Restorative Evening ${b.name}`;
      benefits = 'Lean protein, tryptophan, and complex carbs assist deep REM sleep and overnight muscle repair.';
      safety = 'Hydrate well with dinner broth to recover electrolytes lost during daytime exercise.';
    }

    return {
      name,
      localName: b.localName,
      prepTime: '10 mins',
      cookTime: '15 mins',
      icon: b.icon,
      ingredients: b.ing,
      instructions: b.steps,
      benefits,
      safety
    };
  });
}

// Snacks, Healthy Treats & Wholesome Desserts (Makhana, Ladoos, Cutlets, Halwas, Bhel, Fruit Chaat)
const indianSnackBases = [
  { name: 'Roasted Turmeric & Ghee Makhana (Foxnuts)', localName: 'भुना मखाना / வறுத்த தாமரை விதை', icon: '🍿',
    ing: ['Puffed makhana (foxnuts)', 'Desi ghee', 'Pinch of turmeric and rock salt'],
    steps: ['Heat ghee in a pan on medium-low flame.', 'Add makhana and roast until crispy and crackling (5-7 mins).', 'Toss with turmeric and a tiny pinch of salt.', 'Cool and store in airtight jar.']
  },
  { name: 'Besan & Jaggery Toddler Energy Ladoo', localName: 'बेसन गुड़ लड्डू / கடலை மாவு லட்டு', icon: '🧆',
    ing: ['Besan (gram flour)', 'Pure desi ghee', 'Organic jaggery powder', 'Cardamom powder'],
    steps: ['Roast besan in ghee on low heat until nutty and golden.', 'Turn off heat and let cool until warm.', 'Stir in jaggery powder and cardamom.', 'Shape into bite-sized balls.']
  },
  { name: 'Crispy Sweet Potato & Oats Tawa Cutlets', localName: 'शकरकंद कटलेट / சர்க்கரைவள்ளிக்கிழங்கு கட்லெட்', icon: '🍠',
    ing: ['Boiled mashed sweet potato', 'Roasted oats powder', 'Pinch of cumin and chaat masala', 'Ghee for pan'],
    steps: ['Mix mashed sweet potato with oats powder and mild spices.', 'Shape into round coin cutlets.', 'Shallow pan-sear in ghee until golden-crisp on both sides.', 'Serve with mint dip.']
  },
  { name: 'Ragi & Dates Sugar-Free Ladoo', localName: 'रागी खजूर लड्डू / ராகி பேரீச்சம்பழ லட்டு', icon: '🟤',
    ing: ['Roasted sprouted ragi flour', 'Soft pitted Medjool dates (paste)', 'Ghee', 'Cardamom powder'],
    steps: ['Roast ragi flour in ghee until aromatic.', 'Blend dates into a sticky smooth paste.', 'Combine warm ragi and date paste, kneading into firm dough.', 'Roll into marble-sized nutrient spheres.']
  },
  { name: 'Sweet Corn & Lemon Chaat', localName: 'स्वीट कॉर्न चाट / சோள சாட்', icon: '🌽',
    ing: ['Steamed tender sweet corn kernels', 'Drops of fresh lemon juice', 'Pinch of roasted cumin and butter'],
    steps: ['Steam sweet corn until juicy and hot.', 'Toss in a bowl with butter, lemon juice, and cumin.', 'Serve warm in snack cups.']
  },
  { name: 'Steamed Dhokla Squares with Mustard Tempering', localName: 'खमन ढोकला / டோக்ளா', icon: '🟡',
    ing: ['Besan (gram flour)', 'Curd and lemon juice', 'Mustard seeds and curry leaves', 'Ghee'],
    steps: ['Whisk besan and curd into smooth batter.', 'Steam in greased tin for 15 minutes until spongy.', 'Temper with mustard seeds and curry leaves.', 'Cut into soft squares.']
  },
  { name: 'Carrot Halwa (Gajar Ka Halwa in Milk)', localName: 'गाजर का हलवा / கேரட் அல்வா', icon: '🥕',
    ing: ['Grated sweet red carrots', 'Full cream milk', 'Jaggery or raw sugar', 'Cardamom and ghee'],
    steps: ['Simmer grated carrots in milk on medium flame until milk reduces completely.', 'Add ghee and roast until glossy.', 'Stir in jaggery and cardamom.', 'Serve warm.']
  },
  { name: 'Sprouted Moong Bhel with Lemon & Puffed Rice', localName: 'मूंग स्प्राउट्स भेल / முளைகட்டிய பயறு பேல்', icon: '🥗',
    ing: ['Steamed sprouted moong', 'Crispy puffed rice (kurmura)', 'Diced boiled potato and cucumber', 'Lemon juice and green chutney'],
    steps: ['Toss puffed rice and sprouted moong together.', 'Add potatoes, cucumber, and lemon juice.', 'Drizzle mild green mint chutney and serve immediately.']
  },
  { name: 'Beetroot & Vegetable Heart Cutlets', localName: 'चुकंदर कटलेट / பீட்ரூட் கட்லெட்', icon: '🟣',
    ing: ['Boiled mashed beetroot and potato', 'Powdered poha for binding', 'Cumin and chaat masala', 'Ghee'],
    steps: ['Combine beetroot and potato mash with poha powder.', 'Shape with heart cookie-cutters.', 'Pan-sear in ghee until crispy outside.', 'Serve with dahi dip.']
  },
  { name: 'Whole Wheat Atta & Gond (Edible Gum) Ladoo', localName: 'आटा गोंद लड्डू / கோதுமை லட்டு', icon: '🧆',
    ing: ['Whole wheat flour', 'Fried edible gond crystals', 'Desi ghee', 'Jaggery powder and dry fruits'],
    steps: ['Fry gond in ghee until puffed like popcorn; crush into powder.', 'Roast atta in ghee until golden brown.', 'Mix warm atta, gond, and jaggery.', 'Roll into nutritious energy balls.']
  },
  { name: 'Steamed Handvo (Gujarati Lentil Cake)', localName: 'हांडवो / பருப்பு அடை கேக்', icon: '🥧',
    ing: ['Mixed lentil-rice batter', 'Grated bottle gourd (lauki)', 'Sesame seeds and mustard seeds', 'Ghee'],
    steps: ['Mix grated lauki into fermented lentil batter.', 'Pour into pan, top with sesame and mustard seeds.', 'Cover and cook on low heat until crust is golden and toothpick comes clean.', 'Slice and serve.']
  },
  { name: 'Banana & Dates Creamy Smoothie', localName: 'केला खजूर स्मूदी / வாழைப்பழம் ஸ்மூதி', icon: '🍌',
    ing: ['1 Ripe banana', '2 Soaked pitted dates', '1 cup Cold milk or curd', 'Pinch of cinnamon'],
    steps: ['Blend banana, soaked dates, and milk in blender until frothy and smooth.', 'Sprinkle cinnamon on top.', 'Serve chilled in a tall cup.']
  },
  { name: 'Moong Dal Halwa with Desi Ghee', localName: 'मूंग दाल हलवा / பாசிப்பருப்பு அல்வா', icon: '🍯',
    ing: ['Coarsely ground soaked moong dal', 'Desi ghee', 'Milk and jaggery', 'Cardamom powder'],
    steps: ['Roast moong dal paste in ghee until golden and aromatic (15 mins).', 'Add warm milk and simmer until absorbed.', 'Stir in jaggery and cardamom until halwa leaves pan sides.', 'Serve warm.']
  },
  { name: 'Boiled Peanut Chaat with Cucumber & Tomato', localName: 'मूंगफली चाट / வேர்க்கடலை சாட்', icon: '🥜',
    ing: ['Boiled soft peanuts', 'Finely diced cucumber and tomato', 'Lemon juice and chaat masala'],
    steps: ['Boil raw peanuts with salt until tender.', 'Toss with diced fresh vegetables and lemon juice.', 'Serve fresh in snack cones.']
  },
  { name: 'Crispy Baked Whole Wheat Mathri', localName: 'बेक्ड मठरी / கோதுமை தட்டை', icon: '🍘',
    ing: ['Whole wheat flour', 'Ajwain and kasoori methi', 'Desi ghee for shortening', 'Warm water'],
    steps: ['Knead stiff dough, roll into small thick rounds, prick with fork.', 'Bake at 180°C for 18-20 minutes until crisp and golden.', 'Cool and store.']
  },
  { name: 'Steamed Sweet Rice Modak (Ukadiche Modak)', localName: 'उकडीचे मोदक / கொழுக்கட்டை', icon: '🥟',
    ing: ['Steamed rice flour dough', 'Grated coconut and jaggery filling', 'Cardamom and nutmeg', 'Ghee'],
    steps: ['Cook coconut and jaggery together with cardamom until sticky.', 'Shape rice dough into cups, stuff with sweet coconut, and pleat.', 'Steam for 10 minutes until shiny.', 'Drizzle with ghee and serve.']
  },
  { name: 'Paneer Tikka Bite Cubes on Skewers', localName: 'पनीर टिक्का बाइट्स / பன்னீர் டிக்கா', icon: '🍢',
    ing: ['Firm paneer cubes', 'Curd, turmeric, and cumin marinade', 'Bell pepper and onion cubes', 'Ghee'],
    steps: ['Marinate paneer and veggies in spiced thick curd for 20 minutes.', 'Thread onto child-safe wooden sticks.', 'Pan-sear in ghee until charred spots appear.', 'Serve warm with mint dahi.']
  },
  { name: 'Almond & Date Power Bar Bites', localName: 'बादाम खजूर बार / பாதாம் பேரீச்சம்பழம் உருண்டை', icon: '🍫',
    ing: ['Crushed roasted almonds', 'Pitted soft dates', 'Chia seeds', 'Cocoa powder (optional)'],
    steps: ['Pulse almonds and dates in food processor into a thick paste.', 'Press firmly into a baking tray and chill for 30 minutes.', 'Slice into energy squares.']
  },
  { name: 'Steamed Sweet Corn & Paneer Momos', localName: 'पनीर कॉर्न मोमोज / பன்னீர் மோமோஸ்', icon: '🥟',
    ing: ['Whole wheat flour dough', 'Crumbled paneer and sweet corn', 'Ginger and mild herbs'],
    steps: ['Roll thin dough discs and fill with paneer-corn mixture.', 'Pleat into little pouches.', 'Steam for 10 minutes.', 'Serve with mild tomato dip.']
  },
  { name: 'Roasted Chana (Chickpea) & Jaggery Crunch', localName: 'चना गुड़ / கடலை வெல்லம்', icon: '🧆',
    ing: ['Roasted unsalted yellow chana', 'Crushed organic jaggery'],
    steps: ['Combine equal parts roasted chana and jaggery.', 'Enjoy as traditional iron-rich snacking crunch.']
  },
  { name: 'Apple & Cinnamon Kheer (Payasam)', localName: 'सेब की खीर / ஆப்பிள் பாயாசம்', icon: '🍎',
    ing: ['Grated sweet apple', 'Full cream milk', 'Cardamom powder', 'Chopped pistachios'],
    steps: ['Sauté grated apple in a teaspoon of ghee for 3 minutes.', 'Boil milk until reduced by half; cool slightly.', 'Stir in sautéed apple and cardamom.', 'Serve chilled or lukewarm.']
  },
  { name: 'Sprouted Chana & Pomegranate Chaat', localName: 'चना अनार चाट / கொண்டைக்கடலை சாட்', icon: '🥗',
    ing: ['Boiled sprouted black chana', 'Fresh pomegranate seeds', 'Mint leaves and chaat masala', 'Lemon juice'],
    steps: ['Mix soft boiled chana with sweet ruby pomegranate seeds.', 'Toss with lemon juice and chaat masala.', 'Serve fresh.']
  },
  { name: 'Cucumber & Carrot Sticks with Creamy Curd Dip', localName: 'खीरा गाजर डिप / வெள்ளரி கேரட் துண்டுகள்', icon: '🥕',
    ing: ['Fresh chilled cucumber batons', 'Sweet carrot sticks', 'Thick hung curd mixed with roasted cumin and mint'],
    steps: ['Slice vegetables into sturdy dip sticks.', 'Whisk hung curd with cumin and mint.', 'Serve for interactive finger snacking.']
  },
  { name: 'Roasted Makhana & Saffron Kheer', localName: 'मखाना खीर / தாமரை விதை பாயாசம்', icon: '🥣',
    ing: ['Roasted crushed makhana', 'Milk', 'Saffron strands and cardamom', 'Jaggery or raw sugar'],
    steps: ['Simmer crushed makhana in milk until thick and creamy (10 mins).', 'Infuse with saffron and cardamom.', 'Sweeten with jaggery and serve warm.']
  },
  { name: 'Dry Fruit & Coconut Burfi (Sugar-Free)', localName: 'ड्राई फ्रूट बर्फी / உலர் பழ பர்பி', icon: '🥥',
    ing: ['Grated fresh coconut', 'Finely chopped cashews, almonds, and dates', 'Desi ghee', 'Cardamom'],
    steps: ['Roast coconut and dry fruits in ghee.', 'Add pureed date paste and cook until mixture gathers into a mass.', 'Press into a greased tray, set, and cut into diamonds.']
  },
  { name: 'Steamed Sweet Corn Kernels in Banana Leaf', localName: 'इलायची कॉर्न / சோள இனிப்பு', icon: '🌽',
    ing: ['Mashed sweet corn', 'Cardamom and jaggery', 'Rice flour', 'Ghee'],
    steps: ['Wrap corn mixture in banana leaf packets.', 'Steam for 12 minutes.', 'Unwrap fragrant sweet parcels and enjoy warm.']
  },
  { name: 'Chiroti / Flaky Sweet Whole Wheat Crisps', localName: 'चिरोटी / கோதுமை பிஸ்கட்', icon: '🍘',
    ing: ['Whole wheat flour and semolina', 'Ghee', 'Powdered jaggery and cardamom'],
    steps: ['Knead flour with ghee, roll out layered thin pastry.', 'Bake until golden and sprinkle with cardamom jaggery dust.']
  },
  { name: 'Fresh Fruit Chaat with Chaat Masala & Mint', localName: 'फ्रूट चाट / பழ சாட்', icon: '🍎',
    ing: ['Diced apples, bananas, papaya, and grapes', 'Pinch of chaat masala', 'Fresh lemon juice', 'Mint leaves'],
    steps: ['Chop fresh seasonal fruits into bite-sized pieces.', 'Toss with lemon juice and mild chaat masala.', 'Serve immediately.']
  },
  { name: 'Sesame & Jaggery (Til Ladoo) Energy Bites', localName: 'तिल गुड़ लड्डू / எள்ளு உருண்டை', icon: '⚪',
    ing: ['Roasted white sesame seeds (til)', 'Warm jaggery syrup', 'Cardamom'],
    steps: ['Roast sesame seeds until fragrant.', 'Pour into melted jaggery syrup and stir briskly.', 'Roll while warm into calcium-dense energy balls.']
  },
  { name: 'Mango Shrikhand with Pistachio Flakes', localName: 'मैंगो श्रीखंड / மாம்பழ ஸ்ரீகண்ட்', icon: '🥭',
    ing: ['Thick hung curd (chakka)', 'Ripe sweet mango pulp', 'Cardamom and crushed pistachios'],
    steps: ['Whisk hung curd and mango pulp together until silky smooth.', 'Chill in refrigerator for 30 minutes.', 'Garnish with pistachios and serve.']
  }
];

function adaptSnacks(bases, stage) {
  return bases.map((b) => {
    let name = b.name;
    let benefits = 'Wholesome natural snacking without refined sugars or artificial additives; rich in essential minerals.';
    let safety = 'Ensure any seeds or nuts are crushed or powdered appropriately for age group.';

    if (stage.id.includes('months')) {
      name = `Soft Baby ${b.name.replace('Cutlets', 'Mash').replace('Ladoo', 'Purée')}`;
      benefits = 'Natural fruit and lentil nutrients; supports fine motor self-feeding.';
      safety = 'Ensure soft, gum-safe consistency. Always supervise infant feeding.';
    } else if (stage.id.includes('15_18') || stage.id.includes('10_15')) {
      name = `High-Energy ${b.name}`;
      benefits = 'Dense calories, healthy fats, and plant micronutrients curb fast-food cravings between classes and sports.';
      safety = 'Great portable snack for school bags, tuition breaks, and sports practice.';
    }

    return {
      name,
      localName: b.localName,
      prepTime: '8 mins',
      cookTime: '10 mins',
      icon: b.icon,
      ingredients: b.ing,
      instructions: b.steps,
      benefits,
      safety
    };
  });
}

// All 10 Stages Configuration
const stages = [
  {
    id: '0_6_months',
    filename: 'stage_0_6m.ts',
    ageLimit: '0 - 6 Months',
    title: 'Early Milk & Preparation Stage',
    guidelines: 'Exclusive breastfeeding or formula is medically recommended. No solids are needed yet, but watch for signs of swallowing readiness and neck stability toward month 5 or 6.',
    milestones: [
      'Can hold head up and maintain upright posture when supported.',
      'Shows intense curiosity in what parents are eating, leaning forward.',
      'Extrusion reflex (spitting out items with tongue) starts to decline.'
    ]
  },
  {
    id: '6_8_months',
    filename: 'stage_6_8m.ts',
    ageLimit: '6 - 8 Months',
    title: 'First Tastes & Smooth Purees',
    guidelines: 'Introduce iron-rich single-ingredient purees, soft mashed fruits, and watery dal ka paani. Maintain breastmilk or formula as the primary nutrition source.',
    milestones: [
      'Opens mouth willingly when spoon approaches.',
      'Can move puree from front to back of tongue to swallow.',
      'Shows interest in grasping silicone spoon or cup.'
    ]
  },
  {
    id: '8_10_months',
    filename: 'stage_8_10m.ts',
    ageLimit: '8 - 10 Months',
    title: 'Thick Mashes & Finger Foods',
    guidelines: 'Transition to thicker textures with soft lumps, soft vegetable sticks, mashed khichdi, and soft paneer bites. Practice open-cup water drinking.',
    milestones: [
      'Develops pincer grasp (picking small soft food items with thumb and forefinger).',
      'Can sit unassisted in high chair and bring food to mouth.',
      'Chews with gums in an up-and-down rotary motion.'
    ]
  },
  {
    id: '10_12_months',
    filename: 'stage_10_12m.ts',
    ageLimit: '10 - 12 Months',
    title: 'Self-Feeding & Mini Meals',
    guidelines: 'Provide 3 mini meals plus 1 healthy snack daily. Offer chopped family foods, mini idlis, soft cheelas, and soft fruits.',
    milestones: [
      'Attempts using child fork or spoon to feed self.',
      'Drinks water from an open cup with minimal assistance.',
      'Enjoys varied spices like cumin, coriander, and turmeric.'
    ]
  },
  {
    id: '12_24_months',
    filename: 'stage_1_2y.ts',
    ageLimit: '1 - 2 Years',
    title: 'Toddler Table & Family Foods',
    guidelines: 'Transition to 3 family-style meals and 2 nutritious snacks. Whole cow milk, rotis with ghee, dals, and soft fruits provide essential growth energy.',
    milestones: [
      'Eats the same meals as the family with mild seasoning.',
      'Comfortably chews soft table foods and finger foods.',
      'Demonstrates clear hunger and fullness signals.'
    ]
  },
  {
    id: '24_36_months',
    filename: 'stage_2_3y.ts',
    ageLimit: '2 - 3 Years',
    title: 'Independent Toddler Eater',
    guidelines: 'Toddlers develop strong food preferences. Offer colorful, balanced plates with a variety of textures, colorful cutlets, and wholesome laddoos.',
    milestones: [
      'Feeds self independently with minimal spilling.',
      'Can express specific food preferences and assist in washing veggies.',
      'Chews raw crunchy vegetables like grated carrots and cucumber slices.'
    ]
  },
  {
    id: '3_5_years',
    filename: 'stage_3_5y.ts',
    ageLimit: '3 - 5 Years',
    title: 'Preschool Active Explorer',
    guidelines: 'Preschoolers need balanced energy for active play, preschool learning, and strong immunity. Provide wholesome tiffins, high protein, and dairy.',
    milestones: [
      'Eats completely independently using regular child cutlery.',
      'Enjoys varied textures including soft parathas, dosas, and crunchy cutlets.',
      'Helps parents in safe kitchen activities like mixing dough and assembling rolls.'
    ]
  },
  {
    id: '5_10_years',
    filename: 'stage_5_10y.ts',
    ageLimit: '5 - 10 Years',
    title: 'School-Age Energy & Focus',
    guidelines: 'Pack wholesome lunchboxes with whole wheat parathas, vegetable pulao, sprout bhel, and protein-rich snacks like makhana and peanut chaat.',
    milestones: [
      'Sustains high concentration throughout morning school hours.',
      'Develops taste for regional Indian legumes, millets, and greens.',
      'Maintains consistent athletic stamina for sports and outdoor games.'
    ]
  },
  {
    id: '10_15_years',
    filename: 'stage_10_15y.ts',
    ageLimit: '10 - 15 Years',
    title: 'Pre-Teen Growth Spurt & Vitality',
    guidelines: 'Pre-teens require dense calcium, iron, and clean protein for rapid bone mineralization, muscle growth, and academic stamina.',
    milestones: [
      'Experiences accelerated physical growth spurt and height increase.',
      'Requires calorie-dense wholesome breakfasts and post-school sports meals.',
      'Can understand balanced macronutrients and choose healthy snacks over junk.'
    ]
  },
  {
    id: '15_18_years',
    filename: 'stage_15_18y.ts',
    ageLimit: '15 - 18 Years',
    title: 'Teen Athletic & Academic Stamina',
    guidelines: 'Adolescents need sustained complex carbs, clean protein, and electrolytes for exam stamina and athletic recovery. Keep wholesome food readily accessible.',
    milestones: [
      'Manages independent eating schedules around coaching and sports.',
      'Builds peak bone mass and muscular strength through proper nutrition.',
      'Practices mindful hydration and clean eating habits for lifelong wellness.'
    ]
  }
];

stages.forEach(stage => {
  const mornings = adaptMorning(indianMorningBases, stage);
  const lunches = adaptLunch(indianLunchBases, stage);
  const dinners = adaptDinner(indianDinnerBases, stage);
  const snacks = adaptSnacks(indianSnackBases, stage);

  outputStageFile(
    stage.filename,
    stage.id,
    stage.ageLimit,
    stage.title,
    stage.guidelines,
    stage.milestones,
    mornings,
    lunches,
    dinners,
    snacks
  );
});

console.log('All 10 stages generated successfully!');
