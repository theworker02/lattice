"""Dependency-free checks for generated CAD and local documentation/UI references."""
from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
from urllib.parse import unquote
import re, json, math

ROOT = Path(__file__).resolve().parents[1]
for name in ('m0-chassis','m0-cover'):
    raw=(ROOT/f'manufacturing/cad/{name}.stl').read_text(encoding='utf-8')
    points=[tuple(map(float,line.split()[1:])) for line in raw.splitlines() if line.strip().startswith('vertex ')]
    assert len(points)%3==0 and points
    edges=Counter();signed=Counter();volume=0
    for i in range(0,len(points),3):
        a,b,c=points[i:i+3]
        for p,q in ((a,b),(b,c),(c,a)):
            edges[tuple(sorted((p,q)))]+=1;signed[(p,q)]+=1
        volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6
    assert all(n==2 for n in edges.values()), f'{name}: open/nonmanifold edge'
    assert all(signed[(p,q)]==signed[(q,p)] for p,q in signed), f'{name}: inconsistent winding'
    assert volume>0, f'{name}: inverted mesh'
    assert max(p[0] for p in points)==80 and max(p[1] for p in points)==80
    assert math.isclose(max(p[2] for p in points),24 if name=='m0-chassis' else 25.2)
    print(f'{name}: {len(points)//3} triangles, closed oriented mesh, volume {volume:.2f} mm3')

class Page(HTMLParser):
    def __init__(self): super().__init__();self.ids=set();self.assets=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if 'src' in attrs:self.assets.append(attrs['src'])
        if tag in ('link','a') and 'href' in attrs:self.assets.append(attrs['href'])

for html,script in [('index.html','src/app.mjs'),('mirrorfield.html','src/mirrorfield-app.mjs'),('mirrorfield.html','src/cube-ui.mjs'),('mirrorfield.html','src/product-story.mjs')]:
    page=Page();page.feed((ROOT/html).read_text(encoding='utf-8'))
    references=set(re.findall(r"(?:\$|document\.getElementById)\('([^']+)'\)",(ROOT/script).read_text(encoding='utf-8')))
    assert not references-page.ids, references-page.ids
    for ref in page.assets:
        if not re.match(r'^(https?:|#)',ref):assert (ROOT/ref).exists(),ref
    print(f'{html}: IDs, literal script references and local assets resolve')

links=0
for file in ROOT.rglob('*.md'):
    for ref in re.findall(r'\]\(([^\s)]+)\)',file.read_text(encoding='utf-8')):
        if re.match(r'^(https?:|#|mailto:)',ref):continue
        target=unquote(ref.split('#')[0])
        assert (file.parent/target).exists(), f'{file.relative_to(ROOT)}: missing {ref}'
        links+=1
schema=json.loads((ROOT/'schemas/module-passport.schema.json').read_text(encoding='utf-8'))
assert schema['additionalProperties'] is False
assert len(schema['properties'])==len(schema['required'])
print(f'{links} local Markdown links resolve; passport schema parses')
