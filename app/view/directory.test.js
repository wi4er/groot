const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Directory entity", function () {
    describe("Directory get", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/directory/")
                .set(...require("./mock/auth"))
                .expect(200);
        });

        test("Should post item", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "Some data"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(JSON.parse(res.text)._id).toBe("Some data");
                });
        });
    });

    test("Should post and get item", async () => {
        await request(app)
            .post("/directory/")
            .send({_id: "DIRECTORY"})
            .set(...require("./mock/auth"))
            .expect(201);

        await request(app)
            .get("/directory/")
            .set(...require("./mock/auth"))
            .expect(200)
            .then(res => {
                expect(res.body).toHaveLength(1);
                expect(res.body[0]._id).toBe("DIRECTORY");
            });
    });
});
