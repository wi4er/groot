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

describe("Image endpoint", function () {
    describe("Image fields", () => {
        describe("Image getting", () => {
            test("Should get empty list", async () => {
                await request(app)
                    .get("/image/")
                    .expect(200)
                    .set(...require("./mock/auth"))
                    .then(res => {
                        expect(JSON.parse(res.text)).toEqual([]);
                    });
            });
        });

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
                    .expect(400);
            });

            test("Shouldn't add item with blank id", async () => {
                await request(app)
                    .post("/image/")
                    .send({_id: ""})
                    .set(...require("./mock/auth"))
                    .expect(400);
            });
        });

        describe("Image delete",  () => {
            test("Should delete", async () => {
                await request(app)
                    .post("/image/")
                    .send({_id: "PREVIEW"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .delete("/image/PREVIEW/")
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(result => {
                        expect(result.body._id).toBe("PREVIEW");
                    });
            });

            test("Shouldn't delete nonexistent image" , async () => {
                await request(app)
                    .delete("/image/WRONG/")
                    .set(...require("./mock/auth"))
                    .expect(404);
            });
        });
    });
});
