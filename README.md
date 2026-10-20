# Gift Elf

A Christmas gift finder that plays like Akinator. Set your budget with the slider, think of the person you're shopping for, answer 10 quick questions about them (Yes / Probably / Don't know / Probably not / No), and the elf picks a specific present (like *Mario Kart 8 Deluxe* or a *Kindle Paperwhite*) with its rough price, plus five more ideas. Open `index.html` in any browser. It needs no install or build step.

## How it works

- **279 real products** (`gifts.js`), each with a rough US price: named video games for Switch, PlayStation and Xbox, specific LEGO sets, Pokémon cards, headphones, cookbooks, board games, experiences and more. Each lists the traits it suits (age, console, fandom, interests like outdoors, sweet tooth, cosy nights in).
- **A budget slider** on the start screen ($10 to no limit). Gifts over budget are never suggested.
- **48 questions**, one per trait ("Do they love being outdoors?", "Do they have a Nintendo Switch?", "Are they a Star Wars fan?").
- **Akinator-style guessing** (`gift-engine.js`). Every gift starts equally likely. Each answer makes gifts that fit it more likely and the rest less likely (never to zero, so one slip isn't fatal). "Don't know" changes nothing.
- **Smart questions.** Each question is the one expected to narrow the gifts down the most. Once you say "Yes" to an age, the other age questions are skipped. A "No" to an age or console only rules out gifts just for that one, so a game on every console survives "No" to Xbox.
- **The result** shows the top pick with the reasons it fits, five more ideas, and a "Not quite? Ask me 5 more" button.
- A flat Christmas look: snowfall, a string of baubles that fills in as you answer, a candy-cane "How sure I am" bar, and an elf who reacts to your answers. Keys 1–5 answer, and Back undoes the last answer.

## Accuracy

`tests/measure-gifts.js` makes a pretend person for every gift (one age, a budget the gift fits, a console the game runs on, the gift's interests, plus a few random extra interests) and answers the questions about them honestly, with some "Probably"s, "Don't know"s and slips.

```
node tests/measure-gifts.js          # 10 questions
node tests/measure-gifts.js --n 15   # after "Ask me 5 more"
```

| Questions | Good pick* | Exact gift | Exact gift in top 5 |
|---|---|---|---|
| 5 | 45% | 5% | 18% |
| 10 | 69% | 20% | 42% |
| 15 | 72% | 30% | 61% |

\*The top pick suits the person's age, runs on a console they own (for games) and matches at least one of their real interests (a telescope for a space-mad kid counts, even if the shopper was picturing a science kit).

## Editing

Add a gift as one line in `gifts.js`: `emoji | product | why it's a good pick | price in $ | traits`. Traits are the keys of `TRAITS` at the top of the same file; list the ages it suits (`kid teen adult senior`), or none for all ages, and for games the consoles it runs on (`nintendo playstation xbox`).

## The job guessing game

The earlier job guessing game (guesses your job from 74,128 jobs) is in [`job-game/`](job-game/). Open `job-game/index.html` to play it.
