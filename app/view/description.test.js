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

describe("Description endpoint", function () {
    describe("Description fields", () => {
        describe("Description get", () => {
            test("Should get list", async () => {
                await request(app)
                    .get("/description/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(0);
                    });
            });

            test("Should post item", async () => {
                await request(app)
                    .post("/description/")
                    .send({_id: "Some data"})
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        expect(res.body._id).toBe("Some data");
                    });
            });

            test("Shouldn't post with existent id", async () => {
                await request(app)
                    .post("/description/")
                    .send({_id: "UNIQ"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .post("/description/")
                    .send({_id: "UNIQ"})
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't post with blank id", async () => {
                await request(app)
                    .post("/description/")
                    .send({_id: ""})
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Should post and get item", async () => {
                await request(app)
                    .post("/description/")
                    .send({_id: "Some data"})
                    .set(...require("../../test/createToken")())
                    .expect(201)

                await request(app)
                    .get("/description/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(response => {
                        expect(response.body.length).toBe(1);
                        expect(response.body[0]._id).toBe("Some data");
                    });
            });
        });

        describe("Description delete", () => {
            test("Should delete item", async () => {
                await request(app)
                    .post("/description/")
                    .send({_id: "PREVIEW"})
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .delete("/description/PREVIEW/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe("PREVIEW");
                    });
            });

            test("Shouldn't delete nonexistant item", async () => {
                await request(app)
                    .delete("/description/PREVIEW/")
                    .set(...require("../../test/createToken")())
                    .expect(404);
            });
        });
    });

    describe("Description with property", () => {
        test("Should post item with property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "PROPERTY"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/description/")
                .send({
                    _id: "WITH_PROPERTY",
                    property: {
                        "DEF": {
                            "PROPERTY": "VALUE"
                        }
                    }
                })
                .set(...require("../../test/createToken")())
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.property)).toHaveLength(1);
                    expect(res.body.property["DEF"]["PROPERTY"]).toEqual("VALUE");
                });
        });
    });

    describe("Description with flag", () => {
        test("Should post item with flag", async () => {
            await request(app)
                .post("/flag/")
                .send({_id: "STATUS"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/description/")
                .send({
                    _id: "WITH_STATUS",
                    flag: ["STATUS"],
                })
                .set(...require("../../test/createToken")())
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("WITH_STATUS");
                    expect(res.body.flag).toHaveLength(1);
                    expect(res.body.flag[0]).toBe("STATUS");
                });
        });

        test("Should post item with same flag", async () => {
            await request(app)
                .post("/flag/")
                .send({_id: "STATUS"})
                .set(...require("../../test/createToken")())
                .expect(201);

            await request(app)
                .post("/description/")
                .send({
                    _id: "WITH_STATUS",
                    flag: ["STATUS", "STATUS", "STATUS"],
                })
                .set(...require("../../test/createToken")())
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("WITH_STATUS");
                    expect(res.body.flag).toHaveLength(1);
                    expect(res.body.flag[0]).toBe("STATUS");
                });
        });
    });
});
