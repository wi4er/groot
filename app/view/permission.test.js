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

describe("Permission endpoint", function () {
    describe("Permission fields", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/permission/")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => expect(res.body).toEqual([]));
        });

        test("Should post item", async () => {
            await request(app)
                .post("/permission/")
                .send({
                    method: "GET",
                    entity: "CONTENT",
                    group: "1",
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.method).toBe("GET");
                    expect(res.body.entity).toBe("CONTENT");
                    expect(res.body.group).toBe("1");
                });
        });

        test("Shouldn't post item with wrong method", async () => {
            await request(app)
                .post("/permission/")
                .send({
                    method: "WRONG",
                    entity: "CONTENT",
                    group: "1",
                })
                .set(...require("./mock/auth"))
                .expect(400);
        });

        test("Shouldn't post item with wrong entity", async () => {
            await request(app)
                .post("/permission/")
                .send({
                    method: "GET",
                    entity: "WRONG",
                    group: "1",
                })
                .set(...require("./mock/auth"))
                .expect(400);
        });

        test("Shouldn't post item with wrong group", async () => {
            await request(app)
                .post("/permission/")
                .send({
                    method: "GET",
                    entity: "CONTENT",
                })
                .set(...require("./mock/auth"))
                .expect(400);
        });
    });
});
