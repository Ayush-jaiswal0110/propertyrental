module.exports = (fn) => {
    return (req, res, next) => {
        // Ensure the result of fn(req, res, next) is always a promise
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
