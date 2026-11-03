# GJ 581g: mistakes log (read before every production session)

Each line: what went wrong, why, and the guard now in place. Newest first. Add a line whenever Sam flags a problem or a build fails for a new reason.

## 2 Nov 2026: "Your Raise Is Lying to You" pilot (v1 -> v4)

### Voice
| # | Mistake | Root cause | Guard |
|---|---|---|---|
| 1 | Clone "way too soothing, like talking to a child" (v2) | Picked the calmest recording (101 wpm) as reference without testing | Saved profile `voice_sample/sam_voice_v1` is the only reference; a new reference is chosen by cloning a passage Sam also recorded and scoring each candidate against his real reading (`ref_test.py` method) |
| 2 | Still "a bit fake" (v3) | temperature 0.6, breaths stripped (debreath), each line voiced separately so intonation reset | Profile settings exag 0.5 / cfg 0.5 / temp 0.8, breaths kept, `voice_mode: scene` |
| 3 | Clone dropped whole sentences ("And prices? Didn't move…") | Chatterbox stops early on passages of short sentences; no check | Whisper word check on every take, re-roll up to 6 (`clone_scenes.py`) |
| 4 | "base slip", "race", "Babra", "Bob Ross buys" | Clone mispronounces; transcript check passed some at 0.94 | `must` phrases per line; pronunciation list in `profile.json` (payslip, pay raise); meaning-changing slips always re-rolled or respelled |
| 5 | Pause after "Barbara," and inside "Sixty-four percent said Barbara" | Comma pauses kept by the gap squeezer | `tight: true` lines rejected if any pause inside; in-line pauses capped |
| 6 | Voice runs killed mid-way (exit 137) three times | Chatterbox + Whisper in one long process grows until OOM | One process per scene/line; build retries a crashed scene |
| 7 | Own cleanup command killed itself (exit 144) | `pkill -f pattern` matched the shell running it | Kill by PID from `ps | awk '... && !/awk/'`; never pkill a pattern in your own command line |
| 8 | Word check scored a perfect take 0 | Whisper segments are a generator; read twice | `segs = list(segs)` (fixed in clone_scenes/assemble_scenes) |
| 9 | Waits returned early / never ended | Wait loops matched their own command line or a first log line | Wait on a PID (`kill -0`) or an explicit DONE marker |

### Sound
| # | Mistake | Root cause | Guard |
|---|---|---|---|
| 10 | Music "not urgent" (Investigations, 96 bpm), then "way too different from our topic" (Hitman) | Tracks picked from tags/tempo, unheard by Sam | Music only from a sampler Sam hears under the narration; the money-series pilot has no music |
| 11 | 24 sound effects in 61 s | No budget | `pace_lint.py`: max 8 per minute, each tied to an on-screen action |

### Picture
| # | Mistake | Root cause | Guard |
|---|---|---|---|
| 12 | Centred titles and values pushed off cards | Motion `transform` overwrote the alignment transform | `T` composes both transforms (S8 kit) |
| 13 | Captions ran off both edges on a long line | Whole line shown at once | Captions show at most 8 words |
| 14 | Empty or still frames for 4-6 s | No pacing rule | Storyboard `treatment` + `changes`; pace lint fails >6 s without a picture change |
| 15 | Footage murky (dark, blurred end of clip) | Clip played past its sharp part; heavy tint | Pick the sharp segment, slow it down; lighter grade; stamps over footage get a paper background |
| 16 | Numbers landed late | Cues from estimated word times | Cue only on aligned word times after voicing (`timing.json` words) |

### Facts
| # | Mistake | Root cause | Guard |
|---|---|---|---|
| 17 | "Retests got almost the same answers" on screen | Claim written before the replication papers were read | Nothing goes on screen as fact before the independent fact-check passes; pilots avoid strong claims |
| 18 | UK "+3% after prices" stated as plain fact | One deflator (OECD) shown; CPI gives −1.7% | Show both measures when they disagree; say "roughly flat" |
| 19 | Research notes had errors (Stantcheva 4.1% was inflation; WTW figures unverified) | Notes copied second-hand | Research notes are drafts; the fact-check pack is the source of truth |

### Process
| # | Mistake | Root cause | Guard |
|---|---|---|---|
| 20 | Renders wasted on takes that were then redone | Render started before the voice was settled | Build stops at `voice`/`align` for review; render only after every scene passes |
| 21 | An hour of babysitting per build | Ad-hoc commands | `toolkit/build/build.py` one command, resumable |
| 22 | Script changes after voicing are slow | Sam edits best while watching | Workflow: animatic (quick voice) -> lock script -> clip-by-clip clone voice |
| 23 | Skills described a Kokoro animatic mode and a fact-check gate in `build.py` that didn't exist; music level -24 vs -16 LUFS couldn't meet the 12 dB rule; 26 cross-skill clashes in all | Skills rewritten one by one, never read together against the toolkit | `build.py` now has `voice_mode: kokoro`, the `factcheck` gate and `render_scale`; after any skill change an independent reviewer reads all nine skills and the toolkit for clashes |
| 24 | Footage shot blurred late in a scene (animatic v1, closing grocery clip) | OffthreadVideo plays from its Sequence start, not from when the shot appears | Wrap a late `Window` in `<Sequence from={at}>`; check a still at the shot's middle |
| 25 | Animatic render refused: height 720.036 | render_scale 0.6667 is not a whole-pixel scale | build.py snaps the scale to round(1080*s)/1080 |
| 26 | Pace lint failed every change word on the Kokoro animatic | Kokoro timing has no per-word times | pace_lint spreads words over the line by character position |
| 27 | Clip A came out 49 s of 52: the last line was cut | ffmpeg amix ended early; the mux used -shortest | Mix padded to the timeline (apad + atrim); mux without -shortest |
| 28 | Stale frame (UK chart) in clip A's check sheet | Frame files from an older build were reused | The check stage clears build/frames first |
| 29 | "payslip" -> "baselet", "raise" -> "race" passed at word score 0.94 | One wrong word in a long scene still clears the 0.93 threshold | Every line with "raise" must-hears it; question-final "raise" is read as "pay raise" (`say`); reword a word that fails twice |
| 30 | "Barbara's only buys one percent more" far too fast (Sam, clip A) | No pace check; the clone speeds through short sentences in a scene | clone_scenes rejects a take with any 5+-word line over 3.9 spoken words/s (MAXWPS) |
| 31 | "Meet Ann" heard as "At" (Sam, clip A) | A one-syllable name after a short verb blurs in the clone | "This is Ann." with `must` on the name; avoid one-syllable names alone at the start of a scene |
| 32 | Source lines unreadable on the note border (Sam, clip A) | Source text placed inside the engraved border band | Source lines sit below the note (y about 942), above the captions |
| 33 | Clip C ended without "and feelings need a check" (Sam); clips A and B also lost their last words | ffmpeg `loudnorm` drops the last second or so of a stream; the mix then padded silence over it | Voice is padded (`apad=pad_dur=3`) before `loudnorm`, then trimmed to the timeline; check the last line is heard in every clip |
| 34 | Long scenes rushed (4-5 w/s) and were OOM-killed | One 8-12 line passage per generate call | clone_scenes voices parts of <= 4 lines, saves each part, resumes after a kill |
| 35 | Takes rejected for "take away", "pay slip", "1.05", "100" | Whisper writes words and numbers differently from the script | Checker merges word pairs, reads decimals and "a hundred" |
| 36 | "race" for "raise" at the end of a phrase, again | Clone weakness | Write "pay raise" where "raise" ends a phrase (not "Barbara raise") |
| 37 | "second ruler" heard as "second router" in Sam's clone (heckler test) | Clone weakness on "ruler" | Added warn hazard `\brulers?\b` to the profile; add a `must` on "ruler" lines |
| 38 | Heckler takes: "Get there faster" -> "yet they're faster", "Lucky sod" -> "lucky sword" | Short, high-exaggeration lines blur | Voice 4 seeds per short heckler line and keep the first that passes the word check (`tts/heckler/reroll.py`) |
| 39 | Killing a voicing job with `pgrep -f`/`kill` on a pattern ended the shell (exit 144) | The pattern matched the shell's own command line | Stop jobs with TaskStop or by PID from `ps aux | grep "[c]bmood"` (bracket trick) |
