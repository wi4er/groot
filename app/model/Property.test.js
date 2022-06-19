const Property = require("./Property");
const Flag = require("./Flag");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Property entity", function () {
    describe("Property fields", () => {
        test("Should create", async () => {
            const inst = await new Property({
                _id: "DATA"
            }).save();

            expect(inst._id).toBe("DATA");
        });

        test("Shouldn't create with empty id", async () => {
            await expect(
                new Property({_id: ""}).save()
            ).rejects.toThrow();
        });
    });

    describe("Property with property", () => {
        test("Should create with property", async () => {
            await new Property({_id: "INNER"}).save();

            const inst = await new Property({
                _id: "OUTER",
                property: {
                    "DEF": {
                        "INNER": "VALUE"
                    }
                }
            }).save();

            expect(inst._id).toBe("OUTER");
            expect(inst.property.get("DEF").get("INNER")).toEqual("VALUE");
        });

        test("Should create with wrong property", async () => {
            const inst = await new Property({
                _id: "PROPERTY",
                property: {
                    "DEF": {
                        "WRONG": "VALUE"
                    }
                }
            }).save();

            expect(inst.property).toBeUndefined();
        });

        test("Should create with wrong and correct properties", async () => {
            await new Property({_id: "INNER"}).save();

            const inst = await new Property({
                _id: "OUTER",
                property: {
                    "DEF": {
                        "INNER": "VALUE",
                        "WRONG": "VALUE",
                    }
                },
            }).save();

            expect(inst.property.size).toBe(1);
            expect(inst.property.get("DEF").size).toBe(1);
        });
    });

    describe("Property with flag", () => {
        test("Should create with flag", () => {

        });

        test("Should filter by flag", async () => {
            for (let i = 0; i < 3; i++) {
                await new Flag({_id: `Flag_${i}`}).save();
            }

            for (let i = 0; i < 10; i++) {
                await new Property({
                    _id: `Property_${i}`,
                    flag: [`Flag_${i % 3}`],
                }).save();
            }

            await Property.find({
                flag: "Flag_1"
            }).then(res => {
                expect(res.length).toBe(3);
            });
        });
    });
});
