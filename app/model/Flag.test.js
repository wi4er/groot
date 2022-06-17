const Status = require("./Flag");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Status entity", () => {
    describe("Status fields", () => {
        test("Should create", async () => {
            const inst = await new Status({_id: "ST_3"}).save();

            expect(inst._id).toBe("ST_3");
        });
    });
});
