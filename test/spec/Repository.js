describe("Respository Model", function() {

	it("should exist", function() {
		expect(App.Models.Repository).toBeDefined()
	});

	it("the id attribute should be idAttribute", function () {
		expect(App.Models.Repository.prototype.idAttribute).toBe("full_name");
	});
});