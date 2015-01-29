define([
	"dojo/_base/config",
	"dojo/_base/lang",
	"dojo/has"
], function(config, lang, has){
	has.add("mvc-bindings-log-api", (config["mvc"] || {}).debugBindings);

	function isStateful(/*Object*/ o){
		return o && lang.isFunction(o.set) && lang.isFunction(o.watch);
	}

	function observe(/*dojo/Stateful*/ o, /*String*/ path, /*Function*/ callback){
		// summary:
		//		Watches an object path for changes
		// path:
		//		Indicates the object path to watch.
		// callback:
		//		The function to execute when the property changes.
		//		This will be called after one of the properties described in path has been changed.
		//		The callback will be called with the |this| set to the instance,
		//		the first argument as the new value, the second argument as the old value.
		// returns:
		//		An object handle for the watch. The unwatch method of this object
		//		can be used to discontinue watching this property:
		// |        var watchHandle = observe(obj, "foo.bar", callback);
		// |        watchHandle.unwatch(); // callback won't be called now

		var hWatch, hChild,
			comps = path.split("."),
			prop = comps[0],
			remainder = comps.slice(1).join(".");

		if(typeof o === "object"){
			if(isStateful(o)){
				hWatch = o.watch(prop, function(name, old, current){
					if(!remainder){
						callback.call(o, current, old);
					}else{
						var oldValue = lang.getObject(remainder, false, old),
							currentValue = lang.getObject(remainder, false, current);
						callback.call(o, currentValue, oldValue);
						if(hChild){
							hChild.remove();
						}
						hChild = observe(current, remainder, callback);
					}
				});
			}else if(has("mvc-bindings-log-api")){
				var desc = [o.canConvertToLoggable || !o.declaredClass ? o : o.declaredClass, prop].join(":");
				console.log(desc + " is not a stateful property. Observation for that property not happening.");
			}
			if(remainder){
				hChild = observe(o[prop], remainder, callback);
			}
		}else if(has("mvc-bindings-log-api")){
			console.log("Attempt to observe non-object " + o + " with " + path + ". Observation not happening.");
		}

		function remove(){
			if(hWatch){
				if(hWatch.remove){
					hWatch.remove();
				}else{
					hWatch.unwatch();
				}
			}
			if(hChild){
				hChild.remove();
			}
		}

		return {
			remove: remove,
			unwatch: remove
		};
	}

	return observe;
});
