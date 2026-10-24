import { useState } from 'react';
import {
  AlertTriangle, ArrowDownToLine, Building2, CalendarDays, Check, CheckCircle2,
  ChevronRight, Circle, CircleAlert, Clock3, Cloud, Download, ExternalLink,
  FileCheck2, FileClock, FileText, History, Landmark, Link2, MessageSquareText,
  Paperclip, Send, ShieldCheck, Sparkles, UploadCloud, UserRound, WalletCards,
} from 'lucide-react';
import { Badge, Button, DetailRow, Field, Modal, ProgressBar, StatusBadge, Tabs } from './components/UI.jsx';
import { formatCurrency } from './data.js';

export default function ApplicationDetail({ application, role, onClose, onUpdate, notify }) {
  const [tab, setTab] = useState('overview');
  const [supplementMode, setSupplementMode] = useState(false);
  const [reason, setReason] = useState('Manjka potrdilo o izvedenih programih v preteklem letu. Prosimo, da ga priložite v PDF obliki.');
  const [checks, setChecks] = useState([true, true, true, false]);
  const isAdmin = role === 'admin';
  if (!application) return null;

  const updateStatus = (status, tone, message) => {
    onUpdate(application.id, { status, tone });
    notify(message);
  };

  const supplementUploaded = (event) => {
    if (!event.target.files?.length) return;
    updateStatus('Dopolnitev oddana', 'blue', 'Dopolnitev je bila oddana skrbniku v pregled.');
  };

  return (
    <Modal open={Boolean(application)} onClose={onClose} title={application.program} description={`${application.id} · ${application.applicant}`} size="xl" footer={isAdmin ? <>
      <Button variant="secondary" icon={MessageSquareText} onClick={() => setSupplementMode(true)}>Zahtevaj dopolnitev</Button>
      <Button icon={CheckCircle2} onClick={() => updateStatus('Formalno ustrezna', 'success', 'Vloga je označena kot formalno ustrezna.')}>Potrdi formalno ustreznost</Button>
    </> : <>
      <Button variant="secondary" icon={Download} onClick={() => notify('Podpisana vloga je pripravljena za prenos.')}>Prenesi vlogo</Button>
      {application.tone === 'warning' && <label className="button button--primary button--md"><UploadCloud size={17} /><span>Oddaj dopolnitev</span><input type="file" hidden onChange={supplementUploaded} /></label>}
    </>}>
      <div className="application-detail">
        <div className="application-detail__status"><StatusBadge tone={application.tone}>{application.status}</StatusBadge><span><Cloud size={15} />Sinhronizirano z ODOS</span><span><CalendarDays size={15} />Oddano {application.submitted}</span></div>
        {application.tone === 'warning' && <div className="supplement-alert"><AlertTriangle size={21} /><div><strong>{isAdmin ? 'Vloga je v postopku dopolnjevanja' : 'Potrebna je dopolnitev do 29. 10. 2026'}</strong><p>Manjka potrdilo o izvedenih programih v preteklem letu. {isAdmin ? 'Poziv je bil poslan 21. 10. 2026.' : 'Naložite dokument in ga oddajte skrbniku v pregled.'}</p></div>{!isAdmin && <label className="button button--warning button--sm"><UploadCloud size={15} /><span>Naloži prilogo</span><input type="file" hidden onChange={supplementUploaded} /></label>}</div>}
        {isAdmin && <Tabs items={[{ id: 'overview', label: 'Pregled vloge' }, { id: 'review', label: 'Formalni pregled' }, { id: 'history', label: 'Zgodovina' }]} active={tab} onChange={setTab} />}
        {(tab === 'overview' || !isAdmin) && <div className="application-detail__grid">
          <div className="application-detail__main">
            <section className="detail-section"><div className="detail-section__heading"><h3>Podatki o vlogi</h3>{isAdmin && <button type="button" onClick={() => notify('Odprt je celoten elektronski obrazec vloge.')}>Celoten obrazec<ExternalLink size={14} /></button>}</div><div className="detail-grid"><DetailRow label="Vlagatelj" value={application.applicant} /><DetailRow label="Matična številka" value={application.registration || '4021187000'} /><DetailRow label="Vsebinsko področje" value={application.area} /><DetailRow label="Zahtevana sredstva" value={formatCurrency(application.amount)} /><DetailRow label="Razpis" value={application.call} /><DetailRow label="Popolnost vloge"><ProgressBar value={application.completeness} label={`${application.completeness} %`} /></DetailRow></div></section>
            {isAdmin && <div className="registry-checks"><div><span><Landmark size={18} /></span><p><strong>AJPES</strong>Pravna oseba je aktivna</p><CheckCircle2 size={17} /></div><div><span><ShieldCheck size={18} /></span><p><strong>eDavki</strong>Davčna številka je potrjena</p><CheckCircle2 size={17} /></div>{application.area === 'Šport' && <div><span><Sparkles size={18} /></span><p><strong>OKS SportSi360</strong>Register športnikov povezan</p><CheckCircle2 size={17} /></div>}</div>}
            <section className="detail-section"><div className="detail-section__heading"><h3>Obrazci in priloge</h3><span>{isAdmin ? '6 dokumentov' : '4 dokumenti'}</span></div><div className="detail-documents">{[
              ['Podpisana_vloga.pdf', '1,8 MB', true],
              ['Statut_organizacije.pdf', '1,2 MB', true],
              ['Financni_nacrt_2026.xlsx', '86 KB', true],
              ['Porocilo_o_delu_2025.pdf', '2,4 MB', application.tone !== 'warning'],
            ].map(([name, size, valid]) => <div key={name}><span className="file-icon"><FileText size={18} /></span><p><strong>{name}</strong><span>PDF / XLSX · {size}</span></p>{valid ? <span className="document-valid"><CheckCircle2 size={15} />Ustrezno</span> : <Badge tone="warning">Manjka</Badge>}<button type="button" onClick={() => notify(`Dokument »${name}« je pripravljen za pregled.`)} aria-label={`Preglej ${name}`}><ArrowDownToLine size={17} /></button></div>)}</div></section>
            {application.points !== null && <section className="points-summary"><span><Sparkles size={21} /></span><div><p>Točkovanje programa</p><strong>{application.points} / 100 točk</strong></div><ProgressBar value={application.points} /><Button variant="secondary" size="sm" onClick={() => notify('Prikazan je podroben pregled meril in točkovanja.')}>Preglej merila</Button></section>}
          </div>
          <aside className="application-timeline"><h3>Potek vloge</h3>{[
            ['Vloga oddana', application.submitted, true],
            ['Prenos v ODOS', application.submitted, true],
            ['Formalni pregled', application.tone === 'warning' ? 'V teku · manjka priloga' : 'V teku', application.tone !== 'neutral'],
            ['Vrednotenje programa', application.points ? `${application.points} točk` : 'Sledi', Boolean(application.points)],
            ['Odločitev in pogodba', 'Sledi', false],
          ].map(([title, date, active], index) => <div className={`${active ? 'active' : ''}`} key={title}><span>{active ? <Check size={13} /> : <Circle size={10} />}</span><p><strong>{title}</strong><small>{date}</small></p>{index === 2 && application.tone === 'warning' && <Clock3 size={15} />}</div>)}<div className="timeline-owner"><UserRound size={18} /><p>Skrbnik razpisa<strong>Maja Kovač</strong></p><button type="button" onClick={() => notify('Odprt je kontaktni obrazec skrbnice.')}><MessageSquareText size={16} /></button></div></aside>
        </div>}
        {isAdmin && tab === 'review' && <div className="formal-review"><div className="inline-notice"><ShieldCheck size={18} /><span>Potrdite vsako kontrolno točko. Sistem samodejno hrani spremembe in revizijsko sled.</span></div><section className="checklist-panel"><h3>Kontrolni obrazec formalne ustreznosti</h3>{['Vloga je oddana pravočasno in ustrezno podpisana', 'Vlagatelj izpolnjuje pogoje za prijavo', 'Statut in matični podatki so ustrezni', 'Priloženo je potrdilo o izvedenih programih'].map((label, index) => <label key={label} className={checks[index] ? 'checked' : ''}><input type="checkbox" checked={checks[index]} onChange={() => setChecks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} /><span>{checks[index] && <Check size={14} />}</span><div><strong>{label}</strong><small>{index === 0 ? 'Preverjeno samodejno ob oddaji' : 'Kontrolna točka skrbnika'}</small></div></label>)}</section><Field label="Opomba skrbnika"><textarea rows="4" defaultValue={application.tone === 'warning' ? 'Vlagatelj je bil pozvan k dopolnitvi 21. 10. 2026.' : 'Vloga je popolna, podatki v registrih so ustrezni.'} /></Field></div>}
        {isAdmin && tab === 'history' && <div className="audit-log"><h3>Revizijska sled</h3>{[['Danes, 09:18', 'Maja Kovač', 'Pregledala obrazec in priloge vloge'], ['21. 10. 2026, 09:42', 'Maja Kovač', 'Izdala poziv k dopolnitvi vloge'], [application.submitted, 'Sistem', 'Vlogo in priloge uspešno prenesel v ODOS'], [application.submitted, application.applicant, 'Oddaja elektronsko podpisane vloge']].map(([date, actor, action]) => <div key={`${date}${action}`}><span><History size={16} /></span><p><strong>{action}</strong><small>{actor} · {date}</small></p></div>)}</div>}
        {supplementMode && <div className="supplement-compose"><div><h3>Poziv k dopolnitvi</h3><button type="button" onClick={() => setSupplementMode(false)}>Prekliči</button></div><Field label="Opis pomanjkljivosti"><textarea rows="3" value={reason} onChange={(event) => setReason(event.target.value)} /></Field><div className="form-grid"><Field label="Rok za dopolnitev"><input type="date" defaultValue="2026-10-29" /></Field><Field label="Način obvestila"><select><option>Aplikacija in e-pošta</option><option>Samo aplikacija</option></select></Field></div><Button icon={Send} onClick={() => { setSupplementMode(false); updateStatus('Potrebna dopolnitev', 'warning', 'Poziv k dopolnitvi je bil poslan vlagatelju.'); }}>Pošlji poziv vlagatelju</Button></div>}
      </div>
    </Modal>
  );
}
