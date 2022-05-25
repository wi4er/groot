const Event = require("../model/Event");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Event entity", () => {
    describe("Event fields", () => {
        test("Should create event", async () => {
            const inst = await new Event({_id: "CREATE"}).save();

            expect(inst._id).toBe("CREATE");
        });

        test("Shouldn't create without id", async () => {
            await expect(new Event({_id: ""}).save()).rejects.toThrow();
            await expect(new Event({_id: null}).save()).rejects.toThrow();
            await expect(new Event({}).save()).rejects.toThrow();
        });
    });
});
