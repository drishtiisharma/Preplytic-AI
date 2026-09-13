export function PageContainer({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {(title || description) && (
        <div className="flex items-center justify-between space-y-2">
          <div>
            {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
