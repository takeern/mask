enum RedisConfig {
    queueTime = 1000,
}

enum SpiderOrigin {
    ixSpider = 'ixspider',
}

interface JwtPayload {
    email: string;
}

export {
    RedisConfig,
    SpiderOrigin,
    JwtPayload,
}