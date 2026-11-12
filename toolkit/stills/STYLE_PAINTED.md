# GJ 581g painted style (Sam, 12 Nov 2026: "I like the painted style")

Every picture in a video, real photo or AI still, is repainted as one gouache editorial illustration, so the whole video
looks like one world. Recipe (works the same in Recraft image_edit and in Adobe Firefly, because both run Google's
Nano Banana 2 = "Gemini 3.1" in Firefly, which Sam's Firefly plan includes without credits):

- Model: Nano Banana 2 (Recraft `nano_banana_2`; Firefly "Gemini 3.1 (Nano Banana 2)"), 16:9, 2K.
- Inputs: 1) the picture to repaint, 2) the style master. Use `style/master_painted_noalien.jpg` (the stopwatch) as the
  master for anything without the alien: the alien master leaked an alien into a robot picture once.
- Prompt: "Repaint the FIRST image in exactly the painting style of the SECOND image (hand-painted gouache editorial
  illustration, flat matte brush strokes, paper grain, palette of deep forest green, warm cream, parakeet yellow, muted brick
  red, charcoal shadows). Keep the first image's composition, subjects and framing exactly: <list the subjects and anything
  that must survive, e.g. 'three white robots', 'a clear starry sky with the Milky Way'>. Do not add anything from the second
  image. No text, letters or logos."
- New pictures: generate first (or take the real photo), then repaint with the recipe. Don't prompt the style from scratch.
- Check every repaint against the line it illustrates (style 3 review, 12 Nov 2026: a robot became an alien, the Milky Way
  became clouds, cinema walls got a pattern, Mars rock became polka dots). Name the must-keep subjects in the prompt.
- Real people: never repaint a photo with a real person's face in it; those stay real photos (or get a duotone in the palette).
- Firefly route: firefly.adobe.com/generate/image in the built-in browser on Sam's laptop, model and aspect set by JS,
  both images added as references (gj581g-stills-world section 3), result blob pushed out through a Recraft upload URL.

## Gags are painted too (Sam, 12 Nov 2026: "All the visual elements in the video should be of AI painted style" and "Going forward whatever gags we use should be created in the painted AI format")
- The kit draws every gag in the painted look by default (`kit/Paint.jsx`): cream paper scraps with ink outlines and a rough hand-cut edge, brick-red Fraunces stamps with ink texture, an ochre torn-strip banner, Kalam lettering, a paper-texture wash on full-screen cards (`public/paint/paper_tex.jpg`, AI-painted). `finish.gags: "flat"` exists only to rebuild an old video as it was.
- Any picture inside a gag (a sticker, a clock dial, a falling banknote, a prop) is an AI-painted image made with this recipe (Firefly Gemini 3.1 first, it costs nothing; Recraft only as a fallback). No flat Lottie files, emoji, clip art or video overlays: `gag_lint.py` fails a plan that uses one.
- A new gag kind gets its painted look in `Paint.jsx` before it is used in a video; `gag_lint.py` fails kinds without one.
- Real photographs (real people, real documents such as the Wow! printout) stay real and unpainted.
