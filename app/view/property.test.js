const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());

describe("Property entity", function () {
    test("Should get empty list", async () => {
        await request(app)
            .get("/property/")
            .set(...require("./mock/auth"))
            .expect(200)
            .then(res => {
                expect(res.body).toEqual([]);
            });
    });

    describe("Adding items with fields", () => {
        test("Should add item", async () => {
            await request(app)
                .post("/property/")
                .send({_id: "NAME"})
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body._id).toBe("NAME");
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
    });

    describe("Adding items with status", () => {
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

        test("Should add item item with wrong status",  async () => {
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

    describe("Adding items with property", () => {
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
                    property: [{
                        value: "SOMETHING",
                        property: "NAME",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(result => {
                    expect(result.body.property).toHaveLength(1);
                    expect(result.body.property[0].value).toEqual(["SOMETHING"]);
                });
        });

        test("Shouldn't add item with wrong property", async () => {
            await request(app)
                .post("/property/")
                .send({
                    _id: "WITH_NAME",
                    property: [{
                        value: "SOMETHING",
                        property: "WRONG",
                    }]
                })
                .set(...require("./mock/auth"))
                .expect(201)
                .then(res => {
                    expect(res.body.property).toHaveLength(0);
                })
        });
    });

    test("Should update item", async () => {
        // await request(app)
        //     .post("/property/")
        //     .send({_id: "VENDOR_CODE"})
        //     .expect(201)
        //     .then(res => {
        //         const item = JSON.parse(res.text);
        //
        //         expect(item._id).toBe("VENDOR_CODE");
        //
        //         return item;
        //     });
        //
        // await request(app)
        //     .put(`/property/VENDOR_CODE/`)
        //     .send({_id: "UPDATED"})
        //     .expect(200)
        //     .then(res => {
        //         console.log(res);
        //
        //
        //         expect(JSON.parse(res.text)._id).toBe("UPDATED");
        //     });

        // await request(app)
        //     .get(`/property/UPDATED/`)
        //     .expect(200)
        //     .then(res => {
        //         expect(JSON.parse(res.text)[0]._id).toBe("UPDATED");
        //     });
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

    describe("Property filters", () => {
        test("Should add and get multi items" , async () => {
            const list = [];

            for (let i = 0; i < 10; i++) {
                await request(app)
                    .post("/property/")
                    .send({_id: `STATUS_${i}`})
                    .set(...require("./mock/auth"))
                    .expect(201)
                    .then(res => {
                        list.push(JSON.parse(res.text)._id)
                    });
            }

            await request(app)
                .get(`/property/?filter=field_id-in-STATUS_1;STATUS_2;STATUS_3`)
                .expect(200)
                .set(...require("./mock/auth"))
                .then(res => {
                    expect(JSON.parse(res.text).length).toBe(3);
                });
        });

        // test("Should add multi items" , async () => {
        //     const list = [];
        //
        //     for (let i = 0; i < 10; i++) {
        //         await request(app)
        //             .post("/property/")
        //             .send({_id: `STATUS_${i}`})
        //             .expect(201)
        //             .then(res => {
        //                 list.push(JSON.parse(res.text)._id)
        //             });
        //     }
        //
        //     await request(app)
        //         .get(`/property/?filter=field_id-in-${list[0]};${list[1]};${list[2]}&filter=field_slug-in-STATUS_0`)
        //         .expect(200)
        //         .then(res => {
        //             expect(JSON.parse(res.text).length).toBe(1);
        //             expect(JSON.parse(res.text)[0].slug).toBe("STATUS_0");
        //         });
        // });
    });
});
