// Curated Store Products for Tricky Toddlers Baby Store
// 100% authentic, 1:1 unique baby product images with realistic Indian market pricing
// Zero duplicate images across products

import onesiesImg from '../assets/images/baby_onesies_set_1785854147891.jpg';
import babyMittensCapImg from '../assets/images/baby_mittens_cap_set_1786891497693.jpg';
import muslinSwaddlesImg from '../assets/images/muslin_swaddle_blankets_1786891519629.jpg';
import cribMattressImg from '../assets/images/crib_mattress_net_1785854171818.jpg';
import diaperRashCreamImg from '../assets/images/diaper_rash_cream_1785854186135.jpg';
import babyBathLotionImg from '../assets/images/baby_bath_lotion_set_1785854196463.jpg';
import babyHoodedTowelsImg from '../assets/images/baby_hooded_towels_1786891535971.jpg';
import strollerCarseatImg from '../assets/images/baby_stroller_carseat_1785854207841.jpg';
import feedingBottlesImg from '../assets/images/baby_feeding_bottles_1785854265991.jpg';
import babyCarrierWrapImg from '../assets/images/baby_carrier_wrap_1785854281925.jpg';
import diapersWipesImg from '../assets/images/baby_diapers_wipes_1785854296156.jpg';
import woodenShapeSorterImg from '../assets/images/wooden_shape_sorter_1786891553954.jpg';
import waterDoodleMatImg from '../assets/images/water_doodle_mat_1786891575357.jpg';
import siliconeSuctionPlateImg from '../assets/images/silicone_suction_plate_1786891595759.jpg';
import nutribandModularKitImg from '../assets/images/nutriband_full_kit_1789457874765.jpg';
import babyFingerBrushImg from '../assets/images/baby_finger_brush_1789455547409.jpg';
import babyKneeSocksImg from '../assets/images/baby_knee_socks_1789455566336.jpg';
import babySensoryCardImg from '../assets/images/baby_sensory_card_1789455589560.jpg';
import toddlerCutleryImg from '../assets/images/toddler_cutlery_1789455614797.jpg';
import babyFirstShoesImg from '../assets/images/baby_first_shoes_1789455636371.jpg';
import babySippyCupImg from '../assets/images/baby_sippy_cup_1789455659339.jpg';
import babyClothDiaperImg from '../assets/images/baby_cloth_diaper_1789455681500.jpg';
import babyPottyChairImg from '../assets/images/baby_potty_chair_1789455703811.jpg';
import babyHighChairImg from '../assets/images/baby_high_chair_1789455717565.jpg';
import babyWoodWalkerImg from '../assets/images/baby_wood_walker_1789455740471.jpg';
import babyStackRingsImg from '../assets/images/baby_stack_rings_1789455768371.jpg';
import babySoundLightImg from '../assets/images/baby_sound_light_1789455784868.jpg';

// Accessories & Hardware
import babyDiaperClipImg from '../assets/images/baby_diaper_clip_1789457013108.jpg';
import designedCottonStrapImg from '../assets/images/designed_cotton_strap_1790123130540.jpg';
import siliconeWatchBandImg from '../assets/images/silicone_watch_band_1790123118160.jpg';
import coinCellBatteryImg from '../assets/images/coin_cell_battery_1790123159048.jpg';
import twoSwappableStrapsImg from '../assets/images/two_swappable_straps_1790123145583.jpg';
import plasticKitBoxImg from '../assets/images/plastic_kit_box_real.jpg';

export interface Product {
  id: string;
  name: string;
  category: 'Clothing & Bedding' | 'Diapering & Bathing' | 'Feeding & Gear' | 'Toys & Play';
  ageRange: '0-6m' | '6-12m' | '12-24m' | '2-3y' | '3y+';
  supportedAges?: string[];
  ageLabel: string;
  price: number; // in INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  isBestseller?: boolean;
  colorOrSize?: string;
}

export const PRODUCTS: Product[] = [
  // 1. CLOTHING & BEDDING: Newborn Mittens & Cap Set
  {
    id: 'cb-mittens-cap',
    name: 'Pure Cotton Infant Mittens & Knot Beanie Cap Set (Set of 3)',
    category: 'Clothing & Bedding',
    ageRange: '0-6m',
    supportedAges: ['0-6m'],
    ageLabel: '0–6 Months',
    price: 119,
    originalPrice: 199,
    rating: 4.9,
    reviewsCount: 342,
    image: babyMittensCapImg,
    description: 'Ultra-breathable 100% mulmul cotton scratch mittens and stretch-soft beanie hat to protect delicate newborn skin and ears.',
    features: ['100% Breathable Cotton', 'Gentle elastic cuffs', 'Prevents face scratching', 'Hypoallergenic dyes'],
    inStock: true,
    isBestseller: true
  },

  // 2. CLOTHING & BEDDING: Organic Cotton Onesies
  {
    id: 'cb-onesies-set',
    name: 'Soft Front-Opening Organic Cotton Baby Onesies & Rompers (Pack of 3)',
    category: 'Clothing & Bedding',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–12 Months',
    price: 249,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 418,
    image: onesiesImg,
    description: 'Easy front-snap kimono rompers made with certified combed organic cotton for quick, fuss-free diaper changes without neck stretching.',
    features: ['100% Certified Organic Cotton', 'Nickel-free snaps', 'Fold-over feet cuffs', 'Flatlock anti-chafing seams'],
    inStock: true,
    isBestseller: true
  },

  // 3. CLOTHING & BEDDING: Muslin Swaddle Blankets
  {
    id: 'cb-muslin-swaddle',
    name: 'Breathable Pure Muslin Swaddles & Receiving Blankets (Set of 3, 110x110cm)',
    category: 'Clothing & Bedding',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–12 Months',
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 520,
    image: muslinSwaddlesImg,
    description: 'Extra-large, featherweight organic cotton muslin wraps that get softer with every wash. Perfect for swaddling, nursing covers, and stroller shades.',
    features: ['Featherlight Open Weave', 'Thermoregulating', 'Pre-washed super soft', 'Multipurpose nursery wrap'],
    inStock: true,
    isBestseller: true
  },

  // 4. CLOTHING & BEDDING: Crawling Knee Socks
  {
    id: 'cb-knee-socks',
    name: 'Anti-Slip Gripper Socks & Cushioned Crawling Knee Pads (4-Pack)',
    category: 'Clothing & Bedding',
    ageRange: '6-12m',
    supportedAges: ['6-12m', '12-24m'],
    ageLabel: '6–24 Months',
    price: 139,
    originalPrice: 229,
    rating: 4.7,
    reviewsCount: 260,
    image: babyKneeSocksImg,
    description: 'Padded silicone dot crawling protection pads and grip socks to shield tender infant knees from hard tile and marble floors.',
    features: ['High-density foam knee cushion', 'Silicone grip dots', 'Breathable mesh back', 'Stretches comfortably'],
    inStock: true
  },

  // 5. CLOTHING & BEDDING: First Walker Shoes
  {
    id: 'cb-first-shoes',
    name: 'Flexible Barefoot-Feel First-Walker Shoes with Non-Slip Rubber Sole',
    category: 'Clothing & Bedding',
    ageRange: '12-24m',
    supportedAges: ['12-24m', '2-3y'],
    ageLabel: '1–3 Years',
    price: 279,
    originalPrice: 449,
    rating: 4.8,
    reviewsCount: 184,
    image: babyFirstShoesImg,
    description: 'Pediatric orthopedic-approved wide toe box with ultra-flexible rubber soles that mimic healthy barefoot walking on indoor and outdoor floors.',
    features: ['Flexible zero-drop sole', 'Wide ergonomic toe box', 'Breathable cotton upper', 'Secure hook-and-loop strap'],
    inStock: true
  },

  // 6. CLOTHING & BEDDING: Crib Mattress & Net
  {
    id: 'cb-crib-mattress',
    name: 'Orthopedic Firm Crib Mattress with 360° Zip Mosquito Net & Washable Cover',
    category: 'Clothing & Bedding',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m'],
    ageLabel: '0–2 Years',
    price: 799,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 310,
    image: cribMattressImg,
    description: 'High-density firm support mattress recommended by pediatricians to prevent suffocation, featuring a full pop-up mesh mosquito net for peaceful sleep.',
    features: ['Firm AAP-recommended core', 'Full 360° mosquito protection', 'Waterproof inner membrane', 'Machine-washable cover'],
    inStock: true
  },

  // 7. DIAPERING & BATHING: Natural Diaper Rash Cream
  {
    id: 'db-rash-cream',
    name: 'Pediatric Zinc Oxide & Shea Butter Soothing Diaper Rash Barrier Cream (100g)',
    category: 'Diapering & Bathing',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m'],
    ageLabel: 'All Ages',
    price: 149,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 680,
    image: diaperRashCreamImg,
    description: 'Forms an instant moisture barrier with 15% non-nano zinc oxide and cold-pressed shea butter to soothe redness within 6 hours of application.',
    features: ['15% Mineral Zinc Oxide', 'Free from parabens & fragrance', 'Pediatrician tested', 'Hypoallergenic barrier'],
    inStock: true,
    isBestseller: true
  },

  // 8. DIAPERING & BATHING: Baby Bath & Lotion Set
  {
    id: 'db-bath-lotion',
    name: 'Tear-Free Head-to-Toe Gentle Baby Wash & Daily Hydrating Lotion Duo (200ml)',
    category: 'Diapering & Bathing',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y'],
    ageLabel: 'All Ages',
    price: 249,
    originalPrice: 380,
    rating: 4.8,
    reviewsCount: 495,
    image: babyBathLotionImg,
    description: 'Soap-free, tear-free pH 5.5 natural wash paired with oat-infused nourishing body lotion for sensitive Indian infant skin.',
    features: ['Tear-free clinical formula', 'pH balanced 5.5', 'Colloidal oat extract', 'Dermatologist verified'],
    inStock: true
  },

  // 9. DIAPERING & BATHING: Pure Water Diaper Wipes & Diapers Bundle
  {
    id: 'db-diapers-wipes',
    name: '99% Pure New-Born Water Wipes (72 Wipes) & Feather-Soft Diaper Pants Trial Pack',
    category: 'Diapering & Bathing',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–12 Months',
    price: 199,
    originalPrice: 320,
    rating: 4.9,
    reviewsCount: 820,
    image: diapersWipesImg,
    description: 'Unscented, 99% pure water plant-based wipes paired with ultra-thin breathable cottony diapers designed for 12-hour leak-proof sleep.',
    features: ['99% Pure Water formulation', '0% Alcohol or parabens', 'Bubble-bed waistband', 'Wetness indicator line'],
    inStock: true,
    isBestseller: true
  },

  // 10. DIAPERING & BATHING: Reusable Pocket Cloth Diaper
  {
    id: 'db-cloth-diaper',
    name: 'Eco-Friendly Reusable Pocket Cloth Diaper with 4-Layer Bamboo Charcoal Insert',
    category: 'Diapering & Bathing',
    ageRange: '6-12m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y'],
    ageLabel: '3m–3 Years (Adjustable)',
    price: 219,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 312,
    image: babyClothDiaperImg,
    description: 'Washable and reusable cloth nappy with adjustable snaps that grow with baby from 4kg to 15kg. Waterproof PUL outer prevents leaks on clothes.',
    features: ['Multi-snap size adjustments', 'Waterproof breathable PUL', 'Super absorbent charcoal pad', 'Zero plastic waste'],
    inStock: true
  },

  // 11. DIAPERING & BATHING: Organic Hooded Towel
  {
    id: 'db-hooded-towel',
    name: 'Ultra-Soft Bamboo Cotton Animal Hooded Baby Bath Towel (80x80cm)',
    category: 'Diapering & Bathing',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y'],
    ageLabel: '0–3 Years',
    price: 289,
    originalPrice: 450,
    rating: 4.9,
    reviewsCount: 390,
    image: babyHoodedTowelsImg,
    description: 'Thick 500 GSM natural bamboo fleece with an adorable hooded corner to keep baby warm, dry, and snuggly straight out of the tub.',
    features: ['500 GSM plush bamboo cotton', 'Dries 3x faster than cotton', 'Cozy ear hood design', 'Gentle on eczema skin'],
    inStock: true
  },

  // 12. DIAPERING & BATHING: Finger Toothbrush & Gum Massager
  {
    id: 'db-finger-brush',
    name: 'Food-Grade Silicone Finger Toothbrush with Teething Gum Bristles (Set of 2 with Case)',
    category: 'Diapering & Bathing',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m'],
    ageLabel: '0–18 Months',
    price: 89,
    originalPrice: 149,
    rating: 4.8,
    reviewsCount: 420,
    image: babyFingerBrushImg,
    description: 'Soft slip-on finger brush with micro-silicone bristles to gently clean milk coating on tongue and massage inflamed teething gums.',
    features: ['100% Food-Grade Silicone', 'Dual-sided cleaning bumps', 'BPA & Latex Free', 'Includes hygienic travel case'],
    inStock: true,
    isBestseller: true
  },

  // 13. DIAPERING & BATHING: Splash-Proof Potty Chair
  {
    id: 'db-potty-chair',
    name: 'Ergonomic Toddler Training Potty Chair with High Backrest & Splash Shield',
    category: 'Diapering & Bathing',
    ageRange: '12-24m',
    supportedAges: ['12-24m', '2-3y', '3y+'],
    ageLabel: '1–4 Years',
    price: 349,
    originalPrice: 599,
    rating: 4.8,
    reviewsCount: 275,
    image: babyPottyChairImg,
    description: 'Comfortable anatomic toddler potty with non-slip rubber base, high supportive backrest, and removable inner bowl for instant hygienic disposal.',
    features: ['Removable easy-clean basin', 'Raised splash guard', 'Non-skid silicone base', 'Sturdy ergonomic posture'],
    inStock: true
  },

  // 14. FEEDING & GEAR: Anti-Colic Feeding Bottles
  {
    id: 'fg-feeding-bottles',
    name: 'BPA-Free Anti-Colic Wide-Neck Baby Feeding Bottles (Twin Pack, 150ml & 240ml)',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–12 Months',
    price: 299,
    originalPrice: 480,
    rating: 4.8,
    reviewsCount: 512,
    image: feedingBottlesImg,
    description: 'Features a dual air-vent valve system that prevents vacuum build-up and air swallowing, reducing colic, hiccups, and gas after feeds.',
    features: ['Dual anti-colic ventilation', 'Natural breast-like latch nipple', 'Thermal borosilicate glass', 'Wide neck for easy cleaning'],
    inStock: true,
    isBestseller: true
  },

  // 15. FEEDING & GEAR: Silicone Suction Plate & Bib
  {
    id: 'fg-suction-plate',
    name: 'Self-Feeding Silicone Suction Compartment Plate with Deep Scoop Bib & Spoon',
    category: 'Feeding & Gear',
    ageRange: '6-12m',
    supportedAges: ['6-12m', '12-24m', '2-3y'],
    ageLabel: '6–36 Months',
    price: 249,
    originalPrice: 420,
    rating: 4.9,
    reviewsCount: 610,
    image: siliconeSuctionPlateImg,
    description: 'Unbreakable 100% silicone divided plate with ultra-strong suction bottom that locks onto high chair trays, paired with a crumb-catching roll-up bib.',
    features: ['Heavy-duty suction base', '3 Portion control dividers', 'Microwave & Dishwasher safe', 'Catches falling food bib'],
    inStock: true,
    isBestseller: true
  },

  // 16. FEEDING & GEAR: 360° Weighted Straw Sippy Cup
  {
    id: 'fg-sippy-cup',
    name: '360° Any-Angle Weighted Straw Leak-Proof Toddler Sippy Training Cup (240ml)',
    category: 'Feeding & Gear',
    ageRange: '6-12m',
    supportedAges: ['6-12m', '12-24m', '2-3y'],
    ageLabel: '6–36 Months',
    price: 179,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 388,
    image: babySippyCupImg,
    description: 'Allows baby to drink smoothly sitting, reclining, or lying down. Weighted gravity ball stays in liquid regardless of cup tilt with zero leakages.',
    features: ['360° Gravity weighted ball', 'Spill-proof flip lid', 'Ergonomic dual grab handles', 'Easy-sip bite valve'],
    inStock: true
  },

  // 17. FEEDING & GEAR: Self-Feeding Toddler Cutlery
  {
    id: 'fg-toddler-cutlery',
    name: 'Ergonomic Short-Handled Self-Feeding Toddler Spoon & Fork Duo with Choke Guard',
    category: 'Feeding & Gear',
    ageRange: '12-24m',
    supportedAges: ['6-12m', '12-24m', '2-3y'],
    ageLabel: '9m–3 Years',
    price: 139,
    originalPrice: 220,
    rating: 4.7,
    reviewsCount: 215,
    image: toddlerCutleryImg,
    description: 'Chubby textured handles designed specifically for clumsy infant palm grasps, featuring built-in safety shields that prevent over-insertion.',
    features: ['Ventilated anti-choke guard', 'Chubby non-slip grip handle', 'Rounded tines safe for gums', 'Encourages self-eating'],
    inStock: true
  },

  // 18. FEEDING & GEAR: Ergonomic Baby Carrier Wrap
  {
    id: 'fg-carrier-wrap',
    name: '4-in-1 Ergonomic M-Shape Baby Carrier Wrap with Lumbar Back Support',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y'],
    ageLabel: '0–3 Years (Up to 15kg)',
    price: 649,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 430,
    image: babyCarrierWrapImg,
    description: 'International Hip Dysplasia Institute certified ergonomic seat that supports natural frog-leg M position, taking pressure off parent shoulders and spine.',
    features: ['Hip-healthy M-position seat', 'Cushioned shoulder & waist straps', 'Breathable 3D air mesh', 'Front inward & outward facing'],
    inStock: true,
    isBestseller: true
  },

  // 19. FEEDING & GEAR: Adjustable Baby High Chair
  {
    id: 'fg-high-chair',
    name: 'Multi-Stage Convertible Baby High Chair with Removable Double Dining Tray',
    category: 'Feeding & Gear',
    ageRange: '6-12m',
    supportedAges: ['6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: '6m–5 Years',
    price: 899,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 195,
    image: babyHighChairImg,
    description: 'Pyramid structure safety high chair with 5-point harness that easily converts from infant high chair to toddler study chair and booster seat.',
    features: ['Convertible 3-in-1 design', '5-Point safety harness', 'Dishwasher safe double tray', 'Sturdy anti-tip steel legs'],
    inStock: true
  },

  // 20. FEEDING & GEAR: All-Terrain Stroller & Car Seat
  {
    id: 'fg-stroller-carseat',
    name: 'Compact One-Hand Fold All-Terrain Stroller with UV50+ Sun Canopy & Recline',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: '0–4 Years',
    price: 1899,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 260,
    image: strollerCarseatImg,
    description: 'Featherlight 5.8kg aircraft-grade aluminum frame with 360° swivel suspension wheels that glide smoothly over uneven sidewalks and Indian roads.',
    features: ['1-Second one-hand fold', 'Multi-position lay-flat recline', 'UV50+ extendable canopy', 'Roomy lower storage basket'],
    inStock: true
  },

  // 21. TOYS & PLAY: High-Contrast Visual Sensory Flashcards
  {
    id: 'tp-sensory-cards',
    name: 'Black & White High-Contrast Visual Stimulation Cards & Mirror (Set of 20)',
    category: 'Toys & Play',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–6 Months',
    price: 129,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 390,
    image: babySensoryCardImg,
    description: 'Designed by developmental optometrists to sharpen optic nerve development and tracking in infants during early tummy-time sessions.',
    features: ['Thick rounded matte cards', 'Non-toxic soybean oil ink', 'Double-sided visual patterns', 'Stimulates optic focus'],
    inStock: true,
    isBestseller: true
  },

  // 22. TOYS & PLAY: Rainbow Stacking Rings
  {
    id: 'tp-stack-rings',
    name: 'Textured Food-Grade Silicone Stacking Rainbow Rings & Teething Tower',
    category: 'Toys & Play',
    ageRange: '6-12m',
    supportedAges: ['6-12m', '12-24m', '2-3y'],
    ageLabel: '6–36 Months',
    price: 179,
    originalPrice: 280,
    rating: 4.8,
    reviewsCount: 345,
    image: babyStackRingsImg,
    description: 'Soft tactile rings with embossed numbers and animal shapes that babies can safely chew on while building hand-eye coordination.',
    features: ['100% chewable food-grade silicone', 'Embossed sensory textures', 'Develops spatial reasoning', 'Easy to sanitize'],
    inStock: true
  },

  // 23. TOYS & PLAY: Montessori Wooden Shape Sorter
  {
    id: 'tp-shape-sorter',
    name: 'Classic Montessori Solid Wood Shape Sorter & Stacking Geometry Cube',
    category: 'Toys & Play',
    ageRange: '12-24m',
    supportedAges: ['12-24m', '2-3y'],
    ageLabel: '1–3 Years',
    price: 249,
    originalPrice: 399,
    rating: 4.8,
    reviewsCount: 420,
    image: woodenShapeSorterImg,
    description: 'Non-toxic water-painted solid beechwood cube with 12 chunky shape blocks to introduce toddlers to spatial patterns and problem solving.',
    features: ['Natural beechwood with smooth edges', 'Non-toxic water-based paints', 'Chunky anti-swallow blocks', 'Refines pincer grasp'],
    inStock: true,
    isBestseller: true
  },

  // 24. TOYS & PLAY: Magic Water Doodle Mat
  {
    id: 'tp-water-doodle',
    name: 'Reusable Mess-Free Water Magic Doodle Drawing Mat with 2 Water Pens (80x60cm)',
    category: 'Toys & Play',
    ageRange: '2-3y',
    supportedAges: ['12-24m', '2-3y', '3y+'],
    ageLabel: '1.5–5 Years',
    price: 199,
    originalPrice: 350,
    rating: 4.9,
    reviewsCount: 510,
    image: waterDoodleMatImg,
    description: 'Draw using only pure tap water! Colors magically appear on contact and fade completely within 10 minutes for endless mess-free coloring.',
    features: ['100% Mess-free pure water drawing', 'Disappears automatically in 10m', 'Zero chemical ink or crayons', 'Foldable for travel'],
    inStock: true,
    isBestseller: true
  },

  // 25. TOYS & PLAY: Wooden Activity Push Walker
  {
    id: 'tp-wood-walker',
    name: 'Anti-Roll Wooden Activity Push Walker with Speed-Controlled Wheels & Clock',
    category: 'Toys & Play',
    ageRange: '12-24m',
    supportedAges: ['6-12m', '12-24m', '2-3y'],
    ageLabel: '9m–3 Years',
    price: 699,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 180,
    image: babyWoodWalkerImg,
    description: 'Sturdy wooden balance frame with rubber-trimmed wheels and speed-adjustment screws that prevent tipping over as toddlers take their first steps.',
    features: ['Rubberized non-scratch wheels', 'Adjustable wheel resistance', 'Built-in bead maze & gears', 'Weighted anti-tip base'],
    inStock: true
  },

  // 26. TOYS & PLAY: Nursery White Noise & Night Light
  {
    id: 'tp-sound-light',
    name: 'Rechargeable Pediatric White Noise Machine with Warm Ambient Night Light (16 Sounds)',
    category: 'Toys & Play',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: 'All Ages',
    price: 349,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 460,
    image: babySoundLightImg,
    description: 'Features gentle maternal heartbeat, rhythmic ocean waves, shusher sounds, and 2700K warm amber light that does not suppress melatonin.',
    features: ['16 Pediatric sound tracks', 'Warm circadian amber glow', 'Auto-off timer (30/60/90m)', 'Portable USB rechargeable'],
    inStock: true
  },

  // 27. NUTRIBAND & HARDWARE: Modular Kit
  {
    id: 'nb-modular-kit',
    name: 'NutriBand Modular Smart Sensor Pod + Dual Wearing Kit (Clip & Strap)',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: '0–8 Years',
    price: 1999,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 560,
    image: nutribandModularKitImg,
    description: 'Medical-grade modular sensor pod that snaps into an infant diaper clip (0–12m) or transfers to an active wrist strap (1–8y) with GPS and temperature sensors.',
    features: ['Diaper clip + Wrist strap included', 'Skin temp & stillness monitoring', 'Fall detection alerts', 'Rechargeable 48hr battery'],
    inStock: true,
    isBestseller: true
  },

  // 27A. NUTRIBAND ACCESSORIES: Ergonomic Diaper Clip (0-12m)
  {
    id: 'nb-diaper-clip',
    name: 'NutriBand™ Ergonomic Newborn & Infant Diaper Clip (0–12 Months)',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m'],
    ageLabel: '0–12 Months',
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewsCount: 168,
    image: babyDiaperClipImg,
    description: 'Featherlight 12g hypoallergenic clip docks the NutriBand sensor pod securely to baby diaper or onesie waistband for zero wrist pressure.',
    features: ['Featherlight 12g weight', 'Zero wrist pressure', 'Medical-grade hypoallergenic silicone', 'Secure non-pinch grip', 'Continuous tummy rise monitoring'],
    inStock: true,
    isBestseller: true
  },

  // 28. NUTRIBAND ACCESSORIES: Breathable Cotton Strap
  {
    id: 'nb-cotton-strap',
    name: 'NutriBand Breathable Organic Cotton Replacement Strap (Sensitive Skin, Size XS-L)',
    category: 'Clothing & Bedding',
    ageRange: '12-24m',
    supportedAges: ['6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: '1–10 Years',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    reviewsCount: 140,
    image: designedCottonStrapImg,
    description: 'Ultra-soft woven cotton strap tailored for toddlers prone to sweat rashes or eczema. Breathable weave with secure velcro clasp.',
    features: ['100% Sweat-absorbent cotton', 'Zero-pinch soft edge', 'Fully washable', 'Sizes from XS to L'],
    inStock: true
  },

  // 29. NUTRIBAND ACCESSORIES: Waterproof Silicone Strap
  {
    id: 'nb-silicone-strap',
    name: 'NutriBand™ Silicone Smart Band (10+ Years)',
    category: 'Diapering & Bathing',
    ageRange: '3y+',
    supportedAges: ['3y+'],
    ageLabel: '10+ Years',
    price: 189,
    originalPrice: 280,
    rating: 4.8,
    reviewsCount: 110,
    image: siliconeWatchBandImg,
    description: 'Durable active-styled silicone band with secure snap-in dock for modular sensor pod, designed for big kids and active sports.',
    features: ['IP67 Waterproof silicone', 'Sweat-channel ventilation', 'Tear-resistant durable core', 'Quick snap-in pod slot', 'Tailored for 10+ years'],
    inStock: true
  },

  // 30. NUTRIBAND ACCESSORIES: Dual Strap Mix Pack
  {
    id: 'nb-dual-straps',
    name: 'NutriBand Dual Strap Value Bundle (1x Organic Cotton + 1x Waterproof Silicone)',
    category: 'Clothing & Bedding',
    ageRange: '12-24m',
    supportedAges: ['12-24m', '2-3y', '3y+'],
    ageLabel: '1–8 Years',
    price: 299,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 205,
    image: twoSwappableStrapsImg,
    description: 'The complete day-to-night combo: soft breathable cotton strap for bedtime sleep tracking, plus durable silicone strap for daycare and outdoor playground.',
    features: ['Includes both strap styles', 'Save 25% vs single straps', 'Instant snap-swap design', 'Fits XS to L wrists'],
    inStock: true,
    isBestseller: true
  },

  // 31. NUTRIBAND ACCESSORIES: Hard Shell Travel Case
  {
    id: 'nb-travel-case',
    name: 'NutriBand Shockproof Hard-Shell Protective Travel & Storage Case',
    category: 'Toys & Play',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: 'All Ages',
    price: 129,
    originalPrice: 199,
    rating: 4.8,
    reviewsCount: 88,
    image: plasticKitBoxImg,
    description: 'Compact protective travel box with molded slots for the sensor pod, diaper clip, extra strap, and USB charging cable.',
    features: ['Shockproof EVA outer shell', 'Mesh accessory pocket', 'Secure smooth zipper', 'Fits in diaper bags easily'],
    inStock: true
  },

  // 32. NUTRIBAND ACCESSORIES: Spare Quick-Charge Cable & Cell
  {
    id: 'nb-spare-battery',
    name: 'NutriBand USB Magnetic Fast Charger & Spare Battery Maintenance Pack',
    category: 'Feeding & Gear',
    ageRange: '0-6m',
    supportedAges: ['0-6m', '6-12m', '12-24m', '2-3y', '3y+'],
    ageLabel: 'All Ages',
    price: 149,
    originalPrice: 250,
    rating: 4.9,
    reviewsCount: 130,
    image: coinCellBatteryImg,
    description: 'Replacement high-speed magnetic charging dock cable with gold-plated pogo pins plus backup battery cell for uninterrupted child monitoring.',
    features: ['Magnetic snap-on connection', 'Short-circuit surge guard', 'Charges 100% in 30 minutes', 'High-conductivity copper core'],
    inStock: true
  }
];
