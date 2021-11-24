const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Value endpoint", function () {
    describe("Value fields", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/value/")
                .set(...require("./mock/auth"))
                .expect(200);
        });

        describe("Value adding", () => {
            // test("Shouldn't post value with same id", async () => {
            //     await request(app)
            //         .post("/value/")
            //         .send({_id: "UNIQ"})
            //         .set(...require("./mock/auth"))
            //         .expect(201);
            //
            //     await request(app)
            //         .post("/value/")
            //         .send({_id: "UNIQ"})
            //         .set(...require("./mock/auth"))
            //         .expect(400);
            // });

            test("Should post item", async () => {
                await request(app)
                    .post("/directory/")
                    .send({_id: "COLOR"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .post("/value/")
                    .send({_id: "BLUE", directory: "COLOR"})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        expect(res.body._id).toBe("BLUE");
                    });
            });
        });
    });

    describe("Directory value with status", () => {
        test("Should get list", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201)

            await request(app)
                .post("/value/")
                .send({
                    _id: "RED",
                    directory: "COLOR",
                    status: "ACTIVE"
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("RED");
                    expect(res.body.directory).toBe("COLOR");
                });
        });
    });
});
