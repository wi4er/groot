const DirectoryValue = require("./Value");
const Status = require("./Status");
const Directory = require("./Directory");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Directory", function () {
    describe("DirectoryValue fields", () => {
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

    describe("Directory value status", () => {
        test("Should create with status", async () => {
            await new Directory({_id: "DIRECTORY"}).save();
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new DirectoryValue({
                _id: "VALUE",
                directory: "DIRECTORY",
                status: ["ACTIVE"],
            }).save();

            expect(inst.status).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create with wrong status", async () => {
            await new Directory({_id: "DIRECTORY"}).save();
            const inst = await new DirectoryValue({
                _id: "DIRECTORY",
                directory: "DIRECTORY",
                status: ["PASSIVE"],
            }).save();

            expect(inst.status).toEqual([]);
        });
    });

    describe("Directory value directory", () => {
        test("Should create with directory", () => {

        });
    });
});
