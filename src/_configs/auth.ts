export default {
    secret: "EflexRegistrationSuperSecretKey",
    alg: "HS384",
    iss: "eflex", // issuer can be array of string or simple string also
    id: "eflex1121",  // JwtId can be a string if you want to check it in while token verification
    aud: ["eflexoriongroup"],  // audience can be array of string or simple string also like who is going to use this
    sub: "auth",
    jwtWebExpiresIn: 12 * 3600,           // 1 hour
    jwtWebRefreshExpiresIn: 86400,   // 24 hours
    jwtMobExpiresIn: 604800,           // 1 hour
    jwtMobRefreshExpiresIn: 1209600,   // 24 hours
    salt: 8

    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
};