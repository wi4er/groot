const Description = require("./Description");
const Status = require("./Status");
const Property = require("./Property");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Description entity", function () {
    describe("Description fields", () => {
        test("Should create", async () => {
            const inst = await new Description({_id: "DATA"}).save();

            expect(inst._id).toBe("DATA");
        });

        test("Shouldn't create with empty id", async () => {
            await expect(
                new Description({_id: ""}).save()
            ).rejects.toThrow();
        });

        test("Should find one", async () => {
            await new Description({_id: "DATA"}).save();

            const res = await Description.findById("DATA");
            expect(res._id).toBe("DATA");
        });
    });

    describe("Description with status", () => {
        test("Should create with status", async () => {
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new Description({
                _id: "DATA",
                status: ["ACTIVE"],
            }).save();

            expect(inst.status).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create with wrong status", async () => {
            const inst = await new Description({
                _id: "DATA",
                status: ["PASSIVE"],
            }).save();

            expect(inst.status).toHaveLength(0);
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
            expect(inst.property.get("DEF").get("NAME")).toEqual(["PRODUCT"]);
        });

        test("Should create with wrong property", async () => {
            const inst = await new Description({
                _id: "DATA",
                property: {
                    "DEF": {
                        "WRONG": "PRODUCT"
                    }
                },
            }).save();

            expect(inst.property.size).toBe(0);
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "NAME"}).save();

            const inst = await new Description({
                _id: "DATA",
                property: {
                    "WRONG": {
                        "NAME": "PRODUCT"
                    }
                },
            }).save();

            expect(inst.property.size).toBe(0);
        });
    });
});
