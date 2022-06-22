const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
    SECRET: "hello world !",
}));

describe("Flag endpoint", function () {
    describe("Flag fields", () => {
        describe("Flag getting", () => {
            test("Should get empty list", async () => {
                await request(app)
                    .get("/flag/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toEqual([]);
                    });
            });
        });

        describe("Flag adding", () => {
            test("Should add item", async () => {
                await request(app)
                    .post("/flag/")
                    .send({_id: "ACTIVE"})
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        expect(res.body._id).toBe("ACTIVE");
                    });
            });

            test("Shouldn't add without id", async () => {
                await request(app)
                    .post("/flag/")
                    .send({some: "ACTIVE"})
                    .set(...require("../../test/createToken")())
                    .expect(500);
            });

            test("Shouldn't add with blank id", async () => {
                await request(app)
                    .post("/flag/")
                    .send({_id: ""})
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't add with same id", async () => {
                await request(app)
                    .post("/flag/")
                    .send({_id: "ACTIVE"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .post("/flag/")
                    .send({_id: "ACTIVE"})
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });
        });

        describe("Flag deletion", () => {
            test("Should delete item", async () => {
                await request(app)
                    .post("/flag/")
                    .send({_id: "ACTIVE"})
                    .set(...require("../../test/createToken")())
                    .expect(201)

                await request(app)
                    .delete(`/flag/ACTIVE/`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe("ACTIVE");
                    });
            });

            test("Shouldn't delete with wrong id", async () => {
                await request(app)
                    .delete(`/flag/PASSIVE/`)
                    .set(...require("../../test/createToken")())
                    .expect(404);
            });
        });
    });

    describe("Flag filter", () => {
        test("Should add and get multi items", async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/flag/")
                    .send({_id: `STATUS_${i}`})
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        list.push(JSON.parse(res.text)._id)
                    });
            }

            await request(app)
                .get(`/flag/?filter[field][id][in]=${list[0]};${list[1]};${list[2]}`)
                .set(...require("../../test/createToken")())
                .expect(200)
                .then(res => {
                    expect(JSON.parse(res.text).length).toBe(3);
                })
        });
    });
});
