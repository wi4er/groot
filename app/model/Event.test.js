const Event = require("../model/Event");
const Property = require("../model/Property");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Event entity", () => {
    describe("Event fields", () => {
        test("Should create event", async () => {
            const inst = await new Event({_id: "CREATE"}).save();

            expect(inst._id).toBe("CREATE");
            expect(inst.timestamp).not.toBeUndefined();
        });

        test("Shouldn't create with empty id", async () => {
            await expect(new Event({_id: ""}).save()).rejects.toThrow();
            await expect(new Event({_id: null}).save()).rejects.toThrow();
            await expect(new Event({_id: undefined}).save()).rejects.toThrow();
        });
    });

    describe("Event with property", () => {
        test("Should create event with property", async () => {
            await new Property({_id: "VALUE"}).save();

            const inst = await new Event({
                _id: "CREATE",
                property: {
                    "DEF": {
                        "VALUE": "SOME"
                    }
                }
            }).save();
            
            expect(inst.property.get("DEF").get("VALUE")).toBe(["SOME"]);
        });
    });
});
