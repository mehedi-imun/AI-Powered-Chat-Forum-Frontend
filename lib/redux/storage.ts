/* eslint-disable @typescript-eslint/no-explicit-any */
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: any): Promise<any> {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any): Promise<any> {
      return Promise.resolve(value);
    },
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
