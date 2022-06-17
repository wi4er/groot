const Permission = require("./Permission");

afterEach(() => require(".").clearDatabase());
beforeAll(() => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Property entity", () => {
    describe("Property addition", () => {
        test("Should create group", async () => {
            await new Permission({
                entity: "CONTENT",
                method: "GET",
                group: 1,
            }).save();
        });

        test("Shouldn't create without method", async () => {
            await expect(
                new Permission({
                    entity: "WRONG",
                }).save()
            ).rejects.toThrow();
        });

        test("Shouldn't create without method", async () => {
            await expect(
                new Permission({
                    method: "GET",
                }).save()
            ).rejects.toThrow("Path `entity` is required.");
        });
    });
});
