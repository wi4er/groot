const request = require("supertest");
const app = require(".");

afterEach(() => require("./model").clearDatabase());
afterAll(() => require("./model").disconnect());

describe("Description endpoint", function () {
    test("Should create app", async () => {
        await request(app)
            .get("/")
            .expect(200);
    });
});
