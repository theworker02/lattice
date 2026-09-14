"""Generate M0 geometry, STL meshes, SCAD source, and orthographic CAD renders.
No external dependencies. All dimensions are millimetres; NOT production CAD.
"""
from pathlib import Path
import json, math

ROOT = Path(__file__).resolve().parents[1]
CAD = ROOT / 'manufacturing/cad'
RENDERS = ROOT / 'manufacturing/renders'
CAD.mkdir(parents=True, exist_ok=True)
RENDERS.mkdir(parents=True, exist_ok=True)
D = dict(width_mm=80, depth_mm=80, chassis_height_mm=24, wall_mm=2,
         floor_mm=2, lid_thickness_mm=1.2, pitch_mm=86, corner_key_mm=6)
(CAD / 'dimensions.json').write_text(json.dumps(D, indent=2)+'\n', encoding='utf-8')
outer = [(0,0),(80,0),(80,74),(74,80),(0,80)]
inner = [(2,2),(78,2),(78,73.172),(73.172,78),(2,78)]

def triangulate(points):
    return [(points[0],points[i],points[i+1]) for i in range(1,len(points)-1)]

def shell():
    ob=[(x,y,0) for x,y in outer]; ot=[(x,y,24) for x,y in outer]
    it=[(x,y,24) for x,y in inner]; ib=[(x,y,2) for x,y in inner]
    triangles=triangulate(list(reversed(ob)))+triangulate(ib)
    for i in range(5):
        j=(i+1)%5
        triangles+=triangulate([ob[i],ob[j],ot[j],ot[i]])
        triangles+=triangulate([ot[i],ot[j],it[j],it[i]])
        triangles+=triangulate([it[i],it[j],ib[j],ib[i]])
    return triangles

def lid():
    a=[(x,y,24) for x,y in outer];b=[(x,y,25.2) for x,y in outer]
    triangles=triangulate(list(reversed(a)))+triangulate(b)
    for i in range(5):
        j=(i+1)%5;triangles+=triangulate([a[i],a[j],b[j],b[i]])
    return triangles

def stl(name,triangles):
    lines=[f'solid {name}']
    for a,b,c in triangles:
        u=[b[i]-a[i] for i in range(3)];v=[c[i]-a[i] for i in range(3)]
        normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
        length=math.sqrt(sum(n*n for n in normal));normal=[n/length for n in normal]
        lines.append('facet normal '+' '.join(f'{n:.6f}' for n in normal));lines.append(' outer loop')
        for p in (a,b,c):lines.append('  vertex '+' '.join(str(n) for n in p))
        lines.extend([' endloop','endfacet'])
    lines.append(f'endsolid {name}')
    (CAD / f'{name}.stl').write_text('\n'.join(lines)+'\n',encoding='utf-8')

stl('m0-chassis',shell());stl('m0-cover',lid())
(CAD / 'mirrorfield-m0.scad').write_text('''// CONCEPT / M0. Dimensions in mm. No fasteners, connector or safety approval.
outer = [[0,0],[80,0],[80,74],[74,80],[0,80]];
inner = [[2,2],[78,2],[78,73.172],[73.172,78],[2,78]];
module chassis() { difference() {
  linear_extrude(24) polygon(outer);
  translate([0,0,2]) linear_extrude(23) polygon(inner);
} }
module cover() { translate([0,0,24]) linear_extrude(1.2) polygon(outer); }
color([0.22,0.25,0.28]) chassis();
color([0.65,0.7,0.75,0.65]) translate([0,0,20]) cover();
''',encoding='utf-8')

def projection(v,origin=(350,380),scale=3):
    x,y,z=v
    return origin[0]+scale*(x-y)*.866,origin[1]+scale*((x+y)*.5-z)

def polygon(points,fill,origin=(350,380),scale=3):
    xy=' '.join(f'{x:.1f},{y:.1f}' for x,y in (projection(p,origin,scale) for p in points))
    return f'<polygon points="{xy}" fill="{fill}" stroke="#8d9ca8" stroke-width=".6"/>'

def svg_start(title,width=1000,height=740):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="100%" height="100%" fill="#151a20"/><g fill="#e1e8ef" font-family="Arial"><text x="35" y="45" font-size="22">LATTICE / MIRRORFIELD</text><text x="35" y="73" font-size="12" fill="#9baab6">{title} · CONCEPT / M0 · millimetres</text></g>'

svg=svg_start('Exploded orthographic CAD render')
for z,poly,color in [(0,outer,'#252e37'),(24,outer,'#414f5b'),(24,inner,'#1b232b'),(51,outer,'#a2b3bf')]:
    svg+=polygon([(x,y,z) for x,y in poly],color)
for i in (0,1,2):
    j=(i+1)%5;svg+=polygon([(*outer[i],0),(*outer[j],0),(*outer[j],24),(*outer[i],24)],'#303c47')
svg+='<g fill="#b9c7d1" font-family="Arial" font-size="13"><text x="620" y="275">1.2 mm optical cover envelope</text><text x="620" y="315">27 mm exploded separation</text><text x="620" y="400">24 mm chassis / 2 mm walls</text><text x="620" y="430">Single keyed corner</text><text x="35" y="690">Envelope geometry only. No coating thickness, mounting, connector, PCB or motion mechanism implied.</text></g></svg>'
(RENDERS/'m0-exploded.svg').write_text(svg,encoding='utf-8')
svg=svg_start('4 × 4 array / 86 mm pitch',1100,900)
for row in range(4):
    for col in range(4):
        poly=[(x+col*86,y+row*86,0) for x,y in outer]
        top=[(x,y,24) for x,y,_ in poly]
        for i in (0,1,2):
            j=(i+1)%5;svg+=polygon([poly[i],poly[j],top[j],top[i]],'#28333e',(550,170),1.5)
        svg+=polygon(top,['#677886','#32404e','#899ca8','#3c4a57'][(row+col)%4],(550,170),1.5)
        x,y=projection((col*86+30,row*86+35,25),(550,170),1.5)
        svg+=f'<text x="{x}" y="{y}" fill="#e1e8ef" font-family="Arial" font-size="10">MF{row*4+col+1:02}</text>'
svg+='<text x="35" y="855" fill="#9baab6" font-family="Arial" font-size="12">338 × 338 mm cell footprint. Backplane, motion clearance and retention remain engineering work.</text></svg>'
(RENDERS/'m0-array.svg').write_text(svg,encoding='utf-8')
svg=svg_start('Dimensioned envelope / top and side views',1000,650)
svg+='<g transform="translate(70,150) scale(3)"><polygon points="0,0 80,0 80,74 74,80 0,80" fill="#34414d" stroke="#b9c7d1" stroke-width=".4"/><polygon points="2,2 78,2 78,73.172 73.172,78 2,78" fill="#1c252e" stroke="#9cadba" stroke-width=".3"/></g>'
svg+='<g stroke="#9cadba" fill="none"><path d="M70 125H310 M70 115V135 M310 115V135 M45 150V390 M35 150H55 M35 390H55"/><rect x="500" y="220" width="240" height="75.6"/><path d="M500 223.6H740 M770 220V295.6 M760 220H780 M760 295.6H780"/></g>'
svg+='<g fill="#c6d4df" font-family="Arial" font-size="14"><text x="170" y="115">80.0</text><text x="5" y="270">80.0</text><text x="785" y="260">25.2</text><text x="500" y="340">24.0 chassis + 1.2 cover</text><text x="70" y="445">2.0 wall / 2.0 floor / 6.0 keyed corner</text><text x="70" y="485">M0 target envelope ±0.3 mm, provisional; not a production tolerance.</text><text x="70" y="525">86 mm pitch → 6 mm nominal inter-cell gap. Tilt sweep unqualified.</text></g></svg>'
(ROOT/'manufacturing/drawings/m0-envelope.svg').write_text(svg,encoding='utf-8')
print('Generated 2 closed STL meshes, SCAD, dimensions and 3 CAD-derived SVG views.')
