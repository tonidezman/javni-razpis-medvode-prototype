import { useState } from 'react';
import {
  CalendarClock, CalendarDays, Clock3, ExternalLink, Headphones, LifeBuoy,
  Play, UsersRound, Video,
} from 'lucide-react';
import { Badge, Button, PageHeader, SectionHeading, Tabs } from './components/UI.jsx';

const audiences = [
  { id: 'vlagatelji', label: 'Vlagatelji' },
  { id: 'skrbniki', label: 'Skrbniki' },
  { id: 'komisija', label: 'Razpisna komisija' },
];

const audienceByRole = { applicant: 'vlagatelji', admin: 'skrbniki', commission: 'komisija', administrator: 'skrbniki' };

const eventTypes = {
  video: { label: 'Video navodila', icon: Video, tone: 'purple', action: 'Predvajaj posnetek' },
  delavnica: { label: 'Delavnica', icon: UsersRound, tone: 'blue', action: 'Priključi se k izobraževanju' },
  'informativni dan': { label: 'Informativni dan', icon: CalendarDays, tone: 'success', action: 'Priključi se k izobraževanju' },
};

const educationEvents = [
  {
    id: 'iz-001', audience: 'vlagatelji', type: 'informativni dan',
    title: 'Informativni dan – javni razpis šport 2026',
    description: 'Predstavitev razpisne aplikacije, rokov in novosti. Obvezna predavanja.',
    date: '28. 10. 2026 ob 16:00', format: 'Spletna videokonferenca · 45 min',
  },
  {
    id: 'iz-002', audience: 'vlagatelji', type: 'video',
    title: 'Elektronska oddaja vloge korak za korakom',
    description: 'Praktičen pregled priprave vloge, obveznih prilog, elektronskega podpisa in uspešne oddaje.',
    date: 'Na voljo kadarkoli', format: 'Video navodila · 12 min',
  },
  {
    id: 'iz-003', audience: 'skrbniki', type: 'delavnica',
    title: 'Delavnica za skrbnike: elektronsko dopolnjevanje vlog',
    description: 'Praktična delavnica s skrbniškimi postopki v fazi dopolnjevanja.',
    date: '3. 11. 2026 ob 14:00', format: 'Spletna delavnica · 60 min',
  },
  {
    id: 'iz-004', audience: 'skrbniki', type: 'video',
    title: 'Formalni pregled in revizijska sled',
    description: 'Pregled kontrolnega seznama, pozivov vlagateljem in beleženja odločitev v skrbniškem delovnem mestu.',
    date: 'Na voljo kadarkoli', format: 'Video navodila · 16 min',
  },
  {
    id: 'iz-005', audience: 'komisija', type: 'video',
    title: 'Uporaba aplikacije za člane razpisne komisije',
    description: 'Video navodila za delo v komisijskem pregledovalniku, projekciji sejne sobe in točkovanje.',
    date: 'Na voljo kadarkoli', format: 'Video navodila · 18 min',
  },
  {
    id: 'iz-006', audience: 'komisija', type: 'delavnica',
    title: 'Soglasno točkovanje in priprava rang liste',
    description: 'Praktični primeri vrednotenja, usklajevanja ocen in priprave predloga razporeditve sredstev.',
    date: '29. 10. 2026 ob 10:00', format: 'Spletna delavnica · 75 min',
  },
];

const supportItems = [
  { icon: Clock3, title: 'Odziv v roku 24 ur', description: 'V delovnem tednu odgovorimo najkasneje v 24 urah.' },
  { icon: Headphones, title: 'Tehnična podpora 8:00–16:00', description: 'Pomoč ob tehničnih težavah med delovnim časom.' },
  { icon: CalendarClock, title: 'Pomoč ob razpisnih rokih', description: 'Povečana razpoložljivost v ključnih obdobjih.' },
];

export default function EducationPage({ role, navigate, notify }) {
  const [audience, setAudience] = useState(audienceByRole[role] || 'vlagatelji');
  const visibleEvents = educationEvents.filter((event) => event.audience === audience);
  const counts = Object.fromEntries(audiences.map((item) => [item.id, educationEvents.filter((event) => event.audience === item.id).length]));

  return (
    <div className="page education-page">
      <PageHeader
        eyebrow="Usposabljanje in podpora"
        title="Izobraževanja in informativni dnevi"
        description="Uporabniki so vedno novi, skrbniki se vsakodnevno srečujejo z vprašanji, zato aplikacija ponuja redna usposabljanja. Izobraževanja se izvajajo javno prek spletne video konference ali posamično s klicem uporabnika oziroma skrbnika."
        actions={<Button variant="secondary" icon={LifeBuoy} onClick={() => navigate('support')}>Pomoč in podpora</Button>}
      />
      <div className="education-tabs"><Tabs items={audiences} active={audience} onChange={setAudience} counts={counts} /></div>
      <div className="education-grid">
        {visibleEvents.map((event) => {
          const type = eventTypes[event.type];
          const TypeIcon = type.icon;
          return <article className="education-card panel" key={event.id}>
            <div className="education-card__top"><Badge tone={type.tone}>{type.label}</Badge><span className="education-card__icon"><TypeIcon size={21} /></span></div>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <div className="education-card__meta"><span><CalendarDays size={16} />{event.date}</span><span><Video size={16} />{event.format}</span></div>
            <footer><small>{event.type === 'video' ? 'Dostop 24/7' : 'Prijava ni obvezna'}</small><Button variant="secondary" size="sm" icon={event.type === 'video' ? Play : ExternalLink} onClick={() => notify(event.type === 'video' ? `Video navodila »${event.title}« so pripravljena za predvajanje.` : `Povezava za »${event.title}« je pripravljena. Vabilo je dodano med vaša sporočila.`)}>{type.action}</Button></footer>
          </article>;
        })}
      </div>
      <section className="education-support panel">
        <SectionHeading title="Pomoč uporabnikom in skrbnikom med letom" description="Pomoč je na voljo tudi izven rednih izobraževanj." />
        <div className="education-support__grid">{supportItems.map((item) => <article key={item.title}><span><item.icon size={20} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
      </section>
    </div>
  );
}
