"""Generate a buildless GitHub Pages site from the publication table (standard library only)."""
from pathlib import Path
import csv
import html
import json
import hashlib
from collections import Counter

BASE = Path(__file__).resolve().parent
SCHOLAR = 'https://scholar.google.com/citations?hl=en&user=Kq_sijoAAAAJ&view_op=list_works&sortby=pubdate'
DOIS = {
    '_kc_bZDykSQC': '10.1073/pnas.2505929122',
    'KlAtU1dfN6UC': '10.1038/s41467-024-54631-1',
    '_FxGoFyzp5QC': '10.1103/PhysRevLett.131.076801',
    'Y0pCki6q_DkC': '10.1038/s41467-022-28538-8',
}
with (BASE / 'publications.tsv').open(encoding='utf-8', newline='') as source:
    papers = list(csv.DictReader(source, delimiter='\t'))
assert len({p['id'] for p in papers}) == len(papers), 'Duplicate publication IDs'
for p in papers:
    assert all(p.get(k) for k in ['id', 'year', 'title', 'authors', 'venue']), p
    p['year'] = int(p['year'])
    p['type'] = 'preprint' if 'arXiv' in p['venue'] else 'conference' if any(s in p['venue'] for s in ['SMT ', 'Bulletin of the American Physical Society', 'APS March Meeting Abstracts']) else 'journal'
    p['scholar_url'] = '' if p.get('source_url') else f"https://scholar.google.com/citations?view_op=view_citation&hl=en&user=Kq_sijoAAAAJ&citation_for_view=Kq_sijoAAAAJ:{p['id']}"
    p['doi'] = p.get('doi') or DOIS.get(p['id'], '')
    if p['doi']:
        p['url'] = 'https://doi.org/' + p['doi']
    elif p.get('source_url'):
        p['url'] = p['source_url']
    elif p['type'] == 'preprint':
        p['url'] = 'https://arxiv.org/abs/' + p['venue'].split('arXiv:')[1]
    else:
        p['url'] = p['scholar_url']
papers.sort(key=lambda p: -p['year'])
esc = html.escape
type_labels = {'journal': 'Journal article', 'preprint': 'Preprint', 'conference': 'Conference abstract'}
def paper_html(p):
    label = type_labels[p['type']]
    record_url = p['scholar_url'] or p['source_url']
    record_label = 'Scholar' if p['scholar_url'] else 'Publisher'
    search = esc(' '.join([p['title'], p['authors'], p['venue'], str(p['year'])]).lower(), quote=True)
    return f'''<article class="publication" data-year="{p['year']}" data-type="{p['type']}" data-search="{search}">
    <h4><a href="{esc(p['url'], quote=True)}" target="_blank" rel="noopener noreferrer">{esc(p['title'])} <span aria-hidden="true">↗</span></a></h4>
    <p class="authors">{esc(p['authors'])}</p>
    <p class="venue">{esc(p['venue'])} ({p['year']})<span class="record-type">{label} · <a href="{esc(record_url, quote=True)}" target="_blank" rel="noopener noreferrer">{record_label} ↗</a></span></p></article>'''
years = sorted({p['year'] for p in papers}, reverse=True)
archive = '\n'.join(f'<section class="publication-year-group" aria-label="Publications in {y}"><h4>{y}</h4><div>'+ '\n'.join(paper_html(p) for p in papers if p['year']==y) +'</div></section>' for y in years)
selected = []
short_journals = ['PNAS', 'Nature Communications', 'Physical Review Letters', 'Nature Communications']
notes = [
    'Electric-field control of interfacial water dissociation.',
    'A molecular picture of the electrical double layer.',
    'The microscopic origin of the dielectric decrement.',
    'Ion-induced changes in the hydrogen-bond network.',
]
by_id = {p['id']:p for p in papers}
for i, pid in enumerate(DOIS):
    p=by_id[pid]; note=notes[i]
    selected.append(f'''<article class="selected-work"><p class="paper-meta">{short_journals[i]} / {p['year']}</p><h3><a href="{esc(p['url'])}" target="_blank" rel="noopener noreferrer">{esc(p['title'])}</a></h3><p>{note}</p><a class="text-link" href="{esc(p['url'])}" target="_blank" rel="noopener noreferrer">Read the paper ↗</a></article>''')
output = (BASE/'index.template.html').read_text(encoding='utf-8')
output = output.replace('{{PUBLICATIONS}}', archive).replace('{{SELECTED}}', '\n'.join(selected)).replace('{{YEARS}}', ''.join(f'<option value="{y}">{y}</option>' for y in years))
output = output.replace('{{RECORD_COUNT}}', str(len(papers)))
# Refresh styles and behavior when local or hosted assets change.
for asset in ['styles.css', 'app.js']:
    revision = hashlib.sha256((BASE / asset).read_bytes()).hexdigest()[:10]
    output = output.replace(f'"{asset}"', f'"{asset}?v={revision}"')
assert '{{' not in output
(BASE/'index.html').write_text(output, encoding='utf-8')
(BASE/'publications.json').write_text(json.dumps({'source':SCHOLAR, 'retrieved':'2026-10-08', 'updated':'2026-10-10', 'additional_sources':[p['source_url'] for p in papers if p.get('source_url')], 'records':papers}, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(BASE/'.nojekyll').touch()
print(f'Built {len(papers)} records: {dict(Counter(p["type"] for p in papers))}')
