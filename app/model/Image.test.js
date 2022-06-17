const Image = require("./Image");
const Flag = require("./Flag");
const Property = require("./Property");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Image entity", function () {
    describe("Image fields", () => {
        test("Should create model", async () => {
            const inst = await new Image({_id: "DETAIL"}).save();

            expect(inst._id).toBe("DETAIL");
        });

        test("Should't create with empty id", async () => {
            await expect(
                new Image({_id: ""}).save()
            ).rejects.toThrow();
        });

        test("Should find list", async () => {
            for (let i = 1; i <= 5; i++) {
                await new Image({_id: `value_${i}`}).save();
            }

            const list = await Image.find({});

            expect(list.length).toBe(5);
        });
    });

    describe("Image with flag", () => {
        test("Should add with status", async () => {
            await new Flag({_id: "NEW"}).save();
            const inst = await new Image({
                _id: "DETAIL",
                flag: "NEW",
            }).save();

            expect(inst.flag).toEqual(["NEW"]);
        });

        test("Should add with wrong status", async () => {
            const inst = await new Image({
                _id: "DETAIL",
                flag: "WRONG",
            }).save();

            expect(inst.flag).toBeUndefined();
        });
    });

    describe("Image with property", () => {
        test("Should add with property", async () => {
            await new Property({_id: "ARTICLE"}).save();
            const inst = await new Image({
                _id: "DETAIL",
                property: {
                    "DEF": {
                        "ARTICLE": "VALUE"
                    }
                },
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
            expect(inst.property.get("DEF").get("ARTICLE")).toEqual("VALUE");
        });

        test("Should add with wrong property", async () => {
            const inst = await new Image({
                _id: "DETAIL",
                property: {"DEF": {"WRONG": "VALUE"}},
            }).save();

            expect(inst.property).toBeUndefined();
        });
    });
});
