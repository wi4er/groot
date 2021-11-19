const Section = require("./Section");
const Property = require("./Property");
const Image = require("./Image");
const Description = require("./Description");
const Status = require("./Status");

afterEach(() => require(".").clearDatabase());
beforeAll(() => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Section", () => {
    describe("Section fields", function () {
        test("Should create", async () => {
            const inst = await new Section({
                slug: "DATA",
            }).save();

            expect(inst.slug).toBe("DATA");
        });
    });

    describe("Section with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "PROP"}).save();

            const inst = await new Section({
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

            const inst = await new Section({
                slug: "DATA",
                property: [{
                    value: "VALUE",
                    property: "SHORT",
                }]
            }).save();

            const result = await Section
                .findById(inst._id)
                .populate({
                    path: "property",
                    populate: {path: "property"}
                });

            expect(result.property.length).toBe(1);
            expect(result.property[0].property._id).toEqual("SHORT");
        });

        test("Shouldn't create with wrong property", async () => {
            const item = await new Section({
                slug: "DATA",
                property: [{
                    value: "VALUE_1",
                    property: "LABEL",
                }]
            }).save();

            expect(item.property).toHaveLength(0);
        });
    });

    describe("Section with image", () => {
        test("Should create section with image", async () => {
            await new Image({_id: "PREVIEW"}).save();
            const inst = await new Section({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "PREVIEW",
                }]
            }).save();

            expect(inst.image).toHaveLength(1);
            expect(inst.image[0].image).toBe("PREVIEW");
        });

        test("Should find section with image", async () => {
            await new Image({_id: "PREVIEW"}).save()

            await new Section({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "PREVIEW",
                }]
            }).save();

            const item = await Section
                .findOne({slug: "DATA"})
                .populate({
                    path: "image",
                    populate: {path: "image"},
                })
                .exec();

            expect(item.image.length).toBe(1);
            expect(item.image[0].image._id).toBe("PREVIEW");
        });

        test("Shouldn't create section with wrong image", async () => {
            new Section({
                slug: "DATA",
                image: [{
                    url: "http://localhost/image.jpg",
                    image: "WRONG",
                }]
            }).save().catch(() => done());
        });
    });

    describe("Section with description", () => {
        test("Should create with description", async () => {
            await new Description({_id: "DETAIL"}).save()

            const inst = await new Section({
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

            const inst = await new Section({
                slug: "DATA",
                description: [{
                    value: "TEXT",
                    description: "DETAIL",
                }],
            }).save();

            const list = await Section.findById(inst._id)
                .populate({
                    path: "description",
                    populate: {path: "description"}
                })
                .exec();

            expect(list.description.length).toBe(1);
            expect(list.description[0].description._id).toEqual("DETAIL");
        });

        test("Shouldn't create section with wrong description", async () => {
            const item = await new Section({
                slug: "DATA",
                description: [{
                    value: "TEXT",
                    description: "DETAIL",
                }],
            }).save();

            expect(item.description).toHaveLength(0);
        });
    });

    describe("Section with status", () => {
        test("Should create with status", async () => {
            await new Status({_id: "ACTIVE"}).save();
            const inst = await new Section({status: ["ACTIVE"]}).save();

            expect(inst.status).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create section with wrong status", async () => {
            const item = await new Section({
                slug: "DATA",
                status: ["WRONG"],
            }).save();

            expect(item.status).toHaveLength(0);
        });
    });
});
