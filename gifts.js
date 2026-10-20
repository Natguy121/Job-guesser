// Gift Elf — the questions and the gift catalogue.

// Each trait is one yes/no question about the person you're shopping for.
// Age traits are special: a gift that lists some ages doesn't suit the others.
const TRAITS = {
  kid:         "Are they a child (under 12)?",
  teen:        "Are they a teenager?",
  adult:       "Are they a grown-up?",
  senior:      "Are they a grandparent, or over 65?",
  outdoors:    "Do they love being outdoors?",
  sporty:      "Do they play or watch a lot of sport?",
  fitness:     "Are they into fitness or the gym?",
  gamer:       "Do they play video games?",
  nintendo:    "Do they have a Nintendo Switch?",
  playstation: "Do they have a PlayStation?",
  xbox:        "Do they play on Xbox or a gaming PC?",
  techie:      "Do they love gadgets and tech?",
  reader:      "Are they a big reader?",
  crafty:      "Do they like making things with their hands?",
  artsy:       "Do they love drawing, painting or design?",
  music:       "Is music a big part of their life?",
  cook:        "Do they love cooking or baking?",
  coffee:      "Are they a coffee or tea lover?",
  sweet:       "Do they have a sweet tooth?",
  fashion:     "Do they care a lot about clothes and style?",
  beauty:      "Are they into skincare, makeup or pampering?",
  cosy:        "Do they love cosy nights in?",
  travel:      "Do they love travelling?",
  pets:        "Do they have a pet?",
  animals:     "Do they love animals?",
  garden:      "Do they like gardening or plants?",
  movies:      "Are they a big film or TV fan?",
  puzzles:     "Do they like puzzles and brain teasers?",
  building:    "Do they love building things, like LEGO?",
  science:     "Are they curious about science or space?",
  cars:        "Are they into cars or anything with an engine?",
  pokemon:     "Are they a Pokémon fan?",
  starwars:    "Are they a Star Wars fan?",
  marvel:      "Do they love Marvel superheroes?",
  harrypotter: "Are they a Harry Potter fan?",
  disney:      "Do they love Disney?",
  collector:   "Do they collect anything?",
  funny:       "Would they love a funny or silly gift?",
  sentimental: "Would a personal, sentimental gift mean a lot to them?",
  practical:   "Do they prefer useful, practical gifts?",
  party:       "Do they love parties and having friends over?",
  drinks:      "Do they enjoy a fancy drink, like wine, cocktails or craft beer?",
  photo:       "Do they like taking photos?",
  diy:         "Do they like fixing things or DIY?",
  boardgames:  "Do they love board games or card games?",
  home:        "Do they love decorating their home?",
  relax:       "Do they need more time to relax?",
  experience:  "Would they rather do something special than get a thing?",
};
const AGE_TRAITS = ["kid", "teen", "adult", "senior"];
// Consoles work like ages: a game that lists some consoles doesn't run on the others.
const PLATFORM_TRAITS = ["nintendo", "playstation", "xbox"];

// Each gift: "emoji | specific product | why it's a good pick | rough price in $ | traits it fits"
const GIFTS_TEXT = `
🏎️ | Mario Kart 8 Deluxe (Switch) | The best party racing game ever made, great for the whole family | 50 | kid teen adult gamer nintendo party funny
🍄 | Super Mario Bros. Wonder (Switch) | Mario's most inventive adventure in years, playable together | 55 | kid teen gamer nintendo
🗡️ | The Legend of Zelda: Tears of the Kingdom (Switch) | A huge open world where they can build and explore for months | 60 | teen adult gamer nintendo outdoors building
🏝️ | Animal Crossing: New Horizons (Switch) | A calm island life of fishing, decorating and friendly animals | 50 | kid teen adult gamer nintendo cosy relax animals home
⚡ | Pokémon Scarlet or Violet (Switch) | Catch and train Pokémon across an open world | 55 | kid teen gamer nintendo pokemon collector
🎉 | Super Mario Party Jamboree (Switch) | Over 100 minigames for chaotic family game nights | 55 | kid teen adult gamer nintendo party boardgames funny
🥊 | Super Smash Bros. Ultimate (Switch) | Every Nintendo hero in one brawl, perfect with friends | 55 | kid teen gamer nintendo party
💪 | Ring Fit Adventure (Switch) | An adventure game you play by actually working out | 70 | kid teen adult gamer nintendo fitness
⚾ | Nintendo Switch Sports | Tennis, bowling and football with real swings | 40 | kid teen adult senior gamer nintendo sporty party fitness
🦑 | Splatoon 3 (Switch) | Colourful online paint battles | 55 | kid teen gamer nintendo
🎮 | Nintendo Switch 2 | The new Nintendo console, with Mario Kart World | 450 | kid teen adult gamer techie
🎮 | Nintendo Switch OLED | A bright screen for gaming at home or on the go | 350 | kid teen gamer techie travel
🕹️ | Nintendo Switch Pro Controller | A comfy, proper controller for long sessions | 70 | kid teen adult gamer nintendo practical
🕷️ | Marvel's Spider-Man 2 (PS5) | Swing through New York as both Spider-Men | 60 | teen adult gamer playstation marvel movies
⚔️ | God of War Ragnarök (PS5) | An epic Norse myth adventure with a brilliant story | 60 | adult gamer playstation reader
🤖 | Astro Bot (PS5) | A joyful, award-winning platformer for all ages | 55 | kid teen adult gamer playstation funny
🏎️ | Gran Turismo 7 (PS5) | The most realistic car collection and racing on PlayStation | 60 | teen adult gamer playstation cars collector
🎮 | PlayStation 5 Slim | The console for the biggest games of the year | 450 | teen adult gamer techie
🎮 | PS5 DualSense Controller | A second controller so they can play together | 70 | kid teen adult gamer playstation practical
🎧 | PlayStation Pulse Elite Headset | Wireless sound made for the PS5 | 150 | teen adult gamer playstation music techie
🪙 | PlayStation Store gift card ($50) | Lets them pick their own games and add-ons | 50 | kid teen adult gamer playstation practical
🛡️ | Halo Infinite (Xbox/PC) | The legendary sci-fi shooter series | 40 | teen adult gamer xbox science
🚗 | Forza Horizon 5 (Xbox/PC) | Drive hundreds of cars around a gorgeous Mexico | 60 | teen adult gamer xbox cars outdoors travel
✈️ | Microsoft Flight Simulator 2024 (Xbox/PC) | Fly anywhere on a real-scale planet | 70 | teen adult senior gamer xbox travel science techie
🎮 | Xbox Series X | A powerful console with thousands of games | 500 | teen adult gamer techie
💳 | Xbox Game Pass Ultimate (3 months) | Hundreds of games to download and play | 60 | teen adult gamer xbox
🎮 | Xbox Wireless Controller | A second controller that also works on PC | 60 | teen adult gamer xbox practical
⛏️ | Minecraft (any console or PC) | Build anything, block by block | 30 | kid teen gamer building crafty nintendo playstation xbox
⚽ | EA Sports FC 26 | This year's football game with all the real teams | 70 | kid teen adult gamer sporty nintendo playstation xbox
🏀 | NBA 2K26 | The basketball game with every NBA star | 70 | teen adult gamer sporty playstation xbox
🏈 | Madden NFL 26 | American football, play by play | 70 | teen adult gamer sporty playstation xbox
🏎️ | F1 25 | Race a full Formula 1 season as a real driver | 60 | teen adult gamer sporty cars playstation xbox
🪄 | Hogwarts Legacy | Be a student at Hogwarts, cast spells and explore the castle | 50 | teen adult gamer harrypotter nintendo playstation xbox
🧱 | LEGO Star Wars: The Skywalker Saga | All nine Star Wars films in funny LEGO form | 30 | kid teen gamer starwars building funny nintendo playstation xbox
🌾 | Stardew Valley | A gentle farming game they'll sink hundreds of hours into | 15 | teen adult gamer cosy relax garden nintendo playstation xbox
🥘 | Overcooked! All You Can Eat | Frantic co-op cooking that's hilarious with friends | 40 | kid teen adult gamer cook party funny nintendo playstation xbox
🌌 | Star Wars Jedi: Survivor | Become a Jedi in a big action adventure | 40 | teen adult gamer starwars playstation xbox
💃 | Just Dance 2026 | Dance-off party game that gets everyone moving | 40 | kid teen adult gamer music party fitness nintendo playstation xbox
🏰 | Disney Dreamlight Valley | Build a village with Disney and Pixar characters | 40 | kid teen adult gamer disney cosy nintendo playstation xbox
🪂 | Fortnite V-Bucks card (2,800) | New skins and the Battle Pass in their favourite game | 22 | kid teen gamer nintendo playstation xbox
🧱 | Roblox gift card ($25) | Robux for outfits and items in their favourite games | 25 | kid teen gamer
🎧 | SteelSeries Arctis Nova 7 Wireless | A comfy wireless headset that works on any console | 180 | teen adult gamer techie music
🪑 | Secretlab Titan Evo | A seriously comfortable gaming chair | 550 | teen adult gamer home techie
⌨️ | Razer BlackWidow V4 Keyboard | A clicky, glowing keyboard for PC games | 170 | teen adult gamer xbox techie
🖱️ | Logitech G502 X Mouse | The gaming mouse that fits every hand | 80 | teen adult gamer xbox techie
🕹️ | Meta Quest 3S | Virtual reality games, fitness and films | 300 | teen adult gamer techie fitness movies
🕹️ | Steam Deck OLED | Their whole PC game library, in their hands | 550 | teen adult gamer xbox techie travel
🎲 | Anbernic RG35XX Retro Handheld | A pocket console for classic games | 70 | teen adult gamer techie collector
🧱 | LEGO Super Mario Adventures with Mario starter set | Build Mario levels that he actually reacts to | 60 | kid gamer building nintendo
🧱 | LEGO Star Wars Millennium Falcon (75257) | Build the fastest hunk of junk in the galaxy | 170 | kid teen starwars building collector
🧱 | LEGO Star Wars UCS Venator (75367) | A giant display model for serious fans | 650 | adult starwars building collector home
🧱 | LEGO Harry Potter Hogwarts Castle and Grounds (76419) | A detailed Hogwarts for the shelf | 170 | teen adult harrypotter building collector home
🧱 | LEGO Marvel Avengers Tower (76269) | The huge Avengers HQ, packed with heroes | 500 | teen adult marvel building collector
🧱 | LEGO Technic Lamborghini Sián (42115) | A real gearbox, engine and scissor doors | 450 | teen adult cars building collector
🧱 | LEGO Icons Bonsai Tree (10281) | A calm building project that looks lovely on a shelf | 50 | adult senior building garden home relax
🧱 | LEGO Icons Flower Bouquet (10280) | Flowers that never wilt, built brick by brick | 60 | teen adult senior building garden home sentimental
🧱 | LEGO Disney Castle (43222) | Cinderella's castle in amazing detail | 400 | adult disney building collector home
🧱 | LEGO Friends Heartlake City Hotel | A big hotel to build and play with | 70 | kid building
🧱 | LEGO Classic Large Creative Brick Box (10698) | 790 bricks for building whatever they dream up | 60 | kid building crafty artsy
🧱 | LEGO Pokémon Pikachu and Poké Ball | The brand new LEGO Pokémon line | 40 | kid teen pokemon building collector
🧱 | LEGO Art World Map (31203) | A huge wall map made of tiny bricks | 250 | adult building travel home artsy
🧱 | LEGO Ideas Typewriter (21327) | A working-key typewriter for writers and builders | 250 | adult senior building reader collector
⚡ | Pokémon TCG Elite Trainer Box | Booster packs, sleeves and dice for card battlers | 50 | kid teen pokemon collector boardgames
⚡ | Pokémon Pikachu 12-inch plush | The cuddliest Pikachu | 25 | kid pokemon cosy
⚡ | Pokémon Ultra Premium Collection | A special box for serious card collectors | 120 | teen adult pokemon collector
⚡ | Pokémon Squishmallow (Snorlax) | Big, squishy and very sleepy | 30 | kid teen pokemon cosy
🌌 | Star Wars Black Series Darth Vader figure | A detailed 6-inch figure for collectors | 30 | teen adult starwars collector movies
🌌 | Hasbro Star Wars Lightsaber Forge | Build your own lightsaber with sounds and lights | 40 | kid starwars funny
🌌 | Grogu animatronic plush | The Child moves and makes sounds | 80 | kid teen adult starwars cosy funny
🌌 | Star Wars: The Complete Visual Dictionary | Every ship, droid and alien in the galaxy | 40 | kid teen adult starwars reader collector
🦸 | Marvel Legends Iron Man figure | A detailed 6-inch figure for any Marvel shelf | 30 | teen adult marvel collector
🦸 | Spider-Man Web Shooter toy | Shoot water and webs like Spidey | 25 | kid marvel funny outdoors
🦸 | Marvel Funko Pop! 3-pack | Their favourite heroes, big heads and all | 35 | kid teen adult marvel collector funny
🧤 | Marvel Legends Infinity Gauntlet | Light-up gauntlet replica with all six stones | 120 | teen adult marvel collector movies
🪄 | Harry Potter Wand (Noble Collection) | A real replica wand in its own box | 40 | kid teen adult harrypotter collector
🪄 | Harry Potter Illustrated Edition (Jim Kay) | The stories with gorgeous full-colour art | 40 | kid teen harrypotter reader artsy
🪄 | Harry Potter Hogwarts House Hoodie | Show their house pride | 50 | kid teen adult harrypotter fashion cosy
🪄 | Warner Bros. Studio Tour tickets (Making of Harry Potter) | Walk through the real sets and the Great Hall | 120 | kid teen adult harrypotter experience movies travel
🏰 | Disney+ annual subscription | All the Disney, Pixar, Marvel and Star Wars films | 140 | kid teen adult senior disney marvel starwars movies cosy
🏰 | Disney Stitch plush (16-inch) | Everyone's favourite blue alien to cuddle | 25 | kid teen disney cosy funny
🏰 | Disney Lorcana starter deck set | Disney's trading card game | 35 | kid teen adult disney boardgames collector
🏰 | Disneyland or Disney World day tickets | A magical day at the parks | 300 | kid teen adult disney experience travel party
📖 | Kindle Paperwhite | Thousands of books, glare-free and waterproof | 160 | teen adult senior reader techie travel
📖 | Kindle Unlimited (12 months) | Read as many books as they like | 120 | teen adult senior reader
🎧 | Audible Premium Plus (6 months) | Audiobooks for walks, chores and commutes | 90 | adult senior reader travel
📚 | The Hobbit (illustrated hardback) | Tolkien's classic adventure, beautifully illustrated | 30 | kid teen adult reader
📚 | Diary of a Wimpy Kid box set | The funniest books for young readers | 60 | kid reader funny
📚 | Dog Man (box set) | Silly comic adventures kids can't put down | 50 | kid reader funny animals
📚 | Percy Jackson box set | Greek gods and big adventures | 45 | kid teen reader
📚 | Fourth Wing (special edition) | The dragon fantasy everyone is reading | 30 | teen adult reader
📚 | Project Hail Mary by Andy Weir | A brilliant, funny space adventure | 20 | teen adult reader science funny
📚 | Atomic Habits by James Clear | Small changes that make big differences | 20 | adult reader practical
📚 | Guinness World Records 2026 | Amazing records to flip through for hours | 25 | kid teen reader funny animals
📚 | The Book of Questions (journal for grandparents) | Grandparents write their life story for the family | 25 | senior sentimental reader
🖍️ | Crayola Inspiration Art Case (140 pieces) | Crayons, pencils and markers in one case | 30 | kid artsy crafty
✏️ | Faber-Castell Polychromos pencils (36) | Top-quality pencils for serious artists | 80 | teen adult artsy
🖌️ | Winsor & Newton Cotman watercolour set | A lovely travel paint set | 35 | teen adult senior artsy travel relax
🖊️ | Posca paint markers (16) | Draw on anything: shoes, rocks, mugs | 40 | kid teen adult artsy crafty fashion
📱 | iPad (11th gen) with Apple Pencil | Drawing, games and films in one | 450 | kid teen adult techie artsy movies
🎨 | Wacom Intuos drawing tablet | Draw digitally on any computer | 80 | teen adult artsy techie
🧶 | The Woobles beginner crochet kit | Learn to crochet a cute animal | 30 | teen adult crafty animals relax
🧵 | Brother CS7000X sewing machine | Make and mend clothes | 200 | teen adult senior crafty fashion practical
🏺 | Air-dry clay sculpting kit (DAS) | Make pots, figures and trinket dishes | 25 | kid teen adult crafty artsy
💍 | Klutz Make Clay Charms kit | Make little charms and bracelets | 20 | kid crafty fashion
🌈 | Spirograph Deluxe set | Draw amazing swirly patterns | 25 | kid artsy puzzles
💎 | Diamond painting kit (large) | A relaxing, sparkly craft | 25 | teen adult senior crafty relax
🎸 | Fender Squier Sonic Stratocaster pack | A guitar, amp and everything to start playing | 250 | teen adult music
🎸 | Yamaha FG800 acoustic guitar | A great-sounding first guitar | 200 | teen adult music
🎹 | Casio CT-S300 keyboard | Learn piano with built-in lessons | 150 | kid teen adult senior music
🪕 | Kala ukulele starter kit | Small, cheerful and easy to learn | 60 | kid teen adult music
🎤 | Bonaok karaoke microphone | Sing along with a built-in speaker | 25 | kid teen music party funny
🎧 | Sony WH-1000XM5 headphones | The best noise-cancelling headphones | 350 | teen adult music techie travel
🎧 | AirPods Pro 2 | Great sound and noise cancelling in their pocket | 250 | teen adult music techie fitness
🎧 | JBL Tune 520BT headphones | Wireless headphones that are great value | 50 | kid teen music techie
🔊 | JBL Flip 6 speaker | Loud, waterproof music anywhere | 130 | teen adult music outdoors party
📻 | Audio-Technica AT-LP60X turntable | Start a vinyl record collection | 150 | teen adult senior music collector home
💿 | Spotify Premium (12 months) | Music without ads | 130 | teen adult music
🍳 | Le Creuset cast iron casserole | A pot they'll keep for life | 400 | adult cook home
🍳 | Ninja Foodi Dual Zone air fryer | Crispy food in half the time | 180 | adult cook practical home
🥣 | KitchenAid Artisan stand mixer | The baker's dream machine | 450 | adult cook home
🔪 | Victorinox chef's knife | The knife chefs swear by | 50 | adult cook practical
🍕 | Ooni Koda 12 pizza oven | Proper pizza in 60 seconds, in the garden | 400 | adult cook outdoors party
🔥 | Traeger Pro 22 pellet grill | Smoky barbecue made easy | 800 | adult cook outdoors party
🌡️ | Meater Plus wireless meat thermometer | Perfect steak every time | 100 | adult cook techie
📖 | Salt, Fat, Acid, Heat by Samin Nosrat | The cookbook that teaches how to cook | 35 | adult cook reader
🧁 | Kids' baking kit (Baketivity) | Real baking for little chefs | 30 | kid cook crafty sweet
☕ | Nespresso Vertuo Pop | Café coffee at home in one button | 100 | adult coffee practical home
☕ | Breville Barista Express | Grind and brew real espresso | 700 | adult coffee techie home
☕ | Ember Mug 2 | Keeps their drink at the perfect temperature | 130 | adult coffee techie
🫖 | Whittard tea discovery collection | A box of fine teas to try | 35 | adult senior coffee cosy
🍵 | Bodum Chambord French press | Simple, classic, great coffee | 40 | adult coffee practical
🍫 | Lindt Lindor festive gift box | Melt-in-the-mouth chocolate truffles | 25 | kid teen adult senior sweet
🍫 | Hotel Chocolat Velvetiser | Silky hot chocolate made at home | 100 | adult sweet cosy techie
🍬 | Sugarfina candy bento box | Fancy sweets in a beautiful box | 40 | teen adult sweet
🍪 | Harry & David Christmas cookie tin | Butter cookies for sharing | 35 | adult senior sweet party
🧴 | Drunk Elephant skincare set | Cult skincare favourites | 90 | teen adult beauty
💄 | Charlotte Tilbury Pillow Talk lip kit | The famous shade in a gift set | 50 | teen adult beauty fashion
🛁 | Lush Christmas bath bomb gift set | Fizzy, colourful bath time | 40 | kid teen adult beauty relax
🌸 | Jo Malone English Pear & Freesia cologne | A fresh, elegant perfume | 120 | adult senior beauty fashion
💆 | Theragun Mini | Pocket massage gun for sore muscles | 200 | adult fitness relax techie
💆 | Spa day for two | A day of massages and relaxing | 250 | adult senior relax beauty experience
💨 | Dyson Airwrap | Styles hair without extreme heat | 600 | teen adult beauty fashion techie
🧥 | The North Face Nuptse puffer jacket | The warm, iconic winter jacket | 330 | teen adult fashion outdoors
👟 | Nike Air Force 1 trainers | The classic white sneaker | 115 | teen adult fashion sporty
👟 | Adidas Samba trainers | The trendy everyday shoe | 100 | teen adult fashion
🥾 | Ugg Classic Mini boots | Super warm and cosy | 160 | teen adult fashion cosy
🧣 | Cashmere scarf | Soft and warm, a luxury for winter | 80 | adult senior fashion cosy
🎒 | Fjällräven Kånken backpack | The colourful classic bag | 90 | kid teen adult fashion travel practical
⌚ | Casio vintage digital watch | A retro watch everyone loves | 30 | teen adult fashion collector
⌚ | Apple Watch SE | Fitness, messages and safety on their wrist | 250 | teen adult senior techie fitness
⌚ | Fitbit Inspire 3 | Counts steps, sleep and heart rate | 100 | adult senior fitness practical
🧦 | Bombas gripper socks gift box | Cosy, comfy socks | 50 | senior cosy practical
🧸 | Jellycat Bashful Bunny | The softest, cuddliest bunny | 30 | kid teen adult cosy animals
🧸 | Build-A-Bear Workshop gift card | Make their own teddy | 35 | kid cosy experience animals
🛌 | Barefoot Dreams CozyChic blanket | Like being hugged by a cloud | 150 | teen adult senior cosy home relax
🛌 | Bearaby weighted blanket | Calming weight for better sleep | 200 | adult cosy relax home
🕯️ | Yankee Candle Christmas Cookie large jar | Makes the house smell like the holidays | 30 | adult senior cosy home
👘 | Matching family Christmas pyjamas | Perfect for Christmas morning photos | 60 | kid teen adult senior cosy funny sentimental
🥿 | Ugg Scuffette slippers | Fluffy slippers for chilly mornings | 90 | adult senior cosy fashion
🧳 | Away carry-on suitcase | A sturdy, smart suitcase | 275 | adult travel practical
🔌 | Anker universal travel adapter | Charge everything in any country | 30 | adult travel practical techie
🗺️ | Scratch-off world map | Scratch off every country they visit | 25 | teen adult travel home
✈️ | Airbnb gift card ($200) | Towards their next trip | 200 | adult senior travel experience
📷 | Instax Mini 12 instant camera | Print photos instantly | 80 | kid teen adult photo party
📷 | GoPro HERO13 Black | Film adventures in the water or on a bike | 400 | teen adult photo outdoors sporty techie
📷 | Canon EOS R50 camera | A great first serious camera | 680 | teen adult photo techie travel
🖼️ | Shutterfly custom photo book | Their favourite memories, printed | 50 | adult senior photo sentimental
🖼️ | Aura Carver digital photo frame | Family can add photos from far away | 150 | senior photo sentimental techie
🗣️ | StoryWorth (one year) | They answer a weekly question; it becomes a book | 100 | senior sentimental reader
🧬 | AncestryDNA kit | Discover where their family came from | 100 | adult senior science sentimental
⭐ | Name a star certificate | A star with their name on it | 30 | kid teen adult senior sentimental science
🔭 | Celestron NexStar 4SE telescope | See Saturn's rings from the garden | 500 | teen adult senior science outdoors
🔭 | Celestron FirstScope telescope | A first telescope for little astronomers | 60 | kid science outdoors
🧪 | National Geographic Mega Science Kit | Volcanoes, crystals and fizzy experiments | 30 | kid science crafty
💎 | National Geographic Break Open Geodes | Crack rocks to find crystals inside | 25 | kid science funny
🤖 | Makeblock mBot2 coding robot | Build and code a real robot | 140 | kid teen science building techie
🤖 | Sphero BOLT coding robot | Learn to code with a rolling robot | 150 | kid teen science techie
🛸 | DJI Mini 4K drone | Film from the sky | 300 | teen adult techie photo outdoors
🛸 | Holy Stone mini drone | Easy flying fun for beginners | 50 | kid teen techie outdoors
🚗 | Traxxas Slash RC truck | A fast, tough remote control truck | 300 | kid teen adult cars techie outdoors
🚗 | Hot Wheels Ultimate Garage | A giant multi-level car garage | 120 | kid cars building
🚗 | Hot Wheels 20-car gift pack | Instant collection | 25 | kid cars collector
🧽 | Chemical Guys car wash kit | Make their car shine | 70 | adult cars practical
🏁 | Supercar driving experience | Drive a Ferrari or Lamborghini on a track | 300 | adult cars experience
🔧 | DeWalt 20V cordless drill kit | The drill every home needs | 150 | adult diy practical home
🧰 | Craftsman mechanic tool set (230 pieces) | Every socket and spanner they'll need | 150 | adult diy cars practical
🔦 | Milwaukee M12 LED work light | Bright light for any job | 70 | adult diy practical
🔨 | Kids' real wooden toolbox kit | Their own tools for building | 40 | kid diy building crafty
🏡 | Ring Video Doorbell | See who's at the door from their phone | 100 | adult senior techie home practical
🔊 | Amazon Echo Dot | Music, timers and answers by voice | 50 | kid teen adult senior techie home music
🔊 | Sonos Era 100 | Rich room-filling sound | 250 | adult music home techie
💡 | Philips Hue starter kit | Smart lights in any colour | 180 | teen adult techie home
🌈 | Govee LED strip lights | Turn their room any colour | 30 | teen techie home
📱 | iPhone 17 | The newest iPhone | 800 | teen adult techie photo
🔋 | Anker MagGo power bank | Never run out of battery | 70 | teen adult techie travel practical
📺 | Apple TV 4K | Every streaming app in one box | 130 | adult techie movies home
📺 | Netflix gift card ($60) | Months of films and series | 60 | teen adult senior movies cosy
🎬 | AMC movie gift card | A night out at the cinema | 50 | kid teen adult senior movies experience
🍿 | Popcorn machine (Nostalgia) | Movie nights at home | 50 | kid teen adult movies party cosy
📽️ | XGIMI MoGo 2 mini projector | A cinema screen on any wall | 400 | teen adult movies techie home
🧩 | Ravensburger 1000-piece jigsaw | A relaxing challenge for the holidays | 25 | adult senior puzzles relax cosy
🧩 | Rubik's Cube (GAN 12 speedcube) | A pro speedcube for fast solving | 50 | teen adult puzzles
🧩 | Rubik's Cube classic 3x3 | The classic puzzle | 12 | kid teen puzzles
🧩 | ThinkFun Gravity Maze | A marble logic puzzle game | 35 | kid teen puzzles science building
📰 | New York Times Games subscription | Wordle, crossword and Connections daily | 50 | adult senior puzzles
🔐 | Escape room experience | Solve clues together to get out | 120 | teen adult puzzles party experience
🎲 | Catan | The classic strategy game of trading and building | 50 | teen adult boardgames party
🎲 | Ticket to Ride | Build train routes across the map | 50 | kid teen adult senior boardgames travel
🎲 | Wingspan | A beautiful strategy game about birds | 65 | adult senior boardgames animals
🐱 | Exploding Kittens | A quick, silly card game | 20 | kid teen adult boardgames funny party
🃏 | UNO Show 'em No Mercy | UNO, but brutal | 12 | kid teen adult boardgames funny party
🎯 | Codenames | The best party word game | 25 | teen adult boardgames party puzzles
🎭 | What Do You Meme? | Pair captions with memes | 30 | teen adult boardgames funny party
🦄 | Unstable Unicorns | Build an army of unicorns, betray friends | 25 | teen adult boardgames funny
🏰 | Monopoly Deal card game | The family classic in 15 minutes | 10 | kid teen adult senior boardgames
🐉 | Dungeons & Dragons Starter Set | Start their first fantasy adventure | 25 | teen adult boardgames reader party
🍷 | Wine subscription (Winc, 3 months) | New bottles delivered every month | 150 | adult drinks experience
🍸 | Cocktail shaker set (12 pieces) | Make bar-quality cocktails at home | 40 | adult drinks party
🍺 | Craft beer advent calendar | A new beer for every day of Advent | 70 | adult drinks party
🥃 | Whisky stones and glass set | Chilled whisky without watering it down | 35 | adult drinks
🥂 | Veuve Clicquot Champagne | A bottle for celebrating | 65 | adult senior drinks party
🫧 | SodaStream Terra | Fizzy drinks at home | 100 | adult drinks practical home
⚽ | Nike Premier League football | The real match ball | 40 | kid teen sporty outdoors
👕 | Favourite team's home jersey | Wear their team's colours | 90 | kid teen adult sporty fashion
🏀 | Spalding NBA basketball | Real basketball for the driveway | 35 | kid teen sporty outdoors
🏀 | Lifetime portable basketball hoop | A hoop for the driveway | 250 | kid teen sporty outdoors
🎾 | Wilson tennis racket | Get them on the court | 80 | teen adult sporty fitness
⛳ | Titleist Pro V1 golf balls (dozen) | The ball the pros play | 55 | adult senior sporty
⛳ | Golf lesson or round voucher | A day on the course | 100 | adult senior sporty experience outdoors
🏟️ | Tickets to see their team play | Watch the big game live | 150 | kid teen adult senior sporty experience
🛹 | Element complete skateboard | Ready to ride straight out of the box | 80 | kid teen sporty outdoors
🛴 | Micro Maxi kick scooter | The smoothest scooter for little ones | 120 | kid outdoors sporty
🚲 | Trek kids' bike | Their first proper bike | 300 | kid outdoors sporty
🏋️ | Bowflex SelectTech adjustable dumbbells | A whole rack in two dumbbells | 400 | adult fitness home
🧘 | Lululemon yoga mat | A grippy mat for yoga and stretching | 100 | adult fitness relax
💧 | Stanley Quencher tumbler (40oz) | The famous cup that keeps drinks cold | 45 | teen adult fitness practical fashion
💧 | Owala FreeSip water bottle | A trendy, leak-proof bottle | 30 | kid teen adult fitness practical
🏋️ | Gym membership (3 months) | A fresh start in the new year | 150 | adult fitness experience
⛺ | Coleman Sundome 4-person tent | Easy family camping | 100 | adult outdoors travel
🔥 | Solo Stove Ranger fire pit | Smokeless campfires in the garden | 250 | adult outdoors party home
🥾 | Merrell Moab hiking boots | Comfortable boots for long walks | 140 | adult senior outdoors
🔦 | Black Diamond head torch | Hands-free light for camping | 40 | teen adult outdoors practical
🧭 | YETI Rambler 20oz tumbler | Keeps coffee hot on any adventure | 35 | adult outdoors coffee practical
🧊 | YETI Hopper Flip cooler | A tough cooler for picnics | 250 | adult outdoors party
🎣 | Ugly Stik fishing rod combo | A great first fishing rod | 60 | kid teen adult senior outdoors
🌱 | Click & Grow Smart Garden | Herbs that grow themselves indoors | 100 | adult senior garden techie cook
🌿 | Felco No. 2 pruning shears | The gardener's favourite tool | 60 | adult senior garden practical
🪴 | Monstera plant in a nice pot | A big leafy plant for the home | 50 | adult garden home
🪺 | Bird feeder with camera (Bird Buddy) | See and identify garden birds | 200 | adult senior garden animals techie
🐦 | Bird identification book (Sibley Guide) | Name every bird they spot | 30 | senior animals garden reader
🦋 | Insect Lore butterfly garden | Watch caterpillars become butterflies | 35 | kid animals science
🐶 | Barkbox subscription (3 months) | Toys and treats for their dog | 90 | adult pets animals
🐶 | Furbo dog camera | Watch and toss treats from anywhere | 200 | adult pets techie
🐱 | Cat tree (large) | A climbing tower for their cat | 90 | adult pets animals home
🐾 | Custom pet portrait | A painting of their pet | 80 | adult senior pets sentimental artsy
🐼 | Adopt an animal (WWF) | Help protect wildlife, with a plush and certificate | 60 | kid teen adult senior animals sentimental
🦁 | Zoo membership (family) | A year of animal visits | 150 | kid adult animals experience
🐶 | Squishmallow 16-inch | The squishy toy everyone collects | 25 | kid teen cosy collector animals
🎟️ | Concert tickets for their favourite band | See them live | 200 | teen adult music experience party
🎭 | Broadway / theatre show tickets | A night at the theatre | 180 | adult senior experience movies
🍽️ | Cooking class for two | Learn a new cuisine together | 150 | adult cook experience party
🎈 | Hot air balloon ride | Float above the countryside | 250 | adult senior experience travel outdoors
🎨 | Paint-and-sip class | Painting with a drink and friends | 50 | adult artsy party drinks experience
🧗 | Indoor climbing session | Try bouldering for a day | 50 | kid teen adult sporty fitness experience
🧘 | Calm app subscription (1 year) | A few calm minutes every day | 70 | adult relax
🖋️ | Personalised engraved pen | A classic gift with their name | 50 | adult senior sentimental practical
📓 | Moleskine notebook with their initials | A journal they'll want to fill | 30 | teen adult reader artsy sentimental
💌 | Personalised letter from Santa | A letter from the North Pole, with their name | 10 | kid sentimental funny
🎁 | Custom family name star map | The night sky on a special date | 50 | adult senior sentimental home
👶 | Personalised grandparent mug | "World's best Grandpa/Grandma" | 20 | senior sentimental funny coffee
💍 | Pandora Moments charm bracelet | Add a charm for every memory | 100 | teen adult fashion sentimental collector
🥸 | Mega Fart Blaster (gag toy) | Pure silly joy | 15 | kid funny
🤪 | Funny personalised socks with their face | Their face, on socks | 25 | teen adult senior funny cosy
🦖 | Inflatable T-rex costume | Instant laughs | 40 | kid teen adult funny party
🪄 | Marvin's Magic 225 tricks set | Amaze the family after dinner | 30 | kid funny party
🌀 | Fidget toy mega pack | Pop, spin and squish | 20 | kid funny
🎆 | Mystery Christmas cracker set (premium) | Pull them at dinner for a surprise | 30 | kid teen adult senior funny party
🧩 | LEGO City Advent Calendar | A tiny build every day until Christmas | 35 | kid building
📸 | Polaroid photo booth props | Funny props for party photos | 15 | teen adult party funny photo
🌍 | Mario Kart World (Switch 2) | The new open-world Mario Kart | 80 | kid teen adult gamer nintendo party funny
🦍 | Donkey Kong Bananza (Switch 2) | Smash through whole worlds as Donkey Kong | 70 | kid teen gamer nintendo funny
👻 | Luigi's Mansion 3 (Switch) | A spooky, funny ghost-hunting adventure | 55 | kid teen gamer nintendo funny
⭐ | Kirby and the Forgotten Land (Switch) | A cheerful 3D adventure, easy for younger players | 55 | kid gamer nintendo
🌟 | Super Mario Odyssey (Switch) | Travel the world with Mario and his magic cap | 50 | kid teen gamer nintendo travel
🍳 | Pokémon Legends: Z-A (Switch) | The newest Pokémon adventure in Lumiose City | 60 | kid teen gamer nintendo pokemon
🐶 | Nintendogs-style Little Friends: Puppy Island (Switch) | Look after a whole island of puppies | 40 | kid gamer nintendo animals pets
🎨 | Pikmin 4 (Switch) | Lead tiny plant creatures on a big adventure | 55 | kid teen adult gamer nintendo garden puzzles
🧠 | Big Brain Academy: Brain vs. Brain (Switch) | Quick brain games for the whole family | 30 | kid adult senior gamer nintendo puzzles party
🎵 | Taiko no Tatsujin: Rhythm Festival (Switch) | Drum along to pop songs | 50 | kid teen gamer nintendo music party
🏡 | Hello Kitty Island Adventure (Switch) | A cute island adventure with Sanrio friends | 50 | kid teen gamer nintendo cosy
🔪 | Metroid Prime 4: Beyond (Switch) | Samus returns in a sci-fi adventure | 70 | teen adult gamer nintendo science
⚔️ | Fire Emblem Engage (Switch) | A deep tactics game with a big story | 55 | teen adult gamer nintendo puzzles
🧳 | Nintendo Switch carrying case | Protects the console on trips | 20 | kid teen gamer nintendo travel practical
💳 | Nintendo Switch Online (12 months) | Online play plus classic NES and SNES games | 20 | kid teen adult gamer nintendo
🪙 | Nintendo eShop gift card ($50) | They pick their own games | 50 | kid teen adult gamer nintendo practical
🎮 | Nintendo Joy-Con pair | Extra controllers for multiplayer | 80 | kid teen gamer nintendo party
🕷️ | Marvel's Spider-Man: Miles Morales (PS5) | A shorter, brilliant Spider-Man adventure | 30 | teen gamer playstation marvel
🏹 | Horizon Forbidden West (PS5) | Hunt robot dinosaurs in a stunning world | 40 | teen adult gamer playstation outdoors
🏯 | Ghost of Yōtei (PS5) | A beautiful samurai adventure in old Japan | 70 | adult gamer playstation travel
🌧️ | The Last of Us Part I (PS5) | A gripping, emotional story game | 50 | adult gamer playstation movies
⚙️ | Ratchet & Clank: Rift Apart (PS5) | Jump between dimensions in a fun shooter | 40 | kid teen gamer playstation funny
🏀 | Sackboy: A Big Adventure (PS5) | A charming co-op platformer | 30 | kid teen gamer playstation funny
🏎️ | PlayStation Portal | Play their PS5 anywhere in the house | 200 | teen adult gamer playstation techie
🥽 | PlayStation VR2 | Virtual reality made for PS5 | 400 | teen adult gamer playstation techie
🔌 | PS5 DualSense charging station | Keeps two controllers topped up | 30 | teen adult gamer playstation practical
💳 | PlayStation Plus Essential (12 months) | Online play and free monthly games | 80 | teen adult gamer playstation
📀 | PS5 2TB SSD (Samsung 990 Pro) | Room for many more games | 160 | teen adult gamer playstation techie
🛡️ | Gears of War: Reloaded | The classic action series, remastered | 40 | adult gamer xbox playstation
🗡️ | Indiana Jones and the Great Circle | A globe-trotting adventure as Indy | 70 | teen adult gamer xbox playstation movies travel
🌱 | Grounded 2 | Survive as an ant-sized kid in a backyard | 40 | kid teen gamer xbox animals outdoors
🏴‍☠️ | Sea of Thieves | Pirate adventures with friends | 40 | teen adult gamer xbox playstation party
🪙 | Xbox gift card ($50) | They pick their own games | 50 | teen adult gamer xbox practical
🎮 | Xbox Elite Controller Series 2 | The pro controller with paddles | 180 | teen adult gamer xbox techie
⚔️ | Elden Ring | A legendary, challenging fantasy world | 60 | adult gamer playstation xbox
🐉 | Baldur's Gate 3 | Dungeons & Dragons as an epic game | 60 | adult gamer playstation xbox boardgames reader
🦖 | Jurassic World Evolution 3 | Build and run your own dinosaur park | 60 | teen adult gamer playstation xbox animals building science
🚜 | Farming Simulator 25 | Run a farm with real tractors | 50 | kid teen adult gamer cars garden playstation xbox
🏙️ | Cities: Skylines II (PC) | Build the city of their dreams | 50 | teen adult gamer xbox building puzzles
🐼 | Planet Zoo (PC) | Build and run a zoo | 45 | teen adult gamer xbox animals building
⚽ | Rocket League Credits | Soccer with rocket cars, plus new items | 20 | kid teen gamer cars sporty nintendo playstation xbox
🔫 | Call of Duty: Black Ops 7 | This year's big shooter | 70 | adult gamer playstation xbox
🏃 | Sonic X Shadow Generations | Classic and modern Sonic speed | 50 | kid teen gamer nintendo playstation xbox
🧩 | Tetris Effect: Connected | Tetris with beautiful music and light | 40 | teen adult senior gamer puzzles music nintendo playstation xbox
🏒 | NHL 26 | Ice hockey with every NHL team | 70 | teen adult gamer sporty playstation xbox
🎳 | WWE 2K25 | Wrestling with all the superstars | 70 | teen adult gamer sporty playstation xbox
🏌️ | PGA Tour 2K25 | Golf on real famous courses | 50 | adult gamer sporty playstation xbox
🛹 | Tony Hawk's Pro Skater 3+4 | The classic skateboarding games, remade | 50 | teen adult gamer sporty nintendo playstation xbox
🎤 | Guitar Hero-style Fortnite Festival guitar controller | Rock out in Fortnite Festival | 130 | teen gamer music playstation xbox
👾 | Pac-Man Mega Tunnel Battle | Pac-Man battle royale fun | 20 | kid teen gamer funny nintendo playstation xbox
🕹️ | Arcade1Up Pac-Man cabinet | A real arcade machine at home | 400 | adult gamer collector home funny
🕹️ | Nintendo Game & Watch: Super Mario | A tiny retro handheld | 50 | adult gamer nintendo collector
📺 | Gaming monitor (LG UltraGear 27-inch) | Fast, smooth picture for PC games | 250 | teen adult gamer xbox techie
🎙️ | Elgato Wave:3 microphone | Clear voice for streaming | 150 | teen adult gamer techie music
📹 | Elgato Stream Deck MK.2 | Buttons that control their stream | 150 | teen adult gamer techie
💡 | Razer Kiyo webcam with ring light | Look great on stream | 100 | teen adult gamer techie photo
🧱 | LEGO Star Wars Darth Vader Helmet (75304) | A helmet to build and display | 80 | teen adult starwars building collector
🧱 | LEGO Star Wars AT-AT (75313) | The giant walker, with 40 extra figures | 850 | adult starwars building collector
🧱 | LEGO Star Wars Mandalorian N-1 Starfighter | Build Mando's ship with Grogu | 60 | kid starwars building
🧱 | LEGO Harry Potter Hogwarts Express (76423) | The famous train with Platform 9¾ | 90 | kid teen harrypotter building
🧱 | LEGO Harry Potter Diagon Alley (75978) | Every shop on the wizarding street | 450 | adult harrypotter building collector
🧱 | LEGO Marvel Spider-Man Daily Bugle (76178) | A giant newspaper skyscraper | 350 | adult marvel building collector
🧱 | LEGO Marvel Spider-Man vs. Venom car | Speedy vehicle battle set | 30 | kid marvel building cars
🧱 | LEGO Disney Frozen Elsa's Ice Palace | Build Elsa's sparkly palace | 80 | kid disney building
🧱 | LEGO Disney Up House (43217) | The flying house with balloons | 60 | kid teen adult disney building movies
🧱 | LEGO Technic Ford Mustang Shelby | A sports car with real moving parts | 50 | teen cars building
🧱 | LEGO Technic McLaren F1 car (42141) | A detailed race car for the shelf | 200 | teen adult cars sporty building collector
🧱 | LEGO Speed Champions Ferrari | A mini supercar for little hands | 25 | kid teen cars building collector
🧱 | LEGO Icons Titanic (10294) | A 1.3-metre model ship | 680 | adult building collector travel
🧱 | LEGO Icons Optimus Prime (10302) | A transforming LEGO robot | 180 | teen adult building collector movies
🧱 | LEGO Icons Orchid (10311) | A lovely plant that never needs water | 50 | adult senior building garden home
🧱 | LEGO Botanicals Tiny Plants (10329) | Nine little plants in pots | 50 | teen adult building garden home
🧱 | LEGO Ideas Home Alone house | Kevin's house with all the traps | 300 | adult building movies funny collector
🧱 | LEGO Ideas Tales of the Space Age | Space art you build | 50 | teen adult building science artsy
🧱 | LEGO NASA Artemis Space Launch System | A tall rocket model | 260 | teen adult building science collector
🧱 | LEGO City Police Station | A big police station with jail and cars | 100 | kid building cars
🧱 | LEGO Minecraft The Creeper | Minecraft in LEGO form | 30 | kid gamer building
🧱 | LEGO Animal Crossing Nook's Cranny | Animal Crossing characters in LEGO | 75 | kid gamer nintendo building cosy animals
🧱 | LEGO Duplo Train | Big bricks for toddlers | 60 | kid building cars
🧱 | LEGO Super Mario Bowser's Airship | Bowser's flying fortress | 100 | kid gamer nintendo building
🧱 | LEGO Wednesday Nevermore Academy set | The hit show in bricks | 80 | teen building movies
🧱 | LEGO Ideas Polaroid OneStep camera | A LEGO camera that "prints" | 80 | adult building photo collector
⚡ | Pokémon Paldean Fates booster bundle | Six packs of shiny cards | 30 | kid teen pokemon collector
⚡ | Pokémon card binder (9-pocket) | Keep their collection safe | 25 | kid teen pokemon collector practical
⚡ | Pokémon Monopoly | The board game with Pokémon | 30 | kid teen pokemon boardgames
⚡ | Pokémon Kanto starters figure set | Bulbasaur, Charmander and Squirtle | 30 | kid pokemon collector
⚡ | Pikachu hoodie | Hood with ears and all | 40 | kid teen pokemon fashion cosy
⚡ | Pokémon Encyclopedia (Pokédex book) | Every Pokémon in one book | 20 | kid pokemon reader
⚡ | Pokémon Snorlax bean bag | Lounge on a giant Snorlax | 120 | kid teen pokemon cosy home
🌌 | Star Wars Grogu Squishmallow | The cutest squishy Grogu | 25 | kid teen starwars cosy collector
🌌 | Star Wars Lightsaber (Hasbro Black Series Force FX) | A collector's lightsaber with real effects | 270 | teen adult starwars collector
🌌 | Star Wars Monopoly (Mandalorian) | Board game night, Star Wars style | 30 | kid teen adult starwars boardgames
🌌 | Star Wars Millennium Falcon mug | Sip from the Falcon | 20 | teen adult starwars coffee funny
🌌 | Star Wars R2-D2 Sphero droid | An app-controlled R2-D2 | 100 | teen adult starwars techie collector
🌌 | Star Wars Jedi robe | Dress up as a Jedi | 40 | kid teen starwars funny cosy party
🦸 | Spider-Man Into the Spider-Verse figure set | Miles and friends | 30 | kid teen marvel collector
🦸 | Captain America shield replica | A full-size shield for fans | 100 | kid teen adult marvel collector funny
🦸 | Marvel Avengers Monopoly | Board game with the heroes | 30 | kid teen marvel boardgames
🦸 | Marvel Encyclopedia (DK) | Every Marvel hero and villain | 40 | kid teen adult marvel reader collector
🦸 | Groot dancing potted plant | Baby Groot dances to music | 25 | kid teen marvel funny music
🦸 | Iron Man Mark 85 helmet (wearable) | A motorised helmet replica | 130 | teen adult marvel collector techie
🪄 | Harry Potter Marauder's Map replica | "I solemnly swear…" | 30 | teen adult harrypotter collector reader
🪄 | Harry Potter Hedwig plush | A snowy owl to cuddle | 25 | kid harrypotter animals cosy
🪄 | Harry Potter Hogwarts Battle board game | A co-op deck-building game | 50 | teen adult harrypotter boardgames
🪄 | Harry Potter Butterbeer recipe kit and mugs | Make butterbeer at home | 35 | kid teen adult harrypotter cook sweet
🪄 | Harry Potter house scarf | Gryffindor, Slytherin, Ravenclaw or Hufflepuff | 30 | kid teen adult harrypotter fashion cosy
🪄 | The Harry Potter Wizarding Almanac | A spellbinding illustrated guide | 40 | kid teen harrypotter reader artsy
🏰 | Disney Princess dress-up trunk | Costumes for every princess | 50 | kid disney funny party
🏰 | Disney Encanto Casita playset | The magical Madrigal house | 80 | kid disney building
🏰 | Disney Ears (Minnie or Mickey) | The classic park ears | 30 | kid teen adult disney fashion funny
🏰 | Disney Villainous board game | Play as the villain | 40 | teen adult disney boardgames
🏰 | Disney Pixar Lightning McQueen RC car | Remote control Lightning McQueen | 50 | kid disney cars techie
🏰 | Disney Stitch hoodie | Cosy hoodie with ears | 45 | kid teen disney fashion cosy funny
🏰 | Disney Cookbook (Delicious Disney) | Recipes from the parks | 30 | adult disney cook
📚 | The Midnight Library by Matt Haig | A moving, hopeful novel | 18 | adult senior reader
📚 | The Thursday Murder Club box set | Cosy murder mysteries solved by pensioners | 45 | adult senior reader funny
📚 | The Seven Husbands of Evelyn Hugo | A glamorous Hollywood life story | 18 | teen adult reader movies
📚 | Onyx Storm by Rebecca Yarros | The next dragon fantasy | 30 | teen adult reader
📚 | A Court of Thorns and Roses box set | Fantasy romance everyone is reading | 75 | adult reader
📚 | Wings of Fire graphic novel set | Dragon adventures in comics | 60 | kid reader animals
📚 | The Wild Robot box set | A robot learning to live in the wild | 30 | kid reader animals science
📚 | Heartstopper box set | Sweet graphic novels about friendship | 50 | teen reader sentimental
📚 | One Piece manga box set 1 | Volumes 1–23 of the epic manga | 200 | teen adult reader collector artsy
📚 | Demon Slayer manga box set | The full story in one box | 180 | teen adult reader collector
📚 | Calvin and Hobbes complete collection | Every strip, in three volumes | 100 | kid teen adult senior reader funny
📚 | Lord of the Rings illustrated edition | The classic, with Tolkien's own art | 60 | teen adult reader collector
📚 | Sapiens: A Graphic History | Human history in comics | 30 | teen adult reader science
📚 | National Geographic Kids Almanac | Facts, maps and animals | 15 | kid reader animals science
📚 | Usborne "Look Inside" flap books | Lift-the-flap discovery for little ones | 15 | kid reader science
📚 | The Very Hungry Caterpillar (board book) | The classic picture book | 10 | kid reader animals
📚 | Bluey: The Beach (picture book) | Bluey fans will love it | 10 | kid reader funny
📚 | Book of the Month subscription (3 months) | A new hardback every month | 50 | adult reader
📖 | Kindle Colorsoft | A colour e-reader for comics and cookbooks | 280 | teen adult reader techie
📖 | Kobo Clara BW | A lightweight, waterproof e-reader | 130 | adult senior reader techie travel
💡 | Glocusent book light | Read in bed without waking anyone | 20 | adult senior reader practical
📌 | Personalised book embosser | "From the library of…" | 35 | adult senior reader sentimental
🖍️ | Crayola Light-Up Tracing Pad | Trace and draw on a glowing pad | 25 | kid artsy
🎨 | Melissa & Doug easel | A standing easel with chalkboard | 70 | kid artsy
✏️ | Copic Ciao markers (36) | The markers manga artists use | 120 | teen adult artsy
📒 | Leuchtturm1917 dotted notebook | The bullet journaller's notebook | 25 | teen adult artsy practical
🖌️ | Liquitex acrylic paint set with canvases | Everything to start painting | 50 | teen adult artsy relax
✒️ | Pilot calligraphy pen set | Learn beautiful lettering | 20 | teen adult artsy crafty relax
🧶 | Lion Brand knitting starter kit | Needles, yarn and patterns | 30 | adult senior crafty cosy relax
🪡 | Embroidery hoop kit (floral) | A calm, pretty stitching project | 25 | teen adult crafty relax
🖨️ | Cricut Joy Xtra | Cut vinyl, card and iron-on designs | 250 | adult crafty artsy techie
💍 | Jewellery-making bead kit | Make bracelets and necklaces | 25 | kid teen crafty fashion
🕯️ | Candle-making kit | Make scented candles at home | 35 | teen adult crafty home cosy
🧼 | Soap-making kit | Make colourful soaps | 30 | kid teen crafty science beauty
🪵 | Wood-carving kit (BeaverCraft) | Whittle spoons and figures | 50 | adult crafty diy outdoors
🧸 | Hama beads mega box | Make pixel art with fuse beads | 25 | kid crafty artsy gamer
🌀 | Kinetic Sand Deluxe set | Squishy sand that never dries | 25 | kid crafty
🧪 | Slime-making kit (Elmer's) | Make glittery, fluffy slime | 25 | kid crafty science funny
🎸 | Fender Player II Stratocaster | A serious upgrade guitar | 800 | adult music collector
🎛️ | Boss Katana Mini amp | A small amp with big sound | 100 | teen adult music
🥁 | Alesis Nitro Max electronic drum kit | Drums with headphones, so neighbours stay happy | 400 | teen adult music
🎹 | Yamaha P-145 digital piano | A real-feel piano that fits anywhere | 500 | teen adult senior music home
🎹 | Novation Launchkey Mini | Make music on a computer | 110 | teen adult music techie
🎶 | Fender Play subscription (12 months) | Video guitar lessons | 90 | teen adult music
🎷 | Yamaha recorder | A simple first instrument | 10 | kid music
🎤 | Singing Machine karaoke system | Karaoke nights with lights | 100 | kid teen adult music party funny
🎧 | Beats Studio Pro | Stylish noise-cancelling headphones | 300 | teen adult music fashion techie
🎧 | Sony WF-1000XM5 earbuds | Tiny earbuds with huge sound | 280 | adult music techie travel
🎧 | Shokz OpenRun Pro 2 | Open-ear headphones for running | 180 | adult music fitness sporty
🔊 | Marshall Emberton III speaker | A retro-styled portable speaker | 170 | teen adult music fashion
💿 | Taylor Swift – The Life of a Showgirl (vinyl) | Her latest album on vinyl | 35 | teen adult music collector
💿 | Vinyl record of their favourite album | A classic for the turntable | 30 | adult senior music collector sentimental
🍳 | Lodge cast iron skillet | A pan that lasts forever | 35 | adult cook practical
🥘 | Instant Pot Duo | Pressure cook, slow cook and more | 100 | adult cook practical
🍝 | Marcato Atlas pasta machine | Fresh pasta at home | 80 | adult cook crafty
🥖 | Sourdough starter kit | Bake real sourdough bread | 40 | adult cook crafty
🌶️ | Hot sauce variety pack (Truff) | Hot sauces for spice lovers | 40 | adult cook funny
🧂 | Salt Block grilling set | Cook on Himalayan salt | 40 | adult cook
📖 | Ottolenghi Simple | Big-flavoured, easy recipes | 30 | adult cook reader
📖 | The Great British Bake Off: Big Book of Baking | Bakes from the show | 25 | adult senior cook sweet reader
🍰 | Nordic Ware bundt pan | Beautiful cakes every time | 40 | adult senior cook sweet
👩‍🍳 | Personalised apron | Their name on a chef's apron | 30 | kid adult senior cook sentimental
🧇 | Dash mini waffle maker | Waffles in minutes | 20 | teen adult cook sweet
🍦 | Ninja CREAMi ice cream maker | Turn anything into ice cream | 200 | teen adult cook sweet techie
☕ | De'Longhi Magnifica Evo bean-to-cup | Fresh espresso at the press of a button | 600 | adult coffee techie home
☕ | Fellow Stagg EKG kettle | A beautiful pour-over kettle | 165 | adult coffee home
☕ | AeroPress Go | Great coffee anywhere | 40 | adult coffee travel
☕ | Trade Coffee subscription (3 months) | Fresh beans every month | 60 | adult coffee
🍵 | Matcha whisk set | Make proper matcha | 35 | teen adult coffee relax
🫖 | Teaforia tea advent calendar | 24 days of tea | 40 | adult senior coffee cosy
🍫 | Hotel Chocolat Advent calendar | A chocolate a day | 35 | kid teen adult sweet
🍫 | Ferrero Rocher tower | A golden tower of chocolates | 30 | teen adult senior sweet party
🍬 | Jelly Belly 50-flavour box | Every flavour of jelly bean | 25 | kid teen adult sweet
🍬 | Harry Potter Bertie Bott's Beans | Including vomit flavour! | 10 | kid teen harrypotter sweet funny
🍭 | Candy Club subscription | A box of sweets every month | 40 | kid teen sweet
🍪 | Hot chocolate bombs set | Melt in milk for a surprise | 25 | kid teen adult sweet cosy
🍯 | Honey tasting gift set | Honeys from around the world | 40 | adult senior sweet cook
🧴 | The Ordinary skincare set | Simple, effective skincare | 40 | teen adult beauty
🧴 | Glossier "You" perfume | A warm, skin-like scent | 70 | teen adult beauty fashion
💄 | Rare Beauty blush set | The blush everyone loves | 40 | teen adult beauty
💅 | Olive & June manicure kit | Salon nails at home | 50 | teen adult beauty
🌸 | Sol de Janeiro body mist trio | Smells like summer | 40 | teen adult beauty
💆 | Foreo Luna 4 | A soft cleansing brush | 220 | adult beauty techie
🛁 | Ritual Advent calendar (Rituals) | Bath and body treats for 24 days | 90 | adult beauty relax
🧖 | Slip silk pillowcase | Kind to hair and skin | 90 | adult senior beauty cosy relax
💨 | Dyson Supersonic hair dryer | A fast, quiet hair dryer | 430 | teen adult beauty techie
💈 | Philips OneBlade trimmer | Trim and shave in one | 50 | teen adult beauty practical
🪒 | Harry's shaving gift set | A smooth shave | 30 | adult beauty practical
🧥 | Patagonia Better Sweater fleece | A warm, cosy classic | 140 | adult fashion outdoors cosy
🧥 | Carhartt beanie | The warm hat everyone wears | 20 | teen adult fashion outdoors
👟 | New Balance 550 trainers | A trendy court sneaker | 110 | teen adult fashion
👟 | Crocs Classic Clogs + Jibbitz | Comfy clogs with fun charms | 60 | kid teen fashion funny
👟 | Nike Pegasus 41 running shoes | Comfy running shoes | 140 | adult fitness sporty
👕 | Champion reverse-weave hoodie | A classic, cosy hoodie | 65 | teen adult fashion cosy
👜 | Coach crossbody bag | A stylish everyday bag | 250 | adult fashion
👜 | Longchamp Le Pliage tote | The foldable bag that goes everywhere | 150 | adult fashion travel practical
🕶️ | Ray-Ban Wayfarer sunglasses | The timeless sunglasses | 170 | teen adult fashion travel
💍 | Mejuri gold hoop earrings | Simple, everyday jewellery | 70 | teen adult fashion
💎 | Tiffany Return to Tiffany heart tag necklace | A classic, special necklace | 350 | adult fashion sentimental
⌚ | Garmin Forerunner 165 | A running watch with GPS | 250 | adult fitness sporty techie
⌚ | Timex Weekender watch | Simple and stylish | 60 | adult senior fashion practical
🧦 | Happy Socks gift box | Colourful, fun socks | 40 | teen adult fashion funny
🧤 | Touchscreen gloves | Warm hands and phone use | 20 | teen adult senior practical cosy
🧸 | Squishmallow 24-inch Cam the Cat | A giant cuddly pillow pal | 45 | kid teen cosy animals collector
🧸 | Gund Pusheen plush | The internet's favourite cat | 25 | kid teen cosy animals funny
🧸 | Steiff classic teddy bear | A teddy to keep forever | 120 | kid senior cosy sentimental collector
🛌 | Electric heated throw (Sunbeam) | Warm and cosy on the sofa | 60 | adult senior cosy home relax
🛌 | Kids' glow-in-the-dark star projector | Stars on the ceiling at bedtime | 30 | kid cosy science
🕯️ | Diptyque Baies candle | A luxury candle | 75 | adult cosy home beauty
🥿 | Parade-style fuzzy slides | Fluffy slippers | 30 | teen cosy fashion
☕ | Personalised mug with a family photo | Their family on their morning mug | 20 | adult senior sentimental coffee photo
🏮 | Himalayan salt lamp | A warm, calming glow | 30 | adult senior home relax
🧳 | Samsonite carry-on spinner | A sturdy cabin case | 200 | adult senior travel practical
🧳 | Bellroy travel organiser | Keeps passports and cables tidy | 60 | adult travel practical
🧳 | Packing cubes set | Neat suitcases | 25 | adult travel practical
🛫 | Cabeau Evolution S3 neck pillow | Sleep on planes | 40 | adult senior travel relax
📍 | Apple AirTag 4-pack | Never lose their bags or keys | 100 | adult senior travel techie practical
🌍 | Lonely Planet: Ultimate Travel List | 500 places to see | 30 | adult senior travel reader
🗺️ | Personalised world map with pins | Pin every trip | 60 | adult travel home sentimental
📷 | Kodak Ektar H35 film camera | Fun, retro film photos | 50 | teen adult photo artsy
📷 | Fujifilm X100VI | The dream travel camera | 1600 | adult photo travel techie collector
📷 | Polaroid Now+ Gen 2 | Classic instant photos | 150 | teen adult photo artsy party
📷 | Kidizoom Duo camera | A tough camera for kids | 60 | kid photo techie
🖼️ | Instax Mini Link 3 phone printer | Print phone photos instantly | 100 | teen adult photo techie party
📸 | DJI Osmo Mobile 7 gimbal | Steady phone videos | 90 | teen adult photo techie
🔭 | National Geographic kids' microscope | Explore tiny worlds | 60 | kid science
🪐 | Solar system planetarium projector | Planets on the ceiling | 40 | kid science cosy
🦕 | Dig-your-own dinosaur fossil kit | Excavate real-looking fossils | 20 | kid science funny animals
🧲 | Snap Circuits Jr. | Build working electronics | 40 | kid teen science building techie
🧑‍🔬 | KiwiCo Crate subscription (3 months) | A science project every month | 90 | kid teen science crafty building
🧪 | Thames & Kosmos chemistry set | Real chemistry experiments | 70 | kid teen science
🖥️ | Raspberry Pi 5 starter kit | Build their own computer projects | 120 | teen adult science techie diy
🖨️ | Bambu Lab A1 Mini 3D printer | Print almost anything | 250 | teen adult techie crafty diy science
🌍 | Ocean Stem Kit (Brainstorm) | Explore the deep sea | 30 | kid science animals
🚗 | Hot Wheels Monster Trucks Arena | Smash-up monster truck action | 60 | kid cars funny
🚗 | Maisto 1:18 die-cast classic car | A detailed model car | 40 | adult senior cars collector
🚗 | Garmin dash cam | Records every drive | 150 | adult cars techie practical
🚗 | Car phone mount (MagSafe) | Phone safely on the dashboard | 30 | adult cars practical techie
🏎️ | Karting session | Race friends on a real track | 60 | kid teen adult cars experience sporty party
🛞 | Portable tyre inflator (Ryobi) | Pump up tyres anywhere | 60 | adult cars diy practical
🏍️ | Motorcycle riding gloves | Warm, protective gloves | 50 | adult cars outdoors
🔧 | Bosch laser measure | Measures rooms in a click | 60 | adult diy practical techie
🔧 | Leatherman Wave+ multitool | 18 tools in their pocket | 120 | adult diy outdoors practical
🧰 | Ryobi 18V starter kit | Drill and impact driver | 150 | adult diy home practical
🪚 | Workbench (Keter folding) | A sturdy, foldable workbench | 120 | adult diy
🏠 | Nest Learning Thermostat | A smart, energy-saving thermostat | 280 | adult techie home practical
🤖 | iRobot Roomba Combo | Vacuums and mops by itself | 300 | adult senior techie home practical
💡 | Nanoleaf Shapes hexagon lights | Glowing wall art | 200 | teen adult techie home gamer
🔋 | Anker 3-in-1 charging station | Charges phone, watch and earbuds | 100 | adult techie practical
⌨️ | Apple Magic Keyboard | A sleek keyboard | 100 | adult techie practical
📱 | iPad Mini | A small, powerful tablet | 500 | teen adult senior techie reader
📱 | Amazon Fire HD 10 Kids | A tough kids' tablet with a case | 190 | kid techie gamer reader
📺 | Roku Streaming Stick 4K | Easy streaming on any TV | 50 | adult senior techie movies
📺 | Samsung The Frame TV (43-inch) | A TV that looks like art | 1000 | adult techie home artsy movies
🎬 | Criterion Collection box set | Classic films in beautiful editions | 150 | adult movies collector
🎬 | Studio Ghibli Blu-ray collection | Miyazaki's magical films | 120 | kid teen adult movies artsy collector
🍿 | Movie night hamper | Popcorn, sweets and a film | 40 | kid teen adult senior movies sweet cosy
🎬 | Max (HBO) subscription (3 months) | The best series to binge | 50 | adult movies
🧩 | Wentworth wooden puzzle | Beautiful, tricky wooden pieces | 50 | adult senior puzzles collector
🧩 | Galison "Christmas village" 1000-piece puzzle | Festive puzzling | 20 | adult senior puzzles cosy
🧩 | Puzzle mat roll-up | Keep the puzzle safe between sessions | 25 | adult senior puzzles practical
🧩 | ThinkFun Rush Hour | The classic traffic jam logic game | 25 | kid teen puzzles cars
🧩 | Cryptex puzzle box | Hide a gift inside a code lock | 30 | teen adult puzzles funny
🧩 | Unlock! Escape room card game | Escape room at the table | 30 | teen adult puzzles boardgames
📔 | Big book of crosswords (NYT) | Months of crosswords | 15 | adult senior puzzles reader
🎲 | Azul | A beautiful tile-placing game | 40 | teen adult senior boardgames puzzles artsy
🎲 | Carcassonne | Build a medieval landscape | 35 | kid teen adult senior boardgames
🎲 | Pandemic | Work together to save the world | 40 | teen adult boardgames puzzles science
🎲 | Splendor | A quick gem-trading game | 40 | teen adult boardgames collector
🎲 | Cards Against Humanity | The rude party game | 30 | adult boardgames funny party
🎲 | Taboo | The classic guessing party game | 25 | kid teen adult senior boardgames party funny
🎲 | Scrabble deluxe edition | A rotating Scrabble board | 60 | adult senior boardgames puzzles
🎲 | Chess set (wooden, weighted pieces) | A beautiful chess set | 60 | kid teen adult senior boardgames puzzles
🎲 | Hues and Cues | A colourful party guessing game | 25 | kid teen adult boardgames party artsy
🎲 | Dobble (Spot It!) | Fast, fun matching game | 12 | kid teen adult boardgames party
🎲 | Mysterium | Solve a ghostly murder together | 50 | teen adult boardgames puzzles
🎲 | Jenga Giant | A huge garden Jenga | 100 | kid teen adult boardgames party outdoors
🎯 | Dartboard cabinet set (Winmau) | Pub darts at home | 80 | adult boardgames party sporty
🍷 | Coravin Pivot wine preserver | Pour a glass without opening the bottle | 100 | adult drinks techie
🍷 | Wine tasting experience | A vineyard tour with tastings | 120 | adult drinks experience travel
🍸 | Aperol Spritz gift set | The summer cocktail kit | 40 | adult drinks party
🥃 | Glencairn whisky glasses | The glass whisky lovers use | 30 | adult drinks
🍺 | Homebrew beer kit | Brew their own beer | 60 | adult drinks crafty diy
🍹 | Mocktail making kit | Fancy alcohol-free drinks | 35 | teen adult drinks party
🥂 | Moët & Chandon Impérial | Classic champagne | 55 | adult senior drinks party
⚽ | Kwik Goal pop-up goals | Football in the garden | 50 | kid sporty outdoors
⚽ | Football skills rebounder net | Practise passing alone | 60 | kid teen sporty outdoors
🏈 | Wilson NFL football | The official ball | 35 | kid teen adult sporty outdoors
🏀 | Mini basketball hoop for the door | Hoops in the bedroom | 30 | kid teen sporty funny
🏓 | Ping pong table (foldable) | Garage table tennis | 300 | kid teen adult sporty party
🏸 | Badminton garden set | Fun for summer in the garden | 40 | kid teen adult sporty outdoors party
⛳ | Golf putting mat | Practise putting indoors | 40 | adult senior sporty
⛳ | Garmin Approach S44 golf watch | Distances to every green | 300 | adult senior sporty techie
🥊 | Boxing gloves and pads set | Workout and fun | 60 | teen adult sporty fitness
🛼 | Impala roller skates | Retro roller skates | 100 | kid teen sporty fashion outdoors
⛸️ | Ice skating session | A festive skate together | 25 | kid teen adult experience sporty
🏂 | Burton snowboard lesson | Learn to snowboard | 100 | teen adult sporty experience outdoors
⛷️ | Ski goggles (Oakley) | Clear views on the slopes | 150 | teen adult sporty outdoors travel
🏋️ | Peloton app membership (12 months) | Classes at home | 160 | adult fitness
🏋️ | Resistance bands set | A full workout anywhere | 25 | adult fitness practical travel
🏋️ | Kettlebell (adjustable) | One kettlebell, many weights | 100 | adult fitness home
🧘 | Manduka yoga block and strap set | Help with every stretch | 40 | adult fitness relax
🚴 | Wahoo KICKR Snap bike trainer | Ride indoors all winter | 400 | adult fitness sporty techie
🥤 | BlenderBottle protein shaker set | For gym smoothies | 15 | teen adult fitness practical
🔥 | Hydro Flask 32oz bottle | Cold all day | 45 | teen adult fitness outdoors practical
⛺ | Hammock (ENO DoubleNest) | Relax between two trees | 70 | teen adult outdoors relax travel
🎒 | Osprey hiking daypack | Comfy pack for day hikes | 120 | adult outdoors travel
🔥 | Jetboil Flash camping stove | Boils water in minutes | 120 | adult outdoors cook
🧭 | Kids' explorer kit (binoculars, compass) | Adventures in the garden | 25 | kid outdoors science animals
🔭 | Celestron Nature binoculars | Birdwatching and views | 120 | adult senior outdoors animals
🌲 | National park annual pass | A year of parks | 80 | adult senior outdoors travel experience
🏕️ | Glamping weekend voucher | Camping in comfort | 300 | adult outdoors travel experience relax
🌿 | Gardening tool set with bag | Everything for the garden | 50 | adult senior garden practical
🌷 | Bulb gift box (tulips and daffodils) | Plant now, bloom in spring | 30 | adult senior garden
🌱 | Seed starter kit with grow light | Start plants early | 50 | adult garden techie
🪴 | Self-watering herb planter | Fresh herbs on the windowsill | 40 | adult senior garden cook
🌸 | Bonsai tree (real juniper) | A living tree to care for | 50 | adult senior garden relax
🦔 | Hedgehog house | A cosy home for garden wildlife | 40 | adult senior garden animals
🐝 | Bee and bug hotel | Help pollinators | 25 | kid adult garden animals science
🐶 | Kong dog toy bundle | Toys that last | 30 | adult pets
🐶 | Personalised dog collar | With their dog's name | 30 | adult pets sentimental
🐶 | Orthopaedic dog bed | Comfy rest for their dog | 100 | adult senior pets home
🐱 | Petcube interactive laser toy | Play with the cat from anywhere | 100 | adult pets techie
🐱 | Cat DNA test (Basepaws) | Find out their cat's breed | 130 | adult pets science
🐾 | Embark dog DNA test | Find out their dog's breed | 130 | adult pets science
🐠 | Fish tank starter kit | A first aquarium | 80 | kid teen pets animals
🐴 | Horse riding lesson | Ride a horse for a day | 70 | kid teen adult animals experience outdoors
🐧 | Penguin experience at the aquarium | Meet penguins up close | 120 | kid teen adult animals experience
🦒 | Schleich animal figure set | Realistic wild animals | 40 | kid animals collector
🦖 | Jurassic World Roaring T-Rex | A big roaring dinosaur toy | 50 | kid animals funny movies
🎟️ | Taylor Swift / pop concert merch hoodie | Merch from their favourite artist | 70 | teen adult music fashion
🎢 | Theme park tickets (Six Flags / Universal) | A day of rollercoasters | 150 | kid teen adult experience party
🧁 | Cupcake decorating class | Bake and decorate | 50 | kid teen adult cook sweet experience
🎨 | Pottery wheel class | Make their own mug | 80 | teen adult crafty artsy experience relax
🚁 | Helicopter tour | See the city from above | 300 | adult senior experience travel
🛶 | Kayaking trip | A day on the water | 70 | teen adult outdoors sporty experience
🎤 | Stand-up comedy tickets | A night of laughs | 60 | adult funny experience party
🍽️ | Restaurant gift card (their favourite) | A dinner out on you | 100 | adult senior cook experience
💆 | Massage voucher (60 minutes) | An hour of bliss | 100 | adult senior relax experience beauty
🌌 | Planetarium tickets | A trip through the stars | 30 | kid teen adult science experience
🎻 | Orchestra or ballet tickets (The Nutcracker) | A festive night out | 120 | kid adult senior music experience
✉️ | Personalised storybook starring them | They're the hero of the story | 35 | kid reader sentimental
💌 | Letters to open when… set | Notes for every mood | 25 | teen adult sentimental
🎞️ | Custom family video montage | Memories set to music | 60 | senior sentimental movies photo
🧵 | Memory quilt from old t-shirts | A blanket made of memories | 200 | adult senior sentimental cosy
🪞 | Engraved family tree frame | Their family, beautifully framed | 60 | senior sentimental home
💍 | Birthstone necklace | With their birthstone | 50 | teen adult senior fashion sentimental
🦶 | Baby handprint ornament kit | For new grandparents | 20 | senior sentimental crafty
🎄 | Personalised Christmas bauble | Their name on the tree | 15 | kid teen adult senior sentimental home
🤡 | Desk-sized punching bag | Stress relief at the office | 20 | adult funny relax
🐔 | Rubber chicken (with pulley) | Ridiculous and perfect | 10 | kid teen adult funny
🥔 | Mr. Potato Head (classic) | The silly classic | 15 | kid funny
🎅 | Inflatable Santa suit | Be the life of the party | 40 | adult funny party
🍕 | Pizza socks in a pizza box | Socks that look like pizza | 15 | kid teen adult funny cosy
🦆 | Duck-shaped LED night light | Squeeze to turn it on | 20 | kid teen funny home cosy
🧻 | "Toilet golf" game | Golf on the go | 15 | adult funny sporty
🎤 | Whoopee cushion and gag gift box | Classic pranks | 15 | kid funny
`;
// Families of similar products: "emoji | name with {} | why | price | traits | product; product; …".
// Each product becomes its own gift, so the elf can name the exact one.
const FAMILIES_TEXT = `
🏈 | {} jersey (NFL) | Wear their team's colours on game day | 130 | kid teen adult sporty fashion | Kansas City Chiefs; Philadelphia Eagles; Dallas Cowboys; San Francisco 49ers; Buffalo Bills; Baltimore Ravens; Detroit Lions; Green Bay Packers; Pittsburgh Steelers; New England Patriots; New York Giants; New York Jets; Miami Dolphins; Chicago Bears; Cincinnati Bengals; Cleveland Browns; Denver Broncos; Las Vegas Raiders; Los Angeles Chargers; Los Angeles Rams; Seattle Seahawks; Minnesota Vikings; Houston Texans; Indianapolis Colts; Jacksonville Jaguars; Tennessee Titans; Atlanta Falcons; Carolina Panthers; New Orleans Saints; Tampa Bay Buccaneers; Arizona Cardinals; Washington Commanders
🏀 | {} jersey (NBA) | Rep their team courtside or on the couch | 120 | kid teen adult sporty fashion | Boston Celtics; Los Angeles Lakers; Golden State Warriors; Denver Nuggets; Oklahoma City Thunder; Milwaukee Bucks; Miami Heat; New York Knicks; Dallas Mavericks; Phoenix Suns; Philadelphia 76ers; Chicago Bulls; Cleveland Cavaliers; Minnesota Timberwolves; San Antonio Spurs; Indiana Pacers; Orlando Magic; Sacramento Kings; Memphis Grizzlies; New Orleans Pelicans; Houston Rockets; Atlanta Hawks; Brooklyn Nets; Toronto Raptors; LA Clippers; Detroit Pistons; Charlotte Hornets; Portland Trail Blazers; Utah Jazz; Washington Wizards
⚽ | {} home shirt 25/26 | The new season's shirt of their club | 95 | kid teen adult sporty fashion | Arsenal; Manchester City; Liverpool; Manchester United; Chelsea; Tottenham Hotspur; Newcastle United; Aston Villa; Real Madrid; FC Barcelona; Bayern Munich; Paris Saint-Germain; Inter Miami; Juventus; AC Milan; Inter Milan; Borussia Dortmund; Celtic; LA Galaxy; USMNT
⚾ | {} New Era 59FIFTY cap | The official on-field cap | 45 | kid teen adult senior sporty fashion | New York Yankees; Los Angeles Dodgers; Boston Red Sox; Chicago Cubs; Atlanta Braves; Houston Astros; San Francisco Giants; Philadelphia Phillies; New York Mets; St. Louis Cardinals; Seattle Mariners; Texas Rangers; Toronto Blue Jays; San Diego Padres; Baltimore Orioles; Detroit Tigers; Cleveland Guardians; Minnesota Twins; Chicago White Sox; Milwaukee Brewers; Arizona Diamondbacks; Tampa Bay Rays; Kansas City Royals; Cincinnati Reds; Pittsburgh Pirates; Miami Marlins; Colorado Rockies; Los Angeles Angels; Washington Nationals; Athletics
🧸 | Funko Pop! {} | A big-headed vinyl figure for their shelf | 15 | kid teen adult collector funny | Baby Yoda (Grogu); Darth Vader; Spider-Man; Iron Man; Deadpool; Wolverine; Harry Potter; Hermione Granger; Hedwig; Stitch; Mickey Mouse; Elsa; Pikachu; Mario; Link; Sonic; Goku; Naruto; Luffy; Wednesday Addams; Eleven (Stranger Things); Jack Skellington; Shrek; Minion Bob; Homer Simpson; SpongeBob; Bluey; Taylor Swift; Michael Jordan; Patrick Mahomes; Batman; Superman; Wonder Woman; The Joker; Barbie; Ken; Ted Lasso; Chandler Bing; Michael Scott; Walter White
🧸 | Squishmallow: {} | The squishy plush everyone collects | 25 | kid teen cosy collector animals | Cam the Cat; Wendy the Frog; Malcolm the Mushroom; Archie the Axolotl; Fifi the Fox; Maui the Pineapple; Winston the Owl; Hans the Hedgehog; Lola the Unicorn; Connor the Cow; Danny the Dinosaur; Kevin the Cat; Tally the Tiger; Belana the Bat; Gordon the Shark
⚡ | {} Pokémon plush (12-inch) | Their favourite Pokémon to cuddle | 25 | kid teen pokemon cosy collector | Eevee; Charmander; Bulbasaur; Squirtle; Gengar; Jigglypuff; Mewtwo; Lucario; Sprigatito; Fuecoco; Quaxly; Psyduck; Mew; Umbreon; Sylveon
🍄 | {} (Switch) | A great Nintendo Switch game | 55 | kid teen adult gamer nintendo | Super Mario 3D World + Bowser's Fury; Mario Kart Live: Home Circuit; Paper Mario: The Thousand-Year Door; Princess Peach: Showtime!; Yoshi's Crafted World; Kirby Star Allies; Xenoblade Chronicles 3; Bayonetta 3; Metroid Dread; Mario + Rabbids Sparks of Hope; Captain Toad: Treasure Tracker; WarioWare: Move It!; Pokémon Let's Go Pikachu; Pokémon Brilliant Diamond; New Pokémon Snap; Mario Strikers: Battle League; Mario Tennis Aces; Mario Golf: Super Rush; Everybody 1-2-Switch!; The Legend of Zelda: Link's Awakening
🎮 | {} (PS5) | A must-play PlayStation 5 game | 60 | teen adult gamer playstation | Final Fantasy VII Rebirth; Final Fantasy XVI; Demon's Souls; Returnal; Death Stranding 2; Gran Turismo 7 Spec II; Stellar Blade; Rise of the Ronin; Uncharted: Legacy of Thieves Collection; Ghost of Tsushima Director's Cut; Helldivers 2; Marvel's Wolverine; Sackboy Party Pack; Ratchet & Clank Collection; Destiny 2: The Final Shape
🕹️ | {} | A big multi-platform game | 60 | teen adult gamer playstation xbox | Assassin's Creed Shadows; Cyberpunk 2077 Ultimate; Red Dead Redemption 2; Grand Theft Auto V; Starfield; Diablo IV; Monster Hunter Wilds; Resident Evil 4; Street Fighter 6; Mortal Kombat 1; Battlefield 6; Kingdom Come: Deliverance II; Black Myth: Wukong; Lies of P; Alan Wake 2
🎮 | {} | A family-friendly game on every console | 40 | kid teen gamer nintendo playstation xbox | LEGO Fortnite Odyssey; LEGO Marvel Super Heroes 2; LEGO Jurassic World; LEGO Harry Potter Collection; Sonic Superstars; Crash Bandicoot 4; Spyro Reignited Trilogy; PAW Patrol World; Bluey: The Videogame; Disney Speedstorm; Hot Wheels Unleashed 2; Plants vs. Zombies: Battle for Neighborville; It Takes Two; Unpacking; Moving Out 2
🧱 | LEGO Star Wars {} | A Star Wars ship or scene in LEGO | 90 | kid teen adult starwars building collector | X-Wing Starfighter (75355); Republic Gunship (75309); Razor Crest (75331); Mos Espa Podrace Diorama; Death Star Trench Run Diorama; Boba Fett's Starship (75312); Imperial Star Destroyer (75394); R2-D2 (75379)
🧱 | LEGO Marvel {} | Superheroes in brick form | 80 | kid teen adult marvel building collector | Hulkbuster (76210); Iron Man Helmet (76165); Spider-Man Final Battle (76261); Guardians' Ship (76193); Black Panther (76215); Avengers Quinjet (76248)
🧱 | LEGO Harry Potter {} | A wizarding world set | 80 | kid teen adult harrypotter building collector | Hogwarts Chamber of Secrets (76389); The Burrow (76437); Gringotts Wizarding Bank (76417); Hogwarts Icons Collectors' Edition; Hagrid's Hut (76428)
🧱 | LEGO Disney {} | A Disney story to build | 70 | kid teen adult disney building | Moana's Wayfinding Boat; The Little Mermaid Royal Clamshell; Beauty and the Beast Castle (43263); Encanto Mini House; Pixar Lightning McQueen; Walt Disney Tribute Camera
🧱 | LEGO Technic {} | Real engineering with moving parts | 200 | teen adult cars building collector | Bugatti Bolide; Ferrari Daytona SP3 (42143); Porsche 911 GT3 RS (42056); Liebherr Crawler Crane; Land Rover Defender (42110); Mercedes-AMG F1 W14
🧱 | LEGO {} | A beautiful set for the shelf | 100 | adult senior building home collector | Icons Wildflower Bouquet; Botanicals Orchid; Icons Tranquil Garden; Icons Back to the Future Time Machine; Icons Concorde; Ideas The Office; Ideas Friends Central Perk; Architecture Paris; Architecture New York City; Ideas Vincent van Gogh Starry Night
🧱 | LEGO {} | A fun set for young builders | 50 | kid building | City Fire Station; City Space Base; Friends Heartlake City School; Creator 3in1 Dinosaur; Creator 3in1 Space Shuttle; DREAMZzz Crocodile Car; Ninjago Dragon; Minecraft The Mushroom House; Jurassic World T. rex Breakout; Sonic Speed Sphere Challenge
📚 | {} (book) | A gripping read they won't put down | 20 | teen adult reader | Fourth Wing; Iron Flame; The Silent Patient; Gone Girl; Where the Crawdads Sing; Lessons in Chemistry; Tomorrow and Tomorrow and Tomorrow; Lessons by Ian McEwan; The Hunger Games: Sunrise on the Reaping; Remarkably Bright Creatures; It Ends with Us; The Housemaid; Verity; Dune; The Martian; The Name of the Wind; Mistborn; The Way of Kings; Six of Crows; The Song of Achilles; Circe; Babel; The Covenant of Water; Demon Copperhead; The Women by Kristin Hannah; James by Percival Everett; Educated; Becoming by Michelle Obama; Born a Crime; The Body by Bill Bryson; The Seven Moons of Maali Almeida; Yellowface; Intermezzo; The God of the Woods; Funny Story by Emily Henry; Happy Place by Emily Henry; Iron Gold; Red Rising; Shogun; The Pillars of the Earth
📚 | {} | A children's book they'll love | 12 | kid reader | The Gruffalo; Where the Wild Things Are; Matilda; Charlie and the Chocolate Factory; The BFG; Wonder; Harry Potter and the Philosopher's Stone; The Lion the Witch and the Wardrobe; Charlotte's Web; Goodnight Moon; Pete the Cat; Elephant & Piggie; Captain Underpants; The Bad Guys; Amulet; Dragon Masters; Magic Tree House; Nevermoor; Diary of a Minecraft Zombie; Cat Kid Comic Club
💿 | {} on vinyl | A classic album for their record player | 30 | teen adult senior music collector | Fleetwood Mac – Rumours; The Beatles – Abbey Road; Pink Floyd – The Dark Side of the Moon; Michael Jackson – Thriller; Queen – Greatest Hits; Taylor Swift – 1989; Billie Eilish – Hit Me Hard and Soft; Sabrina Carpenter – Short n' Sweet; Olivia Rodrigo – Guts; Adele – 30; Harry Styles – Harry's House; Arctic Monkeys – AM; Nirvana – Nevermind; Amy Winehouse – Back to Black; Kendrick Lamar – GNX; SZA – SOS; Elton John – Diamonds; ABBA – Gold; Frank Sinatra – Christmas Songs; Bob Marley – Legend; Oasis – (What's the Story) Morning Glory?; Daft Punk – Random Access Memories; Fleetwood Mac – Tusk; The Weeknd – After Hours; Chappell Roan – The Rise and Fall of a Midwest Princess
🌸 | {} perfume | A signature scent | 110 | adult beauty fashion | Chanel No. 5; Chanel Coco Mademoiselle; Dior Sauvage; Dior J'adore; YSL Libre; Lancôme La Vie Est Belle; Tom Ford Black Orchid; Le Labo Santal 33; Maison Margiela Replica Lazy Sunday Morning; Bleu de Chanel; Acqua di Giò; Viktor & Rolf Flowerbomb; Marc Jacobs Daisy; Paco Rabanne 1 Million; Byredo Gypsy Water
🕯️ | Yankee Candle {} (large jar) | A cosy scent for their home | 30 | adult senior cosy home | Balsam & Cedar; Sparkling Cinnamon; Christmas Cookie; Snow in Love; Clean Cotton; Pink Sands; Vanilla Cupcake; Midsummer's Night; Black Cherry; Home Sweet Home
☕ | {} | A treat for coffee and tea lovers | 30 | adult senior coffee | Stumptown Hair Bender beans; Lavazza Super Crema beans; Death Wish Coffee; Starbucks Christmas Blend; Illy Classico tin; Intelligentsia Black Cat espresso; Harney & Sons Hot Cinnamon Spice tin; Twinings Christmas tea selection; Fortnum & Mason Royal Blend; Mariage Frères Marco Polo; Pukka herbal tea collection; David's Tea advent calendar; Yorkshire Tea gift tin; Ippodo matcha; Teavana-style chai kit
🍫 | {} | A sweet treat in a gift box | 30 | kid teen adult senior sweet | Godiva Goldmark assortment; Lindt Swiss Luxury Selection; Ghirardelli Peppermint Bark; See's Candies assortment; Ferrero Collection 24-piece; Toblerone giant bar; Reese's Christmas trees pack; Neuhaus Belgian chocolates; Teuscher champagne truffles; Milka advent calendar; Cadbury Heroes tub; Kinder advent calendar; Hershey's Kisses Christmas tin; Russell Stover Christmas box; Vosges Haut-Chocolat bars
🍷 | {} | A bottle for a special occasion | 45 | adult senior drinks party | Whispering Angel rosé; Cloudy Bay Sauvignon Blanc; Caymus Cabernet Sauvignon; Meiomi Pinot Noir; Laurent-Perrier Rosé; Taittinger Brut; Bollinger Special Cuvée; Aperol and Prosecco set; Hendrick's Gin; Monkey 47 Gin; Glenfiddich 12; Lagavulin 16; Buffalo Trace Bourbon; Woodford Reserve; Maker's Mark; Don Julio 1942; Casamigos Reposado; Baileys Original; Grey Goose Vodka; Diplomático Reserva Rum
📖 | {} (cookbook) | Recipes they'll cook again and again | 30 | adult cook reader | Ottolenghi Comfort; Nigella: Cook, Eat, Repeat; Jamie Oliver: 5 Ingredients; Joshua Weissman: Texture Over Taste; Smitten Kitchen Keepers; Half Baked Harvest Every Day; The Food Lab by Kenji López-Alt; Mary Berry's Baking Bible; Dishoom; Pinch of Nom; Bavel; Salt Fat Acid Heat (gift edition); Magnolia Table; Mob Kitchen; Claire Saffitz: Dessert Person
👟 | {} | Trainers they'll wear everywhere | 120 | teen adult fashion | Nike Air Max 90; Nike Dunk Low Panda; Nike Air Jordan 1 Mid; Nike Cortez; Adidas Gazelle; Adidas Stan Smith; Adidas Superstar; New Balance 9060; New Balance 2002R; Asics Gel-1130; Converse Chuck 70; Vans Old Skool; On Cloud 6; Hoka Clifton 9; Salomon XT-6; Puma Speedcat; Veja Campo; Birkenstock Boston clogs; Dr. Martens 1460 boots; Timberland 6-inch boots
🚗 | {} (1:24 die-cast model) | A detailed car for their collection | 35 | teen adult senior cars collector | Ford Mustang 1967; Chevrolet Corvette Stingray; Porsche 911 Turbo; Lamborghini Countach; Ferrari F40; Toyota Supra MK4; Nissan Skyline GT-R R34; Volkswagen Beetle; Jeep Wrangler; Tesla Cybertruck
🧩 | Ravensburger {} (1000 pieces) | A relaxing puzzle for cosy afternoons | 25 | adult senior puzzles relax cosy | Disney Christmas Eve; Starry Night; Harry Potter Hogwarts; Christmas Cottage; Star Wars Mandalorian; World Map; Cosy Cats; Venice at Night; National Parks; Marvel Comics
🎭 | Tickets to {} | An unforgettable night at a show | 150 | teen adult senior experience music | Hamilton; Wicked; The Lion King; Les Misérables; Moulin Rouge!; MJ The Musical; Six; Hadestown; Harry Potter and the Cursed Child; Aladdin; The Phantom of the Opera; Mamma Mia!
🎬 | {} (4K Blu-ray steelbook) | A favourite film in a collector's case | 30 | teen adult movies collector | Dune: Part Two; Oppenheimer; Barbie; Top Gun: Maverick; The Lord of the Rings trilogy; Jurassic Park; Back to the Future; Interstellar; The Dark Knight; Spider-Man: Across the Spider-Verse; Inside Out 2; Wicked; Avatar: The Way of Water; Gladiator II; Home Alone
🌿 | {} houseplant | A living gift that brightens their home | 40 | adult senior garden home | Fiddle leaf fig; Snake plant; Pothos; Peace lily; Bird of paradise; ZZ plant; Orchid (Phalaenopsis); Christmas cactus; Olive tree; Poinsettia
🎟️ | {} experience | A day they'll remember | 100 | teen adult experience | Axe-throwing; Indoor skydiving; Ziplining; Paintball; Trampoline park; Go-karting Grand Prix; Bowling and arcade; Surf lesson; Scuba try-dive; Ice climbing; Rock-climbing course; VR arcade; Dog-sledding; Whale-watching; Sunset sailing
🧒 | {} | A top toy this Christmas | 50 | kid | Barbie Dreamhouse; Bluey's Ultimate Playhouse; PAW Patrol Lookout Tower; Hatchimals Alive; LOL Surprise OMG doll; Magna-Tiles 32-piece set; Nerf Elite 2.0 blaster; Play-Doh Kitchen Creations; Gabby's Dollhouse playset; Tonies Toniebox starter set; Yoto Mini audio player; Little Tikes cozy coupe; VTech KidiZoom Smartwatch; Melissa & Doug wooden kitchen; Hot Wheels Mega Loop track; Barbie Dream Camper; Peppa Pig family house; Furby; Bitzee digital pet; Tamagotchi Uni; Air Hogs Supernova; Paw Patrol ride-on; Calico Critters cottage; Spidey and Friends HQ; Monster Jam Grave Digger; Squishmallows Mystery Squad; Lite-Brite; Etch A Sketch classic; Paw Patrol Rescue Wheels; Fisher-Price Little People Farm; Crayola Scribble Scrubbie Pets; Shopkins Real Littles; Ty Beanie Boos 3-pack; Pinkfong Baby Shark plush; Duplo Peppa Pig Bath Time
`;

const FAMILY_LINES = FAMILIES_TEXT.trim().split("\n").flatMap(line => {
  const [emoji, name, why, price, traits, products] = line.split("|").map(s => s.trim());
  return products.split(";").map(p => [emoji, name.replace("{}", p.trim()), why, price, traits].join(" | "));
});

const GIFTS = GIFTS_TEXT.trim().split("\n").concat(FAMILY_LINES).map(line => {
  const [emoji, name, why, price, traits] = line.split("|").map(s => s.trim());
  return { emoji, name, why, price: +price, traits: new Set(traits.split(/\s+/)) };
});
