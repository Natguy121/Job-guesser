# Gift Elf

A Christmas gift finder that plays like Akinator. Think of the person you're shopping for, answer 10 quick questions about them (Yes / Probably / Don't know / Probably not / No), and the elf picks the perfect present, plus five more ideas. Open `index.html` in any browser. It needs no install or build step.

## How it works

- **134 gifts** (`gifts.js`), from LEGO and telescopes to spa days, cookbooks and a personalised letter from Santa. Each gift lists the traits it suits (age, budget, interests like outdoors, gamer, sweet tooth, cosy nights in).
- **42 questions**, one per trait ("Do they love being outdoors?", "Are you happy to spend a lot this year?").
- **Akinator-style guessing** (`gift-engine.js`). Every gift starts equally likely. Each answer makes gifts that fit it more likely and the rest less likely (never to zero, so one slip isn't fatal). "Don't know" changes nothing.
- **Smart questions.** Each question is the one expected to narrow the gifts down the most. Once you say "Yes" to an age, the other age questions are skipped, and a "No" to an age only rules out gifts just for that age.
- **The result** shows the top pick with the reasons it fits, five more ideas, and a "Not quite? Ask me 5 more" button.
- A flat Christmas look: snowfall, a string of baubles that fills in as you answer, a candy-cane "How sure I am" bar, and an elf who reacts to your answers. Keys 1–5 answer, and Back undoes the last answer.

## Accuracy

`tests/measure-gifts.js` makes a pretend person for every gift (one age, the gift's interests, plus a few random extra interests) and answers the questions about them honestly, with some "Probably"s, "Don't know"s and slips.

```
node tests/measure-gifts.js          # 10 questions
node tests/measure-gifts.js --n 15   # after "Ask me 5 more"
```

| Questions | Good pick* | Exact gift | Exact gift in top 5 |
|---|---|---|---|
| 5 | 35% | 7% | 27% |
| 10 | 69% | 32% | 65% |
| 15 | 85% | 50% | 81% |

\*The top pick suits the person's age and at least one of their real interests (a telescope for a space-mad kid counts, even if the shopper was picturing a science kit).

## Editing

Add a gift as one line in `gifts.js`: `emoji | name | why it's a good pick | traits`. Traits are the keys of `TRAITS` at the top of the same file; list the ages it suits (`kid teen adult senior`), or none for all ages.

## The job guessing game

The earlier job guessing game (guesses your job from 74,128 jobs) is in [`job-game/`](job-game/). Open `job-game/index.html` to play it.
