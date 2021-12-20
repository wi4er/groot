const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Property entity", function () {
    describe("Property fields", () => {
        describe("Getting items", () => {
            test("Should get empty list", async () => {
                await request(app)
                    .get("/property/")
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body).toEqual([]);
                    });
            });

            test("Should get item by id", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "CODE"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .get("/property/CODE/")
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe("CODE");
                        expect(new Date(res.body.timestamp).toString()).not.toBe("Invalid Date");
                    });
            });
        });

        describe("Adding items", () => {
            test("Should add item", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        expect(res.body._id).toBe("NAME");
                        expect(new Date(res.body.timestamp).toString()).not.toBe("Invalid Date");
                    });
            });

            test("Shouldn't add item with same id", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(400);
            });

            test("Shouldn't add with blank id", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: ""})
                    .set(...require("./mock/auth"))
                    .expect(400);
            });
        });

        describe("Updating items", () => {
            test("Shouldn't update with wrong id", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                await request(app)
                    .put("/property/NAME/")
                    .send({_id: "WRONG"})
                    .set(...require("./mock/auth"))
                    .expect(404);
            });
        });

        describe("Deleting items", () => {
            test("Should delete item", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "ACTIVE"})
                    .set(...require("./mock/auth"))
                    .expect(201)

                await request(app)
                    .delete(`/property/ACTIVE/`)
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.text).toBe("true");
                    });
            });

            test("Shouldn't delete nonexistent item", async () => {
                await request(app)
                    .delete(`/property/ACTIVE/`)
                    .set(...require("./mock/auth"))
                    .expect(404);
            });
        });
    });

    describe("Property with status", () => {
        test("Should add item with status", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    status: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("NAME");
                    expect(res.body.status).toEqual(["ACTIVE"]);
                });
        });

        test("Should update item with status", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    status: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .put("/property/NAME/")
                .send({
                    _id: "NAME",
                    status: []
                })
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body.status).toEqual([]);
                });
        });

        test("Should add item item with wrong status", async () => {
            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    status: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.status).toHaveLength(0);
                });
        });
    });

    describe("Property with property", () => {
        test("Should add item with property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "WITH_NAME",
                    property: {
                        "DEF": {
                            "NAME": "SOMETHING"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    expect(Object.keys(result.body.property)).toHaveLength(1);
                    expect(result.body.property["DEF"]["NAME"]).toEqual(["SOMETHING"]);
                });
        });

        test("Should update item with property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "WITH_NAME",
                    property: {
                        "DEF": {
                            "NAME": "SOMETHING"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .put("/property/WITH_NAME/")
                .send({
                    _id: "WITH_NAME",
                    property: {
                        "DEF": {
                            "NAME": "UPDATED"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(200)
                .then(result => {
                    expect(Object.keys(result.body.property)).toHaveLength(1);
                    expect(result.body.property["DEF"]["NAME"]).toEqual(["UPDATED"]);
                });
        });

        test("Shouldn't add item with wrong property", async () => {
            await request(app)
                .post("/property/")
                .send({
                    _id: "WITH_NAME",
                    property: {
                        "DEF": {
                            "WRONG": "SOMETHING"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.property)).toHaveLength(0);
                })
        });
    });

    describe("Property filters", () => {
        test("Should add and get multi items", async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `PROPERTY_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        list.push(JSON.parse(res.text)._id)
                    });
            }

            await request(app)
                .get(`/property/?filter=field_id-in-PROPERTY_1;PROPERTY_2;PROPERTY_3`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(JSON.parse(res.text).length).toBe(3);
                });
        });
    });
});
