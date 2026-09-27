export default function PageHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <header className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && <span className="inline-flex rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/15 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[var(--success)] font-display">{eyebrow}</span>}
        <h1 className="mt-3 text-3xl font-black text-[var(--text-primary)] font-display sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
