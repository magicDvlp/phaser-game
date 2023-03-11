export default function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i) {
        block.data.index = i+1;
        block.data.first = i === 0;
        block.data.last = i === (n - 1);
        accum += block.fn(this);
    }
    return accum;
}