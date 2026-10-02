export type Lang = 'en' | 'bn'

const ui = {
  // Status indicators
  nominal: { en: 'NOMINAL', bn: 'স্বাভাবিক' },
  caution: { en: 'CAUTION', bn: 'সতর্কতা' },
  critical: { en: 'CRITICAL', bn: 'জরুরি' },

  // Game screen header
  commander: { en: 'Commander', bn: 'কমান্ডার' },
  missionProgress: { en: 'Mission progress', bn: 'মিশনের অগ্রগতি' },
  abortMission: { en: 'Abort Mission', bn: 'মিশন বাতিল' },

  // Vitals panel
  outpostVitals: { en: 'Outpost Vitals', bn: 'ঘাঁটির অবস্থা' },
  science: { en: 'Science', bn: 'বিজ্ঞান' },
  oxygen: { en: 'Oxygen', bn: 'অক্সিজেন' },
  water: { en: 'Water', bn: 'পানি' },
  food: { en: 'Food', bn: 'খাবার' },
  battery: { en: 'Battery', bn: 'ব্যাটারি' },
  crewHealth: { en: 'Crew Health', bn: 'ক্রুদের স্বাস্থ্য' },
  morale: { en: 'Morale', bn: 'মনোবল' },
  radiationDose: { en: 'Radiation Dose', bn: 'বিকিরণের মাত্রা' },

  // Power panel
  powerRouting: { en: 'Power Routing', bn: 'বিদ্যুৎ বণ্টন' },
  generation: { en: 'Generation', bn: 'উৎপাদন' },
  demandLabel: { en: 'Demand', bn: 'ব্যবহার' },
  batteryNet: { en: 'Battery ±', bn: 'ব্যাটারি ±' },
  solar: { en: 'Solar', bn: 'সৌরশক্তি' },
  reactor: { en: 'Reactor', bn: 'রিঅ্যাক্টর' },
  batteryDraining: { en: 'Battery draining', bn: 'ব্যাটারি কমছে' },

  // Command bar
  capcom: { en: 'CAPCOM', bn: 'ক্যাপকম' },

  // Outpost view
  cam04: { en: 'CAM-04', bn: 'ক্যাম-০৪' },
  live: { en: 'LIVE', bn: 'সরাসরি' },
  daylightLabel: { en: 'Daylight', bn: 'দিনের আলো' },
  lunarNight: { en: 'Lunar Night', bn: 'চাঁদের রাত' },
  dustStorm: { en: 'Dust Storm', bn: 'ধূলিঝড়' },
  shieldLabel: { en: 'Shield', bn: 'ঢাল' },
  routePowerToShield: { en: 'Route power to Radiation Shield', bn: 'বিদ্যুৎ বিকিরণ প্রতিরক্ষা ঢালে পাঠান' },
  solarFlare: { en: 'Solar Flare', bn: 'সৌরঝড়' },

  // Event dialog
  alert: { en: 'Alert', bn: 'সতর্কতা' },
  hazard: { en: 'Hazard', bn: 'হ্যাজার্ড' },
  opportunity: { en: 'Opportunity', bn: 'সুযোগ' },
  crewLabel: { en: 'Crew', bn: 'ক্রু' },
  commanderDecision: { en: 'Commander, your decision', bn: 'কমান্ডার, আপনার সিদ্ধান্ত' },
  realSpaceScience: { en: 'Real space science', bn: 'বাস্তব মহাকাশ বিজ্ঞান' },

  // Consequence dialog
  decisionLogged: { en: 'Decision logged', bn: 'সিদ্ধান্ত লগ করা হয়েছে' },
  continueBtn: { en: 'Continue', bn: 'চালিয়ে যান' },

  // Timeline
  missionTimeline: { en: 'Mission Timeline', bn: 'মিশনের সময়রেখা' },
  solarFlareLabel: { en: 'Solar flare', bn: 'সৌরঝড়' },
  dustStormLabel: { en: 'Dust storm', bn: 'ধূলিঝড়' },
  nightLabel: { en: 'Night', bn: 'রাত' },

  // Terminal
  missionLog: { en: 'Mission log', bn: 'মিশন লগ' },

  // Debrief
  missionAccomplished: { en: 'Mission accomplished', bn: 'মিশন সফল' },
  missionAborted: { en: 'Mission aborted', bn: 'মিশন বাতিল' },
  welcomeHome: { en: 'Welcome home,', bn: 'স্বাগতম,' },
  evacuation: { en: 'Evacuation,', bn: 'জরুরি সরিয়ে নেওয়া,' },
  gradeLabel: { en: 'Grade', bn: 'গ্রেড' },
  scoreLabel: { en: 'Score', bn: 'স্কোর' },
  missionTelemetry: { en: 'Mission Telemetry', bn: 'মিশন টেলিমেট্রি' },
  scoreBreakdown: { en: 'Score Breakdown', bn: 'স্কোর বিশ্লেষণ' },
  missionPatches: { en: 'Mission Patches', bn: 'মিশন প্যাচ' },
  scienceJournal: { en: 'Science Journal', bn: 'বিজ্ঞান জার্নাল' },
  earned: { en: 'earned', bn: 'অর্জিত' },
  entries: { en: 'entries', bn: 'এন্ট্রি' },
  newMission: { en: 'New mission', bn: 'নতুন মিশন' },
  abortedPenalty: { en: 'Aborted missions keep 40% of their points.', bn: 'বাতিল মিশনে ৪০% পয়েন্ট রাখা হয়।' },
  logged: { en: 'logged', bn: 'লগ করা হয়েছে' },

  // Score breakdown labels
  crewHealthScore: { en: 'Crew health', bn: 'ক্রু স্বাস্থ্য' },
  scienceScore: { en: 'Science', bn: 'বিজ্ঞান' },
  radiationSafety: { en: 'Radiation safety', bn: 'বিকিরণ সুরক্ষা' },
  crewMorale: { en: 'Crew morale', bn: 'ক্রু মনোবল' },
  waterManagement: { en: 'Water management', bn: 'জল ব্যবস্থাপনা' },

  // Badge labels
  radiationGuardian: { en: 'Radiation Guardian', bn: 'বিকিরণ অভিভাবক' },
  greenThumb: { en: 'Green Thumb', bn: 'সবুজ বিশেষজ্ঞ' },
  powerPro: { en: 'Power Pro', bn: 'বিদ্যুৎ বিশেষজ্ঞ' },
  scienceStar: { en: 'Science Star', bn: 'বিজ্ঞান তারকা' },
  stormChaser: { en: 'Storm Chaser', bn: 'ঝড় শিকারি' },
  crewChampion: { en: 'Crew Champion', bn: 'ক্রু চ্যাম্পিয়ন' },
  waterWarden: { en: 'Water Warden', bn: 'জল প্রহরী' },

  // Badge descriptions
  radiationGuardianDesc: { en: 'Kept crew dose under 30%', bn: 'ক্রু ডোজ ৩০% এর নিচে রেখেছেন' },
  greenThumbDesc: { en: 'Food never dropped below 40%', bn: 'খাবার কখনো ৪০% এর নিচে যায়নি' },
  powerProDesc: { en: 'Never had a brownout', bn: 'কখনো ব্রাউনআউট হয়নি' },
  scienceStarDesc: { en: 'Earned 150+ science', bn: '১৫০+ বিজ্ঞান পয়েন্ট অর্জন' },
  stormChaserDesc: { en: 'Survived every solar flare', bn: 'প্রতিটি সৌরঝড় থেকে বেঁচেছেন' },
  crewChampionDesc: { en: 'Finished with 90+ health', bn: '৯০+ স্বাস্থ্য নিয়ে মিশন শেষ' },
  waterWardenDesc: { en: 'Water never dropped below 30%', bn: 'পানি কখনো ৩০% এর নিচে যায়নি' },

  // Misc
  flareImpact: { en: 'Flare impact', bn: 'সৌরঝড় আঘাত' },
} as const

export type UIKey = keyof typeof ui

export function t(key: UIKey, lang: Lang): string {
  return ui[key][lang]
}
