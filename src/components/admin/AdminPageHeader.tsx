interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export default function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
} 