#!/usr/bin/env python3
"""Static validation for imagetoolss marketing/conversion bug fixes."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def assert_pricing_ctas_do_not_route_to_background_tool() -> None:
    src = read("src/app/pricing/pricing-content.tsx")
    forbidden = 'href="/tools/background-remover"'
    assert forbidden not in src, f"pricing CTA still uses forbidden {forbidden}"
    assert "loginHref(" in src or "/login?next=" in src, "pricing CTA must preserve auth/checkout intent"


def assert_core_i18n_keys_present() -> None:
    src = read("src/lib/i18n.tsx")
    required = [
        "nav_merge_images",
        "nav_compress_image",
        "nav_crop_image",
        "hero_view_all",
        "signin",
        "create_account",
        "continue_with_google",
        "continue_with_github",
        "terms",
        "privacy",
        "back_home",
        "buy_now",
        "subscribe_now",
        "invalid_email",
    ]
    for key in required:
        assert src.count(f"{key}:") >= 2, f"missing bilingual i18n key: {key}"


def assert_signup_noindex() -> None:
    src = read("src/app/signup/page.tsx")
    assert "robots" in src and "index: false" in src and "follow: false" in src, "signup must be noindex,nofollow"


def assert_sitemap_has_all_public_tools() -> None:
    src = read("src/app/sitemap.ts")
    for path in ["/tools/merge-images", "/tools/compress-image", "/tools/crop-image"]:
        assert path in src, f"sitemap missing {path}"


def assert_legacy_redirects_exist() -> None:
    candidates = [ROOT / "next.config.ts", ROOT / "next.config.mjs", ROOT / "next.config.js"]
    src = "\n".join(p.read_text(encoding="utf-8") for p in candidates if p.exists())
    for path in ["/compress-image", "/merge-images", "/crop-image"]:
        assert path in src, f"missing legacy redirect for {path}"


def assert_no_obvious_raw_i18n_keys_in_static_source() -> None:
    # This catches hardcoded output keys in UI text; t("...") usages are allowed.
    for rel in [
        "src/components/header.tsx",
        "src/components/hero.tsx",
        "src/app/login/login-client.tsx",
        "src/app/signup/signup-client.tsx",
    ]:
        src = read(rel)
        stripped = re.sub(r't\("[a-z0-9_]+"(?:,\s*"[^"]*")?\)', 't()', src)
        assert not re.search(r">\s*(nav|hero|signin|create_account|continue_with|terms|privacy)[a-z0-9_]*\s*<", stripped), rel


def assert_conversion_proof_present() -> None:
    proof = read("src/components/conversion-proof.tsx")
    assert "proof_before" in proof and "proof_after" in proof, "conversion proof must show before/after visual"
    assert "proof_primary_cta" in proof and "/tools/background-remover" in proof, "conversion proof needs primary CTA"
    for rel in ["src/app/page.tsx", "src/app/tools/tools-client.tsx"]:
        assert "ConversionProof" in read(rel), f"{rel} must render conversion proof"


def main() -> None:
    assert_pricing_ctas_do_not_route_to_background_tool()
    assert_core_i18n_keys_present()
    assert_signup_noindex()
    assert_sitemap_has_all_public_tools()
    assert_legacy_redirects_exist()
    assert_no_obvious_raw_i18n_keys_in_static_source()
    assert_conversion_proof_present()
    print("marketing fix static validation passed")


if __name__ == "__main__":
    main()
