import { PACKAGED_INDIAN_BABY_FOODS } from './packagedIndianBrands';
export interface IndianBabyFood {
  id: string;
  name: string;
  hindiName: string;
  ageGroup: '0-6m' | '6-8m' | '8-12m' | '1-2y' | '2-3y' | '3-5y';
  ageBadge: string;
  stageName: string;
  ingredients: string[];
  calories: string;
  protein: string;
  sodium: string;
  texture: string;
  blwStatus: string;
  benefits: string;
  allergyCheck: string;
  score: string;
  pediatricTip: string;
  // Packaged Indian Food Brand attributes
  foodType?: 'traditional' | 'packaged';
  brandName?: string;
  positioning?: string;
  whereToBuy?: string;
  packagingType?: string;
  fssaiNumber?: string;
  shelfLife?: string;
}

export interface BabyFoodBrandSummary {
  brand: string;
  keyIngredients: string;
  ageRange: string;
  positioning: string;
  whereToBuy: string;
  badgeColor: string;
  accentBorder: string;
  description: string;
}

export const POPULAR_INDIAN_BABY_BRANDS: BabyFoodBrandSummary[] = [
  {
    brand: 'Nestlé Cerelac',
    keyIngredients: 'Wheat, rice, milk, fruit',
    ageRange: '6 months+',
    positioning: 'Mass market, fortified',
    whereToBuy: 'Everywhere',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    accentBorder: 'border-blue-500/40',
    description: 'Enzymatically hydrolyzed iron-fortified cereals providing essential daily micronutrients for infants starting solid weaning.'
  },
  {
    brand: 'Farex (Danone)',
    keyIngredients: 'Rice, multigrain',
    ageRange: '6 months+',
    positioning: 'Affordable, trusted',
    whereToBuy: 'Pharmacy, online',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    accentBorder: 'border-emerald-500/40',
    description: 'A legacy Indian weaning food brand renowned for gentle, easily digestible rice and multigrain formulations with zero added artificial colors.'
  },
  {
    brand: 'Slurrp Farm',
    keyIngredients: 'Ragi, jowar, moong',
    ageRange: '6 months+',
    positioning: 'Clean label, Indian grains',
    whereToBuy: 'D2C, e-commerce, MT',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    accentBorder: 'border-amber-500/40',
    description: 'Pioneering clean-label toddler nutrition using 100% Indian millets (ragi, jowar, foxtail) and lentils with zero refined sugar and zero maida.'
  },
  {
    brand: 'Little Millet',
    keyIngredients: 'Organic millets',
    ageRange: '6 months+',
    positioning: 'Premium organic',
    whereToBuy: 'D2C, specialty',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
    accentBorder: 'border-teal-500/40',
    description: 'Artisanal sprouted and stone-ground organic millet porridge mixes designed for optimal infant digestion and mineral absorption.'
  },
  {
    brand: 'Enfamil (Reckitt)',
    keyIngredients: 'Infant formula (DHA, ARA, Choline)',
    ageRange: '0 to 24 months',
    positioning: 'Clinical, premium formula',
    whereToBuy: 'Pharmacy, online',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    accentBorder: 'border-purple-500/40',
    description: 'Pediatrician-recommended clinical infant formula scientifically engineered with neuro-nutrients (DHA, ARA, Choline) supporting brain milestones.'
  },
  {
    brand: 'Nestlé Nan',
    keyIngredients: 'Infant formula (Optipro, B. lactis)',
    ageRange: '0 to 36 months',
    positioning: 'Mass market formula',
    whereToBuy: 'Pharmacy, everywhere',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
    accentBorder: 'border-sky-500/40',
    description: 'The worldwide gold-standard infant formula series featuring Optipro protein technology and active probiotic cultures.'
  },
  {
    brand: 'Timios',
    keyIngredients: 'Ragi, oats, vegetables',
    ageRange: '8 months+',
    positioning: 'No added sugar, D2C',
    whereToBuy: 'D2C, e-commerce',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    accentBorder: 'border-rose-500/40',
    description: 'Wholesome infant snack and meal purees crafted without added cane sugar, preservatives, or artificial additives, designed for baby-led weaning.'
  },
  {
    brand: 'Happilo Baby',
    keyIngredients: 'Grains, nuts, seeds',
    ageRange: '12 months+',
    positioning: 'Premium, nutrition-dense',
    whereToBuy: 'E-commerce, MT',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    accentBorder: 'border-yellow-500/40',
    description: 'Super-dense toddler blends utilizing premium blanched nuts, chia, roasted seeds, and ancient grains to support energetic physical growth.'
  },
  {
    brand: 'Mamaearth Tummy',
    keyIngredients: 'Natural ingredients (Millets, Oats)',
    ageRange: '6 months+',
    positioning: 'Natural, toxin-free',
    whereToBuy: 'D2C, e-commerce',
    badgeColor: 'bg-lime-500/20 text-lime-300 border-lime-400/30',
    accentBorder: 'border-lime-500/40',
    description: 'Safe, toxin-free organic baby cereal crafted with gentle whole grains, prebiotic fiber, and dried fruits for easy tummy digestion.'
  },
  {
    brand: '24 Mantra Organic',
    keyIngredients: 'Certified organic grains',
    ageRange: '6 months+',
    positioning: 'Certified organic',
    whereToBuy: 'E-commerce, organic stores',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    accentBorder: 'border-emerald-500/40',
    description: 'India’s pioneer in certified organic foods, offering pesticide-free whole-grain porridges and flours meeting stringent Jaivik Bharat organic standards.'
  }
];

export const INDIAN_BABY_FOODS: IndianBabyFood[] = [
  // -------------------------------------------------------------
  // 0 to 6 MONTHS: Early Infancy (WHO, Indian IAP and FSSAI Gold Standards)
  // -------------------------------------------------------------
  {
    id: 'food-0-1',
    name: "Mother's Milk (Exclusive Breastmilk)",
    hindiName: "माँ का दूध (स्तनपान)",
    ageGroup: '0-6m',
    ageBadge: '0-6 Months',
    stageName: 'Early Infancy · Gold Standard',
    ingredients: ['Human Milk Oligosaccharides (HMO)', 'Secretory IgA Antibodies', 'DHA/ARA', 'Lactose', 'Bioactive Enzymes'],
    calories: '68 kcal / 100ml',
    protein: '1.2 g / 100ml',
    sodium: '0.017 g / 100ml',
    texture: 'Fluid (Sterile & Optimal Body Temp)',
    blwStatus: 'Exclusively Recommended',
    benefits: 'Complete brain myelinization, gut immunity colonization, and zero renal solute overload.',
    allergyCheck: 'Hypoallergenic natural human proteins. Zero introduced allergens.',
    score: '10.0 / 10',
    pediatricTip: 'WHO, Indian IAP and FSSAI strictly recommend exclusive breastfeeding for the first 6 months. No water, ghutti, or animal milk is needed.'
  },
  {
    id: 'food-0-2',
    name: 'Sterilized Whey-Dominant Infant Formula (Stage 1)',
    hindiName: 'शिशु फॉर्मूला (स्टेज 1)',
    ageGroup: '0-6m',
    ageBadge: '0-6 Months',
    stageName: 'Early Infancy · Medically Supervised',
    ingredients: ['Demineralized Whey', 'Lactose', 'Iron (Fortified)', 'DHA & ARA', 'Vitamins A, C, D'],
    calories: '67 kcal / 100ml',
    protein: '1.3 g / 100ml',
    sodium: '0.02 g / 100ml',
    texture: 'Fluid',
    blwStatus: 'Bottle / Paladai Fed',
    benefits: 'Designed to mimic breastmilk nutritional ratios when breastfeeding is medically unavailable.',
    allergyCheck: 'Contains Cow Milk Protein (Whey/Casein). Check for CMPA signs.',
    score: '9.4 / 10',
    pediatricTip: 'Always prepare with boiled and cooled water (70°C) in thoroughly sterilized paladai or bottles.'
  },

  // -------------------------------------------------------------
  // 6 to 8 MONTHS: Stage 1 First Solids & Gentle Purees
  // -------------------------------------------------------------
  {
    id: 'food-6-1',
    name: 'Moong Dal Paani with Roasted Cumin (Jeera Water)',
    hindiName: 'मूंग दाल का पानी (जीरा युक्त)',
    ageGroup: '6-8m',
    ageBadge: '6-8 Months',
    stageName: 'Stage 1 · First Solids Introduction',
    ingredients: ['Yellow Split Moong Dal', 'Filtered Water', 'Pinch of Roasted Cumin Powder (Jeera)', 'Drop of Cow Ghee'],
    calories: '45 kcal / small bowl',
    protein: '2.4 g',
    sodium: '0.01 g (Zero added salt)',
    texture: 'Thin Strained Liquid',
    blwStatus: 'Spoon Fed',
    benefits: 'Easiest introduced legume protein; very gentle on infant gastrointestinal lining.',
    allergyCheck: 'Gluten-Free, Dairy-Free, Zero Top-8 Allergens.',
    score: '9.8 / 10',
    pediatricTip: 'Follow the 3-day rule when introducing dal paani. Never add salt or sugar to infant food before 1 year.'
  },
  {
    id: 'food-6-2',
    name: 'Ragi Sari / Nachni Porridge (Finger Millet)',
    hindiName: 'रागी सारी / नाचनी का दलिया',
    ageGroup: '6-8m',
    ageBadge: '6-8 Months',
    stageName: 'Stage 1 · Mineral-Dense Weaning',
    ingredients: ['Sprouted Ragi Flour (Finger Millet)', 'Warm Water', '1/4 tsp Desi Cow Ghee'],
    calories: '95 kcal / bowl',
    protein: '3.1 g',
    sodium: '0.01 g (Natural)',
    texture: 'Silky Smooth Puree',
    blwStatus: 'Spoon Fed',
    benefits: 'Richest natural plant calcium source (344mg/100g); promotes bone density and baby teeth budding.',
    allergyCheck: 'Naturally 100% Gluten-Free, Nut-Free.',
    score: '9.9 / 10',
    pediatricTip: 'Sprouting ragi doubles its bioavailable iron and reduces phytates for effortless digestion.'
  },
  {
    id: 'food-6-3',
    name: 'Steamed Himachali Apple Puree (Seb Puree)',
    hindiName: 'भाप में पके सेब की प्यूरी',
    ageGroup: '6-8m',
    ageBadge: '6-8 Months',
    stageName: 'Stage 1 · Gentle Fruit Weaning',
    ingredients: ['Peeled Himachali Apple', 'Pinch of Cinnamon (Dalchini)'],
    calories: '55 kcal / small cup',
    protein: '0.3 g',
    sodium: '0.005 g',
    texture: 'Smooth Velvety Puree',
    blwStatus: 'Puree / Pre-loaded Spoon',
    benefits: 'Packed with gentle soluble pectin fiber; prevents infant constipation during transition from milk.',
    allergyCheck: 'Allergen-Safe, Non-acidic fruit.',
    score: '9.7 / 10',
    pediatricTip: 'Always steam apples until fork-tender before pureeing. Raw apple slices are a major choking hazard under 12 months.'
  },
  {
    id: 'food-6-4',
    name: 'Steamed Lauki (Bottle Gourd) & Sweet Carrot Mash',
    hindiName: 'लौकी और गाजर की प्यूरी',
    ageGroup: '6-8m',
    ageBadge: '6-8 Months',
    stageName: 'Stage 1 · Soothing Veg Puree',
    ingredients: ['Fresh Lauki (Bottle Gourd)', 'Tender Orange Carrot', 'Few drops of Warm Ghee'],
    calories: '40 kcal / bowl',
    protein: '0.9 g',
    sodium: '0.02 g (Natural)',
    texture: 'Water-rich Fine Puree',
    blwStatus: 'Spoon Fed',
    benefits: 'High hydration and rich beta-carotene for infant visual acuity and retinal health.',
    allergyCheck: 'Hypoallergenic, Nightshade-Free, Gluten-Free.',
    score: '9.6 / 10',
    pediatricTip: 'Lauki is deeply soothing for teething infants experiencing tummy sensitivity.'
  },
  {
    id: 'food-6-5',
    name: 'Mashed Yellow Banana with Cardamom (Kela Mash)',
    hindiName: 'इलायची युक्त मसला हुआ केला',
    ageGroup: '6-8m',
    ageBadge: '6-8 Months',
    stageName: 'Stage 1 · Quick Energy & Potassium',
    ingredients: ['Ripe Robusta or Nendran Banana', 'Pinch of Green Cardamom Powder (Elaichi)'],
    calories: '85 kcal / half banana',
    protein: '1.1 g',
    sodium: '0.002 g',
    texture: 'Soft Fork-Mashed Pulp',
    blwStatus: 'Self-feeding Mash',
    benefits: 'High potassium and prebiotic oligosaccharides supporting beneficial gut bifidobacteria.',
    allergyCheck: 'Safe & hypoallergenic. No added sweeteners.',
    score: '9.6 / 10',
    pediatricTip: 'Use bananas with speckled brown spots for highest natural sweetness and easiest digestion.'
  },

  // -------------------------------------------------------------
  // 8 to 12 MONTHS: Stage 2 Mashes, Khichdi & Porridges
  // -------------------------------------------------------------
  {
    id: 'food-8-1',
    name: 'Moong Dal & Rice Khichdi with A2 Desi Ghee',
    hindiName: 'देसी घी वाली मूंग दाल खिचड़ी',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · Iconic Indian Weaning Comfort',
    ingredients: ['Yellow Moong Dal (Split)', 'Sona Masoori Rice', 'Pure Desi Cow Ghee', 'Pinch of Turmeric (Haldi)', 'Roasted Cumin (Jeera)', 'Pinch of Hing'],
    calories: '165 kcal / medium bowl',
    protein: '5.8 g',
    sodium: '0.03 g (Zero salt)',
    texture: 'Soft Fork-Crushed Lump-free Mash',
    blwStatus: 'BLW Soft Mash Safe',
    benefits: 'Perfect complementary amino acid ratio (Lysine in dal + Methionine in rice); healthy fats from ghee aid brain synapse coating.',
    allergyCheck: 'Contains Dairy (Ghee). Zero nuts, zero soy, zero gluten.',
    score: '9.9 / 10',
    pediatricTip: 'A tiny pinch of hing (asafoetida) prevents gas and infant colic from pulses.'
  },
  {
    id: 'food-8-2',
    name: 'Suji (Semolina) Kheer with Pure Date Paste',
    hindiName: 'सूजी और खजूर की खीर',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · Wholesome Porridge',
    ingredients: ['Dry Roasted Semolina (Suji)', 'Boiled Water / Expressed Milk', 'Mashed Medjool Date Paste', 'Cardamom', '1/2 tsp Cow Ghee'],
    calories: '135 kcal / bowl',
    protein: '3.6 g',
    sodium: '0.015 g',
    texture: 'Thick Porridge Consistency',
    blwStatus: 'Spoon Fed',
    benefits: 'Sustained energy release; naturally sweetened with iron-rich dates without refined sugar.',
    allergyCheck: 'Contains Wheat (Gluten) and Dairy. Introduces gentle gluten safety.',
    score: '9.5 / 10',
    pediatricTip: 'Introducing wheat/gluten between 6-12 months while continuing breastfeeding lowers future celiac risks.'
  },
  {
    id: 'food-8-3',
    name: 'Dalia (Cracked Wheat) & Kaddu (Pumpkin) Mash',
    hindiName: 'दलिया और कद्दू का दलिया',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · High-Fiber Digestive Porridge',
    ingredients: ['Broken Wheat (Dalia)', 'Yellow Pumpkin (Kaddu)', 'Cumin Seeds', 'Desi Ghee'],
    calories: '140 kcal / bowl',
    protein: '4.2 g',
    sodium: '0.02 g',
    texture: 'Soft Cooked Porridge with Tender Pumpkin Cubes',
    blwStatus: 'Spoon Fed & Finger Mash',
    benefits: 'High dietary fiber and Vitamin A for healthy immune epithelial linings.',
    allergyCheck: 'Contains Wheat (Gluten).',
    score: '9.7 / 10',
    pediatricTip: 'Pressure cook dalia for 4-5 whistles so grain kernels are fully broken down for tender gums.'
  },
  {
    id: 'food-8-4',
    name: 'Sweet Potato (Shakarkandi) Mash with Cumin & Ghee',
    hindiName: 'शकरकंद और घी का मैश',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · Gentle Root Vegetable',
    ingredients: ['Steamed Sweet Potato', 'Roasted Jeera Powder', '1/2 tsp Desi Cow Ghee'],
    calories: '120 kcal / small cup',
    protein: '1.8 g',
    sodium: '0.025 g',
    texture: 'Creamy Pinch-Soft Mash',
    blwStatus: 'Excellent Baby-Led Finger Scoop',
    benefits: 'Low glycemic index energy, rich in Vitamin C, potassium, and carotenoids.',
    allergyCheck: 'Gluten-Free, Nut-Free, Egg-Free.',
    score: '9.8 / 10',
    pediatricTip: 'Sweet potato is an ideal finger-food test; toddlers can easily grab soft steamed sticks without choking.'
  },
  {
    id: 'food-8-5',
    name: 'Soft Curd Rice (Dahi Chawal / Thair Sadam)',
    hindiName: 'दही चावल (सॉफ्ट थाइर सादम)',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · Probiotic Gut Regulator',
    ingredients: ['Overcooked Soft Rice', 'Homemade Fresh Set Curd (Dahi)', 'Roasted Cumin Powder', 'Few drops of Water'],
    calories: '130 kcal / bowl',
    protein: '4.5 g',
    sodium: '0.04 g (Zero added salt)',
    texture: 'Soft Creamy Rice Mash',
    blwStatus: 'Spoon or Hand Feeding',
    benefits: 'Lactobacillus probiotics restore gut flora balance, treat loose stools, and soothe teething fever.',
    allergyCheck: 'Contains Dairy (Milk curd).',
    score: '9.8 / 10',
    pediatricTip: 'Always use fresh curd that is not sour; sour curd can irritate baby throat.'
  },
  {
    id: 'food-8-6',
    name: 'Boiled Egg Yolk Mash with Ghee',
    hindiName: 'उबले अंडे की जर्दी (घी युक्त)',
    ageGroup: '8-12m',
    ageBadge: '8-12 Months',
    stageName: 'Stage 2 · Pediatric Allergen Introduction',
    ingredients: ['Hard-boiled Egg Yolk', 'Few drops warm water or breastmilk', '1/4 tsp Cow Ghee'],
    calories: '75 kcal',
    protein: '3.2 g',
    sodium: '0.02 g',
    texture: 'Soft Crumbly Puree',
    blwStatus: 'Spoon Fed',
    benefits: 'Packed with choline, lutein, and iron essential for cognitive and optic nerve wiring.',
    allergyCheck: 'Contains Egg (Yolk only). Introduce yolk first before whole egg white.',
    score: '9.7 / 10',
    pediatricTip: 'Recent pediatric guidelines recommend early allergen introduction (around 8-9 months) to prevent severe allergies.'
  },

  // -------------------------------------------------------------
  // 1 to 2 YEARS: Stage 3 Toddler Finger Foods & Cheelas
  // -------------------------------------------------------------
  {
    id: 'food-1-1',
    name: 'Mini Ghee Idli with Mild Pumpkin-Carrot Sambar',
    hindiName: 'मिनी घी इडली और सांबर',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · Fermented Bioavailable Powerhouse',
    ingredients: ['Fermented Rice & Urad Dal Batter', 'Desi Cow Ghee', 'Toor Dal Stew with Pumpkin & Carrots', 'Mild Turmeric & Curry Leaf Infusion'],
    calories: '190 kcal / 4 mini idlis + stew',
    protein: '6.5 g',
    sodium: '0.12 g (Mildly salted)',
    texture: 'Pillowy Soft & Easily Gummed',
    blwStatus: 'Top Toddler Finger Food',
    benefits: 'Fermentation breaks down phytates and increases vitamin B12 & folic acid bioavailability.',
    allergyCheck: 'Gluten-Free. Contains mild legumes.',
    score: '9.9 / 10',
    pediatricTip: 'Dip mini idlis into warm stew so they become melt-in-the-mouth soft for independent toddler eating.'
  },
  {
    id: 'food-1-2',
    name: 'Moong Dal & Fresh Paneer Cheela (Protein Crepe)',
    hindiName: 'मूंग दाल और पनीर का चीला',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · High-Protein Toddler Meal',
    ingredients: ['Soaked Yellow Moong Dal Batter', 'Fresh Grated Cow Paneer', 'Finely Grated Carrot', 'Mild Jeera Powder', 'Cow Ghee'],
    calories: '210 kcal / 1 cheela',
    protein: '9.2 g',
    sodium: '0.15 g',
    texture: 'Soft Golden Crepe',
    blwStatus: 'Rollable & Easy To Hold',
    benefits: 'High biological value dairy & legume protein supporting muscle building and height gain.',
    allergyCheck: 'Contains Dairy (Paneer/Ghee). Gluten-Free.',
    score: '9.8 / 10',
    pediatricTip: 'Cut cheela into toddler-friendly fingers or strips so little fingers can practice pincer grasp.'
  },
  {
    id: 'food-1-3',
    name: 'Soft Ragi Dosa with Mild Coconut Chutney',
    hindiName: 'रागी डोसा और नारियल चटनी',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · Calcium Skeletal Support',
    ingredients: ['Ragi Flour', 'Rice Flour', 'Fresh Grated Coconut Puree', 'Mustard Seed & Curry Leaves', 'Ghee'],
    calories: '185 kcal / 1 small dosa',
    protein: '4.8 g',
    sodium: '0.14 g',
    texture: 'Soft Thin Pancake',
    blwStatus: 'Finger Food',
    benefits: '350mg calcium per serving; ideal for active toddlers learning to walk and run.',
    allergyCheck: 'Contains Coconut. Naturally Gluten-Free.',
    score: '9.7 / 10',
    pediatricTip: 'Make ragi dosa on a cast-iron tawa to naturally fortify toddler food with dietary iron.'
  },
  {
    id: 'food-1-4',
    name: 'Palak Paneer Khichdi (Spinach & Cottage Cheese)',
    hindiName: 'पालक पनीर खिचड़ी',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · Iron & Calcium Combo',
    ingredients: ['Pureed Baby Spinach (Palak)', 'Soft Paneer Cubes', 'Yellow Moong Dal', 'Steamed Rice', 'A2 Ghee'],
    calories: '225 kcal / bowl',
    protein: '8.4 g',
    sodium: '0.16 g',
    texture: 'Rich Moist Khichdi',
    blwStatus: 'Spoon Fed or Self-eating',
    benefits: 'Spinach provides folate and iron, while paneer provides protein; ghee enhances fat-soluble Vitamin K absorption.',
    allergyCheck: 'Contains Dairy (Paneer/Ghee).',
    score: '9.8 / 10',
    pediatricTip: 'Blanch spinach briefly to retain its vibrant emerald chlorophyll and prevent bitter taste.'
  },
  {
    id: 'food-1-5',
    name: 'Vegetable Upma with Sweet Carrots & Green Peas',
    hindiName: 'सब्जियों वाला सूजी उपमा',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · Breakfast Grain & Veg',
    ingredients: ['Roasted Semolina (Rava)', 'Diced Tender Carrots', 'Green Peas (Crushed)', 'Curry Leaves', 'Cow Ghee'],
    calories: '175 kcal / cup',
    protein: '4.5 g',
    sodium: '0.15 g',
    texture: 'Moist, Non-Sticky Porridge-Grain',
    blwStatus: 'Self Spoon Feeding',
    benefits: 'Complex carbohydrates fueling active morning exploration and play.',
    allergyCheck: 'Contains Wheat (Gluten).',
    score: '9.5 / 10',
    pediatricTip: 'Lightly crush green peas with a fork before serving so round peas do not present an aspiration risk.'
  },
  {
    id: 'food-1-6',
    name: 'Oats & Badam (Almond) Halwa with Jaggery',
    hindiName: 'ओट्स और बादाम का हलवा',
    ageGroup: '1-2y',
    ageBadge: '1-2 Years',
    stageName: 'Stage 3 · Wholesome Healthy Sweet',
    ingredients: ['Rolled Oats Flour', 'Almond Meal (Finely Ground Badam)', 'Organic Date Syrup / Jaggery', 'Green Cardamom', 'Desi Ghee'],
    calories: '195 kcal / small bowl',
    protein: '5.2 g',
    sodium: '0.04 g',
    texture: 'Warm Silky Pudding',
    blwStatus: 'Spoon Fed',
    benefits: 'Beta-glucan soluble fiber for healthy gut and Vitamin E from almonds for skin & nerve health.',
    allergyCheck: 'Contains Tree Nuts (Almond) & Ghee.',
    score: '9.6 / 10',
    pediatricTip: 'Always use finely pulverized almond flour; whole or chopped nuts must be avoided under 4 years.'
  },

  // -------------------------------------------------------------
  // 2 to 3 YEARS: Stage 4 Family Tables & Balanced Toddler Meals
  // -------------------------------------------------------------
  {
    id: 'food-2-1',
    name: 'Soft Methi Thepla with Fresh Homemade Curd',
    hindiName: 'मेथी थेपला और ताज़ा दही',
    ageGroup: '2-3y',
    ageBadge: '2-3 Years',
    stageName: 'Stage 4 · Traditional Digestive Flatbread',
    ingredients: ['Whole Wheat Flour (Atta)', 'Fresh Chopped Fenugreek (Methi) Leaves', 'Ajwain (Carom Seeds)', 'Turmeric', 'Desi Ghee', 'Fresh Curd'],
    calories: '240 kcal / 2 mini theplas + curd',
    protein: '7.8 g',
    sodium: '0.22 g',
    texture: 'Soft Rolled Flatbread',
    blwStatus: 'Independent Toddler Meal',
    benefits: 'Ajwain aids gastric motility and prevents flatulence; methi provides natural iron and dietary fiber.',
    allergyCheck: 'Contains Wheat (Gluten) & Dairy.',
    score: '9.8 / 10',
    pediatricTip: 'Roll the theplas super thin and cook on low flame with ghee so they remain soft all day.'
  },
  {
    id: 'food-2-2',
    name: 'Soft Stuffed Paneer Paratha with White Makhan',
    hindiName: 'पनीर पराठा और सफेद मक्खन',
    ageGroup: '2-3y',
    ageBadge: '2-3 Years',
    stageName: 'Stage 4 · Calcium & Growth Fuel',
    ingredients: ['Whole Wheat Dough', 'Crumbled Malai Paneer', 'Fresh Coriander', 'Pinch of Roasted Jeera & Salt', 'Homemade White Butter'],
    calories: '280 kcal / 1 paratha',
    protein: '10.5 g',
    sodium: '0.25 g',
    texture: 'Soft Flaky Filled Flatbread',
    blwStatus: 'Cut into Triangles',
    benefits: 'High quality biological protein and dietary calcium promoting height milestones.',
    allergyCheck: 'Contains Wheat (Gluten) & Cow Milk Dairy.',
    score: '9.7 / 10',
    pediatricTip: 'Toddlers burn rapid calories during growth spurts; healthy dairy fats like white butter support hormone synthesis.'
  },
  {
    id: 'food-2-3',
    name: 'Mixed Yellow Dal Tadka with Steamed Rice',
    hindiName: 'दाल तड़का और भात (चावल)',
    ageGroup: '2-3y',
    ageBadge: '2-3 Years',
    stageName: 'Stage 4 · Daily Home Staple',
    ingredients: ['Toor Dal', 'Masoor Dal', 'Ripe Tomato', 'Garlic & Cumin Tempering', 'Steamed Rice', 'Ghee'],
    calories: '260 kcal / plate',
    protein: '9.1 g',
    sodium: '0.28 g',
    texture: 'Comforting Rice & Gravy',
    blwStatus: 'Self Feeding with Spoon/Hand',
    benefits: 'Dual pulse combination optimizes amino acid diversity and provides steady glycemic satiety.',
    allergyCheck: 'Contains Legumes & Ghee. Gluten-Free.',
    score: '9.8 / 10',
    pediatricTip: 'Adding tomatoes provides Vitamin C, which triples the absorption of plant-based iron from dal.'
  },
  {
    id: 'food-2-4',
    name: 'Besan & Grated Carrot Cheela (Chickpea Crepe)',
    hindiName: 'बेसन और गाजर का चीला',
    ageGroup: '2-3y',
    ageBadge: '2-3 Years',
    stageName: 'Stage 4 · Plant Protein & Beta-Carotene',
    ingredients: ['Gram Flour (Besan)', 'Finely Grated Carrot', 'Coriander', 'Carom Seeds (Ajwain)', 'Cow Ghee'],
    calories: '190 kcal / 1 cheela',
    protein: '7.5 g',
    sodium: '0.2 g',
    texture: 'Soft Savory Pancake',
    blwStatus: 'Finger Strips',
    benefits: 'Rich in zinc and magnesium essential for immune lymphocyte activity.',
    allergyCheck: 'Gluten-Free. Contains Chickpea/Legume.',
    score: '9.7 / 10',
    pediatricTip: 'Pair with homemade mint-coriander curd dip to double probiotic intake.'
  },
  {
    id: 'food-2-5',
    name: 'Makhana (Foxnut) Milk Pudding with Cardamom',
    hindiName: 'मखाने की खीर (दूध और इलायची)',
    ageGroup: '2-3y',
    ageBadge: '2-3 Years',
    stageName: 'Stage 4 · Calcium & Sound Sleep Snack',
    ingredients: ['Popped Foxnuts (Phool Makhana)', 'Cow Milk (Boiled)', 'Date Sugar / Jaggery', 'Crushed Cardamom'],
    calories: '180 kcal / bowl',
    protein: '6.2 g',
    sodium: '0.08 g',
    texture: 'Soft Spongy Milk Pudding',
    blwStatus: 'Spoon Fed',
    benefits: 'Calming magnesium and natural tryptophan promotes restful, restorative nighttime sleep.',
    allergyCheck: 'Contains Dairy Milk. Tree nut-free.',
    score: '9.9 / 10',
    pediatricTip: 'Ideal evening or bedtime snack for active 2-3 year old toddlers.'
  },

  // -------------------------------------------------------------
  // 3 to 5 YEARS: Stage 5 Preschooler Energy & Growth
  // -------------------------------------------------------------
  {
    id: 'food-3-1',
    name: 'Sprouted Green Moong Sundal / Salad',
    hindiName: 'अंकुरित मूंग का सुंडल / सलाद',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · Living Enzyme & Protein Snack',
    ingredients: ['Steamed Sprouted Moong Beans', 'Fresh Grated Coconut', 'Mustard Seeds', 'Curry Leaves', 'Lemon Juice', 'Drop of Cold-Pressed Oil'],
    calories: '160 kcal / cup',
    protein: '8.8 g',
    sodium: '0.2 g',
    texture: 'Tender Sprouted Kernels',
    blwStatus: 'Fork or Hand Snacking',
    benefits: 'Sprouting activates live digestive enzymes, enhances Vitamin C, and makes legume proteins 40% more digestible.',
    allergyCheck: 'Gluten-Free, Dairy-Free. Contains Coconut.',
    score: '9.9 / 10',
    pediatricTip: 'Steam the sprouts for 3-4 minutes so they are tender on preschooler teeth while retaining raw nutrients.'
  },
  {
    id: 'food-3-2',
    name: 'Ragi Malt Milk Drink with Organic Jaggery',
    hindiName: 'रागी माल्ट और दूध (गुड़ युक्त)',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · Traditional Health Drink',
    ingredients: ['Roasted Sprouted Ragi Flour', 'Warm Cow Milk', 'Organic Jaggery Powder', 'Green Cardamom'],
    calories: '190 kcal / glass',
    protein: '7.2 g',
    sodium: '0.1 g',
    texture: 'Smooth Warm Beverage',
    blwStatus: 'Cup Drinking',
    benefits: 'Superior replacement for commercial sugar-laden malt drinks; provides pure bio-available calcium and unrefined iron.',
    allergyCheck: 'Contains Dairy Milk. Gluten-Free.',
    score: '9.9 / 10',
    pediatricTip: 'Commercial branded drinks often contain up to 50% sugar. Homemade ragi malt gives 3x more calcium with zero additives.'
  },
  {
    id: 'food-3-3',
    name: 'Paneer & Veg Pulao with Cucumber Mint Raita',
    hindiName: 'पनीर पुलाव और खीरे का रायता',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · School Lunchbox Favourite',
    ingredients: ['Basmati Rice', 'Sauteed Paneer Cubes', 'Green Peas', 'Diced Carrots & Beans', 'Mild Spices (Cinnamon, Clove)', 'Homemade Curd Raita'],
    calories: '310 kcal / meal',
    protein: '11.8 g',
    sodium: '0.32 g',
    texture: 'Fluffy Rice with Soft Paneer & Veggies',
    blwStatus: 'Complete Preschooler Meal',
    benefits: 'Full spectrum macronutrient balance: complex carbohydrates, casein & whey protein, and probiotic cooling.',
    allergyCheck: 'Contains Dairy (Paneer/Curd). Gluten-Free.',
    score: '9.8 / 10',
    pediatricTip: 'Pack this in school tiffin; the raita keeps the body hydrated during hot afternoons.'
  },
  {
    id: 'food-3-4',
    name: 'Makhana (Foxnuts) Roasted in Desi Ghee & Turmeric',
    hindiName: 'देसी घी और हल्दी में भुना मखाना',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · Healthy Clean Crunch Snack',
    ingredients: ['Phool Makhana (Lotus Seeds)', 'Pure Cow Ghee', 'Pinch of Haldi (Turmeric)', 'Pink Himalayan Salt'],
    calories: '140 kcal / generous bowl',
    protein: '4.8 g',
    sodium: '0.18 g',
    texture: 'Light, Airy & Crunchy',
    blwStatus: 'Hand Finger Food',
    benefits: 'Zero cholesterol, low glycemic index, and superior non-fried alternative to processed potato chips.',
    allergyCheck: 'Gluten-Free, Nut-Free. Contains Ghee.',
    score: '9.9 / 10',
    pediatricTip: 'Great substitute for deep-fried snacks; turmeric provides anti-inflammatory curcumin to fight school colds.'
  },
  {
    id: 'food-3-5',
    name: 'Palak (Spinach) & Moong Dal Stuffed Roti Roll',
    hindiName: 'पालक और मूंग दाल रोटी रोल',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · On-The-Go Finger Meal',
    ingredients: ['Whole Wheat Roti', 'Cooked Yellow Moong Dal Mash', 'Finely Chopped Spinach', 'Mint Yogurt Spread', 'Cow Ghee'],
    calories: '230 kcal / roll',
    protein: '8.6 g',
    sodium: '0.24 g',
    texture: 'Soft Wrap Roll',
    blwStatus: 'Two-Hand Hold Food',
    benefits: 'Clever way to feed leafy green vegetables to picky preschool toddlers without fuss.',
    allergyCheck: 'Contains Wheat (Gluten) & Dairy.',
    score: '9.7 / 10',
    pediatricTip: 'Toddlers love rolled finger foods. Involving them in spreading the yogurt sauce increases their willingness to eat veggies.'
  },
  {
    id: 'food-3-6',
    name: 'Dates & Mixed Seed Ladoo (Khajoor Ladoo - No Sugar)',
    hindiName: 'खजूर और बीज के लड्डू (बिना चीनी)',
    ageGroup: '3-5y',
    ageBadge: '3-5 Years',
    stageName: 'Stage 5 · Dense Natural Energy Bite',
    ingredients: ['Soft Seedless Dates (Khajoor)', 'White Sesame Seeds (Til)', 'Pumpkin Seeds (Crushed)', 'Cardamom', 'Ghee'],
    calories: '110 kcal / 1 small ladoo',
    protein: '3.5 g',
    sodium: '0.01 g',
    texture: 'Soft Chewy Energy Ball',
    blwStatus: 'Self-Snacking',
    benefits: 'High zinc and healthy omega-3 fatty acids supporting brain synapse connectivity and height milestones.',
    allergyCheck: 'Nut-Free option (uses seeds & dates). Dairy in ghee.',
    score: '9.8 / 10',
    pediatricTip: 'Zero refined sugar or artificial syrups. One ladoo before outdoor sports provides 90 minutes of steady stamina.',
    foodType: 'traditional'
  },

  // -------------------------------------------------------------
  // PACKAGED INDIAN BABY FOOD BRANDS (25 VERIFIED PRODUCTS)
  // -------------------------------------------------------------
  ...PACKAGED_INDIAN_BABY_FOODS
];
