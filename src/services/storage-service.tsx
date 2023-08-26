import { useEffect } from 'react';
import { Storage } from '@ionic/storage';

const getStorage = async (): Promise<Storage> => {
  const storage = new Storage();
  await storage.create();
  return storage;
};

const useStorage = (key: string) => {
  const getStorageValue = async (): Promise<any> => {
    const storage = await getStorage();
    return storage.get(key);
  };

  const setStorageValue = async (newValue: any) => {
    const storage = await getStorage();
    await storage.set(key, newValue);
  };

  return [getStorageValue, setStorageValue] as const;
};

export default useStorage;
