const Event = require("./Event");
const Status = require("./Flag")
const Property = require("./Property")

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Event entity", () => {
    describe("Event fields", () => {
        test("Should create event", async () => {
            const inst = await new Event({_id: "CREATE"}).save();

            expect(inst._id).toBe("CREATE");
            expect(inst.timestamp).not.toBeUndefined();
            expect(inst.created).not.toBeUndefined();
        });

        test("Shouldn't create without id", async () => {
            await expect(new Event({_id: ""}).save()).rejects.toThrow();
            await expect(new Event({_id: null}).save()).rejects.toThrow();
            await expect(new Event({}).save()).rejects.toThrow();
        });

        test("Should not change event created", async () => {
            const inst = await new Event({_id: "CREATE"}).save();

            const created = inst.created;
            inst.created = new Date();
            await inst.save();

            expect(created).toBe(inst.created);
        });
    });

    describe("Event with flags", () => {
        test("Should create event without flags", async () => {
            const event = await new Event({_id: "UPDATE"}).save();

            expect(event.flag).toBeUndefined();
        });

        test("Should create event with flags", async () => {
            await new Status({_id: "ACTIVE"}).save();
            const event = await new Event({_id: "UPDATE", flag: ["ACTIVE"]}).save();

            expect(event.flag).toEqual(["ACTIVE"]);
        });

        test("Should create event with wrong flags", async () => {
            const event = await new Event({_id: "UPDATE", flag: ["WRONG"]}).save();

            expect(event.flag).toBeUndefined();
        });
    });

    describe("Event with property", () => {
        test("Should create event with property", async () => {
            await new Property({_id: "ACTIVE"}).save();
            const event = await new Event({
                _id: "UPDATE",
                property: {
                    DEF: {ACTIVE: "VALUE"}
                }
            }).save();

            expect(event.property.get("DEF").get("ACTIVE")).toEqual("VALUE");
        });

        test("Should create event with array property", async () => {
            await new Property({_id: "ACTIVE"}).save();
            const event = await new Event({
                _id: "UPDATE",
                property: {
                    DEF: {ACTIVE: ["VALUE_1", "VALUE_2"]}
                }
            }).save();
        });

        test("Should create event with object property", async () => {
            await new Property({_id: "ACTIVE"}).save();
            await expect(new Event({
                _id: "UPDATE",
                property: {
                    DEF: {ACTIVE: {should: "THROW"}}
                }
            }).save()).rejects.toThrow();
        });
    });
});
