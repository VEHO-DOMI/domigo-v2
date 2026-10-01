import Link from "next/link";

export default function ReadError({ label, retryHref }: { label: string; retryHref: string }) {
  return (
    <div className="teacher-notice teacher-notice--error" role="alert">
      <p><strong>{label} konnten nicht geladen werden.</strong></p>
      <p>Die Anzeige ist unvollständig. Bitte lade die Seite erneut.</p>
      {/* A document navigation retries the server read, including on the current URL. */}
      <a href={retryHref} className="teacher-text-link">Erneut laden</a>
      <Link href="/admin/hilfe" className="teacher-text-link">Hilfe öffnen</Link>
    </div>
  );
}
