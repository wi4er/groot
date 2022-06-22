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

describe("Uniq endpoint", function () {
    describe("Uniq fields", () => {
        test("Should get empty list", async () => {
            await request(app)
                .get("/uniq/")
                .set(...require("../../test/createToken")())
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual([]);
                });
        });
    });

    describe("Uniq adding", () => {
        test("Should add item", async () => {
            await request(app)
                .post("/uniq/")
                .send({_id: "ACTIVE"})
                .set(...require("../../test/createToken")())
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("ACTIVE");
                });
        });

        test("Shouldn't add without id", async () => {
            await request(app)
                .post("/uniq/")
                .send({some: "ACTIVE"})
                .set(...require("../../test/createToken")())
                .expect(500);
        });

        test("Shouldn't add with blank id", async () => {
            await request(app)
                .post("/uniq/")
                .send({_id: ""})
                .set(...require("../../test/createToken")())
                .expect(400);
        });

        test("Shouldn't add with same id", async () => {
            await request(app)
                .post("/uniq/")
                .send({_id: "ACTIVE"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/uniq/")
                .send({_id: "ACTIVE"})
                .set(...require("../../test/createToken")())
                .expect(400);
        });
    });

    describe("Uniq deletion", () => {
        test("Should delete item", async () => {
            await request(app)
                .post("/uniq/")
                .send({_id: "EMAIL"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .delete(`/uniq/EMAIL/`)
                .set(...require("../../test/createToken")())
                .expect(200)
                .then(res => {
                    expect(res.body._id).toBe("EMAIL");
                });
        });

        test("Shouldn't delete with wrong id", async () => {
            await request(app)
                .delete(`/uniq/PASSIVE/`)
                .set(...require("../../test/createToken")())
                .expect(404);
        });
    });
});
