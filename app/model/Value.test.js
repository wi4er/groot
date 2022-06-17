const DirectoryValue = require("./Value");
const Flag = require("./Flag");
const Directory = require("./Directory");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

jest.mock("../../environment", () => ({
    DB_USER: "content",
    DB_PASSWORD: "example",
    DB_HOST: "localhost",
    DB_NAME: "content",
}));

describe("Value entity", function () {
    describe("Value fields", () => {
        test("Should create", async () => {
            await new Directory({_id: "Directory"}).save();
            const inst = await new DirectoryValue({
                _id: "VALUE",
                directory: "Directory",
            }).save();

            expect(inst._id).toBe("VALUE");
            expect(inst.directory).toBe("Directory");
        });

        test("Should find one", async () => {
            await new Directory({_id: "Directory"}).save();
            await new DirectoryValue({_id: "VALUE", directory: "Directory"}).save();

            const res = await DirectoryValue.findById("VALUE");
            expect(res._id).toBe("VALUE");
        });
    });

    describe("Value with flag", () => {
        test("Should create with flag", async () => {
            await new Flag({_id: "ACTIVE"}).save();
            await new Directory({_id: "DIRECTORY"}).save();

            const inst = await new DirectoryValue({
                _id: "VALUE",
                directory: "DIRECTORY",
                flag: ["ACTIVE"],
            }).save();

            expect(inst.flag).toEqual(["ACTIVE"]);
        });

        test("Should create with wrong flag", async () => {
            await new Directory({_id: "DIRECTORY"}).save();
            const inst = await new DirectoryValue({
                _id: "DIRECTORY",
                directory: "DIRECTORY",
                flag: ["PASSIVE"],
            }).save();

            expect(inst.flag).toBeUndefined();
        });
    });

    describe("Directory value directory", () => {
        test("Should create with directory", () => {

        });
    });
});
