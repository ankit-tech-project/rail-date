export type Language = "en" | "bn";

export const translations = {
  en: {
    // Language
    language: "English",
    languageName: "English",
    chooseLanguage: "Choose Language",
    chooseLanguageDescription: "Select your preferred language for RailDate.",

    // Header
    brandSubtitle: "INDIAN RAILWAY DATE CALCULATOR",
    advanceReservation: "60 Day Advance Reservation",

    // Hero
    badge: "Plan your journey smarter",
    heroTitle: "Know When to",
    heroTitleHighlight: "Book Your Ticket.",
    heroDescription:
      "Select your journey date and instantly find out when your Indian Railway train ticket booking window opens.",

    // Calculator
    journeyDate: "Journey Date",
    required: "Required",
    calculateBookingDate: "Calculate Booking Date",

    // Date Picker
    selectJourneyDate: "Select Journey Date",
    chooseWhenTravelling: "Choose when you're travelling",
    selectYourJourneyDate: "Select your journey date",
    chooseADate: "Choose a date",
    clear: "Clear",
    today: "Today",
    closeCalendar: "Close calendar",
    clearDate: "Clear date",

    // Booking Result
    bookingInformation: "Booking Information",
    yourJourney: "Your Journey",
    youCanBookOn: "You Can Book On",
    openingTime: "Opening time",
    bookingOpensToday: "Booking opens today at 8:00 AM",
    bookingOpensTime: "8:00 AM IST",
    bookingOpensTodayDescription:
      "The general opening-day booking window is available after 8:00 AM IST.",
    bookingOpensTomorrow: "Booking opens tomorrow",
    bookingOpensTomorrowDescription:
      "Booking opens after 8:00 AM IST tomorrow.",
    bookingOpensIn: "Booking opens in",
    day: "day",
    days: "days",
    bookingOpensInDescription:
      "You can book after 8:00 AM IST on the opening date.",
    bookingWindowAlreadyOpened: "Booking window has already opened",
    bookingWindowAlreadyOpenedDescription:
      "The 60-day opening date has already passed.",

    // Actions
    copied: "Copied!",
    copyDate: "Copy Date",
    downloadPDF: "Download PDF",

    // Information
    importantInformation: "Important Information",
    advanceReservationBasedOnJourney:
      "Advance reservation opening is based on the journey date.",
    generalBookingWindow: "The general booking window opens at 8:00 AM IST.",
    verifyAvailability:
      "Please verify availability and railway booking rules before booking.",

    // General Information
    advanceReservationPeriod:
      "The general Advance Reservation Period is 60 days before the journey date, excluding the journey date. Opening-day booking is available after 8:00 AM IST. Some trains may have a shorter reservation period.",

    // How It Works
    simpleAndClear: "Simple & Clear",
    howRailDateWorks: "How does RailDate work?",
    howRailDateWorksDescription:
      "Find your Indian Railway ticket booking date in three simple steps.",
    hideHowItWorks: "Hide how it works",

    step01: "Step 01",
    step01Title: "Select Your Journey Date",
    step01Description: "Choose the date you plan to travel by train.",

    step02: "Step 02",
    step02Title: "Calculate Your Booking Date",
    step02Description:
      "RailDate calculates when your train ticket booking window opens.",

    step03: "Step 03",
    step03Title: "Plan Ahead & Book",
    step03Description:
      "Know your booking date in advance and be ready when reservations open.",

    // Errors
    selectJourneyDateError: "Please select your journey date.",

    // Footer
    personalUtility: "Personal Utility",
    easierJourneyPlanning: "Built for easier journey planning.",

    // New Section For Train Details
    dateCalculator: "Date Calculator",
    trainDetails: "Train Details",
    new: "New",

    trainHeroBadge: "Explore Indian Railways",
    trainHeroTitle: "Find Your Train.",
    trainHeroTitleHighlight: "Plan Your Journey.",
    trainHeroDescription:
      "Search trains between stations, check schedules, routes and useful journey details — all in one place.",

    trainSearch: "Find Trains",
    trainSearchDescription: "Search trains between your selected stations.",
    fromStation: "From Station",
    fromStationPlaceholder: "Enter boarding station",
    toStation: "To Station",
    toStationPlaceholder: "Enter destination station",
    swapStations: "Swap stations",
    quota: "Quota",
    general: "General",
    tatkal: "Tatkal",
    premiumTatkal: "Premium Tatkal",
    searchTrains: "Search Trains",
    searching: "Searching...",

    clearStation: "Clear station",
    noStationsFound: "No stations found",
    tryStationNameOrCode: "Try a station name or code",

    selectFromStation: "Please select your boarding station.",
    selectToStation: "Please select your destination station.",
    selectDifferentStations: "Please select different stations.",

    availableTrains: "Available Trains",
    trainsFoundForJourney: "Trains found for your selected journey",

    viewDetails: "View Details",

    classesAndFare: "Classes & Fare",
    stoppages: "Stoppages",
    alternatives: "Alternatives",
    more: "More",

    classesAndFareTitle: "Classes & Fare",
    classesAndFareDescription:
      "Available travel classes and class-wise fare information will appear here.",

    loadingFareInformation: "Loading fare information...",
    fetchingClassesAndFares: "Fetching available classes and fares.",

    fareInformationUnavailable: "Fare information unavailable",
    fareDetailsCouldNotBeLoaded:
      "Fare details could not be loaded for this journey.",

    totalFare: "Total Fare",
    baseFare: "Base Fare",
    reservation: "Reservation",
    superfast: "Superfast",
    catering: "Catering",
    otherCharges: "Other Charges",

    noFareInformationAvailable: "No fare information available",
    fareDetailsNotAvailable:
      "Fare details are not available for this train and journey.",

    stationStoppages: "Station Stoppages",
    stationStoppagesDescription:
      "Actual scheduled stoppages and timings for this train.",

    loadingStoppages: "Loading stoppages...",
    fetchingTrainRouteAndStoppages:
      "Fetching the train route and scheduled stoppages.",

    stoppageInformationUnavailable: "Stoppage information unavailable",
    trainRoute: "Train Route",

    stoppagesCount: "stoppages",
    arrival: "Arr",
    departure: "Dep",
    platform: "Platform",

    timeUnavailable: "Time unavailable",
    stop: "Stop",

    noStoppageInformationAvailable: "No stoppage information available",
    routeInformationCouldNotBeFound:
      "Route information could not be found for this train.",

    alternativeJourney: "Alternative Journey",
    alternativeJourneyDescription:
      "Useful connecting journey options will appear here when available.",

    alternativeRoutesComingSoon: "Alternative routes will be added soon.",
    connectingJourneysDescription:
      "We will find practical connecting journeys to your destination.",

    moreInformation: "More Information",
    moreInformationDescription:
      "Additional operational information about this train.",

    trainNumber: "Train Number",
    journeyDuration: "Journey Duration",
    distance: "Distance",
    runsOn: "Runs On",
    noTrainsAvailable: "No Trains Available",
    noTrainsBetween: "No trains are available between",
    selectedJourneyDate: "for your selected journey date.",
    tryAnotherJourneyDate: "Try selecting another journey date.",
    and: "and",
  },

  bn: {
    // Language
    language: "বাংলা",
    languageName: "বাংলা",
    chooseLanguage: "ভাষা নির্বাচন করুন",
    chooseLanguageDescription:
      "RailDate-এর জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।",

    // Header
    brandSubtitle: "ভারতীয় রেলওয়ে তারিখ ক্যালকুলেটর",
    advanceReservation: "৬০ দিনের অগ্রিম সংরক্ষণ",

    // Hero
    badge: "আরও সহজে আপনার যাত্রার পরিকল্পনা করুন",
    heroTitle: "জেনে নিন কখন",
    heroTitleHighlight: "টিকিট বুক করবেন।",
    heroDescription:
      "আপনার যাত্রার তারিখ নির্বাচন করুন এবং জেনে নিন কখন ভারতীয় রেলের ট্রেনের টিকিট বুকিং শুরু হবে।",

    // Calculator
    journeyDate: "যাত্রার তারিখ",
    required: "আবশ্যক",
    calculateBookingDate: "বুকিংয়ের তারিখ গণনা করুন",

    // Date Picker
    selectJourneyDate: "যাত্রার তারিখ নির্বাচন করুন",
    chooseWhenTravelling: "আপনি কবে ভ্রমণ করবেন তা নির্বাচন করুন",
    selectYourJourneyDate: "যাত্রার তারিখ নির্বাচন করুন",
    chooseADate: "একটি তারিখ নির্বাচন করুন",
    clear: "মুছে দিন",
    today: "আজ",
    closeCalendar: "ক্যালেন্ডার বন্ধ করুন",
    clearDate: "তারিখ মুছে দিন",

    // Booking Result
    bookingInformation: "বুকিং সংক্রান্ত তথ্য",
    yourJourney: "আপনার যাত্রা",
    youCanBookOn: "আপনি বুক করতে পারবেন",
    openingTime: "বুকিং শুরুর সময়",
    bookingOpensToday: "আজ সকাল ৮:০০টায় বুকিং শুরু হবে",
    bookingOpensTime: "সকাল ৮:০০টায়",
    bookingOpensTodayDescription:
      "বুকিং শুরুর দিনে সকাল ৮:০০টা IST-এর পর বুকিং করা যাবে।",
    bookingOpensTomorrow: "আগামীকাল বুকিং শুরু হবে",
    bookingOpensTomorrowDescription:
      "আগামীকাল সকাল ৮:০০টা IST-এর পর বুকিং করা যাবে।",
    bookingOpensIn: "বুকিং শুরু হবে",
    day: "দিন পরে",
    days: "দিন পরে",
    bookingOpensInDescription:
      "বুকিং শুরুর তারিখে সকাল ৮:০০টা IST-এর পর আপনি টিকিট বুক করতে পারবেন।",
    bookingWindowAlreadyOpened: "বুকিং ইতিমধ্যেই শুরু হয়ে গেছে",
    bookingWindowAlreadyOpenedDescription:
      "৬০ দিনের বুকিং শুরুর তারিখ ইতিমধ্যেই পেরিয়ে গেছে।",

    // Actions
    copied: "কপি হয়েছে!",
    copyDate: "তারিখ কপি করুন",
    downloadPDF: "PDF ডাউনলোড করুন",

    // Information
    importantInformation: "গুরুত্বপূর্ণ তথ্য",
    advanceReservationBasedOnJourney:
      "অগ্রিম বুকিং শুরুর তারিখ আপনার যাত্রার তারিখের উপর নির্ভর করে।",
    generalBookingWindow: "সাধারণ বুকিং উইন্ডো সকাল ৮:০০টা IST-এ শুরু হয়।",
    verifyAvailability:
      "বুকিং করার আগে আসন উপলভ্যতা এবং রেলের বুকিং নিয়ম যাচাই করে নিন।",

    // General Information
    advanceReservationPeriod:
      "সাধারণ অগ্রিম সংরক্ষণ সময়কাল যাত্রার তারিখ বাদ দিয়ে তার ৬০ দিন আগে থেকে শুরু হয়। বুকিং শুরুর দিনে সকাল ৮:০০টা IST-এর পর টিকিট বুক করা যায়। কিছু ট্রেনের ক্ষেত্রে সংরক্ষণ সময়কাল কম হতে পারে।",

    // How It Works
    simpleAndClear: "সহজ ও পরিষ্কার",
    howRailDateWorks: "RailDate কীভাবে কাজ করে?",
    howRailDateWorksDescription:
      "মাত্র তিনটি সহজ ধাপে আপনার ভারতীয় রেলওয়ে টিকিট বুকিংয়ের তারিখ জেনে নিন।",
    hideHowItWorks: "কীভাবে কাজ করে তা লুকান",

    step01: "ধাপ ০১",
    step01Title: "আপনার যাত্রার তারিখ নির্বাচন করুন",
    step01Description:
      "আপনি যে তারিখে ট্রেনে ভ্রমণ করতে চান সেটি নির্বাচন করুন।",

    step02: "ধাপ ০২",
    step02Title: "আপনার বুকিংয়ের তারিখ গণনা করুন",
    step02Description:
      "RailDate আপনার ট্রেনের টিকিট বুকিং কখন শুরু হবে তা গণনা করে।",

    step03: "ধাপ ০৩",
    step03Title: "আগে থেকে পরিকল্পনা করুন ও বুক করুন",
    step03Description:
      "আপনার বুকিংয়ের তারিখ আগে থেকেই জেনে রাখুন এবং বুকিং শুরু হওয়ার সময় প্রস্তুত থাকুন।",

    // Errors
    selectJourneyDateError: "অনুগ্রহ করে আপনার যাত্রার তারিখ নির্বাচন করুন।",

    // Footer
    personalUtility: "ব্যক্তিগত ইউটিলিটি",
    easierJourneyPlanning: "সহজ যাত্রা পরিকল্পনার জন্য তৈরি।",

    // New Section For Train Details
    dateCalculator: "তারিখ ক্যালকুলেটর",
    trainDetails: "ট্রেনের তথ্য",
    new: "নতুন",

    trainHeroBadge: "ভারতীয় রেলওয়ে অন্বেষণ করুন",
    trainHeroTitle: "আপনার ট্রেন খুঁজুন।",
    trainHeroTitleHighlight: "আপনার যাত্রা পরিকল্পনা করুন।",
    trainHeroDescription:
      "স্টেশনের মধ্যে ট্রেন খুঁজুন, সময়সূচি, রুট এবং আপনার যাত্রার গুরুত্বপূর্ণ তথ্য এক জায়গায় দেখুন।",

    trainSearch: "ট্রেন খুঁজুন",
    trainSearchDescription: "আপনার নির্বাচিত স্টেশনগুলির মধ্যে ট্রেন খুঁজুন।",
    fromStation: "যাত্রার স্টেশন",
    fromStationPlaceholder: "যাত্রার স্টেশন লিখুন",
    toStation: "গন্তব্য স্টেশন",
    toStationPlaceholder: "গন্তব্য স্টেশন লিখুন",
    swapStations: "স্টেশন পরিবর্তন করুন",
    quota: "কোটা",
    general: "সাধারণ",
    tatkal: "তৎকাল",
    premiumTatkal: "প্রিমিয়াম তৎকাল",
    searchTrains: "ট্রেন খুঁজুন",
    searching: "খোঁজা হচ্ছে...",

    clearStation: "স্টেশন মুছুন",
    noStationsFound: "কোনও স্টেশন পাওয়া যায়নি",
    tryStationNameOrCode: "স্টেশনের নাম বা কোড দিয়ে চেষ্টা করুন",

    selectFromStation: "অনুগ্রহ করে আপনার যাত্রার স্টেশন নির্বাচন করুন।",
    selectToStation: "অনুগ্রহ করে আপনার গন্তব্য স্টেশন নির্বাচন করুন।",
    selectDifferentStations: "অনুগ্রহ করে ভিন্ন স্টেশন নির্বাচন করুন।",

    availableTrains: "উপলব্ধ ট্রেন",
    trainsFoundForJourney: "আপনার নির্বাচিত যাত্রার জন্য ট্রেন পাওয়া গেছে",

    viewDetails: "বিস্তারিত দেখুন",

    classesAndFare: "শ্রেণি ও ভাড়া",
    stoppages: "স্টপেজ",
    alternatives: "বিকল্প",
    more: "আরও",

    classesAndFareTitle: "শ্রেণি ও ভাড়া",
    classesAndFareDescription:
      "উপলব্ধ ভ্রমণ শ্রেণি এবং প্রতিটি শ্রেণির ভাড়ার তথ্য এখানে দেখা যাবে।",

    loadingFareInformation: "ভাড়ার তথ্য লোড হচ্ছে...",
    fetchingClassesAndFares: "উপলব্ধ শ্রেণি ও ভাড়ার তথ্য সংগ্রহ করা হচ্ছে।",

    fareInformationUnavailable: "ভাড়ার তথ্য পাওয়া যায়নি",
    fareDetailsCouldNotBeLoaded: "এই যাত্রার জন্য ভাড়ার তথ্য লোড করা যায়নি।",

    totalFare: "মোট ভাড়া",
    baseFare: "প্রাথমিক ভাড়া",
    reservation: "রিজার্ভেশন",
    superfast: "সুপারফাস্ট",
    catering: "ক্যাটারিং",
    otherCharges: "অন্যান্য চার্জ",

    noFareInformationAvailable: "ভাড়ার তথ্য পাওয়া যায়নি",
    fareDetailsNotAvailable: "এই ট্রেন ও যাত্রার জন্য ভাড়ার তথ্য উপলব্ধ নেই।",

    stationStoppages: "স্টেশন স্টপেজ",
    stationStoppagesDescription:
      "এই ট্রেনের নির্ধারিত স্টপেজ ও সময়সূচি এখানে দেখুন।",

    loadingStoppages: "স্টপেজ লোড হচ্ছে...",
    fetchingTrainRouteAndStoppages:
      "ট্রেনের রুট ও নির্ধারিত স্টপেজের তথ্য সংগ্রহ করা হচ্ছে।",
    stoppageInformationUnavailable: "স্টপেজের তথ্য পাওয়া যায়নি",

    trainRoute: "ট্রেনের রুট",
    stoppagesCount: "স্টপেজ",

    arrival: "আগমন",
    departure: "প্রস্থান",
    platform: "প্ল্যাটফর্ম",

    timeUnavailable: "সময় পাওয়া যায়নি",
    stop: "স্টপ",

    noStoppageInformationAvailable: "স্টপেজের তথ্য পাওয়া যায়নি",
    routeInformationCouldNotBeFound:
      "এই ট্রেনের রুটের তথ্য খুঁজে পাওয়া যায়নি।",

    alternativeJourney: "বিকল্প যাত্রা",
    alternativeJourneyDescription:
      "উপলব্ধ থাকলে উপযোগী সংযোগকারী যাত্রার বিকল্পগুলি এখানে দেখা যাবে।",

    alternativeRoutesComingSoon: "বিকল্প রুট শীঘ্রই যোগ করা হবে।",
    connectingJourneysDescription:
      "আপনার গন্তব্যে পৌঁছানোর জন্য ব্যবহারিক সংযোগকারী যাত্রার বিকল্প খুঁজে দেওয়া হবে।",

    moreInformation: "আরও তথ্য",
    moreInformationDescription: "এই ট্রেনের অতিরিক্ত পরিচালনাগত তথ্য।",

    trainNumber: "ট্রেন নম্বর",
    journeyDuration: "যাত্রার সময়কাল",
    distance: "দূরত্ব",
    runsOn: "চলে",
    noTrainsAvailable: "কোনও ট্রেন পাওয়া যায়নি",
    noTrainsBetween: "এর মধ্যে কোনও ট্রেন পাওয়া যায়নি",
    selectedJourneyDate: "আপনার নির্বাচিত যাত্রার তারিখের জন্য।",
    tryAnotherJourneyDate: "অন্য একটি যাত্রার তারিখ নির্বাচন করে দেখুন।",
    and: "এবং",
  },
} as const;
