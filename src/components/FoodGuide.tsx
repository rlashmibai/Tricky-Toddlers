import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import { playSound } from '../lib/sounds';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  ChefHat, 
  Clock, 
  Flame, 
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  Heart,
  Info,
  Search, 
  Baby, 
  ArrowRight, 
  ChevronRight, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  BookOpen,
  Apple,
  Eye,
  Languages,
  Loader2,
  ExternalLink,
  Camera,
  Filter,
  Sun,
  Moon,
  Sunrise,
  Coffee,
  UtensilsCrossed,
  MapPin,
  ArrowLeft,
  Calendar,
  History,
  Copy,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Recipe, AgeGroupData, ageStagesData, MealCategory, getRecipeCategory } from '../data/foodGuideData';
import { getRecipeNutrientDetails } from '../lib/recipeNutrition';
import { GeneratedRecipe, AIRecipeBatchRecord, getSavedRecipeHistory, saveRecipeBatch } from '../lib/aiRecipeHistory';
import { AIRecipeResultsView } from './AIRecipeResultsView';

// Regional affinity mapper based on Indian State selected in Profile settings
export const getStateRegion = (stateName: string): 'South' | 'North' | 'West' | 'East' => {
  const s = (stateName || '').toLowerCase();
  if (s.includes('karnataka') || s.includes('tamil') || s.includes('kerala') || s.includes('andhra') || s.includes('telangana')) {
    return 'South';
  }
  if (s.includes('maharashtra') || s.includes('gujarat') || s.includes('goa') || s.includes('rajasthan')) {
    return 'West';
  }
  if (s.includes('delhi') || s.includes('punjab') || s.includes('haryana') || s.includes('uttar pradesh') || s.includes('uttarakhand') || s.includes('himachal') || s.includes('jammu') || s.includes('kashmir') || s.includes('bihar')) {
    return 'North';
  }
  if (s.includes('bengal') || s.includes('odisha') || s.includes('orissa') || s.includes('assam') || s.includes('jharkhand') || s.includes('tripura') || s.includes('manipur') || s.includes('meghalaya') || s.includes('mizoram') || s.includes('nagaland') || s.includes('arunachal') || s.includes('sikkim')) {
    return 'East';
  }
  return 'South';
};

// Local translation dictionary specifically for Solid Food Guide UI elements
const localT: Record<string, Record<string, string>> = {
  en: {
    solidFoodBadge: 'Smart Guide to First Foods at Every Age',
    solidFoodTitle: 'AI NutriChef: Your Kitchen Assistant',
    solidFoodDesc: '250+ Age-Matched Indian Recipes & Custom Ingredient Cooker. Blends scientific pediatric nutrition with cooking ease.',
    selectAgeGroup: 'Select Stage Guidelines',
    readinessMilestones: 'Developmental Eating Milestones',
    feedingGuidelines: 'Feeding Guidelines & Schedule',
    recipesHeader: 'Nutritious Recipes to Choose',
    cookTime: 'Cook Time',
    prepTime: 'Prep Time',
    ingredients: 'Ingredients',
    instructions: 'Instructions',
    nutritionBenefits: 'Why It\'s Great',
    safetyWarning: 'Safety & Allergy Warning',
    closeRecipe: 'Back to Recipes',
    searchPlaceholder: 'Search recipes (e.g. apple, khichdi, ragi)...',
    allRecipes: 'All Recipes',
    aiCustomizerTitle: 'AI Recipe Maker: Custom Ingredient Cooker',
    aiCustomizerDesc: '250+ Age-Matched Indian Recipes & Custom Ingredient Cooker. Blends scientific pediatric nutrition with cooking ease for all ages.',
    childAgeLabel: 'Child Age (in Years)',
    ingredientsLabel: 'Ingredients you have (e.g., banana, rice, carrot)',
    dietaryLabel: 'Dietary Preferences / Restrictions',
    noRestrictions: 'None (Regular)',
    vegetarian: 'Vegetarian',
    vegan: 'Non - Vegetarian ( eggs, meat, fish etc)',
    allergyAlert: 'No Egg / No Dairy',
    generateButton: 'Generate Recipe with AI',
    customRecipeResult: 'Your Customized AI Recipe',
    translateRecipe: 'Translate this recipe to',
    translating: 'Translating with AI...',
    disclaimer: 'Always consult your pediatrician before introducing new foods to your baby.'
  },
  hi: {
    solidFoodBadge: 'हर उम्र के लिए पहले आहार की स्मार्ट गाइड',
    solidFoodTitle: 'सॉलिड फूड गाइड (ठोस आहार)',
    solidFoodDesc: 'बच्चों के विकास के हर चरण के लिए तैयार की गई फीडिंग गाइड और पौष्टिक व्यंजन।',
    selectAgeGroup: 'आयु चुनें',
    readinessMilestones: 'विकास के खाने से जुड़े मील के पत्थर',
    feedingGuidelines: 'आहार दिशानिर्देश और समय सारिणी',
    recipesHeader: 'चुनने के लिए पौष्टिक व्यंजन',
    cookTime: 'पकाने का समय',
    prepTime: 'तैयारी का समय',
    ingredients: 'सामग्री',
    instructions: 'विधि (निर्देश)',
    nutritionBenefits: 'यह क्यों फायदेमंद है',
    safetyWarning: 'सुरक्षा और एलर्जी चेतावनी',
    closeRecipe: 'व्यंजनों पर वापस जाएं',
    searchPlaceholder: 'व्यंजन खोजें (उदा. सेब, खिचड़ी, रागी)...',
    allRecipes: 'सभी व्यंजन',
    aiCustomizerTitle: 'कस्टम एआई बेबी रेसिपी मेकर',
    aiCustomizerDesc: 'अपनी रसोई में मौजूद सामग्रियों के आधार पर अपनी चुनी हुई भाषा में एक सुरक्षित, पौष्टिक और व्यक्तिगत रेसिपी तैयार करें।',
    childAgeLabel: 'बच्चे की उम्र (वर्षों में)',
    ingredientsLabel: 'सामग्रियां जो आपके पास हैं (जैसे, केला, चावल, गाजर)',
    dietaryLabel: 'आहार प्राथमिकताएं / प्रतिबंध',
    noRestrictions: 'कोई नहीं (नियमित)',
    vegetarian: 'शाकाहारी',
    vegan: 'वेगनिज़्म (Vegan)',
    allergyAlert: 'बिना अंडा / बिना डेयरी',
    generateButton: 'एआई के साथ रेसिपी बनाएं',
    customRecipeResult: 'आपकी कस्टमाइज्ड एआई रेसिपी',
    translateRecipe: 'इस रेसिपी का अनुवाद करें',
    translating: 'एआई के साथ अनुवाद हो रहा है...',
    disclaimer: 'अपने बच्चे को कोई भी नया आहार देने से पहले हमेशा अपने बाल रोग विशेषज्ञ से सलाह लें।'
  },
  ta: {
    solidFoodBadge: 'ஒவ்வொரு வயதுக்குமான முதல் உணவுகளுக்கான ஸ்மார்ட் வழிகாட்டி',
    solidFoodTitle: 'திட உணவு வழிகாட்டி (Solid Food Guide)',
    solidFoodDesc: 'குழந்தைகளின் ஒவ்வொரு வளர்ச்சி நிலைக்கும் ஏற்ற உணவு வழிகாட்டுதல்கள் மற்றும் சத்தான உணவுகள்.',
    selectAgeGroup: 'வயதை தேர்ந்தெடுக்கவும்',
    readinessMilestones: 'உணவு உட்கொள்ளும் வளர்ச்சி மைல்கற்கள்',
    feedingGuidelines: 'உணவளிக்கும் வழிகாட்டுதல்கள் & அட்டவணை',
    recipesHeader: 'சத்தான சமையல் தேர்வுகள்',
    cookTime: 'சமைக்கும் நேரம்',
    prepTime: 'தயாரிப்பு நேரம்',
    ingredients: 'தேவையான பொருட்கள்',
    instructions: 'செய்முறை விளக்கம்',
    nutritionBenefits: 'ஏன் இது சிறந்தது',
    safetyWarning: 'பாதுகாப்பு & ஒவ்வாமை எச்சரிக்கை',
    closeRecipe: 'சமையல் குறிப்புகளுக்குத் திரும்பு',
    searchPlaceholder: 'தேடவும் (எ.கா. ஆப்பிள், கிச்சடி, ராகி)...',
    allRecipes: 'அனைத்து உணவுகள்',
    aiCustomizerTitle: 'AI பேபி ரெசிபி மேக்கர்',
    aiCustomizerDesc: 'உங்கள் சமையலறையில் உள்ள பொருட்களைக் கொண்டு உங்கள் சொந்த மொழியில் பாதுகாப்பான, சத்தான உணவை AI மூலம் தயாரிக்கவும்.',
    childAgeLabel: 'குழந்தையின் வயது (ஆண்டுகளில்)',
    ingredientsLabel: 'உங்களிடம் உள்ள பொருட்கள் (எ.கா. வாழைப்பழம், அரிசி, கேரட்)',
    dietaryLabel: 'உணவு முறைகள் / கட்டுப்பாடுகள்',
    noRestrictions: 'ஏதுமில்லை (சாதாரண)',
    vegetarian: 'சைவம்',
    vegan: 'முழு சைவம் (Vegan)',
    allergyAlert: 'முட்டை இல்லை / பால் பொருட்கள் இல்லை',
    generateButton: 'AI மூலம் உணவு தயாரிக்கவும்',
    customRecipeResult: 'உங்களின் பிரத்தியேக AI சமையல் குறிப்பு',
    translateRecipe: 'மொழிமாற்றம் செய்க',
    translating: 'மொழிபெயர்க்கப்படுகிறது...',
    disclaimer: 'குழந்தைக்கு புதிய உணவுகளை அறிமுகப்படுத்துவதற்கு முன் எப்போதும் உங்கள் மருத்துவரை அணுகவும்.'
  },
  te: {
    solidFoodTitle: 'ఘన ఆహార మార్గదర్శి',
    solidFoodDesc: '0 నుండి 3 సంవత్సరాల వయస్సు గల శిశువులు మరియు పిల్లల కోసం అభివృద్ధికి సరిపోయే ఆహార గైడ్‌లు మరియు పౌష్టిక వంటకాలు.',
    selectAgeGroup: 'వయస్సు దశను ఎంచుకోండి',
    readinessMilestones: 'ఆహారం తినే అభివృద్ధి మైలురాళ్లు',
    feedingGuidelines: 'ఫీడింగ్ మార్గదర్శకాలు & షెడ్యూల్',
    recipesHeader: 'ఎంచుకోవడానికి పౌష్టిక వంటకాలు',
    cookTime: 'వండే సమయం',
    prepTime: 'తయారీ సమయం',
    ingredients: 'కావలసిన పదార్థాలు',
    instructions: 'తయారీ విధానం',
    nutritionBenefits: 'ఇది ఎందుకు మంచిది',
    safetyWarning: 'భద్రత & అలెర్జీ హెచ్చరిక',
    closeRecipe: 'మళ్లీ వంటకాలకు వెళ్ళండి',
    searchPlaceholder: 'వంటకాలను వెతకండి (ఉదా. ఆపిల్, కిచిడి, రాగి)...',
    allRecipes: 'అన్ని వంటకాలు',
    aiCustomizerTitle: 'AI బేబీ రెసిపీ మేకర్',
    aiCustomizerDesc: 'మీ ఇంట్లో ఉన్న పదార్థాలతో మీ సొంత భాషలో సురక్షితమైన, పోషకమైన వంటకాన్ని AI ద్వారా సృష్టించండి.',
    childAgeLabel: 'పిల్లల వయస్సు (సంవత్సరాల్లో)',
    ingredientsLabel: 'మీ దగ్గర ఉన్న పదార్థాలు (ఉదా. అరటిపండు, బియ్యం, క్యారెట్)',
    dietaryLabel: 'ఆహార ప్రాధాన్యతలు / పరిమితులు',
    noRestrictions: 'ఏమీ లేదు',
    vegetarian: 'శాకాహారం',
    vegan: 'వీగన్',
    allergyAlert: 'గుడ్డు లేదు / డైరీ లేదు',
    generateButton: 'AI తో రెసిపీ సృష్టించు',
    customRecipeResult: 'మీ అనుకూలీకరించిన AI రెసిపీ',
    translateRecipe: 'ఈ రెసిపీని అనువదించండి',
    translating: 'AI అనువదిస్తోంది...',
    disclaimer: 'మీ మగవుకు కొత్త ఆహారాలు పరిచయం చేసే ముందు ఎల్లప్పుడూ పీడియాట్రీషియన్‌ను సంప్రదించండి.'
  },
  mr: {
    solidFoodTitle: 'घण आहार मार्गदर्शक',
    solidFoodDesc: '० ते ३ वर्षे वयाच्या लहान मुलांसाठी त्यांच्या विकासाला साजेसे फिडिंग मार्गदर्शक आणि पौष्टिक पाककृती.',
    selectAgeGroup: 'वयोगट निवडा',
    readinessMilestones: 'खाण्याशी संबंधित विकासाचे टप्पे',
    feedingGuidelines: 'आहार मार्गदर्शक तत्त्वे आणि वेळापत्रक',
    recipesHeader: 'निवडण्यासाठी पौष्टिक पाककृती',
    cookTime: 'शिजविण्याची वेळ',
    prepTime: 'तयारीची वेळ',
    ingredients: 'साहित्य',
    instructions: 'कृती (मार्गदर्शन)',
    nutritionBenefits: 'हे का उत्तम आहे',
    safetyWarning: 'सुरक्षितता आणि ॲलर्जी चेतावणी',
    closeRecipe: 'पाककृतींकडे परत जा',
    searchPlaceholder: 'पाककृती शोधा (उदा. सफरचंद, खिचडी, नाचणी)...',
    allRecipes: 'सर्व पाककृती',
    aiCustomizerTitle: 'एआय बेबी रेसिपी मेकर',
    aiCustomizerDesc: 'तुमच्या स्वयंपाकघरातील साहित्याचा वापर करून तुमच्या आवडत्या भाषेत एक सुरक्षित आणि पौष्टिक पाककृती तयार करा.',
    childAgeLabel: 'बाळाचे वय (वर्षांमध्ये)',
    ingredientsLabel: 'तुमच्याकडे असलेले साहित्य (उदा. केळे, तांदूळ, गाजर)',
    dietaryLabel: 'आहार प्राधान्ये / निर्बंध',
    noRestrictions: 'काहीही नाही (नियमित)',
    vegetarian: 'शाकाहारी',
    vegan: 'व्हेगन (Vegan)',
    allergyAlert: 'अंडी विरहित / दुग्धजन्य पदार्थ विरहित',
    generateButton: 'एआय सह रेसिपी बनवा',
    customRecipeResult: 'तुमची कस्टमाइज्ड एआय रेसिपी',
    translateRecipe: 'अनुवाद करा',
    translating: 'एआय द्वारे भाषांतर होत आहे...',
    disclaimer: 'बाळाला कोणताही नवीन आहार देण्यापूर्वी नेहमी आपल्या बालरोगतज्ज्ञांचा सल्ला घ्या.'
  },
  bn: {
    solidFoodTitle: 'কঠিন খাদ্য নির্দেশিকা',
    solidFoodDesc: '০ থেকে ৩ বছর বয়সী শিশুদের জন্য বিকাশ অনুযায়ী পুষ্টিকর খাবারের গাইড এবং সহজ রেসিপি।',
    selectAgeGroup: 'বয়সের পর্যায় নির্বাচন করুন',
    readinessMilestones: 'খাবার খাওয়ার বিকাশ মাইলফলক',
    feedingGuidelines: 'খাওয়ানোর নির্দেশিকা এবং সময়সূচী',
    recipesHeader: 'পছন্দ করার জন্য পুষ্টিকর রেসিপি',
    cookTime: 'রান্নার সময়',
    prepTime: 'প্রস্তুতির সময়',
    ingredients: 'উপাদান সমূহ',
    instructions: 'প্রস্তুত প্রণালী',
    nutritionBenefits: 'কেন এটি ভালো',
    safetyWarning: 'সুরক্ষা এবং অ্যালার্জি সতর্কতা',
    closeRecipe: 'রেসিপিতে ফিরে যান',
    searchPlaceholder: 'রেসিপি খুঁজুন (যেমন আপেল, খিচুড়ি, রাগি)...',
    allRecipes: 'সব রেসিপি',
    aiCustomizerTitle: 'এআই বেবি রেসিপি মেকার',
    aiCustomizerDesc: 'আপনার রান্নাঘরে থাকা উপাদানগুলির উপর ভিত্তি করে আপনার নির্বাচিত ভাষায় একটি নিরাপদ, পুষ্টিকর এবং ব্যক্তিগত রেসিপি তৈরি করুন।',
    childAgeLabel: 'শিশুর বয়স (বছরে)',
    ingredientsLabel: 'আপনার কাছে থাকা উপাদান (যেমন কলা, চাল, গাজর)',
    dietaryLabel: 'খাদ্য পছন্দ / সীমাবদ্ধতা',
    noRestrictions: 'কোনোটিই নয়',
    vegetarian: 'নিরামিষ',
    vegan: 'ভেগান',
    allergyAlert: 'ডিম ছাড়া / দুগ্ধজাত ছাড়া',
    generateButton: 'এআই দিয়ে রেসিপি বানান',
    customRecipeResult: 'আপনার কাস্টমাইজড এআই রেসিপি',
    translateRecipe: 'অনুবাদ করুন',
    translating: 'এআই অনুবাদ করছে...',
    disclaimer: 'শিশুর সাথে নতুন খাবার পরিচিত করার আগে সর্বদা শিশু বিশেষজ্ঞের পরামর্শ নিন।'
  },
  kn: {
    solidFoodTitle: 'ಘನ ಆಹಾರ ಮಾರ್ಗದರ್ಶಿ',
    solidFoodDesc: '0 ರಿಂದ 3 ವರ್ಷದೊಳಗಿನ ಮಕ್ಕಳಿಗೆ ಸೂಕ್ತವಾದ ಪೌಷ್ಟಿಕ ಆಹಾರ ಪದ್ಧತಿಗಳು ಮತ್ತು ಆಯ್ದ ವೀಡಿಯೋಗಳು ಹಾಗೂ ಅಡುಗೆ ವಿವರಣೆಗಳು.',
    selectAgeGroup: 'ವಯಸ್ಸಿನ ಗುಂಪು ಆಯ್ಕೆಮಾಡಿ',
    readinessMilestones: 'ಆಹಾರ ಸೇವನೆಯ ಬೆಳವಣಿಗೆ ಮೈಲಿಗಲ್ಲುಗಳು',
    feedingGuidelines: 'ಆಹಾರ ಮಾರ್ಗಸೂಚಿಗಳು ಮತ್ತು ವೇಳಾಪಟ್ಟಿ',
    recipesHeader: 'ಆಯ್ಕೆ ಮಾಡಲು ಪೌಷ್ಟಿಕ ಅಡುಗೆಗಳು',
    cookTime: 'ಅಡುಗೆ ಸಮಯ',
    prepTime: 'ತಯಾರಿ ಸಮಯ',
    ingredients: 'ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು',
    instructions: 'ತಯಾರಿಸುವ ವಿಧಾನ',
    nutritionBenefits: 'ಏಕೆ ಇದು ಅತ್ಯುತ್ತಮ',
    safetyWarning: 'ಸುರಕ್ಷತೆ ಮತ್ತು ಅಲರ್ಜಿ ಎಚ್ಚರಿಕೆ',
    closeRecipe: 'ಅಡುಗೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ',
    searchPlaceholder: 'ಅಡುಗೆ ಹುಡುಕಿ (ಉದಾ. ಸೇಬು, ಕಿಚಡಿ, ರಾಗಿ)...',
    allRecipes: 'ಎಲ್ಲಾ ಅಡುಗೆಗಳು',
    aiCustomizerTitle: 'AI ಬೇಬಿ ರೆಸಿಪಿ ಮೇಕರ್',
    aiCustomizerDesc: 'ನಿಮ್ಮ ಅಡುಗೆಮನೆಯಲ್ಲಿರುವ ಸಾಮಗ್ರಿಗಳನ್ನು ಬಳಸಿ ನಿಮ್ಮ ಸ್ವಂತ ಭಾಷೆಯಲ್ಲಿ ಸುರಕ್ಷಿತ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶದ ರೆಸಿಪಿ ಸೃಷ್ಟಿಸಿ.',
    childAgeLabel: 'ಮಗುವಿನ ವಯಸ್ಸು (ವರ್ಷಗಳಲ್ಲಿ)',
    ingredientsLabel: 'ನಿಮ್ಮ ಬಳಿಯಿರುವ ಸಾಮಗ್ರಿಗಳು (ಉದಾ. ಬಾಳೆಹಣ್ಣು, ಅಕ್ಕಿ, ಕ್ಯಾರೆಟ್)',
    dietaryLabel: 'ಆಹಾರ ಆದ್ಯತೆಗಳು / ನಿರ್ಬಂಧಗಳು',
    noRestrictions: 'ಯಾವುದೂ ಇಲ್ಲ',
    vegetarian: 'ಸಸ್ಯಾಹಾರ',
    vegan: 'ವೀವ್ಹನ್ (Vegan)',
    allergyAlert: 'ಮೊಟ್ಟೆಯಿಲ್ಲದ / ಹಾಲಿನ ಉತ್ಪನ್ನಗಳಿಲ್ಲದ',
    generateButton: 'AI ಮೂಲಕ ರೆಸಿಪಿ ತಯಾರಿಸಿ',
    customRecipeResult: 'ನಿಮ್ಮ ಕಸ್ಟಮೈಸ್ಡ್ AI ರೆಸಿಪಿ',
    translateRecipe: 'ಅನುವಾದಿಸಿ',
    translating: 'AI ಅನುವಾದಿಸುತ್ತಿದೆ...',
    disclaimer: 'ಮಗುವಿಗೆ ಹೊಸ ಆಹಾರವನ್ನು ಪರಿಚಯಿಸುವ ಮುನ್ನ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
  },
  gu: {
    solidFoodTitle: 'ઘન આહાર માર્ગદર્શિકા',
    solidFoodDesc: '૦ થી ૩ વર્ષના બાળકો માટે તેમના વિકાસ અનુસાર આહાર માર્ગદર્શિકા અને પૌષ્ટિક વાનગીઓ.',
    selectAgeGroup: 'ઉંમરનો તબક્કો પસંદ કરો',
    readinessMilestones: 'ખાવાની આદતોના વિકાસ માઈલસ્ટોન',
    feedingGuidelines: 'આહાર માર્ગદર્શિકા અને સમયપત્રક',
    recipesHeader: 'પસંદ કરવા માટે પૌષ્ટિક વાનગીઓ',
    cookTime: 'રાંધવાનો સમય',
    prepTime: 'તૈયારીનો સમય',
    ingredients: 'સામગ્રી',
    instructions: 'બનાવવાની રીત (સૂચનાઓ)',
    nutritionBenefits: 'આ કેમ ફાયદાકારક છે',
    safetyWarning: 'સુરક્ષા અને એલર્જી ચેતવણી',
    closeRecipe: 'વાનગીઓ પર પાછા જાઓ',
    searchPlaceholder: 'વાનગી શોધો (દા.ત. સફરજન, ખીચડી, રાગી)...',
    allRecipes: 'બધી વાનगीઓ',
    aiCustomizerTitle: 'AI બેબી રેસીપી મેકર',
    aiCustomizerDesc: 'તમારા રસોડામાં રહેલી સામગ્રીમાંથી તમારી મનપસંદ ભાષામાં જાદુઈ પોષણયુક્ત વાનગી બનાવો.',
    childAgeLabel: 'બાળકની ઉંમર (વર્ષમાં)',
    ingredientsLabel: 'તમારી પાસેની સામગ્રી (દા.ત., કેળું, ચોખા, ગાજર)',
    dietaryLabel: 'આહાર પસંદગીઓ / પ્રતિબંધો',
    noRestrictions: 'કોઈ નહીં (સામાન્ય)',
    vegetarian: 'શાકાહારી',
    vegan: 'વેગન (Vegan)',
    allergyAlert: 'ઇંડા વિના / ડેરી વગર',
    generateButton: 'AI સાથે વાનગી બનાવો',
    customRecipeResult: 'તમારી કસ્ટમાઇઝ્ડ AI રેસીપી',
    translateRecipe: 'અનુવાદ કરો',
    translating: 'AI દ્વારા અનુવાદ થઈ રહ્યો છે...',
    disclaimer: 'બાળકને કોઈપણ નવી વાનગી આપતા પહેલા હંમેશા પીડિયાટ્રિશિયનની સલાહ લો.'
  },
  ml: {
    solidFoodTitle: 'ഖരഭക്ഷണ സഹായി',
    solidFoodDesc: '0 മുതൽ 3 വയസ്സ് വരെയുള്ള കുട്ടികൾക്കായുള്ള വികസനാനുസൃതമായ ഭക്ഷണക്രമങ്ങളും പോഷകസമൃദ്ധമായ പാചകവിധികൾ.',
    selectAgeGroup: 'പ്രായപരിധി തിരഞ്ഞെടുക്കുക',
    readinessMilestones: 'ഭക്ഷണം കഴിക്കുന്നതിലെ പ്രധാന മാറ്റങ്ങൾ',
    feedingGuidelines: 'ഭക്ഷണക്രമങ്ങളും നിർദ്ദേശങ്ങളും',
    recipesHeader: 'തിരഞ്ഞെടുക്കാവുന്ന പോഷകാഹാര പാചകങ്ങൾ',
    cookTime: 'പാചക സമയം',
    prepTime: 'തയ്യാറെടുപ്പ് സമയം',
    ingredients: 'ആവശ്യമായ സാധനങ്ങൾ',
    instructions: 'തയ്യാറാക്കുന്ന വിധം',
    nutritionBenefits: 'ഇതിന്റെ ഗുണങ്ങൾ',
    safetyWarning: 'സുരക്ഷയും അലർജി മുന്നറിയിപ്പും',
    closeRecipe: 'തിരികെ പാചകവിശേഷങ്ങളിലേക്ക്',
    searchPlaceholder: 'തിരയുക (ഉദാ: ആപ്പിൾ, കിചടി, റാഗി)...',
    allRecipes: 'എല്ലാ വിഭവങ്ങളും',
    aiCustomizerTitle: 'AI ബേബി റെസിപ്പി മേക്കർ',
    aiCustomizerDesc: 'നിങ്ങളുടെ അടുക്കളയിലുള്ള സാധനങ്ങൾ ഉപയോഗിച്ച് നിങ്ങളുടെ സ്വന്തം ഭാഷയിൽ സുരക്ഷിതമായ ഒരു കുട്ടിവിഭവം തത്സമയം ഉണ്ടാക്കുക.',
    childAgeLabel: 'കുട്ടിയുടെ പ്രായം (വർഷത്തിൽ)',
    ingredientsLabel: 'കൈവശമുള്ള സാധനങ്ങൾ (ഉദാ: പഴം, അരി, കാരറ്റ്)',
    dietaryLabel: 'ഭക്ഷണ ശീലങ്ങൾ / അലർജി',
    noRestrictions: 'ഒന്നുമില്ല (സാധാരണ)',
    vegetarian: 'വെജിറ്റേറിയൻ',
    vegan: 'വീഗൻ',
    allergyAlert: 'മുട്ടയില്ലാത്തത് / പാലുൽപ്പന്നങ്ങൾ ഇല്ലാത്തത്',
    generateButton: 'AI ഉപയോഗിച്ച് റെസിപ്പി ഉണ്ടാക്കൂ',
    customRecipeResult: 'നിങ്ങളുടെ സ്വന്തം AI റെസിപ്പി',
    translateRecipe: 'ഭാഷ മാറ്റുക',
    translating: 'പരിഭാഷപ്പെടുത്തുന്നു...',
    disclaimer: 'കുട്ടിക്ക് പുതിയ ഭക്ഷണങ്ങൾ നൽകുന്നതിന് മുൻപ് എപ്പോഴും ശിശുരോഗ വിദഗ്ദ്ധന്റെ അഭിപ്രായം തേടുക.'
  },
  pa: {
    solidFoodTitle: 'ਠੋਸ ਖੁਰਾਕ ਗਾਈਡ',
    solidFoodDesc: '0 ਤੋਂ 3 ਸਾਲ ਦੀ ਉਮਰ ਦੇ ਬੱਚਿਆਂ ਲਈ ਵਿਕਾਸ ਦੇ ਅਨੁਸਾਰ ਤਿਆਰ ਕੀਤੇ ਫੀਡਿੰਗ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਅਤੇ ਪੌਸ਼ਟਿਕ ਪਕਵਾਨ।',
    selectAgeGroup: 'ਉਮਰ ਸਮੂਹ ਚੁਣੋ',
    readinessMilestones: 'ਖਾਣ ਨਾਲ ਸਬੰਧਤ ਵਿਕਾਸ ਦੇ ਮੀਲ ਪੱਥਰ',
    feedingGuidelines: 'ਖੁਰਾਕ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਅਤੇ ਸਮਾਂ ਸਾਰਣੀ',
    recipesHeader: 'ਚੁਣਨ ਲਈ ਪੌਸ਼ਟਿਕ ਪਕਵਾਨ',
    cookTime: 'ਪਕਾਉਣ ਦਾ ਸਮਾਂ',
    prepTime: 'ਤਿਆਰੀ ਦਾ ਸਮਾਂ',
    ingredients: 'ਸਮੱਗਰੀ',
    instructions: 'ਬਣਾਉਣ ਦੀ ਵਿਧੀ (ਨਿਰਦੇਸ਼)',
    nutritionBenefits: 'ਇਹ ਕਿਉਂ ਫਾਇਦੇਮੰਦ ਹੈ',
    safetyWarning: 'ਸੁਰੱਖਿਆ ਅਤੇ ਐਲਰਜੀ ਚੇਤਾਵਨੀ',
    closeRecipe: 'ਪਕਵਾਨਾਂ ਤੇ ਵਾਪਸ ਜਾਓ',
    searchPlaceholder: 'ਪਕਵਾਨ ਲੱਭੋ (ਜਿਵੇਂ ਕਿ ਸੇਬ, ਖਿਚੜੀ, ਰਾਗੀ)...',
    allRecipes: 'ਸਾਰੇ ਪਕਵਾਨ',
    aiCustomizerTitle: 'AI ਬੇਬੀ ਰੈਸਿਪੀ ਮੇਕਰ',
    aiCustomizerDesc: 'ਆਪਣੀ ਰਸੋਈ ਵਿਚਲੀ ਸਮੱਗਰੀ ਦੇ ਆਧਾਰ ਤੇ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਵਿੱਚ ਇੱਕ ਸੁਰੱਖਿਅਤ, ਪੌਸ਼ਟਿਕ ਅਤੇ ਨਿੱਜੀ ਨੁਸਖਾ ਤਿਆਰ ਕਰੋ।',
    childAgeLabel: 'ਬੱਚੇ ਦੀ ਉਮਰ (ਸਾਲਾਂ ਵਿੱਚ)',
    ingredientsLabel: 'ਸਮੱਗਰੀ ਜੋ ਤੁਹਾਡੇ ਕੋਲ ਹੈ (ਜਿਵੇਂ ਕਿ ਕੇਲਾ, ਚੌਲ, ਗਾਜਰ)',
    dietaryLabel: 'ਖੁਰਾਕ ਸੰਬੰਧੀ ਤਰਜੀਹਾਂ / ਪਾਬੰਦੀਆਂ',
    noRestrictions: 'ਕੋਈ ਨਹੀਂ (ਸਧਾਰਨ)',
    vegetarian: 'ਸ਼ਾਕਾਹਾਰੀ',
    vegan: 'ਵੀਗਨ (Vegan)',
    allergyAlert: 'ਬਿਨਾਂ ਅੰਡਾ / ਬਿਨਾਂ ਡੇਅਰੀ',
    generateButton: 'ਏਆਈ ਨਾਲ ਰੈਸਿਪੀ ਤਿਆਰ ਕਰੋ',
    customRecipeResult: 'ਤੁਹਾਡਾ ਕਸਟਮਾਈਜ਼ਡ ਏਆਈ ਰੈਸਿਪੀ',
    translateRecipe: 'ਅਨੁਵਾਦ ਕਰੋ',
    translating: 'ਏਆਈ ਦੁਆਰਾ ਅਨੁਵਾਦ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...',
    disclaimer: 'ਆਪਣੇ ਬੱਚੇ ਨੂੰ ਕੋਈ ਵੀ ਨਵੀਂ ਚੀਜ਼ ਖੁਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਆਪਣੇ ਬਾਲ ਰੋਗ ਮਾਹਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।'
  }
};

/**
 * Maps the child's profile age string to the corresponding Solid Food Guide stage ID.
 * Defaults appropriately if age is unknown or out of range.
 */
export const getStageFromProfileAge = (rawAge?: string | null): string => {
  if (!rawAge) return '24_36_months';
  const lower = rawAge.toLowerCase().trim();

  // 0 - 6 Months
  if (lower.includes('0 - 6') || lower.includes('0-6') || lower.includes('0 to 6') || lower.includes('infant') || lower.includes('exclusive milk')) {
    return '0_6_months';
  }
  // 6 - 8 Months (Stage 1)
  if (lower.includes('6 - 8') || lower.includes('6-8') || lower.includes('6 to 8') || lower.includes('6 - 9') || lower.includes('6-9') || lower.includes('6 to 9') || lower.includes('stage 1') || lower.includes('weaning')) {
    return '6_8_months';
  }
  // 8 - 10 Months
  if (lower.includes('8 - 10') || lower.includes('8-10') || lower.includes('8 to 10')) {
    return '8_10_months';
  }
  // 10 - 12 Months (Stage 2)
  if (lower.includes('10 - 12') || lower.includes('10-12') || lower.includes('10 to 12') || lower.includes('9 - 12') || lower.includes('9-12') || lower.includes('9 to 12') || lower.includes('crawler') || lower.includes('stage 2')) {
    return '10_12_months';
  }
  // 12 - 24 Months (1 - 2 Years)
  if (
    lower.includes('12 - 24') || lower.includes('12-24') || lower.includes('12 to 24') ||
    lower.includes('12 - 18') || lower.includes('12-18') || lower.includes('18 - 24') || lower.includes('18-24') ||
    lower.includes('1 - 2') || lower.includes('1-2') || lower.includes('1 to 2') ||
    lower.includes('1 year') || lower.includes('1.5 year') || lower.includes('14 month') || lower.includes('16 month') || lower.includes('18 month')
  ) {
    return '12_24_months';
  }
  // 24 - 36 Months (2 - 3 Years)
  if (
    lower.includes('2 - 3') || lower.includes('2-3') || lower.includes('2 to 3') ||
    lower.includes('24 - 36') || lower.includes('24-36') || lower.includes('24 to 36') ||
    lower.includes('2 year') || lower.includes('2.5 year') || lower.includes('curious explorer')
  ) {
    return '24_36_months';
  }
  // 3 - 5 Years (Preschooler)
  if (
    lower.includes('3 - 5') || lower.includes('3-5') || lower.includes('3 to 5') ||
    lower.includes('3 - 4') || lower.includes('3-4') || lower.includes('4 - 5') || lower.includes('4-5') ||
    lower.includes('preschooler') || lower.includes('kindergarten') || lower.includes('3 year') || lower.includes('4 year')
  ) {
    return '3_5_years';
  }
  // 5 - 10 Years (School Age)
  if (
    lower.includes('5 - 10') || lower.includes('5-10') || lower.includes('5 to 10') ||
    lower.includes('school') || lower.includes('5 year') || lower.includes('6 year') || lower.includes('7 year') || lower.includes('8 year') || lower.includes('9 year')
  ) {
    return '5_10_years';
  }
  // 10 - 15 Years (Pre-Teens)
  if (
    lower.includes('10 - 15') || lower.includes('10-15') || lower.includes('10 to 15') ||
    lower.includes('pre-teen') || lower.includes('preteen') || lower.includes('10 year') || lower.includes('11 year') || lower.includes('12 year') || lower.includes('13 year') || lower.includes('14 year')
  ) {
    return '10_15_years';
  }
  // 15 - 18 Years (Adolescent / Young Adult)
  if (
    lower.includes('15 - 18') || lower.includes('15-18') || lower.includes('15 to 18') ||
    lower.includes('teen') || lower.includes('adolescent') || lower.includes('15 year') || lower.includes('16 year') || lower.includes('17 year') || lower.includes('18 year')
  ) {
    return '15_18_years';
  }

  // Fallback to numeric parsing
  const numMatch = lower.match(/(\d+)\s*(month|m|year|yr|y)?/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    const unit = numMatch[2] || '';
    if (unit.startsWith('y')) {
      if (val < 1) return '0_6_months';
      if (val === 1) return '12_24_months';
      if (val === 2) return '24_36_months';
      if (val <= 4) return '3_5_years';
      if (val <= 9) return '5_10_years';
      if (val <= 14) return '10_15_years';
      return '15_18_years';
    } else {
      if (val <= 6) return '0_6_months';
      if (val <= 8) return '6_8_months';
      if (val <= 10) return '8_10_months';
      if (val <= 12) return '10_12_months';
      if (val <= 24) return '12_24_months';
      if (val <= 36) return '24_36_months';
      if (val <= 60) return '3_5_years';
      if (val <= 120) return '5_10_years';
      if (val <= 180) return '10_15_years';
      return '15_18_years';
    }
  }

  return '12_24_months';
};

export interface FoodGuideProps {
  onNavigateToFoodLens?: () => void;
}

export const FoodGuide: React.FC<FoodGuideProps> = ({ onNavigateToFoodLens }) => {
  const { language } = useLanguage();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const currentT = localT[language] || localT['en'];

  // Safe wrapper for translator or falls back to English
  const gt = (key: string) => {
    return currentT[key] || localT['en'][key] || key;
  };

  const childName = profile?.childName || profile?.babyName || profile?.toddlerName || (typeof window !== 'undefined' ? localStorage.getItem('baby_name') : null) || 'Ashwath';
  const profileAge = profile?.toddlerAge || profile?.babyAge || profile?.childAge || (typeof window !== 'undefined' ? (localStorage.getItem('baby_age') || localStorage.getItem('toddler_age') || localStorage.getItem('child_age')) : null) || '1 - 2 Years';
  const indianState = profile?.indianState || (typeof window !== 'undefined' ? localStorage.getItem('user_indian_state') : null) || 'Karnataka';
  const userRegion = getStateRegion(indianState);
  const childStageId = getStageFromProfileAge(profileAge);

  const [activeStage, setActiveStage] = useState<string>(() => childStageId);
  const [selectedMealCategory, setSelectedMealCategory] = useState<'All' | MealCategory>('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    setActiveStage(childStageId);
  }, [childStageId]);
  const selectedRecipeNutrients = useMemo(() => {
    return selectedRecipe ? getRecipeNutrientDetails(selectedRecipe) : null;
  }, [selectedRecipe]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const recipeDetailRef = useRef<HTMLDivElement>(null);
  const aiRecipeRef = useRef<HTMLDivElement>(null);
  
  // Helper to convert child age to years string
  const getInitialYears = (raw?: string | null): string => {
    if (!raw) return '1.5';
    const l = raw.toLowerCase().trim();
    if (l.includes('0 - 6') || l.includes('0-6') || l.includes('infant')) return '0.5';
    if (l.includes('6 - 8') || l.includes('6-8')) return '0.6';
    if (l.includes('8 - 10') || l.includes('8-10')) return '0.8';
    if (l.includes('10 - 12') || l.includes('10-12')) return '0.9';
    if (l.includes('12 - 24') || l.includes('1 - 2') || l.includes('1-2')) return '1.5';
    if (l.includes('2 - 3') || l.includes('2-3')) return '2.5';
    if (l.includes('3 - 5') || l.includes('3-5')) return '4';
    if (l.includes('5 - 10') || l.includes('5-10')) return '7';
    if (l.includes('10 - 15') || l.includes('10-15')) return '12';
    if (l.includes('15 - 18') || l.includes('15-18')) return '16';
    return '1.5';
  };

  // Dedicated AI Recipe Maker Subview ('main' | 'ai-results' | 'ai-history')
  const [foodGuideSubView, setFoodGuideSubView] = useState<'main' | 'ai-results' | 'ai-history'>('main');
  const [currentBatch, setCurrentBatch] = useState<AIRecipeBatchRecord | null>(null);

  // Custom AI generator state (Age now in Years)
  const [customAgeYears, setCustomAgeYears] = useState<string>(() => getInitialYears(profileAge));
  const [customIngredients, setCustomIngredients] = useState<string>('');
  const [applyDietaryPreferences, setApplyDietaryPreferences] = useState<boolean>(true);
  const [aiRecipe, setAiRecipe] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiTranslating, setAiTranslating] = useState<boolean>(false);

  // Sync active stage with child profile if loaded or updated
  useEffect(() => {
    const detectedAge = profile?.toddlerAge || profile?.babyAge || profile?.childAge || (typeof window !== 'undefined' ? localStorage.getItem('baby_age') : null);
    if (detectedAge) {
      const stg = getStageFromProfileAge(detectedAge);
      setActiveStage(stg);
    }
  }, [profile?.toddlerAge, profile?.babyAge, profile?.childAge]);

  useEffect(() => {
    if (childStageId === '0_6_months') setCustomAgeYears('0.5');
    else if (childStageId === '6_8_months') setCustomAgeYears('0.6');
    else if (childStageId === '8_10_months') setCustomAgeYears('0.8');
    else if (childStageId === '10_12_months') setCustomAgeYears('0.9');
    else if (childStageId === '12_24_months') setCustomAgeYears('1.5');
    else if (childStageId === '24_36_months') setCustomAgeYears('2.5');
    else if (childStageId === '3_5_years') setCustomAgeYears('4');
    else if (childStageId === '5_10_years') setCustomAgeYears('7');
    else if (childStageId === '10_15_years') setCustomAgeYears('12');
    else if (childStageId === '15_18_years') setCustomAgeYears('16');
  }, [childStageId]);

  // Helper to read saved dietary preferences from profile & settings
  const getSavedDietaryPreferences = () => {
    const prefs: string[] = [];

    const diet = profile?.dietType || localStorage.getItem('baby_diet_type') || 'Vegetarian';
    if (diet) prefs.push(`Diet: ${diet}`);

    let religious = profile?.religiousCultural;
    if (!religious) {
      try {
        religious = JSON.parse(localStorage.getItem('baby_religious_cultural') || '[]');
      } catch {}
    }
    if (Array.isArray(religious) && religious.length > 0 && !religious.includes('No specific restrictions')) {
      prefs.push(`Religious / Cultural: ${religious.join(', ')}`);
    }

    let foodsToAvoid = profile?.foodsToAvoid;
    if (!foodsToAvoid) {
      try {
        foodsToAvoid = JSON.parse(localStorage.getItem('baby_foods_to_avoid') || '[]');
      } catch {}
    }
    if (Array.isArray(foodsToAvoid) && foodsToAvoid.length > 0) {
      prefs.push(`Foods to avoid: ${foodsToAvoid.join(', ')}`);
    }

    let allergies = profile?.allergies;
    if (!allergies) {
      try {
        allergies = JSON.parse(localStorage.getItem('baby_allergies') || '[]');
      } catch {}
    }
    if (Array.isArray(allergies) && allergies.length > 0) {
      prefs.push(`Allergies / Intolerances: ${allergies.join(', ')}`);
    }

    const aiNotes = profile?.aiInstructions || localStorage.getItem('baby_ai_instructions') || '';
    if (aiNotes) {
      prefs.push(`Special Notes: ${aiNotes}`);
    }

    return prefs.length > 0 ? prefs.join(' • ') : 'Vegetarian';
  };

  // Age Groups data for 0 to 3 years with 10 recipes per age stage
  const ageStages: AgeGroupData[] = ageStagesData;

  // Function to smoothly scroll to the top of the recipe details page
  const scrollToRecipeDetailsTop = () => {
    // Immediate scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Smooth alignment on the next frame accounting for sticky navbar
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (recipeDetailRef.current) {
          const navOffset = 90;
          const rect = recipeDetailRef.current.getBoundingClientRect();
          const targetY = Math.max(0, window.pageYOffset + rect.top - navOffset);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          document.documentElement.scrollTo({ top: targetY, behavior: 'smooth' });
          document.body.scrollTo({ top: targetY, behavior: 'smooth' });
          try {
            recipeDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch {}
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
          document.body.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    });
  };

  const handleStageChange = (stageId: string) => {
    playSound('pop');
    setActiveStage(stageId);
    setSelectedRecipe(null);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    playSound('glass');
    setSelectedRecipe(recipe);
    scrollToRecipeDetailsTop();
  };

  // Automatically scroll to the top of the recipe details page whenever a recipe is selected
  useEffect(() => {
    if (selectedRecipe) {
      scrollToRecipeDetailsTop();
    }
  }, [selectedRecipe]);

  // AI Baby Recipe Generator: Generates 3 distinct meal recipes & opens in dedicated view
  const handleGenerateAiRecipe = async () => {
    if (!customIngredients.trim()) return;
    playSound('glass');

    // Instantly transition to dedicated AI Results view and scroll to top
    setFoodGuideSubView('ai-results');
    setAiLoading(true);
    setAiRecipe('');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const savedDietaryPreferences = applyDietaryPreferences 
      ? getSavedDietaryPreferences() 
      : 'None (Use available home ingredients directly without restrictions)';
    const primaryIngredient = customIngredients.split(',')[0]?.trim() || 'wholesome grains';

    // Algorithmic high-fidelity fallback recipes ensuring 2 to 3 distinct meals
    const defaultBatchRecipes: GeneratedRecipe[] = [
      {
        id: `rec-${Date.now()}-1`,
        name: `Gentle ${primaryIngredient} & Oat Breakfast Mash`,
        mealType: 'Breakfast',
        prepTime: '5 mins',
        cookTime: '8 mins',
        textureGuide: `Soft, lump-free, easily swallowable consistency perfectly safe for a child aged ${customAgeYears} years.`,
        ingredients: [
          `3 tbsp rolled oats or toasted ragi flour`,
          `1/2 cup warm fortified milk or water`,
          `${primaryIngredient} (thoroughly mashed or grated)`,
          `1/4 tsp pure A2 cow ghee`,
          `A gentle pinch of aromatic cardamom powder`
        ],
        instructions: [
          `Warm 1/4 tsp cow ghee in a small saucepan, lightly toast the oats/grains for 1 minute.`,
          `Pour in warm milk or water and simmer gently for 5 minutes, stirring continuously until smooth.`,
          `Fold in the ${primaryIngredient} and cardamom powder. Allow to cool to safe lukewarm temperature before serving.`
        ],
        nutritionBenefits: `Rich in soluble beta-glucan fiber, energy-dense carbohydrates, and natural potassium to gently fuel morning growth.`,
        safetyAlerts: `Always check temperature on your inner wrist. Never add raw honey or artificial sweeteners if under 12 months.`
      },
      {
        id: `rec-${Date.now()}-2`,
        name: `Savory Moong Dal & ${primaryIngredient} Comfort Khichdi`,
        mealType: 'Lunch',
        prepTime: '10 mins',
        cookTime: '15 mins',
        textureGuide: `Tender pressure-cooked grains mashed with a wooden spoon for safe, choke-free chewing.`,
        ingredients: [
          `2 tbsp yellow moong dal (washed & soaked 15 mins)`,
          `2 tbsp soft sona masuri or brown rice`,
          `${customIngredients} (finely diced or grated)`,
          `1.5 cups filtered water`,
          `A pinch of roasted cumin (jeera) powder`,
          `1/2 tsp cow ghee`
        ],
        instructions: [
          `Add soaked moong dal, rice, and ${customIngredients} into a small pressure cooker with 1.5 cups water.`,
          `Cook for 4 whistles until completely tender and soft.`,
          `Depressurize and thoroughly mash with a spoon. Temper with 1/2 tsp ghee and a tiny pinch of cumin powder.`
        ],
        nutritionBenefits: `High-quality complete plant protein from the dal-rice combination, plus gut-friendly easy digestion.`,
        safetyAlerts: `Ensure all ingredients are mashed uniformly without hard chunks or slippery whole seeds.`
      },
      {
        id: `rec-${Date.now()}-3`,
        name: `Golden Soft ${primaryIngredient} Finger Pancakes`,
        mealType: 'Snack',
        prepTime: '5 mins',
        cookTime: '6 mins',
        textureGuide: `Pillowy, tender finger strips that toddlers can grip with ease for independent self-feeding practice.`,
        ingredients: [
          `3 tbsp whole wheat atta or besan (gram flour)`,
          `${primaryIngredient} (pureed or finely mashed)`,
          `2-3 tbsp milk or warm water for batter consistency`,
          `1/4 tsp ghee for greasing tava`
        ],
        instructions: [
          `Whisk flour, mashed ${primaryIngredient}, and water into a smooth, lump-free pancake batter.`,
          `Heat a non-stick or cast iron tava, lightly brush with ghee.`,
          `Drop small spoonfuls and cook on low heat for 2 minutes per side until golden and fluffy. Slice into finger strips.`
        ],
        nutritionBenefits: `Encourages fine motor pincer grasp and coordination while providing sustained wholesome energy.`,
        safetyAlerts: `Always supervise self-feeding. Make sure pancakes are soft and moist, never dry or hard-crusted.`
      }
    ];

    const promptText = `Generate exactly 3 DISTINCT, SAFE, and AGE-APPROPRIATE recipes for a child aged ${customAgeYears} years old using available ingredients: "${customIngredients}".
Child's Saved Dietary Preferences & Restrictions: "${savedDietaryPreferences}".

CRITICAL REQUIREMENTS:
1. Strict adherence to dietary preferences (${savedDietaryPreferences}).
2. Ensure textures, portion sizes, and chewing safety are perfectly tailored for a child aged ${customAgeYears} years old.
3. The 3 recipes MUST represent 3 different types of food / meals:
   - Recipe 1: Breakfast (Porridge, Puree, or Soft Morning Mash)
   - Recipe 2: Lunch (Wholesome Comfort Khichdi, Dal, or Savory Mash)
   - Recipe 3: Snack (Soft Finger Food, Pancake, or Tender Cheela)
4. Output ONLY a valid JSON array of exactly 3 objects (no conversational preamble, no markdown code fence).
Each object must have these exact keys:
- "id": string (unique)
- "name": string (engaging kid-friendly dish name)
- "mealType": string ("Breakfast" | "Lunch" | "Snack")
- "prepTime": string (e.g. "5 mins")
- "cookTime": string (e.g. "10 mins")
- "textureGuide": string (exact developmental texture suitable for ${customAgeYears} yr old)
- "ingredients": array of strings (with precise child proportions)
- "instructions": array of step-by-step strings
- "nutritionBenefits": string (vitamins, minerals, growth benefits)
- "safetyAlerts": string (temperature, choking prevention, allergen advice)
`;

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childAgeYears: customAgeYears,
          ingredients: customIngredients,
          defaultRecipes: defaultBatchRecipes,
        }),
      });

      let recipesToUse = defaultBatchRecipes;
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.recipes) && data.recipes.length >= 2) {
          recipesToUse = data.recipes;
        }
      }

      const newBatch: AIRecipeBatchRecord = {
        id: `batch-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        childAgeYears: `${customAgeYears} Years`,
        ingredientsInput: customIngredients,
        recipes: recipesToUse
      };

      saveRecipeBatch(newBatch);
      setCurrentBatch(newBatch);
      playSound('pop');
    } catch (error) {
      console.error('Error generating AI recipes:', error);
      const fallbackBatch: AIRecipeBatchRecord = {
        id: `batch-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        childAgeYears: `${customAgeYears} Years`,
        ingredientsInput: customIngredients,
        recipes: defaultBatchRecipes
      };
      saveRecipeBatch(fallbackBatch);
      setCurrentBatch(fallbackBatch);
    } finally {
      setAiLoading(false);
    }
  };

  const currentStageData = (activeStage !== 'all' ? ageStages.find(s => s.id === activeStage) : null) || ageStages[0];

  // Flat recipes with category helper applied
  const allRecipesFlat = ageStages.flatMap(stage => 
    stage.recipes.map(r => ({ ...r, stageLimit: stage.ageLimit, resolvedCategory: getRecipeCategory(r) }))
  );

  const baseStageRecipes = activeStage === 'all'
    ? allRecipesFlat
    : currentStageData.recipes.map(r => ({ ...r, stageLimit: currentStageData.ageLimit, resolvedCategory: getRecipeCategory(r) }));

  const mealFilteredRecipes = selectedMealCategory === 'All'
    ? baseStageRecipes
    : baseStageRecipes.filter(r => r.resolvedCategory === selectedMealCategory);

  // Regional state sorting: dishes matching the child's Indian state/region are prioritized first
  const stateSortedRecipes = useMemo(() => {
    return [...mealFilteredRecipes].sort((a, b) => {
      const aRegion = (a as any).region || 'Pan-Indian';
      const bRegion = (b as any).region || 'Pan-Indian';
      const aScore = aRegion === userRegion ? 2 : aRegion === 'Pan-Indian' ? 1 : 0;
      const bScore = bRegion === userRegion ? 2 : bRegion === 'Pan-Indian' ? 1 : 0;
      return bScore - aScore;
    });
  }, [mealFilteredRecipes, userRegion]);

  const filteredRecipes = searchQuery.trim() === ''
    ? stateSortedRecipes
    : stateSortedRecipes.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.benefits.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.localName && r.localName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Language-aware recipe name helpers:
  // Short, crispy recipe names without descriptive adjectives or prefixes
  const getRecipeTitle = (r: Recipe): string => {
    let title = r.name;
    if (language && language !== 'en' && r.localName) {
      const parts = r.localName.split('/');
      if (language === 'hi') {
        title = parts[0]?.trim() || r.name;
      } else if (language === 'ta') {
        title = (parts[1] || parts[0])?.trim() || r.name;
      }
    }
    // Clean any residual adjective words to keep recipe name short, crisp, and direct
    return title
      .replace(/^(High-Protein|Soft Baby|Silky Smooth|Silky|Velvety|Crispy|Creamy|Steamed|Mild|Fluffy|Wholesome|Pure)\s+/i, '')
      .trim();
  };

  const getRecipeSubtitle = (r: Recipe): string | null => {
    if (!language || language === 'en') {
      return null; // English only, no Hindi or Tamil subtitles below English names
    }
    // When Hindi or Tamil is selected at top, show the English title as a reference subtitle
    return r.name;
  };

  return (
    <div className="max-w-6xl mx-auto font-sans text-left px-4">
      {/* If viewing AI Generated Results or History, render dedicated full-page subview */}
      {foodGuideSubView !== 'main' ? (
        <AIRecipeResultsView
          batch={currentBatch}
          isLoading={aiLoading}
          initialTab={foodGuideSubView === 'ai-history' ? 'history' : 'results'}
          onBackToRecipes={() => {
            playSound('pop');
            setFoodGuideSubView('main');
            setTimeout(() => {
              document.getElementById('nutritious-recipes-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          onRegenerateNew={() => {
            playSound('pop');
            setFoodGuideSubView('main');
            setTimeout(() => {
              document.getElementById('ai-recipe-maker-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      ) : (
        <>
      {/* Compact Flagship Hero Banner: AI NutriChef: Your Kitchen Assistant */}
      <div id="solid-guide-title" className="scroll-mt-24 relative overflow-hidden rounded-3xl border border-emerald-500/25 p-5 sm:p-6 mb-6 bg-gradient-to-br from-[#0a1626] via-[#0f2136] to-[#08121f] shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
              <span>AI NutriChef:</span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Your Kitchen Assistant</span>
            </h1>

            <p className="text-sm sm:text-base font-bold text-emerald-200/90">
              250+ Age-Matched Indian Recipes &amp; Custom Ingredient Cooker
            </p>

            <p className="text-xs sm:text-sm text-white/70 leading-snug pt-0.5">
              <strong className="text-emerald-300">Why it works:</strong> &ldquo;NutriChef&rdquo; blends scientific pediatric nutrition with cooking ease to turn pantry ingredients into doctor-approved meals for any age.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs font-mono text-emerald-300 shrink-0">
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/80">
              250+ Recipes • 0 to 18 Years
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              Instant 3-Meal Pantry Cooker
            </span>
          </div>
        </div>
      </div>

      {/* 4 Big Attractive Navigation Menu Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* 1. AI Recipe Maker */}
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            document.getElementById('ai-recipe-maker-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-[#0c1424] hover:from-teal-900/50 hover:to-teal-950/60 border border-teal-500/30 hover:border-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/20 active:scale-98 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform mb-3">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white group-hover:text-teal-200 transition-colors">
              AI Recipe Maker
            </h3>
            <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
              Custom Ingredient Cooker
            </p>
          </div>
        </button>

        {/* 2. Nutritious Recipes */}
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            document.getElementById('nutritious-recipes-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/60 to-[#0c1424] hover:from-amber-900/50 hover:to-amber-950/60 border border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/20 active:scale-98 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform mb-3">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-200 transition-colors">
              Nutritious Recipes
            </h3>
            <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
              250+ Age-Matched Indian Dishes
            </p>
          </div>
        </button>

        {/* 3. AI Recipe History */}
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            navigate('/ai-recipe-history');
          }}
          className="group text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-[#0c1424] hover:from-indigo-900/50 hover:to-indigo-950/60 border border-indigo-500/30 hover:border-indigo-400 transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 active:scale-98 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition-transform mb-3">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-black text-sm sm:text-base text-white group-hover:text-indigo-200 transition-colors">
                AI Recipe History
              </h3>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Log
              </span>
            </div>
            <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
              Search &amp; Filter Saved Recipes
            </p>
          </div>
        </button>

        {/* 4. Stage Guidelines */}
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            document.getElementById('select-stage-guidelines-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-[#0c1424] hover:from-purple-900/50 hover:to-purple-950/60 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 active:scale-98 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[96px]"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform mb-3">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-white group-hover:text-purple-200 transition-colors">
              Stage Guidelines
            </h3>
            <p className="text-[11px] text-white/60 mt-0.5 line-clamp-1">
              Textures &amp; Milestones (0-18y)
            </p>
          </div>
        </button>
      </div>

      {/* =========================================================
          3. CUSTOM AI BABY RECIPE MAKER (Free AI Tool)
      ========================================================== */}
      <div id="ai-recipe-maker-section" className="mb-12 scroll-mt-24">
        <div ref={aiRecipeRef} className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-[#0d1e2e] to-[#091522] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg sm:text-xl text-white">{gt('aiCustomizerTitle')}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase tracking-wider">
                    Free AI Assistant
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5 max-w-2xl leading-relaxed">
                  {gt('aiCustomizerDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Generator Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>{gt('childAgeLabel')}</span>
                <span className="text-[10px] font-mono text-emerald-400 lowercase">write in years (e.g. 1.5)</span>
              </label>
              <input
                type="text"
                value={customAgeYears}
                onChange={(e) => setCustomAgeYears(e.target.value)}
                placeholder="e.g. 1.5 years or 2 years"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 font-bold text-sm placeholder:text-white/30"
              />
              {/* Quick Age Presets in Years */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {[
                  { label: '0.5 yr (6m)', val: '0.5' },
                  { label: '1.0 yr', val: '1.0' },
                  { label: '1.5 yrs', val: '1.5' },
                  { label: '2.0 yrs', val: '2.0' },
                  { label: '3.0 yrs', val: '3.0' },
                  { label: '5.0 yrs', val: '5.0' },
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => { playSound('click'); setCustomAgeYears(p.val); }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      customAgeYears === p.val
                        ? 'bg-emerald-400 text-slate-950 font-black shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                {gt('ingredientsLabel')}
              </label>
              <textarea
                rows={2}
                placeholder="e.g., banana, rolled oats, carrot (Press Enter for line break)"
                value={customIngredients}
                onChange={(e) => setCustomIngredients(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm placeholder:text-white/30 resize-y min-h-[50px] leading-relaxed"
              />
            </div>
          </div>

          {/* Apply Dietary Preferences Option & Note */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200">
            <div className="flex items-start gap-3">
              <Apple className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={applyDietaryPreferences}
                    onChange={(e) => {
                      playSound('pop');
                      setApplyDietaryPreferences(e.target.checked);
                    }}
                    className="w-4 h-4 rounded text-emerald-500 bg-white/10 border-white/20 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer accent-emerald-400"
                  />
                  <span className="font-bold text-white text-sm">Apply Dietary Preferences</span>
                </label>
                <p className="text-[11px] text-white/70 mt-1">
                  The AI automatically applies your baby's dietary preferences and restrictions configured in your health settings.
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold self-start sm:self-center shrink-0 border ${
              applyDietaryPreferences
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}>
              {applyDietaryPreferences ? 'Profile Diet Enabled' : 'Home Ingredients Mode'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateAiRecipe}
              disabled={aiLoading || !customIngredients.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Generate 3-Meal Recipes with AI</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                navigate('/ai-recipe-history');
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <History className="w-4 h-4 text-indigo-400" />
              <span>AI Recipe History</span>
            </button>
          </div>

          {/* Generated Recipe Display Area */}
          <AnimatePresence>
            {aiRecipe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 pt-8 border-t border-white/10 relative"
              >
                <button
                  onClick={() => { playSound('pop'); setAiRecipe(''); }}
                  className="absolute top-8 right-0 text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all cursor-pointer"
                >
                  Close Recipe
                </button>
                <div className="flex items-center gap-2 text-emerald-400 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-white">{gt('customRecipeResult')}</h3>
                </div>

                <div className="prose prose-invert max-w-none text-white/90 leading-relaxed font-sans text-left bg-black/20 p-6 sm:p-8 rounded-2xl border border-white/5">
                  <Markdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl md:text-3xl font-black text-white mt-4 mb-4 flex items-center gap-2 border-b border-white/10 pb-2 tracking-tight">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl md:text-2xl font-black text-indigo-300 mt-6 mb-3 tracking-tight">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg md:text-xl font-black text-emerald-400 mt-5 mb-2 tracking-tight">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 text-white/80 leading-relaxed text-sm sm:text-base">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="text-sm sm:text-base text-white/75 leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-white/60">{children}</em>,
                    }}
                  >
                    {aiRecipe}
                  </Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>



            {/* =========================================================
          4. NUTRITIOUS RECIPES TO CHOOSE (With Meal Category Filter)
      ========================================================== */}
      <div id="nutritious-recipes-section" className="mb-12 scroll-mt-24">
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <ChefHat className="w-6 h-6 text-indigo-400" />
                <span>{gt('recipesHeader')}</span>

              </h3>
              <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Personalized for {childName || 'Ashwath'} based on both age ({profileAge}) & {indianState} cuisine</span>
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder={gt('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Meal Category Filter Bar: Morning, Lunch, Dinner, Snacks */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <span className="text-xs font-black uppercase tracking-wider text-white/50 mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Meal Filter:</span>
            </span>

            {[
              { id: 'All', label: 'All Meals', icon: UtensilsCrossed },
              { id: 'Morning', label: 'Morning / Breakfast', icon: Sunrise },
              { id: 'Lunch', label: 'Lunch', icon: Sun },
              { id: 'Dinner', label: 'Dinner', icon: Moon },
              { id: 'Snacks', label: 'Snacks & Treats', icon: Apple },
            ].map((cat) => {
              const count = cat.id === 'All'
                ? baseStageRecipes.length
                : baseStageRecipes.filter(r => r.resolvedCategory === cat.id).length;
              const isSelected = selectedMealCategory === cat.id;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setSelectedMealCategory(cat.id as any);
                    setSelectedRecipe(null);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40 scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Recipe Detail View (If opened) */}
          <AnimatePresence mode="wait">
            {selectedRecipe ? (
              <motion.div
                ref={recipeDetailRef}
                key="recipe-detail"
                id="recipe-detail-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="scroll-mt-24 glass-card p-6 sm:p-8 border border-indigo-400/30 rounded-3xl bg-[#0c1424]/95 shadow-2xl"
              >
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => { playSound('pop'); setSelectedRecipe(null); }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300 hover:text-indigo-200 transition-colors mb-6 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>{gt('closeRecipe')}</span>
                </button>

                {/* Recipe Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {selectedRecipe.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white leading-tight">
                      {getRecipeTitle(selectedRecipe)}
                    </h2>
                    {getRecipeSubtitle(selectedRecipe) && (
                      <p className="text-xs font-semibold text-white/50 mt-1">
                        {getRecipeSubtitle(selectedRecipe)}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/50 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {gt('prepTime')}: {selectedRecipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        {gt('cookTime')}: {selectedRecipe.cookTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/5 pt-6">
                  {/* Ingredients */}
                  <div className="md:col-span-5 space-y-4">
                    <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                      {gt('ingredients')}
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div className="md:col-span-7 space-y-4">
                    <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                      {gt('instructions')}
                    </h3>
                    <ol className="space-y-4 text-sm text-white/75 leading-relaxed">
                      {selectedRecipe.instructions.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black font-mono text-indigo-400 shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Culinary & Growth Benefits */}
                <div className="mt-8 border-t border-white/5 pt-6">
                  <div className="bg-emerald-500/[0.04] border border-emerald-500/20 p-5 rounded-2xl">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Apple className="w-4 h-4" />
                      {gt('nutritionBenefits')}
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {selectedRecipe.benefits}
                    </p>
                  </div>
                </div>

                {/* KEY NUTRIENT DETAILS (PER SERVING): Protein, Iron, Calcium & Energy */}
                {selectedRecipeNutrients && (
                  <div className="mt-6 bg-white/[0.02] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                          </span>
                          <h3 className="text-sm font-black text-white uppercase tracking-wider">
                            Key Nutrient Details (Per Serving)
                          </h3>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">
                          Pediatric bioavailable macro & micronutrient density measured per standard toddler portion.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto text-xs font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
                        ⚡ {selectedRecipeNutrients.calories} / Serving
                      </span>
                    </div>

                    {/* 3 Core Spotlight Cards: Protein, Iron, Calcium */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Bioavailable Protein */}
                      <div className="bg-gradient-to-br from-indigo-950/40 via-indigo-900/20 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🥩</span> Protein
                            </span>
                            <span className="text-[10px] font-black text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                              {selectedRecipeNutrients.protein.percentDaily}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-white">{selectedRecipeNutrients.protein.amount}</span>
                            <span className="text-xs text-white/40">/ serving</span>
                          </div>
                          <div className="text-[11px] font-bold text-indigo-300 mt-1">
                            ✓ {selectedRecipeNutrients.protein.badge}
                          </div>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed border-t border-white/5 pt-2">
                          {selectedRecipeNutrients.protein.note}
                        </p>
                      </div>

                      {/* Vital Iron */}
                      <div className="bg-gradient-to-br from-rose-950/40 via-rose-900/20 to-slate-900/60 border border-rose-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🩸</span> Bioavailable Iron
                            </span>
                            <span className="text-[10px] font-black text-rose-200 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                              {selectedRecipeNutrients.iron.percentDaily}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-white">{selectedRecipeNutrients.iron.amount}</span>
                            <span className="text-xs text-white/40">/ serving</span>
                          </div>
                          <div className="text-[11px] font-bold text-rose-300 mt-1">
                            ✓ {selectedRecipeNutrients.iron.badge}
                          </div>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed border-t border-white/5 pt-2">
                          {selectedRecipeNutrients.iron.note}
                        </p>
                      </div>

                      {/* Essential Calcium */}
                      <div className="bg-gradient-to-br from-cyan-950/40 via-cyan-900/20 to-slate-900/60 border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🦴</span> Essential Calcium
                            </span>
                            <span className="text-[10px] font-black text-cyan-200 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                              {selectedRecipeNutrients.calcium.percentDaily}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-white">{selectedRecipeNutrients.calcium.amount}</span>
                            <span className="text-xs text-white/40">/ serving</span>
                          </div>
                          <div className="text-[11px] font-bold text-cyan-300 mt-1">
                            ✓ {selectedRecipeNutrients.calcium.badge}
                          </div>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed border-t border-white/5 pt-2">
                          {selectedRecipeNutrients.calcium.note}
                        </p>
                      </div>
                    </div>

                    {/* Secondary Nutritional Metrics (Fiber & Carbs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">🌿</span>
                          <div>
                            <span className="font-bold text-white">Prebiotic Dietary Fiber: </span>
                            <span className="text-emerald-300 font-extrabold">{selectedRecipeNutrients.fiber.amount}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/50">{selectedRecipeNutrients.fiber.percentDaily}</span>
                      </div>

                      <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400">🌾</span>
                          <div>
                            <span className="font-bold text-white">Complex Carbohydrates: </span>
                            <span className="text-amber-300 font-extrabold">{selectedRecipeNutrients.carbs.amount}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-white/50">Slow-release energy</span>
                      </div>
                    </div>

                    {/* Sodium, Salt, Sugar, and Fat Levels under Key Nutrient Details */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white/[0.03] border border-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-white/50 uppercase font-bold block mb-0.5">Sodium Level</span>
                          <span className="font-black text-white text-sm">{selectedRecipeNutrients.sodium.amount}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedRecipeNutrients.sodium.badge}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-white/50 uppercase font-bold block mb-0.5">Salt Level</span>
                          <span className="font-black text-white text-sm">{selectedRecipeNutrients.salt.amount}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedRecipeNutrients.salt.badge}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-white/50 uppercase font-bold block mb-0.5">Sugar Level</span>
                          <span className="font-black text-white text-sm">{selectedRecipeNutrients.sugar.amount}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedRecipeNutrients.sugar.badge}</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 p-2.5 rounded-xl">
                          <span className="text-[10px] text-white/50 uppercase font-bold block mb-0.5">Fat Level</span>
                          <span className="font-black text-white text-sm">{selectedRecipeNutrients.fat.amount}</span>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">{selectedRecipeNutrients.fat.badge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => handleRecipeClick(recipe)}
                className="glass-card p-5 border border-white/5 hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer transition-all flex items-start gap-4 text-left group bg-[#0c1424]/80 rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                  {recipe.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors text-sm sm:text-base leading-snug">
                    {getRecipeTitle(recipe)}
                  </h4>
                  {getRecipeSubtitle(recipe) && (
                    <p className="text-[11px] font-semibold text-white/50 mt-0.5">
                      {getRecipeSubtitle(recipe)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      (recipe as any).resolvedCategory === 'Morning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                        : (recipe as any).resolvedCategory === 'Lunch'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                        : (recipe as any).resolvedCategory === 'Dinner'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    }`}>
                      {(recipe as any).resolvedCategory || getRecipeCategory(recipe)}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Flame className="w-3 h-3 text-orange-400" />
                      Cook: {recipe.cookTime}
                    </span>
                    {(recipe as any).region && (
                      <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider text-[9px] ${
                        (recipe as any).region === userRegion
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-xs'
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        {(recipe as any).region}
                      </span>
                    )}
                    <span className="text-white/30">•</span>
                    <span className="text-indigo-300 font-semibold">
                      {'stageLimit' in recipe ? (recipe as any).stageLimit : currentStageData?.ageLimit || 'All Ages'}
                    </span>
                  </div>


                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 self-center transition-transform group-hover:translate-x-1" />
              </motion.div>
            ))}

            {filteredRecipes.length === 0 && (
              <div className="col-span-full py-12 text-center text-white/40 text-sm font-semibold glass-card rounded-2xl border border-white/5">
                No recipes match "{searchQuery}". Try searching for another ingredient or food name.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          5. SELECT STAGE GUIDELINES (With All Button & Child Auto-Select)
      ========================================================== */}
      <div id="select-stage-guidelines-section" className="mb-8 scroll-mt-24">
        <span id="select-age-section" className="sr-only" />
        <div className="glass-card p-5 sm:p-6 border border-white/10 rounded-3xl bg-[#0c1424]/90 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                <span>Select Stage Guidelines</span>
              </h2>
            </div>
            <span className="text-xs font-mono text-white/50">
              10 Age Brackets (0 to 18 Years)
            </span>
          </div>

          {/* Dedicated Child Profile Banner (Prominent, Elegant & Never Overlapping) */}
          {profileAge && (
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-teal-950/20 border border-emerald-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow">
                  👶
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-white tracking-wide">
                      Personalized for <span className="text-emerald-400 font-extrabold">{childName || 'Ashwath'}</span>
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-mono">
                      Age: {profileAge}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-300" />
                      State: {indianState}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
                      {userRegion} Region
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">
                    Personalized for {childName || 'Ashwath'} based on both developmental age ({profileAge}) and regional home cuisine of {indianState}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Horizontal Age Filters Grid including "All" button */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {/* ALL BUTTON */}
            <button
              type="button"
              onClick={() => handleStageChange('all')}
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-h-[96px] flex flex-col justify-between overflow-hidden relative ${
                activeStage === 'all'
                  ? 'bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border-indigo-400 text-white ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/15 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm">All</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded-md">
                    0-18 Yrs
                  </span>
                </div>
                <div className="text-[11px] text-white/50 mt-1 font-medium leading-tight">
                  All Recipes & Stages
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/5 text-[10px] text-indigo-300 font-mono font-bold">
                {allRecipesFlat.length} Recipes
              </div>
            </button>

            {/* AGE STAGES */}
            {ageStages.map((stage) => {
              const isActive = activeStage === stage.id;
              const isChildStage = stage.id === childStageId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => handleStageChange(stage.id)}
                  className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-h-[96px] flex flex-col justify-between overflow-hidden relative ${
                    isActive
                      ? isChildStage
                        ? 'bg-gradient-to-br from-emerald-500/25 to-teal-500/25 border-emerald-400 text-white ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border-indigo-400 text-white ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/15 scale-[1.02]'
                      : isChildStage
                        ? 'bg-emerald-500/[0.08] border-emerald-400/60 text-white ring-1 ring-emerald-400/30 hover:border-emerald-400'
                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="w-full">
                    <div className="font-black text-sm text-white truncate">
                      {stage.ageLimit}
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5 font-medium line-clamp-1 leading-tight">
                      {stage.title}
                    </div>
                  </div>

                  {/* Clean bottom row indicator - NO overlap with top text */}
                  {isChildStage ? (
                    <div className="mt-2 pt-1.5 border-t border-emerald-400/25 flex items-center justify-between text-[10px] font-black text-emerald-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                        <span className="truncate">For {childName || 'Child'}</span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-300/80 shrink-0 ml-1">{stage.recipes.length} Recipes</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-1.5 border-t border-transparent text-[10px] text-white/40 font-mono">
                      {stage.recipes.length} Recipes
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          6. STAGE GUIDELINES (Readable, High-Contrast & Clear)
      ========================================================== */}
      <div id="stage-guidelines-section" className="mb-12 scroll-mt-24">
        <div className="glass-card p-6 sm:p-8 border border-white/15 rounded-3xl bg-[#0b1220]/95 shadow-2xl">
          {activeStage === 'all' ? (
            /* Comprehensive overview when ALL is selected */
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-indigo-300">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Complete Stage Guidelines</span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Pediatric Nutrition Progression (0 - 18 Years)</h2>
                  </div>
                </div>
                <span className="text-xs font-mono px-3.5 py-1.5 bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 rounded-full font-bold">
                  10 Developmental Stages
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed mb-6">
                Children's nutrition progresses from single-ingredient purees at 5-6 months to self-feeding finger foods by 9-12 months, family table meals in toddlerhood, and high-protein, energy-dense athletic diets through school and teenage years.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {ageStages.map((stg) => (
                  <div key={stg.id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-400/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-indigo-300">{stg.ageLimit}</span>
                        <button
                          onClick={() => handleStageChange(stg.id)}
                          className="text-xs text-indigo-300 hover:text-white font-bold uppercase tracking-wider cursor-pointer"
                        >
                          View Stage →
                        </button>
                      </div>
                      <div className="text-xs font-bold text-white mb-1.5">{stg.title}</div>
                      <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">{stg.guidelines}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-emerald-400 font-bold">
                      {stg.recipes.length} Authentic Recipes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Specific stage guidelines with high-contrast, crystal-clear typography */
            <div>
              {/* Stage Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl text-indigo-300">
                    <Baby className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">
                      Stage Guidelines
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {currentStageData.ageLimit}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-200 border border-indigo-400/30 shadow-sm">
                    {currentStageData.title}
                  </span>
                  <span className="text-xs font-mono font-bold px-3 py-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full">
                    {currentStageData.recipes.length} Recipes Available
                  </span>
                </div>
              </div>

              {/* Clear, readable overview paragraph in high-contrast comfortable font */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6">
                <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                  {currentStageData.guidelines}
                </p>
              </div>

              {/* 4 Clean Visual Action Cards with Large Readable Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
                {/* 1. Meal Routine */}
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-300 mb-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Meal Routine</span>
                    </div>
                    <div className="text-base font-black text-white leading-tight">
                      {activeStage === '0_6_months' && 'Feed on Demand (Milk)'}
                      {activeStage === '6_8_months' && '2 Solid Meals + Milk'}
                      {activeStage === '8_10_months' && '3 Solid Meals Daily'}
                      {activeStage === '10_12_months' && '3 Meals + 1 Snack'}
                      {(activeStage === '12_24_months' || activeStage === '24_36_months') && '3 Meals + 2 Snacks'}
                      {activeStage === '3_5_years' && '3 Meals + 2 Healthy Bites'}
                      {activeStage === '5_10_years' && '3 Meals + School Tiffin'}
                      {activeStage === '10_15_years' && '3 Balanced Meals + 2 High-Protein Snacks'}
                      {activeStage === '15_18_years' && '3 Power Meals + Pre/Post-Workout Fuel'}
                    </div>
                  </div>
                  <p className="text-xs text-indigo-200/80 mt-2 font-medium">
                    {activeStage === '10_15_years'
                      ? 'Fuel rapid height growth with protein-rich school tiffins.'
                      : activeStage === '15_18_years'
                      ? 'Time nutrition with high exam focus and athletic workouts.'
                      : 'Space meals at steady 2.5 to 3 hour intervals.'}
                  </p>
                </div>

                {/* 2. Hydration */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-300 mb-2">
                      <Coffee className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Fluids & Milk</span>
                    </div>
                    <div className="text-base font-black text-white leading-tight">
                      {activeStage === '0_6_months' && 'Exclusive Breast/Formula'}
                      {(activeStage === '6_8_months' || activeStage === '8_10_months') && 'Sips of Boiled Water + Milk'}
                      {activeStage === '10_12_months' && 'Open Cup Water + Milk'}
                      {(activeStage === '12_24_months' || activeStage === '24_36_months') && '350 - 400ml Milk + Water'}
                      {(activeStage === '3_5_years' || activeStage === '5_10_years') && '1.2 - 1.5 Liters Water + Milk'}
                      {activeStage === '10_15_years' && '1.8 - 2.0 Liters Water + Fresh Chaach'}
                      {activeStage === '15_18_years' && '2.5 - 3.0 Liters Water + Sattu / Coconut Water'}
                    </div>
                  </div>
                  <p className="text-xs text-emerald-200/80 mt-2 font-medium">
                    {activeStage === '10_15_years'
                      ? 'Support bone mineralization and muscle hydration during sports.'
                      : activeStage === '15_18_years'
                      ? 'Prevent dehydration fatigue during long study sessions and training.'
                      : 'Offer water with and between meals regularly.'}
                  </p>
                </div>

                {/* 3. Texture */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-300 mb-2">
                      <Apple className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Texture & Form</span>
                    </div>
                    <div className="text-base font-black text-white leading-tight">
                      {activeStage === '0_6_months' && 'Silky Smooth Purees'}
                      {activeStage === '6_8_months' && 'Thick Mashes & Purees'}
                      {activeStage === '8_10_months' && 'Soft Lumps & Finger Foods'}
                      {activeStage === '10_12_months' && 'Minced & Soft Table Foods'}
                      {activeStage === '12_24_months' && 'Family Table Foods (Bite-Sized)'}
                      {activeStage === '24_36_months' && 'Self-Fed Regular Cutlery'}
                      {(activeStage === '3_5_years' || activeStage === '5_10_years') && 'Nutrient-Dense Indian Foods'}
                      {activeStage === '10_15_years' && 'High-Fiber Parathas, Dals & Sprout Chaats'}
                      {activeStage === '15_18_years' && 'Macro-Balanced Kathi Rolls, Grain Bowls & Smoothies'}
                    </div>
                  </div>
                  <p className="text-xs text-amber-200/80 mt-2 font-medium">
                    {activeStage === '10_15_years'
                      ? 'Encourage diverse whole grains like bajra, jowar, and sattu.'
                      : activeStage === '15_18_years'
                      ? 'Focus on lean protein, complex carbs, and slow-burning energy.'
                      : 'Encourage self-feeding with fingers and spoon.'}
                  </p>
                </div>

                {/* 4. Safety & Precautions */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-rose-300 mb-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-wider">Choking Safety</span>
                    </div>
                    <div className="text-base font-black text-white leading-tight">
                      {activeStage === '0_6_months' && 'Zero Solids / Honey'}
                      {(activeStage === '6_8_months' || activeStage === '8_10_months') && 'Slice Grapes & Pulses'}
                      {activeStage === '10_12_months' && 'Crush Whole Nuts & Seeds'}
                      {(activeStage === '12_24_months' || activeStage === '24_36_months') && 'Avoid Hard Round Candies'}
                      {(activeStage === '3_5_years' || activeStage === '5_10_years') && 'Supervise Chewing'}
                      {activeStage === '10_15_years' && 'Cut Back on Packaged Sodas & Instant Chips'}
                      {activeStage === '15_18_years' && 'Avoid Caffeine Overload & Energy Drinks'}
                    </div>
                  </div>
                  <p className="text-xs text-rose-200/80 mt-2 font-medium">
                    {activeStage === '10_15_years'
                      ? 'Ensure iron-rich lentils and greens for puberty growth.'
                      : activeStage === '15_18_years'
                      ? 'Protect circadian sleep cycles and mental health stamina.'
                      : 'Always stay seated during meal times.'}
                  </p>
                </div>
              </div>

              {/* 2-Column Section: Developmental Milestones & Daily Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Milestones list with high contrast readability */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>{gt('readinessMilestones')}</span>
                  </h3>
                  <ul className="space-y-3">
                    {currentStageData.milestones.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white/[0.05] p-4 rounded-2xl border border-white/10 shadow-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                          ✓
                        </span>
                        <span className="text-sm font-semibold text-slate-100 leading-snug">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Schedule guidance with high contrast readability */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{gt('feedingGuidelines')}</span>
                  </h3>
                  <div className="bg-white/[0.05] border border-white/10 p-5 rounded-2xl text-sm font-medium text-slate-100 leading-relaxed space-y-3 shadow-sm">
                    {activeStage === '0_6_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Exclusive Milk Period:</div>
                        <p>Feed milk on demand. Beginning around 5-6 months, offer 1-2 teaspoons of silky smooth purees once daily to practice swallow coordination.</p>
                        <p className="text-xs text-white/60">Tip: Never force feeds; let baby explore the spoon gently.</p>
                      </>
                    )}
                    {activeStage === '6_8_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Suggested Daily Schedule:</div>
                        <p>Offer solid foods 2 times daily. Keep portion sizes small (2-3 tablespoons per meal). Milk continues to supply primary calories.</p>
                        <p className="text-xs text-white/60">Morning (10 AM): Fruit Puree | Evening (5 PM): Dal Ka Paani or Khichdi Mash.</p>
                      </>
                    )}
                    {activeStage === '8_10_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Suggested Daily Schedule:</div>
                        <p>Feed solids 3 times daily. Portion sizes reach 1/4 to 1/2 cup. Water can be introduced in small sips from an open cup.</p>
                        <p className="text-xs text-white/60">Breakfast (8:30 AM): Ragi Porridge | Lunch (12:30 PM): Khichdi | Dinner (6:30 PM): Veggie Mash.</p>
                      </>
                    )}
                    {activeStage === '10_12_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Suggested Daily Schedule:</div>
                        <p>Offer 3 main meals and 1 light snack daily. Portions up to 1/2 cup per meal. Continue breastfeeding or formula as desired.</p>
                        <p className="text-xs text-white/60">Include finger foods like soft steamed carrot batons, mini cheelas, and soft idlis.</p>
                      </>
                    )}
                    {activeStage === '12_24_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Family Table Routine:</div>
                        <p>Transition to 3 family-style meals and 2 healthy snacks daily. Whole cow milk, soft rotis, lentils, and fresh fruits provide sustained energy.</p>
                        <p className="text-xs text-white/60">Routine: Breakfast (8 AM) | Snack (10:30 AM) | Lunch (1 PM) | Evening Snack (4:30 PM) | Dinner (7:30 PM).</p>
                      </>
                    )}
                    {activeStage === '24_36_months' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Independent Toddler Routine:</div>
                        <p>Standard schedule: Breakfast (8 AM), Snack (10:30 AM), Lunch (1 PM), Evening Snack (4:30 PM), Dinner (7:30 PM). Involve toddlers in safe prep.</p>
                        <p className="text-xs text-white/60">Encourage self-feeding with child-safe cutlery; offer varied colorful plates.</p>
                      </>
                    )}
                    {activeStage === '3_5_years' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Preschool Schedule:</div>
                        <p>Preschoolers thrive on 3 main meals and 2 nutritious snacks. Emphasize fiber, iron-rich greens, and high-calcium dairy for bone mineralization.</p>
                        <p className="text-xs text-white/60">Pack fun, mess-free school tiffins like stuffed theplas, mini idlis, and roasted makhana.</p>
                      </>
                    )}
                    {activeStage === '5_10_years' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">School-Age Routine:</div>
                        <p>Pack wholesome school lunchboxes (parathas, chillas, vegetable pulao) and provide protein-rich after-school snacks like sprout chaat and makhana.</p>
                        <p className="text-xs text-white/60">Provide hearty breakfasts before morning school to power academic focus and concentration.</p>
                      </>
                    )}
                    {activeStage === '10_15_years' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Puberty Growth Spurt & School Routine:</div>
                        <p>Pre-teens require dense calcium (dairy/paneer), iron (lentils, leafy greens), and high-fiber carbs for rapid bone lengthening and hormonal shifts. Provide heavy breakfast before school and high-protein afternoon refuels.</p>
                        <p className="text-xs text-white/60">Schedule: Breakfast (7:30 AM) | School Tiffin (11 AM) | After-School Chaat (4 PM) | Dinner (8 PM).</p>
                      </>
                    )}
                    {activeStage === '15_18_years' && (
                      <>
                        <div className="font-bold text-amber-300 text-sm">Adolescent Exam & Athletic Performance:</div>
                        <p>Older teens face adult metabolic burn rates, intensive competitive exam prep, and physical fitness goals. Balance macronutrients with dense plant/animal proteins, complex starches (quinoa, brown rice, oats), and restorative hydration.</p>
                        <p className="text-xs text-white/60">Focus: Sustained mental clarity, muscle repair after training, and avoiding high-sugar commercial energy beverages.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          7. FOOD LENS AI SCANNER
      ========================================================== */}
      <div id="food-lens-section" className="mb-12">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-950/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-xl shadow-xl shadow-amber-500/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-white">FoodLens AI Plate Scanner</span>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black text-[10px] font-black uppercase tracking-wider">
                  PREMIUM
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl leading-relaxed">
                Want to check real-time nutrients or texture safety of a prepared dish? Scan your child's plate with FoodLens AI camera.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToFoodLens && (
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onNavigateToFoodLens();
                }}
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>FoodLens Scanner</span>
              </button>
            )}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
