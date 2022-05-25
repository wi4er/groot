const request = require("supertest");
const app = require("..");

afterEach(() => require("../model").clearDatabase());
afterAll(() => require("../model").disconnect());

describe("Event endpoint", () => {
    describe("Event fields", () => {
        test("Should get event list", async () => {
            await request(app)
                .get("/event/")
                .set(...require("./mock/auth"))
                .expect(200)
                .then(response => {
                    expect(response.body.length).toBe(0);
                });
        });

        test("Should post event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("./mock/auth"))
                .send({_id: "MODIFY"})
                .expect(201)
                .then(response => {
                    expect(response.body._id).toBe("MODIFY");
                });
        });

        test("Should put event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("./mock/auth"))
                .send({_id: "MODIFY"})
                .expect(201);

            await request(app)
                .put(`/event/MODIFY/`)
                .set(...require("./mock/auth"))
                .send({_id: "MODIFY"})
                .expect(200)
                .then(response => {
                    expect(response.body._id).toBe("MODIFY");
                });
        });

        test("Should delete event", async () => {
            await request(app)
                .post("/event/")
                .set(...require("./mock/auth"))
                .send({_id: "MODIFY"})
                .expect(201);

            await request(app)
                .delete(`/event/MODIFY/`)
                .set(...require("./mock/auth"))
                .expect(200)
                .then(res => {
                    expect(res.body).toBe(true);
                });
        });
    });
});
