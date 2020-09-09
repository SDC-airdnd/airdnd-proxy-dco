const http = require('k6/http');
const { check } = require('k6');
const { Rate } = require('k6/metrics');

export let errorRate = new Rate('error_rate');
export let options = {
    vus: 20,
    duration: '60s'
};

export default function() {
    let id1 = Math.floor(Math.random() * (3999999 - 1) + 1);
    let id2 = Math.floor(Math.random() * (6999999 - 4000000)) + 4000000;
    let id3 = Math.floor(Math.random() * (10000000 - 7000000)) + 7000000;

    const responses = http.batch([
        [
            'GET',
            `http://localhost:3000/?id=${id1}`,
            null,
            { tags: { name: 'ListingURL' } },
        ],
        [
            'GET',
            `http://localhost:3000/?id=${id2}`,
            null,
            { tags: { name: 'ListingURL' } },
        ],
        [
            'GET',
            `http://localhost:3000/?id=${id3}`,
            null,
            { tags: { name: 'ListingURL' } },
        ],
    ])

    const result1 = check(responses[0], {
        'is status 200': (r) => r.status === 200,
    })

    const result2 = check(responses[1], {
        'is status 200': (r) => r.status === 200,
    })

    const result3 = check(responses[2], {
        'is status 200': (r) => r.status === 200,
    })

    errorRate.add(!result1);
    errorRate.add(!result2);
    errorRate.add(!result3);
}