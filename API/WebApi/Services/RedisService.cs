using Microsoft.EntityFrameworkCore.Storage;
using StackExchange.Redis;
using WebApi.Repository;

namespace WebApi.Services
{
    public class RedisService
    {
        private readonly StackExchange.Redis.IDatabase _redisDb;

        public RedisService(RedisRepository redisRepository)
        {
            _redisDb = redisRepository.GetRedisDatabase();
        }
        public void StoreRefreshToken(string userId, string refreshToken, TimeSpan timeSpan)
        {
            var key = GetTokenKey(userId, refreshToken);
            _redisDb.StringSet(key, refreshToken, timeSpan);
        }

        public void DeleteRefreshToken(string userId, string refreshToken)
        {
            var key = GetTokenKey(userId, refreshToken);
            _redisDb.KeyDelete(key);
        }
        public bool DoesRefreshTokenExist(string userId, string refreshToken)
        {
            var key = GetTokenKey(userId, refreshToken);
            return _redisDb.KeyExists(key);
        }
        public string GetRefreshToken(string userId, string refreshToken)
        {
            var key = GetTokenKey(userId, refreshToken);
            return _redisDb.StringGet(key);
        }

        private string GetTokenKey(string userId, string refreshToken)
        {
            return $"{userId}:{refreshToken}";
        }

    }
}
