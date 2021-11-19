const Content = require("./Content");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Status = require("./Status");
const Directory = require("./Directory");
const DirectoryValue = require("./DirectoryValue");

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
                property: [{
                    value: "VALUE",
                    property: "PROP",
                }]
            }).save();

            expect(inst.property.length).toBe(1);
            expect(inst.property[0].value).toEqual(["VALUE"]);
        });

        test("Should create with property and populate", async () => {
            await new Property({_id: "SHORT"}).save();

            const inst = await new Content({
                slug: "DATA",
                property: [{
                    value: "VALUE",
                    property: "SHORT",
                }]
            }).save();

            const result = await Content
                .findById(inst._id)
                .populate({
                    path: "property",
                    populate: {
                        path: "property"
                    }
                });

            expect(result.property.length).toBe(1);
            expect(result.property[0].property._id).toEqual("SHORT");
        });

        test("Shouldn't create with wrong property", async () => {
            const inst = await new Content({
                slug: "DATA",
                property: [{
                    value: "VALUE_1",
                    property: "LABEL",
                }]
            }).save();

            expect(inst.property).toHaveLength(0);
        });

        test("Shouldn't create with empty property", async () => {
            await expect(new Content({
                slug: "DATA",
                property: [{
                    value: "VALUE_1",
                }]
            }).save()).rejects.toThrow();
        });
    });

    describe("Content with image", () => {
        test("Should create content with image", async () => {
            await new Image({_id: "PREVIEW"}).save();
            const inst = await new Content({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "PREVIEW",
                }]
            }).save();

            expect(inst.image).toHaveLength(1);
            expect(inst.image[0].image).toBe("PREVIEW");
        });

        test("Should find content with image", async () => {
            await new Image({_id: "PREVIEW"}).save()

            await new Content({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "PREVIEW",
                }]
            }).save();

            const item = await Content
                .findOne({slug: "DATA"})
                .populate({
                    path: "image",
                    populate: {path: "image"},
                })
                .exec();

            expect(item.image.length).toBe(1);
            expect(item.image[0].image._id).toBe("PREVIEW");
        });

        test("Shouldn't create content with wrong image", async () => {
            const inst = await new Content({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "WRONG",
                }]
            }).save();

            expect(inst.image).toHaveLength(0);
        });
    });

    describe("Content with description", () => {
        test("Should create with description", async () => {
            await new Description({_id: "DETAIL"}).save()

            const inst = await new Content({
                slug: "DATA",
                description: [{
                    value: "TEXT",
                    description: "DETAIL",
                }],
            }).save();

            expect(inst.description.length).toBe(1);
            expect(inst.description[0].value).toEqual(["TEXT"]);
        });

        test("Should create with description and populate", async () => {
            await new Description({_id: "DETAIL"}).save()

            const inst = await new Content({
                slug: "DATA",
                description: [{
                    value: "TEXT",
                    description: "DETAIL",
                }],
            }).save();

            const list = await Content.findById(inst._id)
                .populate({
                    path: "description",
                    populate: {path: "description"}
                })
                .exec();

            expect(list.description.length).toBe(1);
            expect(list.description[0].description._id).toEqual("DETAIL");
        });

        test("Shouldn't create content with wrong description", async () => {
            const inst = await new Content({
                slug: "DATA",
                description: [{
                    value: "TEXT",
                    description: "DETAIL",
                }],
            }).save();

            expect(inst.description).toHaveLength(0);
        });

        test("Shouldn't create with empty description", async () => {
            await expect(new Content({
                slug: "DATA",
                description: [{
                    value: "VALUE_1",
                }]
            }).save()).rejects.toThrow();
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
            await new DirectoryValue({_id: "RED", directory: "COLOR"}).save();

            const inst = await new Content({
                directory: [{
                    directory: "COLOR",
                    value: "RED"
                }]}
            ).save();

            expect(inst.directory[0].value).toEqual(["RED"]);
            expect(inst.directory[0].directory).toEqual("COLOR");
        });

        test("Should create with wrong directory directory", async () => {
            const inst = await new Content({
                directory: [{
                    directory: "WRONG",
                    value: "VALUE"
                }]}
            ).save();

            expect(inst.directory).toHaveLength(0);
        });
    });
});
