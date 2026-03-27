export default {
    iso8601: (date) => {
        return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
    },
};
