### A wrapper around the Google Content Experiments API.

This depends on [jquery-cookie](https://github.com/carhartl/jquery-cookie). Needs to be update to use [js-cookie](https://github.com/js-cookie/js-cookie).  

**Usage:**  

	experiment.create({
	 	id: '[experiment id here]',
	 	variations: [
	 		function(){
	         // variation 1 or original
	         // this will often be an empty anonymous function
	 		},
	 		function(){
	 		  // variation 2
	 		},
	       function(){
	         // variations 3, etc, etc.
	       }
	 	]
	  });