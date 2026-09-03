#!/usr/bin/env python3
"""Emit a WorksheetHub page shell with the shared <head>.

Usage: python3 tools/page.py <out.html> <title> <description> <module.js> [--depth N]
Body HTML is read from stdin. Keeps the head identical across pages so a
change to fonts, tokens or the favicon happens in exactly one place.
"""
import sys, pathlib

args = [a for a in sys.argv[1:] if not a.startswith('--')]
flags = dict(a.split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
out, title, desc, module = args[0], args[1], args[2], args[3]
depth = int(flags.get('--depth', 0))
p = '../' * depth
body_attr = f' data-base="{p.rstrip("/") or "."}"' if depth else ''

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
           "%3Crect width='32' height='32' rx='8' fill='%236366F1'/%3E%3Ctext x='16' y='23' "
           "font-family='Poppins,sans-serif' font-size='18' font-weight='700' fill='white' "
           "text-anchor='middle'%3EW%3C/text%3E%3C/svg%3E")

extra_css = flags.get('--css', '')
css = ['tokens', 'base', 'components', 'pages'] + ([extra_css] if extra_css else [])
links = '\n'.join(f'<link rel="stylesheet" href="{p}assets/css/{c}.css">' for c in css)

body = sys.stdin.read()

html = f'''<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="icon" href="{FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap">
{links}
</head>
<body{body_attr}>
{body.rstrip()}

<script type="module" src="{p}assets/js/pages/{module}"></script>
</body>
</html>
'''
pathlib.Path(out).parent.mkdir(parents=True, exist_ok=True)
pathlib.Path(out).write_text(html, encoding='utf-8')
print(f'wrote {out}')
