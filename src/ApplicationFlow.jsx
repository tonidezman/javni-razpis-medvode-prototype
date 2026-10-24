import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, ChevronRight,
  Cloud, FileCheck2, FilePlus2, FileText, History, Info, Landmark,
  Link2, Loader2, LockKeyhole, Paperclip, ShieldCheck, Sparkles, Trash2,
  UploadCloud, X,
} from 'lucide-react';
import { Button, Field, IconButton } from './components/UI.jsx';
import { formatCurrency } from './data.js';

const steps = [
  { id: 1, label: 'Vlagatelj', description: 'Podatki organizacije' },
  { id: 2, label: 'Program', description: 'Vsebina in financiranje' },
  { id: 3, label: 'Priloge', description: 'Obvezni dokumenti' },
  { id: 4, label: 'Oddaja', description: 'Pregled in podpis' },
];

const initialAttachments = [
  { id: 1, name: 'Statut_SD_Sora.pdf', size: '1,2 MB', required: 'Statut ali akt o ustanovitvi' },
  { id: 2, name: 'Porocilo_o_delu_2025.pdf', size: '2,4 MB', required: 'Poročilo o delu v preteklem letu' },
  { id: 3, name: 'Podpisana_vloga_SD_Sora.pdf', size: '860 KB', required: 'Podpisan in žigosan obrazec prijave' },
];

export default function ApplicationFlow({ call, onClose, onSubmit, onFinish, notify }) {
  const [step, setStep] = useState(1);
  const [applicationId] = useState(() => `JR-2026-${String(Math.floor(Math.random() * 800 + 200))}`);
  const [submitted, setSubmitted] = useState(false);
  const [ajpesLoaded, setAjpesLoaded] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [form, setForm] = useState({
    organization: 'Športno društvo Sora', registration: '4021187000', tax: 'SI 48291038',
    address: 'Cesta ob Sori 12, 1215 Medvode', contact: 'Ana Novak', email: 'ana.novak@sd-sora.si',
    program: '', amount: '24800', ownAmount: '6200', description: '', code: 'VSE-2026-84K2P',
  });

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const total = useMemo(() => Number(form.amount || 0) + Number(form.ownAmount || 0), [form.amount, form.ownAmount]);
  const hasAttachment = (label) => attachments.some((file) => file.required === label);
  const requiredCount = ['Statut ali akt o ustanovitvi', 'Poročilo o delu v preteklem letu', 'Podpisan in žigosan obrazec prijave'].filter(hasAttachment).length;

  const loadAjpes = () => {
    setAjpesLoaded(true);
    notify('Podatki o pravni osebi so bili pridobljeni iz registra AJPES.');
  };

  const loadHistory = () => {
    setHistoryLoaded(true);
    setForm((current) => ({ ...current, program: 'Program mladih športnikov 2026', description: 'Program vključuje redne treninge, tekmovanja in strokovno vodstvo za mlade športnike v osmih starostnih skupinah.' }));
    notify('Podatki in priloge so bili preneseni iz vloge JR-2025-0092.');
  };

  const addFiles = (event) => {
    const files = Array.from(event.target.files || []).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      required: 'Dodatna priloga',
    }));
    setAttachments((current) => [...current, ...files]);
    if (files.length) notify(`${files.length} ${files.length === 1 ? 'priloga je bila dodana' : 'prilogi sta bili dodani'}.`);
    event.target.value = '';
  };

  const submit = () => {
    onSubmit({
      id: applicationId,
      program: form.program || 'Program mladih športnikov 2026',
      applicant: form.organization,
      registration: form.registration,
      area: call.area,
      call: call.title,
      submitted: '24. 10. 2026',
      amount: Number(form.amount || 0),
      status: 'Oddana',
      tone: 'neutral',
      mine: true,
      completeness: 100,
      points: null,
    });
    setSubmitted(true);
  };

  return (
    <div className="application-flow" role="dialog" aria-modal="true" aria-label="Nova vloga">
      <header className="application-flow__header">
        <div className="brand brand--flow"><span className="brand__mark">M</span><div><strong>Razpisi</strong><small>Občina Medvode</small></div></div>
        <div className="application-flow__title"><span>Nova vloga</span><strong>{call.title}</strong></div>
        <div className="application-flow__header-actions"><span className="save-state"><Cloud size={16} />Osnutek shranjen</span><IconButton icon={X} label="Zapri vlogo" onClick={onClose} /></div>
      </header>
      {!submitted ? (
        <div className="application-flow__layout">
          <aside className="application-flow__sidebar">
            <div className="flow-call-info"><span>{call.code}</span><strong>Rok za oddajo</strong><p>{call.deadline}</p></div>
            <nav className="flow-steps" aria-label="Koraki vloge">
              {steps.map((item) => (
                <button type="button" key={item.id} className={`${step === item.id ? 'active' : ''} ${step > item.id ? 'done' : ''}`} onClick={() => item.id < step && setStep(item.id)}>
                  <span>{step > item.id ? <Check size={16} /> : item.id}</span>
                  <div><strong>{item.label}</strong><small>{item.description}</small></div>
                  {step === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>
            <div className="flow-help"><ShieldCheck size={20} /><strong>Vara oddaja</strong><p>Podatki so šifrirani. Po oddaji se gradivo samodejno prenese v ODOS.</p></div>
          </aside>
          <main className="application-flow__main">
            <div className="flow-mobile-progress">Korak {step} od 4 · {steps[step - 1].label}</div>
            {step === 1 && (
              <div className="flow-section">
                <div className="flow-section__heading"><span className="flow-section__number">01</span><div><h1>Podatki o vlagatelju</h1><p>Preverite podatke pravne osebe in kontakt za komunikacijo v postopku.</p></div></div>
                <div className="smart-actions">
                  <button type="button" className={ajpesLoaded ? 'completed' : ''} onClick={loadAjpes}><span><Landmark size={20} /></span><div><strong>{ajpesLoaded ? 'Podatki AJPES so osveženi' : 'Pridobi podatke iz AJPES'}</strong><small>Matična številka, naslov in status organizacije</small></div>{ajpesLoaded ? <CheckCircle2 size={19} /> : <ArrowRight size={18} />}</button>
                  <button type="button" className={historyLoaded ? 'completed' : ''} onClick={loadHistory}><span><History size={20} /></span><div><strong>{historyLoaded ? 'Prenos je opravljen' : 'Prenesi prejšnjo vlogo'}</strong><small>JR-2025-0092 · Program mladih športnikov 2025</small></div>{historyLoaded ? <CheckCircle2 size={19} /> : <ArrowRight size={18} />}</button>
                </div>
                {(ajpesLoaded || historyLoaded) && <div className="inline-notice inline-notice--success"><CheckCircle2 size={17} /><span>{historyLoaded ? 'Podatki so izpolnjeni. Pred nadaljevanjem preverite njihovo pravilnost.' : 'Podatki pravne osebe so bili uspešno preverjeni in osveženi.'}</span></div>}
                <div className="form-grid">
                  <Field label="Naziv organizacije" required className="span-2"><input value={form.organization} onChange={update('organization')} /></Field>
                  <Field label="Matična številka" required><input value={form.registration} onChange={update('registration')} /></Field>
                  <Field label="Davčna številka"><input value={form.tax} onChange={update('tax')} /></Field>
                  <Field label="Naslov organizacije" required className="span-2"><input value={form.address} onChange={update('address')} /></Field>
                  <Field label="Kontaktna oseba" required><input value={form.contact} onChange={update('contact')} /></Field>
                  <Field label="E-pošta" required><input type="email" value={form.email} onChange={update('email')} /></Field>
                </div>
                <div className="verified-source"><Building2 size={16} /><span>Vir podatkov: AJPES / eDavki</span><span>Zadnja sinhronizacija: danes, 09:42</span></div>
              </div>
            )}
            {step === 2 && (
              <div className="flow-section">
                <div className="flow-section__heading"><span className="flow-section__number">02</span><div><h1>Podatki o programu</h1><p>Opišite program in navedite predvideni finančni načrt.</p></div></div>
                {historyLoaded && <div className="inline-notice"><History size={17} /><span>Vsebina je bila predizpolnjena iz lanske vloge. Prilagodite jo letošnjemu programu.</span></div>}
                <div className="form-grid">
                  <Field label="Naziv programa ali projekta" required className="span-2"><input value={form.program} onChange={update('program')} placeholder="npr. Program mladih športnikov 2026" /></Field>
                  <Field label="Vsebinsko področje"><select defaultValue={call.area}><option>{call.area}</option></select></Field>
                  <Field label="Trajanje programa"><select defaultValue="year"><option value="year">1. 1. 2026 – 31. 12. 2026</option><option value="custom">Drug obdobje</option></select></Field>
                  <Field label="Opis programa, ciljev in ciljnih skupin" required hint={`${form.description.length} / 2.000 znakov`} className="span-2"><textarea rows="7" value={form.description} onChange={update('description')} placeholder="Opišite namen programa, aktivnosti, ciljne skupine in pričakovane učinke …" /></Field>
                </div>
                <div className="finance-box">
                  <div className="finance-box__heading"><div><h3>Finančni načrt</h3><p>Vnesite zneske brez DDV.</p></div><Sparkles size={20} /></div>
                  <div className="form-grid form-grid--three">
                    <Field label="Zahtevana sredstva občine" required><div className="input-suffix"><input type="number" value={form.amount} onChange={update('amount')} /><span>EUR</span></div></Field>
                    <Field label="Lastna in druga sredstva"><div className="input-suffix"><input type="number" value={form.ownAmount} onChange={update('ownAmount')} /><span>EUR</span></div></Field>
                    <div className="calculated-field"><span>Skupna vrednost programa</span><strong>{formatCurrency(total)}</strong><small>Samodejni izračun</small></div>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flow-section">
                <div className="flow-section__heading"><span className="flow-section__number">03</span><div><h1>Obrazci in priloge</h1><p>Naložite zahtevane dokumente. Dovoljeni formati so PDF, DOCX, XLSX in JPG.</p></div></div>
                <div className="attachment-summary"><div><FileCheck2 size={19} /><span>Obvezne priloge<strong>{requiredCount} od 3 dodanih</strong></span></div><span>Največ 20 MB na dokument</span></div>
                <div className="required-documents">
                  {[
                    ['Statut ali akt o ustanovitvi', hasAttachment('Statut ali akt o ustanovitvi')],
                    ['Poročilo o delu v preteklem letu', hasAttachment('Poročilo o delu v preteklem letu')],
                    ['Podpisan in žigosan obrazec prijave', hasAttachment('Podpisan in žigosan obrazec prijave')],
                  ].map(([label, complete]) => <div className={complete ? 'complete' : ''} key={label}><span>{complete ? <Check size={15} /> : <FileText size={16} />}</span><strong>{label}</strong><small>{complete ? 'Dodano' : 'Manjka'}</small></div>)}
                </div>
                <label className="upload-zone">
                  <input type="file" multiple onChange={addFiles} />
                  <span><UploadCloud size={27} /></span>
                  <strong>Povlecite datoteke sem ali kliknite za izbiro</strong>
                  <p>PDF, DOCX, XLSX, JPG · največ 20 MB</p>
                </label>
                <div className="attachment-list">
                  {attachments.map((file) => <div className="attachment-item" key={file.id}><span className="file-icon"><FileText size={19} /></span><div><strong>{file.name}</strong><span>{file.required} · {file.size}</span></div><span className="upload-success"><CheckCircle2 size={16} />Naloženo</span><IconButton icon={Trash2} label={`Odstrani ${file.name}`} onClick={() => setAttachments((current) => current.filter((item) => item.id !== file.id))} /></div>)}
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="flow-section">
                <div className="flow-section__heading"><span className="flow-section__number">04</span><div><h1>Pregled in oddaja vloge</h1><p>Pred podpisom preverite podatke. Po oddaji spremembe niso več mogoče.</p></div></div>
                <div className="review-banner"><FileCheck2 size={22} /><div><strong>Vloga je pripravljena za oddajo</strong><p>Vsa obvezna polja so izpolnjena. Manjka še elektronski podpis.</p></div><span>100 %</span></div>
                <section className="review-section"><header><h3>Vlagatelj</h3><button type="button" onClick={() => setStep(1)}>Uredi</button></header><div className="review-grid"><div><span>Organizacija</span><strong>{form.organization}</strong></div><div><span>Matična številka</span><strong>{form.registration}</strong></div><div><span>Kontaktna oseba</span><strong>{form.contact}</strong></div><div><span>E-pošta</span><strong>{form.email}</strong></div></div></section>
                <section className="review-section"><header><h3>Program in finančni načrt</h3><button type="button" onClick={() => setStep(2)}>Uredi</button></header><div className="review-grid"><div><span>Naziv programa</span><strong>{form.program || 'Program mladih športnikov 2026'}</strong></div><div><span>Zahtevana sredstva</span><strong>{formatCurrency(Number(form.amount || 0))}</strong></div><div><span>Lastna sredstva</span><strong>{formatCurrency(Number(form.ownAmount || 0))}</strong></div><div><span>Skupna vrednost</span><strong>{formatCurrency(total)}</strong></div></div></section>
                <section className="signature-box"><div className="signature-box__heading"><span><LockKeyhole size={21} /></span><div><h3>Elektronski podpis z VSE-kodo</h3><p>Koda izkazuje odgovorno osebo in pravno osebo vlagatelja.</p></div></div><Field label="VSE-koda odgovorne osebe" hint="Za prototip je koda že predizpolnjena."><input value={form.code} onChange={update('code')} /></Field><label className="check-label"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>Izjavljam, da so podatki in priloge resnični ter da sem pooblaščena oseba za podpis vloge.</span></label></section>
                <div className="odos-note"><Link2 size={18} /><p>Takoj po oddaji se vloga in vse priloge samodejno prenesejo v dokumentni sistem <strong>ODOS</strong>.</p></div>
              </div>
            )}
            <footer className="flow-footer">
              <div>{step > 1 && <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep((current) => current - 1)}>Nazaj</Button>}</div>
              <span>Korak {step} od 4</span>
              {step < 4 ? <Button onClick={() => setStep((current) => current + 1)}>Shrani in nadaljuj<ArrowRight size={17} /></Button> : <Button icon={LockKeyhole} disabled={!confirmed} onClick={submit}>Podpiši in oddaj vlogo</Button>}
            </footer>
          </main>
        </div>
      ) : (
        <main className="submission-success">
          <div className="success-animation"><Check size={42} /></div>
          <span className="eyebrow">Vloga uspešno oddana</span>
          <h1>Hvala, vaša vloga je v postopku.</h1>
          <p>Potrdilo o oddaji smo poslali na <strong>{form.email}</strong>.<br />Vlogo in priloge lahko kadar koli pregledate v svojem arhivu.</p>
          <div className="submission-reference"><span>Številka vloge</span><strong>{applicationId}</strong><small>Oddano: 24. 10. 2026 ob 10:24</small></div>
          <div className="integration-receipt"><span><Cloud size={23} /></span><div><strong>Prenos v ODOS je uspel</strong><p>Vloga, podpisani obrazec in {attachments.length} priloge so zabeleženi v dokumentnem sistemu.</p></div><BadgeLike /></div>
          <div className="submission-next"><h3>Kaj sledi?</h3><div><span>1</span><p><strong>Formalni pregled</strong>Skrbnik preveri popolnost vloge in izpolnjevanje pogojev.</p></div><div><span>2</span><p><strong>Obvestilo o statusu</strong>O morebitni dopolnitvi ali nadaljnjem postopku boste obveščeni v aplikaciji.</p></div></div>
          <div className="submission-actions"><Button variant="secondary" onClick={() => onFinish('dashboard')}>Na nadzorno ploščo</Button><Button icon={FileText} onClick={() => onFinish('applications')}>Preglej mojo vlogo</Button></div>
        </main>
      )}
    </div>
  );
}

function BadgeLike() {
  return <span className="integration-receipt__badge"><CheckCircle2 size={15} />Sinhronizirano</span>;
}
