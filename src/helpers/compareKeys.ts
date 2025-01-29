export function compareKeys(a: {}, b: {}) {
  let missingKeys: string[] = [];
  Object.keys(a).map((key) => {
    if (!b.hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  });

  return missingKeys;
}
