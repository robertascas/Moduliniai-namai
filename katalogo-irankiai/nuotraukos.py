"""Partnerio katalogo nuotraukų perdirbimas „Šilto karkaso“ stiliumi.

Kiekviena nuotrauka:
  1. veidrodiškai apverčiama (išskyrus vaizdus iš viršaus ir pjūvius, kurie turi atitikti išplanavimus),
  2. iš naujo sukadruojama (priartinama ~9 %, kadras pastumiamas skirtinga kryptimi),
  3. tonuojama vienu stiliumi: šiltesni šviesūs tonai, žalsvai melsvi šešėliai, švelnesnis sodrumas,
  4. pridedama švelni vinjetė ir smulkus grūdėtumas,
  5. išsaugoma WebP be metaduomenų nauju lietuvišku vardu.

Naudojimas: python3 nuotraukos.py <ištrauktų_nuotraukų_aplankas> <išvesties_aplankas>
"""
import os, sys, zlib
import numpy as np
from PIL import Image, ImageEnhance

M = {
    "namelis-30-tradicija": "p03_x84", "namelis-30-siaure": "p03_x87", "namelis-30-linija": "p03_x90", "namelis-30-pusynas": "p03_x93",
    "namelis-30-ziema": "p04_x148", "namelis-30-ruduo": "p06_x277", "namelis-30-pusynas-ruduo": "p10_x474", "namelis-30-ezeras": "p06_x258",
    "namelis-30-vidus": "p04_x141", "namelis-30-vidus-2": "p06_x280", "namelis-30-vidus-3": "p08_x383", "namelis-30-pjuvis": "p10_x494",
    "namelis-30-is-virsaus": "p08_x395", "namelis-30-is-virsaus-2": "p10_x502", "namelis-30-linija-2": "p08_x375", "namelis-30-pusynas-2": "p10_x491",
    "namas-40-siaure": "p12_x548", "namas-40-tradicija": "p14_x609", "namas-40-linija": "p16_x679",
    "namas-40-vidus": "p12_x597", "namas-40-vidus-2": "p14_x620", "namas-40-vidus-3": "p16_x691",
    "namas-50-siaure": "p13_x602", "namas-50-tradicija": "p15_x671", "namas-50-linija": "p17_x724",
    "namas-50-vidus": "p13_x605", "namas-50-vidus-2": "p15_x674", "namas-50-vidus-3": "p17_x727",
    "pusynas-45": "p18_x732", "pusynas-45-vidus": "p18_x735", "pusynas-50": "p19_x1090", "pusynas-50-vidus": "p19_x1093",
    "pusynas-60": "p20_x1130", "pusynas-60-is-virsaus": "p20_x1213", "pusynas-80": "p21_x1231", "pusynas-80-pastatytas": "p21_x1282",
    "pusynas-100": "p22_x1345", "pusynas-100-vidus": "p22_x1356",
    "horizontas-70": "p23_x1361", "horizontas-70-2": "p23_x1364", "horizontas-70-vidus": "p23_x1367", "horizontas-70-is-virsaus": "p23_x1378",
    "horizontas-91": "p24_x1394", "horizontas-91-vidus": "p24_x1462", "horizontas-91-miegamasis": "p24_x1406", "horizontas-91-is-virsaus": "p24_x1444",
    "horizontas-107": "p25_x1467", "horizontas-107-ziema": "p25_x1519", "horizontas-107-is-virsaus": "p25_x1473",
    "horizontas-124": "p26_x1532", "horizontas-124-vakaras": "p26_x1578", "horizontas-124-is-virsaus": "p26_x1542",
    "serija-siaure": "p11_x511", "serija-tradicija": "p11_x514", "serija-horizontas": "p11_x517", "serija-linija": "p11_x528", "serija-pusynas": "p11_x535",
    "interjeras": "p02_x59", "interjeras-2": "p31_x1716",
    "g-01": "p28_x1618", "g-02": "p28_x1621", "g-03": "p28_x1633", "g-04": "p28_x1636", "g-05": "p28_x1639", "g-06": "p28_x1645", "g-07": "p28_x1648",
    "g-08": "p28_x1651", "g-09": "p28_x1654", "g-10": "p29_x1661", "g-11": "p29_x1664", "g-12": "p29_x1670", "g-13": "p29_x1673", "g-14": "p29_x1676",
    "g-15": "p29_x1679", "g-16": "p29_x1682", "g-17": "p29_x1691", "g-18": "p29_x1694", "g-19": "p30_x1705",
}
NO_MIRROR = ("is-virsaus", "pjuvis")
ZOOM = 1.09


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def grade(im, seed):
    a = np.asarray(im).astype(np.float32) / 255.0
    lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    hi, lo = smooth(lum, 0.45, 1.0), 1 - smooth(lum, 0.0, 0.5)
    # šilti šviesūs tonai, žalsvai melsvi šešėliai
    a[..., 0] += 0.045 * hi - 0.020 * lo
    a[..., 1] += 0.012 * hi + 0.012 * lo
    a[..., 2] += -0.040 * hi + 0.030 * lo
    # švelni S kreivė ir pakeltas juodas taškas (matinis tonas)
    a = np.clip(a, 0, 1)
    a = a + 0.06 * np.sin(2 * np.pi * a) * (a * (1 - a)) * 4 * 0.5
    a = 0.025 + a * 0.965
    # vinjetė
    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    a *= (1 - 0.16 * smooth(r, 0.55, 1.45))[..., None]
    # grūdėtumas
    rng = np.random.default_rng(seed)
    a += rng.normal(0, 0.012, (h, w, 1)).astype(np.float32)
    out = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))
    return ImageEnhance.Color(out).enhance(0.92)


def reframe(im, seed, name):
    w, h = im.size
    cw, ch = int(w / ZOOM), int(h / ZOOM)
    # kadro poslinkis: kairėn, dešinėn arba centre, šiek tiek aukštyn ar žemyn
    fx = [0.15, 0.5, 0.85][seed % 3]
    fy = [0.35, 0.55][(seed // 3) % 2]
    x0, y0 = int((w - cw) * fx), int((h - ch) * fy)
    im = im.crop((x0, y0, x0 + cw, y0 + ch))
    return im.resize((w, h), Image.LANCZOS) if w <= 1600 else im


def main(raw, out):
    idx = {"_".join(f.split("_")[:2]): f for f in os.listdir(raw)}
    os.makedirs(out, exist_ok=True)
    for name, src in M.items():
        seed = zlib.crc32(name.encode())
        im = Image.open(os.path.join(raw, idx[src])).convert("RGB")
        if src == "p30_x1705":
            im = im.rotate(270, expand=True)
        if not any(k in name for k in NO_MIRROR):
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        im = reframe(im, seed, name)
        im = grade(im, seed)
        if im.width > 1600:
            im = im.resize((1600, int(im.height * 1600 / im.width)), Image.LANCZOS)
        im.save(os.path.join(out, name + ".webp"), "WEBP", quality=80, method=6)
        s = im.copy(); s.thumbnail((800, 800), Image.LANCZOS)
        s.save(os.path.join(out, name + "-800.webp"), "WEBP", quality=76, method=6)
    print(len(M), "nuotraukų perdirbta")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
