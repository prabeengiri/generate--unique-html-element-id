/**
 * jQuery  Unquie HTML Id Generator 0.1
 * 
 * CopyRight 2014 Prabin Giri
 *  
 * Download Source: 
 *   https://github.com/prabeengiri/generate--unique-html-element-id
 * Depends:
 *   jQuery.js
 * 
 * This javascript traverse all the anchor tag in the current page 
 * and based on the href value, it provides the Id to the element. 
 *
 * Result: 
 *  http://localhost/miconnect/a/b should generate a_b;
 * 	/miconnect/a/b should generate a_b;
 * 	/miconnect/current_url#overlay=a/b  should generate current_url_overlay_a_b
 * 	/miconnect/a/b?c=d&e=f should generate a_b_c_d_e_f;
 */
(function($) { 
  $(document).ready(function() {
    
    "use strict";
    
    $.HTML_ID =  function(element) { 
      this.idList = [];
      this.element  =  element;
      this.$id = this.element.attr('href');
      this.settings = $.Settings;  
    };

	  $.Settings = { 
    	// Patterns to be removed from the href string 
      replacementCriteria : [ 
      	"^\/",
        "http://www",
        "www",
        "javascript:;",
        "javascript:;",
      ],
  				             		 
    	replacingCharacter : "_",
    	specialCharacters : [
    	  '/',
    	  '@',
    	  '#',
    	  '=',
    	  '-',
    	  '\\?',// escape question mark
    	  '&&',
    	  '&',
    	  '\\.',// escape dot
  		 ],
  		 
  		 // This is used to replace the variable words or string 
  		 // with empty character // for eg // js and nojs
  		 variableStrings : [ 
  		  "js",
  		  "nojs",
  		 ],
  
       // if any element has parents as specified then avoid traversing
  		 parents : [
  		   '#parent',            
  		 ]
	  };
  
    $.HTML_ID.prototype = { 
      
      remove : function() { 
  			var matched =  false; 
  			for (var i in this.settings.replacementCriteria){
  				var regex =  new RegExp( this.settings.replacementCriteria[i] ); 
  				if (this.$id.match(regex)){ 
  					this.$id =  this.$id.split(regex)[1];
  					matched = true;
  					break; 
  				}
  			}
  			if (!matched) { 
    			console.log(this.element.href + ": pattern not matched");  
  			}
  			return this; 
  	  },
  	  
  	  removeSpecialCharacters: function() {
    	  for(var i in this.settings.specialCharacters ) { 
    	    var regex =  new RegExp(this.settings.specialCharacters[i],"g");
    	    this.$id = this.$id.replace(regex , this.settings.replacingCharacter); 
        }
    	// For method chaining
    	  return this;  
  	  },
  		
  	  removeVariableStrings: function(val) { 
  			 for(var i in this.settings.variableStrings ) { 
  				 var regex =  new RegExp(this.settings.variableStrings[i],"g"); 
  				 this.$id = this.$id.replace(regex , this.settings.replacingCharacter); 
  			 }
  			 return this; 
  		},
  		
  		push: function(val) { 
  		  // Once generated then push to array for future reference
  		  this.idList.push(this.id);
  		},
  		
  		ifAlreadyExists : function() { 
  		  for (var i in this.idList) {
  		    if (this.idList[i] == val) {
  		      return true;
  		    } 
  		  }
  		  return false; 
  		},
  		
  		/**
  		 * Generates random string based on the title and 
  		 * other attributes and parent nodeName
  		 */
  	  generateRandomString : function() { 
  			// "a_" is prefixed because parent and current node can have same id or class
  	    return "a_" + $(this.element).classOrIdOfClosestParent().replace(/\s/g, $.Settings.replacingCharacter);  
  	  },
  		
  	  // Create New Id
  		getNewId : function() { 
  		  if (this.$id.isEmpty()) { 
  		    this.$id = this.generateRandomString().toLowerCase(); 
  			}
  			if (this.ifAlreadyExists()) {
  					this.$id =  this.$id + this.generateRandomString().toLowerCase(); // creates user_login_#title_#parentNodeName if user_login already exists       
  			} 
  			this.$id.trim(); 
  			this.push(this.$id);
  				  
  			return this.$id; 
  		},
  		
  		generate: function() {
  		  return this.remove().removeSpecialCharacters().removeVariableStrings().getNewId();
  		}
    };
  
    // Attach this function to jQuery Object
  	$.fn.classOrIdOfClosestParent =  function() {  
  	  var closest_id = this.closest('ul,span,div,table').attr('id');
  		if (closest_id == undefined){ 
  		  closest_id = this.closest('ul,div,span,table,li,table,tr,td,th').attr('class'); 
  		}
  		return closest_id; 
  	},
		
		// Extending the default String Class 
  	String.prototype.trim = function() {
  			//trim underscore from front and last
  		var regex = new RegExp("^"+ $.Settings.replacingCharacter +"+|"+ $.Settings.replacingCharacter +"+$/g"); 
  		return this.replace(regex, ""); 
  	}; 
  
  	// Extending the default String Class
  	String.prototype.isEmpty =  function() { 
  		if (this.valueOf() == "") 
  			return true;
  		return false; 
  	};
		
  	// Iterate over all the anchor tags and apply the generator.
  	$('a')
  	  .filter(function(){ 
  	    return ($(this).attr('id') == undefined); 
  	  }).each(function(){
  	    var $htmlId =  new $.HTML_ID($(this)); 
  	    $(this).attr( 'id' , $htmlId.generate()); 
  	    return; 
  	  });
  }); // Close of Document Ready.
})(jQuery); 

