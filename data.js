// Future Map — all survey content lives here so it is easy to edit.

// The 50 areas the game uses are hidden from the player. Their clue words are
// in words.js and jobs are tagged with them in jobs.js.

// The player is a grown-up, and the game guesses the job they have now.
// Quick-fire questions in the style of street "guess my job" videos.
// Everyone answers these 12 first, in their own words.
// Short, plain, open questions anyone in any job can answer, wherever they are.
// kind "path": university words favour long-training jobs; apprenticeship/no-degree words favour short ones.
// kind "inout": inside/outside favours the areas listed in INOUT.
// "hint" is shown faintly in the answer box. "named" is how much saying a job
// name counts (default 0.25). Players are asked not to say their job's name.
const QUESTIONS = [
  { q: "Where do you work?", hint: "Like: an office, a hospital, outside, a shop, from home…", kind: "inout" },
  { q: "What do you wear to work?", hint: "Like: a uniform, scrubs, a suit, whatever I want…" },
  { q: "How did you get your job?", hint: "Like: university, an apprenticeship, I worked my way up…", kind: "path", named: 0.6 },
  { q: "What do you do most of the day?", hint: "Like: answer emails, fix cars, teach kids…" },
  { q: "Who do you work with or help?", hint: "Like: customers, patients, kids, animals, my team…" },
  { q: "What tools or things do you use for work?", hint: "Like: a laptop, a wrench, an oven, a van…" },
  { q: "What's the best part of your job?", hint: "Like: helping people, building things, the money…" },
  { q: "What's the hardest part of your job?", hint: "Like: long hours, rude customers, deadlines…" },
  { q: "Who's your boss?", hint: "Like: the head chef, the principal, me!", named: 0 },
  { q: "What's a word people at your job use a lot?", hint: "Like: 'stat', 'deadline', 'order up'…" },
  { q: "What do people ask you when they find out your job?", hint: "Like: 'Can you fix my computer?'" },
  { q: "Give me one big clue, without saying your job.", hint: "Like: I help people who…", named: 0.6 },
];

// Which areas count as mostly inside or mostly outside work.
const INOUT = { inside: "code itsup money write mgmt law school doc nurse dent lab cook service style", outside: "grow enviro explore sport police fire mil build drive wild" };

// Follow-up questions, one per hidden area. After the first 12, the game picks
// the follow-ups that best split its current top guesses. Naming a job counts 0.6.
const FOLLOWUPS = [
  { for: "lab", q: "Do you test or study things? What?" },
  { for: "earth", q: "Does the weather or the ground matter in your job? How?" },
  { for: "rsch", q: "What kind of problems do you solve?" },
  { for: "code", q: "What do you do on a computer at work?" },
  { for: "itsup", q: "What tech do you use or fix at work?" },
  { for: "cyber", q: "What do you keep safe or secure?" },
  { for: "build", q: "What do you build or fix?" },
  { for: "eng", q: "What do you design or plan?" },
  { for: "elec", q: "How do wires, power or electricity come into your job?" },
  { for: "drive", q: "How much do you drive or travel around for work?" },
  { for: "repair", q: "What kind of things do you repair?" },
  { for: "fly", q: "How do planes or airports come into your job?" },
  { for: "space", q: "How do space, stars or rockets come into your job?" },
  { for: "visual", q: "What do you draw, design or make look good?" },
  { for: "style", q: "How do clothes, hair or looks come into your job?" },
  { for: "craft", q: "What do you make by hand?" },
  { for: "music", q: "How does music come into your job?" },
  { for: "stage", q: "How do you perform or entertain people?" },
  { for: "film", q: "What do you film or photograph?" },
  { for: "games", q: "How do games come into your job?" },
  { for: "news", q: "What do you share with an audience?" },
  { for: "write", q: "What do you read or write for work?" },
  { for: "lang", q: "What languages do you use at work?" },
  { for: "school", q: "Who do you teach, and what?" },
  { for: "instr", q: "What do you train or coach people to do?" },
  { for: "doc", q: "How do you help people with their health?" },
  { for: "nurse", q: "How do you look after patients?" },
  { for: "dent", q: "How do teeth come into your job?" },
  { for: "mind", q: "How do you help people with their feelings?" },
  { for: "rehab", q: "How do you help people heal or move better?" },
  { for: "kids", q: "How do kids come into your job?" },
  { for: "social", q: "Who do you support, and how?" },
  { for: "service", q: "What do customers ask you for?" },
  { for: "police", q: "How does crime or the law come into your job?" },
  { for: "fire", q: "What emergencies do you deal with?" },
  { for: "mil", q: "How do rules, ranks or training come into your job?" },
  { for: "law", q: "How do laws, contracts or courts come into your job?" },
  { for: "govt", q: "How does the government come into your job?" },
  { for: "mgmt", q: "Who do you lead or organise?" },
  { for: "money", q: "How does money come into your job?" },
  { for: "sales", q: "What do you sell?" },
  { for: "grow", q: "What do you grow or look after outdoors?" },
  { for: "enviro", q: "How does nature come into your job?" },
  { for: "pets", q: "How do pets come into your job?" },
  { for: "wild", q: "What animals do you work with?" },
  { for: "sport", q: "How does sport come into your job?" },
  { for: "fit", q: "How physical is your job?" },
  { for: "travel", q: "Where does your job take you?" },
  { for: "explore", q: "How do the outdoors come into your job?" },
  { for: "cook", q: "How do food or drinks come into your job?" },
];

const TOTAL_QUESTIONS = 18;
