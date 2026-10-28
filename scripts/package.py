"""Create an upload-ready static site and ZIP, without development files."""
from pathlib import Path
import shutil
import zipfile
root = Path(__file__).resolve().parent.parent
site = root / 'dist' / 'site'
if site.exists():
    shutil.rmtree(site)
site.mkdir(parents=True)
(site / '.nojekyll').write_text('')
for name in ['index.html', 'styles.css', 'app.js', 'sw.js', 'manifest.webmanifest']:
    shutil.copy2(root / name, site / name)
for name in ['data', 'icons', 'fonts', 'assets']:
    shutil.copytree(root / name, site / name)
with zipfile.ZipFile(root / 'dist' / 'fanfest-note.zip', 'w', zipfile.ZIP_DEFLATED) as bundle:
    for path in sorted(site.rglob('*')):
        if path.is_file():
            bundle.write(path, path.relative_to(site))
    bundle.writestr('START-HERE.txt', 'FanFest Note — Traditional Chinese / Japanese\n\nUpload these files to any HTTPS static host. No build step or server backend is needed.\nFor local viewing: python3 -m http.server 8080\nOpen through HTTP, not file://. Offline mode requires HTTPS or localhost.\nWait for the offline-ready indicator before disconnecting.\nOfficial information was verified on 2026-10-28; schedules can change.\n')
print('Static site:', site)
print('ZIP:', root / 'dist' / 'fanfest-note.zip')
