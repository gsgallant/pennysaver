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
                AmCharts.makeChart("chartdiv12", {
                    "type": "serial",
                    "categoryField": "date",
                    "dataDateFormat": "YYYY-MM-DD",
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
                        "valueField": "column-1"
                    }, {
                        "bullet": "square",
                        "id": "AmGraph-2",
                        "title": "graph 2",
                        "valueField": "column-2"
                    }, {
                        "bullet": "triangleUp",
                        "id": "AmGraph-3",
                        "title": "graph 3",
                        "valueField": "column-3"
                    }, {
                        "bullet": "triangleDown",
                        "id": "AmGraph-4",
                        "title": "graph 4",
                        "valueField": "column-4"
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
                    "dataProvider": [{
                        "date": "2014-03-01",
                        "column-1": 8,
                        "column-2": 5,
                        "column-3": 43,
                        "column-4": 8
                    }, {
                        "date": "2014-03-02",
                        "column-1": 6,
                        "column-2": 7,
                        "column-3": 80,
                        "column-4": 100
                    }, {
                        "date": "2014-03-03",
                        "column-1": 2,
                        "column-2": 3,
                        "column-3": 57,
                        "column-4": 41
                    }, {
                        "date": "2014-03-04",
                        "column-1": 1,
                        "column-2": 3,
                        "column-3": 27,
                        "column-4": 55
                    }, {
                        "date": "2014-03-05",
                        "column-1": 2,
                        "column-2": 1,
                        "column-3": 30,
                        "column-4": 66
                    }, {
                        "date": "2014-03-06",
                        "column-1": 3,
                        "column-2": 2,
                        "column-3": 52,
                        "column-4": 98
                    }, {
                        "date": "2014-03-07",
                        "column-1": 6,
                        "column-2": 8,
                        "column-3": 90,
                        "column-4": 46
                    }]
                }); //end line graph
           
}//end of refreshPage Function
