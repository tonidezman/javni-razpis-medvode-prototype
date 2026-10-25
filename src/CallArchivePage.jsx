import { useMemo, useState } from 'react';
import {
  Archive, CheckCircle2, ChevronRight, CircleDollarSign, Download, FileText, Files,
} from 'lucide-react';
import { areas, formatCurrency, formatNumber } from './data.js';
import {
  Badge, Button, DetailRow, EmptyState, Modal, PageHeader, SearchBox, StatusBadge,
} from './components/UI.jsx';

const archiveDocuments = [
  { name: 'Javni razpis in merila.pdf', size: '1,4 MB' },
  { name: 'Sklep o izboru programov.pdf', size: '860 KB' },
  { name: 'Končno poročilo o izvedbi razpisa.pdf', size: '2,1 MB' },
];

export default function CallArchivePage({ calls, role, notify }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('Vsa leta');
  const [area, setArea] = useState('Vsa področja');
  const [selected, setSelected] = useState(null);
  const years = useMemo(() => [...new Set(calls.map((call) => call.year))].sort((a, b) => b - a), [calls]);
  const filtered = useMemo(() => calls.filter((call) => {
    const matchesQuery = `${call.title} ${call.code} ${call.area}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesYear = year === 'Vsa leta' || call.year === Number(year);
    const matchesArea = area === 'Vsa področja' || call.area === area;
    return matchesQuery && matchesYear && matchesArea;
  }), [calls, query, year, area]);
  const totalApplications = calls.reduce((sum, call) => sum + call.applications, 0);
  const totalApproved = calls.reduce((sum, call) => sum + call.approved, 0);
  const totalBudget = calls.reduce((sum, call) => sum + call.budget, 0);
  const totalAwarded = calls.reduce((sum, call) => sum + call.awarded, 0);
  const clearFilters = () => { setQuery(''); setYear('Vsa leta'); setArea('Vsa področja'); };

  return (
    <div className="page">
      <PageHeader
        eyebrow={role === 'applicant' ? 'Javni razpisi' : 'Upravljanje razpisov'}
        title="Arhiv razpisov"
        description="Pregled zaključenih razpisov, izidov postopkov in arhivske dokumentacije."
        actions={<Button variant="secondary" icon={Download} onClick={() => notify('Pregled arhiva razpisov je pripravljen za izvoz v XLSX.')}>Izvozi pregled</Button>}
      />
      <div className="stats-grid">
        <article className="stat-card"><span className="stat-card__icon stat-card__icon--green"><Archive size={20} /></span><div className="stat-card__label">Arhivirani razpisi</div><strong>{calls.length}</strong><span className="stat-card__note">Obdobje {years[years.length - 1]}–{years[0]}</span></article>
        <article className="stat-card"><span className="stat-card__icon stat-card__icon--blue"><Files size={20} /></span><div className="stat-card__label">Prejete vloge</div><strong>{formatNumber(totalApplications)}</strong><span className="stat-card__note">V zaključenih postopkih</span></article>
        <article className="stat-card"><span className="stat-card__icon stat-card__icon--purple"><CheckCircle2 size={20} /></span><div className="stat-card__label">Odobreni programi</div><strong>{formatNumber(totalApproved)}</strong><span className="stat-card__note">{Math.round((totalApproved / totalApplications) * 100)} % vseh prejetih vlog</span></article>
        <article className="stat-card"><span className="stat-card__icon stat-card__icon--orange"><CircleDollarSign size={20} /></span><div className="stat-card__label">Dodeljena sredstva</div><strong>{formatCurrency(totalAwarded)}</strong><span className="stat-card__note">Skupni okvir {formatCurrency(totalBudget)}</span></article>
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar table-toolbar--filters">
          <SearchBox value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Išči po nazivu ali številki razpisa …" />
          <div>
            <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Leto razpisa"><option>Vsa leta</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
            <select value={area} onChange={(event) => setArea(event.target.value)} aria-label="Razpisno področje"><option>Vsa področja</option>{areas.map((item) => <option key={item.name}>{item.name}</option>)}</select>
          </div>
        </div>
        {filtered.length ? <div className="responsive-table"><table><thead><tr><th>Razpis</th><th>Področje</th><th>Zaključen</th><th>Prejete vloge</th><th className="align-right">Dodeljena sredstva</th><th>Status</th><th aria-label="Akcije" /></tr></thead><tbody>{filtered.map((call) => <tr key={call.id}><td data-label="Razpis"><strong>{call.title}</strong><span className="table-subline">{call.code} · objavljen {call.published}</span></td><td data-label="Področje"><Badge>{call.area}</Badge></td><td data-label="Zaključen">{call.completed}</td><td data-label="Prejete vloge"><strong>{call.applications}</strong><span className="table-subline">{call.approved} odobrenih programov</span></td><td data-label="Dodeljena sredstva" className="align-right"><strong>{formatCurrency(call.awarded)}</strong><span className="table-subline">Okvir {formatCurrency(call.budget)}</span></td><td data-label="Status"><StatusBadge tone="success">{call.status}</StatusBadge></td><td><Button size="sm" variant="ghost" onClick={() => setSelected(call)}>Preglej<ChevronRight size={14} /></Button></td></tr>)}</tbody></table></div> : <EmptyState action={<Button variant="secondary" size="sm" onClick={clearFilters}>Počisti filtre</Button>} />}
        <div className="table-footer"><span>Prikazanih {filtered.length} od {calls.length} razpisov</span><span><Archive size={14} />Dokumenti so shranjeni tudi v ODOS</span></div>
      </section>
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected ? `${selected.code} · Arhiv razpisa` : ''}
        size="lg"
        footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Zapri</Button><Button icon={Download} onClick={() => notify(`Arhivska dokumentacija za »${selected?.title}« je pripravljena za prenos.`)}>Prenesi dokumentacijo</Button></>}
      >
        {selected && <div className="call-detail">
          <div className="call-detail__intro"><StatusBadge tone="success">{selected.status}</StatusBadge><p>{selected.description}</p></div>
          <div className="detail-grid"><DetailRow label="Številka razpisa" value={selected.code} /><DetailRow label="Vsebinsko področje" value={selected.area} /><DetailRow label="Objavljen" value={selected.published} /><DetailRow label="Rok za oddajo" value={selected.deadline} /><DetailRow label="Zaključen" value={selected.completed} /><DetailRow label="Prejete vloge" value={`${selected.applications} · ${selected.approved} odobrenih`} /><DetailRow label="Okvir sredstev" value={formatCurrency(selected.budget)} /><DetailRow label="Dodeljena sredstva" value={formatCurrency(selected.awarded)} /></div>
          <div className="inline-notice inline-notice--success"><CheckCircle2 size={17} /><span>Postopek je zaključen. Razpisna dokumentacija, izdani sklepi in revizijska sled so shranjeni v arhivu.</span></div>
          <h3>Arhivska dokumentacija</h3>
          <div className="document-download-list">{archiveDocuments.map((document) => <button type="button" key={document.name} onClick={() => notify(`Dokument »${document.name}« je pripravljen za prenos.`)}><FileText size={18} /><span>{document.name}</span><small>{document.size}</small><Download size={17} /></button>)}</div>
        </div>}
      </Modal>
    </div>
  );
}
