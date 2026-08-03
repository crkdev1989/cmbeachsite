export default function VideoPlaceholderIcon({
  className = "h-10 w-10",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="#0A0A0A" strokeWidth="2" />
      <polygon points="19,15 34,24 19,33" fill="#0A0A0A" />
    </svg>
  );
}
