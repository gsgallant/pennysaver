//Custom JS

var userName ="";
var requestedTimeFrame = 30;
var currentURL = window.location.origin;
//=================================================================================
//                          Click Listeners
//=================================================================================
$(document).ready(function() {

        $("#add").hide();
        $("#logout").hide();
        $(".dropdown-button").hide();
        $("#chartdiv3").hide();
        $("#chartdiv6").hide();
        $("#chartdiv9").hide();
        $("#chartdiv12").hide();
        $("#avgcost").hide();
        $("#costheader").hide();
//http://api.jqueryui.com/datepicker/#utility-formatDate//here for documentation
            $(function() {
                $( "#date" ).datepicker();
                $( "#format" ).change(function() {
                    $( "#date" ).datepicker( "option", "dateFormat", "yy-mm-dd-@00:00:00" );
                });
            });

        $("#login").click(function() {
            userName = $('.userinput').val();
            password = $('#password').val();
            console.log(password);

            $.post(currentURL + "/register", {
                userName: userName,
                password: password
            }).done(function(data) {
                
                if (data == true) {
                    Materialize.toast('Welcome Back, ' + userName + "!", 3000)
                    $("#login").hide();
                    $("#register").hide();
                    $("#add").show();
                    $("#logout").show();
                    $(".dropdown-button").show();
                    $("#avgcost").show();
                    $("#costheader").show();


                    $("#chartdiv3").show();
                    $("#chartdiv6").show();
                    $("#chartdiv9").show();
                    $("#chartdiv12").show();
                    
                    userDataRetrieve(requestedTimeFrame,userName);
                    
                    return false;
                
                } else {
                    Materialize.toast('User Name and Password Not Recognized!', 4000)
                    Materialize.toast('Try Again or Register!', 4000)
                }
            })
         
         return false;
         
         }); //end login click listener

        
        $("#register").click(function() {
            userName = $(".userinput").val();
            password = $("#password").val();

            $.post(currentURL + "/register", {
                userName : userName,
                password : password
            }).done(function(data) {
                if (data == false) {
                    
                    $("#login").hide();
                    $("#register").hide();
                    $("#add").show();
                    $("#view").show();
                    $("#logout").show();
                    $(".dropdown-button").show();
                    $("#avgcost").show();
                    
                    Materialize.toast('Thanks for Joining, ' + userName + "!", 3000)
                    
                    // console.log(userName);
                    // console.log(requestedTimeFrame);
                    
                    $("#chartdiv3").show();
                    $("#chartdiv6").show();
                    $("#chartdiv9").show();
                    $("#chartdiv12").show();
                    
                    userDataRetrieve(requestedTimeFrame,userName);
                    
                    // $('#modal1').openModal();
                    
                } else {
                    // TRUE
                    Materialize.toast('That User Name is NOT AVAILABLE!', 3000)
                }
            });
        });

        $("#add").click(function() {
            $('#modal1').openModal();
        });

        $(".modal-close").click(function() {
            Materialize.toast('Thanks!', 3000)
        });
        $("#logout").click(function() {
            userName="";
            password="";
            data = "";
            newInfo= "";
            $(".userinput").val('');
            $("#password").val('');
            $("#add").hide();
            $("#logout").hide();
            $(".dropdown-button").hide();
            $("#chartdiv3").hide();
            $("#chartdiv6").hide();
            $("#chartdiv9").hide();
            $("#chartdiv12").hide();
            $("#avgcost").hide();
            $("#costheader").hide();
            $("#login").show();
            $("#register").show();
        });

            $(document).on('click', '#dropdown2 li', function() {
           
             // var value = $(this).val();
             requestedTimeFrame = $(this).children().data('value');
             console.log(requestedTimeFrame);
             userDataRetrieve(requestedTimeFrame,userName)
        });

        $("#addinfo").click(function() {
            $('#modal1').closeModal();
            //regex to strip off potential illegal character esp. $
            var cleanCost = $("#cost").val().replace(/[\|&;\$%@"<>\(\)\+,]/g, "");
            
            // console.log(cleanCost);
            
            var newInfo = {

                "username": $(".userinput").val(),
                "password" : $("#password").val(),
                "restaurant": $("#restaurant").val(),
                "description": $("#description").val(),
                "whatmeal": $('input[name="group1"]:checked').val(),
                "cost": cleanCost,
                "date": $("#date").val()


            }


            $.post(currentURL + "/add", newInfo, function(data) {
                
                clearForm();
                
                userDataRetrieve(requestedTimeFrame,newInfo.username);

                return false;
            });

        }); //end of click
    }); //end of doc ready

function clearForm(){
    $("#restaurant").val('');
    $("#description").val('');
    $('input[name="group1"]:checked').prop( "checked", false );
    $("#cost").val('');
    $("#date").val('');
};
 
//Functions in this area
 //This function retrieves the data with a POST and then calls the refreshPage
 function userDataRetrieve(requestedTimeFrame,userName){   
            $.post(currentURL + "/userdata?time=" + requestedTimeFrame + "&userName=" + userName
            ).done(function(data) {
                refreshPage(requestedTimeFrame,userName,data);
                return false;
            }); //end of post   
        
        };


function refreshPage(time,userName,data){
                $("#costheader").html("Average cost per meal over "+requestedTimeFrame+" days");

                var AvgCost = data.oneUserData.avgCost[0]
                    if (AvgCost==null){
                     AvgCost =0 
                    }
                 $("#snackavgcost").html(AvgCost.toFixed(2));

                 AvgCost = data.oneUserData.avgCost[1]
                    if (AvgCost==null){
                     AvgCost =0 
                    }
                 $("#breakfastavgcost").html(AvgCost.toFixed(2));

                  AvgCost = data.oneUserData.avgCost[2]
                    if (AvgCost==null){
                     AvgCost =0 
                    }
                 $("#lunchavgcost").html(AvgCost.toFixed(2));

                  AvgCost = data.oneUserData.avgCost[3]
                    if (AvgCost==null){
                     AvgCost =0 
                    }
                 $("#dinneravgcost").html(AvgCost.toFixed(2));
                
                var userRestaurantChartArray = [];
                
                for (i = 0; i < data.oneUserData.userRestaurants.length; i++) {
                    userRestaurantChartArray.push({
                        "restaurant": data.oneUserData.userRestaurants[i],
                        "amount visited": data.oneUserData.userRestcount[i]
                    });
                }

                AmCharts.makeChart("chartdiv3", {
                    "type": "pie",
                    "angle": 12,
                    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
                    "depth3D": 15,
                    "titleField": "restaurant",
                    "valueField": "amount visited",
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "align": "center",
                        "markerType": "circle"
                    },
                    "titles": [],
                    "dataProvider": userRestaurantChartArray
                });
                AmCharts.makeChart("chartdiv9", {
                    "type": "serial",
                    "categoryField": "category",
                    "angle": 30,
                    "depth3D": 30,
                    "startDuration": 1,
                    "fontSize": 13,
                    "categoryAxis": {
                        "gridPosition": "start"
                    },
                    "trendLines": [],
                    "graphs": [{
                        "balloonText": "[[title]] of [[category]]:[[value]]",
                        "fillAlphas": 1,
                        "id": "AmGraph-1",
                        "title": "User",
                        "type": "column",
                        "valueField": "column-1"
                    }, {
                        "balloonText": "[[title]] of [[category]]:[[value]]",
                        "fillAlphas": 1,
                        "id": "AmGraph-2",
                        "title": "All Users",
                        "type": "column",
                        "valueField": "column-2"
                    }],
                    "guides": [],
                    "valueAxes": [{
                        "id": "ValueAxis-1",
                        "title": "Dollars"
                    }],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [{
                        "id": "Title-1",
                        "size": 15,
                        "text": "Total Meal Cost Over "+requestedTimeFrame+" Days"
                    }],
                    "dataProvider": [{
                        "category": "Snack",
                        "column-1": data.oneUserData.sumTotal[0],
                        "column-2": data.allUserData.sumTotal[0]
                    }, {
                        "category": "Breakfast",
                        "column-1": data.oneUserData.sumTotal[1],
                        "column-2": data.allUserData.sumTotal[1]
                    }, {
                        "category": "Lunch",
                        "column-1": data.oneUserData.sumTotal[2],
                        "column-2": data.allUserData.sumTotal[2]
                    }, {
                        "category": "Dinner",
                        "column-1": data.oneUserData.sumTotal[3],
                        "column-2": data.allUserData.sumTotal[3]
                    }]
                });


                var userRestaurantChartArray = [];
                for (i = 0; i < data.allUserData.allRestaurants.length; i++) {
                    userRestaurantChartArray.push({
                        "restaurant": data.allUserData.allRestaurants[i],
                        "amount visited": data.allUserData.allRestcount[i]
                    });
                }

                AmCharts.makeChart("chartdiv6", {
                    "type": "pie",
                    "angle": 12,
                    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
                    "depth3D": 15,
                    "titleField": "restaurant",
                    "valueField": "amount visited",
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "align": "center",
                        "markerType": "circle"
                    },
                    "titles": [],
                    "dataProvider": userRestaurantChartArray
                });
                // LINE GRAPH

                var oneAllCostB = [];
                //alert(data.oneUserData.dateArrays[1].length)
                var toggle = false;
                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){
                    toggle = false;
                    for(j=0;j<data.oneUserData.dateArrays[1].length;j++){
                        var test = moment(data.oneUserData.dateArrays[1][j]).clone().add(2,'hours');
                        var compDate = data.allUserData.dailyAvgDates[i];
                        //test.add(200325,'milliseconds');
                        if(Math.abs(test.diff(compDate)) < 77760000){
                            oneAllCostB.push(data.oneUserData.arrayMeals[1][j]);
                            toggle = true;
                            console.log(toggle);
                        }    
                        //console.log(Math.abs(test.diff(compDate)));
                    }
                    if(toggle == false){
                        oneAllCostB.push(0);
                    }
                    
                }
                console.log(oneAllCostB);
               //alert(moment(data.allUserData.dailyAvgDates[4]) + " " + moment(data.oneUserData.dateArrays[1][0]) + " " + moment(data.allUserData.dailyAvgDates[4]).isSame(moment(data.oneUserData.dateArrays[1][0])))
              // console.log(moment(data.allUserData.dailyAvgDates[4]).format("MM/DD/YY") + " " + moment(data.oneUserData.dateArrays[1][0]).format("MM/DD/YY") + " " + moment(data.allUserData.dailyAvgDates[4]).isSame(moment(data.oneUserData.dateArrays[1][0])))
                var oneAllCostL = [];
                //alert(data.oneUserData.dateArrays[1].length)
                var toggle = false;
                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){
                    toggle = false;
                    for(j=0;j<data.oneUserData.dateArrays[2].length;j++){
                        var test = moment(data.oneUserData.dateArrays[2][j]).clone().add(2,'hours');
                        var compDate = data.allUserData.dailyAvgDates[i];
                        //test.add(200325,'milliseconds');
                        if(Math.abs(test.diff(compDate)) < 77760000){
                            oneAllCostL.push(data.oneUserData.arrayMeals[2][j]);
                            toggle = true;
                            console.log(toggle);
                        }    
                        //console.log(Math.abs(test.diff(compDate)));
                    }
                    if(toggle == false){
                        oneAllCostL.push(0);
                    }
                    
                }
                console.log(oneAllCostL);

                var oneAllCostD = [];
                //alert(data.oneUserData.dateArrays[1].length)
                var toggle = false;
                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){
                    toggle = false;
                    for(j=0;j<data.oneUserData.dateArrays[3].length;j++){
                        var test = moment(data.oneUserData.dateArrays[3][j]).clone().add(2,'hours');
                        var compDate = data.allUserData.dailyAvgDates[i];
                        //test.add(200325,'milliseconds');
                        if(Math.abs(test.diff(compDate)) < 77760000){
                            oneAllCostD.push(data.oneUserData.arrayMeals[3][j]);
                            toggle = true;
                            console.log(toggle);
                        }    
                        //console.log(Math.abs(test.diff(compDate)));
                    }
                    if(toggle == false){
                        oneAllCostD.push(0);
                    }
                    
                }
                console.log(oneAllCostD);


                var oneAllCostO = [];
                //alert(data.oneUserData.dateArrays[1].length)
                var toggle = false;
                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){
                    toggle = false;
                    for(j=0;j<data.oneUserData.dateArrays[0].length;j++){
                        var test = moment(data.oneUserData.dateArrays[0][j]).clone().add(2,'hours');
                        var compDate = data.allUserData.dailyAvgDates[i];
                        //test.add(200325,'milliseconds');
                        if(Math.abs(test.diff(compDate)) < 77760000){
                            oneAllCostO.push(data.oneUserData.arrayMeals[0][j]);
                            toggle = true;
                            console.log(toggle);
                        }    
                        //console.log(Math.abs(test.diff(compDate)));
                    }
                    if(toggle == false){
                        oneAllCostO.push(0);
                    }
                    
                }
                console.log(oneAllCostO);
               
                //alert(oneAllCostO.length)
                var chartBuild = [];

                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){
                    chartBuild.push({
                        "date" : data.allUserData.dailyAvgDates[i],
                        "Dinner" : oneAllCostD[i],
                        "Breakfast" : oneAllCostB[i],
                        "Lunch" : oneAllCostL[i],
                        "Snack" : oneAllCostO[i]
                    });
                }
                //alert(oneAllCostO[1])
                //alert(oneAllCostB[3]);
                AmCharts.makeChart("chartdiv12", {
                    "type": "serial",
                    "categoryField": "date",
                    "dataDateFormat": "MM/DD/YY",
                    "categoryAxis": {
                        "parseDates": true,
                        "gridAlpha" : 0,                        
                    },
                    "chartCursor": {
                        "enabled": true,
                        "categoryBalloonDateFormat" : "MMM DD"
                        //"categoryBalloonEnabled" : false,
                        //"categoryBalloonAlpha" : 0
                    },
                    "chartScrollbar": {
                        "enabled": true
                    },         
                    "trendLines": [],
                    "graphs": [{
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-1",
                        "lineAlpha": 0,
                        "title": "Breakfast",
                        "valueField": "Breakfast"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-2",
                        "lineAlpha": 0,
                        "title": "Lunch",
                        "valueField": "Lunch"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-3",
                        "lineAlpha": 0,
                        "title": "Dinner",
                        "valueField": "Dinner"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-4",
                        "lineAlpha": 0,
                        "title": "Snack",
                        "valueField": "Snack"
                    }],
                    "guides": [],
                    "valueAxes": [{
                        "id": "ValueAxis-1",
                        "stackType": "regular",
                        "title": "Dollars"
                    }],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [{
                        "id": "Title-1",
                        "size": 15,
                        "text": "Your Meal Costs Over "+requestedTimeFrame+" Days"
                    }],
                    "dataProvider": chartBuild
                }); //end line graph

                var chartBuild = [];

                for(i=0;i<data.allUserData.dailyAvgDates.length;i++){

                    var B = data.allUserData.dailyAvgCost[1][i];
                    var L = data.allUserData.dailyAvgCost[2][i];
                    var D = data.allUserData.dailyAvgCost[3][i];
                    var O = data.allUserData.dailyAvgCost[0][i];

                    if(B == null){B = 0};
                    if(L == null){L = 0};
                    if(D == null){D = 0};
                    if(O == null){O = 0};


                    chartBuild.push({
                        "date" : data.allUserData.dailyAvgDates[i],
                        "Breakfast" : B,
                        "Lunch" : L,
                        "Dinner" : D,
                        "Snack" : O
                    });
                }
                //alert(oneAllCostO[1])
                //alert(oneAllCostB[3]);
                console.log(chartBuild[11].Breakfast);
                AmCharts.makeChart("chartdiv15", {
                    "type": "serial",
                    "categoryField": "date",
                    "dataDateFormat": "MM/DD/YY",
                    "categoryAxis": {
                        "parseDates": true,
                        "gridAlpha" : 0,                        
                    },
                    "chartCursor": {
                        "enabled": true,
                        "categoryBalloonDateFormat" : "MMM DD"
                        //"categoryBalloonEnabled" : false,
                        //"categoryBalloonAlpha" : 0
                    },
                    "chartScrollbar": {
                        "enabled": true
                    },         
                    "trendLines": [],
                    "graphs": [{
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-1",
                        "lineAlpha": 0,
                        "title": "Breakfast",
                        "valueField": "Breakfast"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-2",
                        "lineAlpha": 0,
                        "title": "Lunch",
                        "valueField": "Lunch"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-3",
                        "lineAlpha": 0,
                        "title": "Dinner",
                        "valueField": "Dinner"
                    }, {
                        "balloonText": "[[title]]:[[value]]",
                        "fillAlphas": 0.7,
                        "id": "AmGraph-4",
                        "lineAlpha": 0,
                        "title": "Snack",
                        "valueField": "Snack"
                    }],
                    "guides": [],
                    "valueAxes": [{
                        "id": "ValueAxis-1",
                        "stackType": "regular",
                        "title": "Dollars"
                    }],
                    "allLabels": [],
                    "balloon": {},
                    "legend": {
                        "enabled": true,
                        "useGraphSettings": true
                    },
                    "titles": [{
                        "id": "Title-1",
                        "size": 15,
                        "text": "All User Meal Costs Over "+requestedTimeFrame+" Days"
                    }],
                    "dataProvider": chartBuild
                }); //end line graph


       return false;    
}//end of refreshPage Function
//Allows <ENTER> key for userName input
$(function(){
    $('form').on('submit', function(e){
        e.preventDefault();
    });
});


$(document).keypress(function(e) {
    if(e.which == 13) {
        if($(".userinput").is(":focus") || $("#password").is(":focus")){
            if($(".userinput").val().length > 0){
                $("#login").trigger('click');
            } else {
                alert("Field must not be blank.");
            }
        }
    }
});