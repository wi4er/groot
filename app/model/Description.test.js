const Description = require("./Description");
const Flag = require("./Flag");
const Property = require("./Property");
const Directory = require("./Directory");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Description entity", function () {
    describe("Description fields", () => {
        test("Should create description", async () => {
            const inst = await new Description({_id: "DATA"}).save();

            expect(inst._id).toBe("DATA");
        });

        test("Shouldn't create with empty id", async () => {
            await expect(new Description({_id: ""}).save()).rejects.toThrow();
            await expect(new Description({_id: null}).save()).rejects.toThrow();
            await expect(new Description({}).save()).rejects.toThrow();
        });

        test("Should update", async () => {
            const inst = await new Description({_id: "DIRECTORY"}).save();

            const {timestamp, created} = inst;
            await inst.save();

            expect(inst.timestamp).not.toBe(timestamp);
            expect(inst.created).toBe(created);
        });

        test("Should find one", async () => {
            await new Description({_id: "DATA"}).save();

            const res = await Description.findById("DATA");
            expect(res._id).toBe("DATA");
        });
    });

    describe("Description with flag", () => {
        test("Should create with flag", async () => {
            await new Flag({_id: "ACTIVE"}).save();
            const inst = await new Description({
                _id: "DATA",
                flag: ["ACTIVE"],
            }).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create with wrong status", async () => {
            const inst = await new Description({
                _id: "DATA",
                flag: ["PASSIVE"],
            }).save();

            expect(inst.flag).toBeUndefined();
        });
    });

    describe("Description with property", () => {
        test("Should create item with property", async () => {
            await new Property({_id: "NAME"}).save();
            const inst = await new Description({
                _id: "DATA",
                property: {
                    "DEF": {
                        "NAME": "PRODUCT"
                    }
                },
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
            expect(inst.property.get("DEF").get("NAME")).toEqual("PRODUCT");
        });

        test("Should create with wrong property", async () => {
            const inst = await new Description({
                _id: "DATA",
                property: {"DEF": {"WRONG": "PRODUCT"}},
            }).save();

            expect(inst.property).toBeUndefined();
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "NAME"}).save();
            const inst = await new Description({
                _id: "DATA",
                property: {"WRONG": {"NAME": "PRODUCT"}},
            }).save();

            expect(inst.property).toBeUndefined();
        });
    });
});
