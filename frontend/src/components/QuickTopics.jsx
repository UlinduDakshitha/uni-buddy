export default function QuickTopics({ topics, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      {topics.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.question)}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-navy transition-colors hover:border-gold hover:bg-gold hover:text-white"
        >
          <t.icon className="h-3.5 w-3.5" strokeWidth={2} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
