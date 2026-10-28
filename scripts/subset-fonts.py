"""Regenerate licensed display-font subsets after changing headings.
Requires fonttools and the system fonts-noto-cjk package; no network requests.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTCollection
root = Path(__file__).resolve().parent.parent
text = (root / 'app.js').read_text() + ''.join(chr(i) for i in range(32, 127))
for path in (root / 'data').glob('*.js'):
    text += path.read_text()
collection = TTCollection('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc')
for lang, index in [('ja', 0), ('zh', 3)]:
    font = collection.fonts[index]
    sub = subset.Subsetter()
    sub.populate(text=text)
    sub.subset(font)
    for record in font['name'].names:
        if record.nameID in (1, 3, 4, 6, 16):
            record.string = ('FanFestGuideSerif-' + lang).encode(record.getEncoding())
    font.flavor = 'woff'
    target = root / 'fonts' / ('guide-serif-' + lang + '.woff')
    font.save(target)
    print(target.name, target.stat().st_size, 'bytes')
