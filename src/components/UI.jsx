import { useEffect } from 'react';
import {
  X, Search, Trophy, Palette, Landmark, Map, CalendarDays, Users,
  HeartHandshake, BriefcaseBusiness, Sprout, ChevronRight, Inbox,
} from 'lucide-react';

const areaIcons = { Trophy, Palette, Landmark, Map, CalendarDays, Users, HeartHandshake, BriefcaseBusiness, Sprout };

export function Button({ children, icon: Icon, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`button button--${variant} button--${size} ${className}`} {...props}>
      {Icon && <Icon size={size === 'sm' ? 15 : 17} strokeWidth={2} />}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({ icon: Icon, label, className = '', ...props }) {
  return (
    <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      <Icon size={19} strokeWidth={1.9} />
    </button>
  );
}

export function Badge({ children, tone = 'neutral', dot = false }) {
  return <span className={`badge badge--${tone}`}>{dot && <span className="badge__dot" />}{children}</span>;
}

export function StatusBadge({ children, tone = 'neutral' }) {
  return <Badge tone={tone} dot>{children}</Badge>;
}

export function PageHeader({ eyebrow, title, description, actions, children }) {
  return (
    <div className="page-header">
      <div className="page-header__copy">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal__header">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <IconButton icon={X} label="Zapri" onClick={onClose} />
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </section>
    </div>
  );
}

export function Field({ label, hint, required, children, className = '' }) {
  return (
    <label className={`field ${className}`}>
      <span className="field__label">{label}{required && <span className="required"> *</span>}</span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

export function SearchBox({ value, onChange, placeholder = 'Išči …', onKeyDown, className = '' }) {
  return (
    <div className={`search-box ${className}`}>
      <Search size={17} />
      <input value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder} aria-label={placeholder} />
      {value && <button type="button" onClick={() => onChange({ target: { value: '' } })} aria-label="Počisti iskanje"><X size={15} /></button>}
    </div>
  );
}

export function AreaIcon({ area, size = 'md' }) {
  const Icon = areaIcons[area.icon] || Landmark;
  return (
    <span className={`area-icon area-icon--${size}`} style={{ color: area.color, backgroundColor: area.soft }}>
      <Icon size={size === 'sm' ? 16 : 20} strokeWidth={1.8} />
    </span>
  );
}

export function ProgressBar({ value, color, label }) {
  return (
    <div className="progress-wrap" aria-label={label || `${value} %`}>
      <div className="progress-track"><span style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} /></div>
      {label && <span className="progress-label">{label}</span>}
    </div>
  );
}

export function Tabs({ items, active, onChange, counts }) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => {
        const key = typeof item === 'string' ? item : item.id;
        const label = typeof item === 'string' ? item : item.label;
        return (
          <button key={key} type="button" role="tab" aria-selected={active === key} className={active === key ? 'active' : ''} onClick={() => onChange(key)}>
            {label}{counts?.[key] !== undefined && <span>{counts[key]}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({ title = 'Ni zadetkov', description = 'Poskusite spremeniti iskalni niz ali filtre.', action }) {
  return (
    <div className="empty-state">
      <span><Inbox size={24} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function DetailRow({ label, value, children }) {
  return <div className="detail-row"><span>{label}</span><strong>{children || value}</strong></div>;
}

export function SectionHeading({ title, description, action, link, onLink }) {
  return (
    <div className="section-heading">
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
      {link && <button className="text-link" type="button" onClick={onLink}>{link}<ChevronRight size={15} /></button>}
    </div>
  );
}

export function Avatar({ name, small = false }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return <span className={`avatar ${small ? 'avatar--sm' : ''}`}>{initials}</span>;
}
