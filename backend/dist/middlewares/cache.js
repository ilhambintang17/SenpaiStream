// Simple bypass for now since we removed Redis
export const clientCache = (duration) => {
    return (req, res, next) => {
        next();
    };
};
export const serverCache = (duration) => {
    return (req, res, next) => {
        next();
    };
};
