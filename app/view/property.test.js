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

describe("Property endpoint", function () {
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

            test("Shouldn't add with null id", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: null})
                    .set(...require("./mock/auth"))
                    .expect(400);
            });
        });

        describe("Updating items", () => {
            test("Should update", async () => {
                const {timestamp, created} = await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => res.body);

                await request(app)
                    .put("/property/NAME/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body.timestamp).not.toBe(timestamp);
                        expect(res.body.created).toBe(created);
                    });
            });

            test("Shouldn't update created field", async () => {
                const {created} = await request(app)
                    .post("/property/")
                    .send({_id: "NAME"})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => res.body);

                await request(app)
                    .put("/property/NAME/")
                    .send({
                        _id: "NAME",
                        created: "2022-01-01T00:00:00.000Z",
                    })
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {
                        expect(res.body.created).toBe(created);
                    });
            });

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
                        expect(res.body._id).toBe("ACTIVE");
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

    describe("Property with flag", () => {
        test("Should add item with without flag", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .get("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body[0].flag).toBeUndefined();
                });
        });
        
        test("Should add item with flag", async () => {
            await request(app)
                .post("/flag/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    flag: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("NAME");
                    expect(res.body.flag).toEqual(["ACTIVE"]);
                });
        });

        test("Should update item with flag", async () => {
            await request(app)
                .post("/flag/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    flag: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .put("/property/NAME/")
                .send({
                    _id: "NAME",
                    flag: []
                })
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBeUndefined();
                });
        });

        test("Should add item item with wrong flag", async () => {
            await request(app)
                .post("/property/")
                .send({
                    _id: "NAME",
                    flag: ["ACTIVE"]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.flag).toBeUndefined();
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
                    expect(result.body.property["DEF"]["NAME"]).toEqual("SOMETHING");
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
                        "DEF": {"NAME": "SOMETHING"}
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .put("/property/WITH_NAME/")
                .send({
                    _id: "WITH_NAME",
                    property: {
                        "DEF": {"NAME": "UPDATED"}
                    }
                })
                .set(...require("./mock/auth"))
                .expect(200)
                .then(result => {
                    expect(Object.keys(result.body.property)).toHaveLength(1);
                    expect(result.body.property["DEF"]["NAME"]).toEqual("UPDATED");
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
                    expect(res.body.property).toBeUndefined();
                })
        });
    });

    describe("Property filters", () => {
        test("Should filter by id field", async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `PROPERTY_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => list.push(res.body._id));
            }

            await request(app)
                .get(`/property/?filter[field][id][in]=PROPERTY_2;PROPERTY_4;PROPERTY_6`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(res.body.length).toBe(3);
                    expect(res.body[0]._id).toBe("PROPERTY_2");
                    expect(res.body[1]._id).toBe("PROPERTY_4");
                    expect(res.body[2]._id).toBe("PROPERTY_6");
                });
        });

        test("Should filter by timestamp field", async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `PROPERTY_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => list.push(res.body.timestamp));
            }

            await request(app)
                .get(`/property/?filter[field][timestamp][gt]=${list[6]}`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(res.body.length).toBe(4);
                    expect(res.body[0]._id).toBe("PROPERTY_6");
                    expect(res.body[1]._id).toBe("PROPERTY_7");
                    expect(res.body[2]._id).toBe("PROPERTY_8");
                    expect(res.body[3]._id).toBe("PROPERTY_9");
                });
        });
    });

    describe("Poperty pagination", () => {
        test("Should get with limit", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `PROPERTY_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get(`/property/?limit=5`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(res.body.length).toBe(5);
                    expect(res.body[0]._id).toBe("PROPERTY_0");
                    expect(res.body[4]._id).toBe("PROPERTY_4");
                    expect(res.headers["total-row-count"]).toBe("10");
                });
        });

        test("Should get with offset", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `PROPERTY_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get(`/property/?offset=4`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(res.body.length).toBe(6);
                    expect(res.body[0]._id).toBe("PROPERTY_4");
                    expect(res.body[5]._id).toBe("PROPERTY_9");
                    expect(res.headers["total-row-count"]).toBe("10");
                });
        });
    })
});
