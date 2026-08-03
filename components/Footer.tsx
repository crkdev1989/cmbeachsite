export default function Footer() {
  return (
    <footer className="border-t border-gold px-6 py-8 text-center text-sm text-foreground/70">
      <p>&copy; 2026 C.M. Beach Sitework &middot; All Rights Reserved</p>
      <p className="mt-2">
        Built by{" "}
        <a
          href="https://crkdev.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gold underline decoration-gold underline-offset-2 hover:opacity-80"
        >
          CRK Dev
        </a>
      </p>
    </footer>
  );
}
