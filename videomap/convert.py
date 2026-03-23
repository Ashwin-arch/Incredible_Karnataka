import re

with open('d:/asxz/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Colors in root
text = text.replace(
    '--bg:#0f0f13;--surface:rgba(15,15,19,0.92);--surface2:rgba(22,22,30,0.95);',
    '--bg:#f8fafc;--surface:rgba(255,255,255,0.92);--surface2:rgba(241,245,249,0.95);'
)
text = text.replace(
    '--text:#f1f0eb;--text2:#9a9a8a;--text3:#52524a;',
    '--text:#0f172a;--text2:#475569;--text3:#64748b;'
)
text = text.replace(
    '--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);',
    '--border:rgba(0,0,0,0.08);--border2:rgba(0,0,0,0.12);'
)

# 2. Leaflet overrides
text = text.replace('background:#1a1f2e;', 'background:#f1f5f9;')
text = text.replace('filter:saturate(0.85) brightness(0.92);', 'filter:saturate(1.0) brightness(1.0);')
text = text.replace('rgba(30,30,40,0.98)', 'rgba(241,245,249,0.98)')

# 3. Top bar background
text = text.replace('background:rgba(10,10,14,0.95);', 'background:rgba(255,255,255,0.95);')
text = text.replace('background:rgba(10,12,14,0.92)', 'background:rgba(255,255,255,0.92)')

# 4. Filter rgba(255,255,255,0.xx) -> rgba(0,0,0,0.xx) for typical overlays and borders
text = re.sub(r'rgba\(255,255,255,0\.([0-9]+)\)', r'rgba(0,0,0,0.\1)', text)

# 5. Tile layer URL and player info bg
text = text.replace('dark_all', 'light_all')
text = text.replace("background:rgba(15,15,19,0.95)", "background:rgba(255,255,255,0.95)")

# 6. Tooltip and canvas logic
text = text.replace("className:'leaflet-tooltip-dark'", "className:'leaflet-tooltip'")
text = text.replace("ctx.fillStyle='#0f0f13'", "ctx.fillStyle='#f8fafc'")

# Save back
with open('d:/asxz/index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
