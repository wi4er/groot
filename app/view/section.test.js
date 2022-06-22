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

describe("Section endpoint", function () {
    describe("Section fields", () => {
        describe("Section getting", () => {
            test("Should get list without fields", async () => {
                await request(app)
                    .get("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(200);
            });
        });

        describe("Section addition", () => {
            test("Should and item", async () => {
                await request(app)
                    .post("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => {
                        expect(res.body._id.length).toBe(24);
                    });
            });

            test("Should and item and get list", async () => {
                await request(app)
                    .post("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(201);

                await request(app)
                    .get("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).toBe(1);
                    });
            });
        });

        describe("Section update", () => {
            test("Should and item and update", async () => {
                const id = await request(app)
                    .post("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => res.body._id);

                
                await request(app)
                    .put(`/section/${id}/`)
                    .set(...require("../../test/createToken")())
                    .send({_id: id})
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe(id);
                    });
            });
        });

        describe("Section deletion", () => {
            test("Should and item and update", async () => {
                const id = await request(app)
                    .post("/section/")
                    .set(...require("../../test/createToken")())
                    .expect(201)
                    .then(res => res.body._id);


                await request(app)
                    .delete(`/section/${id}/`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body._id).toBe(id);
                    });
            });
        });
    });

    describe("Section filter", () => {
        describe("Section field filter", () => {
            test("Section filter by id", async () => {
                const list = [];

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .expect(201)
                        .then(res => {
                            list.push(res.body._id);
                        })
                }
                
                await request(app)
                    .get(`/section/?filter[field][id][in]=${list[0]};${list[1]}`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(2);
                        expect(res.body[0]._id).toBe(list[0]);
                        expect(res.body[1]._id).toBe(list[1]);
                    });
            });

            test("Section filter by created", async () => {
                const list = [];

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .expect(201)
                        .then(res => {
                            list.push(res.body.created);
                        })
                }

                await request(app)
                    .get(`/section/?filter[field][created][gt]=${list[2]}&filter[field][created][lt]=${list[5]}`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(4);
                        expect(res.body[0].created).toBe(list[2]);
                        expect(res.body[1].created).toBe(list[3]);
                        expect(res.body[2].created).toBe(list[4]);
                        expect(res.body[3].created).toBe(list[5]);
                    });
            });

            test("Section filter by timestamp", async () => {
                const list = [];

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .expect(201)
                        .then(res => {
                            list.push(res.body.timestamp);
                        })
                }

                await request(app)
                    .get(`/section/?filter[field][timestamp][gt]=${list[3]}&filter[field][timestamp][lt]=${list[5]}`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(3);
                        expect(res.body[0].timestamp).toBe(list[3]);
                        expect(res.body[1].timestamp).toBe(list[4]);
                        expect(res.body[2].timestamp).toBe(list[5]);
                    });
            });

            test("Shouldn't filter by wrong field", async () => {
                await request(app)
                    .get(`/section/?filter[field][wrong][in]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't filter by wrong operation", async () => {
                await request(app)
                    .get(`/section/?filter[field][id][wrong]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't filter without operation", async () => {
                await request(app)
                    .get(`/section/?filter[field][id]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't filter without field name", async () => {
                await request(app)
                    .get(`/section/?filter[field]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });
        });

        describe("Section property filter", () => {
            test("Should filter by property id", async () => {
                await request(app)
                    .post("/property/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "PROP"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            property: {
                                DEF: {PROP: `VALUE_${i}`}
                            }
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[property][PROP][in]=VALUE_3`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(1);
                        expect(res.body[0].property.DEF.PROP).toBe("VALUE_3");
                    });
            });

            test("Should filter by wrong property", async () => {
                await request(app)
                    .post("/property/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "PROP"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            property: {
                                DEF: {PROP: `VALUE_${i}`}
                            }
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[property][WRONG][in]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(0);
                    });
            });

            test("Shouldn't filter with wrong operation", async () => {
                await request(app)
                    .get(`/section/?filter[property][PROP][WRONG]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't filter without operation", async () => {
                await request(app)
                    .get(`/section/?filter[property][WRONG]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });

            test("Shouldn't filter without property name", async () => {
                await request(app)
                    .get(`/section/?filter[property]=WRONG`)
                    .set(...require("../../test/createToken")())
                    .expect(400);
            });
        });

        describe("Section flag filter", () => {
            test("Should filter by flag id", async () => {
                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ACTIVE"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            flag: i % 2 ? "ACTIVE" : undefined
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[flag][in]=ACTIVE`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(5);
                    });
            });

            test("Should filter by two flag", async () => {
                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ACTIVE"})
                    .expect(201);

                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ENABLE"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            flag: [
                                i % 2 ? "ACTIVE" : undefined,
                                i % 3 ? "ENABLE" : undefined,
                            ]
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[flag][in]=ENABLE;ACTIVE`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(8);
                    });
            });

            test("Should filter by two flag items", async () => {
                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ACTIVE"})
                    .expect(201);

                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ENABLE"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            flag: [
                                i % 2 ? "ACTIVE" : undefined,
                                i % 3 ? "ENABLE" : undefined,
                            ]
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[flag][in]=ENABLE&filter[flag][in]=ACTIVE`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(8);
                    });
            });

            test("Should filter by multi flag", async () => {
                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ACTIVE"})
                    .expect(201);

                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ENABLE"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            flag: [
                                i % 2 ? "ACTIVE" : undefined,
                                i % 3 ? "ENABLE" : undefined,
                            ]
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[flag][and]=ENABLE;ACTIVE`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(3);
                        expect(res.body[0].flag).toEqual(["ACTIVE", "ENABLE"]);
                        expect(res.body[1].flag).toEqual(["ACTIVE", "ENABLE"]);
                        expect(res.body[2].flag).toEqual(["ACTIVE", "ENABLE"]);
                    });
            });
        });

        describe("Section value filter", () => {
            test("Should filter by value", async () => {
                await request(app)
                    .post("/directory/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "COLOR"})
                    .expect(201);

                await request(app)
                    .post("/value/")
                    .set(...require("../../test/createToken")())
                    .send({
                        _id: "BLUE",
                        directory: "COLOR"
                    })
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            directory: {
                                COLOR: i % 2 ? "BLUE" : undefined,
                            }
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {

                    });
            });
        });

        describe("Section cross filter", () => {
            test("Should filer by flag and property", async () => {
                await request(app)
                    .post("/flag/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ACTIVE"})
                    .expect(201);

                await request(app)
                    .post("/property/")
                    .set(...require("../../test/createToken")())
                    .send({_id: "ARTICLE"})
                    .expect(201);

                for (let i = 0; i < 10; i++) {
                    await request(app)
                        .post("/section/")
                        .set(...require("../../test/createToken")())
                        .send({
                            flag: i % 2 ? "ACTIVE" : undefined,
                            property: {DEF: {ARTICLE:  i < 5 ? "VALUE" : undefined,}}
                        })
                        .expect(201);
                }

                await request(app)
                    .get(`/section/?filter[property][ARTICLE][in]=VALUE&filter[flag][in]=ACTIVE`)
                    .set(...require("../../test/createToken")())
                    .expect(200)
                    .then(res => {
                        expect(res.body).toHaveLength(2);
                    });
            });
        })
    });
});
