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

describe("Section endpoint", function () {
    describe("Section fields", () => {
        describe("Section getting", () => {
            test("Should get list without fields", async () => {
                await request(app)
                    .get("/section/")
                    .set(...require("./mock/auth"))
                    .expect(200);
            });
        });

        describe("Section addition", () => {
            test("Should and item", async () => {
                await request(app)
                    .post("/section/")
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        expect(res.body._id.length).toBe(24);
                    });
            });

            test("Should and item and get list", async () => {
                await request(app)
                    .post("/section/")
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .get("/section/")
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).toBe(1);
                    });
            });
        });

        describe("Section update", () => {
            test("Should and item and update", async () => {
                const id = await request(app)
                    .post("/section/")
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => res.body._id);

                
                await request(app)
                    .put(`/section/${id}/`)
                    .set(...require("./mock/auth"))
                    .send({_id: id})
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe(id);
                    });
            });
        });

        describe("Section deletion", () => {
            test("Should and item and update", async () => {
                const id = await request(app)
                    .post("/section/")
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => res.body._id);


                await request(app)
                    .delete(`/section/${id}/`)
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe(id);
                    });
            });
        });
    });
});
