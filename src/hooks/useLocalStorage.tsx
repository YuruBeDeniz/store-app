import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if(jsonValue != null) return JSON.parse(jsonValue);

    if(typeof initialValue === "function") {
      return (initialValue as () => T)();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value]);

  return [value, setValue] as [typeof value, typeof setValue]
}

//the code inside useState: all it does is it gets the value from local storage
//or it's going to get the initial value that we passed in (which is "shopping-cart")

//we need to set up useEffect that runs every single time our key or value changes
//we'll store out value back in local storage