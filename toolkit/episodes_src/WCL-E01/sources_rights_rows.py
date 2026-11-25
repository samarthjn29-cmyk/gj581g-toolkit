"""Sources_&_Rights rows for the WCL-E01 beat sheet: every outside picture, clip and music track the beat sheet uses
(our own in-house pieces are left out: they need no rights). Used_In_Beats is read from the beat sheet dump; files
from the register mirror. Prints the rows as JSON for the Sheets write."""
import json, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
reg = json.load(open(os.path.join(HERE, "..", "..", "library", "scripts", "data", "registry_values.json")))["values"]
R = {r[0]: r for r in reg if r}
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "gate1_act3", "beatsheet_dump_v3.json")))["values"]
use = {}
for r in d[1:]:
    if not r or not r[0].startswith("E01-"):
        continue
    for col in range(8, 19):
        c = r[col] if col < len(r) else ""
        for x in c.split(","):
            x = x.strip()
            if re.match(r"(SRC|MUS)-\d+", x) and r[0] not in use.get(x, []):
                use.setdefault(x, []).append(r[0])


def rng(bs):
    out, cur = [], None
    for b in bs:
        a, n = b.rsplit("-", 1)
        n = int(n)
        if cur and cur[0] == a and cur[2] == n - 1:
            cur[2] = n
        else:
            if cur:
                out.append(cur)
            cur = [a, n, n]
    out.append(cur)
    return ", ".join(f"{a}-{s:02d}" if s == e else f"{a}-{s:02d} to {e:02d}" for a, s, e in out)


SHI = "Science History Institute (via DPLA / Wikimedia Commons)"
CC = "\"{}\" Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0"
I = {  # type, title, url, creator, licence, on-screen credit, description credit, notes
    "SRC-001": ("Archival scan", "John Dalton, 'Extraordinary Facts relating to the Vision of Colours' (1798) p. 29", "https://commons.wikimedia.org/wiki/File:Extraordinary_Facts_Relating_to_the_Vision_of_Colours-_With_Observations_-_DPLA_-_9888a1fc5bcf7520ccdf81a15a0ed40f_(page_5).jpg", SHI, "Public domain", "JOHN DALTON · 1798 · P. 29", "John Dalton, 1798, pp. 28-43 · Science History Institute", ""),
    "SRC-029": ("Archival scan", "John Dalton (1798) p. 30: 'sky-blue by day', 'astonishingly changed', 'except my brother'", "https://commons.wikimedia.org/wiki/File:Extraordinary_Facts_Relating_to_the_Vision_of_Colours-_With_Observations_-_DPLA_-_9888a1fc5bcf7520ccdf81a15a0ed40f_(page_26).jpg", SHI, "Public domain", "JOHN DALTON · 1798 · P. 30", "(as SRC-001)", ""),
    "SRC-002": ("Archival scan", "John Dalton (1798) p. 34: the colour list and the laurel-leaf / sealing-wax match", "https://commons.wikimedia.org/wiki/File:Extraordinary_Facts_Relating_to_the_Vision_of_Colours-_With_Observations_-_DPLA_-_9888a1fc5bcf7520ccdf81a15a0ed40f_(page_23).jpg", SHI, "Public domain", "JOHN DALTON · 1798 · P. 34", "(as SRC-001)", ""),
    "SRC-003": ("Archival scan", "John Dalton (1798) p. 43: 'probably some modification of blue', 'otherwise I apprehend it might be discovered by inspection'", "Science History Institute copy, DPLA item 9888a1fc5bcf7520ccdf81a15a0ed40f (Wikimedia Commons)", SHI, "Public domain", "JOHN DALTON · 1798 · P. 43", "(as SRC-001)", ""),
    "SRC-042": ("Archival scan", "John Dalton (1798) p. 28, the paper's first page ('READ OCT. 31st, 1794.'), cropped to the page; plus our page-only cut-out", "Science History Institute copy, DPLA item 9888a1fc5bcf7520ccdf81a15a0ed40f (Wikimedia Commons); also Internet Archive memoirsofliterar05manc, leaf 48", SHI, "Public domain", "JOHN DALTON · 1798 · P. 28", "(as SRC-001)", "Library shelf label, stamp, binding and facing page cropped out."),
    "SRC-031": ("Archival plate", "John Dalton, Plate 4 'Elements' (1808)", "Wellcome Collection L0007206 (Wikimedia Commons)", "Wellcome Collection", "CC BY 4.0 (credit)", "HIS ATOMS · PLATE 4, 1808", "Dalton's Plate 4, 1808 · Wellcome Collection, CC BY 4.0", ""),
    "SRC-004": ("Portrait (print)", "John Dalton, mezzotint by Charles Turner after James Lonsdale (1834)", "https://commons.wikimedia.org/wiki/File:John_Dalton_by_Charles_Turner.jpg", "Charles Turner after James Lonsdale (Wikimedia Commons)", "Public domain", "JOHN DALTON · 1834", "John Dalton, mezzotint by Charles Turner after James Lonsdale, 1834", ""),
    "SRC-007": ("Archival scan", "W. C. Henry, Memoirs of the Life and Scientific Researches of John Dalton (1854) p. 25; our two-line strip of 'his strongly expressed wish'", "Internet Archive (University of Toronto copy)", "University of Toronto via Internet Archive", "Public domain", "W. C. HENRY · 1854 · P. 25", "W. C. Henry, Memoirs of the Life and Scientific Researches of John Dalton, 1854", "The strip leaves out the 'not, however, verified' and 'pale yellow' lines (fact-check)."),
    "SRC-009": ("Map (period plan)", "William Green, A plan of Manchester and Salford (survey 1787-1794), extract", "https://commons.wikimedia.org/wiki/File:St_Peter%27s_Square,_Manchester_1794_map.jpg", "William Green, engraved by J. Thornton (Wikimedia Commons)", "Public domain", "PLAN OF MANCHESTER · WILLIAM GREEN · 1794", "Plan of Manchester and Salford, William Green, 1794", ""),
    "SRC-044": ("Drawing (print)", "Cross Street Chapel, Manchester, as it looked in 1835", "https://commons.wikimedia.org/wiki/File:Cross_Street_Chapel_Manchester_(1835).jpg", "Wikimedia Commons (from W. H. Shercliff, Manchester: A Short History of its Development, 1960)", "Public domain", "CROSS STREET CHAPEL · AS IN 1835 / THE SOCIETY MET IN A ROOM HERE UNTIL 1799", "Cross Street Chapel, Manchester, as in 1835 (Wikimedia Commons)", "Never labelled as 1794."),
    "SRC-045": ("Map (period)", "Thomas Kitchin, A New Map of England & Wales, northern part (Laurie & Whittle, 1794; 1804 atlas copy), Kendal to Manchester crop", "https://commons.wikimedia.org/wiki/File:KITCHIN%27S_NEW_UNIVERSAL_ATLAS,_ENGLAND_-_NORTHERN_PART.jpg", "David Rumsey Map Collection (Wikimedia Commons)", "Public domain", "KITCHIN · LAURIE & WHITTLE · 1794", "Map: Thomas Kitchin, Laurie & Whittle, 1794 · David Rumsey Map Collection", ""),
    "SRC-033": ("Map (period)", "Emanuel Bowen, A new map of the counties of Cumberland and Westmoreland (1760)", "https://collections.library.yale.edu/catalog/15309191", "Beinecke Library, Yale University Library", "Public domain", "MAP · EMANUEL BOWEN · 1760 · YALE UNIVERSITY LIBRARY", "Map: Emanuel Bowen, 1760 · Yale University Library", ""),
    "SRC-034": ("Archival scan", "Extracts from the Minutes and Advices of the Yearly Meeting of Friends (London, 1783) p. 185, PLAINNESS", "https://archive.org/details/bim_eighteenth-century_extracts-from-the-minute_society-of-friends-lond_1783/page/n198", "Internet Archive (microfilm scan)", "Public domain", "QUAKER ADVICE OF 1691 · PRINTED LONDON 1783 · P. 185", "Extracts from the Minutes and Advices, London 1783 · Internet Archive", ""),
    "SRC-035": ("Archival scan", "John Dalton, Meteorological Observations and Essays (London, 1793), first edition, title page", "https://www.e-rara.ch/zut/content/titleinfo/1016838", "ETH-Bibliothek Zürich, e-rara (doi:10.3931/e-rara-3543)", "Public domain", "JOHN DALTON · LONDON, 1793 · FIRST EDITION · ETH-BIBLIOTHEK ZÜRICH", "John Dalton, Meteorological Observations and Essays, 1793 · ETH-Bibliothek Zürich, e-rara", ""),
    "SRC-036": ("Archival scan", "Henry Lonsdale, The Worthies of Cumberland: John Dalton (1874), title page", "https://archive.org/details/worthiescumberl02lonsgoog", "Internet Archive (Google scan)", "Public domain", "HENRY LONSDALE · LONDON, 1874", "Henry Lonsdale, The Worthies of Cumberland: John Dalton, 1874 · Internet Archive", ""),
    "SRC-038": ("Archival scan", "Henry Lonsdale (1874) p. 99: the stockings story", "https://archive.org/details/worthiescumberl02lonsgoog", "Internet Archive (Google scan)", "Public domain", "LONSDALE, THE WORTHIES OF CUMBERLAND, 1874 · P. 99", "(as SRC-036)", "Shelf stamp cropped out."),
    "SRC-037": ("Museum object photo", "Pair of silk stockings, Netherlands, c. 1806-10 (BK-NM-12310-C-2); our flat copy and mask", "https://id.rijksmuseum.nl/20075351", "Rijksmuseum, Amsterdam", "Public Domain Mark 1.0", "STOCKINGS: SILK · NETHERLANDS · c. 1806-10 · RIJKSMUSEUM · A PERIOD PAIR, RECOLOURED", "Stockings: Rijksmuseum, Amsterdam (public domain)", "Captioned as a pair of the period, not Dalton's own."),
    "SRC-046": ("Archival object scan", "The sealed back of a folded letter, Wenden (Cēsis), 1841; our cut-out", "https://commons.wikimedia.org/wiki/File:Wenden_1841_Dob40204.40_reverse.jpg", "Wikimedia Commons (postal history collection)", "Public domain", "A SEALED LETTER · 1841", "A sealed letter, 1841 (Wikimedia Commons)", ""),
    "SRC-047": ("Museum object photo", "Ivory and glass demonstration model of an eye that comes apart (L0058734); our cut-out", "Wellcome Collection L0058734 (Wikimedia Commons)", "Wellcome Collection", "CC BY 4.0 (credit; the cut-out is an adaptation)", "A MODEL OF AN EYE / WELLCOME COLLECTION", "Eye model: Wellcome Collection, CC BY 4.0", "No date shown: the record says only 'possibly 19th century'."),
    "SRC-048": ("Photo (adapted)", "Close-up of a young person's two eyes (Unsplash, 2019); our newspaper halftone cutting of it", "https://unsplash.com/photos/grayscale-photo-of-man-ZehKMC_hoiU", "Mason Kimbarovsky (Unsplash)", "Unsplash License (no credit required; credited)", "PHOTO TODAY", "Eyes: photo by Mason Kimbarovsky (Unsplash), printed as a halftone by us", "Never presented as Dalton's eyes; added at Gate 3 (Sam, 24 Nov 2026)."),
    "SRC-049": ("Portrait (print)", "Sir Isaac Newton, engraving by J. Swaine after Enoch Seeman's portrait (c. 1726)", "https://wellcomecollection.org/works/s7p4hjr3", "Wellcome Collection", "Public Domain Mark 1.0", "ISAAC NEWTON · AFTER ENOCH SEEMAN, c. 1726", "Sir Isaac Newton. Engraving by J. Swaine after E. Seeman, 1726. Wellcome Collection. Public Domain Mark. Source: Wellcome Collection.", "Blurred ground behind 'one man'; no engraving date on screen (the print is from about the 1790s)."),
    "SRC-011": ("Stock video", "Mixkit clip 3458 'Candle lighting in the dark' (portrait 1080x1920) and our reversed copy", "https://mixkit.co/free-stock-video/candle-lighting-in-the-dark-3458/", "Mixkit (Envato)", "Mixkit Stock Video Free License", "none (description credit)", "Footage: Mixkit", "Not in git; Drive copies in 11_Sources."),
    "SRC-013": ("Photo", "Pelargonium x hortorum 'Rocky Mountain Light Pink', a modern zonal geranium; our graded copy and flower-head cut-out", "https://commons.wikimedia.org/wiki/File:Pelargonium_x_hortorum_Rocky_Mountain_Light_Pink_0zz.jpg", "David J. Stang", "CC BY-SA 4.0 (credit; adapted versions shared alike)", "DALTON'S 'GERANIUM ZONALE'", "Photo: David J. Stang, CC BY-SA 4.0 (modern zonal geranium, Pelargonium × hortorum)", ""),
    "SRC-014": ("Photo", "Cherry laurel leaves (Prunus laurocerasus), photo by Runic Earth; our one-leaf cut-out", "https://unsplash.com/photos/close-up-of-lush-green-leaves-on-a-branch-d6ZpaPRgsu4", "Runic Earth (Unsplash)", "Unsplash License", "PHOTOS TODAY · CHERRY LAUREL, RUNIC EARTH", "Photo: Runic Earth / Unsplash (cherry laurel)", "Never captioned as the leaf's face."),
    "SRC-015": ("Photo", "Red wax seal on an envelope, photo by Raymond Petrik; our seal cut-out", "https://unsplash.com/photos/envelopes-sealed-with-wax-on-a-wooden-table-NwuPGVLBVX8", "Raymond Petrik (Unsplash)", "Unsplash License", "A WAX SEAL · TODAY; PHOTOS TODAY · WAX SEAL, PETRIK", "Photo: Raymond Petrik / Unsplash (wax seal)", "A pressed seal, never captioned as a stick of wax."),
    "SRC-043": ("Photo", "A glass prism throwing colours on a paper backdrop, photo by Evie S.", "https://unsplash.com/photos/WZ9bPu5ZQk4", "Evie S. (Unsplash)", "Unsplash License", "PHOTO TODAY · A GLASS PRISM · EVIE S. / UNSPLASH", "Photo: Evie S. / Unsplash (prism)", ""),
    "SRC-005": ("Archival scan", "Isaac Newton, Opticks (London, 1704) p. 90: 'For the rays to speak properly are not coloured'", "https://archive.org/details/b30412316/page/n107", "Wellcome Collection (via Internet Archive)", "Public Domain Mark 1.0", "ISAAC NEWTON · OPTICKS · 1704 · P. 90", "Isaac Newton, Opticks, 1704, pp. 90-92 and title page · Wellcome Collection", ""),
    "SRC-063": ("Archival scan", "Isaac Newton, Opticks (1704) p. 92: 'divided after the manner of a musical Chord'", "https://archive.org/details/b30412316/page/n109", "Wellcome Collection (via Internet Archive)", "Public Domain Mark 1.0", "ISAAC NEWTON · OPTICKS · 1704 · P. 92", "(as SRC-005)", ""),
    "SRC-064": ("Archival scan", "Isaac Newton, Opticks (1704), title page (no author's name on it)", "https://archive.org/details/b30412316/page/n6", "Wellcome Collection (via Internet Archive)", "Public Domain Mark 1.0", "ISAAC NEWTON · OPTICKS · LONDON, 1704", "(as SRC-005)", ""),
    "SRC-058": ("Archival scan", "Isaac Newton, 'New Theory about Light and Colors', letter from Cambridge, Phil. Trans. No. 80 (1672) pp. 3075-3084", "https://archive.org/details/paper-doi-10_1098_rstl_1671_0072", "Royal Society, Philosophical Transactions (JSTOR Early Journal Content via Internet Archive)", "Public Domain Mark 1.0", "ISAAC NEWTON · PHIL. TRANS. NO. 80 · 1672 · P. (page)", "Isaac Newton, letter in Phil. Trans. No. 80, 1672 · JSTOR Early Journal Content / Internet Archive", ""),
    "SRC-059": ("Archival plate", "Isaac Newton, Opticks (1704) Book I Part I, Plate IV, Fig. 18 (the Experimentum Crucis)", "https://archive.org/details/b30412316/page/n94", "Wellcome Collection (via Internet Archive)", "Public Domain Mark 1.0", "NEWTON · OPTICKS 1704 · PLATE IV, FIG. 18", "(as SRC-005)", ""),
    "SRC-060": ("Archival scan", "Robert Hooke, Micrographia (London, 1665), title page", "https://archive.org/details/b30326370/page/n10", "Wellcome Collection (via Internet Archive)", "Public Domain Mark 1.0", "ROBERT HOOKE · MICROGRAPHIA, LONDON, 1665 / NO CONFIRMED PORTRAIT OF HOOKE SURVIVES", "Robert Hooke, Micrographia, 1665 · Wellcome Collection", "Stands for Hooke: no confirmed portrait survives."),
    "SRC-061": ("Archival scan", "Isaac Newton, 'Answer to some Considerations upon his Doctrine of Light and Colors', Phil. Trans. No. 88 (1672) p. 5084", "https://archive.org/details/paper-doi-10_1098_rstl_1672_0051", "Royal Society, Philosophical Transactions (JSTOR Early Journal Content via Internet Archive)", "Public Domain Mark 1.0", "ISAAC NEWTON · ANSWER TO HOOKE'S CONSIDERATIONS · PHIL. TRANS. NO. 88, 1672 · P. 5084", "Isaac Newton, Answer to Hooke, Phil. Trans. No. 88, 1672 · Internet Archive", ""),
    "SRC-062": ("Photo", "'Rainbows From a Glass of Water' (2020): sunlight through a glass of water on a tabletop", "https://exstrom.com/mpod/20201129.html", "Richard Hollos and Stefan Hollos, Exstrom Laboratories", "CC BY 4.0 (credit)", "PHOTO TODAY · R. & S. HOLLOS, EXSTROM LABORATORIES · CC BY 4.0", "Photo: R. & S. Hollos, Exstrom Laboratories, CC BY 4.0", ""),
    "SRC-040": ("Stock video", "Mixkit clip 51102 'White clouds moving across a clear blue sky' and our reversed copy", "https://mixkit.co/free-stock-video/", "Mixkit (Envato)", "Mixkit Stock Video Free License", "TODAY · DAYLIGHT", "Footage: Mixkit", "Not in git; Drive copies in 11_Sources."),
    "MUS-007": ("Music", "'Wholesome' by Kevin MacLeod (the bed of acts 1-2; cue 1 of acts 3-5)", "https://incompetech.com", "Kevin MacLeod (incompetech.com)", "CC BY 4.0 (credit required)", "none", CC.format("Wholesome"), "Not in git (public/music)."),
    "MUS-012": ("Music", "'Thinking Music' by Kevin MacLeod (acts 3-5 cue 2)", "https://incompetech.com", "Kevin MacLeod (incompetech.com)", "CC BY 4.0 (credit required)", "none", CC.format("Thinking Music"), "Not in git (public/music)."),
    "MUS-013": ("Music", "'Long Note Two' by Kevin MacLeod (acts 3-5 cue 3)", "https://incompetech.com", "Kevin MacLeod (incompetech.com)", "CC BY 4.0 (credit required)", "none", CC.format("Long Note Two"), "Not in git (public/music)."),
    "MUS-014": ("Music", "'At Rest' by Kevin MacLeod (acts 3-5 cue 4)", "https://incompetech.com", "Kevin MacLeod (incompetech.com)", "CC BY 4.0 (credit required)", "none", CC.format("At Rest"), "Not in git (public/music)."),
}
OWN = {k for k in use if R.get(k) and R[k][3].startswith("Own")}
missing = set(use) - set(I) - OWN
if missing:
    sys.exit(f"sources used but not listed: {sorted(missing)}")
rows = [["Source_ID", "Asset_Type", "Asset_Title_or_Description", "Local_File_Path", "Used_In_Beats", "Source_URL_or_Archive", "Creator_or_Rights_Holder", "License_Type", "Clearance_Status", "On_Screen_Credit_Text", "Description_Credit_Line", "Proof_of_License_or_Notes"]]
for k, (t, ti, u, cr, li, on, de, no) in I.items():
    note = ((no + " ") if no else "") + "Licence, credit and Drive copy: register row " + k + "."
    rows.append([k, t, ti, R[k][4].replace(";", "; "), rng(use[k]), u, cr, li, "Cleared", on, de, note])
print(json.dumps(rows, ensure_ascii=False))
