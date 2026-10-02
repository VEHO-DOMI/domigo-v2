/**
 * cgo-047 · VERÖFFENTLICHEN NUR NACH BESTÄTIGTEM SPEICHERN.
 *
 * Der Studio-Editor speichert ungesicherte Änderungen vor dem Veröffentlichen.
 * Bis hierher lief das Veröffentlichen auch dann, wenn dieses Speichern scheiterte
 * (`post` meldete keinen Fehler zurück): live ging dann der ALTE Entwurf, während
 * die Lehrkraft ihre neue Fassung für veröffentlicht hielt. Die Reihenfolge lebt
 * hier, rein und testbar (lib/studio-publish.test.ts): kein bestätigtes Speichern,
 * kein Veröffentlichen.
 */
export type StudioStep = "save" | "publish";

/** `send` meldet true nur, wenn der Server den Schritt bestätigt hat. */
export async function saveThenPublish(dirty: boolean, send: (step: StudioStep) => Promise<boolean>): Promise<boolean> {
  if (dirty && !(await send("save"))) return false;
  return send("publish");
}
