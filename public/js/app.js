// getting unique object ID for just open that popup window
function getId(obj) {
//     // console.log(obj);
//     // get jobs object id
$("#note").empty();
    var id = $(obj).data("id");
//     // <form> id for trigger onclick event for single job
    var newId = "#popup" + $(obj).data("id");
    // console.log("get article data-id:", id);
    $.ajax({
    	method:"GET",
    	url:"/jobs/" + id
    })
    .done(function(data){
    	console.log("related job's note:", data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
}

// function getAllNote(obj) {
// 	 var id = $(obj).data("id");

// }



$(document).on("click", "#savenote", function(){

	var thisId = $(this).attr("data-id");
// function myFunc(id) {
	// console.log("jobid:" + id);
    $.ajax({
            method: "POST",
            url: "/jobs/" + thisId,
            data: {
                body: $("#bodyinput").val()
            }
        })
        //   // With that done
        .done(function(data) {
        	console.log("post new note:", data);        
            // $("#notes").append(data);
              $("#notes").empty("");
        });
        $("bodyinput").val();

});



$(document).on("click", "#scrape", function(e){
	e.preventDefault();
	$.ajax({
		method:"GET",
		url: "/scrape"
	}).done(function(data){
		setTimeout(function(){
			window.location.reload();
		},2000);
		getAllNote();
	});
})
	
