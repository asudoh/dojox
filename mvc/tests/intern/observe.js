define([
	"intern!bdd",
	"intern/chai!expect",
	"dojo/Deferred",
	"dojo/Stateful",
	"dojox/mvc/observe",
	"./handleCleaner"
], function(bdd, expect, Deferred, Stateful, observe, handleCleaner){
	"use strict";

	// For supporting Intern"s true/false check
	/*jshint -W030*/
	bdd.describe("Test dojox/mvc/observe", function(){
		var handles = [];
		bdd.afterEach(handleCleaner(handles));

		bdd.it("Simple observation", function(){
			var dfd = this.async(1000),
				stateful = new Stateful({foo: "Foo0"});
			(function(){
				var dfd = new Deferred();
				try{
					var count = 0;
					handles.push(observe(stateful, "foo", function(){
						if(count++ > 0){
							dfd.reject(new Error("This callback should no longer be used."));
						}
						dfd.resolve([].slice.call(arguments));
					}));
					stateful.set("foo", "Foo1");
				}catch(e){
					dfd.reject(e);
				}
				return dfd;
			})().then(function(data){
				expect(data[0]).to.equal("Foo1");
				expect(data[1]).to.equal("Foo0");
			}).then(dfd.resolve.bind(dfd), dfd.reject.bind(dfd));
		});
	});
});
