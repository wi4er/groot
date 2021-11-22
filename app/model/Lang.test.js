const
    Lang = require("./Image");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Image model", function () {
    test("Should create model", async () => {
        const inst = await new Lang({_id: "EN"}).save();

        expect(inst._id).toBe("EN");
    });
});
