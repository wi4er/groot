const request = require("supertest");
const app = require(".");

afterEach(() => require("./model").clearDatabase());
afterAll(() => require("./model").disconnect());

jest.mock("../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
    SECRET: "hello world !",
}));

describe("Application", function () {
    test("Should create app", async () => {
        await request(app)
            .get("/")
            .expect(200);
    });
});
