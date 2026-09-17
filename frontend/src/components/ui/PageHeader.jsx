export default function PageHeader({ eyebrow, title, description, action, className = '' }) {
  return (
    <header className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div className="min-w-0">
        {eyebrow && <span className="inline-flex rounded-full border border-[#00ed64]/30 bg-[#00ed64]/20 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#00684a] font-display">{eyebrow}</span>}
        <h1 className="mt-3 text-3xl font-black text-[#001e2b] font-display sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
