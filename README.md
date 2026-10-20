# Gift Elf

A Christmas gift finder that plays like Akinator. Set your budget with the slider, think of the person you're shopping for, choose how many questions (5 to 30, 16 by default), answer them about them (Yes / Probably / Don't know / Probably not / No), and the elf picks a specific present (like *Mario Kart 8 Deluxe* or a *Kindle Paperwhite*) with its rough price, plus five more ideas. Open `index.html` in any browser. It needs no install or build step.

## How it works

- **1,250 real products** (`gifts.js`), each with a rough US price: named video games for Switch, PlayStation and Xbox, specific LEGO sets, every NFL, NBA and MLB team's jersey or cap, named books, vinyl albums, perfumes, Broadway shows, Funko Pops, Pokémon plushes, board games, experiences and more. Each lists the traits it suits (age, console, fandom, interests like outdoors, sweet tooth, cosy nights in).
- **Two sliders** on the start screen: budget ($10 to no limit; gifts over budget are never suggested) and number of questions (5 to 30).
- **1,298 questions**: 48 broad ones about the person ("Do they love being outdoors?", "Do they have a Nintendo Switch?") plus 1,250 specific ones, one for each gift ("Do they cheer for the Dallas Cowboys?", "Do they make fresh pasta?", "Is Gengar their favourite Pokémon?"). No two are the same question reworded.
- **Akinator-style guessing** (`gift-engine.js`). Every gift starts equally likely. Each answer makes gifts that fit it more likely and the rest less likely (never to zero, so one slip isn't fatal). "Don't know" changes nothing.
- **Different questions every game.** The first 3 questions are broad; after that the elf picks at random between the best 2 broad questions and the best 3 gift questions (about the presents that look likeliest so far). It remembers in your browser which questions you've already seen and doesn't ask them again; once nearly all the broad ones are used up they come back. After a "No", it never asks what it would have asked after a "Yes". A "Yes" to a gift's question also nudges up similar gifts.
- **The result** shows the top pick with the reasons it fits, five more ideas, and a "Not quite? Ask me 5 more" button.
- A flat Christmas look: snowfall, a string of baubles that fills in as you answer, a candy-cane "How sure I am" bar, and an elf who reacts to your answers. Keys 1–5 answer, and Back undoes the last answer.

## Accuracy

`tests/measure-gifts.js` makes a pretend person for 250 gifts spread across the catalogue (one age, a budget the gift fits, a console the game runs on, the gift's interests, plus a few random extra interests) and answers the questions about them honestly, with some "Probably"s, "Don't know"s and slips.

```
node tests/measure-gifts.js          # 16 questions (default)
node tests/measure-gifts.js --n 30   # the most the slider allows
```

| Questions | Good pick* | Exact gift | Exact gift in top 5 |
|---|---|---|---|
| 5 | 35% | 1% | 3% |
| 10 | 53% | 4% | 9% |
| 16 | 66% | 9% | 16% |
| 30 | 77% | 22% | 31% |

\*The top pick suits the person's age, runs on a console they own (for games) and matches at least one of their real interests (a telescope for a space-mad kid counts, even if the shopper was picturing a science kit).

## Editing

Add a gift as one line in `GIFTS_TEXT` in `gifts.js`: `emoji | product | why it's a good pick | price in $ | traits`. Traits are the keys of `TRAITS` at the top of the same file; list the ages it suits (`kid teen adult senior`), or none for all ages, and for games the consoles it runs on (`nintendo playstation xbox`). Groups of similar products (team jerseys, books, albums) live in `FAMILIES_TEXT`: one line with a `{}` name pattern and a `;`-separated list of products.

## The job guessing game

The earlier job guessing game (guesses your job from 74,128 jobs) is in [`job-game/`](job-game/). Open `job-game/index.html` to play it.
