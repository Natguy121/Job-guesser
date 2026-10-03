// Future Map — all survey content lives here so it is easy to edit.

// The 50 areas the game uses are hidden from the player. Their clue words are
// in words.js and jobs are tagged with them in jobs.js.

// The player is a grown-up, and the game guesses the job they have now.
// Quick-fire questions in the style of street "guess my job" videos.
// Everyone answers these 12 first, in their own words.
// Every question is open, so anyone in any job can answer it.
// kind "path": university words favour long-training jobs; apprenticeship/no-degree words favour short ones.
// kind "inout": inside/outside favours the areas listed in INOUT.
// ignore: areas this question's answer doesn't count for. weight: how much it counts (default 1).
// "hint" is shown faintly in the answer box. "named" is how much saying a job
// name counts (default 0.25). Players are asked not to say their job's name.
const QUESTIONS = [
  { q: "Describe the view from where you spend your workday.", hint: "Like: four screens and a coffee mug, a muddy field, a busy ward…", kind: "inout" },
  { q: "Describe your work outfit like a fashion commentator on the red carpet.", hint: "Like: 'Stunning in hi-vis orange, paired with steel-toe boots…'" },
  { q: "How did you end up in your job? Tell me your origin story.", hint: "Like: three years at university, an apprenticeship, total luck…", kind: "path", named: 0.6 },
  { q: "If your hands could talk, what would they say about your day?", hint: "Like: 'So much typing!', 'Stop washing us!', 'We need gloves'" },
  { q: "Tell me about the most interesting person you dealt with at work lately. No names!", hint: "Like: a customer who…, a patient who…, a kid who…" },
  { q: "Empty your pockets or bag. What's in there?", hint: "Like: a pen, keys, a stethoscope, a tape measure…" },
  { q: "Your workday is a movie trailer. Narrate the first ten seconds.", hint: "Like: 'In a world of overflowing inboxes…'" },
  { q: "Who's your boss, and what would they say about you?", hint: "Like: 'The head chef would say I'm fast'", named: 0 },
  { q: "What's the most dangerous, or most annoying, part of your job?", hint: "Like: knives, angry customers, paper cuts…" },
  { q: "Teach me a word or phrase only people in your job would use.", hint: "Like: 'stat', 'eighty-six', 'circle back'…" },
  { q: "If your job was a food, what would it be and why?", hint: "Anything goes!", ignore: "cook", weight: 0.5 },
  { q: "Give me your best clue, without saying your job.", hint: "Like: I help people who…", named: 0.6 },
];

// Which areas count as mostly inside or mostly outside work.
const INOUT = { inside: "code itsup money write mgmt law school doc nurse dent lab cook service style", outside: "grow enviro explore sport police fire mil build drive wild" };

// Follow-up questions, one per hidden area. After the first 12, the game picks
// the follow-ups that best split its current top guesses. Naming a job counts 0.6.
const FOLLOWUPS = [
  { for: "lab", q: "Describe the messiest experiment or test you've seen at work." },
  { for: "earth", q: "How does the weather or the ground change your workday?" },
  { for: "rsch", q: "What's a puzzle or problem you had to figure out recently?" },
  { for: "code", q: "What's the last thing you made or fixed on a computer?" },
  { for: "itsup", q: "What tech gadget would your workplace fall apart without?" },
  { for: "cyber", q: "What do you guard, protect or keep secret at work?" },
  { for: "build", q: "What's something you've made or fixed that you're proud of?" },
  { for: "eng", q: "If you could redesign one thing at your work, what would it be?" },
  { for: "elec", q: "What would happen at your job if the power went out?" },
  { for: "drive", q: "How do you get around during your workday?" },
  { for: "repair", q: "What breaks at your work, and who fixes it?" },
  { for: "fly", q: "Tell me about the last time your work took you up high." },
  { for: "space", q: "What would your job look like on the moon?" },
  { for: "visual", q: "What's the most beautiful thing you've worked on?" },
  { for: "style", q: "What would people notice first about you after work?" },
  { for: "craft", q: "What have you made with your own hands lately?" },
  { for: "music", q: "What does your workplace sound like?" },
  { for: "stage", q: "When do people watch you work?" },
  { for: "film", q: "If someone filmed your job, what would the best shot be?" },
  { for: "games", q: "Where does fun or play show up in your job?" },
  { for: "news", q: "What would a newspaper headline about your workday say?" },
  { for: "write", q: "What's the last thing you wrote or read at work?" },
  { for: "lang", q: "How many ways do you talk to people at work, and in what languages?" },
  { for: "school", q: "What's something you explained to someone at work recently?" },
  { for: "instr", q: "What do you train people to do?" },
  { for: "doc", q: "What questions do people ask you about their health?" },
  { for: "nurse", q: "Describe a long shift in three words." },
  { for: "dent", q: "What do people say about your job when they smile?" },
  { for: "mind", q: "What do people trust you with at work?" },
  { for: "rehab", q: "How do you help people move, heal or feel better?" },
  { for: "kids", q: "What would a kid say if they spent the day with you at work?" },
  { for: "social", q: "Who do you help when they're having a hard day?" },
  { for: "service", q: "What's the most common thing people ask you for?" },
  { for: "police", q: "What's the strangest thing you've had to deal with at work?" },
  { for: "fire", q: "What happens at your job when something goes really wrong?" },
  { for: "mil", q: "Describe the rules at your workplace in one sentence." },
  { for: "law", q: "What do people argue about at your work?" },
  { for: "govt", q: "Who does your work serve?" },
  { for: "mgmt", q: "Who depends on you at work, and why?" },
  { for: "money", q: "What numbers do you care about at work?" },
  { for: "sales", q: "How do you convince people at work?" },
  { for: "grow", q: "What grows, or what do you grow, at your work?" },
  { for: "enviro", q: "How does nature show up in your work?" },
  { for: "pets", q: "What's the cutest thing you've seen at work?" },
  { for: "wild", q: "What creatures do you come across at work?" },
  { for: "sport", q: "Where do competition and winning show up in your work?" },
  { for: "fit", q: "How tired is your body after a workday, and why?" },
  { for: "travel", q: "Where's the farthest your job has taken you?" },
  { for: "explore", q: "Tell me about the wildest place your work has taken you." },
  { for: "cook", q: "What food or drink is part of your workday?" },
];

const TOTAL_QUESTIONS = 18;
