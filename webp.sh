# Convert PNG -> WEBP
for png in public/*.png; do cwebp "$png" -o "${png/%.png}.webp"; done
# Cleanup PNG in dist folder
rm dist/*.png