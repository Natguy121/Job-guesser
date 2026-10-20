# Gift Elf

A Christmas gift finder that plays like Akinator. Set your budget with the slider, think of the person you're shopping for, choose how many questions (5 to 30, 16 by default), answer them about them (Yes / Probably / Don't know / Probably not / No), and the elf picks a specific present (like *Mario Kart 8 Deluxe* or a *Kindle Paperwhite*) with its rough price, plus five more ideas. Open `index.html` in any browser. It needs no install or build step.

## How it works

- **1,250 real products** (`gifts.js`), each with a rough US price: named video games for Switch, PlayStation and Xbox, specific LEGO sets, every NFL, NBA and MLB team's jersey or cap, named books, vinyl albums, perfumes, Broadway shows, Funko Pops, Pokémon plushes, board games, experiences and more. Each lists the traits it suits (age, console, fandom, interests like outdoors, sweet tooth, cosy nights in).
- **Two sliders** on the start screen: budget ($10 to no limit; gifts over budget are never suggested) and number of questions (5 to 30).
- **1,462 questions, no two alike**: 48 direct ones about the person ("Do they love being outdoors?"), 164 clue questions, which are different facts that hint at a trait ("Do they leave out cookies for Santa?" points to a child; "Do they have a toolbox?" to DIY), and 1,250 gift questions, one per gift ("Do they cheer for the Dallas Cowboys?", "Do they make fresh pasta?").
- **Akinator-style guessing** (`gift-engine.js`). Every gift starts equally likely. Each answer makes gifts that fit it more likely and the rest less likely (never to zero, so one slip isn't fatal). "Don't know" changes nothing. Clues count less than direct questions, and separately for Yes and No: a Yes to "cookies for Santa?" all but says "child", but a No says little. A gift question is a clue too: a Yes to "Do they make fresh pasta?" lifts the pasta machine a lot, and lifts other cooking gifts for grown-ups a little.
- **Best questions first, and different every game.** Every question is scored by its expected information gain: how much it should narrow down the gifts. The elf picks at random among the questions nearly as good as the best (within 15%), and never repeats a question from an earlier game while an unseen one is left (seen questions are remembered in your browser; once nearly all the direct and clue questions are used up, they come back). At most 2 questions per topic per game, and after a "No" it never asks what it would have asked after a "Yes".
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
| 5 | 46% | 1% | 5% |
| 10 | 72% | 5% | 13% |
| 16 | 81% | 9% | 22% |
| 30 | 87% | 15% | 35% |

\*The top pick suits the person's age, runs on a console they own (for games) and matches at least one of their real interests (a telescope for a space-mad kid counts, even if the shopper was picturing a science kit).

## Editing

Add a gift as one line in `GIFTS_TEXT` in `gifts.js`: `emoji | product | why it's a good pick | price in $ | traits`. Traits are the keys of `TRAITS` at the top of the same file; list the ages it suits (`kid teen adult senior`), or none for all ages, and for games the consoles it runs on (`nintendo playstation xbox`). Groups of similar products (team jerseys, books, albums) live in `FAMILIES_TEXT`: one line with a `{}` name pattern and a `;`-separated list of products.

## The job guessing game

The earlier job guessing game (guesses your job from 74,128 jobs) is in [`job-game/`](job-game/). Open `job-game/index.html` to play it.
