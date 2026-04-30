export const translations = {
  English: {
    onboarding: {
      welcome: "Welcome to CivicGuide AI",
      subWelcome: "Your personal election literacy assistant",
      start: "Get Started →",
      langPrompt: "Preferred language?",
      firstTime: "Are you a first-time voter?",
      yesFirst: "Yes, first time! 🌟",
      noVoted: "No, I've voted before",
      country: "Which country's elections are you interested in?",
      state: "Which state are you from?",
      selectState: "Select your state",
      continue: "Continue →",
      allSet: "You're all set!",
      makeVoteCount: "Let's make your vote count.",
      openCivic: "Open CivicGuide →",
    },
    app: {
      tagline: "Your interactive assistant for navigating the election process.",
      heroTitle: "Democracy, Simplified.",
      heroSubtitle: "Follow our interactive timeline to ensure your voice is heard. From registration to ballot casting, we've got you covered.",
      footer: "This is an informational assistant. Always verify deadlines with your local election office.",
      logout: "⚙️ Change Preferences",
      learnMore: "Learn More",
      nextStep: "Next Step"
    },
    steps: [
      {
        id: 'registration',
        title: 'Voter Registration',
        date: 'Sep 1 - Oct 15',
        description: 'Ensure you are registered to vote at your current address. Check deadlines for your specific state.',
        details: [
          'Check your current registration status online.',
          'Update your address if you have moved recently.',
          'Bring necessary ID if registering in person.',
          'Online registration is available in 42 states.'
        ]
      },
      {
        id: 'research',
        title: 'Candidate Research',
        date: 'Oct 15 - Nov 1',
        description: 'Learn about the candidates, their platforms, and key ballot measures in your district.',
        details: [
          'Review non-partisan voter guides.',
          'Watch local and national debates.',
          'Understand the impacts of proposed propositions.',
          'Check endorsements from trusted organizations.'
        ]
      },
      {
        id: 'early-voting',
        title: 'Early Voting (Optional)',
        date: 'Oct 20 - Nov 4',
        description: 'Avoid the lines by voting early if your state permits it, or request an absentee ballot.',
        details: [
          'Find your early voting polling location.',
          'Check the operating hours (often different from Election Day).',
          'Request a mail-in ballot before the deadline.',
          'Track your mail-in ballot online.'
        ]
      },
      {
        id: 'election-day',
        title: 'Election Day',
        date: 'November 5th',
        description: 'Head to your designated polling place to cast your vote. Polls usually open at 7 AM and close at 8 PM.',
        details: [
          'Verify your specific polling location beforehand.',
          'Bring required identification (varies by state).',
          'If you are in line when polls close, STAY IN LINE.',
          'If you encounter issues, ask for a provisional ballot.'
        ]
      }
    ]
  },
  Hindi: {
    onboarding: {
      welcome: "CivicGuide AI में आपका स्वागत है",
      subWelcome: "आपका व्यक्तिगत चुनाव साक्षरता सहायक",
      start: "शुरू करें →",
      langPrompt: "पसंदीदा भाषा? / Preferred language?",
      firstTime: "क्या आप पहली बार वोट दे रहे हैं?",
      yesFirst: "हाँ, पहली बार! 🌟",
      noVoted: "नहीं, मैंने पहले वोट दिया है",
      country: "आप किस देश के चुनाव में रुचि रखते हैं?",
      state: "आप किस राज्य से हैं?",
      selectState: "अपना राज्य चुनें",
      continue: "आगे बढ़ें →",
      allSet: "आप पूरी तरह तैयार हैं!",
      makeVoteCount: "आइए आपके वोट को सार्थक बनाएं।",
      openCivic: "CivicGuide खोलें →",
    },
    app: {
      tagline: "चुनाव प्रक्रिया को नेविगेट करने के लिए आपका इंटरैक्टिव सहायक।",
      heroTitle: "लोकतंत्र, सरल।",
      heroSubtitle: "यह सुनिश्चित करने के लिए हमारी इंटरैक्टिव टाइमलाइन का पालन करें कि आपकी आवाज़ सुनी जाए। पंजीकरण से लेकर वोट डालने तक, हमने आपको कवर किया है।",
      footer: "यह एक सूचनात्मक सहायक है। हमेशा अपने स्थानीय चुनाव कार्यालय से समय सीमा की पुष्टि करें।",
      logout: "⚙️ प्राथमिकताएं बदलें",
      learnMore: "और जानें",
      nextStep: "अगला कदम"
    },
    steps: [
      {
        id: 'registration',
        title: 'मतदाता पंजीकरण',
        date: '1 सितंबर - 15 अक्टूबर',
        description: 'सुनिश्चित करें कि आप अपने वर्तमान पते पर मतदान करने के लिए पंजीकृत हैं। अपने विशिष्ट राज्य के लिए समय सीमा की जांच करें।',
        details: [
          'ऑनलाइन अपनी वर्तमान पंजीकरण स्थिति की जांच करें।',
          'यदि आप हाल ही में स्थानांतरित हुए हैं तो अपना पता अपडेट करें।',
          'व्यक्तिगत रूप से पंजीकरण करते समय आवश्यक आईडी लाएं।',
          '42 राज्यों में ऑनलाइन पंजीकरण उपलब्ध है।'
        ]
      },
      {
        id: 'research',
        title: 'उम्मीदवार अनुसंधान',
        date: '15 अक्टूबर - 1 नवंबर',
        description: 'उम्मीदवारों, उनके प्लेटफार्मों और अपने जिले में प्रमुख मतपत्र उपायों के बारे में जानें।',
        details: [
          'गैर-पक्षपातपूर्ण मतदाता गाइडों की समीक्षा करें।',
          'स्थानीय और राष्ट्रीय बहसें देखें।',
          'प्रस्तावित प्रस्तावों के प्रभावों को समझें।',
          'विश्वसनीय संगठनों से समर्थन की जांच करें।'
        ]
      },
      {
        id: 'early-voting',
        title: 'जल्दी मतदान (वैकल्पिक)',
        date: '20 अक्टूबर - 4 नवंबर',
        description: 'यदि आपका राज्य अनुमति देता है तो जल्दी मतदान करके लाइनों से बचें, या अनुपस्थित मतपत्र का अनुरोध करें।',
        details: [
          'अपना प्रारंभिक मतदान स्थान खोजें।',
          'संचालन के घंटों की जांच करें (अक्सर चुनाव के दिन से अलग)।',
          'समय सीमा से पहले मेल-इन मतपत्र का अनुरोध करें।',
          'अपने मेल-इन मतपत्र को ऑनलाइन ट्रैक करें।'
        ]
      },
      {
        id: 'election-day',
        title: 'चुनाव का दिन',
        date: '5 नवंबर',
        description: 'अपना वोट डालने के लिए अपने निर्धारित मतदान स्थल पर जाएं। मतदान आमतौर पर सुबह 7 बजे खुलता है और रात 8 बजे बंद हो जाता है।',
        details: [
          'पहले से अपने विशिष्ट मतदान स्थान की पुष्टि करें।',
          'आवश्यक पहचान लाएं (राज्य द्वारा भिन्न होता है)।',
          'यदि चुनाव बंद होने पर आप लाइन में हैं, तो लाइन में बने रहें।',
          'यदि आपको समस्या आती है, तो अनंतिम मतपत्र के लिए पूछें।'
        ]
      }
    ]
  }
};
