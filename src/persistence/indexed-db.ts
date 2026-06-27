import type { WorkspaceState } from "../print-types";

class DbManager {
  private static dbName = "flayc-db";
  private static dbVersion = 1;
  private db: IDBDatabase;

  private constructor(db: IDBDatabase) {
    this.db = db;
  }

  public static async open(): Promise<DbManager> {
    return await new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore("images");
        db.createObjectStore("workspace");
      };
      request.onsuccess = () => resolve(new DbManager(request.result));
      request.onerror = () => reject(request.error);
    });
  }

  public async putImage(id: string, file: File): Promise<void> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      const request = store.put(file, id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getImage(id: string): Promise<File | undefined> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  public async getAllImages(): Promise<[key: string, file: File][]> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const valuesRequest = store.getAll() as IDBRequest<File[]>;
      const keysRequest = store.getAllKeys() as IDBRequest<string[]>;
      let values: File[] | null = null;
      let keys: string[] | null = null;

      const checkAndResolve = () => {
        if (values === null || keys === null) return;
        return resolve(keys.map((key, index) => [key, values![index]]));
      };
      valuesRequest.onsuccess = () => {
        values = valuesRequest.result;
        checkAndResolve();
      };
      keysRequest.onsuccess = () => {
        keys = keysRequest.result;
        checkAndResolve();
      };
      valuesRequest.onerror = () => reject(valuesRequest.error);
      keysRequest.onerror = () => reject(keysRequest.error);
    });
  }

  public async deleteImage(id: string): Promise<void> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async putWorkspaceState(state: WorkspaceState): Promise<void> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("workspace", "readwrite");
      const store = transaction.objectStore("workspace");
      const request = store.put(state, "state");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getWorkspaceState(): Promise<WorkspaceState | undefined> {
    return await new Promise((resolve, reject) => {
      const transaction = this.db.transaction("workspace", "readonly");
      const store = transaction.objectStore("workspace");
      const request = store.get("state");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const Db = await DbManager.open();
