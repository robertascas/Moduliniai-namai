import json, os
P = json.load(open("fonts/paths.json"))
OUT = "/home/user/Moduliniai-namai/brand"
INK, TEAL, AMBER, SNOW = "#16211E", "#0F4C45", "#E9A23B", "#FFFFFF"

def mark(fg, warm, tx=0, ty=0, s=1.0):
    return (f'<g transform="translate({tx} {ty}) scale({s})">'
            f'<rect x="37" y="49" width="26" height="31" fill="{warm}"/>'
            f'<path d="M18 44 V90 M82 44 V90 M13.5 90 H86.5" fill="none" stroke="{fg}" stroke-width="7"/>'
            f'<path d="M26 31 H74 M50 12 V31" fill="none" stroke="{fg}" stroke-width="5"/>'
            f'<path d="M7 51 L50 9 L93 51" fill="none" stroke="{fg}" stroke-width="10" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10"/>'
            f'</g>')

def text(key, fill, tx, ty, s=1.0):
    return f'<path transform="translate({tx} {ty}) scale({s})" d="{P[key]["d"]}" fill="{fill}"/>'

def svg(vb, body, title="Šiltas karkasas"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n'

def horizontal(fg, warm):
    x1 = 122; x2 = x1 + P["siltas700"]["w"] + 24
    w = x2 + P["karkasas400"]["w"] + 4
    return svg(f"0 -4 {w:.0f} 104", mark(fg, warm) + text("siltas700", fg, x1, 93) + text("karkasas400", fg, x2, 93))

def stacked(fg, warm):
    s = 0.62
    w = 118 + max(P["siltas700"]["w"], P["karkasas400"]["w"]) * s + 4
    return svg(f"0 -4 {w:.0f} 104", mark(fg, warm) + text("siltas700", fg, 116, 47, s) + text("karkasas400", fg, 116, 92, s))

files = {
    "logo-horizontalus.svg": horizontal(INK, AMBER),
    "logo-horizontalus-baltas.svg": horizontal(SNOW, AMBER),
    "logo-dvieiliis.svg": stacked(INK, AMBER),
    "logo-dvieiliis-baltas.svg": stacked(SNOW, AMBER),
    "zenklas.svg": svg("0 0 100 100", mark(INK, AMBER)),
    "zenklas-baltas.svg": svg("0 0 100 100", mark(SNOW, AMBER)),
    "favicon.svg": svg("0 0 100 100", f'<rect width="100" height="100" rx="18" fill="{TEAL}"/>' + mark(SNOW, AMBER, 6, 4, 0.88)),
}
for n, c in files.items():
    open(os.path.join(OUT, n), "w").write(c)
print(list(files))
