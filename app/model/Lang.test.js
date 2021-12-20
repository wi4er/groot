const
    Lang = require("./Image");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Lang entity", function () {
    describe("Lang fields", () => {
        test("Should create model", async () => {
            const inst = await new Lang({_id: "EN"}).save();

            expect(inst._id).toBe("EN");
        });

        test("Shouldn't create with empty id", async () => {
            const inst = await expect(
                new Lang({_id: ""}).save()
            ).rejects.toThrow();
        });
    })
});
