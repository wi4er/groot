const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());

describe("Status entity", function () {
    describe("Status fields", () => {
        test("Should get empty list", async () => {
            await request(app)
                .get("/status/")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual([]);
                });
        });

        test("Should add item", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("ACTIVE");
                });
        });

        test("Shouldn't add without id", async () => {
            await request(app)
                .post("/status/")
                .send({some: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(500);
        });

        test("Shouldn't add with same id", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(400);
        });

        test("Should delete item", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201)

            await request(app)
                .delete(`/status/ACTIVE/`)
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.text).toBe("true");
                });
        });

        test("Shouldn't delete with wrong id", async () => {
            await request(app)
                .delete(`/status/PASSIVE/`)
                .set(...require("./mock/auth"))
                .expect(404)
        });
    });

    describe("Status filter", () => {
        test("Should add and get multi items", async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/status/")
                    .send({_id: `STATUS_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        list.push(JSON.parse(res.text)._id)
                    });
            }

            await request(app)
                .get(`/status/?filter=field_id-in-${list[0]};${list[1]};${list[2]}`)
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(JSON.parse(res.text).length).toBe(3);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    })
});
