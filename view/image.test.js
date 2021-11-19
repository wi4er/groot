const request = require("supertest");
const app = require(".")

afterEach(() => require("../model").clearDatabase());

describe("Image entity", function () {
    test("Should get empty list", async () => {
        await request(app)
            .get("/image/")
            .expect(200)
            .set(...require("./mock/auth"))
            .then(res => {
                expect(JSON.parse(res.text)).toEqual([]);
            });
    });1

    describe("Adding items", () => {
        test("Should add item", async () => {
            await request(app)
                .post("/image/")
                .send({_id: "PREVIEW"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(JSON.parse(res.text)._id).toBe("PREVIEW");
                });
        });

        test("Shouldn't add item with same id", async () => {
            await request(app)
                .post("/image/")
                .send({_id: "PREVIEW"})
                .set(...require("./mock/auth"))
                .expect(201)

            await request(app)
                .post("/image/")
                .send({_id: "PREVIEW"})
                .set(...require("./mock/auth"))
                .expect(500)
        });
    });
});
