# Display type

The two local WOFF files are renamed, subset copies of Noto Serif CJK Bold,
provided by the environment's Debian `fonts-noto-cjk` package. They use the
Japanese (collection index 0) and Traditional Chinese (index 3) glyph variants.
The upstream license and attribution are preserved in LICENSE.txt (SIL OFL 1.1).

Subsets include the characters in app.js and the data modules, plus ASCII. Regenerate with `python3 scripts/subset-fonts.py` (fonttools and the system fonts-noto-cjk package required). They are used for static
page titles and the wordmark; body text uses native sans-serif stacks, including
fallbacks for user-entered text. When changing headings, regenerate the subsets
or extend their character coverage. The families are renamed FanFestGuideSerif-ja
and FanFestGuideSerif-zh because the subset files are modifications.

Both fonts are precached for offline use. No external font requests are made.
