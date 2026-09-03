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

FAVICON = ("data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2032%2032%22%3E%20%3Crect%20width=%2232%22%20height=%2232%22%20rx=%227%22%20fill=%22%236366F1%22/%3E%20%3Crect%20x=%229%22%20y=%225.5%22%20width=%2215%22%20height=%2219%22%20rx=%222.6%22%20fill=%22%23fff%22%20opacity=%22.32%22/%3E%20%3Crect%20x=%225.5%22%20y=%228%22%20width=%2215%22%20height=%2219%22%20rx=%222.6%22%20fill=%22%23fff%22/%3E%20%3Cpath%20d=%22M9%2013.5h5.5M9%2017.6h8M9%2021.7h4.5%22%20stroke=%22%236366F1%22%20stroke-width=%221.9%22%20stroke-linecap=%22round%22%20opacity=%22.5%22/%3E%20%3Cpath%20d=%22m14.2%2018.4%203%203%206.3-6.9%22%20fill=%22none%22%20stroke=%22%234F46E5%22%20stroke-width=%222.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22/%3E%20%3C/svg%3E")

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
