export default function(a, b, opts) {
    if (a == b || a == '/' && b == 'index.html') {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
}