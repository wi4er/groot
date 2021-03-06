const http = require('http');

function sendEntity(entity, item) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(item);

        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: `/${entity}/`,
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWRtaW4iOnRydWUsImlhdCI6MTYzNzA2MzIzNn0.xj03Bc4nVh47rPO22FNjkptP7Or9iTOSPtAZc2ef2Dg",
            }
        }, res => {
            res.on('data', response => {
                resolve(response.toString());
            });
        });

        req.write(data);

        req.on('error', error => {
            console.error(error);

            reject(error);
        })

        req.end();
    });
}


async function populate() {
    for (let i = 0; i < 10; i++) {
        await sendEntity("property", {
            _id: `PROPERTY_${String(i).padStart(2, "0")}`
        }).then(res => {
            console.log(res);
        })
    }

    for (let i = 0; i < 5; i++) {
        await sendEntity("description", {
            _id: `DESCRIPTION_${String(i).padStart(2, "0")}`
        }).then(res => {
            console.log(res);
        })
    }

    for (let i = 0; i < 10; i++) {
        await sendEntity("status", {
            _id: `STATUS_${String(i).padStart(2, "0")}`
        }).then(res => {
            console.log(res);
        })
    }

    for (let i = 0; i < 10; i++) {
        await sendEntity("uniq", {
            _id: `UNIQ_${String(i).padStart(2, "0")}`
        }).then(res => {
            console.log(res);
        })
    }

    for (let i = 0; i < 1000; i++) {
        await sendEntity("content", {
            uniq: [{
                uniq: `UNIQ_${String(Math.random() * 10 >> 0).padStart(2, "0")}`,
                value: i,
            }],
            property: {
                DEF: {
                    [`PROPERTY_${String(Math.random() * 10 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                    [`PROPERTY_${String(Math.random() * 10 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                    [`PROPERTY_${String(Math.random() * 10 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                }
            },
            description: {
                DEF: {
                    [`DESCRIPTION_${String(Math.random() * 5 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                    [`DESCRIPTION_${String(Math.random() * 5 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                    [`DESCRIPTION_${String(Math.random() * 5 >> 0).padStart(2, "0")}`]: Math.random().toString(36).slice(2),
                }
            },
            status: [
                `STATUS_${String(Math.random() * 10 >> 0).padStart(2, "0")}`,
                `STATUS_${String(Math.random() * 10 >> 0).padStart(2, "0")}`,
                `STATUS_${String(Math.random() * 10 >> 0).padStart(2, "0")}`,
            ],
        }).then(res => {
            console.log(res);
        })
    }
}

populate().then(res => {
    console.log(res);


})
