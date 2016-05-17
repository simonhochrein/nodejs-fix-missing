module.exports = function(){
	if(!process.argv[2]){
		console.error("Path Required!");
		return;
	}
	var fs = require("fs");
	var resolve = require("resolve");
	var currentPath = process.cwd();
	var currentFile = resolve.sync("./"+process.argv[2], { basedir: process.cwd() });;
	var file = fs.readFileSync(currentFile,'utf-8');
	var a = file.match(/require\(.*\)/g);
	a.forEach(function(val){
		val = val.replace(/require\([`"'](.*)[`"']\)/,"$1");
		if(val.indexOf("./")==-1){
			try{
				resolve.sync(val,{basedir: process.cwd()});
			}
			catch(e){
				var exec = require('child_process').exec,
				    child;
				  console.log("Installing Missing Module '"+val+"'")
				 child = exec('npm install '+val+' -S',
				 function (error, stdout, stderr) {
				     console.log(stdout);
				     console.log("\033[91m"+stderr+"\033[0m");
				     if (error !== null) {
				          console.log('exec error: ' + error);
				     }
				 });
			}
		}
	});
	process.on('exit', function(code) {
	  if(code == 0){
	  	console.log("\033[94m Analysis Complete!\033[0m");
	  } else {
	  	console.log("Exiting with code "+code);
	  }
	});
}
