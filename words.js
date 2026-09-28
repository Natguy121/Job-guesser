// Future Map — the clue words the game looks for in kids' answers.
//
// Each topic has a list of clue words. Entries of 5+ letters also match longer
// words that start with them ("anima" matches "animal" and "animals").
// Shorter entries match exactly, or with an "s"/"es" on the end ("dog", "dogs").
const TOPIC_WORDS = {
  sci: "science scien scientist experiment lab labs chemi physic biolog microscope discover research fossil dinosaur dino volcano atom molecul germ bacteria dna gene cell magnet slime crystal math equation formula element hypothes measure earthquake mineral evolution energy telescope invent invention inventor study studying curious brain puzzle",
  tec: "computer coding code coder program programming app apps website web internet tech technolog robot robotic ai gadget tablet ipad laptop phone software hack hacker cyber electronic keyboard digital online virtual vr algorithm server scratch python javascript minecraft roblox",
  bld: "build builder building construct construction engineer bridge tower skyscraper architect lego block blocks brick wood wooden hammer nail tool tools drill blueprint fort treehouse machine invent crane concrete wall roof electric electricity wire plumb weld cardboard design structure welding",
  mec: "car cars truck trucks engine motor mechanic vehicle drive driver driving train trains tractor bike bicycle motorbike motorcycle wheel tire tyre fix fixing repair repairing wrench garage bus boat ship gear machine machines digger bulldozer kart go-kart fixed fixes",
  spc: "space rocket astronaut planet planets star stars galaxy moon mars sun universe orbit satellite nasa alien aliens telescope fly flying flight plane planes airplane aeroplane jet pilot sky cockpit helicopter astronomy",
  art: "art arts artist draw drawing drew paint painting painter sketch color colour colors design designer designing craft crafts crafty sculpt clay pottery fashion clothes dress dresses outfit style decorate decorating beautiful pretty creative crayon marker comic comics cartoon jewelry jewellery makeup hair nails sew sewing knit origami picture pictures knitting",
  prf: "sing singing singer song songs music musician musical band guitar piano drum drums violin instrument concert dance dancer dancing ballet act actor actress acting theater theatre stage perform performer performing rap rapper choir karaoke comedy comedian funny joke jokes laugh circus magic magician audience",
  mda: "video videos youtube youtuber vlog vlogger film films filming movie movies camera tv television channel stream streamer streaming twitch tiktok photo photos photograph photography edit editing cartoon cartoons anime animation animate gaming gamer game games videogame podcast news media social instagram influencer fortnite minecraft roblox nintendo xbox playstation",
  wrd: "read reading reader book books write writing writer wrote story stories author poem poems poet poetry word words spell spelling language languages letter letters journal diary novel library newspaper magazine alphabet grammar essay blog english",
  tea: "teach teacher teaching teaches explain explaining class classroom lesson lessons tutor tutoring homework mentor principal kindergarten",
  hlp: "doctor doctors nurse nurses hospital medic medical medicine sick ill heal healing healthy health body bone bones blood heart brain surgery surgeon patient patients cure disease injur hurt bandage vaccine dentist teeth tooth ambulance paramedic therapy therapist cancer germs",
  car: "help helping helper helpful kindness care caring friend friends share sharing volunteer charity community grandma grandpa grandparent elderly poor homeless lonely sad cheer comfort hug listen support",
  saf: "rescue rescuing save saving safe safety protect protecting police cop cops fire firefighter fireman emergency danger dangerous hero heroes brave guard soldier army military navy detective crime criminal criminals thief lifeguard security spy spies",
  lea: "lead leader leading boss charge president mayor king queen rule rules law laws lawyer judge court government politic politician vote election captain manage manager organize organise decide decision fair justice speech debate argue control",
  biz: "money rich business businesses shop shops store stores sell selling sale sales buy buying trade market company companies bank invest investing price profit dollar dollars cash coin coins lemonade customer customers entrepreneur brand million millions billion ceo startup earn earning",
  nat: "nature natural outside outdoor outdoors tree trees forest plant plants garden gardening flower flowers grow growing environment earth climate ocean oceans sea river lake park weather recycl pollution trash litter green leaf leaves soil farm farming rain rainforest planet",
  ani: "animal animals pet pets dog dogs puppy puppies cat cats kitten horse horses pony bird birds fish dolphin whale shark bunny rabbit hamster lion tiger bear elephant monkey zoo vet veterinarian wildlife reptile snake lizard turtle frog insect insects bug bugs butterfly bee bees cow cows pig chicken sheep penguin panda wolf fox giraffe",
  spo: "sport sports soccer football basketball baseball tennis swim swimming swimmer run running runner race racing gym gymnastic exercise fit fitness athlete athletic team ball goal goals skate skating skateboard ski skiing hockey karate taekwondo martial boxing olympic olympics medal champion volleyball cycling climb climbing strong fast match",
  adv: "travel travelling traveling trip trips explore exploring explorer adventure adventures world abroad journey map maps compass camping camp hike hiking mountain mountains jungle desert island islands beach sail sailing tour tourist visit culture passport treasure faraway",
  fod: "food foods cook cooking cooked chef bake baking baker cake cakes cookie cookies cupcake pizza pasta kitchen recipe recipes restaurant eat eating taste tasty meal meals dinner lunch breakfast snack snacks candy chocolate icecream dessert sandwich fruit vegetable vegetables soup bread grill",
};

// Words that turn the next few words negative: "I don't like sports".
const NEGATORS = "not no dont doesnt didnt never hate hates hated dislike dislikes cant cannot wont isnt arent nor without boring bored scary gross".split(" ");

// Common words ignored when matching answers to job names and descriptions.
const STOPWORDS = new Set(("a an and the of to in on at for with from by as is are be been it its this that these those " +
  "i me my mine you your we our they them their he she his her him who what when where why how " +
  "people person things thing make makes making made keep keeps help helps helping work works working job jobs " +
  "like likes love loves want wants would could should can will do does did get gets got go goes going " +
  "new every other all lots lot very really so too also just about into around out up down over more most " +
  "good great big small little day days time way ways kind kinds sure one two some any each them " +
  "run runs look looks take takes use uses uses place places whole home homes").split(" "));

// Kid words for jobs, so "I want to be a vet" finds Veterinarian.
const ALIASES = {
  "vet": "Veterinarian", "animal doctor": "Veterinarian", "cop": "Police Officer", "policeman": "Police Officer",
  "policewoman": "Police Officer", "police": "Police Officer", "fireman": "Firefighter", "firewoman": "Firefighter",
  "youtuber": "Content Creator / YouTuber", "you tuber": "Content Creator / YouTuber", "scientist": "Research Scientist",
  "artist": "Artist / Painter", "painter": "Artist / Painter", "cook": "Chef", "baker": "Baker / Pastry Chef",
  "athlete": "Professional Athlete", "sports player": "Professional Athlete", "footballer": "Football Player",
  "gamer": "Esports Player", "game maker": "Video Game Developer", "game developer": "Video Game Developer",
  "coder": "Software Developer", "programmer": "Software Developer", "builder": "Construction Worker",
  "mechanic": "Car Mechanic", "boss": "Company CEO", "ceo": "Company CEO", "business owner": "Entrepreneur",
  "spy": "FBI Agent", "army": "Soldier", "writer": "Author", "zoo keeper": "Zookeeper", "singer": "Singer",
  "rockstar": "Musician", "rock star": "Musician", "pop star": "Singer", "cowboy": "Rancher", "cowgirl": "Rancher",
  "doctor": "Doctor", "teacher": "Teacher", "lawyer": "Lawyer", "nurse": "Nurse",
  "dinosaur scientist": "Paleontologist", "dinosaur hunter": "Paleontologist", "space scientist": "Astronomer",
  "dog trainer": "Dog Trainer", "hairdresser": "Hairstylist", "barber": "Hairstylist", "president": "President / Prime Minister",
  "prime minister": "President / Prime Minister", "detective": "Detective", "fashion designer": "Fashion Designer",
  "engineer": "Mechanical Engineer", "inventor": "Inventor", "magician": "Magician", "dancer": "Dancer",
};
