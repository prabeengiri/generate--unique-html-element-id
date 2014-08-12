/*
 * @author Prabeen Giri
 * @example: 
 * 		http://localhost/miconnect/a/b should generate a_b;
 * 		/miconnect/a/b should generate a_b;
 * 		/miconnect/current_url#overlay=a/b  should generate current_url_overlay_a_b
 * 		/miconnect/a/b?c=d&e=f should generate a_b_c_d_e_f;
 */
(function($){ 
	
   $(document).ready(function(){
	   
		$.HTML_ID =  function(element){ 
			this.idList = [];
			this.element  =  element;
			this.$id = this.element.attr('href');
			this.settings = $.Settings;  
			
		};
		$.Settings = { 
			 replacementCriteria : [ // patterns to be removed from the href string
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
				             		 
			 variableStrings : [ // this is used to replace the variable words or string with empty character // for eg// js and nojs
			  "js",
			  "nojs",
			 ],

             // if any element has parents as specified then avoid traversing
			 parents : [
			   '#toolbar',            
			 ]
				
		};
		
		$.HTML_ID.prototype = { 
			 
			remove : function(){ 
				var matched =  false; 
				 
				for (var i in this.settings.replacementCriteria){
					var regex =  new RegExp( this.settings.replacementCriteria[i] ); 
					if (this.$id.match(regex)){ 
						this.$id =  this.$id.split(regex)[1];
						matched = true;
						break; 
					}
				}
				if (!matched){ 
					console.log(this.element.href + ": pattern not matched");  
				 }
				return this; 
			 },
			 
			 removeSpecialCharacters: function(){
				  
				 for(var i in this.settings.specialCharacters ){ 
					 //console.log("special characters:" + this.href);
					 var regex =  new RegExp(this.settings.specialCharacters[i],"g");
					 this.$id = this.$id.replace(regex , this.settings.replacingCharacter); 
				 }
				 return this;// for method chaining  
				 
			 },
			 
			 removeVariableStrings: function(val){ 
				 
				 for(var i in this.settings.variableStrings ){ 
					 var regex =  new RegExp(this.settings.variableStrings[i],"g"); 
					 this.$id = this.$id.replace(regex , this.settings.replacingCharacter); 
				 }
				 return this; 
			 },
			 
			 push: function(val){ 
				 this.idList.push(this.id);// once generated then push to array for future reference
			 },
			 
			 ifAlreadyExists : function(){ 
				 for (var i in this.idList){
					 if (this.idList[i] == val) 
						 return true;  
				 }
				 return false; 
			 },
			 generateRandomString : function(){ // generates random string based on the title and other attributes and parent nodeName
				// "a_" is prefixed because parent and current node can have same id or class
				 return "a_" + $(this.element).classOrIdOfClosestParent().replace(/\s/g, $.Settings.replacingCharacter);  
			 },
			 
			 getNewId : function(){ 
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
			 generate: function(){
				  
				 return this.remove().removeSpecialCharacters().removeVariableStrings().getNewId();
			 }
		};
		
		$.fn.classOrIdOfClosestParent =  function(){ // attach this function to jQuery Object 
			 
			 var closest_id = this.closest('ul,span,div,table').attr('id');
		
			 if (closest_id == undefined){ 
				 closest_id = this.closest('ul,div,span,table,li,table,tr,td,th').attr('class'); 
			 }
			 return closest_id; 
		},
		
		// extending the default String Class 
		String.prototype.trim = function(){
			//trim underscore from front and last
			var regex = new RegExp("^"+ $.Settings.replacingCharacter +"+|"+ $.Settings.replacingCharacter +"+$/g"); 
			return this.replace(regex, ""); 
		}; 
		
		//extending the default String Class
		String.prototype.isEmpty =  function(){ 
			if (this.valueOf() == "") 
				return true;
			return false; 
		};
		
		$('a')
	     .filter(function(){ 
	    	return ($(this).attr('id') == undefined); 
	    	
	     }).each(function(){
	       var $htmlId =  new $.HTML_ID($(this)); 
	       //console.log("HREF : " + $(this).attr('href'));
		   //console.log("Final ID String:" +  $htmlId.generate( $(this) ));
	       $(this).attr( 'id' , $htmlId.generate()); 
		   return; 
	    });
   });
})(jQuery); 
