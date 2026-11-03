# Thumbnail templates v2 (3 Nov 2026)
Four house templates (1280x720 HTML, screenshotted with Playwright `node shoot.js <abs path to html>...`), built after Sam's reference thumbnails (editorial $10K, glossy pie, product line-up, then/now split, repeated-object photo, big number + metaphor).
- `t1_editorial.html`: big grotesk + one italic serif word, small data device (ruler) + Kalam hand note.
- `t2_hero.html`: one photo hero object on white (background-free stock), torn red banner with 2-4 words, one paper tag.
- `t3_split.html`: two photos split down the middle, label + number on each, yellow question box in the middle.
- `t4_bignum.html`: stakes number + 3D hero render (`coins.html` three.js scene, rendered transparent by `node shot.js coins.html coins.png`, swiftshader WebGL).
Fonts in `fonts/` (Inter, Fraunces, Oswald, Kalam). Photos (Unsplash licence, credit in the description): mini shopping cart, Umut Hasanoglu; banknotes in hand, Omid Armin; grocery shelf, Eduardo Soares. Log each new photo in media/licence_log.csv.
Rules: 2-4 words that add to the title; one focal object; bottom-right 140x60 clear for the duration badge; check in the dark feed mock (feed.html) at 380 px wide.
