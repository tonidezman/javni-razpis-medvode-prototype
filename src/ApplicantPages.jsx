import { useMemo, useState } from 'react';
import {
  Archive, ArrowRight, ArrowUpRight, Bell, BookOpenCheck, CalendarClock,
  CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, CircleAlert,
  CircleDollarSign, Clock3, Cloud, Download, ExternalLink, FileCheck2,
  FileClock, FilePlus2, FileText, Files, Filter, HelpCircle, History,
  ImagePlus, Inbox, Info, Landmark, LifeBuoy, Mail, MailOpen, MessageCircle,
  MessageSquareText, MoreHorizontal, Paperclip, Phone, Plus, ReceiptText,
  Search, Send, ShieldCheck, Upload, UploadCloud, UserRound, Video, WalletCards,
} from 'lucide-react';
import { areas, formatCurrency, phases } from './data.js';
import {
  AreaIcon, Avatar, Badge, Button, DetailRow, EmptyState, Field, IconButton,
  Modal, PageHeader, ProgressBar, SearchBox, SectionHeading, StatusBadge, Tabs,
} from './components/UI.jsx';

export function ApplicationsPage({ applications, onSelect, onApply, calls, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('Vse');
  const mine = applications.filter((item) => item.mine);
  const filtered = mine.filter((item) => {
    const matchesQuery = `${item.program} ${item.id} ${item.area}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Vse' || (filter === 'V postopku' && !['Sofinanciranje odobreno', 'Zaključena'].includes(item.status)) || (filter === 'Dopolnitve' && item.tone === 'warning') || (filter === 'Zaključene' && ['Sofinanciranje odobreno', 'Zaključena'].includes(item.status));
    return matchesQuery && matchesFilter;
  });
  return (
    <div className="page">
      <PageHeader eyebrow="Vlagatelj" title="Moje vloge" description="Register vlog, dopolnitev in odobrenih programov vaše organizacije." actions={<Button icon={FilePlus2} onClick={() => onApply(calls[0])}>Nova vloga</Button>} />
      <div className="summary-chips">
        <div><span className="summary-chips__dot green" /><strong>{mine.length}</strong><span>Vse vloge</span></div>
        <div><span className="summary-chips__dot blue" /><strong>{mine.filter((item) => item.tone !== 'warning').length}</strong><span>V postopku</span></div>
        <div><span className="summary-chips__dot orange" /><strong>{mine.filter((item) => item.tone === 'warning').length}</strong><span>Za dopolnitev</span></div>
        <div><History size={17} /><strong>12</strong><span>Arhiv od 2020</span></div>
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar"><Tabs items={['Vse', 'V postopku', 'Dopolnitve', 'Zaključene']} active={filter} onChange={setFilter} /><SearchBox value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Išči po nazivu ali številki …" /></div>
        {filtered.length ? <div className="responsive-table"><table><thead><tr><th>Vloga / program</th><th>Razpis in področje</th><th>Oddana</th><th className="align-right">Zahtevani znesek</th><th>Status</th><th aria-label="Akcije" /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} onClick={() => onSelect(item)}><td data-label="Vloga"><strong>{item.program}</strong><span className="table-subline">{item.id}</span></td><td data-label="Razpis"><span>{item.call}</span><span className="table-subline">{item.area}</span></td><td data-label="Oddana">{item.submitted}</td><td data-label="Zahtevani znesek" className="align-right"><strong>{formatCurrency(item.amount)}</strong></td><td data-label="Status"><StatusBadge tone={item.tone}>{item.status}</StatusBadge>{item.tone === 'warning' && <span className="table-subline warning-text">Rok: 29. 10. 2026</span>}</td><td><IconButton icon={ChevronRight} label={`Odpri ${item.id}`} /></td></tr>)}</tbody></table></div> : <EmptyState />}
        <div className="table-footer"><span>Prikazanih {filtered.length} od {mine.length} vlog</span><div><button type="button" disabled>Prejšnja</button><button type="button" className="active">1</button><button type="button" disabled>Naslednja</button></div></div>
      </section>
      <div className="archive-banner"><span><Archive size={22} /></span><div><strong>Zgodovinski arhiv vlog</strong><p>Vse oddane vloge in priloge od leta 2020 so vedno na voljo.</p></div><Button variant="secondary" size="sm" onClick={() => setFilter('Zaključene')}>Odpri arhiv</Button></div>
    </div>
  );
}

export function CallsPage({ calls, onApply, notify }) {
  const [area, setArea] = useState('Vsa področja');
  const [selected, setSelected] = useState(null);
  const publishedCalls = calls.filter((call) => call.status !== 'Osnutek');
  const filtered = area === 'Vsa področja' ? publishedCalls : publishedCalls.filter((call) => call.area === area);
  return (
    <div className="page">
      <PageHeader eyebrow="Javni razpisi" title="Priložnosti za vašo organizacijo" description="Preglejte odprte razpise, pogoje in razpisno dokumentacijo." />
      <div className="call-filter-row"><div className="filter-chips">{['Vsa področja', ...areas.slice(0, 5).map((item) => item.name)].map((name) => <button type="button" key={name} className={area === name ? 'active' : ''} onClick={() => setArea(name)}>{name}</button>)}</div><span>{filtered.length} razpisi</span></div>
      <div className="calls-grid">
        {filtered.map((call) => {
          const areaData = areas.find((item) => item.name === call.area) || areas[0];
          const open = call.phase === 1 && call.status === 'Odprt';
          return <article className="call-card" key={call.id}>
            <div className="call-card__top"><AreaIcon area={areaData} /><Badge tone={open ? 'success' : call.phase === 5 ? 'purple' : 'blue'} dot>{call.status}</Badge></div>
            <span className="call-card__code">{call.code}</span>
            <h2>{call.title}</h2>
            <p>{call.description}</p>
            <div className="call-card__facts"><div><CalendarClock size={16} /><span>{open ? 'Rok za oddajo' : 'Zbiranje vlog'}<strong>{call.deadline}</strong></span></div><div><WalletCards size={16} /><span>Okvir sredstev<strong>{formatCurrency(call.budget)}</strong></span></div></div>
            <div className="call-card__footer"><button className="text-link" type="button" onClick={() => setSelected(call)}>Pogoji in dokumenti<ChevronRight size={15} /></button>{open && <Button size="sm" onClick={() => onApply(call)}>Oddaj vlogo<ArrowRight size={15} /></Button>}</div>
          </article>;
        })}
      </div>
      <section className="info-strip"><span><Video size={21} /></span><div><strong>Informativni dan za vlagatelje</strong><p>Sreda, 28. oktober 2026 ob 16. uri · spletna videokonferenca</p></div><Button variant="secondary" size="sm" icon={ExternalLink} onClick={() => notify('Vabilo na informativni dan je dodano med vaša sporočila.')}>Prikaži vabilo</Button></section>
      <section className="areas-overview"><SectionHeading title="Vsa razpisna področja" description="Letno število predvidenih programov po posameznih področjih" /><div>{areas.map((item) => <button type="button" key={item.name} onClick={() => setArea(item.name)}><AreaIcon area={item} /><span><strong>{item.name}</strong><small>do {item.programs} programov letno</small></span><ArrowUpRight size={16} /></button>)}</div></section>
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title} description={selected?.code} size="lg" footer={<><Button variant="secondary" onClick={() => setSelected(null)}>Zapri</Button>{selected?.phase === 1 && selected?.status === 'Odprt' && <Button icon={FilePlus2} onClick={() => { onApply(selected); setSelected(null); }}>Oddaj vlogo</Button>}</>}>
        {selected && <div className="call-detail"><div className="call-detail__intro"><Badge tone={selected.phase === 1 ? 'success' : 'blue'} dot>{selected.status}</Badge><p>{selected.description}</p></div><div className="detail-grid"><DetailRow label="Objavljen" value={selected.published} /><DetailRow label="Rok za oddajo" value={selected.deadline} /><DetailRow label="Razpoložljiva sredstva" value={formatCurrency(selected.budget)} /><DetailRow label="Vsebinsko področje" value={selected.area} /></div><div className="inline-notice"><Info size={17} /><span>Prijavitelj mora biti registriran za izvajanje dejavnosti, program pa se mora izvajati na območju občine Medvode.</span></div><h3>Razpisna dokumentacija</h3><div className="document-download-list">{['Javni razpis in merila.pdf', 'Pravilnik o sofinanciranju.pdf', 'Navodila za elektronsko oddajo.pdf'].map((name, index) => <button type="button" key={name} onClick={() => notify(`Dokument »${name}« je pripravljen za prenos.`)}><FileText size={18} /><span>{name}</span><small>{index + 1},2 MB</small><Download size={17} /></button>)}</div></div>}
      </Modal>
    </div>
  );
}

export function ReportsPage({ requests, setRequests, notify }) {
  const [tab, setTab] = useState('requests');
  const [requestOpen, setRequestOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [amount, setAmount] = useState('3200');
  const [description, setDescription] = useState('');
  const mine = requests.filter((item) => item.mine);
  const addRequest = () => {
    setRequests((current) => [{ id: `ZAH-2026-${String(current.length + 41).padStart(4, '0')}`, program: 'Program mladih športnikov 2026', applicant: 'Športno društvo Sora', date: '24. 10. 2026', amount: Number(amount), paid: 0, status: 'V pregledu', invoices: 1, mine: true }, ...current]);
    setRequestOpen(false);
    setDescription('');
    notify('Zahtevek je bil oddan v pregled skrbniku.');
  };
  return (
    <div className="page">
      <PageHeader eyebrow="Realizacija" title="Zahtevki in poročila" description="Spremljajte porabo odobrenih sredstev, oddajte račune in končna poročila." actions={<Button icon={Plus} onClick={() => tab === 'reports' ? setReportOpen(true) : setRequestOpen(true)}>{tab === 'reports' ? 'Novo poročilo' : 'Nov zahtevek'}</Button>} />
      <div className="finance-overview">
        <div className="finance-overview__main"><span>Odobrena sredstva za aktivne programe</span><strong>45.700,00 €</strong><ProgressBar value={68} /><small><span>31.124 € izplačanih</span><span>14.576 € na voljo</span></small></div>
        <div><span className="finance-overview__icon"><ReceiptText size={20} /></span><p>Oddani zahtevki</p><strong>{mine.length + 3}</strong><small>1 trenutno v pregledu</small></div>
        <div><span className="finance-overview__icon"><FileClock size={20} /></span><p>Rok za končno poročilo</p><strong>15. jan. 2027</strong><small>Vsebinsko in finančno poročilo</small></div>
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar"><Tabs items={[{ id: 'requests', label: 'Zahtevki z računi' }, { id: 'reports', label: 'Končna poročila' }]} active={tab} onChange={setTab} /></div>
        {tab === 'requests' ? <div className="responsive-table"><table><thead><tr><th>Zahtevek / program</th><th>Datum oddaje</th><th>Računi</th><th className="align-right">Znesek</th><th>Stanje</th><th /></tr></thead><tbody>{mine.map((item) => <tr key={item.id}><td data-label="Zahtevek"><strong>{item.id}</strong><span className="table-subline">{item.program}</span></td><td data-label="Datum">{item.date}</td><td data-label="Računi"><span className="invoice-count"><Paperclip size={14} />{item.invoices} računi</span></td><td data-label="Znesek" className="align-right"><strong>{formatCurrency(item.amount)}</strong></td><td data-label="Stanje"><StatusBadge tone={item.status === 'Izplačano' ? 'success' : item.status === 'Delno izplačano' ? 'blue' : 'warning'}>{item.status}</StatusBadge></td><td><IconButton icon={ChevronRight} label={`Odpri ${item.id}`} onClick={() => notify(`Zahtevek ${item.id}: ${item.invoices} računi, stanje ${item.status.toLowerCase()}.`)} /></td></tr>)}</tbody></table></div> : <div className="reports-list"><article><span className="report-year">2026</span><div><h3>Program mladih športnikov 2026</h3><p>Vsebinsko in finančno končno poročilo</p><span><Clock3 size={14} />Oddaja od 1. 12. 2026 do 15. 1. 2027</span></div><Badge tone="warning">V pripravi</Badge><Button variant="secondary" size="sm" onClick={() => setReportOpen(true)}>Uredi poročilo</Button></article><article><span className="report-year">2025</span><div><h3>Program mladih športnikov 2025</h3><p>Končno poročilo z dokazili in fotografijami</p><span><CheckCircle2 size={14} />Potrjeno 12. 1. 2026</span></div><Badge tone="success">Potrjeno</Badge><Button variant="ghost" size="sm" icon={Download} onClick={() => notify('Poročilo je pripravljeno za prenos.')}>Prenesi</Button></article></div>}
      </section>
      <div className="inline-notice"><Info size={18} /><span>Zahtevek lahko oddate do 25. 11. 2026. Končna vsebinska in finančna poročila se oddajajo od 1. 12. 2026 do 15. 1. 2027.</span></div>
      <Modal open={requestOpen} onClose={() => setRequestOpen(false)} title="Nov zahtevek za izplačilo" description="Program mladih športnikov 2026 · JR-2026-0148" footer={<><Button variant="secondary" onClick={() => setRequestOpen(false)}>Prekliči</Button><Button icon={Send} onClick={addRequest}>Oddaj zahtevek</Button></>}>
        <div className="balance-callout"><WalletCards size={20} /><div><span>Razpoložljivi ostanek odobrenih sredstev</span><strong>18.600,00 €</strong></div></div><div className="form-grid"><Field label="Znesek zahtevka" required><div className="input-suffix"><input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /><span>EUR</span></div></Field><Field label="Datum računa"><input type="date" defaultValue="2026-10-24" /></Field><Field label="Kratek opis stroškov" required className="span-2"><textarea rows="4" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="npr. Stroški strokovnega vodenja treningov za september in oktober" /></Field></div><label className="upload-zone upload-zone--compact"><input type="file" multiple /><UploadCloud size={24} /><strong>Dodajte račune in dokazila o plačilu</strong><p>PDF, JPG ali PNG · največ 20 MB</p></label><div className="inline-notice"><ShieldCheck size={17} /><span>Vsak račun bo skrbnik pregledal ločeno. Skupna poraba ne more preseči odobrenih sredstev.</span></div>
      </Modal>
      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Končno letno poročilo" description="Vsebinski in finančni pregled izvedenega programa" size="lg" footer={<><Button variant="secondary" onClick={() => setReportOpen(false)}>Shrani osnutek</Button><Button icon={Send} onClick={() => { setReportOpen(false); notify('Končno poročilo je bilo oddano v pregled.'); }}>Oddaj poročilo</Button></>}>
        <div className="form-grid"><Field label="Povzetek izvedenega programa" required className="span-2"><textarea rows="5" defaultValue="Program je bil izveden v skladu s prijavo. V redne treninge je bilo vključenih 128 mladih športnikov v osmih starostnih skupinah." /></Field><Field label="Odstopanja od prijavljenega programa" className="span-2"><textarea rows="3" placeholder="Opišite morebitne spremembe aktivnosti, terminov ali ciljnih skupin …" /></Field><Field label="Skupaj porabljena sredstva"><div className="input-suffix"><input type="number" defaultValue="22800" /><span>EUR</span></div></Field><Field label="Število vključenih"><input type="number" defaultValue="128" /></Field></div><label className="upload-zone upload-zone--compact"><input type="file" accept="image/*" multiple /><ImagePlus size={24} /><strong>Dodajte 1–3 fotografije izvedbe</strong><p>JPG ali PNG · fotografije javne izvedbe programa</p></label>
      </Modal>
    </div>
  );
}

export function DocumentsPage({ role, documents, setDocuments, notify }) {
  const canAdminister = role === 'admin' || role === 'administrator';
  const isCommission = role === 'commission';
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Vsi');
  const visible = documents.filter((doc) => canAdminister || doc.owner !== 'admin').filter((doc) => `${doc.name} ${doc.related}`.toLowerCase().includes(query.toLowerCase())).filter((doc) => type === 'Vsi' || doc.type === type);
  const addFiles = (event) => {
    const files = Array.from(event.target.files || []).map((file, index) => ({ id: Date.now() + index, name: file.name, type: 'Priloga', related: 'JR-2026-0148', date: '24. 10. 2026', size: `${Math.max(1, Math.round(file.size / 1024))} KB`, owner: canAdminister ? 'admin' : 'mine' }));
    if (files.length) { setDocuments((current) => [...files, ...current]); notify(`${files.length} dokumentov je bilo dodanih.`); }
  };
  return (
    <div className="page"><PageHeader eyebrow="Dokumentna shramba" title="Dokumenti" description={canAdminister ? 'Predloge, izdani dokumenti in gradivo vlog z ODOS sinhronizacijo.' : isCommission ? 'Razpisna dokumentacija in dokumenti dodeljenih programov.' : 'Vsi dokumenti vaših vlog, pogodb, odločb in poročil na enem mestu.'} actions={!isCommission && <label className="button button--primary button--md"><Upload size={17} /><span>Naloži dokument</span><input type="file" multiple hidden onChange={addFiles} /></label>} />
      <div className="integration-banner"><span><Cloud size={22} /></span><div><strong>Povezava z dokumentnim sistemom ODOS je aktivna</strong><p>Zadnja uspešna sinhronizacija: danes ob 09:48 · vsi dokumenti so sinhronizirani</p></div><Badge tone="success"><Check size={14} />Povezano</Badge></div>
      <section className="panel table-panel"><div className="table-toolbar"><Tabs items={['Vsi', 'Vloga', 'Poziv', 'Pogodba', 'Sklep', ...(canAdminister ? ['Predloga'] : [])]} active={type} onChange={setType} /><SearchBox value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Išči dokumente …" /></div>{visible.length ? <div className="responsive-table"><table><thead><tr><th>Dokument</th><th>Vrsta</th><th>Povezava</th><th>Datum</th><th>Velikost</th><th /></tr></thead><tbody>{visible.map((doc) => <tr key={doc.id}><td data-label="Dokument"><div className="document-name"><span><FileText size={18} /></span><strong>{doc.name}</strong></div></td><td data-label="Vrsta"><Badge>{doc.type}</Badge></td><td data-label="Povezava">{doc.related}</td><td data-label="Datum">{doc.date}</td><td data-label="Velikost">{doc.size}</td><td><IconButton icon={Download} label={`Prenesi ${doc.name}`} onClick={() => notify(`Dokument »${doc.name}« je pripravljen za prenos.`)} /></td></tr>)}</tbody></table></div> : <EmptyState />}<div className="table-footer"><span>{visible.length} dokumentov</span><span><Cloud size={14} />Shranjeno tudi v ODOS</span></div></section>
    </div>
  );
}

export function MessagesPage({ notify }) {
  const [selectedId, setSelectedId] = useState(1);
  const [read, setRead] = useState([2, 3]);
  const [compose, setCompose] = useState(false);
  const [text, setText] = useState('');
  const selected = messagesData.find((message) => message.id === selectedId) || messagesData[0];
  const select = (id) => { setSelectedId(id); setRead((current) => [...new Set([...current, id])]); };
  return (
    <div className="page"><PageHeader eyebrow="Komunikacija" title="Sporočila" description="Obvestila o vlogah in neposredna komunikacija s skrbniki razpisov." actions={<Button icon={Plus} onClick={() => setCompose(true)}>Novo sporočilo</Button>} />
      <section className="messages-layout panel"><div className="message-list"><div className="message-list__toolbar"><strong>Prejeta sporočila</strong><Badge>{messagesData.length - read.length} neprebrano</Badge></div>{messagesData.map((message) => <button type="button" key={message.id} className={`${selectedId === message.id ? 'active' : ''} ${!read.includes(message.id) ? 'unread' : ''}`} onClick={() => select(message.id)}><span className="message-list__icon">{message.important ? <CircleAlert size={18} /> : <Mail size={18} />}</span><div><strong>{message.title}</strong><p>{message.preview}</p><span>{message.date}</span></div>{!read.includes(message.id) && <i />}</button>)}</div><article className="message-detail"><header><div><Badge tone={selected.important ? 'warning' : 'neutral'}>{selected.important ? 'Zahteva ukrepanje' : 'Obvestilo'}</Badge><h2>{selected.title}</h2><p>{selected.from}</p></div><IconButton icon={MoreHorizontal} label="Več možnosti" /></header><div className="message-detail__meta"><Avatar name={selected.from.includes('Maja') ? 'Maja Kovač' : 'RM'} /><div><strong>{selected.from}</strong><span>za: ana.novak@sd-sora.si · {selected.date}</span></div></div><div className="message-detail__body">{selected.body.split('\n').map((line, index) => <p key={index}>{line || '\u00a0'}</p>)}</div>{selected.important && <div className="message-attachment"><FileText size={20} /><div><strong>Poziv_na_dopolnitev_JR-2026-0151.pdf</strong><span>428 KB · PDF</span></div><IconButton icon={Download} label="Prenesi prilogo" onClick={() => notify('Priloga je pripravljena za prenos.')} /></div>}<footer><Button variant="secondary" icon={MessageCircle} onClick={() => setCompose(true)}>Odgovori</Button><Button variant="ghost" icon={Archive} onClick={() => notify('Sporočilo je premaknjeno v arhiv.')}>Arhiviraj</Button></footer></article></section>
      <Modal open={compose} onClose={() => setCompose(false)} title="Novo sporočilo skrbniku" description="Odgovor praviloma prejmete v 24 urah v delovnem tednu." footer={<><Button variant="secondary" onClick={() => setCompose(false)}>Prekliči</Button><Button icon={Send} onClick={() => { setCompose(false); setText(''); notify('Sporočilo je bilo poslano skrbniku razpisa.'); }}>Pošlji sporočilo</Button></>}><div className="form-grid"><Field label="Prejemnik"><select><option>Maja Kovač · skrbnica razpisa Šport 2026</option><option>Tehnična podpora</option></select></Field><Field label="Zadeva"><input defaultValue="Vprašanje glede vloge JR-2026-0151" /></Field><Field label="Sporočilo" className="span-2"><textarea rows="7" value={text} onChange={(event) => setText(event.target.value)} placeholder="Napišite svoje vprašanje …" /></Field></div></Modal>
    </div>
  );
}

const messagesData = [
  { id: 1, title: 'Poziv k dopolnitvi vloge JR-2026-0151', preview: 'Spoštovani, pri vlogi smo ugotovili manjkajočo prilogo ...', from: 'Skrbnica razpisa · Maja Kovač', date: '21. 10. 2026 · 09:42', important: true, body: 'Spoštovani,\n\npri formalnem pregledu vloge »Vadba za starejše — Aktivno v vsaki vasi« smo ugotovili, da manjka potrdilo o izvedenih programih v preteklem letu. Prosimo, da dokument oddate najkasneje do 29. 10. 2026 prek modula Dopolnitve.\n\nLep pozdrav,\nMaja Kovač, skrbnica razpisa' },
  { id: 2, title: 'Vloga JR-2026-0148 je bila uspešno oddana', preview: 'Vaša vloga je bila uspešno oddana in prenesena v sistem ODOS ...', from: 'Sistem Razpisi Medvode', date: '12. 10. 2026 · 14:18', important: false, body: 'Spoštovani,\n\nvaša vloga JR-2026-0148 je bila uspešno oddana. Potrdilo o oddaji in podpisana vloga sta na voljo v modulu Dokumenti. Gradivo je bilo samodejno preneseno tudi v sistem ODOS.\n\nO nadaljnjem postopku vas bomo obveščali prek aplikacije in e-pošte.' },
  { id: 3, title: 'Vabilo na informativni dan za razpis Šport 2026', preview: 'Vabimo vas na spletno predstavitev razpisa, ki bo 28. oktobra ...', from: 'Urad za družbene dejavnosti', date: '8. 10. 2026 · 11:05', important: false, body: 'Spoštovani,\n\nvabimo vas na spletni informativni dan, ki bo v sredo, 28. 10. 2026, ob 16. uri. Predstavili bomo pogoje razpisa, obrazce in postopek elektronske oddaje.\n\nPovezava do videokonference je na voljo v informativni vsebini razpisa.' },
];

export function SupportPage({ role, notify }) {
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    ['Kako prenesem podatke iz pretekle vloge?', 'Pri novi vlogi v prvem koraku izberite »Prenesi prejšnjo vlogo«. Sistem prenese podatke o organizaciji, programu in izbrane priloge, ki jih nato preverite in po potrebi posodobite.'],
    ['Kako poteka dopolnitev vloge?', 'Ko skrbnik izda poziv, prejmete sporočilo z natančnim opisom pomanjkljivosti in rokom. Vlogo odprete prek modula Moje vloge, dodate manjkajoče dokumente in dopolnitev elektronsko oddate.'],
    ['Kako se oddaja zahtevke in končna poročila?', 'V modulu Zahtevki in poročila izberete program, vnesete znesek ter dodate račune in dokazila. Končno poročilo vključuje vsebinski opis, finančne podatke in fotografije javne izvedbe.'],
    ['Kdo naj pokličem ob tehničnih težavah?', 'Tehnična pomoč je na voljo ob delavnikih od 8. do 16. ure na 01 361 12 40. Ob rokih razpisov je kolidž podpore objavljen pri posameznem razpisu.'],
  ];
  return <div className="page"><PageHeader eyebrow="Pomoč in podpora" title="Kako vam lahko pomagamo?" description="Odgovore na pogosta vprašanja najdete spodaj ali pa se obrnite neposredno na skrbnika." />
    <div className="support-grid"><section className="support-contact support-contact--primary"><span><MessageSquareText size={24} /></span><h2>Sporočilo skrbniku</h2><p>Za vprašanja o vlogi, pogojih razpisa ali dopolnitvi.</p><Button variant="light" icon={Send} onClick={() => notify('Odprto je novo sporočilo skrbniku.')}>Pošlji vprašanje</Button><small>Odgovor v 24 urah v delovnem tednu</small></section><section className="support-contact"><span><Phone size={24} /></span><h2>Telefonska pomoč</h2><p>Tehnična podpora in pomoč pri uporabi aplikacije.</p><strong>01 361 12 40</strong><small>Delavniki · 8:00–16:00</small></section><section className="support-contact"><span><Mail size={24} /></span><h2>E-pošta</h2><p>Pišite nam in navedite številko razpisa oziroma vloge.</p><strong>razpisi@medvode.si</strong><small>Odgovor najpozneje naslednji delovni dan</small></section></div>
    <div className="support-content"><section className="panel faq-panel"><SectionHeading title="Pogosta vprašanja" description="Hitra navodila za najpogostejše postopke" /><div className="faq-list">{faqs.map(([question, answer], index) => <div className={openFaq === index ? 'open' : ''} key={question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><strong>{question}</strong><ChevronDown size={18} /></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section><aside className="panel training-panel"><span><Video size={25} /></span><h2>Video navodila</h2><p>Kratka predstavitev celotnega postopka od registracije do oddaje vloge.</p><div className="video-placeholder"><button type="button" onClick={() => notify('Predvajanje video navodil bi se odprlo tukaj.')} aria-label="Predvajaj video"><span>▶</span></button><small>08:42 min</small></div><Button variant="secondary" icon={BookOpenCheck} onClick={() => notify('Uporabniški priročnik je pripravljen za prenos.')}>Uporabniški priročnik</Button></aside></div>
  </div>;
}
