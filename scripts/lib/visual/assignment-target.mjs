/** Only synthetic-account links rendered by the assignments page are eligible. */
export function assignmentTarget({ baseUrl, links, local, provided }) {
  const base = new URL(baseUrl);
  if (!links.length) throw Error('V1_ASSIGNMENT_MISSING: synthetic test class needs an assignment');
  const target = provided && !local ? provided : links[0];
  const url = new URL(target, base);
  if (url.origin !== base.origin || url.username || url.password || url.search || url.hash || !/^\/assignments\/[^/]+$/.test(url.pathname))
    throw Error('V1_ASSIGNMENT_INVALID: expected a same-origin assignment detail URL');
  const index = links.findIndex(link => new URL(link, base).href === url.href);
  if (index < 0) throw Error('V1_ASSIGNMENT_MISSING: supplied assignment is absent from the synthetic class');
  if (local && url.pathname !== '/assignments/synthetic-assignment-1') throw Error('V1_ASSIGNMENT_LOCAL_FIXTURE: local contract changed');
  return { href: url.href, index };
}
