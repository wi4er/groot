const Status = require("./Status");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Status", function () {
    test("Should create", async () => {
        const inst = await new Status({_id: "ST_3"}).save();

        expect(inst._id).toBe("ST_3");
    });
});
