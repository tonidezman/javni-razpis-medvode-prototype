import { useEffect, useRef } from 'react';
import {
  ArrowRight, BellRing, CalendarClock, Check, CheckCircle2, CircleAlert,
  Clock3, FileCheck2, FilePlus2, Files, FolderClock, MessageSquareText,
  Plus, Send, Sparkles, TrendingUp, Trophy, Upload, UsersRound, WalletCards,
  ClipboardCheck, CircleDollarSign, ListChecks, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import { areas, formatCurrency, phases } from './data.js';
import { AreaIcon, Badge, Button, PageHeader, ProgressBar, SectionHeading, StatusBadge } from './components/UI.jsx';

const applicantTasks = [
  { icon: Upload, title: 'Dopolnite vlogo JR-2026-0151', meta: 'Rok: 29. oktober 2026', tone: 'urgent', action: 'Dopolni', page: 'applications' },
  { icon: FileCheck2, title: 'Oddajte vmesni zahtevek', meta: 'Program mladih športnikov 2026', tone: 'normal', action: 'Odpri', page: 'reports' },
  { icon: MessageSquareText, title: 'Informativni dan za šport', meta: '28. oktober 2026 ob 16. uri', tone: 'normal', action: 'Poglej', page: 'messages' },
];

const adminTasks = [
  { icon: ListChecks, title: 'Formalni pregled 12 vlog', meta: 'Razpis Turizem 2026', tone: 'urgent', action: 'Preglej', page: 'admin-applications' },
  { icon: ClipboardCheck, title: 'Zaključite vrednotenje komisije', meta: 'Razpis Kultura 2026 · 8 programov', tone: 'normal', action: 'Točkuj', page: 'scoring' },
  { icon: CircleDollarSign, title: 'Pregledajte 4 nove zahtevke', meta: 'Skupaj 24.680 €', tone: 'normal', action: 'Odpri', page: 'admin-reports' },
];

const commissionTasks = [
  { icon: ClipboardCheck, title: 'Ocenite preostalih 8 programov', meta: 'Razpis Kultura 2026 · rok 30. oktober', tone: 'urgent', action: 'Točkuj', page: 'scoring' },
  { icon: FileCheck2, title: 'Preglejte utemeljitve članov', meta: '5 novih komentarjev komisije', tone: 'normal', action: 'Preglej', page: 'commission-applications' },
  { icon: CheckCircle2, title: 'Potrdite skupno rang listo', meta: 'Po zaključku ocenjevanja vseh programov', tone: 'normal', action: 'Odpri', page: 'scoring' },
];

const administratorTasks = [
  { icon: UsersRound, title: 'Aktivirajte 5 novih uporabnikov', meta: 'Administracija · uporabniki in vloge', tone: 'urgent', action: 'Preglej', page: 'administration' },
  { icon: FileCheck2, title: 'Posodobite predlogo pogodbe', meta: 'Predloge dokumentov · Kultura 2026', tone: 'normal', action: 'Uredi', page: 'administration' },
  { icon: CheckCircle2, title: 'Preverite stanje integracij', meta: 'ODOS, AJPES, SportSi360 in eDavki', tone: 'normal', action: 'Odpri', page: 'administration' },
];

const tasksByRole = { applicant: applicantTasks, admin: adminTasks, commission: commissionTasks, administrator: administratorTasks };
const applicationsPageFor = (role) => role === 'applicant' ? 'applications' : role === 'commission' ? 'commission-applications' : 'admin-applications';
const callsPageFor = (role) => role === 'applicant' ? 'calls' : role === 'commission' ? 'commission-applications' : 'admin-calls';

function ApplicationRows({ items, onSelect, compact = false }) {
  return (
    <div className={`application-list ${compact ? 'application-list--compact' : ''}`}>
      {items.map((application) => (
        <button className="application-row" key={application.id} type="button" onClick={() => onSelect(application)}>
          <span className="application-row__main">
            <strong>{application.program}</strong>
            <span>{application.id} · {application.applicant}</span>
          </span>
          {!compact && <span className="application-row__amount">{formatCurrency(application.amount)}</span>}
          <StatusBadge tone={application.tone}>{application.status}</StatusBadge>
          <ChevronRight size={17} className="muted-icon" />
        </button>
      ))}
    </div>
  );
}

function Tasks({ role, navigate }) {
  const tasks = tasksByRole[role] || adminTasks;
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className="task-item" key={task.title}>
          <span className={`task-item__icon ${task.tone === 'urgent' ? 'task-item__icon--urgent' : ''}`}><task.icon size={18} /></span>
          <div className="task-item__copy"><strong>{task.title}</strong><span>{task.meta}</span></div>
          <button type="button" onClick={() => navigate(task.page)}>{task.action}<ArrowRight size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function ManagedCallSwitcher({ calls, activeCall, onChange }) {
  if (!activeCall) return null;
  return (
    <section className="managed-calls panel" aria-labelledby="managed-calls-title">
      <div className="managed-calls__label">
        <span className="managed-calls__icon"><Files size={18} /></span>
        <div><strong id="managed-calls-title">Moji razpisi</strong><small>Maja Kovač · dodeljeni razpisi ({calls.length})</small></div>
      </div>
      <div className="managed-calls__options" role="group" aria-label="Izberite aktivni razpis">
        {calls.map((call) => {
          const area = areas.find((item) => item.name === call.area) || areas[0];
          const active = call.id === activeCall.id;
          return (
            <button type="button" key={call.id} className={active ? 'active' : ''} aria-pressed={active} title={call.title} onClick={() => onChange(call.id)}>
              <AreaIcon area={area} size="sm" />
              <div><strong>{call.area}</strong><small>{call.status}</small></div>
              {active && <CheckCircle2 size={15} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ActiveCall({ role, call, navigate, startApplication }) {
  const isApplicant = role === 'applicant';
  const isAdministrator = role === 'administrator';
  const isCallManager = role === 'admin' || isAdministrator;
  const actionIcon = isApplicant ? FilePlus2 : isCallManager ? Files : ClipboardCheck;
  const actionLabel = isApplicant ? 'Oddaj novo vlogo' : isCallManager ? 'Upravljaj razpis' : 'Nadaljuj vrednotenje';
  return (
    <section className="active-call">
      <div className="active-call__top">
        <Badge tone={isApplicant || isCallManager ? 'mint' : 'lavender'}>{isApplicant ? 'Odprt za oddajo' : role === 'admin' ? call.status : isAdministrator ? 'Aktivni razpis' : 'Trenutna faza: vrednotenje'}</Badge>
        <span className="active-call__code">{call.code}</span>
      </div>
      <div className="active-call__body">
        <span className="active-call__watermark">{isApplicant ? <Trophy /> : <Sparkles />}</span>
        <p>{call.area} · Javni razpis 2026</p>
        <h2>{call.title}</h2>
        <div className="active-call__facts">
          <span><CalendarClock size={16} />{isApplicant ? 'Rok za oddajo: 18. 11. 2026' : `${call.applications} prejetih vlog`}</span>
          <span><WalletCards size={16} />{formatCurrency(call.budget)} razpoložljivih sredstev</span>
        </div>
      </div>
      <div className="active-call__footer">
        <div className="deadline-visual">
          <strong>{isApplicant ? '25' : role === 'admin' ? `${call.phase}/7` : '68'}</strong>
          <span>{isApplicant ? 'dni do roka' : role === 'admin' ? 'trenutna faza razpisa' : '% ocenjenih programov'}</span>
        </div>
        <Button variant="light" icon={actionIcon} onClick={() => isApplicant ? startApplication(call) : navigate(isCallManager ? 'admin-calls' : 'scoring')}>
          {actionLabel}
        </Button>
      </div>
    </section>
  );
}

export function DashboardA({ role, applications, calls, activeManagedCall, onManagedCallChange, navigate, startApplication, selectApplication }) {
  const mine = role === 'applicant';
  const visible = (mine ? applications.filter((item) => item.mine) : applications).slice(0, 4);
  const call = activeManagedCall || calls.find((item) => item.id === (mine ? 'sport-2026' : 'kultura-2026')) || calls[0];
  const statsByRole = {
    applicant: [
      { label: 'Aktivne vloge', value: '2', note: '1 zahteva dopolnitev', icon: Files, tone: 'green' },
      { label: 'Odobrena sredstva', value: '45.700 €', note: 'V letu 2026', icon: WalletCards, tone: 'blue' },
      { label: 'Razpolaganje sredstev', value: '68 %', note: '31.124 € porabljenih', icon: TrendingUp, tone: 'purple' },
      { label: 'Neodgovorjena sporočila', value: '1', note: 'Prejeto 21. oktobra', icon: MessageSquareText, tone: 'orange' },
    ],
    admin: [
      { label: 'Prejete vloge', value: '327', note: '+18 ta teden', icon: Files, tone: 'green' },
      { label: 'V formalnem pregledu', value: '42', note: '12 rok do petka', icon: FolderClock, tone: 'orange' },
      { label: 'V vrednotenju', value: '96', note: 'Razpis Kultura 2026', icon: ClipboardCheck, tone: 'purple' },
      { label: 'Dodeljena sredstva', value: '1,28 mio €', note: '74 % letnega okvira', icon: WalletCards, tone: 'blue' },
    ],
    commission: [
      { label: 'Dodeljeni programi', value: '73', note: 'Razpis Kultura 2026', icon: Files, tone: 'green' },
      { label: 'Ocenjeni programi', value: '65', note: '89 % vrednotenja', icon: ClipboardCheck, tone: 'blue' },
      { label: 'Preostale ocene', value: '8', note: 'Rok: 30. oktober', icon: FolderClock, tone: 'orange' },
      { label: 'Povprečno število točk', value: '82,4', note: 'Po vseh članih komisije', icon: TrendingUp, tone: 'purple' },
    ],
    administrator: [
      { label: 'Aktivni uporabniki', value: '184', note: '5 čaka aktivacijo', icon: UsersRound, tone: 'green' },
      { label: 'Aktivni razpisi', value: '4', note: '9 razpisnih področij', icon: Files, tone: 'blue' },
      { label: 'Sistemski dokumenti', value: '1.842', note: 'Sinhronizirano z ODOS', icon: FileCheck2, tone: 'purple' },
      { label: 'Aktivne integracije', value: '4 / 4', note: 'Vse povezave delujejo', icon: CheckCircle2, tone: 'blue' },
    ],
  };
  const stats = statsByRole[role];
  const header = {
    applicant: { name: 'Ana', description: 'Tukaj je pregled vaših vlog, rokov in naslednjih korakov.', action: 'Nova vloga', page: null, icon: Plus },
    admin: { name: 'Maja', description: 'Tukaj je pregled aktivnih razpisov in nalog, ki zahtevajo vašo pozornost.', action: 'Nov razpis', page: 'admin-calls', icon: Plus },
    commission: { name: 'Peter', description: 'Pregled dodeljenih programov, vaših ocen in nalog komisije.', action: 'Nadaljuj vrednotenje', page: 'scoring', icon: ClipboardCheck },
    administrator: { name: 'Marko', description: 'Pregled sistema, uporabnikov, integracij in administrativnih nalog.', action: 'Dodaj uporabnika', page: 'administration', icon: UsersRound },
  }[role];

  return (
    <div className="dashboard dashboard-a">
      <PageHeader
        eyebrow="Nedelja, 25. oktober 2026"
        title={`Dober dan, ${header.name}.`}
        description={header.description}
        actions={<Button icon={header.icon} onClick={() => mine ? startApplication(call) : navigate(header.page)}>{header.action}</Button>}
      />
      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <span className={`stat-card__icon stat-card__icon--${stat.tone}`}><stat.icon size={20} /></span>
            <div className="stat-card__label">{stat.label}</div>
            <strong>{stat.value}</strong>
            <span className="stat-card__note">{stat.note}</span>
          </article>
        ))}
      </div>
      {role === 'admin' && <ManagedCallSwitcher calls={calls} activeCall={activeManagedCall} onChange={onManagedCallChange} />}
      <div className="dashboard-a__spotlight">
        <ActiveCall role={role} call={call} navigate={navigate} startApplication={startApplication} />
        <section className="panel task-panel">
          <SectionHeading title="Naslednji koraki" description={mine ? 'Naloge in roki za vaše programe' : 'Prednostne naloge za ta teden'} />
          <Tasks role={role} navigate={navigate} />
          {mine && <div className="support-note"><span><BellRing size={17} /></span><p>Potrebujete pomoč? Skrbniki so dosegljivi ob delavnikih od 8. do 16. ure.</p><button type="button" onClick={() => navigate('support')}>Kontakt</button></div>}
        </section>
      </div>
      <section className="panel recent-panel">
        <SectionHeading title={mine ? 'Moje zadnje vloge' : role === 'commission' ? 'Zadnji programi v vrednotenju' : 'Zadnje prejete vloge'} link="Prikaži vse" onLink={() => navigate(applicationsPageFor(role))} />
        <ApplicationRows items={visible} onSelect={selectApplication} />
      </section>
    </div>
  );
}

export function DashboardB({ role, applications, calls, activeManagedCall, onManagedCallChange, navigate, startApplication, selectApplication }) {
  const mine = role === 'applicant';
  const visible = (mine ? applications.filter((item) => item.mine) : applications).slice(0, 5);
  const call = activeManagedCall || calls.find((item) => item.id === (mine ? 'sport-2026' : 'kultura-2026')) || calls[0];
  const activePhase = call.phase;
  const currentPhase = phases[activePhase - 1];
  const canApply = activePhase === 1 && call.status === 'Odprt';
  const phaseTrackRef = useRef(null);
  useEffect(() => {
    const centerActiveStep = () => {
      const track = phaseTrackRef.current;
      const activeStep = track?.querySelector('[aria-current="step"]');
      if (!track || !activeStep || track.scrollWidth <= track.clientWidth) return;
      const trackBounds = track.getBoundingClientRect();
      const stepBounds = activeStep.getBoundingClientRect();
      const left = track.scrollLeft + stepBounds.left - trackBounds.left - (track.clientWidth - stepBounds.width) / 2;
      track.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
    };
    centerActiveStep();
    window.addEventListener('resize', centerActiveStep);
    return () => window.removeEventListener('resize', centerActiveStep);
  }, [activePhase, call.id]);
  const commissionHeader = activePhase === 5
    ? { eyebrow: 'Delovno mesto komisije', title: 'Ocene komisije, korak za korakom.', description: 'Dodeljeni programi, merila in skupni napredek vrednotenja.', action: 'Nadaljuj vrednotenje', page: 'scoring', icon: ClipboardCheck }
    : activePhase > 5
      ? { eyebrow: 'Delovno mesto komisije', title: 'Od ocen do realizacije programov.', description: 'Pregled zaključenega vrednotenja, odločb in dokumentacije dodeljenih programov.', action: 'Preglej dokumente', page: 'documents', icon: FileCheck2 }
      : { eyebrow: 'Delovno mesto komisije', title: 'Priprava na vrednotenje programov.', description: 'Preglejte dodeljeni razpis in se pripravite na vrednotenje po zaključku formalnega pregleda.', action: 'Dodeljene vloge', page: 'commission-applications', icon: Files };
  const header = {
    applicant: { eyebrow: 'Vlagateljski portal', title: 'Vaš razpis, korak za korakom.', description: 'Spremljajte potek vloge in dokončajte odprte naloge na enem mestu.', action: 'Oddaj novo vlogo', page: null, icon: FilePlus2 },
    admin: { eyebrow: 'Skrbniško delovno mesto', title: 'Od prejete vloge do realizacije.', description: 'Procesni pregled aktivnega razpisa in naloge po posameznih fazah.', action: 'Nov razpis', page: 'admin-calls', icon: Plus },
    commission: commissionHeader,
    administrator: { eyebrow: 'Sistemska administracija', title: 'Nadzor sistema na enem mestu.', description: 'Uporabniki, nastavitve in integracije s pregledom celotnega postopka.', action: 'Odpri administracijo', page: 'administration', icon: UsersRound },
  }[role];
  const adminFocusByPhase = {
    1: { title: 'Spremljajte prijave in rok oddaje', description: `Prejetih je že ${call.applications} vlog. Pred zaključkom preverite nepopolne prijave in odgovorite na odprta vprašanja vlagateljev.`, label: 'Rok za oddajo', date: call.deadline, action: 'Preglej prejete vloge', page: 'admin-applications', icon: Files },
    2: { title: 'Pripravite izobraževanje za vlagatelje', description: 'Na voljo so gradiva, video navodila in termin individualne podpore. Vlagatelje obvestite o naslednjem informativnem dnevu.', label: 'Naslednji informativni dan', date: '28. oktober 2026', action: 'Odpri izobraževanja', page: 'izobrazevanja', icon: UsersRound },
    3: { title: 'Dokončajte formalni pregled', description: `Pri razpisu je ${call.applications} prejetih vlog. Preverite izpolnjevanje pogojev in priloge ter pripravite morebitne pozive k dopolnitvi.`, label: 'Prednostni rok', date: '30. oktober 2026', action: 'Odpri formalni pregled', page: 'admin-applications', icon: ListChecks },
    4: { title: 'Preglejte dopolnitve vlog', description: 'Preverite prispele priloge, podaljšajte rok po potrebi in zaključite formalni pregled pred vrednotenjem.', label: 'Rok za dopolnitev', date: '29. oktober 2026', action: 'Odpri dopolnitve', page: 'admin-applications', icon: Upload },
    5: { title: 'Dokončajte vrednotenje 8 programov', description: 'Komisija je ocenila večino programov. Za predlog razporeditve sredstev manjka še 8 ocen in skupna potrditev rang liste.', label: 'Načrtovani zaključek', date: '30. oktober 2026', action: 'Nadaljuj vrednotenje', page: 'scoring', icon: ClipboardCheck },
    6: { title: 'Pripravite odločbe in pogodbe', description: 'Preglejte potrjeno rang listo, pripravite odločbe o sofinanciranju in pošljite pogodbe v podpis izbranim vlagateljem.', label: 'Načrtovana izdaja', date: '6. november 2026', action: 'Preglej dokumente', page: 'documents', icon: FileCheck2 },
    7: { title: 'Spremljajte realizacijo programov', description: 'Preglejte odprte zahtevke za izplačilo, račune in končna poročila, ki jih morate potrditi.', label: 'Naslednji pregled', date: 'Danes, 14:00', action: 'Odpri zahtevke', page: 'admin-reports', icon: FileCheck2 },
  };
  const adminFocus = adminFocusByPhase[activePhase] || adminFocusByPhase[1];
  const commissionFocus = activePhase === 5
    ? { title: 'Ocenite preostalih 8 programov', description: 'Skupno je ocenjenih 65 od 73 dodeljenih programov. Vaše ocene se samodejno shranjujejo v revizijsko sled.', label: 'Rok vrednotenja', date: '30. oktober 2026', action: 'Nadaljuj ocenjevanje', page: 'scoring', icon: ClipboardCheck }
    : activePhase === 6
      ? { title: 'Preglejte pripravljene odločbe', description: 'Vrednotenje je zaključeno. Preverite skupno rang listo in pripravljene odločbe o sofinanciranju izbranih programov.', label: 'Načrtovana izdaja', date: '6. november 2026', action: 'Preglej dokumente', page: 'documents', icon: FileCheck2 }
      : activePhase === 7
        ? { title: 'Spremljajte realizacijo programov', description: 'Odobreni programi so v realizaciji. Dokumentacija ostaja na voljo komisiji, zahtevke in poročila pa obravnava skrbnik razpisa.', label: 'Status vrednotenja', date: 'Zaključeno in potrjeno', action: 'Odpri dokumente', page: 'documents', icon: FileCheck2 }
        : { title: 'Vrednotenje še ni na vrsti', description: 'Komisija bo programe dobila v ocenjevanje po zaključenem formalnem pregledu. Do takrat si lahko ogledate razpis in dodeljene vloge.', label: 'Trenutna faza', date: currentPhase.name, action: 'Preglej dodeljene vloge', page: 'commission-applications', icon: Files };
  const focus = {
    applicant: { title: 'Dopolnite manjkajočo prilogo', description: 'Pri vlogi »Vadba za starejše« manjka potrdilo o izvedenih programih v preteklem letu.', label: 'Rok za dopolnitev', date: '29. oktober 2026', action: 'Odpri dopolnitev', page: 'applications', icon: Upload },
    admin: adminFocus,
    commission: commissionFocus,
    administrator: { title: 'Aktivirajte 5 novih uporabnikov', description: 'Novi uporabniki čakajo dodelitev vloge in razpisnih področij. Pred aktivacijo preverite tudi njihove dostope.', label: 'Zadnji sistemski pregled', date: 'Danes, 08:55', action: 'Odpri administracijo', page: 'administration', icon: UsersRound },
  }[role];
  const heroStats = mine ? [
    { label: 'Moje aktivne vloge', value: '2', icon: Files },
    { label: 'Rok za oddajo', value: '18. 11. 2026', icon: CalendarClock },
    { label: 'Odobrena sredstva', value: '45.700 €', icon: WalletCards },
  ] : role === 'commission' ? [
    { label: 'Dodeljeni programi', value: '73', icon: Files },
    { label: 'Ocenjeni programi', value: activePhase > 5 ? '73' : activePhase === 5 ? '65' : '0', icon: ClipboardCheck },
    { label: 'Preostale ocene', value: activePhase > 5 ? '0' : activePhase === 5 ? '8' : '73', icon: FolderClock },
  ] : [
    { label: 'Prejete vloge', value: call.applications, icon: Files },
    { label: 'Rok oziroma status', value: call.phase === 1 ? call.deadline : call.status, icon: CalendarClock },
    { label: 'Okvir sredstev', value: formatCurrency(call.budget), icon: WalletCards },
  ];
  return (
    <div className="dashboard dashboard-b">
      <PageHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
        actions={<Button icon={header.icon} disabled={mine && !canApply} onClick={() => mine ? startApplication(call) : navigate(header.page)}>{mine && !canApply ? 'Oddaja je zaključena' : header.action}</Button>}
      />
      {role === 'admin' && <ManagedCallSwitcher calls={calls} activeCall={activeManagedCall} onChange={onManagedCallChange} />}
      <section className="workflow-panel" aria-labelledby="workflow-call-title">
        <div className="workflow-panel__heading">
          <div>
            <div className="workflow-panel__kicker"><span aria-hidden="true" />{mine ? 'Javni razpis' : role === 'commission' ? 'Dodeljeno vrednotenje' : 'Aktivni razpis'} · {call.area}</div>
            <h2 id="workflow-call-title">{call.title}</h2>
            <p className="workflow-panel__meta"><span>{call.code}</span><span aria-hidden="true">·</span><span>{currentPhase.name}</span></p>
          </div>
          <Button variant="light" size="sm" onClick={() => navigate(callsPageFor(role))}>{role === 'commission' ? 'Dodeljene vloge' : 'Podrobnosti razpisa'}<ArrowUpRight size={15} /></Button>
        </div>
        <p className="workflow-panel__description">{call.description}</p>
        <div className="workflow-call-stats">
          {heroStats.map((stat) => <div key={stat.label}><stat.icon size={18} /><span><small>{stat.label}</small><strong>{stat.value}</strong></span></div>)}
        </div>
        <ol className="phase-track" aria-label="Faze razpisa" ref={phaseTrackRef}>
          {phases.map((phase) => (
            <li className={`phase-step ${phase.id < activePhase ? 'done' : ''} ${phase.id === activePhase ? 'current' : ''}`} key={phase.id} aria-current={phase.id === activePhase ? 'step' : undefined} title={phase.name}>
              <span className="phase-step__marker" aria-hidden="true">{phase.id < activePhase ? <Check size={15} /> : phase.id}</span>
              <div><strong>{phase.short}</strong><span>{phase.id === activePhase ? 'Aktivna faza' : phase.id < activePhase ? 'Zaključeno' : 'Sledi'}</span></div>
            </li>
          ))}
        </ol>
      </section>
      <div className="workflow-grid">
        <section className="workflow-focus panel">
          <div className="workflow-focus__label"><Sparkles size={16} /> Prednostna naloga</div>
          <h2>{focus.title}</h2>
          <p>{focus.description}</p>
          <div className="workflow-focus__deadline"><Clock3 size={18} /><span>{focus.label}<strong>{focus.date}</strong></span></div>
          <Button icon={focus.icon} onClick={() => navigate(focus.page)}>{focus.action}</Button>
        </section>
        <section className="panel workflow-tasks">
          <SectionHeading title="Naloge ta teden" description="3 odprte naloge" />
          <Tasks role={role} navigate={navigate} />
        </section>
        <aside className="workflow-aside">
          <section className="mini-summary">
            <span className="mini-summary__icon"><WalletCards size={20} /></span>
            <p>{mine ? 'Odobrena sredstva v 2026' : 'Okvir sredstev razpisa'}</p>
            <strong>{mine ? '45.700 €' : formatCurrency(call.budget)}</strong>
            <ProgressBar value={mine ? 68 : 74} />
            <small>{mine ? '14.576 € še na voljo' : `${formatCurrency(Math.round(call.budget * 0.74))} že razporejenih`}</small>
          </section>
          <section className="mini-summary mini-summary--plain">
            <span className="mini-summary__icon">{role === 'admin' ? <Files size={20} /> : <UsersRound size={20} />}</span>
            <p>{mine ? 'Vaša skrbnica' : role === 'commission' ? 'Člani komisije' : role === 'admin' ? 'Dodeljeni razpisi' : 'Aktivni uporabniki danes'}</p>
            <strong>{mine ? 'Maja Kovač' : role === 'commission' ? '5' : role === 'admin' ? calls.length : '84'}</strong>
            <small>{mine ? 'Odgovori praviloma v 24 urah' : role === 'commission' ? '3 člani so zaključili ocenjevanje' : role === 'admin' ? calls.map((item) => item.area).join(' · ') : '12 skrbnikov · 72 vlagateljev'}</small>
            {(mine || role === 'admin') && <button className="text-link" type="button" onClick={() => navigate(mine ? 'support' : 'admin-calls')}>{mine ? 'Prikaži kontakt' : 'Odpri moje razpise'}<ArrowRight size={14} /></button>}
          </section>
        </aside>
      </div>
      <section className="panel recent-panel workflow-recent">
        <SectionHeading title={mine ? 'V teku pri vas' : role === 'commission' ? 'Dodeljeni programi' : 'Zadnja aktivnost na vlogah'} link="Vse vloge" onLink={() => navigate(applicationsPageFor(role))} />
        <ApplicationRows items={visible} onSelect={selectApplication} compact />
      </section>
    </div>
  );
}

export function DashboardC({ role, applications, calls, navigate, startApplication, selectApplication }) {
  const mine = role === 'applicant';
  const visible = (mine ? applications.filter((item) => item.mine) : applications).slice(0, 6);
  const call = calls.find((item) => item.id === (mine ? 'sport-2026' : 'kultura-2026')) || calls[0];
  const chartAreas = areas.slice(0, 6);
  const maxPrograms = Math.max(...chartAreas.map((area) => area.programs));
  const header = {
    applicant: { title: 'Pregled vašega sofinanciranja', description: 'Finančni in statusni pregled vseh programov vaše organizacije.', action: 'Nova vloga', page: null, icon: FilePlus2 },
    admin: { title: 'Razpisi v številkah', description: 'Konsolidiran pogled na vloge, sredstva in napredek po področjih.', action: 'Ustvari razpis', page: 'admin-calls', icon: Plus },
    commission: { title: 'Pregled vrednotenja', description: 'Napredek komisije, porazdelitev ocen in programi, ki še zahtevajo pozornost.', action: 'Nadaljuj ocenjevanje', page: 'scoring', icon: ClipboardCheck },
    administrator: { title: 'Sistemski pregled', description: 'Ključni kazalniki uporabnikov, dokumentov, integracij in razpisnih področij.', action: 'Odpri administracijo', page: 'administration', icon: UsersRound },
  }[role];
  const metrics = {
    applicant: [
      ['Skupaj zaprosil', '66.400 €', '3 vloge v letu 2026'],
      ['Odobreno', '45.700 €', '68,8 % zahtevanega zneska'],
      ['Izplačano', '31.124 €', '68,1 % odobrenih sredstev'],
      ['Odprti obveznosti', '2', '1 dopolnitev · 1 poročilo'],
    ],
    admin: [
      ['Vse prejete vloge', '327', `Dodeljeni razpisi: ${calls.length}`],
      ['Skupaj zahtevana sredstva', '2,46 mio €', '141 % razpoložljivega okvira'],
      ['Razporejena sredstva', '1,28 mio €', '74 % letnega proračuna'],
      ['Povprečen čas pregleda', '3,2 dni', 'Cilj: največ 5 delovnih dni'],
    ],
    commission: [
      ['Dodeljeni programi', '73', 'Razpis Kultura 2026'],
      ['Zaključene ocene', '65', '89 % vrednotenja'],
      ['Preostali programi', '8', 'Rok: 30. oktober 2026'],
      ['Povprečno točk', '82,4', 'Po vseh članih komisije'],
    ],
    administrator: [
      ['Aktivni uporabniki', '184', '5 uporabnikov čaka aktivacijo'],
      ['Vloge v sistemu', '327', '9 področij · 4 aktivni razpisi'],
      ['Sinhronizirani dokumenti', '1.842', 'Zadnja sinhronizacija: 09:48'],
      ['Aktivne integracije', '4 / 4', 'ODOS, AJPES, SportSi360, eDavki'],
    ],
  }[role];
  return (
    <div className="dashboard dashboard-c">
      <PageHeader
        eyebrow="Analitični pregled · 2026"
        title={header.title}
        description={header.description}
        actions={<Button icon={header.icon} onClick={() => mine ? startApplication(call) : navigate(header.page)}>{header.action}</Button>}
      />
      <section className="metric-band">
        {metrics.map(([label, value, note]) => <div className="metric-band__item" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </section>
      <div className="analytics-grid">
        <section className="panel area-chart-panel">
          <SectionHeading title={mine ? 'Programi po statusih' : role === 'commission' ? 'Napredek vrednotenja' : 'Obseg programov po področjih'} description={mine ? 'Porazdelitev vaših vlog v zadnjih treh letih' : role === 'commission' ? 'Dodeljeni programi v razpisu Kultura 2026' : 'Predvideno letno število programov'} />
          {mine ? (
            <div className="status-analytics">
              <div className="donut" style={{ background: 'conic-gradient(#16745f 0 48%, #6885c3 48% 72%, #d39a3e 72% 88%, #dfe6e3 88% 100%)' }}><div><strong>12</strong><span>vseh vlog</span></div></div>
              <div className="chart-legend">
                {[['Zaključene', '6', '#16745f'], ['V postopku', '3', '#6885c3'], ['Dopolnitve', '2', '#d39a3e'], ['Osnutki', '1', '#dfe6e3']].map(([label, value, color]) => <div key={label}><span style={{ background: color }} /><p>{label}</p><strong>{value}</strong></div>)}
              </div>
            </div>
          ) : role === 'commission' ? (
            <div className="status-analytics">
              <div className="donut" style={{ background: 'conic-gradient(#266aab 0 89%, #d39a3e 89% 100%)' }}><div><strong>73</strong><span>dodeljenih</span></div></div>
              <div className="chart-legend">
                {[['Zaključene ocene', '65', '#266aab'], ['Preostali programi', '8', '#d39a3e']].map(([label, value, color]) => <div key={label}><span style={{ background: color }} /><p>{label}</p><strong>{value}</strong></div>)}
              </div>
            </div>
          ) : (
            <div className="horizontal-bars">
              {chartAreas.map((area) => <div className="horizontal-bar" key={area.name}><div><span>{area.name}</span><strong>{area.programs}</strong></div><div className="horizontal-bar__track"><span style={{ width: `${(area.programs / maxPrograms) * 100}%`, background: area.color }} /></div></div>)}
            </div>
          )}
        </section>
        <section className="panel attention-panel">
          <SectionHeading title="Zahteva pozornost" description="Po prioriteti" />
          <Tasks role={role} navigate={navigate} />
          <button className="attention-panel__all" type="button" onClick={() => navigate(applicationsPageFor(role))}>Odpri seznam nalog<ArrowRight size={15} /></button>
        </section>
      </div>
      <section className="panel data-panel">
        <SectionHeading title={mine ? 'Evidence mojih vlog' : role === 'commission' ? 'Zadnji ocenjeni programi' : 'Zadnje spremembe vlog'} description={`${visible.length} prikazanih zapisov`} link="Celoten register" onLink={() => navigate(applicationsPageFor(role))} />
        <ApplicationRows items={visible} onSelect={selectApplication} />
      </section>
      <div className="area-strip">
        {areas.slice(0, 5).map((area) => <button type="button" key={area.name} onClick={() => navigate(callsPageFor(role))}><AreaIcon area={area} size="sm" /><span>{area.name}</span><ArrowUpRight size={14} /></button>)}
      </div>
    </div>
  );
}
