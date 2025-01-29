let obj2 = {
  name: String,
  age: Number,
  email: String,
};
let obj1 = {
  name: "sarath",
  age: 12,
  email: "s@mail",
};
export function compareTypes(a: {}, b: {}) {
  let values: string[] = [];
  Object.keys(a).map((key1) => {
    Object.keys(b).map((key2) => {
      if (typeof key1 != typeof key2) {
        values.push(key1);
      }
    });
  });
  return values;
}
console.log(compareTypes(obj2, obj1));
