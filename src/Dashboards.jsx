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
  const tasks = role === 'applicant' ? applicantTasks : adminTasks;
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

function ActiveCall({ role, call, navigate, startApplication }) {
  const isApplicant = role === 'applicant';
  return (
    <section className="active-call">
      <div className="active-call__top">
        <Badge tone={isApplicant ? 'mint' : 'lavender'}>{isApplicant ? 'Odprt za oddajo' : 'Trenutna faza: vrednotenje'}</Badge>
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
          <strong>{isApplicant ? '25' : '68'}</strong>
          <span>{isApplicant ? 'dni do roka' : '% ocenjenih programov'}</span>
        </div>
        <Button variant="light" icon={isApplicant ? FilePlus2 : ClipboardCheck} onClick={() => isApplicant ? startApplication(call) : navigate('scoring')}>
          {isApplicant ? 'Oddaj novo vlogo' : 'Nadaljuj vrednotenje'}
        </Button>
      </div>
    </section>
  );
}

export function DashboardA({ role, applications, calls, navigate, startApplication, selectApplication }) {
  const mine = role === 'applicant';
  const visible = (mine ? applications.filter((item) => item.mine) : applications).slice(0, 4);
  const call = calls.find((item) => item.id === (mine ? 'sport-2026' : 'kultura-2026')) || calls[0];
  const stats = mine ? [
    { label: 'Aktivne vloge', value: '2', note: '1 zahteva dopolnitev', icon: Files, tone: 'green' },
    { label: 'Odobrena sredstva', value: '45.700 €', note: 'V letu 2026', icon: WalletCards, tone: 'blue' },
    { label: 'Razpolaganje sredstev', value: '68 %', note: '31.124 € porabljenih', icon: TrendingUp, tone: 'purple' },
    { label: 'Neodgovorjena sporočila', value: '1', note: 'Prejeto 21. oktobra', icon: MessageSquareText, tone: 'orange' },
  ] : [
    { label: 'Prejete vloge', value: '327', note: '+18 ta teden', icon: Files, tone: 'green' },
    { label: 'V formalnem pregledu', value: '42', note: '12 rok do petka', icon: FolderClock, tone: 'orange' },
    { label: 'V vrednotenju', value: '96', note: 'Razpis Kultura 2026', icon: ClipboardCheck, tone: 'purple' },
    { label: 'Dodeljena sredstva', value: '1,28 mio €', note: '74 % letnega okvira', icon: WalletCards, tone: 'blue' },
  ];

  return (
    <div className="dashboard dashboard-a">
      <PageHeader
        eyebrow="Sobota, 24. oktober 2026"
        title={mine ? 'Dober dan, Ana.' : 'Dober dan, Maja.'}
        description={mine ? 'Tukaj je pregled vaših vlog, rokov in naslednjih korakov.' : 'Tukaj je pregled aktivnih razpisov in nalog, ki zahtevajo vašo pozornost.'}
        actions={<Button icon={Plus} onClick={() => mine ? startApplication(call) : navigate('admin-calls')}>{mine ? 'Nova vloga' : 'Nov razpis'}</Button>}
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
      <div className="dashboard-a__spotlight">
        <ActiveCall role={role} call={call} navigate={navigate} startApplication={startApplication} />
        <section className="panel task-panel">
          <SectionHeading title="Naslednji koraki" description={mine ? 'Naloge in roki za vaše programe' : 'Prednostne naloge za ta teden'} />
          <Tasks role={role} navigate={navigate} />
          {mine && <div className="support-note"><span><BellRing size={17} /></span><p>Potrebujete pomoč? Skrbniki so dosegljivi ob delavnikih od 8. do 16. ure.</p><button type="button" onClick={() => navigate('support')}>Kontakt</button></div>}
        </section>
      </div>
      <section className="panel recent-panel">
        <SectionHeading title={mine ? 'Moje zadnje vloge' : 'Zadnje prejete vloge'} link="Prikaži vse" onLink={() => navigate(mine ? 'applications' : 'admin-applications')} />
        <ApplicationRows items={visible} onSelect={selectApplication} />
      </section>
    </div>
  );
}

export function DashboardB({ role, applications, calls, navigate, startApplication, selectApplication }) {
  const mine = role === 'applicant';
  const visible = (mine ? applications.filter((item) => item.mine) : applications).slice(0, 5);
  const call = calls.find((item) => item.id === (mine ? 'sport-2026' : 'kultura-2026')) || calls[0];
  const activePhase = mine ? 1 : 5;
  return (
    <div className="dashboard dashboard-b">
      <PageHeader
        eyebrow={mine ? 'Vlagateljski portal' : 'Skrbniško delovno mesto'}
        title={mine ? 'Vaš razpis, korak za korakom.' : 'Od prejete vloge do realizacije.'}
        description={mine ? 'Spremljajte potek vloge in dokončajte odprte naloge na enem mestu.' : 'Procesni pregled aktivnega razpisa in naloge po posameznih fazah.'}
        actions={<Button variant="secondary" icon={MessageSquareText} onClick={() => navigate(mine ? 'messages' : 'support')}>{mine ? 'Vprašaj skrbnika' : 'Podpora uporabnikom'}</Button>}
      />
      <section className="workflow-panel">
        <div className="workflow-panel__heading">
          <div><Badge tone="green">{call.code}</Badge><h2>{call.title}</h2></div>
          <Button variant="ghost" size="sm" onClick={() => navigate(mine ? 'calls' : 'admin-calls')}>Podrobnosti razpisa<ArrowUpRight size={15} /></Button>
        </div>
        <div className="phase-track">
          {phases.map((phase) => (
            <div className={`phase-step ${phase.id < activePhase ? 'done' : ''} ${phase.id === activePhase ? 'current' : ''}`} key={phase.id}>
              <span className="phase-step__marker">{phase.id < activePhase ? <Check size={15} /> : phase.id}</span>
              <div><strong>{phase.short}</strong><span>{phase.id === activePhase ? 'Aktivna faza' : phase.id < activePhase ? 'Zaključeno' : 'Sledi'}</span></div>
            </div>
          ))}
        </div>
      </section>
      <div className="workflow-grid">
        <section className="workflow-focus">
          <div className="workflow-focus__label"><Sparkles size={16} /> Prednostna naloga</div>
          <h2>{mine ? 'Dopolnite manjkajočo prilogo' : 'Dokončajte vrednotenje 8 programov'}</h2>
          <p>{mine ? 'Pri vlogi »Vadba za starejše« manjka potrdilo o izvedenih programih v preteklem letu.' : 'Komisija je ocenila 65 od 73 programov. Za predlog razporeditve sredstev manjka še 8 ocen.'}</p>
          <div className="workflow-focus__deadline"><Clock3 size={17} /><span>{mine ? 'Rok za dopolnitev' : 'Načrtovani zaključek'}<strong>{mine ? '29. oktober 2026' : '30. oktober 2026'}</strong></span></div>
          <Button icon={mine ? Upload : ClipboardCheck} onClick={() => navigate(mine ? 'applications' : 'scoring')}>{mine ? 'Odpri dopolnitev' : 'Nadaljuj vrednotenje'}</Button>
        </section>
        <section className="panel workflow-tasks">
          <SectionHeading title="Še ta teden" description="3 odprte naloge" />
          <Tasks role={role} navigate={navigate} />
        </section>
        <aside className="workflow-aside">
          <section className="mini-summary">
            <span className="mini-summary__icon"><WalletCards size={20} /></span>
            <p>{mine ? 'Odobrena sredstva v 2026' : 'Okvir sredstev razpisa'}</p>
            <strong>{mine ? '45.700 €' : formatCurrency(call.budget)}</strong>
            <ProgressBar value={mine ? 68 : 74} />
            <small>{mine ? '14.576 € še na voljo' : '229.400 € že razporejenih'}</small>
          </section>
          <section className="mini-summary mini-summary--plain">
            <span className="mini-summary__icon"><UsersRound size={20} /></span>
            <p>{mine ? 'Vaša skrbnica' : 'Aktivni uporabniki danes'}</p>
            <strong>{mine ? 'Maja Kovač' : '84'}</strong>
            <small>{mine ? 'Odgovori praviloma v 24 urah' : '12 skrbnikov · 72 vlagateljev'}</small>
            {mine && <button className="text-link" type="button" onClick={() => navigate('support')}>Prikaži kontakt<ArrowRight size={14} /></button>}
          </section>
        </aside>
      </div>
      <section className="panel recent-panel">
        <SectionHeading title={mine ? 'V teku pri vas' : 'Zadnja aktivnost na vlogah'} link="Vse vloge" onLink={() => navigate(mine ? 'applications' : 'admin-applications')} />
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
  return (
    <div className="dashboard dashboard-c">
      <PageHeader
        eyebrow="Analitični pregled · 2026"
        title={mine ? 'Pregled vašega sofinanciranja' : 'Razpisi v številkah'}
        description={mine ? 'Finančni in statusni pregled vseh programov vaše organizacije.' : 'Konsolidiran pogled na vloge, sredstva in napredek po področjih.'}
        actions={<Button icon={mine ? FilePlus2 : Plus} onClick={() => mine ? startApplication(call) : navigate('admin-calls')}>{mine ? 'Nova vloga' : 'Ustvari razpis'}</Button>}
      />
      <section className="metric-band">
        {(mine ? [
          ['Skupaj zaprosil', '66.400 €', '3 vloge v letu 2026'],
          ['Odobreno', '45.700 €', '68,8 % zahtevanega zneska'],
          ['Izplačano', '31.124 €', '68,1 % odobrenih sredstev'],
          ['Odprti obveznosti', '2', '1 dopolnitev · 1 poročilo'],
        ] : [
          ['Vse prejete vloge', '327', '9 področij · 4 aktivni razpisi'],
          ['Skupaj zahtevana sredstva', '2,46 mio €', '141 % razpoložljivega okvira'],
          ['Razporejena sredstva', '1,28 mio €', '74 % letnega proračuna'],
          ['Povprečen čas pregleda', '3,2 dni', 'Cilj: največ 5 delovnih dni'],
        ]).map(([label, value, note]) => <div className="metric-band__item" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </section>
      <div className="analytics-grid">
        <section className="panel area-chart-panel">
          <SectionHeading title={mine ? 'Programi po statusih' : 'Obseg programov po področjih'} description={mine ? 'Porazdelitev vaših vlog v zadnjih treh letih' : 'Predvideno letno število programov'} />
          {mine ? (
            <div className="status-analytics">
              <div className="donut" style={{ background: 'conic-gradient(#16745f 0 48%, #6885c3 48% 72%, #d39a3e 72% 88%, #dfe6e3 88% 100%)' }}><div><strong>12</strong><span>vseh vlog</span></div></div>
              <div className="chart-legend">
                {[['Zaključene', '6', '#16745f'], ['V postopku', '3', '#6885c3'], ['Dopolnitve', '2', '#d39a3e'], ['Osnutki', '1', '#dfe6e3']].map(([label, value, color]) => <div key={label}><span style={{ background: color }} /><p>{label}</p><strong>{value}</strong></div>)}
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
          <button className="attention-panel__all" type="button" onClick={() => navigate(mine ? 'applications' : 'admin-applications')}>Odpri seznam nalog<ArrowRight size={15} /></button>
        </section>
      </div>
      <section className="panel data-panel">
        <SectionHeading title={mine ? 'Evidence mojih vlog' : 'Zadnje spremembe vlog'} description={`${visible.length} prikazanih zapisov`} link="Celoten register" onLink={() => navigate(mine ? 'applications' : 'admin-applications')} />
        <ApplicationRows items={visible} onSelect={selectApplication} />
      </section>
      <div className="area-strip">
        {areas.slice(0, 5).map((area) => <button type="button" key={area.name} onClick={() => navigate(mine ? 'calls' : 'admin-calls')}><AreaIcon area={area} size="sm" /><span>{area.name}</span><ArrowUpRight size={14} /></button>)}
      </div>
    </div>
  );
}
