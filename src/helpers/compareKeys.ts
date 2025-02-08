export function compareKeys(a: any, b: {}) {
  let nestedTrue=hasNestedObjects(a)
  let missingKeys: string[] = [];

if(!nestedTrue){
  Object.keys(b).map((key) => {
    if (!a.hasOwnProperty(key)) {
      missingKeys.push(key);
    }
  });
}else if(nestedTrue){
  Object.keys(a).map((key)=>{
    if(typeof a[key]=="object"){
     let keysMissing:any= compareKeys(a[key],b)
     missingKeys.push(keysMissing)
    }

  })
}else {
  return
}



  return missingKeys;
}
function hasNestedObjects(obj:any) {
  // Check if the input is an object and not null
  if (typeof obj === 'object' && obj !== null) {
    // Iterate over the object's keys
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        // Check if the value is an object
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          return true; // Found a nested object
        }
      }
    }
  }
  return false;
}


