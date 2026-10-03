// Future Map — all survey content lives here so it is easy to edit.

// The 20 topics. Every answer and every job is tagged with these.
const TOPICS = {
  sci: { name: "Science & Experiments",  icon: "🔬" },
  tec: { name: "Technology & Coding",    icon: "💻" },
  bld: { name: "Building & Engineering", icon: "🏗️" },
  mec: { name: "Machines & Vehicles",    icon: "🚗" },
  spc: { name: "Space & Flight",         icon: "🚀" },
  art: { name: "Art & Design",           icon: "🎨" },
  prf: { name: "Music & Performing",     icon: "🎤" },
  mda: { name: "Movies, Media & Games",  icon: "🎬" },
  wrd: { name: "Reading & Writing",      icon: "✍️" },
  tea: { name: "Teaching & Explaining",  icon: "🧑‍🏫" },
  hlp: { name: "Health & Medicine",      icon: "🩺" },
  car: { name: "Caring & Community",     icon: "🤝" },
  saf: { name: "Safety & Rescue",        icon: "🚒" },
  lea: { name: "Leading & Law",          icon: "⚖️" },
  biz: { name: "Business & Money",       icon: "💰" },
  nat: { name: "Nature & Environment",   icon: "🌿" },
  ani: { name: "Animals",                icon: "🐾" },
  spo: { name: "Sports & Fitness",       icon: "⚽" },
  adv: { name: "Adventure & Travel",     icon: "🧭" },
  fod: { name: "Food & Cooking",         icon: "🍳" },
};

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
    yes: "saf hlp fod mec spc spo", no: "tec art biz wrd mda lea" },
  { q: "Did you need a university degree?", hint: "Yes or no", kind: "yesno", degree: true, named: 0.6 },
  { q: "Do you work with your hands?", hint: "Yes or no", kind: "yesno",
    yes: "bld mec art fod hlp ani", no: "tec biz lea wrd tea" },
  { q: "Do you deal with the public every day?", hint: "Yes or no", kind: "yesno",
    yes: "car biz fod hlp tea saf prf", no: "tec sci bld wrd mec" },
  { q: "What's in your pockets or bag at work?", hint: "Like: a pen, keys, a stethoscope, a tape measure…" },
  { q: "What are you doing at work right now, at this time of day?", hint: "Like: in a meeting, on a ladder, in surgery…" },
  { q: "Who's your boss?", hint: "Like: the head chef, the principal, me!" },
  { q: "What's the most dangerous part of your job?", hint: "Like: knives, angry customers, paper cuts…" },
  { q: "Give me a word people would only hear at your job.", hint: "Like: 'stat', 'deadline', 'eighty-six'…" },
  { q: "If your job was a food, what would it be?", hint: "Anything goes. Why that food?", ignore: "fod", weight: 0.5 },
  { q: "Last one before the follow-ups: give me your best clue, without saying your job.", hint: "Like: I help people who…", named: 0.6 },
];

// Which areas count as mostly inside or mostly outside work.
const INOUT = { inside: "tec biz wrd lea tea hlp sci fod mda", outside: "nat adv spo saf bld mec ani" };

// Follow-up questions (2 per topic). After the first 12, the game asks about
// the topics it has found the most clues for. Naming a job here counts 0.6.
const FOLLOWUPS = [
  { for: "sci", q: "What do you study, test or research at work?" },
  { for: "sci", q: "Do you work in a lab? What kind of experiments or tests do you run?" },
  { for: "tec", q: "What software, code or computer systems do you work on?" },
  { for: "tec", q: "What tech problems do you solve for people?" },
  { for: "bld", q: "What do you build, design or put together?" },
  { for: "bld", q: "Do you work on buildings, machines or something else? Tell me more." },
  { for: "mec", q: "What vehicles or machines do you drive, run or repair?" },
  { for: "mec", q: "What kind of fixing or driving is part of your job?" },
  { for: "spc", q: "Do you fly, or work with planes, rockets or space? How?" },
  { for: "spc", q: "What part does the sky or space play in your work?" },
  { for: "art", q: "What do you design or create?" },
  { for: "art", q: "What kind of art, style or design skills do you use?" },
  { for: "prf", q: "Do you perform? What do you do in front of an audience?" },
  { for: "prf", q: "What part do music, acting or dancing play in your work?" },
  { for: "mda", q: "What do you film, photograph, edit or post?" },
  { for: "mda", q: "What kind of videos, shows, news or games do you work on?" },
  { for: "wrd", q: "What do you write, read or translate at work?" },
  { for: "wrd", q: "Who reads the things you write?" },
  { for: "tea", q: "Who do you teach, and what do you teach them?" },
  { for: "tea", q: "How do you explain things or train people at work?" },
  { for: "hlp", q: "What do you do for patients or for people's health?" },
  { for: "hlp", q: "What medical tools, tests or treatments do you use?" },
  { for: "car", q: "Who do you look after or support, and how?" },
  { for: "car", q: "How do you help people who are having a hard time?" },
  { for: "saf", q: "What do you protect people from, and how?" },
  { for: "saf", q: "What happens in an emergency at your job?" },
  { for: "lea", q: "What do you decide, manage or lead?" },
  { for: "lea", q: "Do laws, rules or courts come into your work? How?" },
  { for: "biz", q: "What do you sell, buy, count or manage money for?" },
  { for: "biz", q: "What part do money, sales or customers play in your day?" },
  { for: "nat", q: "What part of nature do you work with?" },
  { for: "nat", q: "Do you grow, protect or study anything outdoors? What?" },
  { for: "ani", q: "What animals do you work with, and what do you do for them?" },
  { for: "ani", q: "Do you care for, train, study or treat animals? Tell me more." },
  { for: "spo", q: "What sport or kind of fitness is part of your job?" },
  { for: "spo", q: "Do you play, coach, train or treat athletes?" },
  { for: "adv", q: "Where does your job take you?" },
  { for: "adv", q: "How much do you travel for work, and where to?" },
  { for: "fod", q: "What food or drinks do you make, serve or sell?" },
  { for: "fod", q: "What part does food play in your job?" },
];

const TOTAL_QUESTIONS = 18;
