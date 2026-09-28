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
// Everyone answers these 15 first, in their own words.
// "hint" is shown faintly in the answer box. "named" is how much saying a job
// name counts (default 0.25). Players are asked not to say their job's name.
const QUESTIONS = [
  { q: "What do you spend most of a normal workday doing?", hint: "Like: answering emails, fixing pipes, teaching a class…" },
  { q: "Where do you usually work?", hint: "Like: an office, outside, a hospital, a kitchen, at home…" },
  { q: "What tools, machines or programs do you use the most?", hint: "Like: a laptop, a wrench, a stethoscope, an oven…" },
  { q: "Who do you work with or help the most?", hint: "Like: customers, patients, kids, animals, my team…" },
  { q: "What did you study or train in to do your job?", hint: "Like: nursing school, an apprenticeship, a business degree…", named: 0.6 },
  { q: "What's the best part of your job?", hint: "Like: seeing a patient get better, building something…" },
  { q: "What's the hardest part of your job?", hint: "Like: long shifts, tight deadlines, difficult customers…" },
  { q: "What do you wear to work?", hint: "Like: a suit, scrubs, a uniform, a hard hat, whatever I want…" },
  { q: "What problems do people bring to you?", hint: "Like: broken cars, sick pets, tax questions…" },
  { q: "What do you make, fix, sell or deliver?", hint: "Like: software, meals, houses, advice…" },
  { q: "What skills do you use the most?", hint: "Like: math, patience, strength, writing, being creative…" },
  { q: "What does the first hour of your workday look like?", hint: "Like: checking the schedule, opening the shop…" },
  { q: "What kind of place do you work for?", hint: "Like: a big company, a school, a hospital, my own business…" },
  { q: "What do people usually ask you when they find out what you do?", hint: "Like: 'Can you fix my computer?'" },
  { q: "Describe your job in one sentence, without saying its name.", hint: "Like: I help people who…" },
];

// Follow-up questions (2 per topic). After the first 15, the game asks about
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

const TOTAL_QUESTIONS = 25;
