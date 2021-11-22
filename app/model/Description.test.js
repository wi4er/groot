const Description = require("./Description");
const Status = require("./Status");
const Property = require("./Property");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Description", function () {
    describe("Description fields", () => {
        test("Should create", async () => {
            const inst = await new Description({_id: "DATA"}).save();

            expect(inst._id).toBe("DATA");
        });

        test("Should find one", async () => {
            await new Description({_id: "DATA"}).save();

            const res = await Description.findById("DATA");
            expect(res._id).toBe("DATA");
        });
    });

    describe("Description status", () => {
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

    describe("Description property", () => {
        test("Should create item with property", async () => {
            await new Property({_id: "NAME"}).save();

            const inst = await new Description({
                _id: "DATA",
                property: [{
                    value: "PRODUCT",
                    property: "NAME",
                }],
            }).save();

            expect(inst.property).toHaveLength(1);
            expect(inst.property[0].value).toEqual(["PRODUCT"]);
        });

        test("Should populate item with property", async () => {
            await new Property({_id: "NAME"}).save();

            await new Description({
                _id: "DATA",
                property: [{
                    value: "PRODUCT",
                    property: "NAME",
                }],
            }).save();

            const item = await Description
                .findById("DATA")
                .populate({
                    path: "property",
                    populate: {
                        path: "property"
                    }
                })
                .exec();

            expect(item.property).toHaveLength(1);
            expect(item.property[0].property._id).toBe("NAME");
        });

        test("Should create with wrong property", async () => {
            const inst = await new Description({
                _id: "DATA",
                property: [{
                    value: "PRODUCT",
                    property: "WRONG",
                }],
            }).save();

            expect(inst.property).toHaveLength(0);
        });

        test("Shouldn't create without property", async () => {
            await expect(new Description({
                _id: "DATA",
                property: [{
                    value: "PRODUCT",
                }],
            }).save()).rejects.toThrow();
        });

        test("Shouldn't create without property value", async () => {
            await new Property({_id: "NAME"}).save();

            await expect(new Description({
                _id: "DATA",
                property: [{
                    property: "NAME",
                }],
            }).save()).rejects.toThrow();
        });
    });
});
