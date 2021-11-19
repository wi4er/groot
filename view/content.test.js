const request = require("supertest");
const app = require(".")

afterEach(() => require("../model").clearDatabase());

describe("Content entity", function () {
    describe("Content getting", () => {
        test("Should get list", done => {
            request(app)
                .get("/content/")
                .expect(200)
                .set(...require("./mock/auth"))
                .then(() => done());
        });

        test("Should post item", done => {
            request(app)
                .post("/content/")
                .send({slug: "Some data"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(JSON.parse(res.text).slug).toBe("Some data");

                    done();
                });
        });

        test("Should post and get list", async () => {
            await request(app)
                .post("/content/")
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .get("/content/")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(JSON.parse(res.text).length).toBe(1);
                });
        });

        test("Should post and get item", async () => {
            const id = await request(app)
                .post("/content/")
                .set(...require("./mock/auth"))
                .send({slug: "SLUG"})
                .expect(201)
                .then(res => res.body._id);

            await request(app)
                .get(`/content/${id}/`)
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body.slug).toBe("SLUG");
                });
        });
    });

    describe("Content with status", () => {
        test("Should post item with status", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    status: ["ACTIVE"],
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    const body = JSON.parse(res.text);

                    expect(body.slug).toBe("Some data");
                    expect(body.status).toEqual(["ACTIVE"]);
                });
        });

        test("Shouldn't post item with wrong status", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201)

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    status: ["PASSIVE"],
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.status).toHaveLength(0);
                });
        });
    });

    describe("Content with property", () => {
        test("Should post item with property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    property: [{
                        value: "VALUE",
                        property: "NAME",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    const body = JSON.parse(result.text);

                    expect(body.slug).toBe("Some data");
                    expect(body.property).toHaveLength(1);
                    expect(body.property[0].value).toEqual(["VALUE"]);
                });
        });

        test("Shouldn't post item with wrong property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    property: [{
                        value: "VALUE",
                        property: "ARTICLE",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.property).toHaveLength(0);
                });
        });
    });

    describe("Content with description", () => {
        test("Should post item with description", async () => {
            await request(app)
                .post("/description/")
                .send({_id: "SHORT"})
                .set(...require("./mock/auth"))
                .expect(201)

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    description: [{
                        value: "VALUE",
                        description: "SHORT",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    const body = JSON.parse(result.text);

                    expect(body.slug).toBe("Some data");
                    expect(body.description).toHaveLength(1);
                    expect(body.description[0].value).toEqual(["VALUE"]);
                });
        });

        test("Shouldn't post item with wrong description", async () => {
            await request(app)
                .post("/description/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    description: [{
                        value: "VALUE",
                        description: "LONG",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.description).toHaveLength(0);
                });
        });
    });

    describe("Content with directory", () => {
        test("Should add content with directory", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/directoryValue/")
                .send({_id: "RED", directory: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({directory: {directory: "COLOR", value: "RED"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.directory).toHaveLength(1);
                    expect(res.body.directory[0].value).toEqual(["RED"]);
                });
        });
    });

    describe("Content filter", () => {
        test("Should fetch with status filter", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "NEW"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({slug: "VALUE_1", status: ["NEW"]})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({slug: "VALUE_2"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .get("/content/?filter=status-in-NEW")
                .expect(200)
                .set(...require("./mock/auth"))
                .then(result => {
                    const body = JSON.parse(result.text);

                    expect(body).toHaveLength(1);
                    expect(body[0].slug).toBe("VALUE_1");
                });
        });
    })
});
