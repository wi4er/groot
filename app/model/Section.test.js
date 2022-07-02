const Section = require("./Section");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Flag = require("./Flag");
const Uniq = require("./Uniq");

afterEach(() => require(".").clearDatabase());
beforeAll(() => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Section", () => {
    describe("Section fields", function () {
        test("Should create", async () => {
            const inst = await new Section({}).save();

            expect(inst._id.toString().length).toBe(24);
            expect(inst.timestamp).not.toBeUndefined();
            expect(inst.created).not.toBeUndefined();
        });

        test("Shouldn't edit created", async () => {
            const inst = await new Section({}).save();
            const oldDate = inst.created;

            inst.created = new Date();
            await inst.save();

            expect(oldDate).toBe(inst.created);
        });
    });

    describe("Section with uniq", () => {
        test("Should create with uniq", async () => {
            await new Uniq({_id: "SLUG"}).save();
            const inst = await new Section({
                uniq: {
                    uniq: "SLUG",
                    value: "VALUE",
                }
            }).save();

            expect(inst.uniq[0].uniq).toBe("SLUG");
            expect(inst.uniq[0].value).toBe("VALUE");
        });

        test("Shouldn't create with non uniq", async () => {
            await new Uniq({_id: "SLUG"}).save();

            await new Section({
                uniq: {
                    uniq: "SLUG",
                    value: "VALUE",
                }
            }).save();

            await expect(new Section({
                uniq: {
                    uniq: "SLUG",
                    value: "VALUE",
                }
            }).save()).rejects.toThrow();
        });
    });

    describe("Section with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Section({
                property: {"DEF": {"PROP": "VALUE"}}
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
            expect(inst.property.get("DEF").get("PROP")).toEqual("VALUE");
        });

        test("Should create with wrong property", async () => {
            const item = await new Section({
                property: {"DEF": {"LABEL": "VALUE_1"}}
            }).save();

            expect(item.property).toBeUndefined();
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "PROP"}).save();

            const item = await new Section({
                property: {"WRONG": {"PROP": "VALUE_1"}}
            }).save();

            expect(item.property).toBeUndefined();
        });
    });

    describe("Section with image", () => {
        test("Should create section with image", async () => {
            await new Image({_id: "PREVIEW"}).save();
            const inst = await new Section({
                image: {
                    "PREVIEW": {
                        url: "http://localhost/image.jpg",
                    }
                }
            }).save();

            expect(inst.image.size).toBe(1);
            expect(inst.image.get("PREVIEW")[0].url).toBe("http://localhost/image.jpg");
        });

        test("Should create section with wrong image", async () => {
            const inst = await new Section({
                image: {
                    "WRONG": {
                        url: "http://localhost/image.jpg",
                    }
                }
            }).save();

            expect(inst.image.size).toBe(0);
        });
    });

    describe("Section with description", () => {
        test("Should create with description", async () => {
            await new Description({_id: "DETAIL"}).save()
            const inst = await new Section({
                description: {"DEF": {"DETAIL": "TEXT"}},
            }).save();

            expect(inst.description.size).toBe(1);
            expect(inst.description.get("DEF").size).toBe(1);
            expect(inst.description.get("DEF").get("DETAIL")).toEqual("TEXT");
        });

        test("Should create section with wrong description", async () => {
            const item = await new Section({
                description: {"DEF": {"WRONG": "TEXT"}},
            }).save();

            expect(item.description).toBeUndefined();
        });
    });

    describe("Section with flag", () => {
        test("Should create without flag", async () => {
            await new Section({}).save();
            const list = await Section.find({});
            
            expect(list).toHaveLength(1);
            expect(list[0].flag).toBeUndefined();
        });

        test("Should create with status", async () => {
            await new Flag({_id: "ACTIVE"}).save();
            const inst = await new Section({flag: ["ACTIVE"]}).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create section with wrong status", async () => {
            const item = await new Section({
                flag: ["WRONG"],
            }).save();

            expect(item.flag).toBeUndefined();
        });
    });
});
