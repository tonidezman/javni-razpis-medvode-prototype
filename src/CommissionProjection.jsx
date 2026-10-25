import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, CheckCircle2, Download, FileText, ShieldCheck, X,
} from 'lucide-react';
import { criteria, formatCurrency } from './data.js';

const projectionCalls = [
  {
    area: 'Kultura', budget: 310000, session: '30. 10. 2026',
    programs: [
      { id: 'JR-2026-0138', name: 'Gledališče za vse generacije', applicant: 'Gledališko društvo Sora', amount: 82000, scores: [27, 23, 18, 13, 9] },
      { id: 'JR-2026-0132', name: 'Festival ob Sori', applicant: 'KUD Medvode', amount: 18200, scores: [25, 21, 17, 13, 8] },
      { id: 'JR-2026-0144', name: 'Mladi pojejo domači kraj', applicant: 'Pevski zbor Medvode', amount: 140000, scores: [24, 19, 18, 11, 9] },
      { id: 'JR-2026-0129', name: 'Literarni utrip Medvod', applicant: 'Društvo književnikov Sora', amount: 96000, scores: [21, 22, 16, 12, 8] },
      { id: 'JR-2026-0141', name: 'Glasbena šola v naravi', applicant: 'Glasbeno društvo Medvode', amount: 27500, scores: [23, 20, 15, 12, 8] },
      { id: 'JR-2026-0146', name: 'Ustvarjalna delavnica v vasi', applicant: 'KUD Sora', amount: 14800, scores: [22, 19, 15, 11, 7] },
    ],
  },
  {
    area: 'Šport', budget: 420000, session: '5. 11. 2026',
    programs: [
      { id: 'JR-2026-0162', name: 'Mladinci U18', applicant: 'Košarkarski klub Medvode', amount: 42000, scores: [27, 22, 17, 13, 8] },
      { id: 'JR-2026-0158', name: 'Atletika mladih', applicant: 'Atletski klub Medvode', amount: 38500, scores: [25, 20, 16, 11, 7] },
      { id: 'JR-2026-0168', name: 'Tekmovalna košarka — člani', applicant: 'Športno društvo Medvode', amount: 56000, scores: [23, 19, 14, 10, 6] },
      { id: 'JR-2026-0154', name: 'Planinstvo mladih', applicant: 'ŠD Smlednik', amount: 24400, scores: [22, 17, 13, 9, 6] },
      { id: 'JR-2026-0171', name: 'Namizni tenis', applicant: 'ŠD Seničica', amount: 12600, scores: [18, 14, 11, 7, 5] },
      { id: 'JR-2026-0149', name: 'Odbojka rekreativk', applicant: 'ŠD Vikrče', amount: 9800, scores: [15, 11, 8, 6, 4] },
      { id: 'JR-2026-0165', name: 'Rekreativni tek ob Sori', applicant: 'ŠD Preska', amount: 15200, scores: [14, 10, 8, 6, 4] },
      { id: 'JR-2026-0174', name: 'Športna vadba gasilske mladine', applicant: 'PGD Medvode', amount: 11800, scores: [15, 11, 8, 5, 4], excluded: true },
    ],
  },
  {
    area: 'Prireditve', budget: 60000, session: '12. 11. 2026',
    programs: [
      { id: 'JR-2026-0204', name: 'Festival ob Sori', applicant: 'KUD Medvode', amount: 12000, scores: [26, 22, 17, 12, 8] },
      { id: 'JR-2026-0208', name: 'Medvodske jesenske prireditve', applicant: 'Zavod za turizem Medvode', amount: 9800, scores: [24, 20, 16, 12, 8] },
      { id: 'JR-2026-0211', name: 'Dnevi podeželja', applicant: 'Turistično društvo Medvode', amount: 7600, scores: [23, 19, 15, 11, 7] },
      { id: 'JR-2026-0215', name: 'Mladinski oder', applicant: 'Mladinski center Medvode', amount: 5400, scores: [21, 18, 14, 10, 7] },
      { id: 'JR-2026-0218', name: 'Novogodišnji koncert', applicant: 'Glasbeno društvo Medvode', amount: 8200, scores: [20, 17, 14, 10, 6] },
    ],
  },
  {
    area: 'Mladina', budget: 85000, session: '19. 11. 2026',
    programs: [
      { id: 'JR-2026-0096', name: 'Mladi ustvarjajo skupnost', applicant: 'Mladinski center Medvode', amount: 12500, scores: [27, 23, 18, 14, 9] },
      { id: 'JR-2026-0102', name: 'Mladinski prostovoljski teden', applicant: 'Društvo prijateljev mladine', amount: 8400, scores: [25, 21, 17, 12, 8] },
      { id: 'JR-2026-0107', name: 'Digitalne delavnice', applicant: 'Mladinski center Medvode', amount: 11200, scores: [24, 20, 16, 12, 8] },
      { id: 'JR-2026-0111', name: 'Mladinska participacija', applicant: 'Štipendijski sklad Medvode', amount: 6900, scores: [22, 19, 15, 11, 7] },
      { id: 'JR-2026-0115', name: 'Počitniške aktivnosti', applicant: 'ŠD Sora', amount: 15800, scores: [21, 18, 14, 10, 7] },
    ],
  },
  {
    area: 'Turizem', budget: 125000, session: '26. 11. 2026',
    programs: [
      { id: 'JR-2026-0124', name: 'Kolesarske poti in doživetja', applicant: 'Zavod za turizem Medvode', amount: 32000, scores: [27, 23, 18, 12, 8] },
      { id: 'JR-2026-0127', name: 'Usmerjevalne table ob poti', applicant: 'Turistično društvo Medvode', amount: 4800, scores: [25, 21, 16, 12, 8] },
      { id: 'JR-2026-0131', name: 'Zemljevid pohodnih poti', applicant: 'Turistično društvo Medvode', amount: 3600, scores: [23, 20, 15, 11, 7] },
      { id: 'JR-2026-0135', name: 'Doživetje podeželja', applicant: 'Kmetija Novak', amount: 18500, scores: [22, 18, 14, 10, 7] },
      { id: 'JR-2026-0139', name: 'Kulinarika Medvod', applicant: 'Društvo podeželskih žena', amount: 12200, scores: [20, 17, 14, 10, 6] },
    ],
  },
];

const projectionTabs = [
  { id: 'formal', label: 'Formalno', sessionLabel: 'Formalni pregled' },
  { id: 'points', label: 'Točke', sessionLabel: 'Vrednotenje programov' },
  { id: 'allocation', label: 'Delitev', sessionLabel: 'Delitev sredstev' },
  { id: 'documents', label: 'Listine', sessionLabel: 'Listine in priloge' },
  { id: 'requests', label: 'Zahtevki', sessionLabel: 'Zahtevki in poročila' },
];

const getPoints = (program) => program.scores.reduce((sum, score) => sum + score, 0);

function PanelHeading({ eyebrow, title, description }) {
  return <header className="projection-panel__header"><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</header>;
}

function FormalReview({ program }) {
  const checks = [
    'Vloga je pravočasno oddana in veljavno elektronsko podpisana.',
    'Vlagatelj izpolnjuje formalne pogoje razpisa.',
    'Obvezni obrazci so popolni in medsebojno skladni.',
    'Vse zahtevane priloge so priložene in berljive.',
  ];
  return <section className="projection-panel">
    <PanelHeading eyebrow={`${program.id} · ${program.applicant}`} title="Formalni pregled vloge" description="Soglasni pregled obveznih pogojev in prilog pred vsebinskim vrednotenjem." />
    <div className="projection-detail-grid"><div><span>Vlagatelj</span><strong>{program.applicant}</strong></div><div><span>Program</span><strong>{program.name}</strong></div><div><span>Zahtevani znesek</span><strong>{formatCurrency(program.amount)}</strong></div><div><span>Stanje vloge</span><strong>Popolna · 100 %</strong></div></div>
    <div className="projection-checklist">{checks.map((check) => <div key={check}><CheckCircle2 size={19} /><span>{check}</span><b>Pregledano</b></div>)}</div>
  </section>;
}

function ScoreReview({ program, notify }) {
  const total = getPoints(program);
  return <section className="projection-panel">
    <PanelHeading eyebrow={`${program.id} · ${program.applicant}`} title={program.name} description="Soglasna ocena komisije po petih vsebinskih merilih." />
    <div className="projection-table-wrap"><table className="projection-table projection-score-table"><thead><tr><th>Merilo</th><th>Največ točk</th><th>Ocena komisije</th></tr></thead><tbody>{criteria.map((criterion, index) => <tr key={criterion.id}><td><strong>{criterion.label}</strong><span className="projection-cell-subline">{criterion.description}</span></td><td>{criterion.max}</td><td><strong className="projection-point-value">{program.scores[index]}</strong></td></tr>)}</tbody></table></div>
    <footer className="projection-score-footer"><div><span>Skupna ocena</span><strong>{total}<small> / 100</small></strong></div><button type="button" className="projection-primary-action" onClick={() => notify(`Soglasna ocena programa »${program.name}« je potrjena (${total} točk).`)}><Check size={16} />Potrdi skupno oceno</button></footer>
  </section>;
}

function AllocationReview({ programs, budget }) {
  const eligible = programs.filter((program) => !program.excluded);
  const totalPoints = eligible.reduce((sum, program) => sum + getPoints(program), 0);
  const allocations = programs.map((program) => ({ ...program, allocation: program.excluded ? 0 : Math.min(program.amount, Math.round((budget * getPoints(program)) / totalPoints)) }));
  const allocated = allocations.reduce((sum, program) => sum + program.allocation, 0);
  return <section className="projection-panel">
    <PanelHeading eyebrow="Rang lista · Komisija" title="Predlog delitve sredstev" description="Razporeditev po soglasnih točkah z upoštevanjem zgornjih mej posameznih programov." />
    <div className="projection-summary-grid"><div><span>Okvir razpisa</span><strong>{formatCurrency(budget)}</strong></div><div><span>Predlagana dodelitev</span><strong>{formatCurrency(allocated)}</strong></div><div><span>Nerazporejeno</span><strong>{formatCurrency(budget - allocated)}</strong></div></div>
    <div className="projection-table-wrap"><table className="projection-table"><thead><tr><th>Rang</th><th>Program / vlagatelj</th><th>Točke</th><th>Zahtevano</th><th>Predlog dodelitve</th></tr></thead><tbody>{allocations.map((program, index) => <tr key={program.id}><td>{program.excluded ? '—' : index + 1}</td><td><strong>{program.name}</strong><span className="projection-cell-subline">{program.applicant}{program.excluded ? ' · izven delitve' : ''}</span></td><td><strong>{getPoints(program)}</strong></td><td>{formatCurrency(program.amount)}</td><td><strong className="projection-allocation-value">{program.excluded ? '—' : formatCurrency(program.allocation)}</strong></td></tr>)}</tbody></table></div>
  </section>;
}

function DocumentsReview({ program, notify }) {
  const documents = [
    { name: `Podpisana_vloga_${program.id}.pdf`, meta: 'Vloga · 1,8 MB' },
    { name: 'Program_in_financni_nacrt.pdf', meta: 'Obrazec · 940 KB' },
    { name: 'Potrdilo_o_registraciji.pdf', meta: 'Priloga · 620 KB' },
    { name: 'Izjave_in_soglasja.pdf', meta: 'Priloga · 480 KB' },
  ];
  return <section className="projection-panel">
    <PanelHeading eyebrow={`${program.id} · ${program.applicant}`} title="Listine in priloge" description={`Dokumenti programa »${program.name}« za skupni pregled na seji.`} />
    <div className="projection-documents">{documents.map((document) => <button type="button" key={document.name} onClick={() => notify(`Dokument »${document.name}« je pripravljen za projekcijo in prenos.`)}><span><FileText size={21} /></span><div><strong>{document.name}</strong><small>{document.meta}</small></div><Download size={18} /></button>)}</div>
    <div className="projection-security-note"><ShieldCheck size={17} /><span>Dokumenti so sinhronizirani z ODOS. Dostop in ogledi so zabeleženi v revizijski sledi.</span></div>
  </section>;
}

function requestStatus(status) {
  if (status === 'V pregledu') return { label: 'v pregledu', className: 'pending' };
  if (status === 'Zavrnjeno') return { label: 'zavrnjeno', className: 'rejected' };
  if (status === 'Izplačano') return { label: 'izplačano', className: 'approved' };
  if (status === 'Delno izplačano') return { label: 'delno izplačano', className: 'approved' };
  return { label: 'odobreno', className: 'approved' };
}

function RequestsReview({ requests, onUpdate }) {
  return <section className="projection-panel">
    <PanelHeading eyebrow="Realizacija · Finančni pregled" title="Zahtevki v pregledu in odobreni" description="Skupni pregled zahtevkov, računov in odločitev komisije." />
    <div className="projection-table-wrap"><table className="projection-table projection-requests-table"><thead><tr><th>Datum</th><th>Vlagatelj</th><th>Račun</th><th>Znesek</th><th>Status</th><th aria-label="Akcije" /></tr></thead><tbody>{requests.map((request) => { const status = requestStatus(request.status); return <tr key={request.id}><td>{request.date}</td><td><strong>{request.applicant}</strong><span className="projection-cell-subline">{request.program}</span></td><td><strong>{request.id}</strong><span className="projection-cell-subline">{request.invoices} računi · PDF</span></td><td><strong>{formatCurrency(request.amount)}</strong></td><td><span className={`projection-status projection-status--${status.className}`}>{status.label}</span></td><td>{request.status === 'V pregledu' ? <div className="projection-row-actions"><button type="button" onClick={() => onUpdate(request, 'Odobreno za izplačilo')}>Odobri</button><button type="button" onClick={() => onUpdate(request, 'Zavrnjeno')}>Zavrni</button></div> : null}</td></tr>; })}</tbody></table></div>
  </section>;
}

export default function CommissionProjection({ onClose, onRoleChange, requests, setRequests, notify }) {
  const [area, setArea] = useState('Kultura');
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedId, setSelectedId] = useState('');
  const projectionRef = useRef(null);
  const call = projectionCalls.find((item) => item.area === area) || projectionCalls[0];
  const programs = useMemo(() => call.programs.map((program) => ({ ...program, points: getPoints(program) })).sort((a, b) => Number(a.excluded || false) - Number(b.excluded || false) || b.points - a.points), [call]);
  const selected = programs.find((program) => program.id === selectedId) || programs[0];
  const currentTab = projectionTabs.find((tab) => tab.id === activeTab) || projectionTabs[0];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    projectionRef.current?.focus();
    const handleKey = (event) => { if (event.key === 'Escape') onClose(); };
    const handleFullscreen = () => { if (!document.fullscreenElement) onClose(); };
    document.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, [onClose]);

  const updateRequest = (request, status) => {
    setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status, paid: status === 'Odobreno za izplačilo' ? item.amount : item.paid } : item));
    notify(status === 'Zavrnjeno' ? `Zahtevek ${request.id} je zavrnjen.` : `Zahtevek ${request.id} je odobren za izplačilo.`);
  };

  let content;
  if (activeTab === 'formal') content = <FormalReview program={selected} />;
  else if (activeTab === 'points') content = <ScoreReview program={selected} notify={notify} />;
  else if (activeTab === 'allocation') content = <AllocationReview programs={programs} budget={call.budget} />;
  else if (activeTab === 'documents') content = <DocumentsReview program={selected} notify={notify} />;
  else content = <RequestsReview requests={requests} onUpdate={updateRequest} />;

  return (
    <section className="commission-projection" role="dialog" aria-modal="true" aria-label="Sejna soba · projekcija" ref={projectionRef} tabIndex={-1}>
      <header className="projection-header">
        <div className="projection-heading"><span>SEJNA SOBA · PROJEKCIJA</span><h1>{area} 2026</h1><p>{currentTab.sessionLabel} · seja {call.session} · Lea Horvat, Bojan Kralj, Petra Leben</p></div>
        <div className="projection-controls">
          <div className="projection-role-row"><div className="projection-role-switch" aria-label="Preklop pogleda">{[['applicant', 'Vlagatelj'], ['admin', 'Skrbnik'], ['commission', 'Komisija']].map(([role, label]) => <button type="button" key={role} className={role === 'commission' ? 'active' : ''} aria-pressed={role === 'commission'} onClick={() => role !== 'commission' && onRoleChange(role)}>{label}</button>)}</div><button type="button" className="projection-exit" onClick={onClose} title="Izhod iz projekcije (Esc)"><X size={18} /><span>Izhod</span></button></div>
          <div className="projection-area-switch" aria-label="Razpisno področje">{projectionCalls.map((item) => <button type="button" key={item.area} className={area === item.area ? 'active' : ''} onClick={() => { setArea(item.area); setSelectedId(''); }}>{item.area}</button>)}</div>
        </div>
      </header>
      <nav className="projection-tabs" aria-label="Pogledi sejne sobe">{projectionTabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</nav>
      <div className="projection-workspace">
        <aside className="projection-ranking"><header>Razvrstitev · Komisija</header>{programs.map((program, index) => <button type="button" key={program.id} className={selected.id === program.id ? 'active' : ''} onClick={() => setSelectedId(program.id)}><span className="projection-rank-number">{program.excluded ? '—' : index + 1}</span><span className="projection-rank-copy"><strong>{program.name}</strong><small>{program.applicant}{program.excluded ? ' · izven delitve' : ''}</small></span><b>{program.points}</b></button>)}</aside>
        <main className="projection-content">{content}</main>
      </div>
      <footer className="projection-footer">Vzorni podatki · projekcija za sejo komisije · ODOS, AJPES in SportSi360 so simulacije · pritisnite Esc za izhod</footer>
    </section>
  );
}
