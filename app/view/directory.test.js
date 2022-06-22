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

describe("Directory endpoint", function () {
    describe("Directory fields", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/directory/")
                .set(...require("../../test/createToken")())
                .expect(200);
        });

        describe("Directory addition", () => {
            test("Should post item", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "Some data"})
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        expect(JSON.parse(res.text)._id).toBe("Some data");
                    });
            });

            test("Should post and get item", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "DIRECTORY"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .get("/directory/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0]._id).toBe("DIRECTORY");
                    });
            });
        });

        describe("Directory deletion", () => {
            test("Should delete", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "COLOR"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .delete("/directory/COLOR/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe("COLOR");
                    });
            });
        });
    });
});
