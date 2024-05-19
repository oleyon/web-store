using StackExchange.Redis;

namespace WebApi.Repository
{
    public class RedisRepository
    {
        private readonly ConnectionMultiplexer _redis;

        public RedisRepository(IConfiguration configuration)
        {
            string redisConnectionString = string.Format("{0},password={1}", configuration["REDIS_HOST"], configuration["REDIS_PASSWORD"]);
            _redis = ConnectionMultiplexer.Connect(redisConnectionString);
        }

        public IDatabase GetRedisDatabase()
        {
            return _redis.GetDatabase();
        }
    }
}
