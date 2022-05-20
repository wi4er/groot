const request = require("supertest");
const app = require("..");
const jwt = require("jsonwebtoken");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Content endpoint", function () {
    describe("Content fields", () => {
        test("Should get list", async () => {
            await request(app)
                .get("/content/")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual([]);
                });
        });

        test("Should post item", async () => {
            await request(app)
                .post("/content/")
                .send({slug: "Some data"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(JSON.parse(res.text).slug).toBe("Some data");
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

        test("Should post item with doubled status", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "ACTIVE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    status: ["ACTIVE", "ACTIVE", "ACTIVE"],
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
                    property: {
                        "DEF": {
                            "NAME": "VALUE"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    const body = JSON.parse(result.text);

                    expect(body.slug).toBe("Some data");
                    expect(Object.keys(body.property)).toHaveLength(1);
                    expect(body.property["DEF"]["NAME"]).toEqual(["VALUE"]);
                });
        });

        test("Should post item with wrong property", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    property: {
                        "DEF": {
                            "ARTICLE": "VALUE"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.property)).toHaveLength(0);
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
                    description: {
                        "DEF": {
                            "SHORT": "VALUE"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    const body = JSON.parse(result.text);

                    expect(body.slug).toBe("Some data");
                    expect(Object.keys(body.description)).toHaveLength(1);
                    expect(body.description["DEF"]["SHORT"]).toEqual("VALUE");
                });
        });

        test("Should post item with wrong description", async () => {
            await request(app)
                .post("/description/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({
                    slug: "Some data",
                    description: {
                        "DEF": {
                            "LONG": "VALUE"
                        }
                    }
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.description)).toHaveLength(0);
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
                .post("/value/")
                .send({_id: "RED", directory: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({directory: {"COLOR": "RED"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.directory)).toHaveLength(1);
                    expect(res.body.directory["COLOR"]).toEqual(["RED"]);
                });
        });

        test("Should add content with wrong directory", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/value/")
                .send({_id: "RED", directory: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({directory: {"WRONG": "RED"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.directory)).toHaveLength(0);
                });
        });

        test("Should add content with wrong directory value", async () => {
            await request(app)
                .post("/directory/")
                .send({_id: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/value/")
                .send({_id: "RED", directory: "COLOR"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({directory: {"COLOR": "WRONG"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.directory)).toHaveLength(0);
                });
        });
    });

    describe("Contest with events", () => {
        test("Should add content with event", async () => {
            await request(app)
                .post("/event/")
                .send({_id: "CREATE"})
                .set(...require("./mock/auth"))
                .expect(201);

            await request(app)
                .post("/content/")
                .send({event: {"CREATE": "2000-01-01T12:00:00.000Z"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.event)).toHaveLength(1);
                    expect(res.body.event["CREATE"]).toEqual("2000-01-01T12:00:00.000Z");
                });
        });

        test("Should add content with wrong event", async () => {
            await request(app)
                .post("/content/")
                .send({event: {"CREATE": "2000-01-01T12:00:00.000Z"}})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(Object.keys(res.body.event)).toHaveLength(0);
                });
        });
    });

    describe("Content filter", () => {
        describe("Content field filter", () => {
            test("Should fetch with status filter", async () => {
                for (let i = 0; i < 5; i++) {
                    await request(app)
                        .post("/content/")
                        .send({slug: `VALUE_${i}`})
                        .set(...require("./mock/auth"))
                        .expect(201);
                }

                await request(app)
                    .get("/content/?filter=field-slug-in-VALUE_4")
                    .expect(200)
                    .set(...require("./mock/auth"))
                    .then(result => {
                        const body = JSON.parse(result.text);

                        expect(body).toHaveLength(1);
                        expect(body[0].slug).toBe("VALUE_4");
                    });
            });

            test("Should fetch with status filter", async () => {
                for (let i = 0; i < 5; i++) {
                    await request(app)
                        .post("/content/")
                        .send({slug: `VALUE_${i}`})
                        .set(...require("./mock/auth"))
                        .expect(201);
                }

                await request(app)
                    .get("/content/?filter=field-slug-in-VALUE_2;VALUE_3")
                    .expect(200)
                    .set(...require("./mock/auth"))
                    .then(result => {
                        const body = JSON.parse(result.text);

                        expect(body).toHaveLength(2);
                        expect(body[0].slug).toBe("VALUE_2");
                        expect(body[1].slug).toBe("VALUE_3");
                    });
            });
        });

        describe("Content property filter", () => {
            test("Should fetch with property filter", async () => {
                await request(app)
                    .post("/property/")
                    .send({_id: "VALUE"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/content/")
                        .send({
                            slug: `VALUE_${i}`,
                            property: {
                                "DEF": {
                                    "VALUE": i % 2 ? "NUM_1" : "NUM_2"
                                }
                            }
                        })
                        .set(...require("./mock/auth"))
                        .expect(201);
                }

                await request(app)
                    .get("/content/?filter=property-VALUE-in-NUM_1")
                    .set(...require("./mock/auth"))
                    .expect(200)
                    .then(res => {

                        expect(res.body).toHaveLength(5);
                        expect(res.body[0].slug).toBe("VALUE_1");
                        expect(res.body[1].slug).toBe("VALUE_3");
                        expect(res.body[2].slug).toBe("VALUE_5");
                        expect(res.body[3].slug).toBe("VALUE_7");
                        expect(res.body[4].slug).toBe("VALUE_9");
                    });
            });
        });

        describe("Content status filter", () => {
            test("Should fetch with status filter", async () => {
                await request(app)
                    .post("/status/")
                    .send({_id: "NEW"})
                    .set(...require("./mock/auth"))
                    .expect(201);

                for (let i = 0; i < 5; i++) {
                    await request(app)
                        .post("/content/")
                        .send({slug: `VALUE_${i}`, status: i % 2 === 1 ? ["NEW"] : undefined})
                        .set(...require("./mock/auth"))
                        .expect(201);
                }

                await request(app)
                    .get("/content/?filter=status-in-NEW")
                    .expect(200)
                    .set(...require("./mock/auth"))
                    .then(result => {
                        const body = JSON.parse(result.text);

                        expect(body).toHaveLength(2);
                        expect(body[0].slug).toBe("VALUE_1");
                        expect(body[1].slug).toBe("VALUE_3");
                    });
            });
        });
    });

    describe("Content sorting", () => {
        test("Should get with sort", async () => {
            const slugs = ["AAA", "CCC", "BBB"];

            for (let i = 0; i < 3; i++) {
                await request(app)
                    .post("/content/")
                    .send({slug: `CONTENT_${slugs[i]}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get("/content/?sort=field-slug-asc")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body[0].slug).toBe("CONTENT_AAA");
                    expect(res.body[1].slug).toBe("CONTENT_BBB");
                    expect(res.body[2].slug).toBe("CONTENT_CCC");
                });
        });

        test("Should get with status sort", async () => {
            await request(app)
                .post("/status/")
                .send({_id: "STATUS"})
                .set(...require("./mock/auth"))
                .expect(201);

            for (let i = 0; i < 6; i++) {
                await request(app)
                    .post("/content/")
                    .send({
                        slug: `CONTENT_${i}`,
                        status: [i % 2 === 0 ? "STATUS" : undefined],
                    })
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get("/content/?sort=status-STATUS-asc")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {

                    // expect(res.body[0].slug).toBe("CONTENT_AAA");
                    // expect(res.body[1].slug).toBe("CONTENT_BBB");
                    // expect(res.body[2].slug).toBe("CONTENT_CCC");
                });
        });
    });

    describe("Content pagination", () => {
        test("Should get with limit", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/content/")
                    .send({slug: `CONTENT_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get("/content/?limit=5")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.headers["total-row-count"]).toBe("10");
                    expect(res.body).toHaveLength(5);
                    expect(res.body[4].slug).toBe("CONTENT_4");
                });
        });

        test("Should get row count", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/content/")
                    .send({slug: `CONTENT_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .head("/content/?limit=5")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.headers["total-row-count"]).toBe("10");
                });
        });

        test("Should get with offset", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/content/")
                    .send({slug: `CONTENT_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get("/content/?offset=4")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.headers["total-row-count"]).toBe("10");
                    expect(res.body).toHaveLength(6);
                    expect(res.body[0].slug).toBe("CONTENT_4");
                });
        });

        test("Should get with limit and offset", async () => {
            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/content/")
                    .send({slug: `CONTENT_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201);
            }

            await request(app)
                .get("/content/?limit=3&offset=3")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.headers["total-row-count"]).toBe("10");
                    expect(res.body).toHaveLength(3);
                    expect(res.body[0].slug).toBe("CONTENT_3");
                });
        });
    });

    describe("Content permissions", () => {
        test("Should get list with permission", async () => {
            await request(app)
                .post("/permission/")
                .set(...require("./mock/auth"))
                .send({
                    method: "GET",
                    entity: "CONTENT",
                    group: 1,
                })
                .expect(201);

            await request(app)
                .get("/content/")
                .set("authorization", `Bearer ${jwt.sign(
                    {id: 1, group: [1]},
                    "hello world !",
                    {algorithm: 'HS256'}
                )}`)
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual([]);
                });
        });

        test("Shouldn't get list without permission", async () => {
            await request(app)
                .post("/permission/")
                .set(...require("./mock/auth"))
                .send({
                    method: "GET",
                    entity: "CONTENT",
                    group: 2
                })
                .expect(201);

            await request(app)
                .get("/content/")
                .set("authorization", `Bearer ${jwt.sign(
                    {id: 1, group: [1]},
                    "hello world !",
                    {algorithm: 'HS256'}
                )}`)
                .expect(403);
        });
    });
});
