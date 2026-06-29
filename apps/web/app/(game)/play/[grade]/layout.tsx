/**
 * Grade theming wrapper — sets data-grade on the whole /play/[grade] subtree so the
 * brand accent themes per grade (globals.css [data-grade] overrides --accent*):
 * g1 green · g2 red · g3 blue (the :root default) · g4 purple. Hub + every game
 * surface under this segment inherit it, so one wrapper colours all of them.
 */
export default async function GradeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ grade: string }>;
}) {
  const { grade } = await params;
  return (
    <div data-grade={grade} style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
}
