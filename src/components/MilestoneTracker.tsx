import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  Award, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Heart, 
  HelpCircle,
  Info,
  PenTool, 
  Calculator, 
  Brain, 
  Target, 
  Footprints, 
  Activity, 
  Scissors, 
  Shirt, 
  Users, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  Home, 
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { playSound } from '../lib/sounds';
import { useLanguage } from '../lib/LanguageContext';

const milestoneTranslations: Record<string, Record<string, { name: string; desc: string; tips: string }>> = {
  en: {
    social_smile: {
      name: 'Social Smile',
      desc: 'Smiles back when you talk to or smile at them.',
      tips: 'Talk to your baby face-to-face, make funny expressions, and smile often.'
    },
    babbling: {
      name: 'First Babble',
      desc: 'Makes vowel and consonant sound combinations (like "ba-ba" or "da-da").',
      tips: 'Respond to your baby\'s sounds as if you are having a real conversation.'
    },
    sitting_alone: {
      name: 'Sitting Without Support',
      desc: 'Sits upright steadily without leaning on hands or support.',
      tips: 'Place toys just out of reach while they sit to help them balance.'
    },
    crawling: {
      name: 'Crawling',
      desc: 'Moves around on hands and knees or tummy-crawling.',
      tips: 'Encourage tummy time and put enticing toys on the floor to crawl toward.'
    },
    waving: {
      name: 'Waving Bye-Bye',
      desc: 'Waves hand to say hello or goodbye to people.',
      tips: 'Wave and say "bye-bye" whenever anyone leaves or arrives.'
    },
    first_words: {
      name: 'First Words',
      desc: 'Says simple clear words with meaning (like "Mama", "Papa", "Dog").',
      tips: 'Point to everyday items and name them clearly so they link objects to words.'
    },
    standing_alone: {
      name: 'Standing Alone',
      desc: 'Stands unsupported for at least a few seconds.',
      tips: 'Hold their hands to stand up, then gently release one hand to let them balance.'
    },
    walking: {
      name: 'First Steps & Walking',
      desc: 'Takes a few steps independently or walks across a room.',
      tips: 'Create a safe, open space with sturdy furniture they can cruise along.'
    },
    scribbling: {
      name: 'Scribbling',
      desc: 'Holds a crayon and makes marks or scribbles on paper.',
      tips: 'Provide chunky, non-toxic crayons and large sheets of paper for drawing.'
    },
    speaking_sentences: {
      name: 'Simple Sentences',
      desc: 'Combines 2 or more words to express a need or idea (e.g., "more milk").',
      tips: 'Read books together daily and ask open questions like "What is the dog doing?".'
    },
    running_jumping: {
      name: 'Running & Jumping in Place',
      desc: 'Runs steadily without frequent falling and jumps off the ground with both feet.',
      tips: 'Play freeze dance or encourage gentle hops over soft floor pillows.'
    },
    spoon_cup_feeding: {
      name: 'Independent Feeding (Spoon & Cup)',
      desc: 'Feeds self with a child spoon/fork with minimal spills and drinks smoothly from an open cup.',
      tips: 'Offer chunky yogurt, oatmeal, and safe finger foods to practice utensil grasp.'
    },
    sorting_shapes_colors: {
      name: 'Sorting Colors & Shapes',
      desc: 'Sorts objects by primary color (red, blue, yellow) and recognizes circles and squares.',
      tips: 'Use colored sorting cups or plastic bowls to group colored blocks or toys.'
    },
    three_word_sentences: {
      name: '3-4 Word Sentences & Questions',
      desc: 'Speaks in 3 to 4 word sentences (e.g. "I want to play") and asks "Why?" or "Where?".',
      tips: 'Acknowledge questions warmly and expand their sentences into conversational stories.'
    },
    pedaling_tricycle: {
      name: 'Pedaling a Tricycle or Trike',
      desc: 'Rides and pedals a three-wheel tricycle or steerable balance trike forward.',
      tips: 'Practice on flat open pavements or hallway floors with gentle initial guidance.'
    },
    daytime_potty_training: {
      name: 'Daytime Potty Independence',
      desc: 'Recognizes urge to go, indicates in time, and stays dry throughout afternoon naps.',
      tips: 'Maintain a gentle routine sit after meals with zero pressure, celebrating every try.'
    },
    dressing_self: {
      name: 'Dressing with Minimal Assistance',
      desc: 'Pulls on elastic waist pants, puts on shoes without laces, and helps pull shirts over head.',
      tips: 'Choose easy-on clothing with elastic waistbands and practice on favorite play outfits.'
    },
    imaginative_roleplay: {
      name: 'Imaginative Pretend & Social Play',
      desc: 'Acts out doctor, chef, or parent roles with stuffed animals and shares toys with peers.',
      tips: 'Provide empty cardboard boxes, wooden spoons, and costume hats to spark creativity.'
    },
    counting_and_drawing: {
      name: 'Counting Objects & Drawing Circles',
      desc: 'Counts 1 to 4 objects accurately and copies a recognizable circle or cross on paper.',
      tips: 'Count snack crackers together and trace shapes in sand or shaving foam.'
    },
    standing_on_one_foot: {
      name: 'Balancing on One Foot & Hopping',
      desc: 'Balances on one foot for 3-5 seconds and hops forward on one foot with confidence.',
      tips: 'Play "flamingo stance" or draw simple sidewalk chalk hopscotch squares.'
    }
  },
  hi: {
    social_smile: {
      name: 'सामाजिक मुस्कान',
      desc: 'जब आप उनसे बात करते हैं या मुस्कुराते हैं तो वे वापस मुस्कुराते हैं।',
      tips: 'अपने बच्चे से आमने-सामने बात करें, अजीब भाव बनाएं और बार-बार मुस्कुराएं।'
    },
    babbling: {
      name: 'पहली बड़बड़ाहट',
      desc: 'स्वर और व्यंजन ध्वनियों का संयोजन बनाता है (जैसे "बा-बा" या "दा-दा")।',
      tips: 'अपने बच्चे की आवाज़ों का जवाब ऐसे दें जैसे आप वास्तविक बातचीत कर रहे हों।'
    },
    sitting_alone: {
      name: 'बिना सहारे के बैठना',
      desc: 'हाथों या सहारे पर झुके बिना लगातार सीधा बैठता है।',
      tips: 'खिलौनों को उनकी पहुंच से थोड़ा दूर रखें जब वे बैठते हैं ताकि उन्हें संतुलन बनाने में मदद मिल सके।'
    },
    crawling: {
      name: 'रेंगना (क्रॉलिंग)',
      desc: 'हाथों और घुटनों के बल चलना या पेट के बल रेंगना।',
      tips: 'टमी टाइम को प्रोत्साहित करें और रेंगने के लिए फर्श पर आकर्षक खिलौने रखें।'
    },
    waving: {
      name: 'बाय-बाय कहना',
      desc: 'लोगों को नमस्ते या अलविदा कहने के लिए हाथ हिलाता है।',
      tips: 'जब भी कोई जाए या आए तो हाथ हिलाएं और "बाय-बाय" कहें।'
    },
    first_words: {
      name: 'पहले शब्द',
      desc: 'अर्थ के साथ सरल स्पष्ट शब्द कहता है (जैसे "मम्मा", "पापा", "कुत्ता")।',
      tips: 'रोजमर्रा की चीजों की ओर इशारा करें और उन्हें स्पष्ट रूप से नाम दें ताकि वे वस्तुओं को शब्दों से जोड़ सकें।'
    },
    standing_alone: {
      name: 'अकेले खड़े होना',
      desc: 'कम से कम कुछ सेकंड के लिए बिना सहारे के खड़ा रहता है।',
      tips: 'खड़े होने के लिए उनका हाथ पकड़ें, फिर उन्हें संतुलित करने के लिए धीरे से एक हाथ छोड़ दें।'
    },
    walking: {
      name: 'पहला कदम और चलना',
      desc: 'स्वतंत्र रूप से कुछ कदम उठाता है या कमरे में घूमता है।',
      tips: 'मजबूत फर्नीचर के साथ एक सुरक्षित, खुला स्थान बनाएं जिससे वे सहारा लेकर चल सकें।'
    },
    scribbling: {
      name: 'लिखना/स्क्रैच करना',
      desc: 'क्रेयॉन पकड़ता है और कागज पर निशान या स्क्रिबल बनाता है।',
      tips: 'चित्र बनाने के लिए मोटे, गैर-विषाक्त क्रेयॉन और कागज की बड़ी शीट प्रदान करें।'
    },
    speaking_sentences: {
      name: 'सरल वाक्य',
      desc: 'किसी आवश्यकता या विचार को व्यक्त करने के लिए 2 या अधिक शब्दों को जोड़ता है (जैसे, "और दूध")।',
      tips: 'रोजाना मिलकर किताबें पढ़ें और खुले प्रश्न पूछें जैसे "कुत्ता क्या कर रहा है?"।'
    },
    running_jumping: {
      name: 'दौड़ना और कूदना',
      desc: 'बिना बार-बार गिरे आसानी से दौड़ता है और दोनों पैरों से ऊपर कूदता है।',
      tips: 'डांस गेम्स खेलें या तकियों पर सुरक्षित छलांग लगाने को कहें।'
    },
    spoon_cup_feeding: {
      name: 'चम्मच और कप से स्वयं खाना',
      desc: 'चम्मच से बिना गिराए भोजन करता है और खुले कप से आसानी से पीता है।',
      tips: 'दलिया, दही और फल देकर चम्मच पकड़ने का अभ्यास कराएं।'
    },
    sorting_shapes_colors: {
      name: 'रंग और आकार छांटना',
      desc: 'प्राथमिक रंगों के अनुसार खिलौनों को अलग करता है और वृत्त/चौकोर पहचानता है।',
      tips: 'रंगीन कटोरियों में रंगीन खिलौने छांटने का मजेदार खेल खेलें।'
    },
    three_word_sentences: {
      name: '3-4 शब्दों के वाक्य और प्रश्न',
      desc: '3 से 4 शब्दों वाले वाक्य बोलता है (जैसे "मुझे खेलने जाना है") और सवाल पूछता है।',
      tips: 'उनके सवालों का प्यार से जवाब दें और बातचीत को आगे बढ़ाएं।'
    },
    pedaling_tricycle: {
      name: 'ट्राइसाइकिल चलाना',
      desc: 'तीन पहियों वाली साइकिल को पैडल मारकर आगे चलाता है।',
      tips: 'समतल फर्श या पार्क में पैडल घुमाने का हल्का अभ्यास कराएं।'
    },
    daytime_potty_training: {
      name: 'दिन में पॉटी आत्मनिर्भरता',
      desc: 'शौचालय की आवश्यकता पहचानता है और समय पर सूचित करता है।',
      tips: 'भोजन के बाद बैठने का एक शांत, बिना दबाव वाला नियम बनाएं।'
    },
    dressing_self: {
      name: 'खुद कपड़े पहनना',
      desc: 'इलास्टिक वाली पैंट खींचता है और बिना फीते वाले जूते पहनता है।',
      tips: 'सरल इलास्टिक वाले कपड़े चुनें और उन्हें खुद पहनने के लिए प्रोत्साहित करें।'
    },
    imaginative_roleplay: {
      name: 'काल्पनिक खेल और अभिनय',
      desc: 'डॉक्टर, रसोइया या खिलौनों के साथ मिलकर कल्पित कहानियां बनाता है।',
      tips: 'साधारण कार्डबोर्ड बॉक्स और लकड़ी के बर्तनों से रोल-प्ले करवाएं।'
    },
    counting_and_drawing: {
      name: 'गिनती और गोला बनाना',
      desc: '1 से 4 वस्तुओं को सही गिनता है और कागज पर गोल आकृति बनाता है।',
      tips: 'बिस्कुट या फल गिनें और रेत पर उंगली से वृत्त बनाएं।'
    },
    standing_on_one_foot: {
      name: 'एक पैर पर संतुलन बनाना',
      desc: '3-5 सेकंड के लिए एक पैर पर खड़ा रहता है और आगे कूदता है।',
      tips: 'फ्लेमिंगो की तरह खड़े होने या हॉपस्कॉच खेलने का अभ्यास कराएं।'
    }
  },
  ta: {
    social_smile: {
      name: 'சமூகப் புன்னகை',
      desc: 'நீங்கள் பேசும்போது அல்லது புன்னகைக்கும்போது பதிலுக்கு புன்னகைக்கும்.',
      tips: 'உங்கள் குழந்தையுடன் நேருக்கு நேர் பேசுங்கள், வேடிக்கையான முகபாவங்களைச் செய்யுங்கள், அடிக்கடி புன்னகைக்கவும்.'
    },
    babbling: {
      name: 'முதல் மழலை மொழி',
      desc: 'உயிர் மற்றும் மெய் ஒலிகளின் சேர்க்கைகளை உருவாக்குகிறது ("பா-பா" அல்லது "டா-டா" போன்ற).',
      tips: 'உங்கள் குழந்தையின் ஒலிகளுக்கு நீங்கள் ஒரு உண்மையான உரையாடலை நடத்துவது போல பதிலளிக்கவும்.'
    },
    sitting_alone: {
      name: 'துணையின்றி உட்காருதல்',
      desc: 'கைகள் அல்லது ஆதரவில் சாயாமல் சீராக நிமிர்ந்து அமர்கிறது.',
      tips: 'அவர்கள் அமரும் போது சமநிலையைக் கற்றுக்கொள்ள பொம்மைகளை எட்டாத தூரத்தில் வைக்கவும்.'
    },
    crawling: {
      name: 'தவழ்தல்',
      desc: 'கைகள் மற்றும் முழங்கால்களில் நகர்வது அல்லது வயிற்றால் தவழ்வது.',
      tips: 'வயிற்றில் படுக்கும் நேரத்தை ஊக்குவிக்கவும் மற்றும் தவழ்வதற்கு தரையில் கவர்ச்சிகரமான பொம்மைகளை வைக்கவும்.'
    },
    waving: {
      name: 'டாடா காட்டுதல்',
      desc: 'மக்களுக்கு வணக்கம் அல்லது விடைபெற கையை அசைக்கிறது.',
      tips: 'யாராவது செல்லும்போது அல்லது வரும்போது கையை அசைத்து "டாடா" சொல்லுங்கள்.'
    },
    first_words: {
      name: 'முதல் வார்த்தைகள்',
      desc: 'அર્થமுள்ள எளிய தெளிவான சொற்களைக் கூறுகிறது ("அம்மா", "அப்பா" போன்ற).',
      tips: 'அன்றாட பொருட்களை சுட்டிக்காட்டி அவற்றின் பெயரை தெளிவாகக் கூறி அறிமுகப்படுத்துங்கள்.'
    },
    standing_alone: {
      name: 'துணையின்றி நிற்றல்',
      desc: 'குறைந்தது சில வினாடிகளுக்கு எந்த ஆதரவும் இல்லாமல் நிற்கிறது.',
      tips: 'நிற்க அவர்களின் கைகளைப் பிடித்து, பின்னர் அவர்கள் சமநிலைப்படுத்த ஒரு கையை மெதுவாக விடுவிக்கவும்.'
    },
    walking: {
      name: 'முதல் படிகள் & நடப்பது',
      desc: 'சுதந்திரமாக சில படிகள் நடக்கிறது அல்லது ஒரு அறையைக் கடந்து செல்கிறது.',
      tips: 'அவர்கள் பிடித்து நடக்க தகுந்தவாறு உறுதியான மரச்சாமான்களுடன் பாதுகாப்பான இடத்தை உருவாக்குங்கள்.'
    },
    scribbling: {
      name: 'வரைதல் (கிறுக்குதல்)',
      desc: 'கிரேயானைப் பிடித்து காகிதத்தில் கிறுக்குகிறது.',
      tips: 'வரைவதற்கு நச்சுத்தன்மையற்ற தடிமனான கிரேயான்கள் மற்றும் பெரிய தாள்களை வழங்கவும்.'
    },
    speaking_sentences: {
      name: 'எளிய வாக்கியங்கள்',
      desc: 'தேவை அல்லது யோசனையை வெளிப்படுத்த 2 அல்லது அதற்கு மேற்பட்ட சொற்களை இணைக்கிறது (எ.கா. "இன்னும் பால்").',
      tips: 'தினமும் ஒன்றாக புத்தகங்களைப் படியுங்கள் மற்றும் "நாய் என்ன செய்கிறது?" போன்ற கேள்விகளைக் கேளுங்கள்.'
    },
    running_jumping: {
      name: 'ஓடுதல் & குதித்தல்',
      desc: 'சீரான வேகத்தில் ஓடுகிறது மற்றும் இரண்டு கால்களையும் தூக்கி குதிக்கிறது.',
      tips: 'பாதுகாப்பான மெத்தைகளில் குதிக்கும் விளையாட்டுகளை விளையாடுங்கள்.'
    },
    spoon_cup_feeding: {
      name: 'சுயமாக உண்ணுதல் (கரண்டி & கோப்பை)',
      desc: 'கரண்டியால் சிந்தாமல் சாப்பிடுகிறது மற்றும் கோப்பையில் நீர் அருந்துகிறது.',
      tips: 'தயிர், கூழ் ஆகியவற்றை கரண்டியில் சுயமாக சாப்பிட ஊக்கப்படுத்துங்கள்.'
    },
    sorting_shapes_colors: {
      name: 'வண்ணங்கள் & வடிவங்களை பிரித்தல்',
      desc: 'வண்ணங்களின்படி பொருட்களை பிரிக்கிறது மற்றும் வட்டத்தை அடையாளம் காண்கிறது.',
      tips: 'வண்ண கிண்ணங்களில் வண்ண பொம்மைகளை அடுக்கும் விளையாட்டு விளையாடுங்கள்.'
    },
    three_word_sentences: {
      name: '3-4 வார்த்தை வாக்கியங்கள்',
      desc: '3 முதல் 4 வார்த்தைகள் கொண்ட வாக்கியங்களை பேசுகிறது மற்றும் கேள்விகள் கேட்கிறது.',
      tips: 'அவர்களின் கேள்விகளுக்கு கனிவாக பதிலளித்து உரையாடலை வளருங்கள்.'
    },
    pedaling_tricycle: {
      name: 'முச்சக்கர வண்டி ஓட்டுதல்',
      desc: 'முச்சக்கர வண்டியை மிதித்து முன்னோக்கி ஓட்டுகிறது.',
      tips: 'தட்டையான தரையில் மிதிவண்டியை மிதிக்க வழிகாட்டுங்கள்.'
    },
    daytime_potty_training: {
      name: 'பகல்நேர கழிப்பறை பழக்கம்',
      desc: 'கழிப்பறை தேவையை உணர்ந்து சரியான நேரத்தில் தெரிவிக்கிறது.',
      tips: 'உணவுக்குப் பிறகு அழுத்தமின்றி கழிப்பறையில் உட்காரப் பழக்குங்கள்.'
    },
    dressing_self: {
      name: 'சுயமாக ஆடை அணிதல்',
      desc: 'எளிய கால்சட்டைகளை தானே அணிகிறது மற்றும் காலணிகளை மாட்டுகிறது.',
      tips: 'எளிய நெகிழ்வான ஆடைகளை கொடுத்து தானே அணிய உதவுங்கள்.'
    },
    imaginative_roleplay: {
      name: 'கற்பனை விளையாட்டு & நடிப்பு',
      desc: 'பொம்மைகளுடன் மருத்துவர் அல்லது சமையல்காரர் போல நடித்து விளையாடுகிறது.',
      tips: 'அட்டைப் பெட்டிகள் மற்றும் கரண்டிகளை கொடுத்து விளையாட விடுங்கள்.'
    },
    counting_and_drawing: {
      name: 'எண்ணுதல் & வட்டம் வரைதல்',
      desc: '1 முதல் 4 வரை பொருட்களை சரியாக எண்ணுகிறது மற்றும் வட்டம் வரைகிறது.',
      tips: 'தின்பண்டங்களை எண்ணி விளையாடுங்கள் மற்றும் மணலில் வட்டம் வரையுங்கள்.'
    },
    standing_on_one_foot: {
      name: 'ஒற்றைக் காலில் நிற்றல்',
      desc: '3-5 வினாடிகள் ஒற்றைக் காலில் சமநிலையுடன் நிற்கிறது.',
      tips: 'நொண்டி விளையாட்டு மற்றும் சமநிலை பயிற்சிகளை செய்து பாருங்கள்.'
    }
  },
  te: {
    social_smile: {
      name: 'సామాజిక చిరునవ్వు',
      desc: 'మీరు మాట్లాడినప్పుడు లేదా నవ్వినప్పుడు ప్రతిస్పందనగా నవ్వుతుంది.',
      tips: 'మీ శిశువుతో ముఖాముఖి మాట్లాడండి, ఫన్నీ ఎక్స్‌ప్రెషన్స్ పెట్టండి మరియు తరచుగా నవ్వండి.'
    },
    babbling: {
      name: 'మొదటి ముద్దు మాటలు',
      desc: 'అచ్చు మరియు హల్లు శబ్దాల కలయికలను చేస్తుంది ("బా-బా" లేదా "దా-దా" వంటివి).',
      tips: 'మీ శిశువు చేసే శబ్దాలకు నిజమైన సంభాషణ లాగా స్పందించండి.'
    },
    sitting_alone: {
      name: 'సహాయం లేకుండా కూర్చోవడం',
      desc: 'చేతులు లేదా ఇతర ఆధారాలు లేకుండా స్థిరంగా నిటారుగా కూర్చుంటుంది.',
      tips: 'వారు కూర్చున్నప్పుడు సమతుల్యత కోసం బొమ్మలను కొంచెం దూరంలో ఉంచండి.'
    },
    crawling: {
      name: 'పాకడం (ప్రాకడం)',
      desc: 'చేతులు మరియు మోకాళ్లపై కదలడం లేదా పొట్టపై ప్రాకడం.',
      tips: 'పొట్టపై పడుకునే సమయాన్ని ప్రోత్సహించండి మరియు నేలపై ఆకర్షణీయమైన బొమ్మలను ఉంచండి.'
    },
    waving: {
      name: 'టాటా చెప్పడం',
      desc: 'ప్రజలకు హలో లేదా గుడ్‌బై చెప్పడానికి చేతిని ఊపుతుంది.',
      tips: 'ఎవరైనా వెళ్లేటప్పుడు లేదా వచ్చేటప్పుడు చేతులు ఊపుతూ "టాటా" చెప్పండి.'
    },
    first_words: {
      name: 'మొదటి పదాలు',
      desc: 'అర్థవంతమైన సాధారణ స్పష్టమైన పదాలను చెబుతుంది ("అమ్మ", "నాన్న" వంటివి).',
      tips: 'రోజువారీ వస్తువులను చూపిస్తూ వాటి పేర్లను స్పష్టంగా చెప్పండి.'
    },
    standing_alone: {
      name: 'సహాయం లేకుండా నిలబడడం',
      desc: 'కనీసం కొన్ని సెకన్ల పాటు ఎలాంటి మద్దతు లేకుండా నిలబడుతుంది.',
      tips: 'నిలబడటానికి వారి చేతులను పట్టుకుని, ఆపై బ్యాలెన్స్ కోసం మెల్లగా ఒక చేతిని వదిలేయండి.'
    },
    walking: {
      name: 'మొదటి అడుగులు & నడక',
      desc: 'స్వతంత్రంగా కొన్ని అడుగులు వేస్తుంది లేదా గదిలో నడుస్తుంది.',
      tips: 'వారు పట్టుకుని నడవడానికి వీలుగా బలమైన ఫర్నిచర్‌తో సురక్షితమైన స్థలాన్ని ఏర్పాటు చేయండి.'
    },
    scribbling: {
      name: 'గీతలు గీయడం',
      desc: 'క్రేయాన్‌ను పట్టుకుని కాగితంపై గీతలు గీస్తుంది.',
      tips: 'చిత్రాలు గీయడానికి విషరహిత క్రేయాన్లు మరియు పెద్ద కాగితాలను ఇవ్వండి.'
    },
    speaking_sentences: {
      name: 'సాధారణ వాక్యాలు',
      desc: 'అవసరాన్ని లేదా ఆలోచనను వ్యక్తీకరించడానికి 2 లేదా అంతకంటే ఎక్కువ పదాలను కలుపుతుంది (ఉదా. "ఇంకా పాలు").',
      tips: 'రోజూ కలిసి పుస్తకాలు చదవండి మరియు "కుక్క ఏమి చేస్తోంది?" వంటి ప్రశ్నలు అడగండి.'
    },
    running_jumping: {
      name: 'పరుగెత్తడం & దూకడం',
      desc: 'కింద పడకుండా స్థిరంగా పరుగెత్తుతుంది మరియు రెండు కాళ్లతో పైకి ఎగురుతుంది.',
      tips: 'డ్యాన్స్ ఆటలు లేదా దిండ్లపై చిన్నగా దూకే ఆటలు ఆడించండి.'
    },
    spoon_cup_feeding: {
      name: 'స్వయంగా చెంచాతో తినడం & కప్పుతో తాగడం',
      desc: 'చెంచాతో ఆహారాన్ని కింద పడకుండా తింటుంది మరియు కప్పుతో తాగుతుంది.',
      tips: 'పెరుగు, పండ్ల ముక్కలతో చెంచాను స్వయంగా పట్టుకోవడం అలవాటు చేయండి.'
    },
    sorting_shapes_colors: {
      name: 'రంగులు మరియు ఆకారాలను వేరుచేయడం',
      desc: 'రంగుల ప్రకారం వస్తువులను వేరుచేస్తుంది మరియు గుండ్రటి ఆకారాన్ని గుర్తిస్తుంది.',
      tips: 'రంగుల గిన్నెలలో బొమ్మలను అమర్చే సరదా ఆటలు ఆడించండి.'
    },
    three_word_sentences: {
      name: '3-4 పదాల వాక్యాలు & ప్రశ్నలు',
      desc: '3 నుండి 4 పదాల వాక్యాలు మాట్లాడుతుంది మరియు ప్రశ్నలు అడుగుతుంది.',
      tips: 'వారి ప్రశ్నలకు ఆప్యాయంగా సమాధానం ఇస్తూ సంభాషణను పెంచండి.'
    },
    pedaling_tricycle: {
      name: 'ట్రైసికిల్ తొక్కడం',
      desc: 'మూడు చక్రాల సైకిల్‌ను పెడల్ చేస్తూ ముందుకు నడుపుతుంది.',
      tips: 'చదునైన నేలపై నెమ్మదిగా పెడల్ తొక్కడం నేర్పించండి.'
    },
    daytime_potty_training: {
      name: 'పగటిపూట పాటీ అలవాటు',
      desc: 'టాయిలెట్ అవసరాన్ని గుర్తించి సరైన సమయానికి తెలియజేస్తుంది.',
      tips: 'భోజనం తర్వాత ప్రశాంతంగా పాటీపై కూర్చోబెట్టే నియమం పాటించండి.'
    },
    dressing_self: {
      name: 'స్వయంగా బట్టలు వేసుకోవడం',
      desc: 'ఎలాస్టిక్ ప్యాంట్లు వేసుకుంటుంది మరియు షూస్ తొడుక్కుంటుంది.',
      tips: 'సులభమైన దుస్తులను ఇచ్చి వారే వేసుకునేలా ప్రోత్సహించండి.'
    },
    imaginative_roleplay: {
      name: 'ఊహాజనిత ఆటలు & నటన',
      desc: 'బొమ్మలతో డాక్టర్ లేదా చెఫ్ లాగా నటిస్తూ స్వయంగా కథలు సృష్టిస్తుంది.',
      tips: 'కార్డ్‌బోర్డ్ బాక్స్‌లు ఇచ్చి ఊహాత్మక ఆటలను ఆడించండి.'
    },
    counting_and_drawing: {
      name: 'లెక్కింపు & సున్నా గీయడం',
      desc: '1 నుండి 4 వస్తువులను సరిగ్గా లెక్కిస్తుంది మరియు కాగితంపై సున్నా గీస్తుంది.',
      tips: 'స్నాక్స్ లెక్కిస్తూ లేదా ఇసుకలో ఆకారాలు గీస్తూ ప్రాక్టీస్ చేయించండి.'
    },
    standing_on_one_foot: {
      name: 'ఒంటికాలిపై బ్యాలెన్స్ చేయడం',
      desc: '3-5 సెకన్ల పాటు ఒంటికాలిపై నిలబడుతుంది మరియు ముందుకు గెంతుతుంది.',
      tips: 'ఫ్లెమింగో భంగిమ లేదా తొక్కుడు బిళ్ళ ఆటను ప్రాక్టీస్ చేయించండి.'
    }
  }
};

const localT: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "Milestone Tracker",
    heroDesc: "Celebrate every magical step!",
    aiCoach: "AI Development Coach",
    aiTitle: "Generate WHO, Indian IAP & FSSAI Developmental Assessment",
    aiDesc: "Based on the milestones you log, our pediatric AI engine compares your child's timeline with standard WHO, Indian IAP and FSSAI ranges to deliver helpful, positive guidelines and personalized play ideas.",
    loggedReady: "Milestone(s) logged and ready for analysis!",
    logUnlock: "Log a milestone below to unlock a personalized timeline analysis!",
    analyzing: "Analyzing Timelines...",
    analyzeBtn: "Analyze with AI Guide",
    reportTitle: "WHO, Indian IAP & FSSAI Development Coach Report",
    reportLoading: "The Coach is drafting a tailored developmental blueprint for your child...",
    majorMilestones: "Major Developmental Milestones",
    expectedRange: "Expected WHO, IAP & FSSAI Range:",
    months: "Months",
    month: "Month",
    recordedAt: "Recorded at",
    on: "on",
    notLogged: "Not yet logged",
    whatToLookFor: "What to look for",
    activityTip: "Developmental Activity Tip",
    editRecord: "Edit Milestone Record",
    recordAchievement: "Record Achievement",
    ageLabel: "Age Achieved (Months):",
    dateLabel: "Date Achieved",
    notesLabel: "Parent Notes & Special Memories",
    notesPlaceholder: "Describe how they reached this step, any funny sounds, or cute behaviors! (e.g. 'Took 3 steps to reach grandma and giggled so much!')",
    removeRecord: "Remove Record",
    cancel: "Cancel",
    saveMemory: "Save Memory",
    sweetMemory: "Sweet Memory",
    sureDelete: "Are you sure you want to remove this logged milestone?",
    loadingLogs: "Loading milestone logs..."
  },
  hi: {
    heroTitle: "मील का पत्थर ट्रैकर",
    heroDesc: "हर जादुई कदम का जश्न मनाएं!",
    aiCoach: "एआई विकास कोच",
    aiTitle: "डब्ल्यूएचओ विकास मूल्यांकन जनरेट करें",
    aiDesc: "आपके द्वारा रिकॉर्ड किए गए मील के पत्थरों के आधार पर, हमारा पीडियाट्रिक एआई इंजन मददगार, सकारात्मक दिशानिर्देश और व्यक्तिगत खेल विचार प्रदान करने के लिए डब्ल्यूएचओ श्रेणियों के साथ तुलना करता है।",
    loggedReady: "मील के पत्थर रिकॉर्ड किए गए हैं और विश्लेषण के लिए तैयार हैं!",
    logUnlock: "व्यक्तिगत समयरेखा विश्लेषण अनलॉक करने के लिए नीचे एक मील का पत्थर रिकॉर्ड करें!",
    analyzing: "समयरेखा का विश्लेषण किया जा रहा है...",
    analyzeBtn: "एआई गाइड के साथ विश्लेषण करें",
    reportTitle: "डब्ल्यूएचओ विकास कोच रिपोर्ट",
    reportLoading: "कोच आपके बच्चे के लिए एक अनुकूलित विकास खाका तैयार कर रहा है...",
    majorMilestones: "प्रमुख विकासात्मक मील के पत्थर",
    expectedRange: "अपेक्षित डब्ल्यूएचओ सीमा:",
    months: "महीने",
    month: "महीना",
    recordedAt: "पर रिकॉर्ड किया गया",
    on: "को",
    notLogged: "अभी तक रिकॉर्ड नहीं किया गया",
    whatToLookFor: "क्या देखना है",
    activityTip: "विकासात्मक गतिविधि टिप",
    editRecord: "मील का पत्थर रिकॉर्ड संपादित करें",
    recordAchievement: "उपलब्धि रिकॉर्ड करें",
    ageLabel: "प्राप्त उम्र (महीने):",
    dateLabel: "प्राप्त तिथि",
    notesLabel: "अभिभावक नोट्स और विशेष यादें",
    notesPlaceholder: "वर्णन करें कि वे इस कदम तक कैसे पहुंचे, कोई अजीब आवाज़ या प्यारा व्यवहार! (जैसे 'दादी तक पहुँचने के लिए 3 कदम उठाए और बहुत मुस्कुराया!')",
    removeRecord: "रिकॉर्ड हटाएं",
    cancel: "रद्द करें",
    saveMemory: "याद सहेजें",
    sweetMemory: "मीठी याद",
    sureDelete: "क्या आप वाकई इस रिकॉर्ड किए गए मील के पत्थर को हटाना चाहते हैं?",
    loadingLogs: "मील का पत्थर लॉग लोड हो रहा है..."
  },
  ta: {
    heroTitle: "மைல்கல் ட்ராக்கர்",
    heroDesc: "ஒவ்வொரு மாயாஜால படியையும் கொண்டாடுங்கள்!",
    aiCoach: "AI வளர்ச்சிப் பயிற்சியாளர்",
    aiTitle: "WHO வளர்ச்சி மதிப்பீட்டை உருவாக்குங்கள்",
    aiDesc: "நீங்கள் பதிவு செய்யும் மைல்கற்களின் அடிப்படையில், எங்களது குழந்தை நல AI இயந்திரம் உங்கள் குழந்தையின் காலவரிசையை WHO தரநிலைகளுடன் ஒப்பிட்டு, பயனுள்ள, நேர்மறையான வழிகாட்டுதல்கள் மற்றும் தனிப்பயனாக்கப்பட்ட விளையாட்டு யோசனைகளை வழங்குகிறது.",
    loggedReady: "மைல்கற்கள் பதிவு செய்யப்பட்டு பகுப்பாய்விற்கு தயாராக உள்ளன!",
    logUnlock: "தனிப்பயனாக்கப்பட்ட காலவரிசை பகுப்பாய்வைத் திறக்க கீழே ஒரு மைல்கல்லைப் பதிவுசெய்க!",
    analyzing: "காலவரிசைகளை பகுப்பாய்வு செய்கிறது...",
    analyzeBtn: "AI வழிகாட்டியுடன் பகுப்பாய்வு செய்",
    reportTitle: "WHO வளர்ச்சி பயிற்சியாளர் அறிக்கை",
    reportLoading: "பயிற்சியாளர் உங்கள் குழந்தைக்காக வடிவமைக்கப்பட்ட வளர்ச்சி திட்டத்தை தயாரித்து வருகிறார்...",
    majorMilestones: "முக்கிய வளர்ச்சி மைல்கற்கள்",
    expectedRange: "எதிர்பார்க்கப்படும் WHO வரம்பு:",
    months: "மாதங்கள்",
    month: "மாதம்",
    recordedAt: "பதிவு செய்யப்பட்ட வயது",
    on: "தேதி",
    notLogged: "இன்னும் பதிவு செய்யப்படவில்லை",
    whatToLookFor: "எதைக் கவனிக்க வேண்டும்",
    activityTip: "வளர்ச்சி நடவடிக்கை உதவிக்குறிப்பு",
    editRecord: "மைல்கல் பதிவைத் திருத்து",
    recordAchievement: "மைல்கல்லைப் பதிவுசெய்",
    ageLabel: "அடைந்த வயது (மாதங்கள்):",
    dateLabel: "அடைந்த தேதி",
    notesLabel: "பெற்றோர் குறிப்புகள் & சிறப்பு நினைவுகள்",
    notesPlaceholder: "அவர்கள் இந்த படியை எவ்வாறு அடைந்தார்கள், ஏதேனும் வேடிக்கையான ஒலிகள் அல்லது அழகான நடத்தைகளை விவரிக்கவும்! (எ.கா. 'பாட்டியை அடைய 3 படிகள் நடந்து மிகவும் சிரித்தார்!')",
    removeRecord: "பதிவை நீக்கு",
    cancel: "ரத்துசெய்",
    saveMemory: "நினைவைச் சேமி",
    sweetMemory: "இனிமையான நினைவு",
    sureDelete: "இந்தப் பதிவை நீக்க விரும்புகிறீர்களா?",
    loadingLogs: "மைல்கல் பதிவுகள் ஏற்றப்படுகின்றன..."
  },
  te: {
    heroTitle: "మైలురాళ్ళ ట్రాకర్",
    heroDesc: "ప్రతి మాయా అడుగును వేడుక చేసుకోండి!",
    aiCoach: "AI అభివృద్ధి కోచ్",
    aiTitle: "WHO అభివృద్ధి అంచనాను రూపొందించండి",
    aiDesc: "మీరు నమోదు చేసిన మైలురాళ్ల ఆధారంగా, మా పీడియాట్రిక్ AI ఇంజిన్ మీ శిశువు అభివృద్ధిని WHO ప్రమాణాలతో పోల్చి, సహాయకరమైన, సానుకూల మార్గదర్శకాలను మరియు వ్యక్తిగతీకరించిన ఆటల ఆలోచనలను అందిస్తుంది.",
    loggedReady: "మైలురాళ్లు నమోదు చేయబడ్డాయి మరియు విశ్లేషణకు సిద్ధంగా ఉన్నాయి!",
    logUnlock: "వ్యక్తిగతీకరించిన విశ్లేషణను అన్‌లాక్ చేయడానికి క్రింద ఒక మైలురాయిని నమోదు చేయండి!",
    analyzing: "విశ్లేషిస్తోంది...",
    analyzeBtn: "AI గైడ్‌తో విశ్లేషించండి",
    reportTitle: "WHO అభివృద్ధి కోచ్ నివేదిక",
    reportLoading: "కోచ్ మీ శిశువు కోసం ప్రత్యేక అభివృద్ధి ప్రణాళికను సిద్ధం చేస్తున్నారు...",
    majorMilestones: "ప్రధాన అభివృద్ధి మైలురాళ్లు",
    expectedRange: "ఆశించిన WHO పరిధి:",
    months: "నెలలు",
    month: "నెల",
    recordedAt: "నమోదు చేసిన వయస్సు",
    on: "తేదీ",
    notLogged: "ఇంకా నమోదు చేయలేదు",
    whatToLookFor: "ఏమి గమనించాలి",
    activityTip: "అభివృద్ధి కార్యాచరణ చిట్కా",
    editRecord: "మైలురాయి రికార్డును సవరించండి",
    recordAchievement: "విజయాన్ని నమోదు చేయి",
    ageLabel: "సాధించిన వయస్సు (నెలలు):",
    dateLabel: "సాధించిన తేదీ",
    notesLabel: "తల్లిదండ్రుల గమనికలు & జ్ఞాపకాలు",
    notesPlaceholder: "వారు ఈ దశను ఎలా చేరుకున్నారో, ఏదైనా ఫన్నీ శబ్దాలు లేదా అందమైన ప్రవర్తనలను వివరించండి! (ఉదా. 'నానమ్మను చేరుకోవడానికి 3 అడుగులు వేసి బాగా నవ్వింది!')",
    removeRecord: "రికార్డును తొలగించు",
    cancel: "రద్దు చేయి",
    saveMemory: "జ్ఞాపకాన్ని సేవ్ చేయి",
    sweetMemory: "మధుర జ్ఞాపకం",
    sureDelete: "మీరు నిజంగా ఈ మైలురాయి రికార్డును తొలగించాలనుకుంటున్నారా?",
    loadingLogs: "మైలురాయి లాగ్‌లను లోడ్ చేస్తోంది..."
  }
};

interface MilestoneDefinition {
  id: string;
  name: string;
  emoji?: string;
  icon: React.ComponentType<{ className?: string }>;
  whoRangeStart: number; // in months
  whoRangeEnd: number;   // in months
  desc: string;          // friendly description
  tips: string;          // developmental tip
}

const MILESTONES: MilestoneDefinition[] = [
  {
    id: 'social_smile',
    name: 'Social Smile',
    icon: Heart,
    whoRangeStart: 1,
    whoRangeEnd: 3,
    desc: 'Smiles back when you talk to or smile at them.',
    tips: 'Talk to your baby face-to-face, make funny expressions, and smile often.'
  },
  {
    id: 'babbling',
    name: 'First Babble',
    icon: MessageSquare,
    whoRangeStart: 4,
    whoRangeEnd: 7,
    desc: 'Makes vowel and consonant sound combinations (like "ba-ba" or "da-da").',
    tips: 'Respond to your baby\'s sounds as if you are having a real conversation.'
  },
  {
    id: 'sitting_alone',
    name: 'Sitting Without Support',
    icon: Baby,
    whoRangeStart: 5,
    whoRangeEnd: 9,
    desc: 'Sits upright steadily without leaning on hands or support.',
    tips: 'Place toys just out of reach while they sit to help them balance.'
  },
  {
    id: 'crawling',
    name: 'Crawling',
    icon: Activity,
    whoRangeStart: 6,
    whoRangeEnd: 11,
    desc: 'Moves around on hands and knees or tummy-crawling.',
    tips: 'Encourage tummy time and put enticing toys on the floor to crawl toward.'
  },
  {
    id: 'waving',
    name: 'Waving Bye-Bye',
    icon: Sparkles,
    whoRangeStart: 8,
    whoRangeEnd: 12,
    desc: 'Waves hand to say hello or goodbye to people.',
    tips: 'Wave and say "bye-bye" whenever anyone leaves or arrives.'
  },
  {
    id: 'first_words',
    name: 'First Words',
    icon: MessageSquare,
    whoRangeStart: 9,
    whoRangeEnd: 14,
    desc: 'Says simple clear words with meaning (like "Mama", "Papa", "Dog").',
    tips: 'Point to everyday items and name them clearly so they link objects to words.'
  },
  {
    id: 'standing_alone',
    name: 'Standing Alone',
    icon: Footprints,
    whoRangeStart: 10,
    whoRangeEnd: 15,
    desc: 'Stands unsupported for at least a few seconds.',
    tips: 'Hold their hands to stand up, then gently release one hand to let them balance.'
  },
  {
    id: 'walking',
    name: 'First Steps & Walking',
    icon: Footprints,
    whoRangeStart: 11,
    whoRangeEnd: 16,
    desc: 'Takes a few steps independently or walks across a room.',
    tips: 'Create a safe, open space with sturdy furniture they can cruise along.'
  },
  {
    id: 'scribbling',
    name: 'Scribbling',
    icon: PenTool,
    whoRangeStart: 12,
    whoRangeEnd: 18,
    desc: 'Holds a crayon and makes marks or scribbles on paper.',
    tips: 'Provide chunky, non-toxic crayons and large sheets of paper for drawing.'
  },
  {
    id: 'speaking_sentences',
    name: 'Simple Sentences',
    icon: MessageSquare,
    whoRangeStart: 18,
    whoRangeEnd: 24,
    desc: 'Combines 2 or more words to express a need or idea (e.g., "more milk").',
    tips: 'Read books together daily and ask open questions like "What is the dog doing?".'
  },
  {
    id: 'running_jumping',
    name: 'Running & Jumping in Place',
    icon: Footprints,
    whoRangeStart: 24,
    whoRangeEnd: 30,
    desc: 'Runs steadily without frequent falling and jumps off the ground with both feet.',
    tips: 'Play freeze dance or encourage gentle hops over soft floor pillows.'
  },
  {
    id: 'spoon_cup_feeding',
    name: 'Independent Feeding (Spoon & Cup)',
    icon: Sparkles,
    whoRangeStart: 24,
    whoRangeEnd: 32,
    desc: 'Feeds self with a child spoon/fork with minimal spills and drinks smoothly from an open cup.',
    tips: 'Offer chunky yogurt, oatmeal, and safe finger foods to practice utensil grasp.'
  },
  {
    id: 'sorting_shapes_colors',
    name: 'Sorting Colors & Shapes',
    icon: Brain,
    whoRangeStart: 28,
    whoRangeEnd: 36,
    desc: 'Sorts objects by primary color (red, blue, yellow) and recognizes circles and squares.',
    tips: 'Use colored sorting cups or plastic bowls to group colored blocks or toys.'
  },
  {
    id: 'three_word_sentences',
    name: '3-4 Word Sentences & Questions',
    icon: MessageSquare,
    whoRangeStart: 30,
    whoRangeEnd: 36,
    desc: 'Speaks in 3 to 4 word sentences (e.g. "I want to play") and asks "Why?" or "Where?".',
    tips: 'Acknowledge questions warmly and expand their sentences into conversational stories.'
  },
  {
    id: 'pedaling_tricycle',
    name: 'Pedaling a Tricycle or Trike',
    icon: Activity,
    whoRangeStart: 32,
    whoRangeEnd: 40,
    desc: 'Rides and pedals a three-wheel tricycle or steerable balance trike forward.',
    tips: 'Practice on flat open pavements or hallway floors with gentle initial guidance.'
  },
  {
    id: 'daytime_potty_training',
    name: 'Daytime Potty Independence',
    icon: ShieldCheck,
    whoRangeStart: 30,
    whoRangeEnd: 42,
    desc: 'Recognizes urge to go, indicates in time, and stays dry throughout afternoon naps.',
    tips: 'Maintain a gentle routine sit after meals with zero pressure, celebrating every try.'
  },
  {
    id: 'dressing_self',
    name: 'Dressing with Minimal Assistance',
    icon: Shirt,
    whoRangeStart: 36,
    whoRangeEnd: 44,
    desc: 'Pulls on elastic waist pants, puts on shoes without laces, and helps pull shirts over head.',
    tips: 'Choose easy-on clothing with elastic waistbands and practice on favorite play outfits.'
  },
  {
    id: 'imaginative_roleplay',
    name: 'Imaginative Pretend & Social Play',
    icon: Sparkles,
    whoRangeStart: 36,
    whoRangeEnd: 46,
    desc: 'Acts out doctor, chef, or parent roles with stuffed animals and shares toys with peers.',
    tips: 'Provide empty cardboard boxes, wooden spoons, and costume hats to spark creativity.'
  },
  {
    id: 'counting_and_drawing',
    name: 'Counting Objects & Drawing Circles',
    icon: Calculator,
    whoRangeStart: 40,
    whoRangeEnd: 48,
    desc: 'Counts 1 to 4 objects accurately and copies a recognizable circle or cross on paper.',
    tips: 'Count snack crackers together and trace shapes in sand or shaving foam.'
  },
  {
    id: 'standing_on_one_foot',
    name: 'Balancing on One Foot & Hopping',
    icon: Activity,
    whoRangeStart: 42,
    whoRangeEnd: 48,
    desc: 'Balances on one foot for 3-5 seconds and hops forward on one foot with confidence.',
    tips: 'Play "flamingo stance" or draw simple sidewalk chalk hopscotch squares.'
  },

  // 5 to 10 Years (Middle Childhood)
  {
    id: 'reading_5_10',
    name: 'Reading',
    icon: BookOpen,
    whoRangeStart: 60,
    whoRangeEnd: 84,
    desc: 'Reads grade-level books independently, understands sentence structures, and explains plots and main ideas.',
    tips: 'Encourage daily 20-minute quiet reading time, explore library storybooks, and discuss book characters.'
  },
  {
    id: 'writing_5_10',
    name: 'Writing',
    icon: PenTool,
    whoRangeStart: 60,
    whoRangeEnd: 84,
    desc: 'Writes legibly with correct letter casing, composes short stories or journal entries, and spells common words correctly.',
    tips: 'Provide creative journals, encourage thank-you notes or cards for family members, and celebrate creative thoughts.'
  },
  {
    id: 'basic_mathematics_5_10',
    name: 'Basic mathematics',
    icon: Calculator,
    whoRangeStart: 60,
    whoRangeEnd: 96,
    desc: 'Understands addition, subtraction, basic multiplication, counting currency, and reading clock time accurately.',
    tips: 'Use baking measurements, board game scores, and shopping coin counting to reinforce practical math.'
  },
  {
    id: 'problem_solving_5_10',
    name: 'Problem-solving',
    icon: Brain,
    whoRangeStart: 72,
    whoRangeEnd: 108,
    desc: 'Solves multi-step logic puzzles, understands cause and effect, and develops strategies in board games like chess and carrom.',
    tips: 'Introduce strategy board games, jigsaw puzzles, and ask open-ended questions like "How else could we solve this?".'
  },
  {
    id: 'attention_focus_5_10',
    name: 'Attention & focus',
    icon: Target,
    whoRangeStart: 60,
    whoRangeEnd: 96,
    desc: 'Maintains sustained concentration on schoolwork, hobbies, or complex tasks for 25 to 45 minutes.',
    tips: 'Establish distraction-free study zones, set visual timers, and break long projects into short focused intervals.'
  },
  {
    id: 'running_jumping_5_10',
    name: 'Running & jumping',
    icon: Footprints,
    whoRangeStart: 60,
    whoRangeEnd: 84,
    desc: 'Demonstrates agility, jumping over obstacles, skipping rope rhythmically, and sprint-and-stop games.',
    tips: 'Play jump rope, obstacle courses in parks, and active games like hopscotch and playground tag.'
  },
  {
    id: 'sports_coordination_5_10',
    name: 'Sports & coordination',
    icon: Activity,
    whoRangeStart: 72,
    whoRangeEnd: 120,
    desc: 'Plays structured team sports (football, cricket, swimming), rides a 2-wheel bicycle without stabilizers, and shows hand-eye coordination.',
    tips: 'Support regular outdoor physical play, practice catching and batting, and emphasize teamwork over winning.'
  },
  {
    id: 'fine_motor_skills_5_10',
    name: 'Fine-motor skills',
    icon: Scissors,
    whoRangeStart: 60,
    whoRangeEnd: 96,
    desc: 'Cuts intricate shapes with safety scissors, ties shoelaces securely, and uses craft tools and utensils adeptly.',
    tips: 'Engage in origami, clay modeling, sewing craft kits, and building intricate construction block models.'
  },
  {
    id: 'personal_hygiene_5_10',
    name: 'Personal hygiene',
    icon: Sparkles,
    whoRangeStart: 60,
    whoRangeEnd: 84,
    desc: 'Brushes teeth thoroughly for 2 minutes, washes and dries hands with soap, showers, and brushes hair independently.',
    tips: 'Create a visual morning and bedtime hygiene checklist and praise consistent independent self-care.'
  },
  {
    id: 'dressing_independently_5_10',
    name: 'Dressing independently',
    icon: Shirt,
    whoRangeStart: 60,
    whoRangeEnd: 84,
    desc: 'Selects weather-appropriate attire, fastens buttons, snaps, zippers, and ties shoes without adult assistance.',
    tips: 'Let them pick their school clothes the evening before to foster autonomy and time awareness.'
  },
  {
    id: 'making_friends_5_10',
    name: 'Making friends',
    icon: Users,
    whoRangeStart: 60,
    whoRangeEnd: 108,
    desc: 'Initiates conversations with peers, shows empathy, listens to others, and builds mutual friendships.',
    tips: 'Host playdates, facilitate community group activities, and discuss how to be a welcoming and loyal friend.'
  },
  {
    id: 'sharing_teamwork_5_10',
    name: 'Sharing & teamwork',
    icon: Users,
    whoRangeStart: 60,
    whoRangeEnd: 96,
    desc: 'Cooperates in team projects, shares responsibilities and resources, and resolves playground disagreements constructively.',
    tips: 'Encourage cooperative family board games and praise collaborative problem solving.'
  },
  {
    id: 'emotional_expression_5_10',
    name: 'Emotional expression',
    icon: Heart,
    whoRangeStart: 60,
    whoRangeEnd: 108,
    desc: 'Articulates complex feelings like frustration, excitement, jealousy, or disappointment verbally rather than acting out.',
    tips: 'Label emotions without judgment, validate their feelings, and teach calming deep-breathing techniques.'
  },
  {
    id: 'following_routines_5_10',
    name: 'Following routines',
    icon: Clock,
    whoRangeStart: 60,
    whoRangeEnd: 96,
    desc: 'Follows morning, schoolwork, and bedtime routines reliably with minimal verbal prompting.',
    tips: 'Keep a predictable daily family rhythm and use a shared calendar or whiteboard chart.'
  },
  {
    id: 'taking_responsibility_5_10',
    name: 'Taking responsibility',
    icon: ShieldCheck,
    whoRangeStart: 72,
    whoRangeEnd: 120,
    desc: 'Takes ownership of personal belongings, completes assigned household chores, and admits mistakes truthfully.',
    tips: 'Assign age-appropriate duties like setting the dinner table or feeding pets, and praise honest accountability.'
  },

  // 10 to 15 Years (Early Adolescence & Puberty)
  {
    id: 'abstract_thinking_10_15',
    name: 'Abstract thinking',
    icon: Brain,
    whoRangeStart: 120,
    whoRangeEnd: 156,
    desc: 'Grasps conceptual metaphors, algebraic variables, philosophical questions, and theoretical scientific principles.',
    tips: 'Discuss hypothetical scenarios and current events at the dinner table without forcing single right answers.'
  },
  {
    id: 'critical_thinking_10_15',
    name: 'Critical thinking',
    icon: Brain,
    whoRangeStart: 120,
    whoRangeEnd: 168,
    desc: 'Analyzes information objectively, questions assumptions, detects bias in media, and formulates evidence-based arguments.',
    tips: 'Encourage friendly family debates, analyze news headlines together, and ask "What evidence supports that?".'
  },
  {
    id: 'independent_learning_10_15',
    name: 'Independent learning',
    icon: BookOpen,
    whoRangeStart: 120,
    whoRangeEnd: 168,
    desc: 'Researches school topics independently, seeks answers to personal curiosities online, and reads widely outside the curriculum.',
    tips: 'Provide access to quality educational resources, books, and science kits, applauding self-directed curiosity.'
  },
  {
    id: 'study_habits_10_15',
    name: 'Study habits',
    icon: PenTool,
    whoRangeStart: 120,
    whoRangeEnd: 168,
    desc: 'Organizes study materials, takes structured notes, prepares for exams proactively, and avoids last-minute cramming.',
    tips: 'Teach active recall and spaced repetition techniques, helping them create a dedicated quiet study sanctuary.'
  },
  {
    id: 'time_management_10_15',
    name: 'Time management',
    icon: Clock,
    whoRangeStart: 132,
    whoRangeEnd: 180,
    desc: 'Balances academic deadlines, extracurricular sports, family commitments, and digital screen time autonomously.',
    tips: 'Introduce digital or planner tools (Google Calendar, Notion) and encourage setting weekly priorities.'
  },
  {
    id: 'puberty_awareness_10_15',
    name: 'Puberty awareness',
    icon: Activity,
    whoRangeStart: 120,
    whoRangeEnd: 156,
    desc: 'Understands physical maturation, reproductive health, hormonal changes, and normalized emotional shifts.',
    tips: 'Foster an open, judgment-free environment for answering questions about bodily growth and sexual health.'
  },
  {
    id: 'body_changes_10_15',
    name: 'Body changes',
    icon: Sparkles,
    whoRangeStart: 120,
    whoRangeEnd: 156,
    desc: 'Adapts positively to growth spurts, voice changes, facial skin care, and healthy body image development.',
    tips: 'Promote positive body neutrality, provide suitable skincare products, and emphasize nutrition over appearance.'
  },
  {
    id: 'physical_fitness_10_15',
    name: 'Physical fitness',
    icon: Activity,
    whoRangeStart: 120,
    whoRangeEnd: 180,
    desc: 'Engages in regular cardiovascular exercise, strength building, flexibility training, and competitive athletics.',
    tips: 'Support participation in school athletics, swimming, cycling, or yoga to build lifelong healthy physical habits.'
  },
  {
    id: 'emotional_regulation_10_15',
    name: 'Emotional regulation',
    icon: Heart,
    whoRangeStart: 120,
    whoRangeEnd: 168,
    desc: 'Recognizes emotional triggers, uses calming strategies during anger or anxiety, and avoids impulsive reactivity.',
    tips: 'Model calm problem-solving under stress and encourage creative outlets like journaling, music, or sports.'
  },
  {
    id: 'self_confidence_10_15',
    name: 'Self-confidence',
    icon: Target,
    whoRangeStart: 120,
    whoRangeEnd: 180,
    desc: 'Values personal strengths, accepts constructive feedback, expresses unique opinions, and bounces back from setbacks.',
    tips: 'Praise effort, perseverance, and genuine character rather than innate talent or test scores.'
  },
  {
    id: 'building_friendships_10_15',
    name: 'Building friendships',
    icon: Users,
    whoRangeStart: 120,
    whoRangeEnd: 180,
    desc: 'Forms loyal, reciprocal friendships founded on mutual respect, shared ethical values, and emotional trust.',
    tips: 'Welcome their friends home, provide privacy for conversations, and discuss healthy friendship boundaries.'
  },
  {
    id: 'handling_peer_pressure_10_15',
    name: 'Handling peer pressure',
    icon: ShieldCheck,
    whoRangeStart: 120,
    whoRangeEnd: 180,
    desc: 'Maintains personal boundaries, resists risky trends or coercion, and makes principled independent choices.',
    tips: 'Role-play graceful refusal strategies and reassure them that true friends respect individual boundaries.'
  },
  {
    id: 'developing_identity_10_15',
    name: 'Developing identity',
    icon: Compass,
    whoRangeStart: 132,
    whoRangeEnd: 180,
    desc: 'Explores personal interests, moral values, cultural heritage, creative expression, and emerging personal identity.',
    tips: 'Support their evolving interests (music, coding, art) even if they differ from family traditions.'
  },
  {
    id: 'making_decisions_10_15',
    name: 'Making decisions',
    icon: CheckCircle2,
    whoRangeStart: 120,
    whoRangeEnd: 168,
    desc: 'Weighs pros and cons, evaluates long-term consequences, and makes informed personal and academic decisions.',
    tips: 'Involve them in real family decisions and guide them to evaluate options rather than deciding for them.'
  },
  {
    id: 'taking_responsibility_10_15',
    name: 'Taking responsibility',
    icon: ShieldCheck,
    whoRangeStart: 120,
    whoRangeEnd: 180,
    desc: 'Takes full accountability for academic commitments, digital conduct, family chores, and behavioral mistakes.',
    tips: 'Allow natural consequences when safe to do so, reinforcing that accountability is a hallmark of maturity.'
  },

  // 15 to 18 Years (Late Adolescence & Young Adulthood)
  {
    id: 'critical_reasoning_15_18',
    name: 'Critical reasoning',
    icon: Brain,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Analyzes complex societal, economic, and ethical issues, synthesizes nuanced arguments, and assesses credibility.',
    tips: 'Engage in thoughtful discussions about current world affairs, law, and ethics as intellectual equals.'
  },
  {
    id: 'independent_decision_making_15_18',
    name: 'Independent decision-making',
    icon: Compass,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Makes autonomous decisions regarding education streams, relationships, time allocation, and ethical dilemmas.',
    tips: 'Transition from directing to mentoring, offering guidance while respecting their ultimate choices.'
  },
  {
    id: 'goal_setting_15_18',
    name: 'Goal setting',
    icon: Target,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Formulates realistic short and long-term academic, career, and personal goals with actionable milestones.',
    tips: 'Review vision boards or annual goals together, discussing resilience when plans need adjustment.'
  },
  {
    id: 'career_exploration_15_18',
    name: 'Career exploration',
    icon: Briefcase,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Researches professional industries, internships, vocational options, and connects with industry mentors.',
    tips: 'Help arrange shadowing experiences or informational interviews with professionals across diverse sectors.'
  },
  {
    id: 'higher_education_planning_15_18',
    name: 'Higher-education planning',
    icon: GraduationCap,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Prepares entrance examinations, manages college applications, compiles portfolios, and researches scholarships.',
    tips: 'Establish a college application timeline tracker and provide emotional reassurance during testing periods.'
  },
  {
    id: 'financial_awareness_15_18',
    name: 'Financial awareness',
    icon: DollarSign,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Manages personal bank accounts, understands compound interest, budgeting, digital payments, and cyber financial safety.',
    tips: 'Help them open a bank account, practice monthly expense tracking, and introduce basic investment concepts.'
  },
  {
    id: 'time_management_15_18',
    name: 'Time management',
    icon: Clock,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Balances demanding academic schedules, test prep, part-time work or volunteering, sleep, and social commitments.',
    tips: 'Encourage boundary setting and guarding at least 8 hours of restorative sleep each night.'
  },
  {
    id: 'healthy_lifestyle_15_18',
    name: 'Healthy lifestyle',
    icon: Activity,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Maintains balanced nutritional choices, regular physical exercise, adequate hydration, and active stress management.',
    tips: 'Discuss the long-term impact of sleep hygiene, balanced whole foods, and avoiding burnout habits.'
  },
  {
    id: 'emotional_maturity_15_18',
    name: 'Emotional maturity',
    icon: Heart,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Demonstrates deep empathy, processes relationship conflicts constructively, and shows resilience through disappointment.',
    tips: 'Listen actively without offering immediate solutions; validate their emotional depth and growth.'
  },
  {
    id: 'self_awareness_15_18',
    name: 'Self-awareness',
    icon: Compass,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Understands personal values, cognitive strengths, weaknesses, learning style, and personal identity.',
    tips: 'Encourage mindfulness, reflective journaling, and identifying core personal values.'
  },
  {
    id: 'communication_skills_15_18',
    name: 'Communication skills',
    icon: MessageSquare,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Communicates articulately in writing and speech, conducts professional emails/interviews, and practices active listening.',
    tips: 'Practice mock job/college interviews and encourage public speaking or debate opportunities.'
  },
  {
    id: 'household_life_skills_15_18',
    name: 'Household & life skills',
    icon: Home,
    whoRangeStart: 180,
    whoRangeEnd: 216,
    desc: 'Prepares nutritious balanced meals, manages laundry, basic home maintenance, and schedules medical appointments.',
    tips: 'Hand over full ownership of laundry, room cleaning, and preparing dinner for the family once a week.'
  },
  {
    id: 'independent_adult_15_18',
    name: 'Independent Adult',
    icon: ShieldCheck,
    whoRangeStart: 192,
    whoRangeEnd: 216,
    desc: 'Understands legal civic responsibilities, voter registration, managing official identification, and self-sufficiency.',
    tips: 'Guide them through voter ID, driving license, and banking documentation as they cross the threshold into adulthood.'
  }
];

interface LoggedMilestone {
  milestoneId: string;
  achievedAge: number;
  achievedDate: string;
  notes: string;
}

export const MilestoneTracker: React.FC = () => {
  const { user } = useAuth();
  const [loggedMilestones, setLoggedMilestones] = useState<Record<string, LoggedMilestone>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState<'all' | '0-6' | '6-12' | '12-24' | '24-36' | '36-48' | '60-120' | '120-180' | '180-216'>('all');

  const { language, getAIPromptModifier } = useLanguage();
  const currentL = (language === 'hi' || language === 'ta' || language === 'te') ? language : 'en';
  const lt = (key: string) => {
    const dict = localT[currentL] || localT['en'];
    return dict[key] || localT['en'][key] || key;
  };

  // Edit fields
  const [editAge, setEditAge] = useState<number>(6);
  const [editDate, setEditDate] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  // AI state
  const [aiReport, setAiReport] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch from Firebase
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMilestones = async () => {
      try {
        const q = query(
          collection(db, 'milestones'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const dataMap: Record<string, LoggedMilestone> = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dataMap[data.milestoneId] = {
            milestoneId: data.milestoneId,
            achievedAge: data.achievedAge,
            notes: data.notes || '',
            achievedDate: data.achievedDate || ''
          };
        });
        setLoggedMilestones(dataMap);
      } catch (err) {
        console.error("Error fetching milestones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [user]);

  const handleExpand = (id: string) => {
    playSound('click');
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const existing = loggedMilestones[id];
      if (existing) {
        setEditAge(existing.achievedAge);
        setEditDate(existing.achievedDate);
        setEditNotes(existing.notes);
      } else {
        const def = MILESTONES.find(m => m.id === id);
        setEditAge(def ? Math.round((def.whoRangeStart + def.whoRangeEnd) / 2) : 6);
        setEditDate(new Date().toISOString().split('T')[0]);
        setEditNotes('');
      }
    }
  };

  const handleSave = async (milestoneId: string) => {
    if (!user) return;
    setSavingId(milestoneId);
    playSound('pop');

    try {
      const docRef = doc(db, 'milestones', `${user.uid}_${milestoneId}`);
      const payload = {
        userId: user.uid,
        milestoneId,
        achievedAge: Number(editAge),
        achievedDate: editDate,
        notes: editNotes,
        updatedAt: new Date().toISOString()
      };

      await setDoc(docRef, payload);

      setLoggedMilestones(prev => ({
        ...prev,
        [milestoneId]: {
          milestoneId,
          achievedAge: Number(editAge),
          achievedDate: editDate,
          notes: editNotes
        }
      }));

      setExpandedId(null);
      playSound('glass');
    } catch (err) {
      console.error("Error saving milestone:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (milestoneId: string) => {
    if (!user) return;
    playSound('click');
    if (!window.confirm(lt('sureDelete'))) return;

    setSavingId(milestoneId);
    try {
      const docRef = doc(db, 'milestones', `${user.uid}_${milestoneId}`);
      await deleteDoc(docRef);

      setLoggedMilestones(prev => {
        const copy = { ...prev };
        delete copy[milestoneId];
        return copy;
      });

      setExpandedId(null);
      playSound('click');
    } catch (err) {
      console.error("Error deleting milestone:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleAiAnalysis = async () => {
    playSound('glass');

    const loggedArray = (Object.values(loggedMilestones) as LoggedMilestone[]).map(m => {
      const def = MILESTONES.find(d => d.id === m.milestoneId);
      const mTrans = def ? (milestoneTranslations[currentL]?.[def.id] || milestoneTranslations['en']?.[def.id] || def) : null;
      return {
        name: mTrans?.name || m.milestoneId,
        achievedAge: m.achievedAge,
        whoRange: `${def?.whoRangeStart} - ${def?.whoRangeEnd} ${lt('months')}`,
        notes: m.notes || 'None'
      };
    });

    if (loggedArray.length === 0) {
      setAiReport("**No milestones logged yet!**\n\nPlease log at least one milestone achievement in the list below (click on any milestone card and click 'Record Achievement') to generate your personalized WHO, Indian IAP & FSSAI developmental assessment.");
      return;
    }

    setAiLoading(true);
    setAiReport('');

    try {
      const res = await fetch('/api/analyze-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loggedMilestones: loggedArray,
          languagePromptModifier: getAIPromptModifier()
        })
      });
      const data = await res.json();
      setAiReport(data.report || "Milestone assessment generated.");
    } catch (err) {
      console.error("Error generating AI analysis:", err);
      setAiReport("Oh! The AI Milestone Coach encountered an unexpected issue. Please try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  const loggedCount = Object.keys(loggedMilestones).length;

  const filteredMilestones = MILESTONES.filter(m => {
    if (ageFilter === 'all') return true;
    if (ageFilter === '0-6') return m.whoRangeStart < 6;
    if (ageFilter === '6-12') return (m.whoRangeStart >= 6 && m.whoRangeStart < 12) || (m.whoRangeEnd > 6 && m.whoRangeStart < 12);
    if (ageFilter === '12-24') return (m.whoRangeStart >= 12 && m.whoRangeStart < 24) || (m.whoRangeEnd > 12 && m.whoRangeStart < 24);
    if (ageFilter === '24-36') return (m.whoRangeStart >= 24 && m.whoRangeStart < 36) || (m.whoRangeEnd > 24 && m.whoRangeStart < 36);
    if (ageFilter === '36-48') return (m.whoRangeStart >= 36 && m.whoRangeStart < 60) || (m.whoRangeEnd > 36 && m.whoRangeStart < 60);
    if (ageFilter === '60-120') return (m.whoRangeStart >= 60 && m.whoRangeStart < 120) || (m.whoRangeEnd > 60 && m.whoRangeStart < 120);
    if (ageFilter === '120-180') return (m.whoRangeStart >= 120 && m.whoRangeStart < 180) || (m.whoRangeEnd > 120 && m.whoRangeStart < 180);
    if (ageFilter === '180-216') return m.whoRangeStart >= 180 || m.whoRangeEnd > 180;
    return true;
  });

  return (
    <div className="w-full text-white font-sans max-w-6xl mx-auto py-2 sm:py-4">
      {/* Hero Section */}
      <header className="text-center mb-4 sm:mb-5">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 mb-2.5"
        >
          <Baby className="w-4 h-4 text-cheerful-blue animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-white/80">World Health Organization Standards</span>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1.5 tracking-tight uppercase">
          {lt('heroTitle')}
        </h1>
        <p className="text-white/60 text-xs sm:text-sm w-full max-w-3xl mx-auto px-2 font-normal leading-relaxed">
          {lt('heroDesc')}
        </p>
      </header>

      {/* AI Milestone Insights Box */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 relative overflow-hidden mb-5 sm:mb-6 shadow-xl bg-gradient-to-br from-indigo-950/20 via-transparent to-transparent"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-cheerful-blue/5 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 text-cheerful-blue font-black uppercase text-[11px] tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {lt('aiCoach')}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mb-1">
              {lt('aiTitle')}
            </h2>
            <p className="text-white/60 text-xs w-full max-w-2xl leading-relaxed">
              {lt('aiDesc')}
            </p>
            {loggedCount > 0 ? (
              <div className="mt-2.5 inline-flex items-center gap-2 text-[11px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {loggedCount} {lt('loggedReady')}
              </div>
            ) : (
              <div className="mt-2.5 inline-flex items-center gap-2 text-[11px] bg-cheerful-yellow/10 border border-cheerful-yellow/20 text-cheerful-yellow px-2.5 py-1 rounded-lg font-bold">
                <Info className="w-3 h-3" />
                {lt('logUnlock')}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleAiAnalysis}
              disabled={aiLoading}
              className="w-full lg:w-auto px-6 py-2.5 sm:py-3 bg-cheerful-blue hover:bg-cheerful-blue/90 text-slate-950 font-black rounded-xl uppercase text-xs tracking-wider flex items-center justify-center gap-2.5 transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-cheerful-blue/15 disabled:opacity-50 disabled:pointer-events-none"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  {lt('analyzing')}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {lt('analyzeBtn')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Streaming report container */}
        <AnimatePresence>
          {(aiReport || aiLoading) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 border-t border-white/5 pt-8 text-left relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none rounded-2xl border border-white/5" />
              <div className="relative p-5 md:p-6 text-sm leading-relaxed text-white/80 max-w-none">
                <div className="flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest mb-4">
                  <BookOpen className="w-4 h-4 text-cheerful-blue" />
                  {lt('reportTitle')}
                </div>
                {aiLoading && !aiReport && (
                  <div className="flex items-center gap-3 text-white/50 py-4 font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-cheerful-blue" />
                    <span>{lt('reportLoading')}</span>
                  </div>
                )}
                {aiReport && (
                  <div className="prose prose-invert max-w-none text-white/90 text-left">
                    <Markdown
                      components={{
                        h1: ({ children }) => <h1 className="text-xl md:text-2xl font-black text-white mt-6 mb-3 flex items-center gap-2 border-b border-white/10 pb-1.5 tracking-tight">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg md:text-xl font-black text-cheerful-blue mt-5 mb-2.5 tracking-tight">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base md:text-lg font-black text-emerald-400 mt-4 mb-2 tracking-tight">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 text-white/80 leading-relaxed text-sm md:text-base font-medium">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2 font-medium">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2 font-medium">{children}</ol>,
                        li: ({ children }) => <li className="text-sm md:text-base text-white/75 leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-extrabold text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-white/60">{children}</em>,
                      }}
                    >
                      {aiReport}
                    </Markdown>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Milestone Age Filters (Clean, with Major Milestones text removed) */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/5 border border-white/10 rounded-2xl mb-8 max-w-fit mx-auto">
        {[
          { id: 'all', label: 'All Ages (0-18 Yrs)' },
          { id: '0-6', label: '0 - 6 M' },
          { id: '6-12', label: '6 - 12 M' },
          { id: '12-24', label: '1 - 2 Yrs' },
          { id: '24-36', label: '2 - 3 Yrs' },
          { id: '36-48', label: '3 - 4 Yrs' },
          { id: '60-120', label: '5 - 10 Yrs' },
          { id: '120-180', label: '10 - 15 Yrs' },
          { id: '180-216', label: '15 - 18 Yrs' },
        ].map((tab) => {
          const isActive = ageFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSound('pop');
                setAgeFilter(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cheerful-blue text-slate-950 shadow-md font-black scale-[1.02]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/40 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cheerful-blue" />
          <span className="font-bold text-sm tracking-wider uppercase">{lt('loadingLogs')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMilestones.map((milestone) => {
            const logged = loggedMilestones[milestone.id];
            const isExpanded = expandedId === milestone.id;
            const mTrans = milestoneTranslations[currentL]?.[milestone.id] || milestoneTranslations['en']?.[milestone.id] || milestone;
            const maxScale = milestone.whoRangeEnd > 180 ? 216 : milestone.whoRangeEnd > 120 ? 180 : milestone.whoRangeEnd > 48 ? 120 : 48;
            const IconComponent = milestone.icon || Award;

            return (
              <motion.div
                key={milestone.id}
                layout="position"
                className={`glass-card border-2 transition-all duration-300 rounded-3xl overflow-hidden text-left ${
                  logged 
                    ? 'border-emerald-500/20 hover:border-emerald-500/30 bg-emerald-950/[0.02]' 
                    : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => handleExpand(milestone.id)}
                  className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
                      <IconComponent className="w-7 h-7 text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        {mTrans.name}
                        {logged && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
                            {lt('sweetMemory')}
                          </span>
                        )}
                      </h4>
                      <p className="text-white/40 text-xs mt-0.5 max-w-md font-bold uppercase tracking-wider">
                        {lt('expectedRange')}{' '}
                        <span className="text-white/70">
                          {milestone.whoRangeStart >= 60
                            ? `${Math.floor(milestone.whoRangeStart / 12)}-${Math.ceil(milestone.whoRangeEnd / 12)} Years (${milestone.whoRangeStart}-${milestone.whoRangeEnd} ${lt('months')})`
                            : `${milestone.whoRangeStart} - ${milestone.whoRangeEnd} ${lt('months')}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status & Toggle button */}
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t border-white/5 pt-3 md:pt-0 md:border-0">
                    <div className="text-right">
                      {logged ? (
                        <div>
                          <div className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                            {lt('recordedAt')}{' '}
                            {logged.achievedAge >= 24
                              ? `${(logged.achievedAge / 12).toFixed(logged.achievedAge % 12 === 0 ? 0 : 1)} Yrs (${logged.achievedAge}m)`
                              : `${logged.achievedAge} ${logged.achievedAge > 1 ? lt('months') : lt('month')}`}
                          </div>
                          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                            {lt('on')} {logged.achievedDate}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs font-black uppercase text-white/30 tracking-widest flex items-center gap-1.5">
                          <span>{lt('notLogged')}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* WHO, Indian IAP & FSSAI Range Chart Visualization & Expand Panel */}
                <div className="px-5 md:px-6 pb-6 select-none">
                  {/* Small inline visual bar */}
                  <div className="w-full bg-white/5 rounded-full h-2.5 mt-2 mb-2 relative border border-white/5 overflow-hidden">
                    {/* Shaded WHO, Indian IAP & FSSAI Expected range */}
                    <div 
                      className="absolute bg-cheerful-blue/30 h-full rounded-full"
                      style={{
                        left: `${(milestone.whoRangeStart / maxScale) * 100}%`,
                        width: `${Math.min(100, ((milestone.whoRangeEnd - milestone.whoRangeStart) / maxScale) * 100)}%`
                      }}
                    />
                    {/* Logged point marker */}
                    {logged && (
                      <div 
                        className="absolute bg-emerald-400 border border-white w-3 h-3 -top-[2px] rounded-full shadow-lg"
                        style={{
                          left: `${Math.min(100, Math.max(0, (logged.achievedAge / maxScale) * 100))}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    )}
                  </div>
                  {milestone.whoRangeStart >= 60 ? (
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-white/30 px-1">
                      <span>{milestone.whoRangeStart >= 180 ? '15 Yrs (180m)' : milestone.whoRangeStart >= 120 ? '10 Yrs (120m)' : '5 Yrs (60m)'}</span>
                      <span>{milestone.whoRangeStart >= 180 ? '16 Yrs (192m)' : milestone.whoRangeStart >= 120 ? '12 Yrs (144m)' : '7 Yrs (84m)'}</span>
                      <span>{milestone.whoRangeStart >= 180 ? '17 Yrs (204m)' : milestone.whoRangeStart >= 120 ? '13 Yrs (156m)' : '8 Yrs (96m)'}</span>
                      <span>{milestone.whoRangeStart >= 180 ? '18 Yrs (216m)' : milestone.whoRangeStart >= 120 ? '15 Yrs (180m)' : '10 Yrs (120m)'}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-white/30 px-1">
                      <span>1 {lt('month')}</span>
                      <span>12m (1y)</span>
                      <span>24m (2y)</span>
                      <span>36m (3y)</span>
                      <span>48m (4y)</span>
                    </div>
                  )}
                </div>

                {/* Expand Panel Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/5 bg-white/[0.01]"
                    >
                      <div className="p-6 space-y-6">
                        {/* Description & Tips */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h5 className="text-xs font-black uppercase tracking-widest text-cheerful-blue flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5" />
                              {lt('whatToLookFor')}
                            </h5>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">
                              {mTrans.desc}
                            </p>
                          </div>
                          <div className="space-y-2 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                            <h5 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                              <Heart className="w-3.5 h-3.5 text-cheerful-pink" />
                              {lt('activityTip')}
                            </h5>
                            <p className="text-xs text-white/60 leading-relaxed font-bold">
                              {mTrans.tips}
                            </p>
                          </div>
                        </div>

                        {/* Editor Form */}
                        <div className="bg-white/5 p-5 rounded-2.5xl border border-white/5 space-y-4">
                          <h5 className="text-xs font-black uppercase tracking-widest text-white/50">
                            {logged ? lt('editRecord') : lt('recordAchievement')}
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Age input */}
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                                {lt('ageLabel')} {editAge} {editAge >= 24 ? `(${ (editAge / 12).toFixed(editAge % 12 === 0 ? 0 : 1) } Yrs)` : ''}
                              </label>
                              <div className="flex items-center gap-4">
                                <input 
                                  type="range" 
                                  min={milestone.whoRangeStart >= 60 ? Math.max(1, milestone.whoRangeStart - 12) : 1} 
                                  max={milestone.whoRangeEnd > 48 ? 216 : 48} 
                                  step="1"
                                  value={editAge}
                                  onChange={(e) => {
                                    setEditAge(Number(e.target.value));
                                    playSound('click');
                                  }}
                                  className="flex-1 accent-cheerful-blue cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                                />
                                <input 
                                  type="number" 
                                  min={milestone.whoRangeStart >= 60 ? Math.max(1, milestone.whoRangeStart - 12) : 1} 
                                  max={milestone.whoRangeEnd > 48 ? 216 : 48}
                                  value={editAge}
                                  onChange={(e) => setEditAge(Math.min(216, Math.max(1, Number(e.target.value))))}
                                  className="w-20 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1 text-center font-black text-sm text-white focus:outline-none focus:border-cheerful-blue"
                                />
                              </div>
                            </div>

                            {/* Date Picker */}
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                                {lt('dateLabel')}
                              </label>
                              <div className="relative">
                                <input 
                                  type="date" 
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 font-bold text-sm text-white focus:outline-none focus:border-cheerful-blue cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Notes input */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                              {lt('notesLabel')}
                            </label>
                            <textarea 
                              placeholder={lt('notesPlaceholder')}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  // Enter / Shift+Enter for line break, never submit or select button
                                  e.stopPropagation();
                                }
                              }}
                              maxLength={1000}
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold text-xs text-white focus:outline-none focus:border-cheerful-blue resize-y placeholder-white/20 leading-relaxed"
                            />
                          </div>

                          {/* Buttons row */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div>
                              {logged && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(milestone.id)}
                                  disabled={savingId !== null}
                                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {lt('removeRecord')}
                                </button>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedId(null);
                                  playSound('click');
                                }}
                                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/55 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                              >
                                {lt('cancel')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSave(milestone.id)}
                                disabled={savingId !== null}
                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                              >
                                {savingId === milestone.id ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    {lt('saving')}
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {lt('saveMemory')}
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Existing user memory log card if logged */}
                        {logged && logged.notes && (
                          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 flex items-center gap-1">
                              <Heart className="w-3 h-3 fill-emerald-400" />
                              {lt('sweetMemory')}
                            </h6>
                            <p className="text-xs text-white/80 leading-relaxed font-medium select-text">
                              "{logged.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
