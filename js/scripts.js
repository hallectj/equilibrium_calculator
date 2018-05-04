$(document).ready(function() {
  displayMeasurementsGUI();
  highlightOptions();
  $("#calcBtn").on("click", function(){
    clearErrors();
    calculateEquilibrium();
    explanationFunc();
  });
});

//GUI logic
function highlightOptions(){
  var massUnits = $("#units_mass"), distanceUnits = $("#units_distance");
}


function displayMeasurementsGUI() {
  var measurePara = $("#units_distance"), massPara = $("#units_mass");
  $(".measure").click(function(evt) {
    if (evt.target.id == "gram") {
      massPara.html("g");
      $("#gram").css("background-color", "yellow");
      $("#kilogram").css("background-color", "#ccc");
    } else if (evt.target.id == "kilogram") {
      massPara.html("kg");
      $("#kilogram").css("background-color", "yellow");
      $("#gram").css("background-color", "#ccc");
    } else if (evt.target.id == "meter") {
      measurePara.html("m");
      $("#meter").css("background-color", "yellow");
      $("#centimeter").css("background-color", "#ccc");
    } else if (evt.target.id == "centimeter") {
      measurePara.html("cm");
      $("#centimeter").css("background-color", "yellow");
      $("#meter").css("background-color", "#ccc");
    }
  });
}

function doesErrorExist(){
  if(($("#errorMeasurementDiv").hasClass("error")) || ($("#errorMassDiv").hasClass("error"))){
     return true;
  }
  return false;
}

function calculateEquilibrium(){
  wrongDataFunc();
  if(doesErrorExist()){return;}
  const gravity = 9.8, helium = 0.179, air = 1.29;
  var radius = $("#radiusTextBox").val(), mass = $("#massTextBox").val();
  var massUnits = $("#units_mass").text(), distanceUnits = $("#units_distance").text();
  var unitResults = "kilograms", explanation = "", massResults = "";
  var massNeeded = 1;
  
  //correct units for calculation, ie grams to kilograms and centimeters to meters.
  if(massUnits == "g"){
    mass = mass * 0.001;
    massNeeded = 1000;
    unitResults = "grams"
  }
  
  if(distanceUnits == "cm"){
    radius = radius * 0.01;
  }
  
  var balloonVolume = (4/3) * Math.PI * Math.pow(radius, 3);
  var buoyantForce = air * gravity * balloonVolume;
  var sumOfForces = buoyantForce - (helium * balloonVolume * gravity) - (mass * gravity);
  massNeeded = massNeeded * ((sumOfForces) / gravity)
  
  if(massNeeded > 10000 && massUnits == "g"){
    massNeeded = massNeeded / 1000;
    unitResults = "kilograms";
  }
  
  $("#resultDiv").html(massNeeded.toFixed(2) + " " + unitResults);
}

function clearErrors(){
  $("#errorMassDiv").addClass("hidden");
  $("#errorMeasurementDiv").addClass("hidden");
  $("#errorMassDiv").removeClass("error");
  $("#errorMeasurementDiv").removeClass("error");
}

function explanationFunc(){
  //remove hidden class
  var explanation = "";
  if(!doesErrorExist()){
    var value = $("#resultDiv").html();
    if(value.substr(0, 1) == "-"){
      explanation = "Since the value is negative, that means the bouyant force is weaker than \
the gravitational force and thus the balloon will not float to begin with. If you take more than " + value.substr(1, value.length) + " then \
away from the balloon it should float."
    }else{
      explanation = "If you add more than " + value + " to the balloon, then it will not float anymore. \
The force of gravity will win out.  If you add less then " + value + " then the bouyant force will win \
out and the balloon will rise. If you add about  " + value + " it will neither float or sink."
    }
    $("#explanationDiv").html(explanation);
  }
}

function wrongDataFunc(){
  var regex = /^([0-9]{0,})\.?([0-9]{1,})$/;
  if( ($("#units_mass").html() == "") || ($("#massTextBox").val() == "") || (!regex.test($("#massTextBox").val()))){
    $("#errorMassDiv").addClass("error");
    $("#errorMassDiv").removeClass("hidden");
  }
  
  if( ($("#units_distance").html() == "") || ($("#radiusTextBox").val() == "") || (!regex.test($("#radiusTextBox").val()))  ){
     $("#errorMeasurementDiv").addClass("error");
     $("#errorMeasurementDiv").removeClass("hidden");
  }
}