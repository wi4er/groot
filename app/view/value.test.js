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

describe("Value endpoint", function () {
    describe("Value fields", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/value/")
                .set(...require("../../test/createToken")())
                .expect(200);
        });

        describe("Value adding", () => {
            // test("Shouldn't post value with same id", async () => {
            //     await request(app)
            //         .post("/value/")
            //         .send({_id: "UNIQ"})
            //         .set(...require("../../test/createToken")())
            //         .expect(201);
            //
            //     await request(app)
            //         .post("/value/")
            //         .send({_id: "UNIQ"})
            //         .set(...require("../../test/createToken")())
            //         .expect(400);
            // });

            test("Should post item", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "COLOR"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .post("/value/")
                    .send({_id: "BLUE", directory: "COLOR"})
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        expect(res.body._id).toBe("BLUE");
                    });
            });
        });

        describe("Value deletion", () => {
            test("Should delete value", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "COLOR"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .post("/value/")
                    .send({_id: "BLUE", directory: "COLOR"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .delete("/value/BLUE/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe("BLUE");
                    });
            });

            test("Shouldn't delete value with wrong id", async () => {
                await request(app)
                    .delete("/value/WRONG/")
                    .set(...require("../../test/createToken")())
                    .expect(404);
            });
        });
    });

    describe("Directory value with flag", () => {
        test("Should get list", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "COLOR"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/flag/")
                .send({_id: "ACTIVE"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/value/")
                .send({
                    _id: "RED",
                    directory: "COLOR",
                    flag: "ACTIVE",
                })
                .set(...require("../../test/createToken")())
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("RED");
                    expect(res.body.directory).toBe("COLOR");
                    expect(res.body.flag).toEqual(["ACTIVE"]);
                });
        });
    });
});
