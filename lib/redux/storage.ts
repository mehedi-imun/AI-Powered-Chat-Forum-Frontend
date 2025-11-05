import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    // biome-ignore lint/suspicious/noExplicitAny: noop storage fallback
    getItem(_key: any): Promise<any> {
      return Promise.resolve(null);
    },
    // biome-ignore lint/suspicious/noExplicitAny: noop storage fallback
    setItem(_key: any, value: any): Promise<any> {
      return Promise.resolve(value);
    },
    // biome-ignore lint/suspicious/noExplicitAny: noop storage fallback
    removeItem(_key: any): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
