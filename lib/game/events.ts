import type { Destination, GameEvent } from './types'

type EventFactory = (destination: Destination) => GameEvent

export const EVENTS: Record<string, EventFactory> = {
  flare: (d) => ({
    id: 'flare',
    kind: 'hazard',
    title: 'Solar Radiation Flare',
    titleBn: 'সৌর বিকিরণ ঝলক',
    description: `⚠ NASA DONKI Alert: High-energy solar particle event detected. Energetic proton flux exceeding 10 MeV threshold. A storm of high-energy particles will hit ${d === 'mars' ? 'Mars' : 'the Moon'} in 2 ${d === 'mars' ? 'sols' : 'days'}. Unprotected crew could absorb a dangerous radiation dose.`,
    descriptionBn: `⚠ NASA DONKI সতর্কতা: উচ্চ-শক্তির সৌর কণা ঘটনা শনাক্ত হয়েছে। শক্তিশালী প্রোটন প্রবাহ ১০ MeV সীমা অতিক্রম করেছে। ২ ${d === 'mars' ? 'সল' : 'দিন'} পরে উচ্চ-শক্তির কণার ঝড় ${d === 'mars' ? 'মঙ্গলে' : 'চাঁদে'} আঘাত করবে। অরক্ষিত ক্রু বিপজ্জনক বিকিরণ ডোজ শোষণ করতে পারে।`,
    fact: 'Solar particle events can deliver a large radiation dose in hours. NASA\u2019s Orion capsule has no dedicated shelter, so crews build one by stacking supplies and water around themselves. Water is excellent shielding because hydrogen atoms are close in mass to protons.',
    factBn: 'সৌর কণা ঘটনা ঘণ্টার মধ্যে বিপুল বিকিরণ ডোজ দিতে পারে। NASA-র ওরায়ন ক্যাপসুলে কোনো নির্দিষ্ট আশ্রয় নেই, তাই ক্রুরা সরবরাহ ও জল দিয়ে নিজেদের ঘিরে একটি তৈরি করে। জল চমৎকার ঢাল কারণ হাইড্রোজেন পরমাণু প্রোটনের কাছাকাছি ভরের।',
    choices: [
      {
        label: 'Charge the shield',
        labelBn: 'ঢাল চার্জ করুন',
        summary: 'Keep working. Route power to the shield before impact. +2 morale.',
        summaryBn: 'কাজ চালিয়ে যান। আঘাতের আগে ঢালে বিদ্যুৎ পাঠান। +২ মনোবল।',
        effects: { morale: 2 },
      },
      {
        label: 'Build a water-wall shelter',
        labelBn: 'জল-দেয়াল আশ্রয় তৈরি',
        summary: 'Halves the flare dose on impact. Cramped quarters lower morale. -4 morale.',
        summaryBn: 'আঘাতে ফ্লেয়ারের ডোজ অর্ধেক করে। সংকীর্ণ জায়গায় মনোবল কমে। -৪ মনোবল।',
        effects: { morale: -4 },
        modifiers: [{ kind: 'shelter' }],
      },
      {
        label: 'Vent coolant as particle absorber',
        labelBn: 'কুল্যান্ট ছেড়ে কণা শোষক হিসেবে ব্যবহার',
        summary: 'Dump water reserves to create makeshift shielding. Halves dose. -20 water.',
        summaryBn: 'অস্থায়ী ঢাল তৈরি করতে জলের মজুদ ব্যবহার করুন। ডোজ অর্ধেক। -২০ পানি।',
        effects: { water: -20 },
        modifiers: [{ kind: 'shelter' }],
      },
    ],
  }),
  'dust-storm': () => ({
    id: 'dust-storm',
    kind: 'hazard',
    title: 'Martian Dust Storm',
    titleBn: 'মঙ্গলের ধূলিঝড়',
    description: 'A wall of red dust is rolling in. NASA InSight weather sensors report: Temp −75.9°C, Wind 17.6 m/s, Pressure 762 Pa. For the next 3 sols, it will block most sunlight reaching your solar panels.',
    descriptionBn: 'লাল ধূলির প্রাচীর ধেয়ে আসছে। NASA InSight আবহাওয়া সেন্সর রিপোর্ট: তাপমাত্রা −৭৫.৯°C, বাতাস ১৭.৬ m/s, চাপ ৭৬২ Pa। পরবর্তী ৩ সলে এটি আপনার সোলার প্যানেলে পৌঁছানো অধিকাংশ সূর্যালোক আটকে দেবে।',
    fact: 'In 2018 a planet-wide dust storm blocked so much sunlight that NASA\u2019s solar-powered Opportunity rover lost power and never woke up, after nearly 15 years on Mars. NASA\u2019s InSight lander measured atmospheric conditions during this storm.',
    factBn: '২০১৮ সালে একটি গ্রহব্যাপী ধূলিঝড় এত সূর্যালোক আটকে দিয়েছিল যে NASA-র সৌরচালিত অপরচুনিটি রোভার শক্তি হারিয়ে আর কখনো জেগে ওঠেনি, মঙ্গলে প্রায় ১৫ বছর পর। NASA-র InSight ল্যান্ডার এই ঝড়ের সময় বায়ুমণ্ডলীয় পরিস্থিতি পরিমাপ করেছিল।',
    choices: [
      {
        label: 'Route power to Life Support',
        labelBn: 'লাইফ সাপোর্টে বিদ্যুৎ পাঠান',
        summary: 'Prioritize O₂ and water recycling. Solar at 55% but greenhouse food production stops. -10 food, +5 oxygen.',
        summaryBn: 'O₂ ও জল পুনর্ব্যবহারকে প্রাধান্য দিন। সোলার ৫৫% কিন্তু গ্রিনহাউস উৎপাদন বন্ধ। -১০ খাবার, +৫ অক্সিজেন।',
        effects: { food: -10, oxygen: 5 },
        modifiers: [{ kind: 'storm', sols: 3, factor: 0.55 }],
      },
      {
        label: 'Ration supplies and wait',
        labelBn: 'সরবরাহ রেশন করে অপেক্ষা',
        summary: 'Stay safe inside. Saves power but crew morale drops. Solar at 35%. -5 morale, -3 health.',
        summaryBn: 'ভেতরে নিরাপদে থাকুন। বিদ্যুৎ বাঁচে কিন্তু মনোবল কমে। সোলার ৩৫%। -৫ মনোবল, -৩ স্বাস্থ্য।',
        effects: { morale: -5, health: -3 },
        modifiers: [{ kind: 'storm', sols: 3, factor: 0.35 }],
      },
      {
        label: 'Overdrive backup generators',
        labelBn: 'ব্যাকআপ জেনারেটর ওভারড্রাইভ',
        summary: 'Push emergency power hard. Better output at 70% but habitat systems strain. -8 health.',
        summaryBn: 'জরুরি বিদ্যুতে চাপ দিন। ৭০% ভালো আউটপুট কিন্তু হ্যাবিট্যাট সিস্টেমে চাপ পড়ে। -৮ স্বাস্থ্য।',
        effects: { health: -8 },
        modifiers: [{ kind: 'storm', sols: 3, factor: 0.7 }],
      },
    ],
  }),
  reactor: () => ({
    id: 'reactor',
    kind: 'opportunity',
    title: 'Fission Reactor Delivered',
    titleBn: 'ফিশন রিঅ্যাক্টর পৌঁছেছে',
    description: 'A cargo lander brought a compact nuclear fission reactor. It makes power day and night, but setting it up needs a long, tiring spacewalk.',
    descriptionBn: 'একটি কার্গো ল্যান্ডার একটি ছোট পারমাণবিক ফিশন রিঅ্যাক্টর এনেছে। এটি দিনরাত বিদ্যুৎ তৈরি করে, তবে এটি বসাতে দীর্ঘ ক্লান্তিকর স্পেসওয়াক দরকার।',
    fact: 'NASA\u2019s Fission Surface Power project is developing a reactor of about 40 kW for the Moon, enough to power roughly 30 homes, because solar panels are useless during the two-week lunar night.',
    factBn: 'NASA-র ফিশন সারফেস পাওয়ার প্রকল্প চাঁদের জন্য প্রায় ৪০ kW-এর একটি রিঅ্যাক্টর তৈরি করছে, যা প্রায় ৩০টি বাড়িতে বিদ্যুৎ দিতে যথেষ্ট, কারণ দুই সপ্তাহের চন্দ্র রাতে সোলার প্যানেল অকার্যকর।',
    choices: [
      {
        label: 'Deploy the reactor',
        labelBn: 'রিঅ্যাক্টর স্থাপন করুন',
        summary: '+15 kW of power every day for the rest of the mission. Costs crew health. -4 health.',
        summaryBn: 'বাকি মিশনে প্রতিদিন +১৫ kW বিদ্যুৎ। ক্রু স্বাস্থ্যের খরচ। -৪ স্বাস্থ্য।',
        effects: { health: -4 },
        modifiers: [{ kind: 'reactor', kW: 15 }],
      },
      {
        label: 'Keep it in storage',
        labelBn: 'স্টোরেজে রাখুন',
        summary: 'Spend the EVA time on experiments instead. +15 science.',
        summaryBn: 'EVA সময় পরীক্ষায় ব্যয় করুন। +১৫ বিজ্ঞান।',
        effects: { science: 15 },
      },
      {
        label: 'Partial deployment',
        labelBn: 'আংশিক স্থাপন',
        summary: 'Install half the reactor. Less EVA risk but less power. +8 kW. -1 health.',
        summaryBn: 'অর্ধেক রিঅ্যাক্টর ইনস্টল করুন। কম EVA ঝুঁকি কিন্তু কম বিদ্যুৎ। +৮ kW। -১ স্বাস্থ্য।',
        effects: { health: -1 },
        modifiers: [{ kind: 'reactor', kW: 8 }],
      },
    ],
  }),
  'lunar-night': () => ({
    id: 'lunar-night',
    kind: 'hazard',
    title: 'Sunset in 2 Days',
    titleBn: '২ দিনে সূর্যাস্ত',
    description: 'The lunar night begins on Day 9 and lasts until Day 13. Solar panels will produce almost nothing. Everything will run on your batteries.',
    descriptionBn: 'চাঁদের রাত ৯ দিনে শুরু হবে এবং ১৩ দিন পর্যন্ত চলবে। সোলার প্যানেল প্রায় কিছুই উৎপাদন করবে না। সবকিছু ব্যাটারিতে চলবে।',
    fact: 'A full lunar day-night cycle lasts about 29.5 Earth days, so night lasts around 14 days. Surface temperatures can drop below \u2212170\u00b0C in the dark.',
    factBn: 'একটি সম্পূর্ণ চন্দ্র দিন-রাত চক্র প্রায় ২৯.৫ পৃথিবী-দিন স্থায়ী হয়, তাই রাত প্রায় ১৪ দিন। অন্ধকারে পৃষ্ঠের তাপমাত্রা −১৭০°C-এর নিচে নামতে পারে।',
    choices: [
      {
        label: 'Stockpile supplies',
        labelBn: 'সরবরাহ মজুত করুন',
        summary: 'Pause experiments to pack extra oxygen and food. +10 oxygen, +10 food, -12 science.',
        summaryBn: 'অতিরিক্ত অক্সিজেন ও খাবার মজুত করতে পরীক্ষা থামান। +১০ অক্সিজেন, +১০ খাবার, -১২ বিজ্ঞান।',
        effects: { oxygen: 10, food: 10, science: -12 },
      },
      {
        label: 'Trust the batteries',
        labelBn: 'ব্যাটারিতে আস্থা রাখুন',
        summary: 'No changes. You will manage power carefully in the dark. +2 morale.',
        summaryBn: 'কোনো পরিবর্তন নেই। আপনি অন্ধকারে সাবধানে বিদ্যুৎ পরিচালনা করবেন। +২ মনোবল।',
        effects: { morale: 2 },
      },
      {
        label: 'Emergency water reserves',
        labelBn: 'জরুরি জলের মজুদ',
        summary: 'Melt stored ice for backup water. Uses battery. +15 water, -8 battery, -5 science.',
        summaryBn: 'ব্যাকআপ জলের জন্য মজুত বরফ গলান। ব্যাটারি ব্যবহার করে। +১৫ পানি, -৮ ব্যাটারি, -৫ বিজ্ঞান।',
        effects: { water: 15, battery: -8, science: -5 },
      },
    ],
  }),
  supply: (d) => ({
    id: 'supply',
    kind: 'opportunity',
    title: 'Cargo Lander Inbound',
    titleBn: 'কার্গো ল্যান্ডার আসছে',
    description: 'A robotic cargo ship has room for one priority shipment. Choose wisely, the next one is a long way off.',
    descriptionBn: 'একটি রোবোটিক কার্গো জাহাজে একটি অগ্রাধিকার চালানের জায়গা আছে। বুদ্ধিমানের মতো বেছে নিন, পরেরটি অনেক দূরে।',
    fact:
      d === 'mars'
        ? 'Earth and Mars line up for efficient launches only once every 26 months, so Mars crews must plan for years without fresh supplies.'
        : 'The Moon is only about 3 days away, but every kilogram launched still costs thousands of dollars, so each cargo slot is precious.',
    factBn:
      d === 'mars'
        ? 'পৃথিবী ও মঙ্গল দক্ষ উৎক্ষেপণের জন্য প্রতি ২৬ মাসে একবার সারিবদ্ধ হয়, তাই মঙ্গলের ক্রুদের বছরের পর বছর তাজা সরবরাহ ছাড়া পরিকল্পনা করতে হয়।'
        : 'চাঁদ মাত্র প্রায় ৩ দিন দূরে, তবে প্রতি কিলোগ্রাম উৎক্ষেপণে এখনো হাজার হাজার ডলার খরচ হয়, তাই প্রতিটি কার্গো স্লট মূল্যবান।',
    choices: [
      { label: 'Food crates', labelBn: 'খাবারের ক্রেট', summary: '+35 food', summaryBn: '+৩৫ খাবার', effects: { food: 35 } },
      { label: 'Water tanks', labelBn: 'জলের ট্যাঙ্ক', summary: '+30 water', summaryBn: '+৩০ পানি', effects: { water: 30 } },
      { label: 'Battery pack', labelBn: 'ব্যাটারি প্যাক', summary: '+40 battery charge', summaryBn: '+৪০ ব্যাটারি চার্জ', effects: { battery: 40 } },
    ],
  }),
  micrometeoroid: () => ({
    id: 'micrometeoroid',
    kind: 'hazard',
    title: 'Micrometeoroid Strike',
    titleBn: 'মাইক্রোমেটিওরয়েড আঘাত',
    description: 'A grain of space rock punched a hole in Module 3. Air is leaking out!',
    descriptionBn: 'একটি মহাকাশ শিলার কণা মডিউল ৩-এ একটি গর্ত করেছে। বাতাস বেরিয়ে যাচ্ছে!',
    fact: 'Micrometeoroids can travel faster than 20 km/s, far faster than a bullet. The ISS uses layered Whipple shields that shatter them before they reach the hull.',
    factBn: 'মাইক্রোমেটিওরয়েড ২০ km/s-এর বেশি গতিতে যেতে পারে, বুলেটের চেয়ে অনেক দ্রুত। ISS স্তরযুক্ত হুইপল শিল্ড ব্যবহার করে যা হালে পৌঁছানোর আগেই তাদের ভেঙে ফেলে।',
    choices: [
      {
        label: 'EVA patch repair',
        labelBn: 'EVA প্যাচ মেরামত',
        summary: 'Fix it from outside. Stops the leak fast. -6 health, -8 oxygen, +3 morale.',
        summaryBn: 'বাইরে থেকে ঠিক করুন। দ্রুত লিক বন্ধ করে। -৬ স্বাস্থ্য, -৮ অক্সিজেন, +৩ মনোবল।',
        effects: { oxygen: -8, health: -6, morale: 3 },
      },
      {
        label: 'Seal off the module',
        labelBn: 'মডিউল সিল করুন',
        summary: 'Lose the lab inside it. -15 oxygen, -12 science, -3 morale.',
        summaryBn: 'ভেতরের ল্যাব হারান। -১৫ অক্সিজেন, -১২ বিজ্ঞান, -৩ মনোবল।',
        effects: { oxygen: -15, science: -12, morale: -3 },
      },
      {
        label: 'Deploy emergency sealant',
        labelBn: 'জরুরি সিল্যান্ট ব্যবহার',
        summary: 'Automated fix — moderate cost. -12 battery, -5 oxygen, +1 morale.',
        summaryBn: 'স্বয়ংক্রিয় মেরামত — মাঝারি খরচ। -১২ ব্যাটারি, -৫ অক্সিজেন, +১ মনোবল।',
        effects: { battery: -12, oxygen: -5, morale: 1 },
      },
    ],
  }),
  blight: () => ({
    id: 'blight',
    kind: 'hazard',
    title: 'Greenhouse Mold',
    titleBn: 'গ্রিনহাউসে ছত্রাক',
    description: 'A fuzzy mold is spreading across the lettuce trays. You need to act before it reaches the potatoes.',
    descriptionBn: 'একটি তুলতুলে ছত্রাক লেটুসের ট্রে জুড়ে ছড়িয়ে পড়ছে। আলুতে পৌঁছানোর আগে আপনাকে পদক্ষেপ নিতে হবে।',
    fact: 'In 2016 astronaut Scott Kelly rescued moldy zinnias on the ISS by adjusting fans and watering. They bloomed, becoming the first flowers grown in space.',
    factBn: '২০১৬ সালে নভোচারী স্কট কেলি ISS-এ ছত্রাক-আক্রান্ত জিনিয়া ফুল ফ্যান ও জল দিয়ে বাঁচিয়েছিলেন। সেগুলো ফুটেছিল, মহাকাশে জন্মানো প্রথম ফুল হয়ে।',
    choices: [
      {
        label: 'Remove and replant',
        labelBn: 'সরিয়ে পুনরায় লাগান',
        summary: 'Throw out the infected crop. -12 food.',
        summaryBn: 'সংক্রামিত ফসল ফেলে দিন। -১২ খাবার।',
        effects: { food: -12 },
      },
      {
        label: 'UV lamp treatment',
        labelBn: 'UV ল্যাম্প চিকিৎসা',
        summary: 'Save the crop. -15 battery, then +30% growth for 3 sols. -4 food.',
        summaryBn: 'ফসল বাঁচান। -১৫ ব্যাটারি, তারপর ৩ সলে +৩০% বৃদ্ধি। -৪ খাবার।',
        effects: { battery: -15, food: -4 },
        modifiers: [{ kind: 'greenhouseBoost', sols: 3, mult: 1.3 }],
      },
      {
        label: 'Quarantine and recycle',
        labelBn: 'কোয়ারেন্টাইন ও পুনর্ব্যবহার',
        summary: 'Compost infected crops for water recovery. -8 food, +8 water.',
        summaryBn: 'জল পুনরুদ্ধারের জন্য সংক্রামিত ফসল কম্পোস্ট করুন। -৮ খাবার, +৮ পানি।',
        effects: { food: -8, water: 8 },
      },
    ],
  }),
  discovery: (d) => ({
    id: 'discovery',
    kind: 'opportunity',
    title: d === 'mars' ? 'Ancient Riverbed Spotted' : 'Water Ice Detected',
    titleBn: d === 'mars' ? 'প্রাচীন নদীখাত দেখা গেছে' : 'জলের বরফ শনাক্ত হয়েছে',
    description:
      d === 'mars'
        ? 'Orbital images show layered rock nearby, possibly an ancient riverbed where microbes might once have lived.'
        : 'Your rover\u2019s sensors picked up water ice in a permanently shadowed crater 3 km away.',
    descriptionBn:
      d === 'mars'
        ? 'কক্ষপথের ছবিতে কাছাকাছি স্তরিত শিলা দেখা গেছে, সম্ভবত একটি প্রাচীন নদীখাত যেখানে একসময় জীবাণু বাস করতে পারত।'
        : 'আপনার রোভারের সেন্সর ৩ কিমি দূরে একটি স্থায়ীভাবে ছায়াযুক্ত গর্তে জলের বরফ শনাক্ত করেছে।',
    fact:
      d === 'mars'
        ? 'NASA\u2019s Perseverance rover is collecting rock samples from Jezero Crater, an ancient lake bed, searching for signs of past microbial life.'
        : 'Craters near the lunar south pole never see sunlight. Ice trapped there could be turned into drinking water, oxygen and even rocket fuel.',
    factBn:
      d === 'mars'
        ? 'NASA-র পার্সিভিয়ারেন্স রোভার জেজেরো ক্রেটার থেকে শিলার নমুনা সংগ্রহ করছে, একটি প্রাচীন হ্রদের তলদেশ, অতীত জীবাণুজীবনের চিহ্ন খুঁজছে।'
        : 'চন্দ্র দক্ষিণ মেরুর কাছের গর্তগুলোতে কখনো সূর্যালোক পড়ে না। সেখানে আটকে থাকা বরফ পানীয় জল, অক্সিজেন এমনকি রকেট জ্বালানিতে রূপান্তরিত হতে পারে।',
    choices: [
      {
        label: 'Send the rover',
        labelBn: 'রোভার পাঠান',
        summary: 'Big discovery! -12 battery, +25 science, +4 morale.',
        summaryBn: 'বড় আবিষ্কার! -১২ ব্যাটারি, +২৫ বিজ্ঞান, +৪ মনোবল।',
        effects: { battery: -12, science: 25, morale: 4 },
      },
      {
        label: 'Log it for later',
        labelBn: 'পরে লগ করুন',
        summary: 'Save power. +6 science.',
        summaryBn: 'বিদ্যুৎ বাঁচান। +৬ বিজ্ঞান।',
        effects: { science: 6 },
      },
      {
        label: 'Crew EVA expedition',
        labelBn: 'ক্রু EVA অভিযান',
        summary: 'Full crew science mission. Highest reward but risky. -8 battery, -5 health, +35 science, +6 morale.',
        summaryBn: 'পুরো ক্রু বিজ্ঞান মিশন। সর্বোচ্চ পুরস্কার কিন্তু ঝুঁকিপূর্ণ। -৮ ব্যাটারি, -৫ স্বাস্থ্য, +৩৫ বিজ্ঞান, +৬ মনোবল।',
        effects: { battery: -8, health: -5, science: 35, morale: 6 },
      },
    ],
  }),
  homesick: (d) => ({
    id: 'homesick',
    kind: 'crew',
    title: 'Crew Feeling Homesick',
    titleBn: 'ক্রু বাড়ির কথা মনে করছে',
    description: 'Your engineer misses their family. The whole crew seems quieter than usual.',
    descriptionBn: 'আপনার ইঞ্জিনিয়ার তাদের পরিবারকে মিস করছে। পুরো ক্রু স্বাভাবিকের চেয়ে শান্ত মনে হচ্ছে।',
    fact:
      d === 'mars'
        ? 'Radio signals take 4 to 24 minutes to travel between Earth and Mars, one way. Live video calls are impossible, so crews trade recorded messages.'
        : 'A radio signal reaches the Moon in about 1.3 seconds, so lunar crews can have nearly live conversations with home.',
    factBn:
      d === 'mars'
        ? 'পৃথিবী ও মঙ্গলের মধ্যে রেডিও সংকেত একদিকে যেতে ৪ থেকে ২৪ মিনিট সময় নেয়। সরাসরি ভিডিও কল অসম্ভব, তাই ক্রুরা রেকর্ড করা বার্তা বিনিময় করে।'
        : 'একটি রেডিও সংকেত প্রায় ১.৩ সেকেন্ডে চাঁদে পৌঁছায়, তাই চন্দ্র ক্রুরা বাড়ির সাথে প্রায় সরাসরি কথা বলতে পারে।',
    choices: [
      {
        label: 'Message home',
        labelBn: 'বাড়িতে বার্তা পাঠান',
        summary: 'Beam videos to Earth. -8 battery, +14 morale.',
        summaryBn: 'পৃথিবীতে ভিডিও পাঠান। -৮ ব্যাটারি, +১৪ মনোবল।',
        effects: { battery: -8, morale: 14 },
      },
      {
        label: 'Movie night',
        labelBn: 'মুভি নাইট',
        summary: 'Popcorn from the greenhouse. -4 food, +7 morale.',
        summaryBn: 'গ্রিনহাউস থেকে পপকর্ন। -৪ খাবার, +৭ মনোবল।',
        effects: { food: -4, morale: 7 },
      },
      {
        label: 'Group therapy session',
        labelBn: 'গ্রুপ থেরাপি সেশন',
        summary: 'Crew supports each other. Pause experiments. -4 science, +10 morale, +2 health.',
        summaryBn: 'ক্রু একে অপরকে সাহায্য করে। পরীক্ষা থামান। -৪ বিজ্ঞান, +১০ মনোবল, +২ স্বাস্থ্য।',
        effects: { science: -4, morale: 10, health: 2 },
      },
    ],
  }),
  scrubber: () => ({
    id: 'scrubber',
    kind: 'hazard',
    title: 'CO\u2082 Scrubber Failure',
    titleBn: 'CO₂ স্ক্রাবার ব্যর্থতা',
    description: 'The filter that removes carbon dioxide from the air has clogged. CO\u2082 levels are rising.',
    descriptionBn: 'বাতাস থেকে কার্বন ডাই অক্সাইড সরানোর ফিল্টারটি আটকে গেছে। CO₂ মাত্রা বাড়ছে।',
    fact: 'On Apollo 13, astronauts built a square-to-round filter adapter from plastic bags, cardboard and duct tape to survive. Engineers on Earth invented it in hours.',
    factBn: 'অ্যাপোলো ১৩-তে নভোচারীরা বেঁচে থাকতে প্লাস্টিকের ব্যাগ, কার্ডবোর্ড ও ডাক্ট টেপ দিয়ে একটি বর্গাকার-থেকে-গোলাকার ফিল্টার অ্যাডাপ্টার তৈরি করেছিলেন। পৃথিবীর প্রকৌশলীরা ঘণ্টার মধ্যে এটি আবিষ্কার করেছিলেন।',
    choices: [
      {
        label: 'Install spare part',
        labelBn: 'অতিরিক্ত যন্ত্রাংশ লাগান',
        summary: 'Reliable fix. -10 science (spare lab parts), +4 oxygen.',
        summaryBn: 'নির্ভরযোগ্য সমাধান। -১০ বিজ্ঞান (অতিরিক্ত ল্যাব যন্ত্রাংশ), +৪ অক্সিজেন।',
        effects: { science: -10, oxygen: 4 },
      },
      {
        label: 'Improvise a fix',
        labelBn: 'ফিক্স জোগাড় করুন',
        summary: 'Apollo 13 style! -12 oxygen, +6 morale.',
        summaryBn: 'অ্যাপোলো ১৩ স্টাইল! -১২ অক্সিজেন, +৬ মনোবল।',
        effects: { oxygen: -12, morale: 6 },
      },
      {
        label: 'Reroute through water recycler',
        labelBn: 'ওয়াটার রিসাইক্লার দিয়ে রিরুট',
        summary: 'Use water system as backup air filter. -10 water, +8 oxygen.',
        summaryBn: 'ব্যাকআপ এয়ার ফিল্টার হিসেবে জল ব্যবস্থা ব্যবহার করুন। -১০ পানি, +৮ অক্সিজেন।',
        effects: { water: -10, oxygen: 8 },
      },
    ],
  }),
  sick: () => ({
    id: 'sick',
    kind: 'crew',
    title: 'Crew Member Unwell',
    titleBn: 'ক্রু সদস্য অসুস্থ',
    description: 'Your geologist has a fever and dizziness. The mission doctor recommends rest.',
    descriptionBn: 'আপনার ভূতত্ত্ববিদের জ্বর ও মাথা ঘুরছে। মিশন ডাক্তার বিশ্রামের পরামর্শ দিয়েছেন।',
    fact: 'In lower gravity, astronauts lose bone and muscle. On the ISS they exercise about 2 hours a day. Mars has 38% of Earth\u2019s gravity, the Moon just 17%.',
    factBn: 'কম মাধ্যাকর্ষণে নভোচারীরা হাড় ও পেশী হারায়। ISS-এ তারা দিনে প্রায় ২ ঘণ্টা ব্যায়াম করে। মঙ্গলে পৃথিবীর ৩৮% মাধ্যাকর্ষণ, চাঁদে মাত্র ১৭%।',
    choices: [
      {
        label: 'Full rest day',
        labelBn: 'পূর্ণ বিশ্রামের দিন',
        summary: 'Health recovers. -8 science, +7 health.',
        summaryBn: 'স্বাস্থ্য সুস্থ হয়। -৮ বিজ্ঞান, +৭ স্বাস্থ্য।',
        effects: { science: -8, health: 7 },
      },
      {
        label: 'Telemedicine consult',
        labelBn: 'টেলিমেডিসিন পরামর্শ',
        summary: 'Doctors on Earth help. -6 battery, +3 health, +2 morale.',
        summaryBn: 'পৃথিবীর ডাক্তাররা সাহায্য করেন। -৬ ব্যাটারি, +৩ স্বাস্থ্য, +২ মনোবল।',
        effects: { battery: -6, health: 3, morale: 2 },
      },
      {
        label: 'Crew fitness regime',
        labelBn: 'ক্রু ফিটনেস প্রোগ্রাম',
        summary: 'Exercise program to build strength back. -5 food, +5 health, +3 morale.',
        summaryBn: 'শক্তি ফিরে পেতে ব্যায়াম প্রোগ্রাম। -৫ খাবার, +৫ স্বাস্থ্য, +৩ মনোবল।',
        effects: { food: -5, health: 5, morale: 3 },
      },
    ],
  }),
  quake: (d) => ({
    id: 'quake',
    kind: 'hazard',
    title: d === 'mars' ? 'Marsquake!' : 'Moonquake!',
    titleBn: d === 'mars' ? 'মঙ্গলকম্প!' : 'চন্দ্রকম্প!',
    description: 'The ground just shook. Some cables may have come loose and the crew is rattled.',
    descriptionBn: 'মাটি কেঁপে উঠেছে। কিছু তার আলগা হয়ে যেতে পারে এবং ক্রু বিচলিত।',
    fact:
      d === 'mars'
        ? 'NASA\u2019s InSight lander detected more than 1,300 marsquakes, proving Mars is still geologically active.'
        : 'Apollo astronauts left seismometers on the Moon. They found shallow moonquakes that can last over 10 minutes because the dry lunar rock rings like a bell.',
    factBn:
      d === 'mars'
        ? 'NASA-র InSight ল্যান্ডার ১,৩০০-এরও বেশি মঙ্গলকম্প শনাক্ত করেছে, প্রমাণ করে যে মঙ্গল এখনো ভূতাত্ত্বিকভাবে সক্রিয়।'
        : 'অ্যাপোলো নভোচারীরা চাঁদে সিসমোমিটার রেখে এসেছিলেন। তারা অগভীর চন্দ্রকম্প পেয়েছিলেন যা ১০ মিনিটেরও বেশি স্থায়ী হতে পারে কারণ শুষ্ক চন্দ্র শিলা ঘণ্টার মতো বাজে।',
    choices: [
      {
        label: 'Inspect and record',
        labelBn: 'পরীক্ষা ও রেকর্ড করুন',
        summary: 'Study the quake data. -3 health, +12 science.',
        summaryBn: 'ভূমিকম্পের তথ্য অধ্যয়ন করুন। -৩ স্বাস্থ্য, +১২ বিজ্ঞান।',
        effects: { health: -3, science: 12 },
      },
      {
        label: 'Quick systems check',
        labelBn: 'দ্রুত সিস্টেম চেক',
        summary: 'Fast reboot. -10 battery.',
        summaryBn: 'দ্রুত রিবুট। -১০ ব্যাটারি।',
        effects: { battery: -10 },
      },
      {
        label: 'Full evacuation drill',
        labelBn: 'সম্পূর্ণ সরিয়ে নেওয়ার মহড়া',
        summary: 'Safe but disrupts everything. -5 battery, -5 science, +2 health, -2 morale.',
        summaryBn: 'নিরাপদ কিন্তু সবকিছু ব্যাহত করে। -৫ ব্যাটারি, -৫ বিজ্ঞান, +২ স্বাস্থ্য, -২ মনোবল।',
        effects: { battery: -5, science: -5, health: 2, morale: -2 },
      },
    ],
  }),
  'clear-skies': (d) => ({
    id: 'clear-skies',
    kind: 'opportunity',
    title: d === 'mars' ? 'Dust Devil Cleaned the Panels' : 'Perfect Sun Angle',
    titleBn: d === 'mars' ? 'ডাস্ট ডেভিল প্যানেল পরিষ্কার করেছে' : 'নিখুঁত সূর্যকোণ',
    description:
      d === 'mars'
        ? 'A spinning whirlwind swept across the base and blew the dust off your solar arrays. Power is up!'
        : 'Your solar towers are catching the Sun perfectly along the crater rim. Extra power for 3 days.',
    descriptionBn:
      d === 'mars'
        ? 'একটি ঘূর্ণিবাতাস ঘাঁটি জুড়ে বয়ে গিয়ে আপনার সোলার অ্যারে থেকে ধুলো উড়িয়ে দিয়েছে। বিদ্যুৎ বেড়েছে!'
        : 'আপনার সোলার টাওয়ারগুলো গর্তের ধার বরাবর সূর্যকে নিখুঁতভাবে ধরছে। ৩ দিনের জন্য অতিরিক্ত বিদ্যুৎ।',
    fact:
      d === 'mars'
        ? 'Dust devils cleaned the solar panels of NASA\u2019s Spirit and Opportunity rovers many times, helping them survive years longer than their planned 90-sol missions.'
        : 'Some peaks near the lunar south pole are sunlit over 80% of the time, which is why NASA targets this region for Artemis bases.',
    factBn:
      d === 'mars'
        ? 'ডাস্ট ডেভিল NASA-র স্পিরিট ও অপরচুনিটি রোভারের সোলার প্যানেল বহুবার পরিষ্কার করেছে, তাদের পরিকল্পিত ৯০-সল মিশনের চেয়ে বছরের পর বছর বেশি টিকতে সাহায্য করেছে।'
        : 'চন্দ্র দক্ষিণ মেরুর কাছের কিছু চূড়া ৮০%-এর বেশি সময় সূর্যালোকিত থাকে, যে কারণে NASA আর্টেমিস ঘাঁটির জন্য এই অঞ্চলকে লক্ষ্য করে।',
    choices: [
      {
        label: 'Bank the energy',
        labelBn: 'শক্তি সঞ্চয় করুন',
        summary: '+20 battery now, +25% solar for 3 sols.',
        summaryBn: 'এখনই +২০ ব্যাটারি, ৩ সলের জন্য +২৫% সোলার।',
        effects: { battery: 20 },
        modifiers: [{ kind: 'solarBoost', sols: 3, factor: 1.25 }],
      },
      {
        label: 'Run bonus experiments',
        labelBn: 'বোনাস পরীক্ষা চালান',
        summary: '+12 science, +25% solar for 3 sols.',
        summaryBn: '+১২ বিজ্ঞান, ৩ সলের জন্য +২৫% সোলার।',
        effects: { science: 12 },
        modifiers: [{ kind: 'solarBoost', sols: 3, factor: 1.25 }],
      },
      {
        label: 'Boost water recycler',
        labelBn: 'ওয়াটার রিসাইক্লার বুস্ট',
        summary: 'Use extra power for water processing. +15 water, +25% solar for 3 sols.',
        summaryBn: 'জল প্রক্রিয়াকরণে অতিরিক্ত বিদ্যুৎ ব্যবহার করুন। +১৫ পানি, ৩ সলের জন্য +২৫% সোলার।',
        effects: { water: 15 },
        modifiers: [{ kind: 'solarBoost', sols: 3, factor: 1.25 }],
      },
    ],
  }),
  'water-recycler': () => ({
    id: 'water-recycler',
    kind: 'hazard',
    title: 'Water Recycler Malfunction',
    titleBn: 'ওয়াটার রিসাইক্লার ত্রুটি',
    description: 'The ECLSS water recovery unit is showing pressure anomalies. NASA JSC reports: "Brine Processor Assembly offline. Recovery rate dropped from 93% to 40%." Crew water reserves are depleting rapidly.',
    descriptionBn: 'ECLSS জল পুনরুদ্ধার ইউনিটে চাপের অস্বাভাবিকতা দেখা যাচ্ছে। NASA JSC রিপোর্ট: "ব্রাইন প্রসেসর অ্যাসেম্বলি অফলাইন। পুনরুদ্ধারের হার ৯৩% থেকে ৪০%-এ নেমেছে।" ক্রুর জলের মজুদ দ্রুত কমছে।',
    fact: 'The ISS Water Recovery System recycles about 93% of all wastewater \u2014 including sweat, humidity, and urine \u2014 back into drinking water using distillation and iodine treatment. Each crew member needs about 1 gallon (3.8 liters) per day.',
    factBn: 'ISS ওয়াটার রিকভারি সিস্টেম সমস্ত বর্জ্য জলের প্রায় ৯৩% \u2014 ঘাম, আর্দ্রতা এবং মূত্র সহ \u2014 পাতন ও আয়োডিন চিকিৎসার মাধ্যমে পানীয় জলে পুনর্ব্যবহার করে। প্রতিটি ক্রু সদস্যের প্রতিদিন প্রায় ১ গ্যালন (৩.৮ লিটার) প্রয়োজন।',
    choices: [
      {
        label: 'Manual filter bypass',
        labelBn: 'ম্যানুয়াল ফিল্টার বাইপাস',
        summary: 'Crew spends a shift hand-filtering water. Slow but saves the system. -6 health, +5 water.',
        summaryBn: 'ক্রু এক শিফটে হাতে জল ফিল্টার করে। ধীর কিন্তু সিস্টেম বাঁচায়। -৬ স্বাস্থ্য, +৫ পানি।',
        effects: { health: -6, water: 5 },
      },
      {
        label: 'Swap to backup unit',
        labelBn: 'ব্যাকআপ ইউনিটে স্যুইচ',
        summary: 'Use the spare parts from the science lab. Reliable fix. -15 science, +10 water.',
        summaryBn: 'বিজ্ঞান ল্যাব থেকে অতিরিক্ত যন্ত্রাংশ ব্যবহার করুন। নির্ভরযোগ্য সমাধান। -১৫ বিজ্ঞান, +১০ পানি।',
        effects: { science: -15, water: 10 },
      },
      {
        label: 'Ration water supply',
        labelBn: 'জল সরবরাহ রেশন করুন',
        summary: 'Cut water usage to minimum. Crew will be uncomfortable. -8 morale, -5 water.',
        summaryBn: 'জলের ব্যবহার সর্বনিম্নে কমান। ক্রু অস্বস্তিতে থাকবে। -৮ মনোবল, -৫ পানি।',
        effects: { morale: -8, water: -5 },
      },
    ],
  }),
}

export const RANDOM_EVENT_IDS = ['micrometeoroid', 'blight', 'discovery', 'homesick', 'scrubber', 'sick', 'quake', 'clear-skies', 'water-recycler']

export const SCHEDULED_EVENTS: Record<Destination, Record<number, string>> = {
  mars: { 4: 'flare', 9: 'dust-storm', 13: 'supply', 16: 'flare' },
  moon: { 3: 'reactor', 5: 'flare', 7: 'lunar-night', 15: 'supply', 17: 'flare' },
}
