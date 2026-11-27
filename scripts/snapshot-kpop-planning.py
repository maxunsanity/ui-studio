"""Build a portable shelf from the planning tool's registered catalog."""
import argparse
import csv
from collections import Counter
from datetime import datetime
from html.parser import HTMLParser
from hashlib import sha256
import posixpath
import unicodedata
import json
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit
from zoneinfo import ZoneInfo

class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.urls.update(attrs[key] for key in ('href', 'src', 'poster') if attrs.get(key))
        if attrs.get('srcset'):
            self.urls.update(item.strip().split()[0] for item in attrs['srcset'].split(',') if item.strip())

def references(body, extension):
    parser = References()
    parser.feed(body)
    if extension == '.md':
        parser.urls.update(re.findall(r'\]\(\s*<([^>\n]+)>\s*\)', body))
        parser.urls.update(re.findall(r'\]\(\s*([^\s<)>]+)', body))
        parser.urls.update(re.findall(r'^\[[^\]\n]+\]:\s*<?([^>\s]+)', body, re.M))
    parser.urls.update(re.findall(r"""url\(\s*['"]?([^'"\s)]+)""", body))
    return parser.urls

def read_table(root, name):
    with (root / 'data' / (name + '.csv')).open(encoding='utf-8-sig', newline='') as handle:
        return list(csv.DictReader(handle))

def source_path(root, relative):
    parts = Path(relative).parts
    if not parts or parts[0] not in {'docs','data'} or Path(relative).name == 'play.html':
        return None
    if any(part in {'.git', '_backup', 'node_modules'} or part.startswith('.') for part in parts):
        return None
    resolved = (root / relative).resolve()
    return resolved if resolved.is_relative_to(root / parts[0]) and resolved.is_file() else None

def link_path(relative, url):
    try:
        split = urlsplit(url)
    except ValueError:
        return None
    if split.netloc and split.netloc not in {'127.0.0.1:7007', 'localhost:7007'}:
        return None
    if split.scheme not in {'','http','https'} or not split.path:
        return None
    target = unquote(split.path)
    combined = target.lstrip('/') if target.startswith('/') else str(Path(relative).parent / target)
    return posixpath.normpath(combined)

def build(root, output):
    groups = {row['content_id']:row['label_ko'] for row in read_table(root,'planning_content')}
    rows = read_table(root,'planning_doc_catalog')
    output.mkdir(parents=True, exist_ok=False)
    docs = []
    archive = {}
    linked = set()
    numbers = Counter(row['no'] for row in rows)
    for row in rows:
        relative = row['path'].lstrip('/')
        identity = row['no']
        key = identity if numbers[identity] == 1 and re.fullmatch(r'[A-Za-z0-9_-]+',identity) else 'doc-'+sha256((identity+'\0'+unicodedata.normalize('NFC',relative)).encode()).hexdigest()[:16]
        suffix = Path(relative).suffix.lower()
        data = dict(key=key, id=row['no'], title=row['title_ko'], group=groups.get(row['content'],row['content']),
                    shelf=row['shelf'], status=row['status'], summary=row['one_liner'], aliases=row['aliases'],
                    path=relative, historical=row['content'].startswith('archive') or row['shelf']=='history' or row['status'] in {'backup','deprecated'})
        is_paper = relative.startswith('docs/') and suffix in {'.md','.html'} and Path(relative).name != 'play.html'
        source = source_path(root,relative) if is_paper else None
        if not source and is_paper and row['no']=='P176':
            backups = root / 'docs/planning/_backup'
            candidates = [path for folder in backups.glob('20261030_*') for path in folder.rglob('*.html')
                          if unicodedata.normalize('NFC',path.name)==Path(relative).name and not path.is_symlink()
                          and path.resolve().is_relative_to(backups)]
            if len(candidates)==1:
                source=candidates[0]
                data.update(recoveredFrom=str(source.relative_to(root)), historical=True)
        data['availability'] = 'local' if source else ('missing' if is_paper else 'reference')
        if source:
            if relative not in archive:
                file = f'papers/{key}{suffix}.txt'
                (output / file).parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, output / file)
                archive[relative] = file
                for url in references(source.read_text(encoding='utf-8-sig', errors='replace'), suffix):
                    target = link_path(relative, url)
                    if target:
                        linked.add(target)
            data.update(file=archive[relative], format=suffix[1:])
            pair = str(Path(relative).with_suffix('.md'))
            paired = source_path(root,pair) if suffix=='.html' else None
            if paired:
                file = f'pairs/{key}.md.txt'
                (output / file).parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(paired, output / file)
                data.update(pair=file, pairPath=pair)
                for url in references(paired.read_text(encoding='utf-8-sig', errors='replace'), '.md'):
                    target = link_path(pair,url)
                    if target:
                        linked.add(target)
        docs.append(data)
    assets = {}
    suffixes = {'.png','.jpg','.jpeg','.webp','.gif','.avif','.svg','.pdf','.csv','.css','.woff','.woff2','.mp4','.webm','.txt'}
    while linked:
        relative = min(linked)
        linked.remove(relative)
        ext = Path(relative).suffix.lower()
        if relative in assets or ext not in suffixes:
            continue
        if not relative.startswith('docs/') and not (relative.startswith('data/') and ext=='.csv'):
            continue
        path = source_path(root,relative)
        if path is None:
            continue
        asset = f'assets/{len(assets)+1:04d}{ext}'
        (output / asset).parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(path,output / asset)
        assets[relative] = asset
        if ext == '.css':
            for url in references(path.read_text(encoding='utf-8-sig', errors='replace'), '.css'):
                target = link_path(relative,url)
                if target:
                    linked.add(target)
    for relative, file in assets.items():
        if not relative.endswith('.css'):
            continue
        path = output / file
        css = path.read_text(encoding='utf-8-sig', errors='replace')
        def css_url(match):
            target = assets.get(link_path(relative, match[2]))
            return 'url("' + (Path(target).name if target else 'about:blank') + '")'
        css = re.sub(r'url\(\s*([\"\']?)(.*?)\1\s*\)', css_url, css, flags=re.I)
        css = re.sub(r'@import[^;]*;', '', css, flags=re.I)
        path.write_text(css, encoding='utf-8')
    manifest = {'createdAt':datetime.now(ZoneInfo('Asia/Seoul')).isoformat(timespec='minutes'),'documents':docs,'assets':assets}
    (output/'catalog.json').write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    print(Counter(row['availability'] for row in docs), 'registered', len(docs), 'unique originals',len(archive), 'attachments',len(assets))

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('planning_project',type=Path)
    parser.add_argument('output',type=Path)
    args=parser.parse_args()
    build(args.planning_project.resolve(),args.output)
