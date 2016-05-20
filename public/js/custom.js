//Custom JS

var userName ="";
var requestedTimeFrame = 30;
var currentURL = window.location.origin;

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

    

        

        $("#login").click(function() {
            userName = $('.userinput').val();

            $.post(currentURL + "/register", {
                userName: userName
            }).done(function(data) {
                if (data == true) {
                    Materialize.toast('Welcome Back!', 3000)
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



                } else {
                    Materialize.toast('User Name Not Recognized!', 4000)
                    Materialize.toast('Try Again or Register!', 4000)
                }
            })
         
         userDataRetrieve(requestedTimeFrame,userName);
         
         }); //end click

        
        //======================================================================
        


        //=========================================================================
        $("#register").click(function() {
            userName = $(".userinput").val();

            $.post(currentURL + "/register", {
                userName : userName
            }).done(function(data) {
                if (data == false) {
                    
                    $("#login").hide();
                    $("#register").hide();
                    $("#add").show();
                    $("#view").show();
                    $("#logout").show();
                    $(".dropdown-button").show();
                    
                    Materialize.toast('Thanks for Joining!', 3000)
                    
                    console.log(userName);
                    console.log(requestedTimeFrame);
                    
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
            data = "";
            newInfo= "";
            $(".userinput").val('');
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
             

             // console.log(value);


        

        });


        //CLICK FUNCTION FOR NEW MEAL INFO
        $("#addinfo").click(function() {
            $('#modal1').closeModal();
            
            var newInfo = {

                "username": $(".userinput").val(),
                "restaurant": $("#restaurant").val(),
                "description": $("#description").val(),
                "whatmeal": $('input[name="group1"]:checked').val(),
                "cost": $("#cost").val(),
                "date": $("#date").val()


            }


            $.post(currentURL + "/add", newInfo, function(data) {
                
                clearForm();
                
                userDataRetrieve(requestedTimeFrame,newInfo.username);

                return;
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
 //This function retrieves and then calls the RefreshPage
 function userDataRetrieve(requestedTimeFrame,userName){   
            $.post(currentURL + "/userdata?time=" + requestedTimeFrame + "&userName=" + userName
            ).done(function(data) {
                RefreshPage(requestedTimeFrame,userName,data);
                
            }); //end of post   
        };



function RefreshPage(time,userName,data){

                $("#snackavgcost").html(data.oneUserData.avgCost[0]);
                 $("#breakfastavgcost").html(data.oneUserData.avgCost[1]);
                  $("#lunchavgcost").html(data.oneUserData.avgCost[2]);
                   $("#dinneravgcost").html(data.oneUserData.avgCost[3]);

                
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
                        "Breakfast" : oneAllCostD[i],
                        "Lunch" : oneAllCostB[i],
                        "Dinner" : oneAllCostL[i],
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
                        "parseDates": true
                    },
                    "chartCursor": {
                        "enabled": true
                    },
                    "chartScrollbar": {
                        "enabled": true
                    },
                    "trendLines": [],
                    "graphs": [{
                        "bullet": "round",
                        "id": "AmGraph-1",
                        "title": "graph 1",
                        "valueField": "Breakfast"
                    }, {
                        "bullet": "square",
                        "id": "AmGraph-2",
                        "title": "graph 2",
                        "valueField": "Lunch"
                    }, {
                        "bullet": "triangleUp",
                        "id": "AmGraph-3",
                        "title": "graph 3",
                        "valueField": "Dinner"
                    }, {
                        "bullet": "triangleDown",
                        "id": "AmGraph-4",
                        "title": "graph 4",
                        "valueField": "Snack"
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
                        "text": "Meal Costs Over "+requestedTimeFrame+" Days"
                    }],
                    "dataProvider": chartBuild
                }); //end line graph
           
}//end of refreshPage Function
