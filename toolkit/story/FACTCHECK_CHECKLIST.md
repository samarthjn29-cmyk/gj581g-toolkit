# Fact-check checklist (GJ 581g)

Built 3 Nov 2026 from what video 2's four check rounds caught. The checker is a separate agent that did not write the script. It applies every item to every row it is given, and returns `line | verdict | evidence (source, figure, URL) | exact replacement`.

Verdicts:
- **OK**
- **no claim**: a joke or a line with no fact in it.
- **FIX**: give the exact replacement wording.
- **OVERSTATED**
- **WRONG**

## Pass 1: each claim (source check)
1. **Primary source.** The figure comes from the agency, central bank, ministry, statistics office or paper itself. A news story, Wikipedia or a summary is a lead, not a source; quote the primary page with its date. If the primary source can't be reached, say so and name the best secondary.
2. **Exact match.** Recompute every number from the saved data with code (`data/`, `calc.py`), never by hand. That includes rounding ("about", "almost", "more than") and derived figures (ratios, percent changes, conversions).
3. **Scope.** The country, period, measure and population match the source:
   - "net" vs "gross"
   - "goods" vs "goods and services"
   - "emerging economies" vs "all countries"
   - a study window that ends years before "the last twenty years"
4. **Freshness.** Is there newer data than the source's date? Did a "record", "weakest" or "highest" get beaten since? Is "last financial year" or "this October" right on today's date?
5. **Hedge strength.** The wording is no stronger than the evidence ("tends to", "early signs", "roughly"). A "preliminary" finding is never stated as settled.
6. **Listener test.** Read it aloud once. Could it be heard wrong?
   - "rose two and a third times" can sound like +233%; say "grew to about two and a third times".
   - "since December" leaves the year unclear.
   - "fifty-four" can be heard as "forty-four".

   If so, reword.
7. **On-screen notes.** Every number, label and source tag in the scene's on-screen note matches the spoken line and the source. Label illustrative figures ILLUSTRATIVE, with how they compare to the real average.
8. **Fair framing.** Name only real people for what they publicly said or did. Never call a projection or estimate a fact. Where two measures disagree, say so.

## Pass 2: the whole script (story logic)
Give the checker the full script and ask it to read as a doubtful first-time viewer:
- **Consistency.** Do lines contradict each other or the takeaways? Are two things compared with the same ruler? (In draft 1 of video 2, Barbara's savings were measured in what they buy and Sam's in dollars.)
- **Hidden assumptions.** Does a later line rely on something never said? (Video 2 never said which currency Barbara is paid in, or that the jet ski's price hadn't changed.)
- **Cold viewers.** Does any line need the previous video to make sense ("Barbara's rule from last time", "the Barbaras")?
- **Causal claims.** Does "A causes B" have support, or is the line only a correlation?
- **Heckler.** She never says a number.

## Bookkeeping (`toolkit/story/factcheck_sync.py`)
- Each script line and each scene's on-screen note has one row, holding the fingerprint (`hash`) of the exact wording checked.
- After any script edit, run `factcheck_sync.py script.json factcheck.csv --update`. New or changed rows go back to pending, and `<csv>.todo.md` lists only the rows to check.
- After the checker passes rows, run `--stamp ID ...` (or `--stamp-all-ok` once every row reads OK).
- `build.py` refuses to voice while any row is missing, pending or changed.
- Before upload, run `--fresh` to list the time-sensitive lines (rates, "this year", records). Re-check those and the description's figures on the upload date.

## Rules for the writer (Claude)
- **Claims list before the script.** Research produces `story/<Topic>_claims.csv`:
  - columns: id, claim, figure, primary source + URL, date, exact quote, computed-by.
  - Arithmetic is done in `story/calc.py`, run on the saved data.
  - The checker passes this list before the script is drafted, and every factual line is written from a claim ID (its `src` in make_script.py, which becomes `sources` in the script JSON).
- **Nothing unchecked reaches Sam as fact.** A new factual line written during revisions is labelled "(unchecked)" in any message until its row passes.
- **Show the sources.** The script-for-review file shows each line's source tag, so Sam can spot-check.
