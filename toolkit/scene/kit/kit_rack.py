# Kit rack (8 Nov 2026): a pigeonhole rack drawn to true scale, in the channel's flat style (flat fills, black outlines).
# Each cubby holds a pile of scroll ends about 7 cm across (Herculaneum rolls are small; the earlier Recraft rack drew
# them ~28 cm). Every rack is generated from its own seed, so no two racks are clones; some scrolls carry a title tag.
# draw_rack(...) returns the BGRA image and the list of scrolls (rack-local px), so the scene knows where each one is.
import cv2, numpy as np, random

WOOD, WOOD_D, CUBBY, END, INK, TAG, LINE = (90, 135, 195), (55, 99, 168), (22, 48, 92), (183, 212, 232), (34, 42, 58), (75, 86, 222), (20, 20, 20)

def draw_rack(seed, pxm, w_m=1.268, h_m=2.0, rows=6, cols=3, scroll_d_m=0.07, force_tag=None, remove=None, ss=3):
    """force_tag / remove: (row, col) of the cubby whose top scroll is tagged / taken out."""
    rnd = random.Random(seed); S = pxm * ss
    W, H = int(round(w_m * S)), int(round(h_m * S)); img = np.zeros((H, W, 4), np.uint8)
    lw = max(2, int(round(3 * ss)))   # outline width at supersampled scale (3 px final)
    post_o, post_i, shelf, peg = 0.06 * S, 0.035 * S, 0.032 * S, 0.035 * S
    x_cells = []; x = post_o
    inner_w = (W - 2 * post_o - (cols - 1) * post_i) / cols
    for c in range(cols): x_cells.append((x, x + inner_w)); x += inner_w + post_i
    top_pad = 0.05 * S; inner_h = (H - top_pad - (rows + 1) * shelf) / rows
    y_cells = [(top_pad + shelf + r * (inner_h + shelf), top_pad + shelf + r * (inner_h + shelf) + inner_h) for r in range(rows)]
    P = lambda pts: np.array(pts, np.int32)
    def box(x0, y0, x1, y1, col):
        cv2.rectangle(img, (int(x0), int(y0)), (int(x1), int(y1)), (*col, 255), -1, cv2.LINE_AA)
        cv2.rectangle(img, (int(x0), int(y0)), (int(x1), int(y1)), (*LINE, 255), lw, cv2.LINE_AA)
    # back of the cubbies, then the scroll piles, then the frame on top
    box(post_o * 0.5, top_pad, W - post_o * 0.5, H - 0.04 * S, CUBBY)
    scrolls = []; d = scroll_d_m * S
    for r, (y0, y1) in enumerate(y_cells):
        for c, (x0, x1) in enumerate(x_cells):
            n_bottom = int((x1 - x0 - 0.01 * S) // (d * 1.04)); layers = []; y = y1 - d / 2 - 0.004 * S; k = n_bottom; row = 0
            while k >= 1 and y - d / 2 > y0 + 0.006 * S:
                if row > 0 and rnd.random() < 0.25: break
                span = k * d * 1.04; xs = [x0 + (x1 - x0 - span) / 2 + d * 0.52 + i * d * 1.04 for i in range(k)]
                layers.append([(xx, y) for xx in xs])
                y -= d * 0.9; k -= 1; row += 1
            # only the top layer may have gaps: every scroll lower down must hold up the ones resting on it
            if len(layers) > 1: layers[-1] = [p for p in layers[-1] if rnd.random() > 0.3] or layers[-1][:1]
            pile = [(xx, yy) for L in layers for (xx, yy) in L]
            bottom_y = max(yy for (_, yy) in pile)
            if not pile: continue
            top = min(pile, key=lambda p: (p[1], abs(p[0] - (x0 + x1) / 2)))
            for (xx, yy) in pile:
                is_top = (xx, yy) == top
                if remove == (r, c) and is_top: continue
                cv2.circle(img, (int(xx), int(yy)), int(d / 2), (*END, 255), -1, cv2.LINE_AA)
                cv2.circle(img, (int(xx), int(yy)), int(d / 2), (*LINE, 255), max(2, lw - 2), cv2.LINE_AA)
                cv2.circle(img, (int(xx), int(yy)), int(d * 0.14), (*INK, 255), max(2, lw - 3), cv2.LINE_AA)
                tagged = (force_tag == (r, c) and is_top) or (not is_top and yy < bottom_y - 1 and rnd.random() < 0.12)   # tags only where they can hang in front of the pile
                if tagged:   # a title tag hangs from the scroll's own end
                    cv2.line(img, (int(xx), int(yy + d * 0.3)), (int(xx), int(yy + d * 0.75)), (*INK, 255), max(2, lw - 3), cv2.LINE_AA)
                    tx0, ty0 = xx - d * 0.18, yy + d * 0.75
                    cv2.rectangle(img, (int(tx0), int(ty0)), (int(tx0 + d * 0.36), int(ty0 + d * 0.62)), (*TAG, 255), -1, cv2.LINE_AA)
                    cv2.rectangle(img, (int(tx0), int(ty0)), (int(tx0 + d * 0.36), int(ty0 + d * 0.62)), (*LINE, 255), max(2, lw - 3), cv2.LINE_AA)
                scrolls.append({'row': r, 'col': c, 'top': is_top, 'x': xx / ss, 'y': yy / ss, 'd': d / ss, 'tag': bool(tagged)})
    # frame: outer posts with pegs, inner posts, shelves (drawn last so they sit in front of the piles)
    for (y0, y1) in [(top_pad + r * (inner_h + shelf), top_pad + r * (inner_h + shelf) + shelf) for r in range(rows + 1)]:
        box(0, y0, W - 1, y1, WOOD)
    for i in range(1, cols): xx = x_cells[i][0] - post_i; box(xx, top_pad, xx + post_i, H - 0.04 * S, WOOD)
    box(0, 0, post_o, H - 1, WOOD); box(W - 1 - post_o, 0, W - 1, H - 1, WOOD)
    img = cv2.resize(img, (W // ss, H // ss), interpolation=cv2.INTER_AREA)
    cells = [{'row': r, 'col': c, 'x0': x0 / ss, 'x1': x1 / ss, 'y0': y0 / ss, 'y1': y1 / ss} for r, (y0, y1) in enumerate(y_cells) for c, (x0, x1) in enumerate(x_cells)]
    return img, scrolls, cells
