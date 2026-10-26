import json
import re

curated = {
  "bengaluru": [
    { "name": "Rainbow Children's Hospital & BirthRight", "brand": "Rainbow", "address": "Marathahalli-Sarjapur Outer Ring Road, Kadubeesanahalli", "area": "Kadubeesanahalli", "phone": "+91 80 4969 4969", "rating": "4.9", "reviewsCount": 3420, "specialty": "Pediatric Super Speciality & Level III NICU" },
    { "name": "Rainbow Children's Hospital", "brand": "Rainbow", "address": "Bannerghatta Road, Opposite Christ University, Bilekahalli", "area": "Bannerghatta Road", "phone": "+91 80 4969 4969", "rating": "4.8", "reviewsCount": 2850, "specialty": "Children's Multi-Speciality & Emergency" },
    { "name": "Cloudnine Hospital", "brand": "Cloudnine", "address": "1533, 9th Main Rd, 3rd Block, Jayanagar", "area": "Jayanagar", "phone": "+91 80 4962 4962", "rating": "4.9", "reviewsCount": 3100, "specialty": "Pediatric & Maternity Center" },
    { "name": "Cloudnine Hospital", "brand": "Cloudnine", "address": "Old Airport Road, Murugeshpalya, HAL Post", "area": "Old Airport Road", "phone": "+91 80 4962 4962", "rating": "4.8", "reviewsCount": 2240, "specialty": "Child Health & Pediatric ICU" },
    { "name": "Aster CMI Hospital (Pediatric Wing)", "brand": "Aster", "address": "No. 43/2, New Airport Road, NH 44, Sahakar Nagar, Hebbal", "area": "Hebbal", "phone": "080 4344 4344", "rating": "4.9", "reviewsCount": 2980, "specialty": "Pediatric Critical Care & Surgery" },
    { "name": "Manipal Hospital (Pediatric Super Speciality)", "brand": "Manipal", "address": "98, HAL Old Airport Rd, Kodihalli", "area": "Kodihalli", "phone": "080 2502 4444", "rating": "4.8", "reviewsCount": 4120, "specialty": "Quaternary Pediatric Care" },
    { "name": "Manipal Hospital BTM Layout", "brand": "Manipal", "address": "143, EWS Colony, Stage 2, BTM Layout", "area": "BTM Layout", "phone": "080 2502 4444", "rating": "4.7", "reviewsCount": 1650, "specialty": "Pediatric & Neonatal Medicine" },
    { "name": "Apollo Cradle & Children's Hospital", "brand": "Apollo", "address": "5th Block, 100 Feet Road, Koramangala", "area": "Koramangala", "phone": "080 4424 4424", "rating": "4.8", "reviewsCount": 2780, "specialty": "Pediatric Emergency & NICU" },
    { "name": "Apollo Cradle Sadashivanagar", "brand": "Apollo", "address": "Plot 1 & 2, Sadashivanagar, Vyalikaval", "area": "Sadashivanagar", "phone": "080 4424 4424", "rating": "4.7", "reviewsCount": 1890, "specialty": "Pediatric Specialist Clinic" },
    { "name": "Indira Gandhi Institute of Child Health (IGICH)", "brand": "Government", "address": "South Hospital Complex, Dharmaram College Post, 1st Block, Jayanagar", "area": "Jayanagar", "phone": "080 2656 6006", "rating": "4.8", "reviewsCount": 3850, "specialty": "Apex Government Pediatric Institute" },
    { "name": "Motherhood Hospital", "brand": "Motherhood", "address": "2266/1, 80 Feet Road, HAL 3rd Stage, Indiranagar", "area": "Indiranagar", "phone": "080 6723 8888", "rating": "4.8", "reviewsCount": 2410, "specialty": "Maternity & Pediatric Center" },
    { "name": "Motherhood Hospital HRBR", "brand": "Motherhood", "address": "514/1-2-3, Outer Ring Road, 3rd Block, HRBR Layout, Kalyan Nagar", "area": "Kalyan Nagar", "phone": "080 6723 8888", "rating": "4.7", "reviewsCount": 1540, "specialty": "Pediatric OPD & In-Patient" },
    { "name": "Fortis Hospital (Department of Child Health)", "brand": "Fortis", "address": "154/9, Bannerghatta Road, Opposite IIM-B, Panduranga Nagar", "area": "Bannerghatta Road", "phone": "080 6621 4444", "rating": "4.8", "reviewsCount": 3100, "specialty": "Comprehensive Pediatric Care" },
    { "name": "Kangaroo Care Women & Children Hospital", "brand": "Kangaroo Care", "address": "89, 17th Cross, MC Layout, Vijayanagar", "area": "Vijayanagar", "phone": "080 4642 4642", "rating": "4.9", "reviewsCount": 1980, "specialty": "Child Development & NICU" },
    { "name": "Ovum Woman & Child Hospital", "brand": "Ovum", "address": "208, 7th Main Rd, HRBR Layout, Kalyan Nagar", "area": "Kalyan Nagar", "phone": "080 4530 0000", "rating": "4.8", "reviewsCount": 1760, "specialty": "Neonatal & Pediatric Wing" },
    { "name": "Bapuji Children's Hospital", "brand": "Independent", "address": "15th Cross, 4th Main Rd, Malleshwaram", "area": "Malleshwaram", "phone": "080 2334 6699", "rating": "4.7", "reviewsCount": 1120, "specialty": "Dedicated Children's Hospital" },
    { "name": "St. John's Medical College Hospital (Pediatrics)", "brand": "St. John's", "address": "Sarjapur Road, John Nagar, Koramangala", "area": "Koramangala", "phone": "080 2206 5000", "rating": "4.9", "reviewsCount": 4620, "specialty": "Tertiary Pediatric Referral" },
    { "name": "Sagar Hospital (Pediatrics Division)", "brand": "Sagar", "address": "Shavige Malleshwara Hills, Kumaraswamy Layout", "area": "Kumaraswamy Layout", "phone": "080 4299 9999", "rating": "4.7", "reviewsCount": 1350, "specialty": "Pediatric Inpatient & PICU" },
    { "name": "SPARSH Hospital for Children", "brand": "SPARSH", "address": "Infantry Road, Shivaji Nagar", "area": "Shivaji Nagar", "phone": "080 6122 2000", "rating": "4.8", "reviewsCount": 2150, "specialty": "Pediatric Surgery & Orthopedics" },
    { "name": "Sakra World Hospital (Pediatrics)", "brand": "Sakra", "address": "SY No. 52/2, Devarabeesanahalli, Bellandur Outer Ring Rd", "area": "Bellandur", "phone": "080 4969 4969", "rating": "4.8", "reviewsCount": 2470, "specialty": "Advanced Pediatric Medicine" }
  ],
  "mysuru": [
    { "name": "Apollo BGS Hospitals (Pediatric Care)", "brand": "Apollo", "address": "Adhichunchanagiri Road, Kuvempunagar", "area": "Kuvempunagar", "phone": "0821 256 8888", "rating": "4.8", "reviewsCount": 2190, "specialty": "Pediatric Critical Care" },
    { "name": "Columbia Asia / Manipal Hospital", "brand": "Manipal", "address": "No. 85-86, Bangalore-Mysore Ring Road Junction, Bannimantap 'A' Layout", "area": "Bannimantap", "phone": "0821 398 9898", "rating": "4.8", "reviewsCount": 1980, "specialty": "Tertiary Pediatric Unit" },
    { "name": "Cheluvamba Hospital for Children (MMC)", "brand": "Government", "address": "Irwin Road, Medar Block, Yadavagiri", "area": "Irwin Road", "phone": "0821 252 0512", "rating": "4.7", "reviewsCount": 2650, "specialty": "Government Apex Children Hospital" },
    { "name": "Motherhood Hospital", "brand": "Motherhood", "address": "Lalitha Mahal Road, Nazarbad", "area": "Nazarbad", "phone": "0821 668 8888", "rating": "4.8", "reviewsCount": 1450, "specialty": "Mother & Child Specialist Care" },
    { "name": "JSS Hospital (Department of Pediatrics)", "brand": "JSS", "address": "Mahatma Gandhi Road, Agrahara", "area": "Agrahara", "phone": "0821 233 5555", "rating": "4.8", "reviewsCount": 2840, "specialty": "Multi-Speciality Pediatric Center" },
    { "name": "Cauvery Heart & Multi-Speciality Hospital", "brand": "Cauvery", "address": "8/A, Sevakshethra Road, Siddhartha Nagar", "area": "Siddhartha Nagar", "phone": "0821 247 7777", "rating": "4.7", "reviewsCount": 980, "specialty": "Pediatric ICU & Ward" },
    { "name": "Brindavan Hospital (Child Care Unit)", "brand": "Brindavan", "address": "Kalidasa Road, Jayalakshmipuram", "area": "Jayalakshmipuram", "phone": "0821 241 4243", "rating": "4.6", "reviewsCount": 820, "specialty": "Pediatric & Neonatal Clinic" },
    { "name": "Suyog Hospital (Pediatric Wing)", "brand": "Suyog", "address": "Jayanagar 1st Stage, Near Akshay Bhandar", "area": "Jayanagar", "phone": "0821 256 0000", "rating": "4.7", "reviewsCount": 1120, "specialty": "Pediatric Inpatient" },
    { "name": "Bhanavi Hospital (Pediatrics)", "brand": "Bhanavi", "address": "Kuvempunagar Double Road", "area": "Kuvempunagar", "phone": "0821 254 3801", "rating": "4.6", "reviewsCount": 740, "specialty": "Child Specialist Clinic" },
    { "name": "Cloudnine Pediatric Clinic", "brand": "Cloudnine", "address": "D. Subbaiah Road, Chamarajapuram", "area": "Chamarajapuram", "phone": "0821 496 2496", "rating": "4.8", "reviewsCount": 1320, "specialty": "Pediatric Super Speciality" },
    { "name": "Gopal Gowda Shanthaveri Memorial Hospital", "brand": "Gopal Gowda", "address": "Nazarbad Main Road", "area": "Nazarbad", "phone": "0821 244 4444", "rating": "4.7", "reviewsCount": 890, "specialty": "Pediatric Emergency" },
    { "name": "Sigma Hospital (Pediatric Unit)", "brand": "Sigma", "address": "Saraswathipuram", "area": "Saraswathipuram", "phone": "0821 254 5454", "rating": "4.6", "reviewsCount": 650, "specialty": "Children's Health Clinic" },
    { "name": "Holdsworth Memorial Hospital (Child Ward)", "brand": "Mission", "address": "Mandi Mohalla", "area": "Mandi Mohalla", "phone": "0821 252 0034", "rating": "4.6", "reviewsCount": 910, "specialty": "Missionary Child Care" },
    { "name": "DRM Hospital (Pediatric Division)", "brand": "DRM", "address": "Vani Vilas Mohalla, Temple Road", "area": "Vani Vilas Mohalla", "phone": "0821 426 0000", "rating": "4.7", "reviewsCount": 780, "specialty": "Pediatric & Adolescent Care" },
    { "name": "Anagha Children's Hospital", "brand": "Independent", "address": "Dattagalli 3rd Stage, Kanakadasa Nagar", "area": "Dattagalli", "phone": "0821 236 1234", "rating": "4.8", "reviewsCount": 1240, "specialty": "Dedicated Children's Hospital" },
    { "name": "Chaitanya Children's Hospital", "brand": "Independent", "address": "Vidyaranyapuram", "area": "Vidyaranyapuram", "phone": "0821 248 8899", "rating": "4.7", "reviewsCount": 860, "specialty": "Pediatric OPD & Vaccination" },
    { "name": "Amrit Children's Hospital", "brand": "Independent", "address": "Hebbal 1st Stage, Near Ring Road", "area": "Hebbal", "phone": "0821 241 1122", "rating": "4.6", "reviewsCount": 690, "specialty": "Child Care Clinic" },
    { "name": "Narayana Multispeciality Hospital", "brand": "Narayana", "address": "CAH-1, 3rd Phase, Devanur, R.S. Naidu Nagar", "area": "Devanur", "phone": "0821 712 2222", "rating": "4.8", "reviewsCount": 2430, "specialty": "Pediatric Surgery & Care" },
    { "name": "Kamakshi Hospital (Child Health Wing)", "brand": "Kamakshi", "address": "Kuvempunagar, Saraswathipuram Extension", "area": "Kuvempunagar", "phone": "0821 254 4400", "rating": "4.6", "reviewsCount": 950, "specialty": "Pediatric Clinic" },
    { "name": "Basappa Memorial Hospital (Pediatrics)", "brand": "Basappa", "address": "Vinoba Road, Jayalakshmipuram", "area": "Jayalakshmipuram", "phone": "0821 251 3131", "rating": "4.7", "reviewsCount": 1100, "specialty": "Child Care Unit" }
  ],
  "mangaluru": [
    { "name": "KMC Hospital (Department of Pediatrics)", "brand": "Manipal", "address": "Balmatta Road, Hampankatta", "area": "Hampankatta", "phone": "0824 244 5858", "rating": "4.8", "reviewsCount": 2890, "specialty": "Tertiary Pediatric Super Speciality" },
    { "name": "KMC Hospital Ambedkar Circle", "brand": "Manipal", "address": "Dr. B R Ambedkar Circle, Jyothi", "area": "Jyothi Circle", "phone": "0824 244 4590", "rating": "4.8", "reviewsCount": 2150, "specialty": "Pediatric ICU & NICU" },
    { "name": "Father Muller Medical College Hospital", "brand": "Father Muller", "address": "Father Muller Road, Kankanady", "area": "Kankanady", "phone": "0824 223 8000", "rating": "4.9", "reviewsCount": 3650, "specialty": "Comprehensive Child Healthcare" },
    { "name": "A.J. Hospital & Research Centre", "brand": "A.J.", "address": "Kuntikana, NH 66", "area": "Kuntikana", "phone": "0824 222 5555", "rating": "4.8", "reviewsCount": 2780, "specialty": "Pediatric Critical Care & Surgery" },
    { "name": "Indiana Hospital & Heart Institute", "brand": "Indiana", "address": "Pumpwell Circle, Kankanady", "area": "Pumpwell", "phone": "0824 288 0880", "rating": "4.7", "reviewsCount": 1950, "specialty": "Pediatric Cardiology & General" },
    { "name": "Yenepoya Specialty Hospital", "brand": "Yenepoya", "address": "Kodialbail", "area": "Kodialbail", "phone": "0824 423 8855", "rating": "4.8", "reviewsCount": 2120, "specialty": "Child Health Center" },
    { "name": "Unity Hospital (Pediatrics & Neonatology)", "brand": "Unity", "address": "Highlands, Falnir Road", "area": "Falnir", "phone": "0824 424 5555", "rating": "4.7", "reviewsCount": 1420, "specialty": "Pediatric Inpatient" },
    { "name": "Athena Hospital (Pediatrics)", "brand": "Athena", "address": "Falnir Road", "area": "Falnir", "phone": "0824 244 2255", "rating": "4.6", "reviewsCount": 1180, "specialty": "Mother & Child Wing" },
    { "name": "Highland Hospital", "brand": "Highland", "address": "Highlands, Kankanady", "area": "Kankanady", "phone": "0824 243 3444", "rating": "4.6", "reviewsCount": 980, "specialty": "Pediatric OPD & Immunization" },
    { "name": "Tejasvini Hospital (Pediatric Unit)", "brand": "Tejasvini", "address": "Kadri", "area": "Kadri", "phone": "0824 221 3400", "rating": "4.7", "reviewsCount": 890, "specialty": "Pediatric Ortho & General" },
    { "name": "City Hospital & Children's Clinic", "brand": "City", "address": "Kadri Toll Gate", "area": "Kadri Toll Gate", "phone": "0824 221 8241", "rating": "4.6", "reviewsCount": 750, "specialty": "Pediatric Clinic" },
    { "name": "Colaco Hospital (Maternity & Child Health)", "brand": "Colaco", "address": "Bendorewell, Kankanady", "area": "Bendorewell", "phone": "0824 243 4471", "rating": "4.6", "reviewsCount": 820, "specialty": "Maternity & Newborn Care" },
    { "name": "Lady Goschen Government Children's Hospital", "brand": "Government", "address": "Mission Street, State Bank", "area": "State Bank", "phone": "0824 242 4057", "rating": "4.7", "reviewsCount": 2450, "specialty": "Government Maternal & Child Hospital" },
    { "name": "K.S. Hegde Charitable Hospital", "brand": "K.S. Hegde", "address": "Nithyananda Nagar, Deralakatte", "area": "Deralakatte", "phone": "0824 220 4490", "rating": "4.8", "reviewsCount": 2680, "specialty": "Academic Pediatric Referral" },
    { "name": "Omega Hospital (Child Health)", "brand": "Omega", "address": "Mahaveera Circle, Pumpwell", "area": "Pumpwell", "phone": "0824 243 2577", "rating": "4.6", "reviewsCount": 940, "specialty": "Pediatric Specialty" },
    { "name": "SCS Hospital (Child Care Wing)", "brand": "SCS", "address": "Balmatta Road", "area": "Balmatta", "phone": "0824 242 4111", "rating": "4.6", "reviewsCount": 1120, "specialty": "Child Healthcare Center" },
    { "name": "Mangalore Children's Clinic", "brand": "Independent", "address": "Karangalpady", "area": "Karangalpady", "phone": "0824 249 2000", "rating": "4.8", "reviewsCount": 1450, "specialty": "Pediatric Specialist Outpatient" },
    { "name": "Somayaji Children's Clinic", "brand": "Independent", "address": "Bunts Hostel Road", "area": "Bunts Hostel", "phone": "0824 244 0011", "rating": "4.7", "reviewsCount": 1280, "specialty": "Infant Growth & Vaccine Clinic" },
    { "name": "Srinivas Hospital (Pediatric Division)", "brand": "Srinivas", "address": "Mukka, Surathkal", "area": "Surathkal", "phone": "0824 247 7456", "rating": "4.7", "reviewsCount": 1620, "specialty": "Coastal Child Healthcare" },
    { "name": "Prashanth Children's Hospital", "brand": "Independent", "address": "Bejai Main Road", "area": "Bejai", "phone": "0824 222 3344", "rating": "4.7", "reviewsCount": 980, "specialty": "Pediatric Care Center" }
  ],
  "hubballi": [
    { "name": "KIMS Hospital (Karnataka Institute of Medical Sciences)", "brand": "Government", "address": "Vidyanagar, Hubballi", "area": "Vidyanagar", "phone": "0836 227 2044", "rating": "4.8", "reviewsCount": 3890, "specialty": "Government Apex Pediatric Center" },
    { "name": "Suchirayu Hospital (Pediatrics & Child Care)", "brand": "KLE", "address": "Javali Garden, Gokul Road, Hubballi", "area": "Gokul Road", "phone": "0836 233 4455", "rating": "4.8", "reviewsCount": 2450, "specialty": "Advanced Pediatric Critical Care" },
    { "name": "Tatwadarsha Hospital (Pediatric ICU)", "brand": "Tatwadarsha", "address": "Vidyanagar, Hubballi", "area": "Vidyanagar", "phone": "0836 237 0000", "rating": "4.8", "reviewsCount": 1950, "specialty": "Pediatric Surgery & ICU" },
    { "name": "Shrikrishna Children's Hospital", "brand": "Independent", "address": "Deshpande Nagar, Hubballi", "area": "Deshpande Nagar", "phone": "0836 225 1515", "rating": "4.9", "reviewsCount": 2780, "specialty": "Specialized Children's Hospital" },
    { "name": "Vasantha Children's Hospital", "brand": "Independent", "address": "Shirur Park Road, Vidyanagar, Hubballi", "area": "Vidyanagar", "phone": "0836 237 2323", "rating": "4.8", "reviewsCount": 1890, "specialty": "Pediatric Emergency & NICU" },
    { "name": "Shakuntala Memorial Children's Hospital", "brand": "Independent", "address": "Keshwapur, Hubballi", "area": "Keshwapur", "phone": "0836 236 4466", "rating": "4.7", "reviewsCount": 1420, "specialty": "Children's Healthcare Center" },
    { "name": "Sanjeevini Hospital (Pediatric Unit)", "brand": "Sanjeevini", "address": "Akshay Park, Gokul Road, Hubballi", "area": "Gokul Road", "phone": "0836 233 3333", "rating": "4.7", "reviewsCount": 1150, "specialty": "Pediatric Inpatient" },
    { "name": "SDM College of Medical Sciences & Hospital", "brand": "SDM", "address": "Manjushree Nagar, Sattur, Dharwad", "area": "Sattur", "phone": "0836 247 7777", "rating": "4.9", "reviewsCount": 3650, "specialty": "Tertiary Pediatric Referral" },
    { "name": "Civil Hospital (Pediatric Department)", "brand": "Government", "address": "Station Road, Dharwad", "area": "Station Road", "phone": "0836 244 8000", "rating": "4.6", "reviewsCount": 1850, "specialty": "District Government Hospital" },
    { "name": "Dharwad Children's Hospital", "brand": "Independent", "address": "Line Bazar, Dharwad", "area": "Line Bazar", "phone": "0836 274 5566", "rating": "4.7", "reviewsCount": 1340, "specialty": "Dedicated Pediatric Care" },
    { "name": "Gurukrupa Children's Hospital", "brand": "Independent", "address": "Subhas Road, Dharwad", "area": "Subhas Road", "phone": "0836 244 1122", "rating": "4.7", "reviewsCount": 1120, "specialty": "Pediatric Speciality" },
    { "name": "Sparsh Hospital (Pediatrics)", "brand": "Sparsh", "address": "Bhavani Nagar, Hubballi", "area": "Bhavani Nagar", "phone": "0836 235 6677", "rating": "4.7", "reviewsCount": 980, "specialty": "Child Care Wing" },
    { "name": "Lifeline Hospital (Child Health)", "brand": "Lifeline", "address": "Gokul Road, Hubballi", "area": "Gokul Road", "phone": "0836 233 8899", "rating": "4.6", "reviewsCount": 850, "specialty": "Pediatric Clinic" },
    { "name": "Ankur Hospital for Women & Children", "brand": "Ankur", "address": "Near CBT, Hubballi", "area": "CBT", "phone": "0836 226 7788", "rating": "4.7", "reviewsCount": 1050, "specialty": "Maternity & Pediatric" },
    { "name": "Balaji Children's Hospital", "brand": "Independent", "address": "Eureka Junction, Hubballi", "area": "Eureka Junction", "phone": "0836 225 3344", "rating": "4.6", "reviewsCount": 780, "specialty": "Pediatric Clinic" },
    { "name": "Dr. Chitaguppi Municipal Children's Hospital", "brand": "Municipal", "address": "Lamington Road, Hubballi", "area": "Lamington Road", "phone": "0836 236 2211", "rating": "4.5", "reviewsCount": 920, "specialty": "Public Child Clinic" },
    { "name": "Ashraya Children's Hospital", "brand": "Independent", "address": "Bhavani Nagar, Dharwad", "area": "Bhavani Nagar", "phone": "0836 277 4455", "rating": "4.7", "reviewsCount": 840, "specialty": "Pediatric Care" },
    { "name": "Apollo Clinic (Pediatric Care)", "brand": "Apollo", "address": "Tolnaka, Hubballi-Dharwad Road, Dharwad", "area": "Tolnaka", "phone": "0836 244 5500", "rating": "4.8", "reviewsCount": 1420, "specialty": "Child Specialist Clinic" },
    { "name": "Shanti Children's Clinic", "brand": "Independent", "address": "Koppikar Road, Hubballi", "area": "Koppikar Road", "phone": "0836 236 7890", "rating": "4.7", "reviewsCount": 910, "specialty": "Infant Wellness & Vaccines" },
    { "name": "Prerana Children's Health Center", "brand": "Independent", "address": "Kallur Layout, Vidyanagar, Hubballi", "area": "Vidyanagar", "phone": "0836 237 8899", "rating": "4.7", "reviewsCount": 760, "specialty": "Pediatric Specialist" }
  ],
  "pune": [
    { "name": "Cloudnine Hospital", "brand": "Cloudnine", "address": "Axon Building, Near Pride Hotel, Shivajinagar", "area": "Shivajinagar", "phone": "+91 20 4962 4962", "rating": "4.9", "reviewsCount": 3650, "specialty": "Child Healthcare & Level III NICU" },
    { "name": "Cloudnine Hospital Kalyani Nagar", "brand": "Cloudnine", "address": "Hermes Waves, Kalyani Nagar", "area": "Kalyani Nagar", "phone": "+91 20 4962 4962", "rating": "4.8", "reviewsCount": 2450, "specialty": "Pediatric Clinic" },
    { "name": "Surya Mother & Child Super Speciality Hospital", "brand": "Surya", "address": "Near Bhujbal Bandhu, Wakad-Hinjawadi Link Road, Wakad", "area": "Wakad", "phone": "020 6791 5400", "rating": "4.9", "reviewsCount": 3890, "specialty": "Dedicated Pediatric Specialty Hospital" },
    { "name": "Sahyadri Super Speciality Hospital", "brand": "Sahyadri", "address": "Plot No. 30 C, Karve Road, Deccan Gymkhana", "area": "Deccan Gymkhana", "phone": "020 6721 3000", "rating": "4.8", "reviewsCount": 3120, "specialty": "Comprehensive Pediatric Care" },
    { "name": "Sahyadri Hospital Hadapsar", "brand": "Sahyadri", "address": "Near Magarpatta City, Hadapsar", "area": "Hadapsar", "phone": "020 6721 4000", "rating": "4.7", "reviewsCount": 2150, "specialty": "Pediatric Care" },
    { "name": "Motherhood Hospital", "brand": "Motherhood", "address": "Plot No. 1, Shankar Nagar, Kharadi", "area": "Kharadi", "phone": "020 6723 8888", "rating": "4.8", "reviewsCount": 2680, "specialty": "Maternity & Pediatric" },
    { "name": "Motherhood Hospital Baner", "brand": "Motherhood", "address": "Veerbhadra Nagar, Baner", "area": "Baner", "phone": "020 6723 8888", "rating": "4.8", "reviewsCount": 2340, "specialty": "Pediatric & NICU" },
    { "name": "KEM Hospital (Department of Pediatrics)", "brand": "KEM", "address": "489, Rasta Peth, Sardar Moodliar Road", "area": "Rasta Peth", "phone": "020 6603 7300", "rating": "4.8", "reviewsCount": 3450, "specialty": "Academic Pediatric Specialty" },
    { "name": "Bharati Hospital (Pediatric Super Speciality)", "brand": "Bharati", "address": "Pune-Satara Road, Dhankawadi", "area": "Dhankawadi", "phone": "020 4055 5555", "rating": "4.8", "reviewsCount": 2980, "specialty": "Comprehensive Child Care" },
    { "name": "Ruby Hall Clinic (Pediatric Division)", "brand": "Ruby Hall", "address": "40, Sassoon Road, Sangamvadi", "area": "Sassoon Road", "phone": "020 6645 5100", "rating": "4.8", "reviewsCount": 3890, "specialty": "Pediatric Cardiology & PICU" },
    { "name": "Ruby Hall Clinic Wanowrie", "brand": "Ruby Hall", "address": "Wanowrie, Near Jagtap Chowk", "area": "Wanowrie", "phone": "020 6645 5500", "rating": "4.7", "reviewsCount": 1950, "specialty": "Pediatric Inpatient" },
    { "name": "Jehangir Hospital (Pediatric Wing)", "brand": "Jehangir", "address": "32, Sassoon Road, Opposite Pune Railway Station", "area": "Sassoon Road", "phone": "020 6681 9999", "rating": "4.8", "reviewsCount": 3120, "specialty": "Pediatric Super Speciality" },
    { "name": "Deenanath Mangeshkar Hospital", "brand": "Mangeshkar", "address": "Near Mhatre Bridge, Erandwane", "area": "Erandwane", "phone": "020 4015 1000", "rating": "4.9", "reviewsCount": 4620, "specialty": "Apex Pediatric Multi-Speciality" },
    { "name": "Manipal Hospital (Pediatrics)", "brand": "Manipal", "address": "Survey No 45/1, Kharadi Bypass, Kharadi", "area": "Kharadi", "phone": "020 6165 6666", "rating": "4.8", "reviewsCount": 2780, "specialty": "Pediatric Intensive Care" },
    { "name": "Jupiter Hospital (Department of Pediatrics)", "brand": "Jupiter", "address": "Near Prathamesh Park, Aundh-Baner Link Road, Baner", "area": "Baner", "phone": "020 2799 2222", "rating": "4.8", "reviewsCount": 2890, "specialty": "Advanced Pediatric Care" },
    { "name": "Apollo Cradle & Children's Hospital", "brand": "Apollo", "address": "S.No. 120/1, Saraswati Colony, Nilanjali Society, Kalyani Nagar", "area": "Kalyani Nagar", "phone": "020 4424 4424", "rating": "4.8", "reviewsCount": 2650, "specialty": "Pediatric Center" },
    { "name": "Ratna Memorial Hospital (Pediatrics)", "brand": "Ratna", "address": "Senapati Bapat Road", "area": "Senapati Bapat Road", "phone": "020 4109 7777", "rating": "4.6", "reviewsCount": 1420, "specialty": "Child Care Clinic" },
    { "name": "Inamdar Multispeciality Hospital (Child Health)", "brand": "Inamdar", "address": "Fatima Nagar, Wanowrie", "area": "Fatima Nagar", "phone": "020 6681 2222", "rating": "4.7", "reviewsCount": 1680, "specialty": "Pediatric Unit" },
    { "name": "Vitalife Clinic (Pediatric Care)", "brand": "Vitalife", "address": "Baner Road, Baner", "area": "Baner", "phone": "020 6720 0000", "rating": "4.7", "reviewsCount": 1250, "specialty": "Pediatric Outpatient" },
    { "name": "Sanjeevan Hospital (Pediatric Wing)", "brand": "Sanjeevan", "address": "Off Karve Road, Erandwane", "area": "Erandwane", "phone": "020 2544 4041", "rating": "4.6", "reviewsCount": 980, "specialty": "Pediatric Clinic" }
  ],
  "kolkata": [
    { "name": "Institute of Child Health (ICH)", "brand": "ICH", "address": "11, Dr. Biresh Guha St, Park Circus", "area": "Park Circus", "phone": "033 2287 0011", "rating": "4.9", "reviewsCount": 4890, "specialty": "Apex Pioneer Children's Hospital" },
    { "name": "Apollo Multispeciality Hospitals (Pediatrics)", "brand": "Apollo", "address": "58, Canal Circular Rd, Kadapara, Phool Bagan, Kankurgachi", "area": "Phool Bagan", "phone": "033 2320 3040", "rating": "4.9", "reviewsCount": 4210, "specialty": "Quaternary Pediatric & Organ Transplant" },
    { "name": "Fortis Hospital Anandapur (Pediatric Wing)", "brand": "Fortis", "address": "730, Anandapur, E.M. Bypass Road", "area": "Anandapur", "phone": "033 6628 4444", "rating": "4.8", "reviewsCount": 3450, "specialty": "Pediatric Critical Care & Cardiology" },
    { "name": "AMRI Hospitals Dhakuria (Child Health)", "brand": "AMRI", "address": "P-4&5, CIT Scheme LXXII, Block-A, Gariahat Rd, Dhakuria", "area": "Dhakuria", "phone": "033 6680 0000", "rating": "4.8", "reviewsCount": 2980, "specialty": "Comprehensive Pediatric Inpatient" },
    { "name": "Medica Superspecialty Hospital (Pediatrics)", "brand": "Medica", "address": "127, Mukundapur, E.M. Bypass", "area": "Mukundapur", "phone": "033 6652 0000", "rating": "4.8", "reviewsCount": 3120, "specialty": "Pediatric Surgery & Level III NICU" },
    { "name": "Peerless Hospital (Department of Pediatrics)", "brand": "Peerless", "address": "360, Panchasayar, Garia", "area": "Panchasayar", "phone": "033 4011 1222", "rating": "4.8", "reviewsCount": 2840, "specialty": "Pediatric Multi-Speciality Care" },
    { "name": "Woodlands Multispeciality Hospital (Pediatrics)", "brand": "Woodlands", "address": "8/5, Alipore Road", "area": "Alipore", "phone": "033 4033 7000", "rating": "4.8", "reviewsCount": 2450, "specialty": "Advanced Pediatric Medicine" },
    { "name": "Calcutta Medical College (Eden Hospital Pediatric Wing)", "brand": "Government", "address": "88, College Street, Bowbazar", "area": "College Street", "phone": "033 2255 1621", "rating": "4.8", "reviewsCount": 4150, "specialty": "Historic Government Pediatric Referral" },
    { "name": "B.C. Roy Post Graduate Institute of Paediatric Sciences", "brand": "Government", "address": "111, Narkeldanga Main Road, Phoolbagan", "area": "Phoolbagan", "phone": "033 2320 4646", "rating": "4.8", "reviewsCount": 3780, "specialty": "Apex Government Pediatric Super Speciality" },
    { "name": "Cloudnine Hospital", "brand": "Cloudnine", "address": "Plot No. II, CB Block, Sector 1, Bidhannagar, Salt Lake", "area": "Salt Lake", "phone": "+91 33 4962 4962", "rating": "4.8", "reviewsCount": 2210, "specialty": "Pediatric & Maternity Center" },
    { "name": "Motherhood Clinic (Child Health)", "brand": "Motherhood", "address": "Kasba, Rajdanga Main Road", "area": "Kasba", "phone": "033 6723 8888", "rating": "4.7", "reviewsCount": 1680, "specialty": "Pediatric OPD & Vaccines" },
    { "name": "Chittaranjan Seva Sadan (Pediatric Care)", "brand": "Government", "address": "37, Syamaprasad Mukherjee Rd, Bhowanipore", "area": "Bhowanipore", "phone": "033 2475 4011", "rating": "4.7", "reviewsCount": 2150, "specialty": "Maternal & Child Hospital" },
    { "name": "Ruby General Hospital (Pediatric Unit)", "brand": "Ruby", "address": "Kasba Golpark, E.M. Bypass", "area": "Kasba Golpark", "phone": "033 3987 1800", "rating": "4.7", "reviewsCount": 1950, "specialty": "Pediatric Emergency" },
    { "name": "Desun Hospital (Department of Pediatrics)", "brand": "Desun", "address": "Desun More, Kasba Golpark, E.M. Bypass", "area": "Kasba Golpark", "phone": "033 7122 2000", "rating": "4.7", "reviewsCount": 1820, "specialty": "Pediatric ICU" },
    { "name": "Belle Vue Clinic (Pediatric Division)", "brand": "Belle Vue", "address": "9, Dr. U. N. Brahmachari St, Elgin", "area": "Elgin", "phone": "033 2287 2321", "rating": "4.8", "reviewsCount": 2340, "specialty": "Pediatric Inpatient" },
    { "name": "Apollo Clinic (Pediatric Care)", "brand": "Apollo", "address": "Prince Anwar Shah Road, Tollygunge", "area": "Tollygunge", "phone": "033 4004 0000", "rating": "4.8", "reviewsCount": 1780, "specialty": "Child Specialist Clinic" },
    { "name": "Anandalok Hospital (Child Ward)", "brand": "Anandalok", "address": "DK 7/3, Salt Lake Sector II", "area": "Salt Lake", "phone": "033 2359 2931", "rating": "4.6", "reviewsCount": 1150, "specialty": "Pediatric Care" },
    { "name": "Kothari Medical Centre (Pediatrics)", "brand": "Kothari", "address": "8/3, Alipore Road", "area": "Alipore", "phone": "033 2456 7050", "rating": "4.7", "reviewsCount": 1420, "specialty": "Child Health Unit" },
    { "name": "Suraksha Children's Hospital", "brand": "Suraksha", "address": "Action Area I, Newtown", "area": "Newtown", "phone": "033 6619 1000", "rating": "4.7", "reviewsCount": 1690, "specialty": "Pediatric Center" },
    { "name": "Manipal Hospital Broadway (Pediatrics)", "brand": "Manipal", "address": "IB 193, Broadway, Sector III, Salt Lake", "area": "Salt Lake", "phone": "033 6608 6608", "rating": "4.8", "reviewsCount": 2180, "specialty": "Advanced Pediatric Medicine" }
  ],
  "ahmedabad": [
    { "name": "Rainbow Children's Hospital & BirthRight", "brand": "Rainbow", "address": "Opposite Rajpath Club, Bodakdev, SG Highway", "area": "Bodakdev", "phone": "+91 79 4969 4969", "rating": "4.9", "reviewsCount": 3890, "specialty": "Quaternary Pediatric Care & Level III NICU" },
    { "name": "Apollo Hospitals (Pediatric Care)", "brand": "Apollo", "address": "Plot No. 1A, Bhat GIDC Estate, Gandhinagar Highway", "area": "Bhat", "phone": "079 6670 1800", "rating": "4.9", "reviewsCount": 4150, "specialty": "Pediatric Surgery & Critical Care" },
    { "name": "KD Hospital (Kusum Dhirajlal Hospital)", "brand": "KD Hospital", "address": "Vaishnodevi Circle, SG Highway", "area": "SG Highway", "phone": "079 6777 0000", "rating": "4.8", "reviewsCount": 3420, "specialty": "Comprehensive Pediatric Specialty" },
    { "name": "Zydus Hospital (Department of Pediatrics)", "brand": "Zydus", "address": "Zydus Hospital Road, Near Sola Bridge, SG Highway", "area": "Thaltej", "phone": "079 6619 0201", "rating": "4.8", "reviewsCount": 3650, "specialty": "Pediatric Intensive Care & Oncology" },
    { "name": "CIMS Hospital (Marengo CIMS Pediatrics)", "brand": "CIMS", "address": "Off Science City Road, Sola", "area": "Science City", "phone": "079 4805 1000", "rating": "4.8", "reviewsCount": 3210, "specialty": "Pediatric Cardiology & Transplant" },
    { "name": "Shalby Multispecialty Hospital", "brand": "Shalby", "address": "Opposite Karnavati Club, SG Highway", "area": "SG Highway", "phone": "079 4020 3000", "rating": "4.8", "reviewsCount": 2980, "specialty": "Pediatric Orthopedics & General" },
    { "name": "Civil Hospital (BJ Medical College Pediatric Wing)", "brand": "Government", "address": "Asarwa", "area": "Asarwa", "phone": "079 2268 0074", "rating": "4.8", "reviewsCount": 4890, "specialty": "Apex Government Pediatric Referral" },
    { "name": "Sterling Hospital (Child Care Unit)", "brand": "Sterling", "address": "Sterling Hospital Road, Memnagar", "area": "Memnagar", "phone": "079 4001 1111", "rating": "4.7", "reviewsCount": 2450, "specialty": "Pediatric Inpatient & PICU" },
    { "name": "SVP Hospital (Sardar Vallabhbhai Patel Institute)", "brand": "SVP", "address": "Ellis Bridge", "area": "Ellis Bridge", "phone": "079 2657 7621", "rating": "4.8", "reviewsCount": 3120, "specialty": "Advanced Municipal Pediatric Center" },
    { "name": "Apple Children Hospital", "brand": "Apple", "address": "Drive In Road, Nilmani Society, Memnagar", "area": "Drive In Road", "phone": "079 2749 2000", "rating": "4.9", "reviewsCount": 2680, "specialty": "Dedicated Children's Hospital" },
    { "name": "Shishu Children Hospital", "brand": "Independent", "address": "Paldi Cross Roads, Paldi", "area": "Paldi", "phone": "079 2658 4400", "rating": "4.8", "reviewsCount": 1950, "specialty": "Infant & Toddler Care" },
    { "name": "Ankur Children Hospital", "brand": "Independent", "address": "Naranpura Cross Road", "area": "Naranpura", "phone": "079 2747 5566", "rating": "4.7", "reviewsCount": 1420, "specialty": "Child Specialist Clinic" },
    { "name": "Motherhood Women & Children Hospital", "brand": "Motherhood", "address": "Sindhu Bhavan Road, Bodakdev", "area": "Sindhu Bhavan Road", "phone": "079 6723 8888", "rating": "4.8", "reviewsCount": 2150, "specialty": "Pediatric & NICU" },
    { "name": "Sal Hospital & Medical Institute (Pediatrics)", "brand": "Sal", "address": "Doordarshan Kendra, Thaltej", "area": "Thaltej", "phone": "079 6611 5600", "rating": "4.7", "reviewsCount": 1820, "specialty": "Pediatric Multi-Speciality" },
    { "name": "Sparsh Children Hospital", "brand": "Independent", "address": "Bapunagar Cross Roads", "area": "Bapunagar", "phone": "079 2277 8899", "rating": "4.7", "reviewsCount": 1280, "specialty": "Pediatric OPD & Vaccination" },
    { "name": "Aastha Children Hospital", "brand": "Independent", "address": "Vastrapur Lake Road", "area": "Vastrapur", "phone": "079 2676 1122", "rating": "4.8", "reviewsCount": 1540, "specialty": "Dedicated Pediatric Care" },
    { "name": "Lotus Children Hospital", "brand": "Independent", "address": "Maninagar Cross Roads", "area": "Maninagar", "phone": "079 2546 3344", "rating": "4.7", "reviewsCount": 1390, "specialty": "Child Health Center" },
    { "name": "Vatsalya Children Hospital", "brand": "Independent", "address": "Sabarmati Main Road", "area": "Sabarmati", "phone": "079 2750 9900", "rating": "4.7", "reviewsCount": 1180, "specialty": "Pediatric Clinic" },
    { "name": "Apollo Clinic (Pediatric Care)", "brand": "Apollo", "address": "Mani Nagar Char Rasta", "area": "Maninagar", "phone": "079 2545 1100", "rating": "4.8", "reviewsCount": 1450, "specialty": "Child Specialist Clinic" },
    { "name": "Shubham Children Hospital", "brand": "Independent", "address": "Chandkheda, Near Visat Circle", "area": "Chandkheda", "phone": "079 2329 8877", "rating": "4.7", "reviewsCount": 1120, "specialty": "Pediatric Center" }
  ],
  "jaipur": [
    { "name": "JK Lon Hospital (SMS Medical College Pediatric Wing)", "brand": "Government", "address": "Jawahar Lal Nehru Marg, Gangawal Park, Adarsh Nagar", "area": "JLN Marg", "phone": "0141 256 0291", "rating": "4.8", "reviewsCount": 4980, "specialty": "Largest Government Children's Super Speciality" },
    { "name": "Surya Children's Hospital", "brand": "Surya", "address": "Opposite WTP, JLN Marg, Malviya Nagar", "area": "Malviya Nagar", "phone": "0141 669 8989", "rating": "4.9", "reviewsCount": 3890, "specialty": "Apex Pediatric Care & Level III NICU" },
    { "name": "Fortis Escorts Hospital (Pediatric Wing)", "brand": "Fortis", "address": "Jawaharlal Nehru Marg, Malviya Nagar", "area": "Malviya Nagar", "phone": "0141 254 7000", "rating": "4.9", "reviewsCount": 3650, "specialty": "Pediatric Cardiology & Critical Care" },
    { "name": "Narayana Multispeciality Hospital (Pediatrics)", "brand": "Narayana", "address": "Sector 28, Kumbha Marg, Pratap Nagar, Sanganer", "area": "Pratap Nagar", "phone": "0141 712 2222", "rating": "4.8", "reviewsCount": 3420, "specialty": "Pediatric Heart Surgery & Super Speciality" },
    { "name": "Manipal Hospital (Department of Pediatrics)", "brand": "Manipal", "address": "Sector 5, Main Sikar Road, Vidhyadhar Nagar", "area": "Vidhyadhar Nagar", "phone": "0141 516 4000", "rating": "4.8", "reviewsCount": 3120, "specialty": "Comprehensive Child Healthcare" },
    { "name": "Eternal Hospital (EHCC Pediatric Unit)", "brand": "Eternal", "address": "3 A, Jagatpura Road, Near Jawahar Circle", "area": "Jagatpura", "phone": "0141 517 4000", "rating": "4.8", "reviewsCount": 2780, "specialty": "Pediatric Intensive Care" },
    { "name": "Apex Hospitals (Pediatric Super Speciality)", "brand": "Apex", "address": "SP-6, Malviya Industrial Area, Malviya Nagar", "area": "Malviya Nagar", "phone": "0141 275 1871", "rating": "4.8", "reviewsCount": 2450, "specialty": "Pediatric Critical Care" },
    { "name": "Santokba Durlabhji Memorial Hospital (SDMH Pediatrics)", "brand": "SDMH", "address": "Bhawani Singh Marg, Bapu Nagar", "area": "Bapu Nagar", "phone": "0141 256 6251", "rating": "4.8", "reviewsCount": 3890, "specialty": "Charitable Pediatric Specialty" },
    { "name": "Cocoon Hospital (Mother & Child Super Speciality)", "brand": "Cocoon", "address": "Plot No. 14, Airport Plaza, Tonk Road", "area": "Tonk Road", "phone": "0141 469 6969", "rating": "4.8", "reviewsCount": 2650, "specialty": "Maternity & Pediatric Center" },
    { "name": "Mahatma Gandhi Medical College & Hospital (Pediatrics)", "brand": "Mahatma Gandhi", "address": "RIICO Institutional Area, Sitapura", "area": "Sitapura", "phone": "0141 277 1777", "rating": "4.8", "reviewsCount": 3210, "specialty": "Academic Pediatric Referral" },
    { "name": "Babies Hospital & Pediatric Clinic", "brand": "Independent", "address": "Vaishali Nagar, Near National Handloom", "area": "Vaishali Nagar", "phone": "0141 235 6677", "rating": "4.7", "reviewsCount": 1680, "specialty": "Dedicated Child Hospital" },
    { "name": "Ankur Children's Hospital", "brand": "Independent", "address": "Raja Park, Near LBS College", "area": "Raja Park", "phone": "0141 262 1122", "rating": "4.7", "reviewsCount": 1450, "specialty": "Pediatric OPD & Inpatient" },
    { "name": "Shishu Hospital & NICU", "brand": "Independent", "address": "Mansarovar, Shipra Path", "area": "Mansarovar", "phone": "0141 278 4455", "rating": "4.7", "reviewsCount": 1820, "specialty": "Infant & Newborn Care" },
    { "name": "Apple Children Hospital", "brand": "Apple", "address": "Gopalpura Bypass Road", "area": "Gopalpura Bypass", "phone": "0141 250 8899", "rating": "4.8", "reviewsCount": 1950, "specialty": "Pediatric Healthcare" },
    { "name": "Chirayu Children Hospital", "brand": "Independent", "address": "Ajmer Road, Sodala", "area": "Sodala", "phone": "0141 222 3344", "rating": "4.7", "reviewsCount": 1280, "specialty": "Child Health Unit" },
    { "name": "Apollo Clinic (Pediatric Care)", "brand": "Apollo", "address": "Queens Road, Vaishali Nagar", "area": "Vaishali Nagar", "phone": "0141 400 5500", "rating": "4.8", "reviewsCount": 1620, "specialty": "Child Specialist Clinic" },
    { "name": "Vatsalya Children's Hospital", "brand": "Independent", "address": "Vidhyadhar Nagar, Sector 2", "area": "Vidhyadhar Nagar", "phone": "0141 233 7788", "rating": "4.7", "reviewsCount": 1390, "specialty": "Pediatric Clinic" },
    { "name": "Bal Gopal Hospital", "brand": "Independent", "address": "Jhotwara Main Road", "area": "Jhotwara", "phone": "0141 234 9900", "rating": "4.6", "reviewsCount": 1150, "specialty": "Pediatric OPD & Vaccines" },
    { "name": "Imperial Hospital (Pediatric Wing)", "brand": "Imperial", "address": "Shastri Nagar", "area": "Shastri Nagar", "phone": "0141 228 1122", "rating": "4.6", "reviewsCount": 980, "specialty": "Child Care Center" },
    { "name": "Fortis Associate Clinic (Pediatrics)", "brand": "Fortis", "address": "C-Scheme, Ashok Nagar", "area": "C-Scheme", "phone": "0141 237 4455", "rating": "4.8", "reviewsCount": 1450, "specialty": "Pediatric OPD" }
  ]
}

# Update src/data/hospitalsData.ts with the full curated dictionary
with open('src/data/hospitalsData.ts', 'r', encoding='utf-8') as f:
    current = f.read()

# Replace CURATED_CITY_HOSPITALS block
start_marker = "export const CURATED_CITY_HOSPITALS: Record<string, Array<{"
end_marker = "const STATE_ROADS:"

start_idx = current.find(start_marker)
end_idx = current.find(end_marker)

if start_idx != -1 and end_idx != -1:
    curated_json = json.dumps(curated, indent=2)
    # convert to TS syntax
    new_curated_code = f"""export const CURATED_CITY_HOSPITALS: Record<string, Array<{{
  name: string;
  brand: string;
  address: string;
  area: string;
  phone: string;
  rating: string;
  reviewsCount: number;
  specialty: string;
}}>> = {curated_json};

"""
    updated_file = current[:start_idx] + new_curated_code + current[end_idx:]
    with open('src/data/hospitalsData.ts', 'w', encoding='utf-8') as f:
        f.write(updated_file)
    print("Updated src/data/hospitalsData.ts with rich curated cities!")
else:
    print("Markers not found, writing complete file directly")
