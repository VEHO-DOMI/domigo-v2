// CODEX DRAFT — NOT CANON · masks retain their common untrimmed canvas.
/** Metadata deliberately records both detected ink bounds and draw bounds.
 * The PNG stays 512×512, so normal shared scene/card transforms are sufficient. */
export const registeredCell = (group, stem, trim) => ({
  registrationGroup: group, stem, canvas: {width:512,height:512},
  trim, output:{x:0,y:0,width:512,height:512}, anchor:{x:.5,y:1},
});
export const registrationErrors = (cells) => {
  const errors=[]; const first=cells[0];
  if (!first) return ["registration group is empty"];
  for(const cell of cells) {
    if (cell.registrationGroup!==first.registrationGroup) errors.push(`${cell.stem}: different registration group`);
    if (cell.canvas.width!==512||cell.canvas.height!==512) errors.push(`${cell.stem}: common canvas must be 512×512`);
    if (cell.output.x!==0||cell.output.y!==0||cell.output.width!==512||cell.output.height!==512) errors.push(`${cell.stem}: registration shifted or independently trimmed`);
    if (cell.anchor.x!==first.anchor.x||cell.anchor.y!==first.anchor.y) errors.push(`${cell.stem}: anchor differs`);
  }
  return errors;
};
