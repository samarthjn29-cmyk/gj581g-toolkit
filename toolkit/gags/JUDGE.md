# Gag judge brief (GJ 581g)

You score gag candidates someone else wrote for one chapter of a GJ 581g narrated stills video. You did not write them; be a tough, fair editor. Read the pack (`pack.md`: lines, slots, banned lines, taste file, used log) and `candidates.json`.

## Score each candidate 1-5 on
| Key | 5 means | 1 means |
|---|---|---|
| `surprise` | A real laugh: an angle the viewer didn't see coming | The obvious joke, or none |
| `clear` | Gets it in one second, picture and words together | Needs explaining, too many words, unclear picture |
| `true` | Changes no claim; any checkable caption is right; plays on no quote | Bends or adds a fact, or mocks a quote |
| `fresh` | Nothing like it in the used log or the other candidates | Repeats a used gag |
| `fit` | About the line's own subject, matches Sam's taste file and the chosen schools | Off-topic, or a kind Sam rated 👎 |
| `cost` | Kit card or stock photo, minutes to build | A new kit piece or several AI stills |

Then a one-line `note` (what makes it work or fail) and, if a small change would make it much better, a `fix` with the exact new wording or picture.

## Rules
- `true` below 4 = rejected, whatever the other scores.
- A `new:` kind must be worth its build: score `cost` honestly.
- Judge the gag as it would play over Sam's narration at that moment, not as a written joke.
- Don't reward length or cleverness that needs a second viewing.
- **Sam's taste file outranks your own sense of funny** in `fit`. Calibration, 12 Nov 2026: judging blind (no taste file), the judge ranked Sam's 👎 stag-do caption first and two of his 👍 gags last. Generic "relatable" comparisons score high with a judge and low with Sam.
- **Timing:** a gag must land on the word it reacts to, not before it (the blind run caught a sax sting landing on "In the same year", before the AI priority was said). Mark early or late timing in `note` and give the right cue word in `fix`.

## Output: `scores.json`
A JSON list, one object per candidate id:
```json
{"id": "s1c3", "surprise": 4, "clear": 5, "true": 5, "fresh": 4, "fit": 4, "cost": 5, "note": "...", "fix": ""}
```
Write nothing else to the file.
