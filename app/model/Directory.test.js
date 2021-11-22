const Directory = require("./Directory");
const Status = require("./Status");
const WrongRefError = require("../exception/WrongRefError");

afterEach(() => require(".").clearDatabase());
beforeAll( () => require(".").connect());
afterAll(() => require(".").disconnect());

describe("Directory", function () {
    describe("Directory fields", () => {
        test("Should create", async () => {
            const inst = await new Directory({
                _id: "DIRECTORY"
            }).save();

            expect(inst._id).toBe("DIRECTORY")
        });
    });

    describe("Directory status", () => {
        test("Should create with status", async () => {
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new Directory({
                _id: "DIRECTORY",
                status: ["ACTIVE"],
            }).save();

            expect(inst.status).toEqual(["ACTIVE"]);
        });

        test("Shouldn't create with wrong status", async () => {
            const item = await new Directory({
                _id: "DIRECTORY",
                status: ["PASSIVE"],
            }).save();

            expect(item.status).toHaveLength(0);
        });

        test("Should populate with status", async () => {
            await new Status({_id: "ACTIVE"}).save();

            const inst = await new Directory({
                _id: "DIRECTORY",
                status: ["ACTIVE"],
            }).save();

            const result = await Directory.findById(inst._id)
                .populate( "status")
                .exec();

            expect(result.status).toHaveLength(1);
            expect(result.status[0]._id).toBe("ACTIVE");
        });
    });
});
