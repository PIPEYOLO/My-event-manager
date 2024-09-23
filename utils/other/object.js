

export function deepUpdate(target, updates) {
  target = target === null || target === undefined ? {} : target;
  for(const key of Object.keys(updates)) {
    const updateValue = updates[key];
    const targetValue = target[key];
    if(typeof updateValue === 'object' && updateValue !== null) {
      if(typeof targetValue !== 'object' || targetValue === null) {
        target[key] = Array.isArray(updateValue) ? [] : {};
      }
      deepUpdate(target[key], updateValue);
    } else {
      target[key] = updateValue;
    }
  }

  return target;
}