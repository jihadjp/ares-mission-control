import type { Allocation, Destination, Difficulty, SystemKey } from './types'

export const TOTAL_SOLS = 20
export const BATTERY_RATE = 0.8
export const OXYGEN_PER_KW = 0.6
export const OXYGEN_USE = 10
export const WATER_PER_KW = 0.45
export const WATER_USE = 8
export const FOOD_PER_KW = 0.35
export const FOOD_USE = 5
export const SHIELD_PER_KW = 3
export const FLARE_DOSE = 22

export type DestinationConfig = {
  id: Destination
  body: string
  bodyBn: string
  baseName: string
  baseNameBn: string
  dayLabel: 'Sol' | 'Day'
  solarBase: number
  radiation: number
  image: string
  imageAlt: string
  tagline: string
  taglineBn: string
  challenge: string
  challengeBn: string
  coordinates: string
  nightSols?: [number, number]
  stats: { label: string; value: string; labelBn: string; valueBn: string }[]
  briefing: string
  briefingBn: string
}

export const DESTINATIONS: Record<Destination, DestinationConfig> = {
  mars: {
    id: 'mars',
    body: 'Mars',
    bodyBn: 'মঙ্গল',
    baseName: 'Outpost Ares',
    baseNameBn: 'আউটপোস্ট এরেস',
    dayLabel: 'Sol',
    solarBase: 60,
    radiation: 1.8,
    image: '/images/mars-base.png',
    imageAlt:
      'Isometric view of Outpost Ares on Mars: habitat modules, green greenhouse domes, solar arrays and a purple radiation shield dome on red terrain',
    tagline: 'Thin air, planet-wide dust storms, and radio delays up to 24 minutes.',
    taglineBn: 'পাতলা বায়ুমণ্ডল, গ্রহজুড়ে ধূলিঝড় এবং ২৪ মিনিট পর্যন্ত রেডিও বিলম্ব।',
    challenge: 'Dust storms',
    challengeBn: 'ধূলিঝড়',
    coordinates: 'Lat 18.65N · Lon 226.20E',
    stats: [
      { label: 'Sunlight', value: '43% of Earth', labelBn: 'সূর্যালোক', valueBn: 'পৃথিবীর ৪৩%' },
      { label: 'Radiation', value: 'Moderate', labelBn: 'বিকিরণ', valueBn: 'মাঝারি' },
      { label: 'Signal delay', value: '4–24 min', labelBn: 'সংকেত বিলম্ব', valueBn: '৪–২৪ মিনিট' },
    ],
    briefing:
      'A sol is a Mars day, about 24 h 40 min long. Your solar arrays get less than half the sunlight they would on Earth, so every kilowatt counts.',
    briefingBn:
      'একটি সল হলো মঙ্গলের এক দিন, যা প্রায় ২৪ ঘণ্টা ৪০ মিনিট দীর্ঘ। আপনার সৌর প্যানেল পৃথিবীর তুলনায় অর্ধেকেরও কম সূর্যালোক পায়, তাই প্রতিটি কিলোওয়াট গুরুত্বপূর্ণ।',
  },
  moon: {
    id: 'moon',
    body: 'Moon',
    bodyBn: 'চাঁদ',
    baseName: 'Artemis Base Shackleton',
    baseNameBn: 'আর্টেমিস বেস শ্যাকলেটন',
    dayLabel: 'Day',
    solarBase: 80,
    radiation: 2.4,
    image: '/images/moon-base.png',
    imageAlt:
      'Isometric view of Artemis Base Shackleton at the lunar south pole: white habitat modules, a green greenhouse dome, solar towers and a purple shield dome with Earth on the horizon',
    tagline: 'No atmosphere or magnetic field; lunar night shuts down your solar power.',
    taglineBn: 'কোনো বায়ুমণ্ডল বা চৌম্বক ক্ষেত্র নেই; চাঁদের রাতে সৌরবিদ্যুৎ বন্ধ হয়ে যায়।',
    challenge: 'Lunar night',
    challengeBn: 'চাঁদের রাত',
    coordinates: 'Shackleton Rim · 89.9S',
    nightSols: [9, 13],
    stats: [
      { label: 'Sunlight', value: 'Full, then zero', labelBn: 'সূর্যালোক', valueBn: 'পূর্ণ, তারপর শূন্য' },
      { label: 'Radiation', value: 'High', labelBn: 'বিকিরণ', valueBn: 'বেশি' },
      { label: 'Signal delay', value: '1.3 sec', labelBn: 'সংকেত বিলম্ব', valueBn: '১.৩ সেকেন্ড' },
    ],
    briefing:
      'The Moon has no air to block radiation. Real lunar nights last about 14 Earth days. Here, days 9-13 are dark, and your solar power drops to almost zero.',
    briefingBn:
      'চাঁদে বিকিরণ আটকানোর মতো কোনো বায়ু নেই। বাস্তবে চাঁদের রাত প্রায় ১৪ পৃথিবী-দিন স্থায়ী হয়। এখানে ৯–১৩ দিন অন্ধকার থাকবে এবং আপনার সৌরবিদ্যুৎ প্রায় শূন্যে নেমে যাবে।',
  },
}

export const DIFFICULTY: Record<
  Difficulty,
  { label: string; labelBn: string; description: string; descriptionBn: string; startBattery: number; drain: number; rad: number }
> = {
  cadet: {
    label: 'Cadet',
    labelBn: 'ক্যাডেট',
    description: 'Bigger batteries and gentler hazards. Great for a first mission.',
    descriptionBn: 'বড় ব্যাটারি ও সহজ বিপদ। প্রথম মিশনের জন্য উপযুক্ত.',
    startBattery: 85,
    drain: 0.85,
    rad: 0.8,
  },
  commander: {
    label: 'Commander',
    labelBn: 'কমান্ডার',
    description: 'Real mission margins. Every mistake costs you.',
    descriptionBn: 'বাস্তব মিশনের সীমা। প্রতিটি ভুলের মূল্য দিতে হবে.',
    startBattery: 60,
    drain: 1,
    rad: 1,
  },
}

export const SYSTEMS: { key: SystemKey; label: string; labelBn: string; hint: string; hintBn: string; max: number }[] = [
  { key: 'lifeSupport', label: 'Life Support', labelBn: 'লাইফ সাপোর্ট', hint: 'Generates O₂, recycles water and scrubs CO₂. ~20 kW keeps 4 crew breathing.', hintBn: 'অক্সিজেন তৈরি, জল পুনর্ব্যবহার ও CO₂ পরিষ্কার করে। চারজন ক্রুর জন্য প্রায় ২০ কিলোওয়াট দরকার।', max: 40 },
  { key: 'greenhouse', label: 'Greenhouse', labelBn: 'গ্রিনহাউস', hint: 'Grow lights for crops. ~16 kW keeps food production steady.', hintBn: 'ফসলের জন্য আলো। প্রায় ১৬ কিলোওয়াট খাদ্য উৎপাদন স্থির রাখে।', max: 40 },
  { key: 'shield', label: 'Radiation Shield', labelBn: 'বিকিরণ প্রতিরোধ', hint: 'Each 3.3 kW adds 10% protection. Full power at 33 kW.', hintBn: 'প্রতি ৩.৩ কিলোওয়াটে ১০% সুরক্ষা যোগ হয়। ৩৩ কিলোওয়াটে পূর্ণ শক্তি।', max: 40 },
  { key: 'research', label: 'Science Lab', labelBn: 'বিজ্ঞান ল্যাব', hint: 'Earn science points — that\'s why the outpost was built. Crew likes it too.', hintBn: 'বিজ্ঞান পয়েন্ট অর্জন করুন—এই কারণেই ঘাঁটি তৈরি। ক্রুরাও এটি পছন্দ করে।', max: 40 },
]

export const STARTING_ALLOCATION: Allocation = { lifeSupport: 20, greenhouse: 16, shield: 8, research: 10 }
