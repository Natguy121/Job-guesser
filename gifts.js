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
`;

const GIFTS = GIFTS_TEXT.trim().split("\n").map(line => {
  const [emoji, name, why, price, traits] = line.split("|").map(s => s.trim());
  return { emoji, name, why, price: +price, traits: new Set(traits.split(/\s+/)) };
});
