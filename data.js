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

// Everyone answers these 5 first. Together they cover all 20 topics once.
const OPENERS = [
  { q: "Which of these sounds the most fun?", a: [
    ["🧪", "Doing a cool science experiment", "sci"],
    ["🖌️", "Painting a big picture", "art"],
    ["⚽", "Playing a sport", "spo"],
    ["🐶", "Playing with puppies", "ani"] ] },
  { q: "Pick a place to visit.", a: [
    ["🚀", "A rocket launch", "spc"],
    ["🧁", "A bakery kitchen", "fod"],
    ["🌴", "A jungle trip", "adv"],
    ["🏥", "A hospital, to see how doctors work", "hlp"] ] },
  { q: "What would you like to make?", a: [
    ["📱", "An app or a robot", "tec"],
    ["🌳", "A treehouse", "bld"],
    ["🎥", "A movie with your friends", "mda"],
    ["📖", "A storybook", "wrd"] ] },
  { q: "Which would you rather do?", a: [
    ["🏎️", "Drive or fix a race car", "mec"],
    ["🎤", "Sing on a stage", "prf"],
    ["🧑‍🏫", "Teach a friend something new", "tea"],
    ["🌻", "Plant a garden", "nat"] ] },
  { q: "Who would you most like to be?", a: [
    ["💖", "The kind one who helps everyone", "car"],
    ["🚒", "The one who rescues people in danger", "saf"],
    ["🧑‍⚖️", "The leader who makes the rules fair", "lea"],
    ["🏪", "The owner of a shop", "biz"] ] },
];

// Follow-up questions. After the openers, the survey keeps picking follow-ups
// for your strongest topics, so every kid gets a different set of questions.
// Answers can point to nearby topics, so the path can change as you go.
const FOLLOWUPS = [
  { for: "sci", q: "Which science would you most like to try?", a: [
    ["🧪", "Mixing chemicals to make new stuff", "sci"], ["🦠", "Studying germs to stop sickness", "hlp"],
    ["🌋", "Studying volcanoes and rocks", "nat"], ["🔭", "Looking at stars through a telescope", "spc"] ] },
  { for: "sci", q: "In a science lab, you'd rather…", a: [
    ["📊", "Measure everything and write down results", "sci"], ["🛠️", "Build the machine for the experiment", "bld"],
    ["💻", "Use a computer to study the data", "tec"], ["🗣️", "Explain what you found to everyone", "tea"] ] },
  { for: "tec", q: "What would you build with a computer?", a: [
    ["📱", "An app people use every day", "tec"], ["🎮", "A video game", "mda"],
    ["🤖", "A robot that helps at home", "bld"], ["💸", "An online shop", "biz"] ] },
  { for: "tec", q: "Which computer job sounds coolest?", a: [
    ["🛡️", "Stopping hackers", "saf"], ["🧠", "Teaching an AI to be smart", "tec"],
    ["🎨", "Making websites look beautiful", "art"], ["🔢", "Solving puzzles with data", "sci"] ] },
  { for: "bld", q: "What would you most like to build?", a: [
    ["🌉", "A giant bridge", "bld"], ["🏠", "A beautiful house", "art"],
    ["🚀", "A rocket", "spc"], ["🏎️", "A super fast car", "mec"] ] },
  { for: "bld", q: "On a building site, you would…", a: [
    ["📐", "Draw the plans", "bld"], ["🔨", "Use the big machines and tools", "mec"],
    ["📋", "Be the boss who keeps it on time", "lea"], ["🦺", "Check that everyone is safe", "saf"] ] },
  { for: "mec", q: "Which would you like to drive or fly?", a: [
    ["✈️", "A plane", "spc"], ["🚒", "A fire truck", "saf"],
    ["🏎️", "A race car", "spo"], ["🚜", "A tractor on a farm", "nat"] ] },
  { for: "mec", q: "Your bike is broken. You…", a: [
    ["🔧", "Fix it yourself", "mec"], ["🔍", "Figure out exactly why it broke", "sci"],
    ["🛠️", "Build a better bike", "bld"], ["🤝", "Help your friend fix theirs too", "car"] ] },
  { for: "spc", q: "In space, you would…", a: [
    ["👩‍🚀", "Float around and do experiments", "sci"], ["🛰️", "Control the rocket from mission control", "tec"],
    ["🔩", "Fix the space station", "bld"], ["🪐", "Explore a new planet", "adv"] ] },
  { for: "spc", q: "Which is the coolest?", a: [
    ["🌌", "Discovering a new galaxy", "spc"], ["✈️", "Flying a jet", "mec"],
    ["🌱", "Growing food on Mars", "nat"], ["📸", "Filming space for a movie", "mda"] ] },
  { for: "art", q: "What would you most like to design?", a: [
    ["👗", "Clothes", "art"], ["🏡", "Rooms and houses", "bld"],
    ["👾", "Video game characters", "mda"], ["🎂", "Fancy cakes", "fod"] ] },
  { for: "art", q: "What kind of art do you love?", a: [
    ["🖌️", "Painting and drawing", "art"], ["📷", "Taking photos", "mda"],
    ["🎭", "Costumes for a show", "prf"], ["📚", "Pictures for books", "wrd"] ] },
  { for: "prf", q: "On stage, you'd rather…", a: [
    ["🎤", "Sing", "prf"], ["💃", "Dance", "spo"],
    ["😂", "Tell funny stories", "wrd"], ["🎬", "Direct the whole show", "lea"] ] },
  { for: "prf", q: "Pick your music job.", a: [
    ["🎸", "Play in a band", "prf"], ["🎧", "Record and mix songs", "tec"],
    ["🎼", "Write songs", "wrd"], ["🎹", "Teach music to kids", "tea"] ] },
  { for: "mda", q: "Making a video, you'd be…", a: [
    ["🎥", "Behind the camera", "mda"], ["🌟", "In front of the camera", "prf"],
    ["✂️", "Editing it on the computer", "tec"], ["📝", "Writing the story", "wrd"] ] },
  { for: "mda", q: "Which would you rather make?", a: [
    ["📺", "A video channel", "mda"], ["🕹️", "A video game", "tec"],
    ["📰", "A news report", "wrd"], ["🎞️", "A cartoon", "art"] ] },
  { for: "wrd", q: "What would you like to write?", a: [
    ["📖", "An adventure book", "wrd"], ["📰", "News about what's happening", "mda"],
    ["🎬", "A play or movie script", "prf"], ["📜", "Rules that make things fair", "lea"] ] },
  { for: "wrd", q: "Which do you love most?", a: [
    ["📚", "Reading for hours", "wrd"], ["🌍", "Learning new languages", "adv"],
    ["🗣️", "Debating and convincing people", "lea"], ["👶", "Reading to little kids", "tea"] ] },
  { for: "tea", q: "Who would you like to teach?", a: [
    ["🧒", "Little kids", "tea"], ["🏃", "A sports team", "spo"],
    ["🎹", "Music students", "prf"], ["🐕", "Dogs learning tricks", "ani"] ] },
  { for: "tea", q: "Your friend doesn't understand their homework. You…", a: [
    ["✏️", "Explain it step by step", "tea"], ["💖", "Make sure they don't feel bad", "car"],
    ["🧩", "Turn it into a game", "mda"], ["🔎", "Look it up together", "sci"] ] },
  { for: "hlp", q: "Which health job sounds best?", a: [
    ["🩺", "A doctor finding out what's wrong", "hlp"], ["🚑", "A paramedic rushing to help", "saf"],
    ["🧠", "Helping people with their worries", "car"], ["🐶", "A vet for animals", "ani"] ] },
  { for: "hlp", q: "In a hospital, you'd like to…", a: [
    ["💉", "Take care of patients", "hlp"], ["🔬", "Test samples in the lab", "sci"],
    ["🏋️", "Help people walk again after injuries", "spo"], ["🍎", "Plan healthy meals", "fod"] ] },
  { for: "car", q: "How would you help your community?", a: [
    ["👵", "Visit older people", "car"], ["🏫", "Tutor younger kids", "tea"],
    ["🌳", "Clean up the park", "nat"], ["🥫", "Run a food drive", "biz"] ] },
  { for: "car", q: "A new kid is alone at lunch. You…", a: [
    ["👋", "Invite them to sit with you", "car"], ["🎲", "Start a game everyone can play", "spo"],
    ["📣", "Ask the school to start a buddy club", "lea"], ["😄", "Make them laugh", "prf"] ] },
  { for: "saf", q: "Which rescue job would you pick?", a: [
    ["🚒", "Firefighter", "saf"], ["🏊", "Lifeguard", "spo"],
    ["🚁", "Rescue helicopter pilot", "mec"], ["🏔️", "Mountain rescuer", "adv"] ] },
  { for: "saf", q: "In an emergency, you'd be the one who…", a: [
    ["🆘", "Stays calm and takes charge", "lea"], ["🩹", "Does first aid", "hlp"],
    ["🫂", "Comforts people who are scared", "car"], ["🦺", "Gets everyone out safely", "saf"] ] },
  { for: "lea", q: "If you ran your school, you'd…", a: [
    ["📜", "Make fairer rules", "lea"], ["💰", "Plan how to spend the money", "biz"],
    ["📣", "Give big speeches", "prf"], ["🤝", "Make sure everyone is heard", "car"] ] },
  { for: "lea", q: "Which leader would you be?", a: [
    ["⚖️", "A judge deciding what's fair", "lea"], ["🏢", "The boss of a big company", "biz"],
    ["🌍", "An ambassador to other countries", "adv"], ["🧑‍✈️", "Captain of a sports team", "spo"] ] },
  { for: "biz", q: "What business would you start?", a: [
    ["🍋", "A snack stand", "fod"], ["🛍️", "A clothing shop", "art"],
    ["📱", "An app company", "tec"], ["🐾", "A pet-sitting service", "ani"] ] },
  { for: "biz", q: "With money, you'd most like to…", a: [
    ["📈", "Invest it and watch it grow", "biz"], ["🔢", "Keep track of every cent", "sci"],
    ["🤝", "Help families plan their money", "car"], ["🏪", "Sell things to customers", "biz"] ] },
  { for: "nat", q: "Which nature job sounds best?", a: [
    ["🌲", "Protecting a forest", "nat"], ["🐋", "Studying whales in the ocean", "ani"],
    ["🌦️", "Predicting the weather", "sci"], ["☀️", "Building solar and wind power", "bld"] ] },
  { for: "nat", q: "Outside, you'd rather…", a: [
    ["🥕", "Grow plants and vegetables", "nat"], ["🥾", "Go on a long hike", "adv"],
    ["🐞", "Look for bugs and animals", "ani"], ["🍓", "Pick fruit to cook with", "fod"] ] },
  { for: "ani", q: "Which animal job would you pick?", a: [
    ["🐕", "Vet for sick pets", "hlp"], ["🦁", "Zookeeper", "ani"],
    ["🐎", "Horse trainer", "spo"], ["🐠", "Ocean animal scientist", "sci"] ] },
  { for: "ani", q: "With animals, you'd most like to…", a: [
    ["🥰", "Feed and care for them", "ani"], ["🦮", "Train them", "tea"],
    ["📸", "Photograph them in the wild", "mda"], ["🏡", "Rescue them and find them homes", "car"] ] },
  { for: "spo", q: "Which sports job would you pick?", a: [
    ["🏆", "Pro athlete", "spo"], ["📋", "Coach", "tea"],
    ["🎙️", "Sports commentator", "mda"], ["🏋️", "Fitness trainer", "hlp"] ] },
  { for: "spo", q: "What do you like best about sports?", a: [
    ["🥇", "Winning", "spo"], ["👥", "Being part of a team", "car"],
    ["🏔️", "Going to wild places", "adv"], ["📊", "The stats and scores", "sci"] ] },
  { for: "adv", q: "Pick your dream trip.", a: [
    ["🗺️", "Visit 50 countries", "adv"], ["🤿", "Dive at a coral reef", "ani"],
    ["🦖", "Dig for fossils in a desert", "sci"], ["🛳️", "Captain a ship", "mec"] ] },
  { for: "adv", q: "On a trip, you would…", a: [
    ["🧭", "Lead the group", "lea"], ["🍜", "Try every local food", "fod"],
    ["🗣️", "Learn the language", "wrd"], ["📷", "Film everything", "mda"] ] },
  { for: "fod", q: "In the kitchen, you'd…", a: [
    ["🧁", "Bake cakes", "fod"], ["🍕", "Run the whole restaurant", "biz"],
    ["🥗", "Make healthy meals", "hlp"], ["🧪", "Invent brand-new flavors", "sci"] ] },
  { for: "fod", q: "Which food job would you pick?", a: [
    ["👨‍🍳", "Chef", "fod"], ["🌾", "Farmer growing the food", "nat"],
    ["📺", "Cooking show host", "prf"], ["🍫", "Making food look amazing", "art"] ] },
];

const TOTAL_QUESTIONS = 20;

// Every job: [name, what they do, topics with importance, years of training after 18, outlook]
// Topic importance: 3 = comes first, 2 = important, 1 = helps too.
// Outlook: g = growing, s = steady, c = changing (robots/AI will change it), f = future job.
const JOBS = [
  // Science
  ["Astronaut", "Travels to space to run experiments and fix spacecraft", "spc3 sci2 spo1", 8, "g"],
  ["Chemist", "Mixes substances to invent new materials and medicines", "sci3 hlp1", 4, "s"],
  ["Physicist", "Studies how energy, light and motion work", "sci3 tec1 spc1", 8, "s"],
  ["Astronomer", "Studies stars, planets and galaxies with telescopes", "spc3 sci3 tec1", 9, "s"],
  ["Biologist", "Studies living things, from tiny cells to whole animals", "sci3 ani2 nat1", 4, "s"],
  ["Marine Biologist", "Studies ocean animals and plants", "ani3 sci2 adv1", 4, "s"],
  ["Geologist", "Studies rocks, volcanoes and earthquakes", "sci3 nat2 adv1", 4, "s"],
  ["Meteorologist", "Predicts the weather and studies storms", "sci3 nat2 mda1", 4, "s"],
  ["Lab Technician", "Runs tests on samples in a science lab", "sci3 hlp1", 2, "c"],
  ["Archaeologist", "Digs up clues about how people lived long ago", "sci3 adv2 wrd1", 6, "s"],
  ["Paleontologist", "Finds and studies dinosaur fossils", "sci3 adv2 ani1", 8, "s"],
  ["Forensic Scientist", "Uses science to solve crimes", "sci3 saf2 lea1", 4, "s"],
  ["Pharmacist", "Prepares medicines and explains how to take them", "hlp3 sci2 biz1", 6, "s"],
  ["Research Scientist", "Runs experiments to discover new things", "sci3 wrd1 tec1", 9, "g"],
  ["Climate Scientist", "Studies how Earth's climate is changing", "nat3 sci3 tec1", 6, "g"],
  ["Mathematician", "Solves hard number puzzles that help science and tech", "sci3 tec2 tea1", 6, "g"],
  ["Statistician", "Finds patterns in numbers and data", "sci3 tec2 biz1", 4, "g"],
  ["Botanist", "Studies plants and how they grow", "nat3 sci3", 4, "s"],
  ["Oceanographer", "Explores the ocean, its currents and its floor", "sci3 adv2 nat2", 6, "s"],
  ["Food Scientist", "Makes food safer, tastier and healthier", "fod3 sci3 hlp1", 4, "s"],
  ["Inventor", "Dreams up new gadgets and figures out how to make them", "bld3 sci2 biz1", 0, "g"],

  // Technology
  ["Software Developer", "Writes the code that runs apps and websites", "tec3 sci1 bld1", 4, "g"],
  ["Video Game Developer", "Creates video games people love to play", "tec3 mda3 art1", 4, "g"],
  ["UX / App Designer", "Designs apps so they are easy and fun to use", "art3 tec2 car1", 4, "g"],
  ["Data Scientist", "Uses computers to find answers hidden in huge amounts of data", "tec3 sci2 biz1", 4, "g"],
  ["AI Engineer", "Builds smart computer programs that can learn", "tec3 sci2 bld1", 6, "g"],
  ["Cybersecurity Expert", "Protects computers and people from hackers", "tec3 saf2 sci1", 4, "g"],
  ["Robotics Engineer", "Designs and builds robots", "bld3 tec3 mec2", 4, "g"],
  ["Web Designer", "Designs and builds websites", "tec3 art2 biz1", 2, "c"],
  ["IT Support Technician", "Fixes computers and helps people with tech problems", "tec3 car1 mec1", 2, "s"],
  ["Network Engineer", "Keeps the internet and computer networks running", "tec3 bld1", 4, "s"],
  ["Drone Pilot", "Flies drones to film, map and deliver things", "mec3 tec2 mda1", 1, "g"],
  ["Computer Hardware Engineer", "Designs computer chips and devices", "tec3 bld2 sci1", 4, "s"],
  ["Game Tester", "Plays games early to find bugs", "mda3 tec2", 0, "c"],
  ["Social Media Manager", "Runs social media accounts for companies", "mda3 biz2 wrd1", 4, "g"],
  ["Cloud Engineer", "Runs the giant computers that store everyone's apps and photos", "tec3 bld1 biz1", 4, "g"],

  // Building & machines
  ["Architect", "Designs houses, schools and skyscrapers", "bld3 art2 sci1", 6, "s"],
  ["Civil Engineer", "Plans bridges, roads and tunnels", "bld3 sci2 saf1", 4, "s"],
  ["Mechanical Engineer", "Designs machines, engines and gadgets", "mec3 bld3 sci1", 4, "s"],
  ["Aerospace Engineer", "Designs airplanes and rockets", "spc3 bld3 sci2", 4, "g"],
  ["Electrical Engineer", "Designs circuits and power systems", "bld3 tec2 sci1", 4, "g"],
  ["Carpenter", "Builds things out of wood, from shelves to houses", "bld3 art1", 3, "s"],
  ["Electrician", "Installs and fixes wiring and lights", "bld3 mec2 saf1", 4, "g"],
  ["Plumber", "Fixes pipes, sinks and water heaters", "bld3 mec2 car1", 4, "s"],
  ["Car Mechanic", "Fixes cars and keeps them running safely", "mec3 bld1", 2, "c"],
  ["Electric Vehicle Technician", "Repairs electric cars and charging stations", "mec3 tec2 nat1", 2, "g"],
  ["Welder", "Joins metal together with super-hot flames", "bld3 mec2", 2, "s"],
  ["Construction Worker", "Builds houses, roads and buildings", "bld3 mec2 spo1", 0, "s"],
  ["Construction Manager", "Leads the team building a big project", "bld3 lea2 biz1", 4, "g"],
  ["Crane Operator", "Lifts huge loads high above building sites", "mec3 bld2 saf1", 1, "s"],
  ["Bricklayer / Stonemason", "Builds walls and buildings from brick and stone", "bld3 art1", 2, "s"],
  ["Solar Panel Installer", "Puts solar panels on roofs to make clean energy", "bld3 nat2", 1, "g"],
  ["Wind Turbine Technician", "Climbs and repairs giant wind turbines", "mec3 nat2 adv1", 2, "g"],
  ["Aircraft Mechanic", "Inspects and repairs airplanes", "mec3 spc2", 2, "s"],
  ["Interior Designer", "Makes rooms look great and work well", "art3 bld2 biz1", 4, "s"],
  ["Landscape Architect", "Designs parks, gardens and playgrounds", "nat3 art2 bld2", 4, "s"],
  ["Locksmith", "Opens, fixes and installs locks", "mec3 saf1", 1, "s"],
  ["Shipbuilder", "Builds and repairs boats and ships", "bld3 mec2 adv1", 3, "s"],
  ["Ship Captain", "Steers big ships across the oceans", "mec3 adv3 lea2", 4, "s"],
  ["Train Driver", "Drives trains safely on time", "mec3 saf1", 1, "c"],
  ["Truck Driver", "Drives trucks to deliver goods across the country", "mec3 adv1", 0, "c"],
  ["Pilot", "Flies airplanes full of passengers or cargo", "spc3 mec3 adv1", 3, "s"],
  ["Air Traffic Controller", "Guides planes safely in the sky and on the runway", "spc3 saf2 tec1", 3, "s"],

  // Art & design
  ["Artist / Painter", "Creates paintings and artwork", "art3 biz1", 0, "s"],
  ["Illustrator", "Draws pictures for books, games and ads", "art3 wrd1", 4, "c"],
  ["Graphic Designer", "Designs logos, posters and packages", "art3 tec1 biz1", 4, "c"],
  ["Animator", "Brings cartoons and movie characters to life", "art3 mda3 tec1", 4, "g"],
  ["Fashion Designer", "Designs clothes, shoes and accessories", "art3 biz2", 4, "s"],
  ["Photographer", "Takes photos for magazines, weddings and events", "art3 mda2", 2, "s"],
  ["Sculptor", "Makes art from clay, stone and metal", "art3 bld2", 0, "s"],
  ["Tattoo Artist", "Draws permanent art on skin", "art3 biz1", 1, "s"],
  ["Jewelry Maker", "Designs and makes rings, necklaces and bracelets", "art3 bld1 biz1", 1, "s"],
  ["Cartoonist / Comic Artist", "Draws comics and funny cartoons", "art3 wrd2 mda1", 0, "s"],
  ["Florist", "Arranges flowers into beautiful bouquets", "art3 nat2 biz1", 0, "s"],
  ["Hairstylist", "Cuts, colors and styles hair", "art3 car1 biz1", 1, "s"],
  ["Makeup Artist", "Does makeup for movies, shows and events", "art3 mda2", 1, "s"],
  ["Toy Designer", "Invents and designs new toys", "art3 bld2 biz1", 4, "s"],
  ["Car Designer", "Designs how new cars look", "art3 mec2 bld1", 4, "s"],
  ["Museum Curator", "Chooses and cares for museum collections", "art3 wrd2 tea1", 6, "s"],
  ["Video Editor", "Cuts and puts together videos and movies", "mda3 tec2 art1", 2, "g"],
  ["Theater Set Designer", "Builds the scenery for plays and shows", "art3 bld2 prf1", 4, "s"],
  ["Potter", "Shapes clay into bowls, mugs and vases", "art3 biz1", 0, "s"],

  // Food
  ["Chef", "Cooks delicious meals in a restaurant kitchen", "fod3 art1 lea1", 2, "s"],
  ["Baker / Pastry Chef", "Bakes bread, cakes and desserts", "fod3 art2", 2, "s"],
  ["Restaurant Owner", "Runs a restaurant, from menu to money", "fod3 biz3 lea1", 0, "s"],
  ["Food Truck Owner", "Cooks and sells food from a truck", "fod3 biz2 adv1", 0, "g"],
  ["Food Critic", "Tries restaurants and writes reviews", "fod3 wrd2 mda1", 0, "s"],
  ["Cooking Show Host", "Cooks on TV or online and teaches recipes", "fod3 mda2 prf1", 0, "s"],
  ["Chocolatier", "Makes fancy chocolates and sweets", "fod3 art2 biz1", 1, "s"],

  // Performing & media
  ["Actor", "Plays characters in movies, TV and theater", "prf3 mda2", 0, "s"],
  ["Singer", "Sings songs on stage and in recordings", "prf3", 0, "s"],
  ["Musician", "Plays instruments in bands and orchestras", "prf3 art1", 0, "s"],
  ["Music Teacher", "Teaches kids to sing and play instruments", "prf3 tea3", 4, "s"],
  ["Dancer", "Performs dances on stage and in videos", "prf3 spo2", 0, "s"],
  ["Film Director", "Leads the team that makes a movie", "mda3 lea2 prf1", 4, "s"],
  ["Content Creator / YouTuber", "Makes videos and posts for people online", "mda3 prf2 biz1", 0, "g"],
  ["TV Presenter / News Anchor", "Hosts shows and reads the news on TV", "mda3 prf2 wrd1", 4, "s"],
  ["Podcaster / Radio Host", "Talks, interviews people and plays music for listeners", "mda3 wrd2", 0, "g"],
  ["Comedian", "Makes people laugh with jokes and stories", "prf3 wrd2", 0, "s"],
  ["Magician", "Amazes audiences with magic tricks", "prf3 art1", 0, "s"],
  ["Circus Performer", "Does acrobatics, juggling and tricks", "prf3 spo2 adv1", 0, "s"],
  ["Music Producer", "Records and mixes songs in a studio", "prf3 tec2 mda1", 2, "g"],
  ["Sound Engineer", "Controls the sound at concerts and in studios", "tec3 prf2 mda1", 2, "s"],
  ["Composer", "Writes music for movies, games and orchestras", "prf3 art2 mda1", 4, "s"],
  ["DJ", "Mixes music for parties and radio", "prf3 tec1 mda1", 0, "s"],
  ["Voice Actor", "Gives voices to cartoon and game characters", "prf3 mda2", 0, "c"],
  ["Esports Player", "Plays video games in tournaments", "mda3 spo2 tec1", 0, "g"],
  ["Stunt Performer", "Does dangerous action scenes in movies", "spo3 mda2 adv1", 0, "s"],
  ["Camera Operator", "Films movies, TV shows and sports", "mda3 tec1 art1", 2, "s"],
  ["Journalist", "Finds out what is happening and reports the news", "wrd3 mda2 lea1", 4, "c"],
  ["Documentary Filmmaker", "Makes true-story films about the real world", "mda3 adv2 wrd1", 2, "s"],

  // Health
  ["Doctor", "Finds out why people are sick and helps them get better", "hlp3 sci2 car1", 8, "g"],
  ["Children's Doctor (Pediatrician)", "Takes care of babies and kids", "hlp3 car2 sci1", 11, "g"],
  ["Surgeon", "Does operations to fix people's bodies", "hlp3 sci2", 11, "g"],
  ["Nurse", "Cares for patients in hospitals and clinics", "hlp3 car2 sci1", 4, "g"],
  ["Dentist", "Keeps teeth healthy and fixes cavities", "hlp3 sci1", 8, "s"],
  ["Paramedic", "Rushes to emergencies in an ambulance", "saf3 hlp3", 2, "g"],
  ["Psychologist", "Helps people understand their thoughts and feelings", "car3 hlp2 sci1", 8, "g"],
  ["Physical Therapist", "Helps people move again after injuries", "hlp3 spo2", 7, "g"],
  ["Speech Therapist", "Helps people learn to talk and communicate", "hlp3 tea2 wrd1", 6, "g"],
  ["Optometrist", "Checks eyes and gives people glasses", "hlp3 sci2", 8, "s"],
  ["Midwife", "Helps mothers when babies are born", "hlp3 car2", 4, "s"],
  ["Dietitian", "Helps people eat healthy food", "hlp3 fod2 sci1", 4, "g"],
  ["Sports Medicine Doctor", "Treats athletes' injuries", "hlp3 spo2 sci1", 11, "g"],

  // Caring & community
  ["Caregiver", "Looks after older people or people with disabilities", "car3 hlp1", 0, "g"],
  ["Social Worker", "Helps families get what they need to be safe and healthy", "car3 lea1", 4, "g"],
  ["School Counselor", "Helps students with problems and plans for the future", "car3 tea2", 6, "g"],
  ["Youth Worker", "Runs clubs and activities for kids and teens", "car3 tea2 spo1", 2, "s"],
  ["Charity Organizer", "Raises money and runs projects to help people", "car3 biz2 lea1", 4, "s"],
  ["Sign Language Interpreter", "Translates between spoken and sign language", "wrd3 car2", 4, "s"],
  ["Flight Attendant", "Keeps passengers safe and comfortable on planes", "adv3 car2 saf1", 0, "s"],
  ["Hotel Manager", "Runs a hotel and makes guests happy", "biz3 car2 adv1", 4, "s"],

  // Safety & rescue
  ["Firefighter", "Puts out fires and rescues people", "saf3 spo2", 1, "s"],
  ["Police Officer", "Keeps communities safe and helps people in trouble", "saf3 lea2 car1", 1, "s"],
  ["Detective", "Solves mysteries and crimes", "saf3 sci1 lea1", 3, "s"],
  ["Lifeguard", "Watches swimmers and saves people in the water", "saf3 spo2", 0, "s"],
  ["Soldier", "Protects the country and helps in disasters", "saf3 spo2 adv1", 0, "s"],
  ["Coast Guard Rescuer", "Saves people at sea from boats and helicopters", "saf3 adv2 mec1", 1, "s"],
  ["Search and Rescue Pilot", "Flies helicopters to find lost and hurt people", "saf3 mec2 spc1", 3, "s"],
  ["Emergency Dispatcher", "Answers emergency calls and sends help", "saf3 car2", 0, "s"],
  ["Safety Inspector", "Checks buildings and factories to keep people safe", "saf3 bld2", 4, "s"],

  // Leading & law
  ["Lawyer", "Helps people understand the law and speaks for them in court", "lea3 wrd2", 7, "c"],
  ["Judge", "Listens to both sides in court and makes fair decisions", "lea3 wrd1", 10, "s"],
  ["Politician / Mayor", "Leads a town or country and makes laws", "lea3 car2 prf1", 4, "s"],
  ["Diplomat", "Represents their country and helps nations get along", "lea3 adv2 wrd1", 6, "s"],
  ["Company CEO", "Leads a whole company and makes the big decisions", "lea3 biz3", 10, "s"],
  ["School Principal", "Leads a whole school", "lea3 tea2 car1", 8, "s"],
  ["Human Resources Manager", "Hires people and helps workers be happy", "lea3 car2 biz1", 4, "s"],
  ["Project Manager", "Keeps big projects on track and on time", "lea3 biz2", 4, "g"],

  // Business & money
  ["Entrepreneur", "Starts and runs a new business", "biz3 lea2 tec1", 0, "g"],
  ["Accountant", "Keeps track of money for people and companies", "biz3 sci1", 4, "c"],
  ["Banker", "Helps people save, borrow and look after money", "biz3", 4, "c"],
  ["Financial Advisor", "Helps families plan how to use their money", "biz3 car2", 4, "s"],
  ["Marketing Manager", "Gets people excited about new products", "biz3 mda2 art1", 4, "s"],
  ["Salesperson", "Helps customers find and buy what they need", "biz3 car1", 0, "c"],
  ["Real Estate Agent", "Helps people buy and sell houses", "biz3 bld1", 1, "s"],
  ["Store Manager", "Runs a shop and leads the team", "biz3 lea2", 0, "s"],
  ["Economist", "Studies how money moves around the world", "biz3 sci2", 6, "s"],
  ["Stock Trader", "Buys and sells shares of companies", "biz3 tec1 sci1", 4, "c"],
  ["Event Planner", "Plans weddings, parties and festivals", "biz3 art1 lea1", 2, "s"],
  ["Product Manager", "Decides what a new app or product should do", "biz3 tec2 lea1", 4, "g"],
  ["Logistics Manager", "Figures out how to get things shipped around the world", "biz3 adv1 mec1", 4, "g"],

  // Words & teaching
  ["Teacher", "Helps kids learn new things every day", "tea3 car2", 4, "s"],
  ["Kindergarten Teacher", "Teaches young kids to read, count and play together", "tea3 car2 art1", 4, "s"],
  ["Science Teacher", "Teaches experiments and how the world works", "tea3 sci2", 4, "s"],
  ["Professor", "Teaches at a university and does research", "tea3 sci2 wrd1", 9, "s"],
  ["Tutor", "Helps students one-on-one with schoolwork", "tea3 car1", 0, "g"],
  ["Language Teacher", "Teaches people to speak new languages", "tea3 wrd2 adv1", 4, "s"],
  ["Author", "Writes books and stories", "wrd3 art1", 0, "c"],
  ["Children's Book Author", "Writes and sometimes draws books for kids", "wrd3 art2", 0, "s"],
  ["Librarian", "Helps people find books and information", "wrd3 tea2", 6, "c"],
  ["Translator", "Changes words from one language to another", "wrd3 adv2", 4, "c"],
  ["Editor", "Checks and improves writing before it is published", "wrd3 mda1", 4, "c"],
  ["Screenwriter", "Writes the scripts for movies and TV shows", "wrd3 mda2 prf1", 0, "s"],
  ["Poet / Songwriter", "Writes poems and song lyrics", "wrd3 prf2", 0, "s"],
  ["Historian", "Studies and writes about the past", "wrd3 sci1 tea1", 8, "s"],
  ["Copywriter", "Writes the words for ads and websites", "wrd3 biz2", 4, "c"],

  // Nature & animals
  ["Veterinarian", "Takes care of sick and hurt animals", "ani3 hlp3 sci1", 8, "g"],
  ["Vet Nurse", "Helps the vet care for animals", "ani3 hlp2", 2, "g"],
  ["Zookeeper", "Feeds and cares for zoo animals", "ani3 car1", 2, "s"],
  ["Farmer", "Grows food and raises animals", "nat3 ani2 fod1", 0, "c"],
  ["Park Ranger", "Protects national parks and teaches visitors", "nat3 adv2 tea1", 4, "s"],
  ["Wildlife Photographer", "Photographs wild animals in nature", "ani3 mda2 adv2", 0, "s"],
  ["Gardener / Landscaper", "Plants and cares for gardens and lawns", "nat3 art1", 0, "s"],
  ["Environmental Scientist", "Finds ways to protect air, water and land", "nat3 sci2", 4, "g"],
  ["Dog Trainer", "Teaches dogs to behave and do tricks", "ani3 tea2", 0, "s"],
  ["Animal Rescuer", "Saves and rehomes animals in trouble", "ani3 car2 saf1", 0, "s"],
  ["Horse Riding Instructor", "Teaches people to ride and care for horses", "ani3 spo2 tea1", 1, "s"],
  ["Fisher", "Catches fish to sell for food", "nat3 adv1 fod1", 0, "c"],
  ["Beekeeper", "Takes care of bees and collects honey", "ani3 nat2 fod1", 0, "s"],
  ["Forester", "Looks after forests and plants new trees", "nat3 adv1", 4, "s"],
  ["Pet Groomer", "Washes, brushes and trims pets", "ani3 art1", 1, "s"],
  ["Storm Chaser", "Follows tornadoes and big storms to study them", "nat3 adv3 sci2", 4, "s"],
  ["Wildlife Biologist", "Tracks and protects wild animals", "ani3 sci2 nat2", 6, "g"],

  // Sports & adventure
  ["Professional Athlete", "Plays a sport as a job and competes to win", "spo3", 0, "s"],
  ["Coach", "Trains a team and helps players improve", "spo3 tea2 lea1", 2, "s"],
  ["Personal Trainer", "Helps people get fit and strong", "spo3 hlp2 biz1", 1, "g"],
  ["Sports Referee", "Makes sure games are played fairly", "spo3 lea2", 1, "s"],
  ["PE Teacher", "Teaches kids sports and fitness at school", "spo3 tea2", 4, "s"],
  ["Mountain Guide", "Leads climbers and hikers safely up mountains", "adv3 spo2 saf1", 2, "s"],
  ["Scuba Diving Instructor", "Teaches people to dive underwater", "adv3 spo2 ani1", 1, "s"],
  ["Ski Instructor", "Teaches people to ski and snowboard", "spo3 tea1 adv1", 1, "s"],
  ["Sports Commentator", "Describes the action during games on TV and radio", "spo3 mda2", 2, "s"],
  ["Race Car Driver", "Drives super-fast cars in races", "spo3 mec3", 0, "s"],
  ["Martial Arts Instructor", "Teaches karate, judo or taekwondo", "spo3 tea2", 1, "s"],
  ["Yoga Instructor", "Teaches yoga to help people relax and stay healthy", "spo3 hlp2", 1, "g"],
  ["Sports Scientist", "Uses science to help athletes perform better", "spo3 sci2 hlp1", 4, "g"],
  ["Tour Guide", "Shows visitors around cities and places", "adv3 tea1 wrd1", 0, "s"],
  ["Travel Writer", "Visits places around the world and writes about them", "adv3 wrd2 mda1", 0, "s"],
  ["Explorer / Expedition Leader", "Leads trips to wild, faraway places", "adv3 lea2 sci1", 2, "s"],

  // Future jobs (may be much bigger by the time you grow up)
  ["AI Trainer", "Teaches AI systems to be helpful, safe and correct", "tec3 wrd2 tea1", 2, "f"],
  ["Space Tourism Guide", "Takes travelers on trips to space", "spc3 adv3 car1", 4, "f"],
  ["Climate Engineer", "Builds machines that clean the air and cool the planet", "nat3 bld3 sci1", 4, "f"],
  ["Drone Traffic Controller", "Keeps thousands of delivery drones from crashing", "tec3 spc1 saf1", 2, "f"],
  ["Virtual World Designer", "Designs 3D worlds people explore in VR", "mda3 art2 tec2", 4, "f"],
  ["Robot Repair Technician", "Fixes robots in homes, farms and factories", "mec3 tec2", 2, "f"],
  ["Mars Habitat Builder", "Builds homes for people living on Mars", "spc3 bld3", 6, "f"],
  ["Gene Therapist", "Fixes diseases by repairing DNA", "hlp3 sci3", 9, "f"],
  ["Ocean Cleanup Specialist", "Runs machines that pull plastic out of the ocean", "nat3 mec1 adv1", 2, "f"],
  ["Digital Privacy Advisor", "Helps people keep their data safe online", "tec3 saf2 car1", 4, "f"],
  ["Virtual Event Host", "Runs concerts and events inside virtual worlds", "mda3 prf2 biz1", 0, "f"],
  ["Health Data Coach", "Uses smartwatch data to help people stay healthy", "hlp3 tec2 spo1", 4, "f"],
  ["Smart City Planner", "Designs cities with self-driving cars and clean energy", "bld3 tec2 lea1", 6, "f"],
  ["Space Farmer", "Grows food on space stations and other planets", "spc3 nat3 fod1", 4, "f"],
  ["Human-Robot Team Manager", "Leads teams where people and robots work together", "lea3 tec2", 4, "f"],
  ["3D Food Printing Chef", "Designs meals made with food printers", "fod3 tec2 art1", 2, "f"],
  ["Lab-Grown Meat Scientist", "Grows meat from cells so no animals are harmed", "fod3 sci3 ani1", 4, "f"],
  ["Self-Driving Car Engineer", "Teaches cars to drive themselves safely", "mec3 tec3 saf1", 4, "f"],
];
