from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MEDIA_ROOT = ROOT / "public" / "media"
VIDEO_EXTS = {".mp4", ".webm", ".mov"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".svg"}
MEMBER_SLOTS = [
    {
        "name": "Nigam Mukherjee",
        "role": "Singer",
        "aliases": {"singer", "nigam", "nigammukherjee"},
    },
    {
        "name": "Abhigyan Pal",
        "role": "Guitarist",
        "aliases": {"guitarist", "abhigyan", "abhigyanpal"},
    },
    {
        "name": "Aviroop Chakraborty",
        "role": "Drummer",
        "aliases": {"drummer", "aviroop", "aviroopchakraborty"},
    },
    {
        "name": "Ankan Das",
        "role": "Guitarist",
        "aliases": {"guitarist2", "ankan", "ankandas"},
    },
    {
        "name": "Anuroop Chakraborty",
        "role": "Bassist",
        "aliases": {"bassist", "anuroop", "anuroopchakraborty"},
    },
]


def rel_url(path: Path) -> str:
    return "./" + path.relative_to(ROOT).as_posix()


def title_from_name(name: str) -> str:
    return name.replace("-", " ").replace("_", " ").title()


def normalized_name(value: str) -> str:
    return "".join(character.lower() for character in value if character.isalnum())


def build_manifest() -> dict:
    hero_dir = MEDIA_ROOT / "hero"
    logo_dir = MEDIA_ROOT / "logo"
    members_dir = MEDIA_ROOT / "members"
    achievements_dir = MEDIA_ROOT / "achievements"
    certificates_dir = MEDIA_ROOT / "certificates"
    videos_dir = MEDIA_ROOT / "videos"
    gallery_dir = MEDIA_ROOT / "gallery"

    hero_image = None
    if hero_dir.exists():
        for item in sorted(hero_dir.iterdir()):
            if item.is_file() and item.suffix.lower() in IMAGE_EXTS:
                hero_image = rel_url(item)
                break

    logo_image = None
    if logo_dir.exists():
        for item in sorted(logo_dir.iterdir()):
            if item.is_file() and item.suffix.lower() in IMAGE_EXTS:
                logo_image = rel_url(item)
                break

    member_images = []
    if members_dir.exists():
        member_images = [
            item
            for item in sorted(members_dir.iterdir())
            if item.is_file() and item.suffix.lower() in IMAGE_EXTS
        ]

    assigned_images = {}
    used_images = set()
    for slot_index, slot in enumerate(MEMBER_SLOTS):
        aliases = {normalized_name(alias) for alias in slot["aliases"]}
        image = next(
            (
                item
                for item in member_images
                if item not in used_images
                and (
                    normalized_name(item.stem) in aliases
                    or any(alias in normalized_name(item.stem) for alias in aliases)
                )
            ),
            None,
        )
        if image is not None:
            assigned_images[slot_index] = image
            used_images.add(image)

    remaining_images = [item for item in member_images if item not in used_images]
    for slot_index in range(len(MEMBER_SLOTS)):
        if slot_index not in assigned_images and remaining_images:
            assigned_images[slot_index] = remaining_images.pop(0)

    members = []
    for slot_index, slot in enumerate(MEMBER_SLOTS):
        image = assigned_images.get(slot_index)
        members.append(
            {
                "name": slot["name"],
                "role": slot["role"],
                "intro": "",
                "image": rel_url(image) if image else "",
                "alt": f"Aaroho {slot['name']}",
            }
        )

    achievement_assets = []
    for content_dir in (achievements_dir, certificates_dir):
        if content_dir.exists():
            achievement_assets.extend(
                item
                for item in sorted(content_dir.iterdir())
                if item.is_file() and item.suffix.lower() in IMAGE_EXTS
            )

    achievements = []
    certificates = []
    for item in achievement_assets:
        title = title_from_name(item.stem)
        year_match = re.search(r"(?:19|20)\d{2}", item.stem)
        year = year_match.group(0) if year_match else ""
        image = rel_url(item)
        achievements.append(
            {
                "year": year,
                "category": "RECOGNITION",
                "title": title,
                "description": "",
            }
        )
        certificates.append(
            {
                "image": image,
                "title": title,
                "year": year,
            }
        )

    videos = []
    if videos_dir.exists():
        for item in sorted(videos_dir.iterdir()):
            if item.is_file() and item.suffix.lower() in VIDEO_EXTS:
                videos.append(
                    {
                        "title": title_from_name(item.stem),
                        "year": "",
                        "src": rel_url(item),
                        "poster": hero_image or "./public/media/hero/band-group-photo.jpg",
                    }
                )

    gallery = []
    if gallery_dir.exists():
        for item in sorted(gallery_dir.iterdir()):
            if item.is_file() and item.suffix.lower() in IMAGE_EXTS:
                gallery.append(
                    {
                        "type": "image",
                        "image": rel_url(item),
                        "caption": title_from_name(item.stem),
                    }
                )
            elif item.is_file() and item.suffix.lower() in VIDEO_EXTS:
                gallery.append(
                    {
                        "type": "video",
                        "video": rel_url(item),
                        "caption": title_from_name(item.stem),
                        "poster": hero_image or "/public/media/hero/band-group-photo.jpg",
                    }
                )

    return {
        "name": "Aaroho",
        "tagline": "MUSIC. ENERGY. SOUL.",
        "logo": logo_image or "./public/media/logo/aaroho-logo.png",
        "heroImage": hero_image or "./public/media/hero/band-group-photo.jpg",
        "members": members,
        "achievements": achievements,
        "certificates": certificates,
        "videos": videos,
        "gallery": gallery,
        "socialLinks": {
            "instagram": "",
            "youtube": "",
            "spotify": "",
        },
    }


def main() -> None:
    manifest = build_manifest()
    manifest_path = MEDIA_ROOT / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Manifest written to {manifest_path}")
    print(f"Videos found: {len(manifest['videos'])}")
    print(f"Gallery images found: {len(manifest['gallery'])}")


if __name__ == "__main__":
    main()
