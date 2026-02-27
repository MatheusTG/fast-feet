import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, "EX", 60 * 15);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async delete(pattern: string): Promise<void> {
    const stream = this.redis.scanStream({
      match: pattern,
      count: 100,
    });

    const pipeline = this.redis.pipeline();

    return new Promise((resolve, reject) => {
      stream.on("data", (keys: string[]) => {
        if (keys.length) {
          for (const key of keys) {
            pipeline.del(key);
          }
        }
      });

      stream.on("end", async () => {
        await pipeline.exec();
        resolve();
      });

      stream.on("error", reject);
    });
  }
}
