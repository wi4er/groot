const Image = require("./Image");
const Status = require("./Status");
const Property = require("./Property");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Image model", function () {
    test("Should create model", async () => {
        const inst = await new Image({_id: "DETAIL"}).save();

        expect(inst._id).toBe("DETAIL");
    });

    test("Should find list", async () => {
        for (let i = 1; i <= 5; i++) {
            await new Image({_id: `value_${i}`}).save();
        }

        const list = await Image.find({});

        expect(list.length).toBe(5)
    });

    describe("Image with status", () => {
        test("Should add with status", async () => {
            await new Status({_id: "NEW"}).save();
            const inst = await new Image({
                _id: "DETAIL",
                status: "NEW",
            }).save();

            expect(inst.status).toEqual(["NEW"]);
        });

        test("Should add with wrong status", async () => {
            const inst = await new Image({
                _id: "DETAIL",
                status: "NEW",
            }).save();

            expect(inst.status).toHaveLength(0);
        });
    });

    describe("Image with property", () => {
        test("Should add with property", async () => {
            await new Property({_id: "ARTICLE"}).save();
            const inst = await new Image({
                _id: "DETAIL",
                property: [{
                    value: "VALUE",
                    property: "ARTICLE"
                }],
            }).save();

            expect(inst.property).toHaveLength(1);
            expect(inst.property[0].property).toEqual("ARTICLE");
            expect(inst.property[0].value).toEqual(["VALUE"]);
        });

        test("Should add with wrong status", async () => {
            const inst = await new Image({
                _id: "DETAIL",
                property: [{
                    value: "VALUE",
                    property: "NEW",
                }],
            }).save();

            expect(inst.property).toHaveLength(0);
        });
    });
});
