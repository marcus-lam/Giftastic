var basketball = new Audio("assets/sounds/basketball.mp3");
basketball.loop = true;
basketball.play();

var shotCallers = ["Michael Jordan", "Kobe Bryant", "Allen Iverson", "Tracy Mcgrady", "Vince Carter"];

function renderButtons() {

	$("#ballerButtons").empty();

	for (var i = 0; i < shotCallers.length; i++) {
		var bButton = $("<button class = 'ballerButton'>");
		bButton.data("baller", shotCallers[i]).text(shotCallers[i]);
		$("#ballerButtons").append(bButton);
	}
};

renderButtons();

$("#addBaller").on("click", function() {
	var thisBaller = $("#baller-input").val().trim().toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
	})
	if (shotCallers.indexOf(thisBaller) === -1 && thisBaller != "") {
		shotCallers.push(thisBaller);
		renderButtons();
	}
	return false;
});

$("#ballerButtons").on("click", ".ballerButton", function() {

	$("#ballers div").remove();

	var baller = $(this).data("baller");
	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + baller + "&api_key=dc6zaTOxFJmzC&limit=10";

	$.ajax({url: queryURL, method: "GET"}).done(function(response) {
		var results = response.data;

		for (var i = 0; i < results.length; i++) {
			if (results[i].rating == "" || results[i].rating == "r") {
				console.log("Access Denied")
			} else {
				var ballerDiv = $("<div class = 'baller'>");
				var ballerRating = $("<p>").text("Rating: " + (results[i].rating).toUpperCase());

				var ballerImage = $("<img class = 'ballerImg'>");
				ballerImage.attr("src", results[i].images.fixed_height_still.url)
				.attr("data-state", "still")
				.data("still", results[i].images.fixed_height_still.url)
				.data("active", results[i].images.fixed_height.url);

				ballerDiv.append(ballerRating);
				ballerDiv.append(ballerImage);

				$("#ballers").append(ballerDiv);
			}
		}
	})
});

$("#ballers").on("click", ".ballerImg", function() {
	var state = $(this).attr("data-state");

	if (state == "still") {
		$(this).attr("src", $(this).data("active"));
		$(this).attr("data-state", "active");
	} else {
		$(this).attr("src", $(this).data("still"));
		$(this).attr("data-state", "still");
	}
});