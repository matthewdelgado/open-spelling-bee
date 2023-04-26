const chunk = ({
  arr,
  size,
}: {
  arr: Array<any>;
  size: number;
}): Array<Array<any>> => {
  const chunkedArr = [];
  for (let i = 0; i < arr.length; i += size) {
    chunkedArr.push(arr.slice(i, i + size));
  }
  return chunkedArr;
};

const gridify = ({
  arr,
  size,
}: {
  arr: Array<any>;
  size: number;
}): Array<Object> => {
  return chunk({ arr, size }).map((arr) => {
    const obj: { [key: string]: any } = {};
    arr.forEach((value, index: number) => {
      obj[`${index + 1}`] = value;
    });
    return obj;
  });
};

const createRandomGenerator = ({
  seed = 1,
}: { seed?: number } = {}): Function => {
  const random = (): number => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  return random;
};

const shuffle = (array: Array<any>, seed: number = 1): Array<any> => {
  const randomFloat = createRandomGenerator({ seed });
  return array
    .map((value) => ({ value, sort: randomFloat() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const zip = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
  return arr1.map((e, i) => {
    return [e, arr2[i]];
  });
};

const incrementDups = (arr: Array<number>): Array<number> => {
  const encounters = new Set();
  return arr.map((num) => {
    while (encounters.has(num)) {
      num += 1;
    }
    encounters.add(num);
    return num;
  });
};

export { chunk, gridify, incrementDups, shuffle, zip };
