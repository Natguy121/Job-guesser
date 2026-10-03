// Future Map — all survey content lives here so it is easy to edit.

// The 50 areas the game uses are hidden from the player. Their clue words are
// in words.js and jobs are tagged with them in jobs.js.

// The player is a grown-up, and the game guesses the job they have now.
// Quick-fire questions in the style of street "guess my job" videos.
// Everyone answers these 12 first, in their own words.
// kind "yesno": a yes adds a little to the "yes" areas, a no to the "no" areas.
// degree: a yes favours jobs with 4+ years of training, a no favours short training.
// kind "inout": inside/outside favours the areas listed in INOUT.
// ignore: areas this question's answer doesn't count for. weight: how much it counts (default 1).
// "hint" is shown faintly in the answer box. "named" is how much saying a job
// name counts (default 0.25). Players are asked not to say their job's name.
const QUESTIONS = [
  { q: "Inside or outside?", hint: "Inside, outside or both", kind: "inout" },
  { q: "Do you wear a uniform?", hint: "Yes or no. Tell me more if you like", kind: "yesno",
    yes: "police fire mil nurse doc dent cook service fly repair", no: "code visual money write film mgmt rsch" },
  { q: "Did you need a university degree?", hint: "Yes or no", kind: "yesno", degree: true, named: 0.6 },
  { q: "Do you work with your hands?", hint: "Yes or no", kind: "yesno",
    yes: "build repair elec craft cook style nurse dent rehab grow pets", no: "code money mgmt write law govt rsch" },
  { q: "Do you deal with the public every day?", hint: "Yes or no", kind: "yesno",
    yes: "service sales social school nurse doc police cook travel style", no: "code rsch build write eng repair" },
  { q: "What's in your pockets or bag at work?", hint: "Like: a pen, keys, a stethoscope, a tape measure…" },
  { q: "What are you doing at work right now, at this time of day?", hint: "Like: in a meeting, on a ladder, in surgery…" },
  { q: "Who's your boss?", hint: "Like: the head chef, the principal, me!", named: 0 },
  { q: "What's the most dangerous part of your job?", hint: "Like: knives, angry customers, paper cuts…" },
  { q: "Give me a word people would only hear at your job.", hint: "Like: 'stat', 'deadline', 'eighty-six'…" },
  { q: "If your job was a food, what would it be?", hint: "Anything goes. Why that food?", ignore: "fod", weight: 0.5 },
  { q: "Last one before the follow-ups: give me your best clue, without saying your job.", hint: "Like: I help people who…", named: 0.6 },
];

// Which areas count as mostly inside or mostly outside work.
const INOUT = { inside: "code itsup money write mgmt law school doc nurse dent lab cook service style", outside: "grow enviro explore sport police fire mil build drive wild" };

// Follow-up questions, one per hidden area. After the first 12, the game picks
// the follow-ups that best split its current top guesses. Naming a job counts 0.6.
const FOLLOWUPS = [
  { for: "lab", q: "Do you ever work in a lab? Doing what?" },
  { for: "earth", q: "Does the weather, rocks or the ground matter in your work?" },
  { for: "rsch", q: "Do you research, analyse or work things out from data?" },
  { for: "code", q: "Do you write code or build software?" },
  { for: "itsup", q: "When the wifi breaks, do people come to you?" },
  { for: "cyber", q: "Do you protect anything from hackers?" },
  { for: "build", q: "Do you build or fix things in buildings?" },
  { for: "eng", q: "Do you draw up plans or designs for things that get built?" },
  { for: "elec", q: "Do you work with wires, power or electricity?" },
  { for: "drive", q: "How much of your day are you behind the wheel?" },
  { for: "repair", q: "What breaks that you have to fix?" },
  { for: "fly", q: "Do you spend time in airports or planes for work?" },
  { for: "space", q: "Does anything about stars, rockets or satellites come up at work?" },
  { for: "visual", q: "Do you draw, paint or design things people look at?" },
  { for: "style", q: "Is how people look part of your job?" },
  { for: "craft", q: "Do you make things by hand that people buy?" },
  { for: "music", q: "Is music part of your job?" },
  { for: "stage", q: "Do you ever perform in front of an audience?" },
  { for: "film", q: "Do you use a camera at work?" },
  { for: "games", q: "Are games part of your job?" },
  { for: "news", q: "Do you report on things or post for an audience?" },
  { for: "write", q: "How much of your day is reading or writing?" },
  { for: "lang", q: "Do you use more than one language at work?" },
  { for: "school", q: "Do you teach? Who?" },
  { for: "instr", q: "Do you train or coach grown-ups?" },
  { for: "doc", q: "Do you diagnose or treat people?" },
  { for: "nurse", q: "Do you look after patients up close, every shift?" },
  { for: "dent", q: "Are teeth part of your job?" },
  { for: "mind", q: "Do people tell you about their feelings at work?" },
  { for: "rehab", q: "Do you help people recover or move better?" },
  { for: "kids", q: "Do you work with kids?" },
  { for: "social", q: "Do you help people who are going through a hard time?" },
  { for: "service", q: "Do you serve customers face to face?" },
  { for: "police", q: "Does crime ever come into your job?" },
  { for: "fire", q: "Do you rush to emergencies?" },
  { for: "mil", q: "Do you salute anyone at work?" },
  { for: "law", q: "Do contracts, courts or the law come up in your work?" },
  { for: "govt", q: "Do you work for the government or in politics?" },
  { for: "mgmt", q: "How many people report to you?" },
  { for: "money", q: "Do you count, move or look after money?" },
  { for: "sales", q: "Do you have to sell things?" },
  { for: "grow", q: "Do you grow anything?" },
  { for: "enviro", q: "Do you work to protect nature?" },
  { for: "pets", q: "Do pets come into your work?" },
  { for: "wild", q: "Do you work with animals? Which ones?" },
  { for: "sport", q: "Is sport part of your job?" },
  { for: "fit", q: "Do you need to be fit for your job?" },
  { for: "travel", q: "Does your job take you to other places?" },
  { for: "explore", q: "Do you go into the wild outdoors for work?" },
  { for: "cook", q: "Is food or drink part of your job?" },
];

const TOTAL_QUESTIONS = 18;
