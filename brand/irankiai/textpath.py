import sys, json, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import io

def shape_path(fontfile, text, wght, size, tracking=0):
    f = TTFont(fontfile)
    inst = instantiateVariableFont(f, {"wght": wght})
    buf = io.BytesIO(); inst.save(buf); data = buf.getvalue()
    font = TTFont(io.BytesIO(data))
    upem = font["head"].unitsPerEm
    face = hb.Face(data); hbf = hb.Font(face)
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
    hb.shape(hbf, b, {"kern": True, "liga": True})
    gs = font.getGlyphSet(); order = font.getGlyphOrder()
    pen = SVGPathPen(gs)
    s = size / upem; x = 0
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        name = order[info.codepoint]
        tp = TransformPen(pen, (s, 0, 0, -s, (x + pos.x_offset) * s, -pos.y_offset * s))
        gs[name].draw(tp)
        x += pos.x_advance + tracking * upem
    return pen.getCommands(), x * s

if __name__ == "__main__":
    out = {}
    for key, text, w in [("siltas700", "Šiltas", 700), ("karkasas400", "karkasas", 400), ("full700", "Šiltas karkasas", 700), ("karkasas700","karkasas",700), ("siltas400","Šiltas",400)]:
        d, width = shape_path(sys.argv[1], text, w, 100, -0.01)
        out[key] = {"d": d, "w": round(width, 2)}
    json.dump(out, open(sys.argv[2], "w"))
    print({k: v["w"] for k, v in out.items()})
