# Future Map

A 20-question job guesser for kids aged 5 to 18. Open `index.html` in any browser. It needs no install or build step.

## How it works

1. **Age (5–18).** Picked at the start. Age changes the results:
   - A "How much could this change?" meter (younger kids have more room to change).
   - The age and year you could start each job (18 + years of training).
   - Future jobs rank a little higher the further away work is. Jobs that robots and AI are changing rank a little lower.
   - "Things to try now" tips for ages 5–8, 9–12 and 13–18.
   - On the results page, an age slider shows what shifts at other ages.
2. **20 questions.** Each answer adds 1 point to one of 10 topics. Each topic appears 8 times, so every topic can score 0–8.
3. **10 topics:** Science & Discovery, Technology & Computers, Building & Fixing, Art & Design, Performing & Media, Helping & Health, Nature & Animals, Sports & Action, Business & Money, Words & Teaching.
4. **Levels of importance.**
   - Your topics are ranked and labelled *Top priority*, *High*, *Medium* or *Low*.
   - Every job lists its topics in order: *Comes first* (3), *Important* (2), *Helps too* (1).
   - A job's match adds up your topic points weighted by that importance.
5. **200+ jobs.** They include future jobs such as AI Trainer and Space Farmer. You can search and filter all of them.

Past results are saved in the browser, so kids can retake the survey each year and see how their results changed.

## Editing

All questions, topics, tips and jobs are in `data.js`. A job looks like this:

```js
["Veterinarian", "Takes care of sick and hurt animals", "nat3 hlp2 sci2", 8, "g"]
//  name          description                           topics+importance  years of training  outlook (g/s/c/f)
```
