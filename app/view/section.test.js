const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Section entity", function () {
    describe("Section fields", () => {
        test("Should get list without fields", async () => {
            await request(app)
                .get("/section/")
                .set(...require("./mock/auth"))
                .expect(200);
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
                    expect(JSON.parse(res.text).length).toBe(1);
                });
        });

        test("Should post item with fields", async () => {
            await request(app)
                .post("/section/")
                .send({slug: "Some data"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(JSON.parse(res.text).slug).toBe("Some data");
                });
        });
    });
});
