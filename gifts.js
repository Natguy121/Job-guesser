// Gift Elf — the questions and the gift catalogue.

// Each trait is one yes/no question about the person you're shopping for.
// Age traits are special: a gift that lists some ages doesn't suit the others.
const TRAITS = {
  kid:         "Are they a child (under 12)?",
  teen:        "Are they a teenager?",
  adult:       "Are they a grown-up?",
  senior:      "Are they a grandparent, or over 65?",
  cheap:       "Are you looking for something small, like a stocking filler?",
  pricey:      "Are you happy to spend a lot this year?",
  outdoors:    "Do they love being outdoors?",
  sporty:      "Do they play or watch a lot of sport?",
  fitness:     "Are they into fitness or the gym?",
  gamer:       "Do they play video games?",
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

// Each gift: "emoji | name | why it's a good pick | traits it fits"
const GIFTS_TEXT = `
🧱 | LEGO set | Hours of building, from small sets to giant ones | kid teen adult building puzzles
🎮 | A new video game | The game they keep talking about | kid teen adult gamer techie
🕹️ | Retro games console | Hundreds of classic games in one little box | teen adult gamer techie collector pricey
🕹️ | Handheld games console | Games anywhere, even on long car journeys | kid teen gamer techie travel pricey
🎧 | Gaming headset | Clear sound and a mic for playing with friends | teen adult gamer techie music
🪑 | Gaming chair | A comfy throne for long gaming sessions | teen adult gamer home pricey
🪙 | Gift card for their favourite game | New skins, levels or coins they'll love | kid teen gamer cheap
🎧 | Wireless headphones | Great sound for music, travel and calls | teen adult music techie travel pricey
🔊 | Bluetooth speaker | Music anywhere, from the kitchen to the beach | teen adult music techie party
⌚ | Smartwatch | Steps, messages and workouts on their wrist | teen adult techie fitness practical pricey
🔋 | Power bank | Never run out of battery again | teen adult techie travel practical cheap
🚁 | Mini drone | Fly it, film from the sky, show off | kid teen adult techie outdoors photo pricey
🤖 | Coding robot kit | Build a robot, then teach it to move | kid teen science techie building
🔭 | Telescope | Craters on the moon and the rings of Saturn | kid teen adult science outdoors pricey
🧪 | Science experiment kit | Slime, crystals and fizzing reactions | kid science
🦖 | Dinosaur dig kit | Chip away to find real-looking fossils | kid science cheap
⭐ | Name a star | A star with their name on it, with a certificate | teen adult senior science sentimental funny cheap
🎨 | Deluxe art set | Paints, pencils and a sketchbook to fill | kid teen adult artsy
✏️ | Drawing tablet | Draw and design straight on the computer | teen adult artsy techie pricey
🖍️ | Colouring book and pens | Calm, colourful fun | kid adult artsy relax cheap
🧶 | Knitting or crochet starter kit | Everything needed to make a scarf | teen adult senior crafty cosy cheap
🪡 | Sewing machine | Make, mend and customise their own clothes | adult crafty fashion practical pricey
🏺 | Air-dry clay kit | Make pots, figures and little treasures | kid teen adult crafty artsy
💍 | Jewellery-making kit | Beads and charms to make their own bracelets | kid teen crafty fashion
🧸 | Build-your-own teddy | Make a cuddly friend from scratch | kid crafty cosy experience
📚 | The book everyone's talking about | A page-turner for the holidays | teen adult senior reader cheap
📖 | E-reader | Thousands of books in one light device | adult senior reader techie travel pricey
📓 | Beautiful notebook and pen | For lists, ideas and secret plans | teen adult reader practical cheap
📬 | Book subscription box | A surprise new book every month | adult reader experience
😂 | Joke book | Groan-worthy jokes for Christmas dinner | kid reader funny cheap
📔 | Journal | A place for their thoughts and dreams | teen adult reader sentimental relax cheap
🧩 | 1,000-piece jigsaw | A cosy challenge for the holidays | adult senior puzzles cosy cheap
🧠 | Brain teaser puzzle set | Twisty metal puzzles that look impossible | kid teen adult puzzles cheap
🔍 | Large-print puzzle books | Crosswords and word searches that are easy on the eyes | senior puzzles cheap
🎲 | A new board game | Something for family game night | kid teen adult boardgames party
🃏 | Party card game | Big laughs with friends | teen adult boardgames party funny cheap
♟️ | Handsome chess set | A classic that looks good on the table | adult senior boardgames puzzles
🔐 | Escape room in a box | Solve the clues before time runs out | teen adult puzzles boardgames party
🗝️ | Escape room experience | Locked in a room with friends, against the clock | teen adult puzzles party experience
⚽ | A new ball for their sport | Football, basketball or rugby, ready to play | kid teen sporty outdoors cheap
👕 | Their team's new shirt | Show off who they support | kid teen adult sporty fashion
🎟️ | Tickets to see their team | A day out at a real match | teen adult sporty experience pricey
🏋️ | Home workout set | Bands and dumbbells for training at home | adult fitness practical
🧘 | Yoga mat and blocks | Stretch, breathe and unwind | adult fitness relax
👟 | Running shoes | Comfy, fast and ready for the new year | teen adult fitness sporty outdoors practical pricey
💧 | Insulated water bottle | Keeps drinks cold all day | teen adult fitness outdoors practical cheap
🥤 | Smoothie blender | Healthy drinks in seconds | adult fitness cook practical
🚲 | A new bike | Freedom on two wheels | kid teen adult outdoors sporty pricey
🛹 | Skateboard or scooter | Tricks and speed around the park | kid teen outdoors sporty
🛝 | Trampoline | Endless bouncing in the garden | kid outdoors sporty pricey
🛷 | Sledge | Ready for the first snow day | kid outdoors cheap
🏕️ | Camping hammock | Relax between two trees anywhere | teen adult outdoors travel relax
🔦 | Head torch | For walks, camping and power cuts | adult outdoors practical cheap
🥾 | Hiking socks and beanie | Warm feet and ears on winter walks | adult outdoors practical cosy cheap
🎣 | Fishing kit | A peaceful day by the water | adult senior outdoors relax
🧤 | Heated gloves | Toasty hands on cold days | adult senior outdoors practical
🌱 | Grow-your-own herb kit | Fresh basil and mint on the windowsill | adult senior garden cook cheap
🪴 | A houseplant in a nice pot | A bit of green that's easy to love | teen adult garden home cheap
🧑‍🌾 | Gardening tools set | Good gloves and tools for the garden | adult senior garden practical
🐦 | Bird feeder | Watch the birds visit all winter | adult senior garden animals cheap
🌳 | Plant a tree in their name | A gift that helps the planet | adult senior garden sentimental experience cheap
🍳 | Chef's knife or cast-iron pan | A kitchen tool they'll use every day | adult cook practical pricey
📕 | Cookbook from a famous chef | New recipes to try | adult cook reader
🧁 | Baking set | Tins, piping bags and sprinkles | kid teen adult cook sweet
🍪 | Cookie-decorating kit | Ice and decorate Christmas cookies | kid cook sweet crafty cheap
🌶️ | Hot sauce collection | From mild to "why did I do this" | adult cook funny cheap
👩‍🍳 | A cooking class | Learn to make something amazing | adult cook experience
🍫 | Luxury chocolate box | Fancy chocolates to share, or not | teen adult senior sweet cheap
🍬 | Giant sweet hamper | All their favourite sweets in one box | kid teen sweet funny
🍫 | Chocolate-making class | Make, temper and taste chocolate | adult sweet cook experience
☕ | Coffee machine | Café-quality coffee at home | adult coffee techie pricey
🫖 | Tea sampler box | Teas from around the world | adult senior coffee cosy cheap
☕ | Funny mug | Their morning coffee, with a laugh | teen adult coffee funny cheap
🍷 | Wine tasting set | Try and compare a few special bottles | adult drinks party pricey
🍸 | Cocktail-making kit | Shaker, recipes and everything to mix with | adult drinks party
🍺 | Craft beer selection | Unusual beers from small breweries | adult drinks cheap
🧦 | Funny Christmas socks | Silly socks for Christmas Day | kid teen adult senior funny cosy cheap
🧸 | Cuddly teddy bear | A soft friend for bedtime | kid cosy sentimental cheap
🛋️ | Fluffy blanket | For sofa, films and hot chocolate | teen adult senior cosy home
🥿 | Cosy slippers | Warm feet all winter | adult senior cosy practical cheap
🕯️ | Scented candle set | The house smells like Christmas | adult cosy home relax cheap
🛁 | Bath and spa set | Bath bombs, salts and bubbles | teen adult senior beauty relax
🧴 | Skincare set | A little pampering every day | teen adult beauty relax
💄 | Makeup palette | New colours to play with | teen adult beauty fashion
🪞 | Light-up makeup mirror | Perfect light for getting ready | teen adult beauty
🧼 | Handmade soap set | Lovely smells, beautifully wrapped | adult senior beauty relax cheap
💆 | Spa day voucher | A whole day of being looked after | adult beauty relax experience pricey
💇 | Hair styling tool | Curls or waves without the hassle | teen adult beauty fashion pricey
👜 | A stylish bag | Something they'll carry every day | adult fashion pricey
🧣 | Cashmere scarf | Soft, warm and classic | adult senior fashion cosy pricey
⌚ | Classic watch | Timeless, and something to keep | adult fashion sentimental pricey
🧢 | Hoodie from their favourite brand | The one they've been hinting about | teen fashion
💎 | Personalised necklace | Their initial or a special date | teen adult fashion sentimental
🖼️ | Family photo book | Favourite memories in one book | adult senior sentimental photo home
🖼️ | Digital photo frame | New family photos sent straight to it | senior sentimental techie photo
📅 | Personalised family calendar | A year of family photos on the wall | senior sentimental practical photo cheap
📷 | Instant camera | Print photos straight away | teen adult photo party
📸 | Camera lens or tripod | For sharper, better photos | adult photo techie pricey
🗺️ | Scratch-off world map | Scratch off every country they visit | teen adult travel home
🧳 | Travel bag and packing cubes | Packing made easy | adult travel practical
✈️ | Weekend getaway | A short trip somewhere new | adult travel experience pricey
🎢 | Theme park day out | Rollercoasters and fun all day | kid teen experience pricey
🍽️ | Restaurant voucher | A meal out somewhere special | adult senior cook experience
🎭 | Theatre or concert tickets | A night out to remember | teen adult senior music experience pricey
🎤 | Karaoke microphone | Sing along at full volume | kid teen music party funny
🎸 | Beginner guitar or ukulele | Start playing their first songs | kid teen adult music
🎹 | Keyboard piano | Learn songs with light-up keys | kid teen music pricey
💿 | Record player and a vinyl | Their favourite album, the old-school way | adult music collector home pricey
🎬 | Streaming gift card | Months of films and shows | teen adult movies cosy
🍿 | Movie night box | Popcorn, sweets and a film to watch | teen adult movies cosy sweet cheap
📽️ | Mini projector | A big screen on any wall | teen adult movies techie party pricey
🦸 | Collectible figure from their favourite film | For the shelf of a true fan | teen adult movies collector
🐶 | Pet toy and treats bundle | Spoil their furry friend | pets animals cheap
🐾 | Custom pet portrait | A painting of their pet | adult pets sentimental artsy
🐕 | Cosy pet bed | The best spot in the house for their pet | adult pets home
🦁 | Adopt an animal | Support a wild animal, with updates and a cuddly toy | kid adult senior animals sentimental experience cheap
🐴 | Horse riding lesson | A first ride, or a fun day out | kid teen animals outdoors experience
🦒 | Zoo experience day | Meet the animals up close | kid teen animals experience
🔧 | Toolkit | The right tool for every job | adult diy practical
🪛 | Cordless drill | Shelves, flat-pack and fixes made easy | adult diy practical pricey
🏠 | Smart speaker | Music, timers and answers by voice | teen adult techie home
💡 | Colour-changing LED lights | Turn their room any colour | teen techie home
🚗 | Car cleaning kit | Make their car shine | adult cars practical cheap
🏎️ | Race car driving experience | Drive a real race car on a track | adult cars experience pricey
🏁 | Remote control car | Fast, fun and great to race | kid teen cars techie
🪙 | Coin or stamp collecting album | Start or grow their collection | adult senior collector
🎁 | Mystery gift box | Nobody knows what's inside, not even them | kid teen funny party cheap
🪄 | Magic tricks set | Amaze the family after Christmas dinner | kid funny party
🪀 | Fidget toy pack | Pop, spin and squish | kid funny cheap
✉️ | Personalised letter from Santa | A letter from the North Pole, with their name | kid sentimental funny cheap
🎒 | A new backpack | Ready for school or adventures | kid teen practical travel
⏰ | Sunrise alarm clock | Wakes them up gently with light | adult practical techie relax
🧘 | Meditation app subscription | A few calm minutes every day | adult relax experience
🎨 | Paint-and-sip class | Painting with a drink and friends | adult artsy party drinks experience
`;

const GIFTS = GIFTS_TEXT.trim().split("\n").map(line => {
  const [emoji, name, why, traits] = line.split("|").map(s => s.trim());
  return { emoji, name, why, traits: new Set(traits.split(/\s+/)) };
});
