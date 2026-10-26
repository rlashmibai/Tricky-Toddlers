import { collection, addDoc, getDocs, serverTimestamp, query, limit, where } from 'firebase/firestore';
import { db } from './firebase';

export const seedSampleData = async () => {
  // Small delay to ensure auth token is fully propagated to Firestore
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    console.log("Checking database state for seeding...");
    
    // 1. Seed Posts
    let postsSnap;
    try {
      postsSnap = await getDocs(query(collection(db, 'posts'), limit(1)));
    } catch (e) {
      console.warn("Could not check posts collection (may be permissions):", e);
    }

    if (!postsSnap || postsSnap.empty) {
      console.log("Seeding sample posts...");
      const samplePosts = [
        {
          userId: "sample_user_1",
          username: "ParentPro",
          content: "How do you all handle the 'terrible twos' when it comes to grocery shopping? My little one just had a meltdown because I wouldn't buy a fourth type of yogurt. SOS!",
          hashtags: ["#Tantrums", "#Food"],
          attachments: [],
          createdAt: serverTimestamp()
        },
        {
          userId: "sample_user_2",
          username: "SleepyMama",
          content: "Transitioning my 2-year old to a big kid bed today. Any tips to keep them from wandering out at 2 AM? I'm worried we're going to have a midnight explorer.",
          hashtags: ["#Sleep"],
          attachments: [],
          createdAt: serverTimestamp()
        },
        {
          userId: "sample_user_3",
          username: "HealthyChef",
          content: "I finally found a way to hide veggies in mac and cheese! If anyone needs recipe ideas for picky eaters, let me know. It's been a game changer in our house.",
          hashtags: ["#Food", "#Health"],
          attachments: [],
          createdAt: serverTimestamp()
        }
      ];

      for (const post of samplePosts) {
        try {
          const docRef = await addDoc(collection(db, 'posts'), post);
          if (post.username === "ParentPro") {
             await addDoc(collection(db, `posts/${docRef.id}/replies`), {
               userId: "sample_user_4",
               username: "KindParenting",
               content: "Distraction is key! I always bring a 'special' grocery-only toy that only comes out in the cart. Hang in there!",
               createdAt: serverTimestamp()
             });
          }
        } catch (postErr) {
          console.error(`Error seeding post for ${post.username}:`, postErr);
        }
      }
    }

    // 2. Seed Chat Messages
    let messagesSnap;
    try {
      messagesSnap = await getDocs(query(collection(db, 'messages'), where('username', '==', 'Sarah'), limit(1)));
    } catch (e) {
      console.warn("Could not check messages collection:", e);
    }

    if (!messagesSnap || messagesSnap.empty) {
      console.log("Seeding base chat messages...");
      const sampleMessages = [
        {
          userId: "demo_user_sarah",
          username: "Sarah",
          receiverName: "Lashmi",
          text: "Hi Lashmi! I'm struggling with my 2-year-old's screen time tantrums. How do you manage transitions when it's time to turn off the TV?",
          createdAt: serverTimestamp()
        },
        {
          userId: "demo_user_lashmi",
          username: "Lashmi",
          receiverName: "Sarah",
          text: "Hi Sarah! We went through this too. What works perfectly for us is using a visual sand-timer. They can literally see the time counting down.",
          createdAt: serverTimestamp()
        },
        {
          userId: "demo_user_sarah",
          username: "Sarah",
          receiverName: "Lashmi",
          text: "Oh, a visual timer is a fantastic idea! Do you give verbal warnings as well, or just let the timer handle it?",
          createdAt: serverTimestamp()
        },
        {
          userId: "demo_user_lashmi",
          username: "Lashmi",
          receiverName: "Sarah",
          text: "Both! I give a 5-minute warning, set the timer together, and say 'When the sand runs out, we say bye-bye to TV and go paint!' Connecting it to another fun activity helps so much.",
          createdAt: serverTimestamp()
        },
        {
          userId: "demo_user_sarah",
          username: "Sarah",
          receiverName: "Lashmi",
          text: "Connecting it to a fun transition activity makes absolute sense! I will buy a timer and try this tonight. Thank you so much!",
          createdAt: serverTimestamp()
        },
        {
          userId: "demo_user_lashmi",
          username: "Lashmi",
          receiverName: "Sarah",
          text: "You're so welcome, Sarah! Consistency is key, it might take a couple of days but they adapt quickly. Let me know how it goes! 👍",
          createdAt: serverTimestamp()
        }
      ];

      for (const msg of sampleMessages) {
        try {
          await addDoc(collection(db, 'messages'), msg);
        } catch (msgErr) {
          console.error("Error seeding message:", msgErr);
        }
      }
    }

    // 3. Seed 1:1 Chat Demo has been replaced by the Sarah and Lashmi conversation in base messages.
    console.log("Seeding process finalized successfully.");
  } catch (error) {
    console.error("Critical error in seeding process:", error);
  }
};
