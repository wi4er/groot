const Content = require("./Content");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Status = require("./Status");
const Lang = require("./Lang");
const Directory = require("./Directory");
const Value = require("./Value");

afterEach(() => require(".").clearDatabase());
beforeAll(() => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Content", () => {
    describe("Content fields", function () {
        test("Should create", async () => {
            const inst = await new Content({
                slug: "DATA",
            }).save();

            expect(inst.slug).toBe("DATA");
        });
    });

    describe("Content with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Content({
                slug: "DATA",
                property: {
                    "DEF": {
                        "PROP": "VALUE"
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").get("PROP")).toEqual(["VALUE"]);
        });

        test("Should create with wrong property", async () => {
            const inst = await new Content({
                slug: "DATA",
                property: {
                    "DEF": {
                        "LABEL":  "VALUE_1"
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
                        "WRONG":  "VALUE"
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
                slug: "DATA",
                property: {
                    "RU": {
                        "PROP": "VALUE",
                    }
                }
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("RU").size).toBe(1);
            expect(inst.property.get("RU").get("PROP")).toEqual(["VALUE"]);
        });

        test("Should create with wrong lang", async () => {
            await new Property({_id: "PROP"}).save();
            await new Lang({_id: "RU"}).save();

            const inst = await new Content({
                slug: "DATA",
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
                slug: "DATA",
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
            expect(inst.property.get("RU").get("PROP")).toEqual(["VALUE"]);
        });

        test("Should create with empty value", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Content({
                slug: "DATA",
                property: {
                    "DEF": {
                        "PROP": undefined,
                    }
                }
            }).save();

            expect(inst.property.size).toBe(0);
        });

        test("Should create with empty lang", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Content({
                slug: "DATA",
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
            expect(inst.description.get("DEF").get("DETAIL")).toEqual(["TEXT"]);
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

    describe("Content with status", () => {
        test("Should create with status", async () => {
            await new Status({_id: "ACTIVE"}).save();
            const inst = await new Content({status: ["ACTIVE"]}).save();

            expect(inst.status).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create content with wrong status", async () => {
            const inst = await new Content({
                slug: "DATA",
                status: ["WRONG"],
            }).save();

            expect(inst.status).toEqual([]);
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
});
