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

describe("Event endpoint", () => {
    describe("Event fields", () => {
        test("Should get event list", async () => {
            await request(app)
                .get("/event/")
                .set(...require("../../test/createToken")())
                .expect(200)
                .then(response => {
                    expect(response.body.length).toBe(0);
                });
        });

        test("Should add event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("../../test/createToken")())
                .send({_id: "MODIFY"})
                .expect(201)
                .then(response => {
                    expect(response.body._id).toBe("MODIFY");
                });
        });

        test("Should update event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("../../test/createToken")())
                .send({_id: "MODIFY"})
                .expect(201);

            await request(app)
                .put(`/event/MODIFY/`)
                .set(...require("../../test/createToken")())
                .send({_id: "MODIFY"})
                .expect(200)
                .then(response => {
                    expect(response.body._id).toBe("MODIFY");
                });
        });

        test("Should delete event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("../../test/createToken")())
                .send({_id: "MODIFY"})
                .expect(201);

            await request(app)
                .delete(`/event/MODIFY/`)
                .set(...require("../../test/createToken")())
                .expect(200)
                .then(res => {
                    expect(res.body._id).toBe("MODIFY");
                });
        });
    });
});
