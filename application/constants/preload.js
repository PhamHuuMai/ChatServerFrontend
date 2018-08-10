
var queue = new createjs.LoadQueue();
var i =1; 
queue.installPlugin(createjs.Sound);
queue.on("complete", handleComplete, this);
queue.on("progress", function(event){
    console.log((queue.progress*100|0) + " % Loaded");
}, this);
queue.loadManifest([
    {id: "myImage3", src:"js/index.js"},
    {id: "myImage4", src:"js/controller/LeftBarController.js"},
    {id: "myImage1", src:"js/controller/ContentController.js"}
]);
queue.load();
function handleComplete() {
    console.log("==============================================================================");
}