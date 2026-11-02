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
