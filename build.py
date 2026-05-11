import re, os, sys

REPO = os.path.dirname(os.path.abspath(__file__))

# Order matters — each file may reference symbols from previous files
SRC_FILES = [
    'src/constants.jsx',
    'src/icons.jsx',
    'src/modals.jsx',
    'src/detail.jsx',
    'src/profile.jsx',
    'src/create.jsx',
    'src/messages.jsx',
    'src/pages.jsx',
    'src/app.jsx',
]

def build():
    parts = []
    for f in SRC_FILES:
        path = os.path.join(REPO, f)
        with open(path, 'r', encoding='utf-8') as fh:
            parts.append(f'/* ====== {f} ====== */\n' + fh.read())
    combined = '\n\n'.join(parts)

    index_path = os.path.join(REPO, 'index.html')
    with open(index_path, 'r', encoding='utf-8') as fh:
        html = fh.read()

    # Replace everything between the babel script tags
    pattern = r'(<script type="text/babel" data-presets="env,react">)[\s\S]*?(</script>)'
    new_html, count = re.subn(
        pattern,
        lambda m: m.group(1) + '\n' + combined + '\n' + m.group(2),
        html
    )

    if count == 0:
        print('ERROR: Could not find babel script block in index.html', file=sys.stderr)
        sys.exit(1)

    with open(index_path, 'w', encoding='utf-8') as fh:
        fh.write(new_html)

    total_lines = sum(len(open(os.path.join(REPO, f)).readlines()) for f in SRC_FILES)
    print(f'Build OK — {len(SRC_FILES)} files, {total_lines} lines → index.html')

if __name__ == '__main__':
    build()
