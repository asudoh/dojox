define(function(){
	"use strict";

	return function(handles){
		return function () {
			for(var handle = null; (handle = handles.shift());){
				if(typeof handle.close === "function"){
					handle.close();
				}else if (typeof handle.remove === "function"){
					handle.remove();
				}else if (typeof handle.destroyRecursive === "function"){
					handle.destroyRecursive();
				}else if (typeof handle.destroy === "function"){
					handle.destroy();
				}else{
					throw new Error("Handle cannot be cleaned up.");
				}
			}
		};
	};
});
