import ClassDirectory from "../_components/ClassDirectory";
import type { TeacherClassLists } from "../_lib/teacher-classes";

/** Class identity and archiving remain with the central account service. */
export default function ClassesManager({ lists, lehrerraumUrl }: { lists: TeacherClassLists; lehrerraumUrl: string }) {
  return (
    <>
      <div className="teacher-management-note">
        <p>Klassen anlegen, umbenennen und archivieren kannst du im Lehrerzimmer von Lauter Einser.</p>
        <a className="teacher-text-link" href={lehrerraumUrl}>Zum Lehrerzimmer <span aria-hidden="true">↗</span></a>
      </div>
      <ClassDirectory lists={lists} mode="manage" lehrerraumUrl={lehrerraumUrl} />
    </>
  );
}
