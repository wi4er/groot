const Property = require("./Property");
const Status = require("./Status");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Property", function () {
    test("Should create", async () => {
        const inst = await new Property({
            _id: "DATA"
        }).save();

        expect(inst._id).toBe("DATA");
    });

    describe("Property with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "INNER"}).save();

            const inst = await new Property({
                _id: "OUTER",
                property: [{
                    value: "VALUE",
                    property: "INNER",
                }]
            }).save();

            expect(inst._id).toBe("OUTER");
            expect(inst.property[0].value).toBe("VALUE");
        });

        test("Should create with wrong property", async () => {
            const inst = await new Property({
                _id: "PROPERTY",
                property: [{
                    value: "VALUE",
                    property: "WRONG",
                }]
            }).save();

            expect(inst._id).toBe("PROPERTY");
            expect(inst.property).toHaveLength(0);
        });

        test("Should create with wrong and correct properties", async () => {
            await new Property({_id: "INNER"}).save();

            const inst = await new Property({
                _id: "OUTER",
                property: [{
                    value: "VALUE",
                    property: "INNER",
                }, {
                    value: "VALUE",
                    property: "WRONG",
                }],
            }).save();

            expect(inst._id).toBe("OUTER");
            expect(inst.property).toHaveLength(1);
            expect(inst.property[0].property).toBe("INNER");
            expect(inst.property[0].value).toBe("VALUE");
        });

        test("Should fetch with property", async () => {
            await new Property({_id: "INNER"}).save();
            await new Property({
                _id: "OUTER",
                property: [{
                    value: "VALUE",
                    property: "INNER",
                }]
            }).save();

            await Property.findById("OUTER")
                .populate({
                    path: "property",
                    populate: {
                        path: "property"
                    }
                })
                .exec()
                .then(result => {
                    expect(result.property[0].property._id).toBe("INNER");
                });
        });
    });

    describe("Property with property", () => {
        test("Should filter by status", async () => {
            for (let i = 0; i < 3; i++) {
                await new Status({_id: `Status_${i}`}).save();
            }

            for (let i = 0; i < 10; i++) {
                await new Property({
                    _id: `Property_${i}`,
                    status: [`Status_${i % 3}`],
                }).save();
            }

            await Property.find({
                status: "Status_1"
            }).then(res => {
                expect(res.length).toBe(3);
            });
        });
    });
});
