
import Hashes from "jshashes";
const sha1 = new Hashes.SHA1().setUTF8(true);
const getStringByteLength = function(str) {
	var totalLength = 0;     
	var charCode;  
	for (var i = 0; i < str.length; i++) {  
		charCode = str.charCodeAt(i);  
		if (charCode < 0x007f)  {     
			totalLength++;     
		} else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
			totalLength += 2;     
		} else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
			totalLength += 3;   
		} else{  
			totalLength += 4;   
		}          
	}  
	return totalLength;   
}

const gitsha = function(content) {
	var header = "blob " + getStringByteLength(content) + "\0";
	var text = header + content;
	return sha1.hex(text);
}
