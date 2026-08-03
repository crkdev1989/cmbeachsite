export default function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="rounded-full border border-gold/40 bg-[#F5F4F0]/65 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage">
      {category}
    </span>
  );
}
