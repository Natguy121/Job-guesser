# Future Map

A job guessing game for kids aged 5 to 18. Open `index.html` in any browser. It needs no install or build step.

## How it works

1. **Age (5–18).** Picked at the start. Age changes the results:
   - A "How much could this change?" meter (younger kids have more room to change).
   - The age and year you could start each job (18 + years of training).
   - Future jobs rank a little higher the further away work is. Jobs that robots and AI are changing rank a little lower.
   - "Things to try now" tips for ages 5–8, 9–12 and 13–18.
   - On the results page, an age slider shows what shifts at other ages.
2. **25 questions, answered in the kid's own words.**
   - The first 15 are the same for everyone ("What do you love doing most in your free time?").
   - The last 10 are follow-ups about the kid's top 4 topics so far ("Because you wrote about Animals…"), so they change with what the kid writes.
   - After each answer the game shows the clues it found, like "🐾 Animals: dog, puppy".
3. **Reading the answers** (`engine.js`, no internet or AI needed):
   - `words.js` lists clue words for each of the 20 topics. Each clue word in an answer gives its topic a point (at most 2 per answer).
   - "Not", "don't", "hate" and similar words flip the next few words, so "I don't like sports" counts against sports.
   - Words that just repeat the question count half.
   - Naming a job ("I want to be a vet") counts strongly on "What do you want to be?" and weakly elsewhere, so "my mom is a nurse" doesn't make the guess Nurse.
4. **The guess.** Every job gets a score from how well the kid's topics fit the job's topics, plus words that match the job's own description, plus a bonus if the kid named it. The top job is the big guess, with the clue words that led to it.
5. **Levels of importance.**
   - The kid's topics are ranked and labelled *Top priority*, *High*, *Medium* or *Low*.
   - Every job lists its topics in order: *Comes first* (3), *Important* (2), *Helps too* (1).
6. **629 jobs** (`jobs.js`), including future jobs such as AI Trainer and Space Farmer. You can search and filter all of them.

Past results are saved in the browser, so kids can play again each year and see how their results changed.

## Editing

Topics, tips and questions are in `data.js`, jobs are in `jobs.js`, and clue words and job nicknames (like "vet" for Veterinarian) are in `words.js`. A job looks like this:

```js
["Veterinarian", "Takes care of sick and hurt animals", "ani3 hlp3 sci1", 8, "g"]
//  name          description                           topics+importance  years of training  outlook (g/s/c/f)
```
