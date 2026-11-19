"""Colour_v1 ch0, the patch close-up (audio 19.6-37.0 s) rebuilt in Manim CE, following adithya-s-k/manim_skill
(manimce-best-practices: MovingCameraScene zoom, ValueTracker/updaters for the drift, LaggedStart reveals, rate functions).
Same palette and cues as cards/colour_ch0.html so the two can be compared side by side."""
from manim import *
import random

config.pixel_width, config.pixel_height, config.frame_rate = 1920, 1080, 30
config.background_color = "#0A0F1E"
T0 = 19.6                     # audio time at the start of this shot
CUE = dict(track=20.2, track_off=25.6, pulses=25.9, reveal=31.3, monly=31.8, mdone=34.8, nbr=34.75, end=37.0)
COL = {"L": "#FF6B5B", "M": "#5BE08A", "S": "#6B8CFF"}
GREY, CREAM, DIM, BEAM, IR = "#788296", "#EFE6D2", "#7F8AA6", "#9FF7EA", "#E07A5F"
MONO = "DejaVu Sans Mono"
px = lambda x, y: np.array([(x - 960) / 1920 * config.frame_width, (540 - y) / 1080 * config.frame_height, 0])


class PatchShot(MovingCameraScene):
    def at(self, t):          # wait until audio time t
        d = (t - T0) - self.renderer.time
        if d > 1 / 30: self.wait(d)

    def construct(self):
        rnd = random.Random(4242)
        cells = []
        for yy in range(-10, 11):
            for xx in range(-14, 15):
                x, y = 960 + xx * 40 + (yy & 1) * 20, 540 + yy * 36
                if ((x - 960) / 1.25) ** 2 + (y - 540) ** 2 > 360 ** 2: continue
                q = rnd.random(); c = "S" if q < 0.07 else "M" if q < 0.40 else "L"
                d = Dot(px(x, y), radius=0.098, color=GREY, fill_opacity=0.35); d.kind = c; cells.append(d)
        mosaic = VGroup(*cells)
        drift = ValueTracker(0)
        base = mosaic.get_center().copy()
        mosaic.add_updater(lambda m: m.move_to(base + 0.045 * np.array([np.sin(drift.get_value() * 2.3) + 0.6 * np.sin(drift.get_value() * 5.1),
                                                                        np.cos(drift.get_value() * 1.9) + 0.5 * np.sin(drift.get_value() * 4.3), 0])))
        drift.add_updater(lambda v, dt: v.increment_value(dt))
        self.add(drift)

        tag = Text("CLOSE-UP OF THE PATCH · ILLUSTRATIVE", font=MONO, font_size=16, color=DIM).to_corner(UL, buff=0.5)
        # 1) zoom from the patch square into the mosaic
        frame = self.camera.frame; frame.save_state()
        patch = Square(0.5, color=BEAM, stroke_width=3).set_fill(BEAM, 0.15)
        self.add(patch); frame.set(width=2.2).move_to(ORIGIN)
        self.play(patch.animate.scale(16).set_opacity(0), Restore(frame), FadeIn(mosaic, lag_ratio=0.01), run_time=1.3, rate_func=rate_functions.ease_out_cubic)
        self.add(tag)
        self.remove(patch)

        # 2) infrared tracking grid that rides the drift
        grid = VGroup(*[Line(px(x, 200), px(x, 880), stroke_width=1.5, color=IR) for x in range(600, 1321, 120)],
                      *[Line(px(560, y), px(1360, y), stroke_width=1.5, color=IR) for y in range(240, 841, 120)]).set_opacity(0.55)
        gbase = grid.get_center().copy()
        grid.add_updater(lambda m: m.move_to(gbase + (mosaic.get_center() - base)))
        reticle = VGroup(Circle(0.32, color=IR, stroke_width=2), Line(LEFT * 0.5, RIGHT * 0.5, stroke_width=2, color=IR), Line(UP * 0.5, DOWN * 0.5, stroke_width=2, color=IR))
        reticle.add_updater(lambda m: m.move_to(cells[57].get_center()))
        ir_lab = Text("INFRARED CAMERA · TRACKING EVERY CELL", font=MONO, font_size=20, color=IR).move_to(px(960, 960))
        self.at(CUE["track"])
        self.play(Create(grid, lag_ratio=0.08), FadeIn(ir_lab, shift=UP * 0.2), GrowFromCenter(reticle), run_time=1.0)
        self.at(CUE["track_off"])
        self.play(FadeOut(grid), FadeOut(reticle), FadeOut(ir_lab), run_time=0.4)
        grid.clear_updaters(); reticle.clear_updaters()

        # 3) pulses, one cell at a time, any type
        source = px(1700, 120)
        def pulse(cell, col=BEAM, rt=0.30):
            beam = Line(source, cell.get_center(), color=col, stroke_width=3)
            return Succession(Create(beam, run_time=rt * 0.45, rate_func=rush_into),
                              AnimationGroup(cell.animate(run_time=rt * 0.55).set_fill(WHITE if col == BEAM else COL["M"], 1),
                                             Flash(cell, color=col, line_length=0.12, flash_radius=0.22, run_time=rt * 0.55),
                                             FadeOut(beam, run_time=rt * 0.55)))
        lab = Text("LASER PULSES, ONE CELL AT A TIME", font=MONO, font_size=20, color=BEAM).move_to(px(960, 960))
        self.at(CUE["pulses"])
        self.play(FadeIn(lab), run_time=0.3)
        order = cells[:]; rnd.shuffle(order)
        n_any = int((CUE["reveal"] - CUE["pulses"] - 0.3) / 0.31)
        for c in order[:n_any]:
            self.play(pulse(c))
        # 4) reveal the three types
        self.at(CUE["reveal"])
        legend = VGroup(*[VGroup(Dot(color=COL[k], radius=0.1), Text(k + " CONES", font=MONO, font_size=20, color=CREAM)).arrange(RIGHT, buff=0.15) for k in "LMS"]).arrange(RIGHT, buff=0.6).move_to(px(960, 960))
        self.play(FadeOut(lab, run_time=0.3),
                  LaggedStart(*[c.animate.set_fill(COL[c.kind], 0.45) for c in cells], lag_ratio=0.004, run_time=0.8),
                  FadeIn(legend, shift=UP * 0.15, run_time=0.6))
        # 5) only the M cones fire
        monly = Text("ONLY THE M CONES GET A PULSE", font=MONO, font_size=20, color=COL["M"]).move_to(px(960, 1020))
        ms = [c for c in order if c.kind == "M"]
        self.play(FadeIn(monly), run_time=0.3)
        halos = VGroup(*[Dot(c.get_center(), radius=0.22, color=COL["M"], fill_opacity=0) for c in ms])
        for h, c in zip(halos, ms): h.add_updater(lambda h, c=c: h.move_to(c.get_center()))
        self.add(halos); self.bring_to_front(mosaic)
        self.play(LaggedStart(*[AnimationGroup(c.animate.set_fill(COL["M"], 1).scale(1.18), h.animate.set_fill(opacity=0.22), Flash(c, color=COL["M"], line_length=0.1, flash_radius=0.2))
                                for c, h in zip(ms, halos)], lag_ratio=0.03, run_time=CUE["mdone"] - CUE["monly"] - 0.4))
        # 6) the neighbour that is never aimed at
        m = ms[3]; nb = min((c for c in cells if c.kind == "L"), key=lambda c: np.linalg.norm(c.get_center() - m.get_center()))
        ring = Circle(0.2, color=CREAM, stroke_width=3).move_to(nb); ring.add_updater(lambda r: r.move_to(nb))
        cross = VGroup(Line(UL * 0.12, DR * 0.12), Line(UR * 0.12, DL * 0.12)).set_stroke(CREAM, 3).move_to(nb); cross.add_updater(lambda r: r.move_to(nb))
        nlab = Text("AN L-CONE NEIGHBOUR: NEVER AIMED AT", font=MONO, font_size=20, color=CREAM).move_to(px(960, 1020))
        self.at(CUE["nbr"])
        self.play(FadeOut(monly, run_time=0.3), Create(ring), FadeIn(nlab), Indicate(nb, color=CREAM, scale_factor=1.4), run_time=0.8)
        self.play(Create(cross), run_time=0.4)
        self.at(CUE["end"])
