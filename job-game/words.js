// Future Map — the clue words the game looks for in players' answers.
// There are 50 hidden areas. The player never sees them; the game uses them to
// narrow down the job.
//
// Each topic has a list of clue words. Entries of 5+ letters also match longer
// words that start with them ("anima" matches "animal" and "animals").
// Shorter entries match exactly, or with an "s"/"es" on the end ("dog", "dogs").
const TOPIC_WORDS = {
  // Science
  lab: "science scien scientist experiment lab labs chemi physic biolog microscope molecul germ bacteria dna gene cell sample samples specimen test tests testing atom magnet crystal element hypothes measure",
  earth: "geolog volcano earthquake mineral rock rocks weather climate meteorolog ocean soil glacier fossil dinosaur",
  rsch: "research researcher study studying data statistic analysis analys math equation formula model models pattern patterns invent invention inventor university professor discover evolution puzzle",
  // Technology
  code: "computer coding code coder program programming programmer app apps website web software developer develop javascript python java bug bugs deploy github feature features frontend backend algorithm ai robot robotic internet digital online virtual vr database debug debugging developers devops",
  itsup: "tech technolog laptop tablet network networks server servers cloud hardware printer wifi helpdesk install installing ticket tickets it gadget ipad electronic keyboard",
  cyber: "hack hacker hackers cyber security breach password passwords firewall virus malware encrypt",
  // Building
  build: "build builder building construct construction concrete brick bricks wood wooden hammer nail nails saw drill tool tools scaffold roof roofs wall walls frame framing stud cabinet cabinets deck decks carpenter carpentry plumb pipe pipes leak leaks drain drains toilet toilets sink renovat foreman tower skyscraper crane weld welding site sites block blocks",
  eng: "engineer engineering blueprint blueprints plan plans drawing drawings cad bridge bridges structure structural architect architecture prototype",
  elec: "electric electrical electricity electrician wire wires wiring outlet outlets breaker breakers panel panels voltage circuit circuits solar energy lights",
  // Machines and vehicles
  drive: "drive driver driving truck trucks bus taxi car cars van road roads highway route routes delivery deliver deliveries haul freight load loads miles train trains forklift ship boat dispatcher bike bicycle motorbike motorcycle digger bulldozer passengers",
  repair: "fix fixing fixed fixes repair repairing mechanic engine engines brake brakes oil tire tires tyre wrench garage machine machines motor torque maintenance vehicle wheel gear",
  // Air and space
  fly: "fly flying flight flights plane planes airplane aeroplane jet pilot cockpit airport airline aviation helicopter runway passenger passengers mayday",
  space: "space rocket rockets astronaut planet planets star stars galaxy moon mars sun universe orbit satellite nasa telescope astronomy alien aliens sky",
  // Art
  visual: "art arts artist draw drawing drew paint painting painter sketch sketchbook illustrat color colour colors design designer designing graphic logo logos poster posters font fonts kerning photoshop illustrator brand branding creative canvas decorate decorating beautiful picture pictures comic comics cartoon marker tattoo tattoos ink",
  style: "fashion clothes dress dresses outfit outfits style styling stylist hair haircut haircuts salon makeup nails beauty balayage scissors comb barber cosmetolog",
  craft: "craft crafts sculpt clay pottery jewelry jewellery sew sewing knit knitting woodwork handmade glass leather origami",
  // Performing
  music: "rap rapper hiphop music musician musical band bands guitar piano drum drums violin instrument concert concerts song songs sing singing singer gig gigs record recording studio album choir karaoke",
  stage: "act actor actress acting theater theatre stage perform performer performing dance dancer dancing ballet comedy comedian circus magic magician audience audiences funny joke jokes laugh",
  // Media
  film: "video videos film films filming movie movies camera cameras photo photos photograph photographer photography lens lenses footage shoot shoots portrait portraits wedding weddings lightroom aperture youtube youtuber vlog vlogger tv television channel stream streamer streaming twitch edit anime animation animate youtube youtuber subscribers subs thumbnail thumbnails upload uploads uploading vlog vlogging views viral tiktok shorts reels camera",
  games: "game games gaming gamer videogame esports console playstation xbox nintendo minecraft fortnite roblox twitch stream streams streaming streamer viewers chat valorant league fortnite fifa speedrun speedrunning controller headset esports tournament tournaments mods modding discord ranked lobby clutch gg",
  news: "news journalist journalism newspaper report reporting reporter article articles interview interviews scoop deadline deadlines broadcast media social instagram tiktok podcast press influencer followers likes algorithm sponsor sponsors sponsored brand deals engagement posting",
  // Words
  write: "write writing writer wrote book books author novel story stories poem poetry publish published library librarian read reading reader editor editing poems poet word words spell spelling letter letters journal diary magazine alphabet grammar essay blog transcript transcripts typing",
  lang: "language languages translate translating translation translator interpret interpreter french spanish german chinese english localization dictionary",
  // Teaching
  school: "teach teacher teaching class classroom lesson lessons homework grade grading marking student students pupil pupils school principal kindergarten elementary curriculum teaches explain explaining",
  instr: "trainer training coach coaching instructor instruct workshop workshops tutor tutoring mentor course courses certification lecture",
  // Health
  doc: "doctor doctors physician diagnos medicine medical surgery surgeon hospital clinic patient patients disease cure symptom symptoms prescription prescriptions prescribe pharmacy pharmacist pills pill medication refill drugstore medic sick ill heal healing health body bone bones blood heart brain cancer germs clinics stethoscope eye eyes vision glasses lenses",
  nurse: "nurse nurses nursing patient patients ward wards vitals shift shifts scrubs hospital needle needles bandage care caring",
  dent: "dentist dental teeth tooth cavity cavities floss filling fillings crown crowns braces orthodont hygien plaque gums",
  mind: "mental psycholog psychiatr therapy therapist therapists counsel counseling counselling feelings thoughts anxiety depression stress emotions listen listening",
  rehab: "rehab rehabilitat physio physical injury injuries recover recovery exercises massage joint joints muscle muscles knee knees walk walking movement mobility injur hurt",
  // Caring and service
  kids: "kids children child baby babies toddler daycare nanny babysit young",
  social: "help helping helpful support supporting community volunteer charity social homeless poor families elderly visit visits services case lonely comfort helper kindness care caring friend friends share sharing grandma grandpa grandparent sad cheer hug residents",
  service: "customer customers serve serving waiter waitress guest guests hotel reception cashier register scan checkout apron order orders tips desk front appointment appointments greet greeting visitors calls clean cleaning cleaner mop mopping floors bathroom bathrooms trash",
  // Safety
  police: "police cop cops officer patrol arrest arrests crime criminal criminals suspect suspects detective investigat badge handcuff handcuffs ticket tickets thief spy spies incident incidents protect protecting lock locks locked",
  fire: "fire fires firefighter fireman burning rescue rescues rescuing emergency emergencies ambulance paramedic smoke alarm alarms hose station disaster save saving safe safety danger dangerous hero heroes brave lifeguard",
  mil: "army military navy soldier soldiers marine marines combat deployment deployments troops commander commanding salute mission defense defend security guard guards",
  // Leading and law
  law: "law laws lawyer legal court courts judge judges jury trial case cases contract contracts attorney objection client clients sue lawsuit fair justice argue debate speech trial",
  govt: "government politic politician politics mayor president minister vote voting election council policy policies public city parliament senator king queen",
  mgmt: "manager manage managing management lead leader leading team teams staff employees boss meeting meetings project projects strategy organize organise ceo director executive charge rule rules captain decide decision control event events party parties venue venues catering vendor vendors planning",
  // Business
  money: "money finance financial bank banking banker account accounts accounting accountant tax taxes audit audits invoice invoices budget budgets loan loans mortgage interest invest investing investment stock stocks spreadsheet spreadsheets excel calculator payroll numbers rich business businesses profit dollar dollars cash coin coins million millions billion revenue earn earning insurance premium policy policies claims",
  sales: "sell selling sale sales buy buying deal deals negotiat price prices store stores shop shops retail market marketing advertis listing listings commission property trade company companies lemonade entrepreneur startup",
  // Nature and animals
  grow: "farm farms farmer farming crop crops harvest tractor field fields grow growing plant plants garden gardening seed seeds wheat corn vegetable vegetables fruit orchard tree trees greenhouse flower flowers leaf leaves bouquet bouquets honey roses",
  enviro: "environment environmental nature conservation conserve pollution recycl sustainab green forest forests wildlife park parks ranger planet natural earth oceans sea river lake litter rain rainforest trails trail",
  pets: "pet pets dog dogs puppy puppies cat cats kitten rabbit rabbits hamster vet veterinarian veterinary groom grooming neuter vaccine vaccines leash",
  wild: "animal animals zoo wildlife wild lion lions tiger tigers elephant elephants monkey monkeys giraffe giraffes bird birds fish dolphin whale shark penguin enclosure enclosures enrichment marine aquarium horse horses cow cows chicken chickens sheep pony bunny bear bears reptile snake lizard turtle frog insect insects butterfly bee bees hive hives pig panda wolf fox deer",
  // Sport and fitness
  sport: "sport sports soccer football basketball baseball tennis hockey golf athlete athletic match matches score goal goals league championship tournament olympic race racing swim swimming swimmer ball skate skating skateboard ski skiing karate taekwondo martial boxing olympics medal champion volleyball cycling fast parkour freerun freerunning freerunner vault vaulting tactics squad transfer transfers stadium pitch striker referee basketball nba wnba hoop hoops dunk dunks court rebound rebounds dribble nfl touchdown touchdowns quarterback gridiron endzone baseball mlb pitcher pitching homerun innings diamond bat batting hockey nhl puck pucks rink cricket wicket wickets bowler bowling batsman innings rugby scrum scrums tackle tackles tennis serve serves racket racquet wimbledon golf golfer putt putting swing fairway caddie boxing boxer ring punch punches gloves knockout volleyball spike spikes athletics sprint sprints sprinter sprinting hurdles javelin motorsport formula grand prix racetrack pitstop",
  fit: "fitness fit gym workout workouts exercise weights cardio reps squat strength yoga protein running run runner gymnastic strong",
  // Travel and adventure
  travel: "travel traveling travelling trip trips tour tourist tourists hotel passport abroad world cruise vacation culture",
  explore: "explore exploring explorer adventure expedition outdoors wilderness mountain mountains climb climbing hike hiking camping camp jungle desert island diving dive cave caves adventures journey map maps compass islands beach sail sailing treasure faraway",
  // Food
  cook: "food foods cook cooking cooked chef kitchen restaurant menu dish dishes meal meals recipe recipes bake baking baker cake cakes bread pastry dessert sauce grill coffee espresso latte barista cafe cookie cookies cupcake pizza pasta eat eating taste tasty dinner lunch breakfast snack snacks candy chocolate icecream sandwich soup meat beef pork steak steaks sausage",
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
  "nursing school": "Nurse", "nursing degree": "Nurse", "medical school": "Doctor", "med school": "Doctor",
  "law school": "Lawyer", "law degree": "Lawyer", "police academy": "Police Officer", "fire academy": "Firefighter",
  "culinary school": "Chef", "cooking school": "Chef", "veterinary school": "Veterinarian", "vet school": "Veterinarian",
  "teaching degree": "Teacher", "education degree": "Teacher", "accounting degree": "Accountant", "beauty school": "Hairstylist",
  "cosmetology": "Hairstylist", "trucking school": "Truck Driver", "flight school": "Pilot", "dental school": "Dentist",
  "pharmacy school": "Pharmacist", "computer science": "Software Developer", "electrician apprenticeship": "Electrician",
  "plumbing apprenticeship": "Plumber", "carpentry": "Carpenter", "architecture school": "Architect", "journalism": "Journalist",
  "wiring": "Electrician", "electrical": "Electrician", "electrician": "Electrician",
  "football manager": "Football Manager", "soccer manager": "Football Manager", "manager of a football club": "Football Manager",
  "parkour": "Parkour Athlete", "freerunner": "Parkour Athlete", "traceur": "Parkour Athlete", "lorry driver": "Truck Driver",
  "estate agent": "Real Estate Agent", "gp": "General Practitioner", "family doctor": "General Practitioner", "binman": "Refuse Collector",
  "garbage man": "Refuse Collector", "postman": "Mail Carrier", "postwoman": "Mail Carrier", "lollipop lady": "School Crossing Guard",
  "tiktoker": "Content Creator / YouTuber", "influencer": "Influencer", "pro gamer": "Esports Player",
  "professional gamer": "Esports Player", "twitch streamer": "Twitch Streamer", "content creator": "Content Creator / YouTuber",
  "engineer": "Mechanical Engineer", "inventor": "Inventor", "magician": "Magician", "dancer": "Dancer",
};

// Sports families. When a player mentions a sport, jobs in that sport move up
// and jobs in other sports move down, the way a person would narrow it down.
const SPORT_FAMILIES = {
  basketball: "basketball nba wnba hoop hoops dunk dunks streetball",
  football: "football soccer premier goalkeeper goalkeeping",
  amfootball: "nfl touchdown touchdowns quarterback gridiron american",
  baseball: "baseball mlb pitcher pitching homerun",
  hockey: "hockey nhl puck pucks rink",
  cricket: "cricket wicket wickets bowler batsman",
  rugby: "rugby scrum scrums",
  tennis: "tennis wimbledon racket racquet deuce",
  golf: "golf golfer golfers putt putting fairway caddie",
  boxing: "boxing boxer boxers knockout",
  volleyball: "volleyball",
  athletics: "athletics sprint sprinter sprints hurdles javelin marathon",
  motorsport: "motorsport formula racing racetrack pitstop",
  swimming: "swim swimming swimmer swimmers",
};
