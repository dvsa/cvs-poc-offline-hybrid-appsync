import { Injectable } from "@angular/core";
import { NgForageCache } from "@ngforage/ngforage-ng4";

@Injectable()
export class CacheUtils {
  constructor(public ngfCache: NgForageCache) {}

  async setCache(key, value, expiration) {
    return await this.ngfCache.setCached(key, value, expiration);
  }

  async hasBeenCached(key) {
    return (await this.ngfCache.getCached(key)).hasData;
  }

  async getCachedData(key) {
    return (await this.ngfCache.getCached(key)).data;
  }

  async deleteCache(key) {
    return await this.ngfCache.removeCached(key);
  }
}
