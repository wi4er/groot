const Content = require("./Content");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Flag = require("./Flag");
const Lang = require("./Lang");
const Directory = require("./Directory");
const Value = require("./Value");
const Event = require("./Event");
const Uniq = require("./Uniq");
const Section = require("./Section");

afterEach(() => require(".").clearDatabase());
beforeAll(() => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Content entity", () => {
    describe("Content fields", () => {
        test("Should create", async () => {
            const inst = await new Content({}).save();

            expect(inst.timestamp).not.toBeUndefined();
            expect(inst.created).not.toBeUndefined();
            expect(inst._id.toString().length).toBe(24);
        });

        test("Should create with created", async () => {
            const inst = await new Content({
                created: new Date("2022-01-01T00:00:00.000Z")
            }).save();

            expect(inst.created.toISOString()).not.toEqual("2022-01-01T00:00:00.000Z");
        });

        test("Shouldn't edit created", async () => {
            const inst = await new Content({}).save();
            const oldDate = inst.created;

            inst.created = new Date();
            await inst.save();
            const newDate = inst.created;

            expect(oldDate).toBe(newDate);
        });
    });

    describe("Content with uniq", () => {
        test("Should create with uniq", async () => {
            await new Uniq({_id: "DATA"}).save();

            const inst = await new Content({
                uniq: {
                    uniq: "DATA_1",
                    value: "VALUE",
                }
            }).save();

            expect(inst.uniq[0].value).toBe("VALUE");
        });

        test("Should create many with uniq", async () => {
            await new Uniq({_id: "DATA"}).save();

            const inst = await new Content({
                uniq: [{
                    uniq: "DATA_1",
                    value: "VALUE",
                }, {
                    uniq: "DATA_1",
                    value: "VALUE",
                }]
            }).save();

            expect(inst.uniq[0].value).toBe("VALUE");
        });

        test("Should create with empty uniq", async () => {
            await new Uniq({_id: "DATA"}).save();

            await new Content({
                uniq: {}
            }).save();

            await new Content({
                uniq: {}
            }).save();
        });

        test("Should be uniq", async () => {
            await new Uniq({_id: "DATA_1"}).save();

            await new Content({
                uniq: [{
                    uniq: "DATA_1",
                    value: "VALUE",
                }]
            }).save();

            await expect(new Content({
                uniq: [{
                    uniq: "DATA_1",
                    value: "VALUE",
                }]
            }).save()).rejects.toThrow();
        });

        test("Should be uniq in different uniq", async () => {
            await new Uniq({_id: "DATA_1"}).save();
            await new Uniq({_id: "DATA_2"}).save();

            await new Content({
                uniq: [{
                    uniq: "DATA_1",
                    value: "VALUE",
                }]
            }).save();

            await expect(new Content({
                uniq: [{
                    uniq: "DATA_2",
                    value: "VALUE",
                }]
            }).save()).rejects.toThrow();
        });

        test("Should be uniq in many uniq", async () => {
            await new Uniq({_id: "DATA_1"}).save();
            await new Uniq({_id: "DATA_2"}).save();

            await new Content({
                uniq: [{
                    uniq: "DATA_1",
                    value: "VALUE_1",
                }, {
                    uniq: "DATA_2",
                    value: "VALUE_2",
                }]
            }).save();

            await expect(new Content({
                uniq: [{
                    uniq: "DATA_2",
                    value: "VALUE_2",
                }, {
                    uniq: "DATA_2",
                    value: "VALUE_1",
                }]
            }).save()).rejects.toThrow();
        });
    });

    describe("Content with property", () => {
        test("Should create with string property", async () => {
            await new Property({_id: "PROP"}).save();
            const inst = await new Content({
                property: {
                    "DEF": {
                        "PROP": "VALUE"
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").get("PROP")).toEqual("VALUE");
        });

        test("Should create with number property", async () => {
            await new Property({_id: "NUMBER"}).save();
            const inst = await new Content({
                property: {
                    "DEF": {
                        "NUMBER": 333
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").get("NUMBER")).toEqual(333);
        });

        test("Should create with boolean property", async () => {
            await new Property({_id: "BOOL"}).save();
            const inst = await new Content({
                property: {
                    "DEF": {
                        "BOOL": true
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").get("BOOL")).toEqual(true);
        });

        test("Should create with wrong property", async () => {
            const inst = await new Content({
                property: {
                    "DEF": {
                        "LABEL": "VALUE_1"
                    }
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });

        test("Should create with wrong and correct property", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Content({
                slug: "DATA",
                property: {
                    "DEF": {
                        "PROP": "VALUE",
                        "WRONG": "VALUE"
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
        });

        test("Should create with lang property", async () => {
            await new Property({_id: "PROP"}).save();
            await new Lang({_id: "RU"}).save();

            const inst = await new Content({
                property: {
                    "RU": {
                        "PROP": "VALUE",
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("RU").size).toBe(1);
            expect(inst.property.get("RU").get("PROP")).toEqual("VALUE");
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "PROP"}).save();
            await new Lang({_id: "RU"}).save();

            const inst = await new Content({
                property: {
                    "WRONG": {
                        "PROP": "VALUE",
                    }
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });

        test("Should create with wrong and correct lang", async () => {
            await new Property({_id: "PROP"}).save();
            await new Lang({_id: "RU"}).save();

            const inst = await new Content({
                property: {
                    "WRONG": {
                        "PROP": "VALUE",
                    },
                    "RU": {
                        "PROP": "VALUE",
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("RU").size).toBe(1);
            expect(inst.property.get("RU").get("PROP")).toEqual("VALUE");
        });

        test("Should create with empty value", async () => {
            await new Property({_id: "PROP"}).save();
            const inst = await new Content({
                property: {
                    "DEF": {
                        "PROP": undefined,
                    }
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });

        test("Should create with nullable value", async () => {
            await new Property({_id: "PROP"}).save();
            const inst = await new Content({
                property: {
                    "DEF": {
                        "PROP": null,
                    }
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });


        test("Should create with empty lang", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Content({
                property: {
                    "DEF": undefined,
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });
    });

    describe("Content with image", () => {
        test("Should create content with image", async () => {
            await new Image({_id: "PREVIEW"}).save();

            const inst = await new Content({
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

        test("Shouldn't create content with wrong image", async () => {
            const inst = await new Content({
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

    describe("Content with description", () => {
        test("Should create with description", async () => {
            await new Description({_id: "DETAIL"}).save()
            const inst = await new Content({
                slug: "DATA",
                description: {
                    "DEF": {
                        "DETAIL": "TEXT"
                    }
                },
            }).save();

            expect(inst.description.size).toBe(1);
            expect(inst.description.get("DEF").size).toBe(1);
            expect(inst.description.get("DEF").get("DETAIL")).toEqual("TEXT");
        });

        test("Should create content with wrong description", async () => {
            const inst = await new Content({
                slug: "DATA",
                description: {
                    "DEF": {
                        "DETAIL": "TEXT"
                    }
                },
            }).save();

            expect(inst.description.size).toBe(0);
        });

        test("Should create content with lang", async () => {
            await new Lang({_id: "EN"}).save();
            await new Description({_id: "DETAIL"}).save()

            const inst = await new Content({
                slug: "DATA",
                description: {
                    "EN": {
                        "DETAIL": "TEXT"
                    }
                },
            }).save();

            expect(inst.description.size).toBe(1);
            expect(inst.description.get("EN").size).toBe(1);
        });

        test("Should create content with wrong lang", async () => {
            await new Lang({_id: "EN"}).save();
            await new Description({_id: "DETAIL"}).save()

            const inst = await new Content({
                slug: "DATA",
                description: {
                    "WRONG": {
                        "DETAIL": "TEXT"
                    }
                },
            }).save();

            expect(inst.description.size).toBe(0);
        });
    });

    describe("Content with flag", () => {
        test("Should create with status", async () => {
            await new Flag({_id: "ACTIVE"}).save();
            const inst = await new Content({flag: ["ACTIVE"]}).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create content with wrong status", async () => {
            const inst = await new Content({status: ["WRONG"]}).save();

            expect(inst.flag).toBeUndefined();
        });
    });

    describe("Content with directory", () => {
        test("Should create with directory", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "RED", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "COLOR": "RED"
                }
            }).save();

            expect(inst.directory.get("COLOR")).toEqual(["RED"]);
            expect(inst.directory.size).toBe(1);
        });

        test("Should create with wrong directory", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "RED", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "WRONG": "RED"
                }
            }).save();

            expect(inst.directory.size).toBe(0);
        });

        test("Should create with wrong and correct directory", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "BLUE", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "COLOR": "BLUE",
                    "WRONG": "VALUE",
                }
            }).save();

            expect(inst.directory.size).toBe(1);
            expect(inst.directory.get("COLOR")).toEqual(["BLUE"]);
        });

        test("Should create with wrong and correct directory value", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "RED", directory: "COLOR"}).save();
            await new Value({_id: "BLUE", directory: "COLOR"}).save();
            await new Value({_id: "GREEN", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "COLOR": ["BLUE", "RED", "WRONG", "GREEN"],
                }
            }).save();

            expect(inst.directory.size).toBe(1);
            expect(inst.directory.get("COLOR")).toEqual(["BLUE", "RED", "GREEN"]);
        });

        test("Should create with doubled directory value", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "RED", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "COLOR": ["RED", "RED", "RED"],
                }
            }).save();

            expect(inst.directory.size).toBe(1);
            expect(inst.directory.get("COLOR")).toEqual(["RED"]);
        });

        test("Should create with wrong value", async () => {
            await new Directory({_id: "COLOR"}).save();
            await new Value({_id: "RED", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: {
                    "COLOR": "WRONG"
                }
            }).save();

            expect(inst.directory.size).toBe(0);
        });
    });

    describe("Content with event", () => {
        test("Should create content with event", async () => {
            await new Event({_id: "UPDATE"}).save();

            const inst = await new Content({
                event: {
                    "UPDATE": "2000-01-01T12:00:00.000Z"
                }
            }).save();

            expect(inst.event.get("UPDATE").toISOString()).toEqual("2000-01-01T12:00:00.000Z");
        });

        test("Should create content with nonexistent event", async () => {
            const inst = await new Content({
                event: {
                    "UPDATE": "2000-01-01T12:00:00.000Z"
                }
            }).save();

            expect(inst.event.size).toBe(0);
        });

        test("Should create content with event and nonexistent event", async () => {
            await new Event({_id: "UPDATE"}).save();

            const inst = await new Content({
                event: {
                    "UPDATE": "2000-01-01T12:00:00.000Z",
                    "WRONG": "2000-01-01T12:00:00.000Z",
                }
            }).save();

            expect(inst.event.size).toBe(1);
            expect(inst.event.get("UPDATE").toISOString()).toEqual("2000-01-01T12:00:00.000Z");
        });
    });

    describe("Content with section", () => {
        test("Should create content with section", () => {

        });
    });
});
