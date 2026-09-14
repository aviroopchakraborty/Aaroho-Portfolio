from __future__ import annotations

import json
import time
from pathlib import Path

from generate_media_manifest import build_manifest

ROOT = Path(__file__).resolve().parent
MEDIA_ROOT = ROOT / "public" / "media"
MANIFEST_PATH = MEDIA_ROOT / "manifest.json"


def snapshot_media() -> list[tuple[str, int, int]]:
    files: list[tuple[str, int, int]] = []
    for path in sorted(MEDIA_ROOT.rglob("*")):
        if path.is_file() and path.name != MANIFEST_PATH.name:
            stat = path.stat()
            files.append((str(path.relative_to(ROOT)), int(stat.st_mtime_ns), int(stat.st_size)))
    return files


def write_manifest() -> None:
    manifest = build_manifest()
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Updated manifest at {MANIFEST_PATH}")


def main() -> None:
    last_snapshot = snapshot_media()
    write_manifest()
    print("Watching media folder for changes...")

    while True:
        current_snapshot = snapshot_media()
        if current_snapshot != last_snapshot:
            last_snapshot = current_snapshot
            write_manifest()
        time.sleep(2)


if __name__ == "__main__":
    main()
