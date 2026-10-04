# Future Map

A job guessing game for grown-ups. The player climbs a ladder of 20 easy questions about their work, answering in their own words, without saying their job's name, and the game guesses what they do. Open `index.html` in any browser. It needs no install or build step.

## How it works

1. **20 short, plain questions, one rung of a ladder each.** Anyone in any job can answer them, wherever they are.
   - Relaxed by default, with soft lights, gentle transitions and no clock. There's an optional 3-minute challenge; when it runs out, the game guesses with what it has.
   - The first 12 are the same for everyone: where you work, what you wear, how you got the job, what you do most of the day, who you work with, your tools, the best and hardest parts, your boss, a word people at your job use, what people ask you, and one big clue.
   - The last 8 are follow-ups ("What do you build or fix?", "How does money come into your job?"). Each one is picked because it best splits the game's current top guesses.
2. **50 hidden areas.** The game sorts clues into 50 areas (doctors, nurses, dentists, police, fire, military, coding, IT support, and so on), but never shows them. The player only sees a **heat meter** (Ice cold → Chilly → Warmer → Hot → On fire! → I think I know!) that rises with the amount of evidence and how far the best guess is ahead, plus a host-style reaction after each answer.
3. **Reading the answers** (`engine.js`, no internet or AI needed):
   - `words.js` lists clue words for each area. Each clue word gives its area a point (at most 2 per answer).
   - "Not", "don't", "hate" and similar words flip the next few words.
   - "How did you get your job?" favours jobs by training length ("university" vs "apprenticeship"), and "Where do you work?" nudges inside or outside work.
   - The "Who's your boss?" answer hints at your field but can't name your job (so "the principal" doesn't make a teacher a principal).
   - Training phrases like "nursing school" or "police academy" point straight at a job.
   - Mentioning a sport ("basketball", "puck", "wicket"…) moves that sport's jobs up and other sports' jobs down.
   - Each area counts as fully confirmed after a few clues, so a strong side clue (rules for an umpire, coaching for a coach) can tell similar jobs apart.
4. **The guess.** Every job gets a score from how well the player's areas fit the job's areas (weighted 3/2/1), words that match the job's own description, and job names or training phrases. Common jobs get a small boost, because a random player is far more likely to be a nurse than a primatologist. After a drumroll the game asks "Is it…?" and on "No" tries its next guess, up to 10. Confetti when it's right.
5. **1,089 real jobs** (`jobs.js`), from nurses and plumbers to parkour athletes and ice sculptors. Basketball, football, American football, baseball, ice hockey, cricket, rugby, tennis, golf, boxing, volleyball, athletics and motorsport each have players, coaches, scouts, owners, agents, referees or umpires, commentators and managers. The file also has 42 invented future jobs (like Space Farmer) that are left out of guessing.

## Accuracy

`tests/` has pretend workers and a script that plays them through the game:

```
node tests/measure.js                    # 40 workers the tags were tuned on
node tests/measure.js workers-unseen-2   # 15 workers written after tuning
node tests/measure.js workers-new-jobs   # 5 workers with newer jobs (football manager, parkour…)
node tests/measure.js workers-simple     # 15 workers answering the current questions
node tests/measure.js workers-sports     # 8 sports workers (coaches, owners, umpires…)
node tests/measure.js workers -v         # list the misses
```

On the 15 workers answering the current questions: first guess 80%, top 3 100%. On the 8 sports workers: right sport every time, first guess 50%, top 3 100% (coach vs general manager vs owner is the usual mix-up). The older test sets were written for earlier versions of the questions, so they score lower now. More jobs means more lookalikes to choose between, so a few close calls (Guitarist vs Musician, Football Scout vs Football Manager) still go the wrong way first. These are made-up answers, so real players will trip it up more often.

## Editing

Questions are in `data.js`, jobs are in `jobs.js`, and the 50 areas' clue words and job nicknames (like "vet" for Veterinarian) are in `words.js`. A job looks like this:

```js
["Veterinarian", "Takes care of sick and hurt animals", "pets3 doc3 wild1", 8, "g"]
//  name          description                           areas+importance   years of training  outlook (g/s/c/f)
```
