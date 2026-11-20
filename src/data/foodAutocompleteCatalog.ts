import { INDIAN_BABY_FOODS, IndianBabyFood } from './indianBabyFoods';
import { calculateScoreForFood, calculateFatForFood } from '../lib/foodNutritionCalculator';

export interface AutocompleteFoodProduct {
  id: string;
  name: string;
  brandName?: string;
  category: 'Baby Brand' | 'Home Recipe' | 'Packaged Snack' | 'Health Drink' | 'Dairy & Fresh';
  ageBadge: string;
  stageName: string;
  score: string;
  scoreNumber: number;
  novaLevel: string;
  calories: string;
  protein: string;
  fat: string;
  sodium: string;
  blwStatus: string;
  gumPinchTest: string;
  ingredients: string[];
  allergyCheck: string;
  pediatricTip: string;
  texture: string;
  safetyWarning?: string;
  isSafeForBaby: boolean;
  keywords: string[];
}

const EXTRA_COMMON_FOOD_PRODUCTS: AutocompleteFoodProduct[] = [
  {
    id: 'auto-lays-classic',
    name: "Lay's Classic Salted Potato Chips",
    brandName: "Lay's (PepsiCo)",
    category: 'Packaged Snack',
    ageBadge: 'Avoid (<2 Years)',
    stageName: 'High Sodium & Choking Hazard',
    score: '2.5 / 10',
    scoreNumber: 2.5,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '536 kcal / 100g',
    protein: '6.5 g',
    fat: '34.0 g',
    sodium: '520 mg',
    blwStatus: 'Unsafe for BLW (Sharp Choking Hazard)',
    gumPinchTest: 'Failed (Hard, brittle, sharp shard fragments)',
    ingredients: ['Potatoes', 'Edible Vegetable Oil (Palmolein)', 'Iodized Salt'],
    allergyCheck: 'High sodium load strains immature infant kidneys; processed in facilities handling dairy/wheat.',
    pediatricTip: 'Sharp, brittle chip edges pose a choking hazard for children under 3 years. High sodium and deep-fried oils make it unsuitable for toddlers.',
    texture: 'Hard, Sharp & Brittle',
    safetyWarning: 'Not suitable for infants or young toddlers due to choking risk from brittle shards and high sodium content.',
    isSafeForBaby: false,
    keywords: ['lays', 'chips', 'potato chips', 'wafers', 'salted chips', 'snack']
  },
  {
    id: 'auto-kurkure-masala',
    name: 'Kurkure Masala Munch',
    brandName: 'PepsiCo India',
    category: 'Packaged Snack',
    ageBadge: 'Avoid (<3 Years)',
    stageName: 'Ultra-Processed Fried Snack',
    score: '2.1 / 10',
    scoreNumber: 2.1,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '552 kcal / 100g',
    protein: '6.0 g',
    fat: '35.6 g',
    sodium: '680 mg',
    blwStatus: 'Unsafe (Hard Crunchy Extruded Snack)',
    gumPinchTest: 'Failed (Rigid crunchy collets)',
    ingredients: ['Rice Meal', 'Edible Vegetable Oil (Palmolein)', 'Corn Meal', 'Gram Meal', 'Spices & Condiments', 'Iodized Salt', 'Citric Acid (INS 330)'],
    allergyCheck: 'Contains sharp spices, high sodium, and refined palmolein oil.',
    pediatricTip: 'Avoid for babies and toddlers; replace with homemade roasted makhana (foxnuts) or puffed rice (murmura) for crunch.',
    texture: 'Hard Crunchy Sticks',
    safetyWarning: 'High sodium, pungent spices, and hard texture pose choking and digestive risks for young children.',
    isSafeForBaby: false,
    keywords: ['kurkure', 'masala munch', 'namkeen', 'snacks']
  },
  {
    id: 'auto-maggi-noodles',
    name: 'Maggi 2-Minute Masala Noodles',
    brandName: 'Nestlé Maggi',
    category: 'Packaged Snack',
    ageBadge: 'Caution (<3 Years)',
    stageName: 'High Sodium Refined Flour Noodles',
    score: '3.8 / 10',
    scoreNumber: 3.8,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '389 kcal / 100g',
    protein: '8.2 g',
    fat: '14.4 g',
    sodium: '820 mg',
    blwStatus: 'Slippery Strands (Cut Short)',
    gumPinchTest: 'Passed (Soft when boiled)',
    ingredients: ['Refined Wheat Flour (Maida)', 'Palm Oil', 'Iodized Salt', 'Wheat Gluten', 'Thickeners (INS 508, INS 412)', 'Acidity Regulators', 'Hydrolyzed Groundnut Protein', 'Mixed Spices'],
    allergyCheck: 'Contains Wheat (Gluten) and Groundnut (Peanut) protein traces.',
    pediatricTip: 'Contains maida, palm oil, and very high sodium in the tastemaker sachet. Choose whole-wheat or millet noodles with homemade vegetable broth instead.',
    texture: 'Soft Slippery Noodles',
    safetyWarning: 'High sodium (820mg/100g) and refined maida with zero dietary fiber.',
    isSafeForBaby: false,
    keywords: ['maggi', 'noodles', 'instant noodles', 'masala noodles']
  },
  {
    id: 'auto-parle-g',
    name: 'Parle-G Original Gluco Biscuits',
    brandName: 'Parle Products',
    category: 'Packaged Snack',
    ageBadge: 'Caution (High Sugar)',
    stageName: 'Refined Flour & Sugar Biscuit',
    score: '4.5 / 10',
    scoreNumber: 4.5,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '454 kcal / 100g',
    protein: '6.7 g',
    fat: '13.0 g',
    sodium: '280 mg',
    blwStatus: 'Dissolves in Milk',
    gumPinchTest: 'Passed when soaked',
    ingredients: ['Refined Wheat Flour (Maida)', 'Sugar (26g/100g)', 'Refined Palm Oil', 'Invert Sugar Syrup', 'Milk Solids', 'Raising Agents (INS 500, INS 503)', 'Iodized Salt'],
    allergyCheck: 'Contains Wheat (Gluten) and Milk Solids.',
    pediatricTip: 'Although traditionally given soaked in milk, commercial glucose biscuits contain ~26% refined sugar and maida. Opt for homemade ragi or whole-wheat jaggery cookies after 1 year.',
    texture: 'Crisp Dry Biscuit',
    safetyWarning: 'High refined sugar and maida content; WHO recommends zero added sugar under age 2.',
    isSafeForBaby: false,
    keywords: ['parle g', 'parle-g', 'biscuit', 'biscuits', 'gluco', 'cookies']
  },
  {
    id: 'auto-marie-gold',
    name: 'Britannia Marie Gold Biscuits',
    brandName: 'Britannia',
    category: 'Packaged Snack',
    ageBadge: 'Occasional (2+ Years)',
    stageName: 'Tea-Time Wheat Biscuit',
    score: '5.0 / 10',
    scoreNumber: 5.0,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '442 kcal / 100g',
    protein: '7.5 g',
    fat: '10.5 g',
    sodium: '310 mg',
    blwStatus: 'Softens in Warm Milk',
    gumPinchTest: 'Passed when softened',
    ingredients: ['Refined Wheat Flour (Maida)', 'Sugar (21g/100g)', 'Refined Palm Oil', 'Invert Syrup', 'Milk Solids', 'Raising Agents', 'Emulsifiers'],
    allergyCheck: 'Contains Wheat (Gluten) and Milk Solids.',
    pediatricTip: 'Contains refined flour (maida) and added sugar. Limit to occasional small portions for older toddlers.',
    texture: 'Light Crisp Biscuit',
    isSafeForBaby: true,
    keywords: ['marie', 'marie gold', 'britannia', 'biscuit', 'biscuits']
  },
  {
    id: 'auto-oreo',
    name: 'Cadbury Oreo Vanilla Creme Biscuits',
    brandName: 'Mondelez / Cadbury',
    category: 'Packaged Snack',
    ageBadge: 'Avoid (<2 Years)',
    stageName: 'High Sugar Sandwich Cookie',
    score: '3.2 / 10',
    scoreNumber: 3.2,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '481 kcal / 100g',
    protein: '4.9 g',
    fat: '19.5 g',
    sodium: '370 mg',
    blwStatus: 'High Sugar & Hard Cookie',
    gumPinchTest: 'Failed when dry',
    ingredients: ['Refined Wheat Flour (Maida)', 'Sugar (38g/100g)', 'Refined Palmolein Oil', 'Cocoa Solids', 'Invert Syrup', 'Leavening Agents', 'Soy Lecithin (INS 322)'],
    allergyCheck: 'Contains Wheat (Gluten) and Soy Lecithin.',
    pediatricTip: 'Contains nearly 38g of sugar per 100g along with refined palm oil and cocoa caffeine.',
    texture: 'Hard Creme Sandwich Biscuit',
    safetyWarning: 'Excessive added refined sugar (38%) and palm oil.',
    isSafeForBaby: false,
    keywords: ['oreo', 'chocolate biscuit', 'cadbury oreo', 'cookies']
  },
  {
    id: 'auto-bournvita',
    name: 'Cadbury Bournvita Health Drink Mix',
    brandName: 'Mondelez / Cadbury',
    category: 'Health Drink',
    ageBadge: 'Caution (High Sugar · 3+ Yrs)',
    stageName: 'Sweetened Malt Drink Mix',
    score: '4.6 / 10',
    scoreNumber: 4.6,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '392 kcal / 100g',
    protein: '7.0 g',
    fat: '1.8 g',
    sodium: '195 mg',
    blwStatus: 'Liquid Beverage Mix',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Malt Extract (50%)', 'Sugar (32g/100g)', 'Cocoa Solids', 'Milk Solids', 'Liquid Glucose', 'Emulsifiers (INS 322)', 'Vitamins & Minerals'],
    allergyCheck: 'Contains Barley Malt (Gluten), Milk Solids, and Soy Lecithin.',
    pediatricTip: 'Despite vitamin fortification, commercial malt mixes contain high added sugar and liquid glucose. Plain pasteurized milk with homemade almond-saffron-dates powder is far healthier.',
    texture: 'Dissolvable Granules',
    isSafeForBaby: true,
    keywords: ['bournvita', 'malt drink', 'health drink', 'chocolate milk']
  },
  {
    id: 'auto-horlicks',
    name: 'Horlicks Classic Malt Nutrition Drink',
    brandName: 'HUL / Horlicks',
    category: 'Health Drink',
    ageBadge: '2+ Years (Measured Portion)',
    stageName: 'Malted Barley & Wheat Drink',
    score: '5.4 / 10',
    scoreNumber: 5.4,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '377 kcal / 100g',
    protein: '11.0 g',
    fat: '2.0 g',
    sodium: '210 mg',
    blwStatus: 'Liquid Beverage',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Malted Barley (39%)', 'Wheat Flour (27%)', 'Milk Solids (14%)', 'Sugar', 'Minerals & Vitamins', 'Protein Isolate'],
    allergyCheck: 'Contains Gluten (Barley, Wheat), Milk Solids, and Soy.',
    pediatricTip: 'Contains added sucrose alongside malted grains. Do not add extra table sugar when mixing with milk.',
    texture: 'Fine Malt Powder',
    isSafeForBaby: true,
    keywords: ['horlicks', 'junior horlicks', 'malt', 'milk powder']
  },
  {
    id: 'auto-pediasure',
    name: 'PediaSure Vanilla Delight Complete Nutrition',
    brandName: 'Abbott Nutrition',
    category: 'Health Drink',
    ageBadge: '2+ Years (Pediatrician Advised)',
    stageName: 'Catch-Up Growth Supplement',
    score: '6.8 / 10',
    scoreNumber: 6.8,
    novaLevel: 'Level 4 (Formulated Supplement)',
    calories: '461 kcal / 100g',
    protein: '14.1 g',
    fat: '17.6 g',
    sodium: '190 mg',
    blwStatus: 'Liquid Supplement',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Skim Milk Powder', 'Maltodextrin', 'Sucrose', 'High Oleic Sunflower Oil', 'Soy Oil', 'MCT Oil', 'Fructo-oligosaccharides (FOS)', '37 Vital Nutrients'],
    allergyCheck: 'Contains Milk Solids and Soy.',
    pediatricTip: 'Designed for picky eaters or children with faltering growth curves under pediatric guidance. Contains sucrose and maltodextrin; should not replace whole family meals.',
    texture: 'Reconstituted Shake',
    isSafeForBaby: true,
    keywords: ['pediasure', 'abbott', 'vanilla delight', 'protein drink']
  },
  {
    id: 'auto-kelloggs-chocos',
    name: "Kellogg's Chocos Multigrain Cereal",
    brandName: "Kellogg's",
    category: 'Packaged Snack',
    ageBadge: '3+ Years (High Sugar Alert)',
    stageName: 'Sweetened Breakfast Cereal',
    score: '4.4 / 10',
    scoreNumber: 4.4,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '387 kcal / 100g',
    protein: '8.7 g',
    fat: '2.5 g',
    sodium: '240 mg',
    blwStatus: 'Soak in Warm Milk',
    gumPinchTest: 'Passed when soaked in milk',
    ingredients: ['Wheat Solids (59%)', 'Sugar (28g/100g)', 'Cocoa Solids (5%)', 'Minerals', 'Edible Vegetable Oil', 'Iodized Salt', 'Vitamins'],
    allergyCheck: 'Contains Wheat (Gluten) and traces of Milk/Almonds.',
    pediatricTip: 'Contains ~28% added sugar. Prefer unsweetened rolled oats porridge, ragi malt, or vegetable poha/upma for daily breakfast.',
    texture: 'Crunchy Cereal Scoops',
    isSafeForBaby: true,
    keywords: ['chocos', 'kelloggs', 'corn flakes', 'cereal', 'breakfast cereal']
  },
  {
    id: 'auto-nutella',
    name: 'Ferrero Nutella Hazelnut Cocoa Spread',
    brandName: 'Ferrero',
    category: 'Packaged Snack',
    ageBadge: 'Avoid (<2 Years)',
    stageName: 'High Sugar & Palm Oil Spread',
    score: '2.9 / 10',
    scoreNumber: 2.9,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '539 kcal / 100g',
    protein: '6.3 g',
    fat: '30.9 g',
    sodium: '42 mg',
    blwStatus: 'Sticky High-Sugar Spread',
    gumPinchTest: 'Passed (Smooth paste)',
    ingredients: ['Sugar (56g/100g)', 'Palm Oil', 'Hazelnuts (13%)', 'Skimmed Milk Powder (8.7%)', 'Low-Fat Cocoa (7.4%)', 'Soy Lecithin', 'Vanillin'],
    allergyCheck: 'Contains Tree Nuts (Hazelnuts), Milk, and Soy.',
    pediatricTip: 'More than half the jar by weight is refined sugar (56%) and palm oil. Replace with 100% unsweetened roasted almond butter or peanut butter.',
    texture: 'Smooth Thick Spread',
    safetyWarning: 'Contains 56g added sugar per 100g; unsuitable for infants and toddlers.',
    isSafeForBaby: false,
    keywords: ['nutella', 'chocolate spread', 'hazelnut spread', 'ferrero']
  },
  {
    id: 'auto-amul-butter',
    name: 'Amul Pasteurized Table Butter',
    brandName: 'Amul (GCMMF)',
    category: 'Dairy & Fresh',
    ageBadge: '12+ Months (Pinch Only)',
    stageName: 'Salted Dairy Lipid',
    score: '7.6 / 10',
    scoreNumber: 7.6,
    novaLevel: 'Level 2 (Culinary Ingredient)',
    calories: '722 kcal / 100g',
    protein: '0.6 g',
    fat: '80.0 g',
    sodium: '830 mg (per 100g) · 40mg/tsp',
    blwStatus: 'Melted on Roti / Paratha',
    gumPinchTest: 'Passed (Melts immediately)',
    ingredients: ['Butter (Milk Fat)', 'Common Salt', 'Permitted Natural Color (Annatto)'],
    allergyCheck: 'Contains Cow/Buffalo Milk Fat (Dairy).',
    pediatricTip: 'For babies 6–12 months, homemade unsalted white makkhan or pure A2 desi cow ghee is preferred over salted table butter to keep sodium low.',
    texture: 'Soft Meltable Dairy Fat',
    isSafeForBaby: true,
    keywords: ['amul butter', 'butter', 'makkhan', 'amul']
  },
  {
    id: 'auto-amul-cheese',
    name: 'Amul Pasteurized Processed Cheese Cubes',
    brandName: 'Amul (GCMMF)',
    category: 'Dairy & Fresh',
    ageBadge: '12+ Months (Grated)',
    stageName: 'Calcium & Protein Dairy Cube',
    score: '7.4 / 10',
    scoreNumber: 7.4,
    novaLevel: 'Level 3 (Processed Dairy)',
    calories: '312 kcal / 100g',
    protein: '20.0 g',
    fat: '25.0 g',
    sodium: '1100 mg (per 100g) · 220mg/cube',
    blwStatus: 'Grate or Melt (Avoid Whole Cube)',
    gumPinchTest: 'Passed when grated or melted',
    ingredients: ['Cheese (Milk Solids)', 'Water', 'Emulsifying Salts (INS 331, INS 339)', 'Iodized Salt', 'Sorbic Acid (INS 200)'],
    allergyCheck: 'Contains Milk Solids (Casein & Lactose).',
    pediatricTip: 'Fresh homemade unsalted paneer (chenna) has significantly less sodium than processed cheese cubes. Always grate cheese for toddlers to avoid choking on dense cubes.',
    texture: 'Firm Dairy Cube (Grate Before Serving)',
    isSafeForBaby: true,
    keywords: ['amul cheese', 'cheese', 'cheese cubes', 'cheese slice']
  },
  {
    id: 'auto-amul-taaza-milk',
    name: 'Amul Taaza Homogenised Toned Milk',
    brandName: 'Amul (GCMMF)',
    category: 'Dairy & Fresh',
    ageBadge: '12+ Months (As Drink)',
    stageName: 'Pasteurized Cow/Buffalo Milk',
    score: '9.4 / 10',
    scoreNumber: 9.4,
    novaLevel: 'Level 1 (Minimally Processed)',
    calories: '60 kcal / 100ml',
    protein: '3.1 g',
    fat: '3.0 g',
    sodium: '44 mg',
    blwStatus: 'Open Cup / Straw Cup (12M+)',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Pasteurized Toned Milk (3% Fat, 8.5% SNF)', 'Vitamin A & D Fortified'],
    allergyCheck: 'Contains Dairy (Cow/Buffalo Milk Protein & Lactose).',
    pediatricTip: 'IAP & WHO recommend breastmilk or infant formula as the primary drink under 12 months. Whole/toned cow milk can be introduced as a drink after 1 year (up to 400–500ml/day).',
    texture: 'Smooth Liquid Milk',
    isSafeForBaby: true,
    keywords: ['amul milk', 'milk', 'toned milk', 'cow milk', 'amul taaza']
  },
  {
    id: 'auto-mother-dairy-curd',
    name: 'Mother Dairy Classic Plain Curd (Dahi)',
    brandName: 'Mother Dairy',
    category: 'Dairy & Fresh',
    ageBadge: '6+ Months',
    stageName: 'Probiotic Fermented Dairy',
    score: '9.8 / 10',
    scoreNumber: 9.8,
    novaLevel: 'Level 1 (Natural Fermented)',
    calories: '62 kcal / 100g',
    protein: '3.7 g',
    fat: '3.1 g',
    sodium: '48 mg',
    blwStatus: 'Safe Spoon-Fed',
    gumPinchTest: 'Passed (Silky smooth curd)',
    ingredients: ['Pasteurized Toned Milk', 'Active Lactic Culture (Lactobacillus)'],
    allergyCheck: 'Contains Dairy (Fermentation breaks down most lactose for easier digestion).',
    pediatricTip: 'Plain unsweetened curd (dahi) is safe from 6+ months because fermentation breaks down lactose and provides gut-friendly probiotics. Avoid fruit-flavored sweetened yogurts.',
    texture: 'Smooth Creamy Curd',
    isSafeForBaby: true,
    keywords: ['curd', 'dahi', 'yogurt', 'mother dairy', 'plain curd']
  },
  {
    id: 'auto-yakult',
    name: 'Yakult Fermented Probiotic Milk Drink',
    brandName: 'Yakult Danone',
    category: 'Health Drink',
    ageBadge: '2+ Years (Contains Sugar)',
    stageName: 'Sweetened Probiotic Shot',
    score: '6.2 / 10',
    scoreNumber: 6.2,
    novaLevel: 'Level 4 (Sweetened Beverage)',
    calories: '50 kcal / 65ml bottle',
    protein: '0.8 g',
    fat: '0.1 g',
    sodium: '12 mg',
    blwStatus: 'Liquid Shot',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Water', 'Sugar (10g per 65ml bottle)', 'Skimmed Milk Powder', 'Glucose', 'Lactobacillus casei Shirota (6.5 Billion CFU)', 'Natural Flavors'],
    allergyCheck: 'Contains Milk Solids.',
    pediatricTip: 'While rich in L. casei probiotics, a single 65ml bottle contains ~10g of added sugar. Homemade plain dahi or chaas (buttermilk) delivers probiotics with zero added sugar.',
    texture: 'Sweetened Liquid',
    isSafeForBaby: true,
    keywords: ['yakult', 'probiotic', 'probiotic drink']
  },
  {
    id: 'auto-tropicana-juice',
    name: 'Tropicana 100% Mixed Fruit / Apple Juice',
    brandName: 'Tropicana (PepsiCo)',
    category: 'Health Drink',
    ageBadge: 'Avoid (<1 Year) · Limit 1–3 Yrs',
    stageName: 'Concentrated Fruit Juice (No Fiber)',
    score: '5.5 / 10',
    scoreNumber: 5.5,
    novaLevel: 'Level 3 (Reconstituted Juice)',
    calories: '48 kcal / 100ml',
    protein: '0.3 g',
    fat: '0.0 g',
    sodium: '15 mg',
    blwStatus: 'Liquid',
    gumPinchTest: 'Passed (Liquid)',
    ingredients: ['Water', 'Concentrated Mixed Fruit / Apple Juice', 'Natural Flavoring'],
    allergyCheck: 'High free fruit sugars without whole-fruit dietary fiber.',
    pediatricTip: 'IAP & AAP advise zero fruit juice under 12 months. Even 100% packaged fruit juice lacks fiber and spikes blood glucose; always offer mashed or sliced whole fresh fruit instead.',
    texture: 'Clear Liquid Juice',
    isSafeForBaby: true,
    keywords: ['tropicana', 'real juice', 'fruit juice', 'apple juice', 'mixed fruit juice', 'frooti']
  },
  {
    id: 'auto-kissan-jam',
    name: 'Kissan Mixed Fruit Jam',
    brandName: 'HUL / Kissan',
    category: 'Packaged Snack',
    ageBadge: 'Avoid (<2 Years)',
    stageName: 'High Sugar Fruit Preserve',
    score: '3.4 / 10',
    scoreNumber: 3.4,
    novaLevel: 'Level 4 (Ultra-Processed)',
    calories: '275 kcal / 100g',
    protein: '0.2 g',
    fat: '0.1 g',
    sodium: '25 mg',
    blwStatus: 'Sticky Sugar Gel',
    gumPinchTest: 'Passed',
    ingredients: ['Sugar (68g/100g)', 'Mixed Fruit Pulp (45%)', 'Pectin (INS 440)', 'Citric Acid (INS 330)', 'Preservative (INS 211)', 'Synthetic Food Color (INS 122)'],
    allergyCheck: 'Contains Sodium Benzoate preservative (INS 211) and synthetic dye.',
    pediatricTip: 'Commercial jams are ~68% refined sugar with preservatives and artificial colors. Mash fresh ripe mango, banana, or stewed apple with cinnamon as a natural roti roll spread.',
    texture: 'Thick Sweet Gel',
    safetyWarning: 'Contains 68% refined sugar, preservatives (INS 211), and artificial food coloring.',
    isSafeForBaby: false,
    keywords: ['kissan jam', 'jam', 'mixed fruit jam', 'kissan']
  },
  {
    id: 'auto-boiled-egg',
    name: 'Soft Boiled Egg Yolk & Whole Egg Mash',
    brandName: 'Fresh Home Kitchen',
    category: 'Dairy & Fresh',
    ageBadge: '6+ Months (Well Cooked)',
    stageName: 'Choline & Complete Protein Superfood',
    score: '9.9 / 10',
    scoreNumber: 9.9,
    novaLevel: 'Level 1 (Whole Unprocessed Food)',
    calories: '78 kcal / egg',
    protein: '6.3 g',
    fat: '5.3 g',
    sodium: '62 mg',
    blwStatus: 'BLW Omelette Strips or Mashed Yolk',
    gumPinchTest: 'Passed (Soft mash with breastmilk/water)',
    ingredients: ['100% Fresh Pasture/Poultry Egg (Hard-Boiled)', 'Pinch Cumin & Black Pepper (Optional 8M+)'],
    allergyCheck: 'Contains Egg Albumin & Ovomucoid (Introduce early at 6M in small cooked amounts to reduce allergy risk).',
    pediatricTip: 'One of the richest sources of Choline (147mg) for baby brain development, plus Vitamin D, B12, and bioavailable protein. Always cook both yolk and white completely until firm.',
    texture: 'Creamy Mash or Soft Omelette Strips',
    isSafeForBaby: true,
    keywords: ['egg', 'boiled egg', 'egg yolk', 'omelette', 'anda']
  },
  {
    id: 'auto-avocado-mash',
    name: 'Fresh Ripe Avocado Mash (Butter Fruit)',
    brandName: 'Fresh Home Kitchen',
    category: 'Dairy & Fresh',
    ageBadge: '6+ Months',
    stageName: 'Stage 1 Brain-Healthy Lipid Puree',
    score: '10.0 / 10',
    scoreNumber: 10.0,
    novaLevel: 'Level 1 (Whole Unprocessed Food)',
    calories: '160 kcal / 100g',
    protein: '2.0 g',
    fat: '14.7 g',
    sodium: '7 mg',
    blwStatus: 'BLW Spear or Smooth Fork Mash',
    gumPinchTest: 'Passed (Melts between gums)',
    ingredients: ['100% Ripe Hass / Indian Butter Fruit (Avocado)'],
    allergyCheck: 'Naturally Hypoallergenic · Zero Dairy, Zero Gluten.',
    pediatricTip: 'Packed with monounsaturated oleic fatty acids, folate, and potassium that support rapid infant brain myelination without needing cooking.',
    texture: 'Buttery Smooth Mash',
    isSafeForBaby: true,
    keywords: ['avocado', 'butter fruit', 'avocado mash']
  },
  {
    id: 'auto-idli-sambar',
    name: 'Soft Steamed Rice Idli with Mild Dal Sambar',
    brandName: 'Traditional South Indian Home Meal',
    category: 'Home Recipe',
    ageBadge: '8+ Months',
    stageName: 'Fermented Probiotic Grain & Lentil Meal',
    score: '9.8 / 10',
    scoreNumber: 9.8,
    novaLevel: 'Level 1 (Fresh Home Cooked)',
    calories: '165 kcal / 2 idlis with sambar',
    protein: '5.8 g',
    fat: '2.4 g',
    sodium: '38 mg',
    blwStatus: 'Ideal BLW Finger Food (Soaked in Dal)',
    gumPinchTest: 'Passed (Fluffy steamed texture squashes easily)',
    ingredients: ['Fermented Parboiled Rice & Urad Dal Batter', 'Toor Dal (Pigeon Pea)', 'Carrots, Pumpkin & Drumstick Pulp', '1/2 tsp Desi Cow Ghee', 'Turmeric & Asafoetida (Hing)'],
    allergyCheck: 'Naturally Gluten-Free; contains trace dairy if topped with ghee.',
    pediatricTip: 'Fermentation increases Vitamin B-complex and iron bioavailability while breaking down phytic acid, making idli one of the easiest finger foods for babies to digest.',
    texture: 'Fluffy Spongy Steamed Cake',
    isSafeForBaby: true,
    keywords: ['idli', 'idli sambar', 'sambar', 'south indian', 'steamed idli']
  }
];

export const FOOD_AUTOCOMPLETE_CATALOG: AutocompleteFoodProduct[] = [
  ...INDIAN_BABY_FOODS.map((f: IndianBabyFood): AutocompleteFoodProduct => {
    const computedScoreStr = calculateScoreForFood(f);
    const computedScoreNum = parseFloat(computedScoreStr) || 9.5;
    const computedFat = calculateFatForFood(f);
    return {
      id: f.id,
      name: f.name,
      brandName: f.brandName || 'Homemade Indian Recipe',
      category: f.foodType === 'packaged' ? 'Baby Brand' : 'Home Recipe',
      ageBadge: f.ageBadge,
      stageName: f.stageName,
      score: computedScoreStr,
      scoreNumber: computedScoreNum,
      novaLevel: f.foodType === 'packaged' ? 'Level 3 (Fortified Baby Food)' : 'Level 1 (Fresh Home Cooked)',
      calories: f.calories,
      protein: f.protein,
      fat: computedFat,
      sodium: f.sodium,
      blwStatus: f.blwStatus,
      gumPinchTest: 'Passed (Age-appropriate pediatric texture)',
      ingredients: f.ingredients,
      allergyCheck: f.allergyCheck,
      pediatricTip: f.pediatricTip,
      texture: f.texture,
      isSafeForBaby: computedScoreNum >= 5.0,
      keywords: [
        f.name.toLowerCase(),
        (f.brandName || '').toLowerCase(),
        f.stageName.toLowerCase(),
        ...f.ingredients.map(i => i.toLowerCase())
      ]
    };
  }),
  ...EXTRA_COMMON_FOOD_PRODUCTS
];

export function searchAutocompleteFoods(query: string, limit: number = 8): AutocompleteFoodProduct[] {
  const q = query.toLowerCase().trim();
  if (!q) {
    // Default popular suggestions when search bar is focused empty
    return FOOD_AUTOCOMPLETE_CATALOG.slice(0, limit);
  }

  // Score matches so prefix matches on name or brand come first
  const scored = FOOD_AUTOCOMPLETE_CATALOG.map((item) => {
    const nameLower = item.name.toLowerCase();
    const brandLower = (item.brandName || '').toLowerCase();
    let rank = 0;

    if (nameLower.startsWith(q)) {
      rank = 100;
    } else if (brandLower.startsWith(q)) {
      rank = 90;
    } else if (nameLower.split(/[\s(),-]+/).some(w => w.startsWith(q))) {
      rank = 80;
    } else if (item.keywords.some(k => k.startsWith(q))) {
      rank = 70;
    } else if (nameLower.includes(q) || brandLower.includes(q)) {
      rank = 60;
    } else if (item.keywords.some(k => k.includes(q))) {
      rank = 40;
    }

    return { item, rank };
  })
    .filter(entry => entry.rank > 0)
    .sort((a, b) => b.rank - a.rank);

  return scored.slice(0, limit).map(s => s.item);
}

export function getInlineGhostCompletion(query: string, topMatch?: AutocompleteFoodProduct): string {
  const q = query.trim();
  if (!q || !topMatch) return '';
  const lowerQ = q.toLowerCase();
  const candidate = topMatch.name;
  if (candidate.toLowerCase().startsWith(lowerQ)) {
    return query + candidate.slice(q.length);
  }
  if (topMatch.brandName) {
    const fullWithBrand = `${topMatch.brandName} ${topMatch.name}`;
    if (fullWithBrand.toLowerCase().startsWith(lowerQ)) {
      return query + fullWithBrand.slice(q.length);
    }
  }
  return '';
}
