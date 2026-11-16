## Run 3: 16 Nov 2026 (21 channels, 579 videos, 10 studied in depth)

**Peers:** unchanged from 9 Nov (Emergence leads; 13 idea-lane explainers; 5 money; 2 craft). No channel qualified to add or retire. This is the first run with growth for the idea-lane channels (two readings, 7 days apart).

### What's working
1. **Emergence retitled five of its weaker videos this week. The two winners kept their titles and are still growing.** (Measured: the ledger shows the same video IDs under new titles.)
   - "The Flaw at the Heart of AI" became "The 180-Year-Old Argument That Terrifies AI" (now 1.13x).
   - "The Flaw Inside Neuralink (How 64 Threads Read a Mind)" became "85% of His Neuralink Disconnected. Then This Happened" (0.58x).
   - "The Experiment That Planted a Fake Memory" became "How Scientists Wrote a Memory Into a Brain" (2.07x).
   - "You're Hallucinating Right Now" became "Your Eyes Don't See Reality"; "The 35 to 1 Lottery You Never Chose" became "The One Question AI Won't Answer With Science". "How AI Solved The Wrong Game" became "Why You Can't Stop (It's Not Pleasure)".
   - **The direction of the changes:** away from vague "the flaw" titles and toward a concrete fact: a number ("85%", "180-Year-Old"), a person, or a plain claim the viewer can argue with.
   - **The effect isn't measurable yet.** We have one reading after the change. The renamed videos gained 90-330 views a day, and the memory video gained the most (+2.3k in 7 days). Re-check on 23 Nov.
   - The winners: *The Dark Knowledge of AI* went from 279k to 375k (+14k a day, now 83x its median), and *Is It Just a Fancy Dictionary...* went from 71k to 92k. Both are 30 days old and still compounding.
2. **Emergence's new uploads haven't broken out.** Its last six videos sit at 0.27-1.13x. Its two newest run 19-24 min ("30 Days From Going Out Of Business", "AI Told Strangers What Kind of Person They Were"). Same craft, same cadence (12 in 90 days, 2-3 a week). The breakouts came from two topic and title combinations, not from the volume of uploads. This supports PW-08 and PW-13.
3. **Art lane: the real painting is the thumbnail.** *Great Art Explained: The Last Supper* is at 1.0M (**5.1x**, 36 min). Its thumbnail is the whole painting with the series wordmark, no face or arrow. The comments thank it for covering the arts, which "history channels" skip (898 likes), and one man watches so he can talk with his art-teacher wife (1.4k). Fits our stills format, where real public-domain pictures come first.
4. **Viewers are listening for AI voices, not only looking for AI images.** On the same video: "Thank you for not using a stupid AI voice over... no emphasis, no emotion" (192 likes). Last week it was the "not AI slop" comment on TED-Ed (2.0k). Our narration is an ElevenLabs voice made from Sam's own recordings, so the risk is real: viewers judge a voice by its emphasis and emotion.
5. **The "I noticed this as a child and nobody understood" shape:** minutephysics' *The Magnetic Shadow Effect* is at 2.0M (**4.0x**, 6 min). Its top comments are thanks for naming an everyday thing they had noticed: 14k likes ("baffled me at 15... I am 27 now"), 9.2k, 5.7k, and 1.4k ("I feel so vindicated"). The idea comes from ordinary experience, and the payoff is a name and a clear mechanism. (Inferred: that this is why it spread.)
6. **News plus a moral stake is this week's fastest climber in the idea lanes:**
   - Kurzgesagt's *AI Just Crossed the Terrifying Line - Now What?* grows by about 143k a day (4.4x). Its top comments are wry worry ("You know it's bad when the video doesn't have a 'but don't worry' part", 18k likes).
   - Pursuit of Wonder's new *A Human Brain Was Put on a Computer, and It's Suffering* reached 2.1x in its first week.
   - How Money Works' *Why China's AI Bubble Popped... And Ours Hasn't* reached 2.5x.
   - The same shape as Emergence's breakout: a current event plus a question about what's right.
7. **Mind and time ideas get personal comments.** On Aperture's *theory of time that proves your past self still exists* (4.1x), nearly all of the top 7 comments are personal memories ("the happiest day of my life", "one day as me as a ten-year-old"). Its chapters are named as turns ("The River is Wrong", "Block Universe", "Why We See It Wrong"), not as topics. Aperture's thumbnails are 2-3 word lines over glowing figures ("ALL AT ONCE").
8. **Title patterns over 579 videos:**
   - "What if" titles: 1.49x (9 videos, steady for three runs).
   - "Explained": 1.21x; "why": 1.17x.
   - Number titles: 0.91x across the set, even though Emergence is moving toward numbers.
   - A Plato counter-example: minutephysics' *Plato Got Vision Totally Wrong* is at 0.68x (one video, a weak lead). A "famous thinker was wrong" frame on Plato didn't carry a big channel. Worth knowing for the Cave pilot's packaging.

### Suggestions (for Sam to approve by ID)
| ID | Suggestion | Evidence | Where it goes |
|---|---|---|---|
| **PW-14** | **Title check on day 7.** If an upload is under half our median after 7 days (or loses its Test & Compare), retitle it toward one concrete fact from the video: a number, a date or age, a named person, or a claim people can argue with. Never toward a vaguer phrase. Log the old title, the new title and the views a day before and after in the 28-day review. Ours differs: the fact comes from our own story and fact-check. | Point 1 (Emergence renamed 5 videos this week, all toward a concrete hook; effect still unmeasured, re-check 23 Nov) | Packaging skill (post-upload rule); producer 28-day review |
| **PW-15** | **Teach peer_watch.py to flag retitles and thumbnail swaps**, by comparing each ID's title with the last run and hashing the thumbnail, so we can measure whether the changes worked. | Point 1 (found by hand this week) | Toolkit `peerwatch/` (small code change, needs Sam's OK) |
| **PW-16** | **Score an art-lane idea where one public-domain painting is the hero object.** The thumbnail is a tight crop of one detail from the real painting, plus 2-4 of our own words. Fits the stills format (real pictures first) and the scout's af Klint bold bet. Ours differs from Great Art Explained: one idea taught through the painting's true stories, not a full survey of one work, and a crop of a detail, not the whole painting with a series wordmark. | Point 3 (5.1x, 1.0M; comments ask for the arts) | `claude/IDEAS.md` via the scout; packaging thumbnail rules |
| **PW-17** | **A voice test before each upload.** Play the ElevenLabs narration of the hook and one emotional beat to someone who doesn't know how it was made, and ask "human or AI?". Fix flat emphasis with the emotion tags or by re-recording the line. **Sam to decide:** whether to say in the description that the narration is his own voice made with ElevenLabs. The voice comments suggest honesty is rewarded. | Point 4 (192-like "not an AI voice over" comment; 2.0k "not AI slop" last week) | gj581g-voice (post-render voice audit); packaging (description line); Sam's decision |
| **PW-18** | **Add a "you've noticed this, here's its name" idea to the board for scoring:** an everyday experience of mind or perception (for example, why a word stops sounding real when you repeat it, or why walking through a door makes you forget), taught through 2-3 true experiments, with the name as the payoff. Use the comments' "I felt vindicated" doubt as the cold open. | Point 5 (4.0x; 14k- and 9.2k-like comments) | `claude/IDEAS.md` via the scout |
| **PW-19** | **One news-plus-moral-question idea in the mind and technology lane:** "Can something grown in a lab feel?", taught through true stories (for example the neurons in a dish that learned to play Pong in 2022, and the UK's 2021 review that led to octopuses being recognised as sentient). Every claim is a lead until our fact-check passes it. Ours differs from Pursuit of Wonder: true stories per chapter and both sides named, not a speculative essay. | Point 6 (Kurzgesagt 143k a day, Pursuit of Wonder 2.1x in its first week, How Money Works 2.5x) | `claude/IDEAS.md` via the scout |
| **PW-20** | **Name chapters as turns in the argument, not topics** (for example "The River is Wrong", not "Theories of Time"), and end on a question that invites a personal memory. This adds to PW-10. | Point 7 | Packaging skill (chapters) |

### Watchlist notes
- **Re-check on 23 Nov:** the views a day of Emergence's five renamed videos (does renaming lift a video that has stalled?).
- **Emergence:** 7k subscribers (5.8k last week). Its median dropped to about 4k as new uploads land low.
- **Still silent for 90 days:** Philosophy Vibe, Domain of Science, OverSimplified, Explains 101. OverSimplified's older Punic War part 3 still grows about 143k a day with no new upload. Keep them all until May 2027.
- **Econ sketch:** its new what-if dollar video has 23 views at upload. Its debt hit has slowed to about 150 a day.

### Limits of this run
- **No descriptions this run.** The learn cards' description field came back empty for every video (and so did the chapters, except Aperture's), so this run says nothing about sources lines. Check `peer_watch.py`'s description parser before the next run.
- **No transcripts or frames.** Nothing here about camera moves, light, words a minute or the music bed is measured.
- **The effect of the renames is inferred.** We have one reading after them.
- **Thumbnails only for the 10 learn cards.** Emergence's renamed videos may also have changed thumbnails (not checked).
- **Outlier scores depend on the channel's median.** Small medians (Emergence, Econ sketch) make big multiples.
