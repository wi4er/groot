const Section = require("./Section");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Flag = require("./Flag");

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
            const inst = await new Section({
                slug: "DATA",
            }).save();

            expect(inst.slug).toBe("DATA");
            expect(inst.timestamp).not.toBeUndefined();
        });
    });

    describe("Section with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Section({
                slug: "DATA",
                property: {
                    "DEF": {
                        "PROP": "VALUE",
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
            expect(inst.property.get("DEF").get("PROP")).toEqual(["VALUE"]);
        });

        test("Should create with wrong property", async () => {
            const item = await new Section({
                slug: "DATA",
                property: {
                    "DEF": {
                        "LABEL": "VALUE_1",
                    }
                }
            }).save();

            expect(item.property.size).toBe(0);
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "PROP"}).save();

            const item = await new Section({
                slug: "DATA",
                property: {
                    "WRONG": {
                        "PROP": "VALUE_1",
                    }
                }
            }).save();

            expect(item.property.size).toBe(0);
        });
    });

    describe("Section with image", () => {
        test("Should create section with image", async () => {
            await new Image({_id: "PREVIEW"}).save();
            const inst = await new Section({
                slug: "DATA",
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
                slug: "DATA",
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
                slug: "DATA",
                description: {
                    "DEF": {
                        "DETAIL": "TEXT"
                    }
                },
            }).save();

            expect(inst.description.size).toBe(1);
            expect(inst.description.get("DEF").size).toBe(1);
            expect(inst.description.get("DEF").get("DETAIL")).toEqual(["TEXT"]);
        });

        test("Should create section with wrong description", async () => {
            const item = await new Section({
                slug: "DATA",
                description: {
                    "DEF": {
                        "WRONG": "TEXT"
                    }
                },
            }).save();

            expect(item.description.size).toBe(0);
        });
    });

    describe("Section with flag", () => {
        test("Should create with status", async () => {
            await new Flag({_id: "ACTIVE"}).save();
            const inst = await new Section({flag: ["ACTIVE"]}).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create section with wrong status", async () => {
            const item = await new Section({
                slug: "DATA",
                flag: ["WRONG"],
            }).save();

            expect(item.flag).toBeUndefined();
        });
    });
});
