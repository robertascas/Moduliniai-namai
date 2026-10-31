import pymupdf as fitz, re, json, sys
SRC='/root/.claude/uploads/b472fb21-44be-5706-b051-ec0de8206e63/e74ee89f-Modular-homes-2023_ENG_compressed.pdf'
OUT='/tmp/claude-0/-home-user-Moduliniai-namai/b472fb21-44be-5706-b051-ec0de8206e63/scratchpad/katalogas/plans/'
FONT='/tmp/claude-0/-home-user-Moduliniai-namai/b472fb21-44be-5706-b051-ec0de8206e63/scratchpad/fonts/albert.ttf'

def find_headings(page):
    words = page.get_text('words')
    hs=[]
    for i,w in enumerate(words):
        if w[4]=='FLOOR' and i+1<len(words) and words[i+1][4]=='PLAN':
            letter = words[i+2][4] if i+2<len(words) and re.fullmatch(r'[A-K]1?', words[i+2][4]) and abs(words[i+2][1]-w[1])<3 else ''
            hs.append((letter, fitz.Rect(w[0],w[1],(words[i+2] if letter else words[i+1])[2],w[3])))
    return hs

def plan_rect(page, h, hs):
    letter, r = h
    half = 595 if r.x0 < 595 else 1191
    right = half - 4
    for l2, r2 in hs:
        if r2 is r: continue
        if abs(r2.y0 - r.y0) < 25 and r2.x0 > r.x0 + 50: right = min(right, r2.x0 - 12)
    # captions PLAN/LOFT under this heading
    limit = 842
    for l2, r2 in hs:
        if r2.y0 > r.y1 + 20 and r2.x0 < right and r2.x1 > r.x0 - 15: limit = min(limit, r2.y0)
    caps=[w for w in page.get_text('words') if w[4]=='PLAN' and r.y1+20 < w[1] < limit and r.x0-15 <= w[0] <= right]
    if not caps: return None
    ybot = max(caps, key=lambda w: w[3])[3] + 4
    return fitz.Rect(r.x0-12, r.y1+4, right, ybot)

if __name__=='__main__' and len(sys.argv) > 1 and sys.argv[1].isdigit():
    doc=fitz.open(SRC)
    for pn in map(int, sys.argv[1:]):
        page=doc[pn-1]; hs=find_headings(page)
        for h in hs:
            rr=plan_rect(page,h,hs)
            print(pn, h[0], rr)
            if rr:
                pix=page.get_pixmap(clip=rr, dpi=200)
                pix.save(f'{OUT}raw_p{pn:02d}_{h[0] or "X"}.png')

MANUAL = {23: fitz.Rect(660, 80, 952, 425), 24: fitz.Rect(622, 80, 970, 425), 25: fitz.Rect(628, 84, 916, 424), 26: fitz.Rect(622, 84, 895, 418)}
PAGES = [4, 5, 12, 13, 18, 19]
EXTRA = [(20, 'A', fitz.Rect(624, 84, 1062, 314)), (20, 'B', fitz.Rect(624, 456, 1032, 675)),
         (21, 'A', fitz.Rect(624, 84, 1010, 318)), (21, 'B', fitz.Rect(634, 456, 990, 680)),
         (22, 'A', fitz.Rect(620, 82, 962, 402)), (22, 'B', fitz.Rect(626, 452, 964, 776))]

def all_regions(doc):
    out = []
    for pn in PAGES:
        page = doc[pn-1]; hs = find_headings(page)
        for h in hs:
            rr = plan_rect(page, h, hs)
            if not rr: continue
            # apriboti dešinę: plano ir antresolės brėžiniai, be fasadų
            ws = page.get_text('words')
            caps = [w for w in ws if w[4] in ('PLAN', 'LOFT') and rr.y1 - 20 < w[3] <= rr.y1 + 1 and rr.x0 - 2 <= w[0] <= rr.x1]
            pl = [w for w in caps if w[4] == 'PLAN']; lo = [w for w in caps if w[4] == 'LOFT']
            if pl and lo:
                rr.x1 = min(rr.x1, lo[0][0] + (lo[0][0] - pl[0][0]) - 6)
            out.append((pn, h[0], rr))
    for pn, r in MANUAL.items(): out.append((pn, '', r))
    for pn, l, r in EXTRA: out.append((pn, l, r))
    return out

def spans_in(page, rect):
    res = []
    for b in page.get_text('dict', clip=rect)['blocks']:
        for l in b.get('lines', []):
            for s in l['spans']:
                t = s['text'].strip()
                if t: res.append((t, fitz.Rect(s['bbox']), s['size'], l['dir']))
    return res

LT = {
    'KÖK/VARDAGSRUM': 'VIRTUVĖ/SVETAINĖ', 'KÖK/ VARDAGSRUM': 'VIRTUVĖ/SVETAINĖ', 'KÖK/VARD.RUM': 'VIRTUVĖ/SVETAINĖ',
    'KÖK/V': 'VIRTUVĖ/SVET.', 'KÖK/': 'VIRTUVĖ/', 'VARDAGSRUM': 'SVETAINĖ', 'KÖK': 'VIRTUVĖ',
    'SOV': 'MIEGAMASIS', 'SOVRUM': 'MIEGAMASIS', 'SOV 1': 'MIEGAMASIS 1', 'SOV 2': 'MIEGAMASIS 2', 'SOV 3': 'MIEGAMASIS 3',
    'HALL': 'PRIEŠKAMBARIS', 'WC/D': 'WC/DUŠAS', 'BASTU': 'PIRTIS', 'PENTRY/ ALLRUM': 'POILSIO KAMBARYS',
    'KONTOR/ KÖK': 'KABINETAS/VIRTUVĖ', 'LOFT': 'ANTRESOLĖ', 'PLAN': 'PIRMAS AUKŠTAS', 'FRD': 'SANDĖLIUKAS',
}
DROP = {'G', 'TM', 'TM/TT', 'K/F', 'DM', 'DW', 'K', 'UP'}
FONT500 = FONT.replace('albert.ttf', 'albert500.ttf')

def teal(c):
    return c is not None and len(c) == 3 and c[0] < 0.2 and 0.3 < c[1] < 0.55 and 0.3 < c[2] < 0.55

def render(doc, pn, rect, out, dpi=220):
    page = doc[pn-1]
    for d in page.get_drawings():
        if teal(d.get('fill')) and d['rect'].intersects(rect):
            page.draw_rect(d['rect'] + (-2, -2, 2, 2), color=None, fill=(1, 1, 1), overlay=True)
    spans = spans_in(page, rect)
    page.insert_font(fontname='alb', fontfile=FONT500)
    for t, bb, sz, d in spans:
        key = t.strip()
        eng = any(ch.islower() for ch in key) and key not in ('m²',) and not key.endswith('m²')
        if key in LT or key in DROP or eng or key.startswith('”') or key.startswith('"'):
            page.draw_rect(bb + (-0.6, -0.4, 0.6, 0.4), color=None, fill=(1, 1, 1), overlay=True)
        if key in LT and d == (1.0, 0.0):
            new = LT[key]
            caption = key in ('PLAN', 'LOFT') and sz > 7
            size = sz
            w = fitz.get_text_length(new, fontname='helv', fontsize=size) * 1.05
            maxw = max(bb.width * (4.0 if caption else 2.4), 1)
            if w > maxw: size = size * maxw / w
            w = fitz.get_text_length(new, fontname='helv', fontsize=size) * 1.05
            x = bb.x0 if caption else bb.x0 + bb.width / 2 - w / 2
            page.insert_text((x, bb.y1 - (bb.height - size) / 2 - size * 0.2), new, fontsize=size, fontname='alb', color=(0.09, 0.13, 0.12), overlay=True)
    pix = page.get_pixmap(clip=rect, dpi=dpi)
    pix.save(out)

if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'all':
    doc = fitz.open(SRC)
    for pn, l, r in all_regions(doc):
        render(doc, pn, r, f'{OUT}p{pn:02d}_{l or "X"}.png')
        print('ok', pn, l)
