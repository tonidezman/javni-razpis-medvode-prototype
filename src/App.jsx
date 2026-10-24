// Three variants of the signed-in home workspace, switchable via ?variant=A|B|C.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bell, BookOpenCheck, Check, CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardCheck, Files, FolderOpen, HelpCircle, LayoutDashboard, LifeBuoy,
  Menu, MessageSquareText, Megaphone, PanelLeftClose, ReceiptText, Search,
  Settings2, ShieldCheck, Sparkles, UserRound, UsersRound, X,
} from 'lucide-react';
import { DashboardA, DashboardB, DashboardC } from './Dashboards.jsx';
import ApplicationFlow from './ApplicationFlow.jsx';
import ApplicationDetail from './ApplicationDetail.jsx';
import {
  ApplicationsPage, CallsPage, DocumentsPage, MessagesPage, ReportsPage, SupportPage,
} from './ApplicantPages.jsx';
import {
  AdminApplicationsPage, AdminCallsPage, AdminReportsPage, AdministrationPage, ScoringPage,
} from './AdminPages.jsx';
import {
  initialApplications, initialCalls, initialDocuments, initialRequests, initialUsers,
} from './data.js';
import { Avatar, Badge, Button, IconButton, SearchBox } from './components/UI.jsx';

const variantNames = { A: 'Kartični pregled', B: 'Procesni tok', C: 'Analitični pregled' };

const applicantNav = [
  { id: 'dashboard', label: 'Pregled', icon: LayoutDashboard },
  { id: 'applications', label: 'Moje vloge', icon: Files, badge: '2' },
  { id: 'calls', label: 'Javni razpisi', icon: Megaphone },
  { id: 'reports', label: 'Zahtevki in poročila', icon: ReceiptText },
  { id: 'documents', label: 'Dokumenti', icon: FolderOpen },
  { id: 'messages', label: 'Sporočila', icon: MessageSquareText, badge: '1' },
];

const adminNav = [
  { id: 'dashboard', label: 'Pregled', icon: LayoutDashboard },
  { id: 'admin-calls', label: 'Razpisi', icon: Megaphone },
  { id: 'admin-applications', label: 'Vloge', icon: Files, badge: '42' },
  { id: 'scoring', label: 'Vrednotenje', icon: ClipboardCheck },
  { id: 'admin-reports', label: 'Zahtevki in poročila', icon: ReceiptText, badge: '4' },
  { id: 'documents', label: 'Dokumenti', icon: FolderOpen },
  { id: 'administration', label: 'Administracija', icon: Settings2 },
];

export default function App() {
  const [role, setRole] = useState('applicant');
  const [page, setPage] = useState('dashboard');
  const [variant, setVariant] = useState(() => {
    const value = new URLSearchParams(window.location.search).get('variant');
    return ['A', 'B', 'C'].includes(value) ? value : 'A';
  });
  const [mobileNav, setMobileNav] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const [applications, setApplications] = useState(initialApplications);
  const [calls, setCalls] = useState(initialCalls);
  const [documents, setDocuments] = useState(initialDocuments);
  const [requests, setRequests] = useState(initialRequests);
  const [users, setUsers] = useState(initialUsers);
  const [applicationCall, setApplicationCall] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);

  const selectedApplication = applications.find((item) => item.id === selectedApplicationId);
  const navItems = role === 'applicant' ? applicantNav : adminNav;

  const notify = useCallback((message) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const navigate = useCallback((target) => {
    setPage(target);
    setSearchQuery('');
    setMobileNav(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const changeRole = (nextRole) => {
    if (nextRole === role) return;
    setRole(nextRole);
    setPage('dashboard');
    setSelectedApplicationId(null);
    setGlobalSearch('');
    setSearchQuery('');
    setNotificationsOpen(false);
    notify(nextRole === 'admin' ? 'Preklopljen je skrbniški pogled.' : 'Preklopljen je vlagateljski pogled.');
  };

  const changeVariant = useCallback((next) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable || applicationCall || selectedApplicationId) return;
      const keys = Object.keys(variantNames);
      const index = keys.indexOf(variant);
      if (event.key === 'ArrowRight') changeVariant(keys[(index + 1) % keys.length]);
      if (event.key === 'ArrowLeft') changeVariant(keys[(index - 1 + keys.length) % keys.length]);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [variant, changeVariant, applicationCall, selectedApplicationId]);

  const startApplication = (call) => setApplicationCall(call || calls.find((item) => item.phase === 1 && item.status === 'Odprt') || calls[0]);
  const submitApplication = (application) => {
    setApplications((current) => [application, ...current]);
    setCalls((current) => current.map((call) => call.id === applicationCall?.id ? { ...call, applications: call.applications + 1 } : call));
  };
  const finishApplication = (destination) => {
    setApplicationCall(null);
    navigate(destination);
    notify('Vloga je shranjena v registru in uspešno prenesena v ODOS.');
  };
  const updateApplication = (id, patch) => setApplications((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  const submitGlobalSearch = (event) => {
    if (event.key !== 'Enter' || !globalSearch.trim()) return;
    navigate(role === 'admin' ? 'admin-applications' : 'applications');
    setSearchQuery(globalSearch);
  };

  const dashboardProps = { role, applications, calls, navigate, startApplication, selectApplication: (item) => setSelectedApplicationId(item.id) };
  const Dashboard = variant === 'B' ? DashboardB : variant === 'C' ? DashboardC : DashboardA;

  let content;
  switch (page) {
    case 'applications': content = <ApplicationsPage applications={applications} onSelect={(item) => setSelectedApplicationId(item.id)} onApply={startApplication} calls={calls} initialQuery={searchQuery} />; break;
    case 'calls': content = <CallsPage calls={calls} onApply={startApplication} notify={notify} />; break;
    case 'reports': content = <ReportsPage requests={requests} setRequests={setRequests} notify={notify} />; break;
    case 'documents': content = <DocumentsPage role={role} documents={documents} setDocuments={setDocuments} notify={notify} />; break;
    case 'messages': content = <MessagesPage notify={notify} />; break;
    case 'support': content = <SupportPage role={role} notify={notify} />; break;
    case 'admin-calls': content = <AdminCallsPage calls={calls} setCalls={setCalls} notify={notify} navigate={navigate} />; break;
    case 'admin-applications': content = <AdminApplicationsPage applications={applications} onSelect={(item) => setSelectedApplicationId(item.id)} notify={notify} initialQuery={searchQuery} />; break;
    case 'scoring': content = <ScoringPage setApplications={setApplications} notify={notify} />; break;
    case 'admin-reports': content = <AdminReportsPage requests={requests} setRequests={setRequests} notify={notify} />; break;
    case 'administration': content = <AdministrationPage users={users} setUsers={setUsers} notify={notify} />; break;
    default: content = <Dashboard {...dashboardProps} />;
  }

  return (
    <div className={`app-shell app-shell--${role}`}>
      <aside className={`sidebar ${mobileNav ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand"><span className="brand__mark">M</span><div><strong>Razpisi</strong><small>Občina Medvode</small></div><IconButton icon={X} label="Zapri meni" className="sidebar__close" onClick={() => setMobileNav(false)} /></div>
        <div className="prototype-label"><Sparkles size={13} /><span>INTERAKTIVNI PROTOTIP</span></div>
        <div className="sidebar__context"><span>{role === 'applicant' ? 'Vlagateljski portal' : 'Upravljanje razpisov'}</span><strong>{role === 'applicant' ? 'Športno društvo Sora' : 'Občina Medvode'}</strong></div>
        <nav className="sidebar__nav" aria-label="Glavna navigacija"><span className="sidebar__nav-label">Meni</span>{navItems.map((item) => <button type="button" key={item.id} className={page === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><item.icon size={19} strokeWidth={1.8} /><span>{item.label}</span>{item.badge && <b>{item.badge}</b>}</button>)}</nav>
        <div className="sidebar__bottom"><button type="button" className={page === 'support' ? 'active' : ''} onClick={() => navigate('support')}><LifeBuoy size={19} /><span>Pomoč in podpora</span><ChevronRight size={15} /></button><div className="sidebar__support"><span><ShieldCheck size={18} /></span><div><strong>Podatki so varni</strong><p>24/7 dostop · ODOS hramba</p></div></div><div className="sidebar__user"><Avatar name={role === 'applicant' ? 'Ana Novak' : 'Maja Kovač'} /><div><strong>{role === 'applicant' ? 'Ana Novak' : 'Maja Kovač'}</strong><span>{role === 'applicant' ? 'Vlagateljica' : 'Skrbnica razpisov'}</span></div><ChevronRight size={16} /></div></div>
      </aside>
      {mobileNav && <button className="sidebar-scrim" aria-label="Zapri meni" type="button" onClick={() => setMobileNav(false)} />}
      <div className="app-main">
        <header className="topbar"><div className="topbar__left"><IconButton icon={Menu} label="Odpri meni" className="mobile-menu" onClick={() => setMobileNav(true)} /><SearchBox value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={submitGlobalSearch} placeholder="Išči razpise, vloge, dokumente …" className="global-search" /></div><div className="topbar__right"><div className="role-switch" aria-label="Preklop pogleda"><span>Pogled</span><button type="button" className={role === 'applicant' ? 'active' : ''} onClick={() => changeRole('applicant')}><UserRound size={15} />Vlagatelj</button><button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => changeRole('admin')}><ShieldCheck size={15} />Skrbnik</button></div><div className="topbar__divider" /><IconButton icon={HelpCircle} label="Pomoč" onClick={() => navigate('support')} /><div className="notification-wrap"><button type="button" className="icon-button notification-button" aria-label="Obvestila" onClick={() => setNotificationsOpen((current) => !current)}><Bell size={19} />{unreadNotifications > 0 && <span>{unreadNotifications}</span>}</button>{notificationsOpen && <div className="notifications-popover"><header><strong>Obvestila</strong><button type="button" onClick={() => setUnreadNotifications(0)}>Označi vse kot prebrano</button></header><div><button type="button" onClick={() => { navigate(role === 'applicant' ? 'applications' : 'admin-applications'); setUnreadNotifications((value) => Math.max(0, value - 1)); }}><span className="notification-dot warning"><FileTextIcon /></span><p><strong>{role === 'applicant' ? 'Rok za dopolnitev se izteka' : '12 vlog čaka formalni pregled'}</strong><small>{role === 'applicant' ? 'Vloga JR-2026-0151 · 29. oktober' : 'Razpis Turizem 2026 · rok ta teden'}</small><em>pred 2 urama</em></p></button><button type="button" onClick={() => { navigate(role === 'applicant' ? 'messages' : 'scoring'); setUnreadNotifications((value) => Math.max(0, value - 1)); }}><span className="notification-dot success"><CheckCircle2 size={17} /></span><p><strong>{role === 'applicant' ? 'Vloga je bila uspešno oddana' : 'Komisija je shranila 8 novih ocen'}</strong><small>{role === 'applicant' ? 'JR-2026-0148 · prenos v ODOS uspel' : 'Razpis Kultura 2026'}</small><em>včeraj</em></p></button><button type="button" onClick={() => navigate('documents')}><span className="notification-dot info"><FolderOpen size={17} /></span><p><strong>Nov dokument v shrambi</strong><small>{role === 'applicant' ? 'Pogodba o sofinanciranju je na voljo' : 'Predloga odločbe je posodobljena'}</small><em>21. oktobra</em></p></button></div><footer><button type="button" onClick={() => { setNotificationsOpen(false); setUnreadNotifications(0); }}>Vsa obvestila<ChevronRight size={14} /></button></footer></div>}</div></div></header>
        <main className="content">{content}</main>
        <footer className="app-footer"><span>© 2026 Občina Medvode · Razpisi</span><div><button type="button" onClick={() => notify('Prikaže se stran s pogoji uporabe.')}>Pogoji uporabe</button><button type="button" onClick={() => notify('Prikaže se stran z varstvom osebnih podatkov.')}>Zasebnost</button><span>Prototip · v0.1</span></div></footer>
      </div>
      {import.meta.env.DEV && <div className="prototype-switcher"><button type="button" aria-label="Prejšnja različica" onClick={() => { const keys = Object.keys(variantNames); changeVariant(keys[(keys.indexOf(variant) - 1 + keys.length) % keys.length]); }}><ChevronLeft size={17} /></button><div><span>Pogled {variant}</span><strong>{variantNames[variant]}</strong></div><button type="button" aria-label="Naslednja različica" onClick={() => { const keys = Object.keys(variantNames); changeVariant(keys[(keys.indexOf(variant) + 1) % keys.length]); }}><ChevronRight size={17} /></button><span className="prototype-switcher__hint">← →</span></div>}
      {toast && <div className="toast" role="status"><span><Check size={16} /></span><p>{toast}</p><button type="button" onClick={() => setToast(null)} aria-label="Zapri obvestilo"><X size={16} /></button></div>}
      {applicationCall && <ApplicationFlow call={applicationCall} onClose={() => setApplicationCall(null)} onSubmit={submitApplication} onFinish={finishApplication} notify={notify} />}
      {selectedApplication && <ApplicationDetail application={selectedApplication} role={role} onClose={() => setSelectedApplicationId(null)} onUpdate={updateApplication} notify={notify} />}
    </div>
  );
}

function FileTextIcon() {
  return <Files size={17} />;
}
