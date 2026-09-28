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

// Things to try now, by age group: little (5–8), middle (9–12), teen (13–18).
const TIPS = {
  sci: ["Do kitchen experiments and ask 'why?' a lot.", "Join a science club or enter a science fair.", "Take biology, chemistry, physics and math. Look for science camps."],
  tec: ["Play coding games like ScratchJr.", "Learn Scratch and make a small game or website.", "Take computer science and build a real project in Python or JavaScript."],
  bld: ["Build with blocks, LEGO and cardboard.", "Try a robotics or engineering kit.", "Take engineering, design or shop classes, or look at apprenticeships."],
  mec: ["Play with toy cars, trains and ramps.", "Help an adult fix a bike and learn the parts.", "Take auto shop or physics, and look at mechanic or pilot programs."],
  spc: ["Look at the moon and stars and find constellations.", "Build a model rocket and follow real space missions.", "Take physics and math. Look for astronomy clubs and space camps."],
  art: ["Draw, paint and make crafts every week.", "Keep a sketchbook and try digital drawing apps.", "Take art and design classes and build a portfolio."],
  prf: ["Sing, dance and put on shows at home.", "Join a choir, band or school play.", "Take music or drama classes and perform whenever you can."],
  mda: ["Make up stories with toys and film them with an adult.", "Make short videos and learn simple editing.", "Take media or film classes and start a channel or school news show."],
  wrd: ["Read every day and make up stories.", "Write a diary and join a book club.", "Take English and a new language, and write for the school newspaper."],
  tea: ["Show a friend how to do something you're good at.", "Help younger kids read or play games.", "Tutor classmates or coach younger kids."],
  hlp: ["Learn how your body works and play doctor.", "Learn basic first aid.", "Take biology and health classes and volunteer at a hospital."],
  car: ["Be a kind friend and help at home.", "Volunteer with your family in your community.", "Volunteer regularly, like at a care home, food bank or youth club."],
  saf: ["Learn your address and how to call for help.", "Learn first aid and water safety.", "Look at cadet, lifeguard or first responder programs."],
  lea: ["Take turns being the leader in games.", "Run for class council or be a team captain.", "Join debate, student government or Model UN."],
  biz: ["Play store and save coins for something.", "Run a lemonade or craft stand and track what you earn.", "Take economics or business classes and try a part-time job."],
  nat: ["Plant seeds and explore parks.", "Start a garden or join a nature club.", "Take environmental science and volunteer at parks or clean-ups."],
  ani: ["Learn animal facts and visit farms or zoos.", "Help care for a pet and join an animal club.", "Take biology and volunteer at a shelter or vet clinic."],
  spo: ["Run, jump, swim and try lots of sports.", "Join a team and practise the sport you love.", "Train seriously, take PE, and try coaching younger kids."],
  adv: ["Explore new places near home and look at maps.", "Learn about other countries and start a new language.", "Plan trips, learn languages and look at exchange programs."],
  fod: ["Help cook simple meals with an adult.", "Bake on your own and try new recipes.", "Take cooking classes or work in a kitchen or café."],
};

// Everyone answers these 15 first. Kids type their own answers.
// "hint" is shown faintly inside the answer box to help kids get started.
// "named" is how much naming a job in the answer counts (default 0.25).
const QUESTIONS = [
  { q: "What do you love doing most in your free time?", hint: "Like: playing with my dog, building LEGO, drawing…" },
  { q: "What's your favourite subject at school, and why?", hint: "Like: art because I love painting" },
  { q: "If you could spend a whole day doing anything, what would you do?", hint: "Anything at all!" },
  { q: "What are you really good at?", hint: "Like: running fast, making people laugh, math…" },
  { q: "What do your friends or family say you're great at?", hint: "Like: fixing things, being kind, telling stories…" },
  { q: "If you could build, make or invent anything, what would it be?", hint: "Like: a robot, a treehouse, a new kind of cake…" },
  { q: "Where would you like to spend your day when you're grown up?", hint: "Like: outside, a hospital, a stage, a lab, a kitchen…" },
  { q: "What's something you could talk about for hours?", hint: "Like: dinosaurs, football, space…" },
  { q: "Who is someone you look up to, and what do they do?", hint: "Like: my aunt, she's a nurse" },
  { q: "What kind of videos, shows or books do you like?", hint: "Like: cooking shows, animal videos, mystery books…" },
  { q: "What problem in the world would you like to fix?", hint: "Like: dirty oceans, sick people, bullying…" },
  { q: "What would you do if someone gave you a big pile of money?", hint: "Like: start a business, help animals, travel…" },
  { q: "What's your favourite game or sport?", hint: "Like: soccer, Minecraft, chess…" },
  { q: "How do you like to help other people?", hint: "Like: cheering them up, teaching them things…" },
  { q: "What do you want to be when you grow up? It's okay to say you don't know!", hint: "Like: a vet, a pilot, I don't know yet…", named: 1 },
];

// Follow-up questions (2 per topic). After the first 15, the game asks
// follow-ups about the topics it has found the most clues for, so every kid
// gets different questions. Naming a job in a follow-up counts 0.6.
const FOLLOWUPS = [
  { for: "sci", q: "What would you most like to discover or find out about?" },
  { for: "sci", q: "If you had your own science lab, what experiments would you do?" },
  { for: "tec", q: "What app, game or gadget would you make?" },
  { for: "tec", q: "What do you like doing on computers or tablets?" },
  { for: "bld", q: "What's the biggest thing you'd like to build, and how would you build it?" },
  { for: "bld", q: "If you could design any building or machine, what would it be like?" },
  { for: "mec", q: "Which vehicles or machines do you like most, and why?" },
  { for: "mec", q: "Would you rather drive things, fly things or fix things? Tell me about it." },
  { for: "spc", q: "What would you do if you went to space?" },
  { for: "spc", q: "What do you wonder about stars, planets or flying?" },
  { for: "art", q: "What kind of art or designs do you like making?" },
  { for: "art", q: "If you could design or decorate anything, what would it be?" },
  { for: "prf", q: "What kind of music, dancing or acting do you enjoy?" },
  { for: "prf", q: "If you were on a big stage, what would you do?" },
  { for: "mda", q: "What kind of videos, movies or games would you make?" },
  { for: "mda", q: "Tell me about a show or video you'd love to create." },
  { for: "wrd", q: "What kind of stories or writing do you like?" },
  { for: "wrd", q: "If you wrote a book, what would it be about?" },
  { for: "tea", q: "What would you like to teach other people?" },
  { for: "tea", q: "Who would you like to teach, and how would you do it?" },
  { for: "hlp", q: "How would you like to help people stay healthy?" },
  { for: "hlp", q: "What part of the body or medicine do you find interesting?" },
  { for: "car", q: "Who would you most like to help, and how?" },
  { for: "car", q: "What do you do to make someone feel better when they're sad?" },
  { for: "saf", q: "What kind of rescuing or protecting would you like to do?" },
  { for: "saf", q: "What would you do if there was an emergency?" },
  { for: "lea", q: "What would you change if you were in charge?" },
  { for: "lea", q: "What kind of team or group would you like to lead?" },
  { for: "biz", q: "What business would you start, and what would it sell?" },
  { for: "biz", q: "How would you like to earn money?" },
  { for: "nat", q: "What part of nature do you love most?" },
  { for: "nat", q: "How would you like to help the planet?" },
  { for: "ani", q: "Which animals do you love, and what would you do with them?" },
  { for: "ani", q: "Would you rather take care of, train, study or rescue animals? Tell me more." },
  { for: "spo", q: "Which sports or activities do you love, and what do you like about them?" },
  { for: "spo", q: "Would you rather play sports, coach a team or help athletes? Why?" },
  { for: "adv", q: "Where in the world would you most like to go, and what would you do there?" },
  { for: "adv", q: "What's the most exciting adventure you can imagine?" },
  { for: "fod", q: "What foods do you like to make or eat?" },
  { for: "fod", q: "If you had a restaurant or food shop, what would it be like?" },
];

const TOTAL_QUESTIONS = 25;
