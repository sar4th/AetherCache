export function compareKeys(a: {}, b: {}) {
  let missingKeys: string[] = [];
  Object.keys(b).map((key) => {
    if (!a.hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  });

  return missingKeys;
}
