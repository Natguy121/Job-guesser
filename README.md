# Future Map

A job guessing game for grown-ups. The player climbs a ladder of 18 quick questions about their work, answering in their own words, without saying their job's name, and the game guesses what they do. Open `index.html` in any browser. It needs no install or build step.

## How it works

1. **18 quick questions, one rung of a ladder each**, in the style of street "guess my job" videos.
   - An optional 2-minute clock. When it runs out, the game guesses with what it has.
   - The first 12 are the same for everyone: quick yes/no questions (uniform? degree? work with your hands? deal with the public?), inside or outside, and quirky ones ("What's in your pockets?", "Give me a word people would only hear at your job", "If your job was a food, what would it be?").
   - The last 6 are follow-ups about the areas the game has found the most clues for, so they change with each player.
   - After each answer the game shows its clues and its current hunch ("My hunch: Nurse. Am I close?").
2. **Reading the answers** (`engine.js`, no internet or AI needed):
   - `words.js` lists clue words for each of 20 areas. Each clue word gives its area a point (at most 2 per answer).
   - "Not", "don't", "hate" and similar words flip the next few words.
   - Words that just repeat the question count half.
   - Yes/no answers nudge areas (a uniform points to safety, health, food…), "Did you need a degree?" favours jobs by training length, and the food question counts only lightly.
   - Training phrases like "nursing school" or "police academy" point straight at a job.
3. **The guess.** Every job gets a score from how well the player's areas fit the job's areas (weighted *Comes first* 3, *Important* 2, *Helps too* 1), plus words that match the job's own description, plus a bonus for job names and training phrases. The game then asks "Is your job…?" and on "No" tries its next guess, up to 10.
4. **587 real jobs** (`jobs.js`). The file also has 42 invented future jobs (like Space Farmer) that are left out of guessing, since nobody has them yet.

In a test with 12 made-up players (nurse, software developer, teacher, accountant, electrician, chef, police officer, vet, truck driver, lawyer, hairdresser, farmer), 10 were guessed first time; the teacher was guessed third (after History Teacher and English Teacher) and the farmer second (after Dairy Farmer).

## Editing

Areas and questions are in `data.js`, jobs are in `jobs.js`, and clue words and job nicknames (like "vet" for Veterinarian) are in `words.js`. A job looks like this:

```js
["Veterinarian", "Takes care of sick and hurt animals", "ani3 hlp3 sci1", 8, "g"]
//  name          description                           topics+importance  years of training  outlook (g/s/c/f)
```
