export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`w-full max-w-[var(--container-max)] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 ${className}`}>
      {children}
    </div>
  );
}
