// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs. 
// ================================================================================
var path = require('path');
var moment = require('moment');
moment().format();

var sequelTableModel = require("../model/food.js");
//notify the server administrator that the html route is connected
console.log("api-routes connected");

function bubbleSort(one, two){
	var length = one.length;
		for(i = 0; i<length; i++){  //bubblesorting algorithm
			for(j=0;j<(length-i-1);j++){
				if(one[j] < one[j+1]){
					var tmp1 = one[j];
					one[j] = one[j+1];
					one[j+1] = tmp1;

					var tmp2 = two[j];
					two[j] = two[j+1];
					two[j+1] = tmp2;
				}
			}
		}
	}




module.exports = function(app){

//middleware for getting all the data from mysql and using the sequel model.

// app.get('/',function (req, res, next) {
//   	sequelTableModel.findAll({
//   		attributes : ['id', 'username','restaurant','description','whatmeal','cost','date'] //
//   	})
//   	.then(function(foodtable){
		
// 		for (i=0;i<foodtable.length;i++){
// 			console.log(foodtable[i].dataValues.username+" "+foodtable[i].dataValues.cost);
// 		}
// 		res.json(foodtable);
// 	})
	
// });

app.post('/userdata',function (req, res, next) {

	sequelTableModel.findAll({
  		attributes : ['id', 'username','restaurant','description','whatmeal','cost','date'] //
  	})
  	.then(function(foodtable){
		
		
  		var sum = 0;
  		var sumB = 0;
  		var sumL = 0;
  		var sumD = 0;
  		var sumO = 0;

  		var B = [];
  		var L = [];
  		var D = [];
  		var O = [];

		var avgCostB = 0; //average cost of breakfasts
		var avgCostL = 0; //average cost of lunch
		var avgCostD = 0; //average cost of dinner
		var avgCostO = 0; //average cost of other

		var dateArrayB = [];
		var dateArrayL = [];
		var dateArrayD = [];
		var dateArrayO = [];
		var restCount = [];
		

		var timeSpan = req.query.time; //length of time data (in days)
		var user = req.query.userName;

		console.log("inside userdata route ... "+ timeSpan + " " + user);

		var now = moment(); //get the current date 
		var beginTime = now.clone().subtract(timeSpan, 'days'); //calculate the start of the data retraieval time period
		console.log(now.format("MM/DD/YY") + " " + beginTime.format("MM/DD/YY")); //output the current and begin dates

		visitedRestaurants = ["dummy"];
		for(i=0;i<=timeSpan;i++){
			restCount[i] = 0;
		}
		//console.log(restCount);
		//restCount = [0,0,0,0,0,0];
		C = 0;
		
		for (i=0;i<foodtable.length;i++){ //parse entire mysql foodtable
			
			var entryDate = moment(foodtable[i].dataValues.date);

			if(foodtable[i].dataValues.username == user){ //only continue if the data is for the current user
				
				if(entryDate.isBefore(now) && entryDate.isAfter(beginTime)){ //only take table entries within time frame specified
					sum += foodtable[i].dataValues.cost; //sum of all costs

					if(foodtable[i].dataValues.whatmeal == 1){   //whatmeal = 1 is breakfast
						sumB += foodtable[i].dataValues.cost; //sum of all breakfasts
						B.push(foodtable[i].dataValues.cost); //array of all breakfasts
						dateArrayB.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 2){ //whatmeal = 2 is lunch
						sumL += foodtable[i].dataValues.cost; //sum of all lunches
						L.push(foodtable[i].dataValues.cost); //array of all lunches
						dateArrayL.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 3){ //whatmeal = 3 is dinner
						sumD += foodtable[i].dataValues.cost; //sum of all dinners
						D.push(foodtable[i].dataValues.cost); //array of all dinners
						dateArrayD.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 0){ //whatmeal = 0 is other
						sumO += foodtable[i].dataValues.cost; //sum of all other meals
						O.push(foodtable[i].dataValues.cost); //array of all other meals
						dateArrayO.push(entryDate);
					}
				for(j=0;j<visitedRestaurants.length;j++){
					//console.log("2")
					if(foodtable[i].dataValues.restaurant == visitedRestaurants[j]){
						//console.log("3")
						C++;
						restCount[j]++;
						break;

					}
					
				}
				if(C == 0){
					//console.log("4")
					visitedRestaurants.push(foodtable[i].dataValues.restaurant);
					restCount[visitedRestaurants.length-1]++;
				}
					C=0;
				}
				
			}
		}

		avgCostB = sumB/B.length;
		avgCostL = sumL/L.length;
		avgCostD = sumD/D.length;
		avgCostO = sumO/O.length;

		

		var ind = visitedRestaurants.indexOf('dummy')
		if(ind >-1){
			visitedRestaurants.splice(ind,1);
		}


		for(i=0;i<timeSpan; i++){
			var ind2 = restCount.indexOf(0);
			if(ind2>-1){
				restCount.splice(ind2,1);
			}
		}

		console.log(visitedRestaurants);
		console.log(restCount);
		
		bubbleSort(restCount, visitedRestaurants);

		console.log(visitedRestaurants);
		console.log(restCount);
		
		//console.log(visitedRestaurants + " " + restCount);

		console.log("made it here");

		var userData = {
			avgCost : [avgCostO, avgCostB, avgCostL, avgCostD],
			sumTotal : [sumO, sumB, sumL, sumD],
			arrayMeals : [O, B, L, D],
			dateArrays : [dateArrayO,dateArrayB,dateArrayL,dateArrayD],
			userRestaurants : visitedRestaurants,
			userRestcount : restCount
			//userO : 1
		
		}

		
		
		res.json(userData);

	})
// 	var timeSpan = req.query.time; //length of time data (in days)
// 		var user = req.query.username;
// var now = moment(); //get the current date 
// 		var beginTime = now.clone().subtract(timeSpan, 'days'); //calculate the start of the data retraieval time period
// 		console.log(now.format("MM/DD/YY") + " " + beginTime.format("MM/DD/YY")); //output the current and begin dates
		
// 		console.log(timeSpan + " " + user);
	// sequelTableModel.findAll(
 //  		{
 //  			where : {
 //  				username: user,
 //  				date: { 
 //  					$gt: beginTime
 //  				}
 //  			},
 //  			attributes : ['id', 'username','restaurant','description','whatmeal','cost','date']
 //  		})
//   		.then(function(foodtable2){
  			

		
//   			var output = foodtable2;
//   			var userData2 = output;
//   			res.json(userData2);
//   		})

});


//This code will check if there is a new user registering with a username that is not yet
//in the database and if so, it will start a new username otherwise return an message
//that the username is already taken.  It needs to be changed to POST.
//pass in the query with ?username='NEWUSER' where NEWUSER is the name of the new person
//registering.   If true come back then the username already exists otherwise false comes back
//signifying that the username can be used.  The table is NOT changed at this point but the new user
//is allowed to input a meal.
//=================================
app.post('/register',function (req, res) {
	// console.log("Inside register route");
  	sequelTableModel.findAll({
  	})
  	.then(function(foodtable){
		// var newUser = req.query.username;
		// console.log(req);
		// console.log('req.body.userName',req.body.userName);
		var newUser = req.body.userName;
		// console.log('username='+newUser);
		var userexists = false;
		for (i=0;i<foodtable.length;i++){
			if(foodtable[i].dataValues.username==newUser){
				userexists = true;
			}
		}
		res.send(userexists);//returns true or false.  false means the user doesn't exist.
	})
	
});
//=============================
//This code will return a JSON with the aggregate data across all users and specified meal in
//the requested time frame in days.
//needs to be changed to POST.  example- http://localhost:8080/alluserdata?time=90
app.post('/alluserdata',function (req, res, next) {
	console.log('Inside alluserdata routes');
	sequelTableModel.findAll({
  		attributes : ['id', 'username','restaurant','description','whatmeal','cost','date'] //
  	})
  	.then(function(foodtable){
		
		
  		var sum = 0;
  		var sumB = 0;
  		var sumL = 0;
  		var sumD = 0;
  		var sumO = 0;

  		var B = [];
  		var L = [];
  		var D = [];
  		var O = [];

		var avgCostB = 0; //average cost of breakfasts
		var avgCostL = 0; //average cost of lunch
		var avgCostD = 0; //average cost of dinner
		var avgCostO = 0; //average cost of other

		var dateArrayB = [];
		var dateArrayL = [];
		var dateArrayD = [];
		var dateArrayO = [];


		var timeSpan = req.query.time; //length of time data (in days)

		console.log(timeSpan);

		var now = moment(); //get the current date 
		var beginTime = now.clone().subtract(timeSpan, 'days'); //calculate the start of the data retraieval time period
		console.log(now.format("MM/DD/YY") + " " + beginTime.format("MM/DD/YY")); //output the current and begin dates
		C =0;
		restCount = [];
		visitedRestaurants = ["dummy"];
		for(i=0;i<=timeSpan;i++){
			restCount[i] = 0;
		}

		for (i=0;i<foodtable.length;i++){ //parse entire mysql foodtable
			
			var entryDate = moment(foodtable[i].dataValues.date);

				
				if(entryDate.isBefore(now) && entryDate.isAfter(beginTime)){ //only take table entries within time frame specified
					sum += foodtable[i].dataValues.cost; //sum of all costs

					if(foodtable[i].dataValues.whatmeal == 1){   //whatmeal = 1 is breakfast
						sumB += foodtable[i].dataValues.cost; //sum of all breakfasts
						B.push(foodtable[i].dataValues.cost); //array of all breakfasts
						dateArrayB.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 2){ //whatmeal = 2 is lunch
						sumL += foodtable[i].dataValues.cost; //sum of all lunches
						L.push(foodtable[i].dataValues.cost); //array of all lunches
						dateArrayL.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 3){ //whatmeal = 3 is dinner
						sumD += foodtable[i].dataValues.cost; //sum of all dinners
						D.push(foodtable[i].dataValues.cost); //array of all dinners
						dateArrayD.push(entryDate);
					}
					else if(foodtable[i].dataValues.whatmeal == 0){ //whatmeal = 0 is other
						sumO += foodtable[i].dataValues.cost; //sum of all other meals
						O.push(foodtable[i].dataValues.cost); //array of all other meals
						dateArrayO.push(entryDate);
					}
				
					for(j=0;j<visitedRestaurants.length;j++){
					//console.log("2")
					if(foodtable[i].dataValues.restaurant == visitedRestaurants[j]){
						//console.log("3")
						C++;
						restCount[j]++;
						break;

					}
					
				}
				if(C == 0){
					//console.log("4")
					visitedRestaurants.push(foodtable[i].dataValues.restaurant);
					restCount[visitedRestaurants.length-1]++;
				}
					C=0;
				}
			// }
		}
		
		var ind = visitedRestaurants.indexOf('dummy')
		if(ind >-1){
			visitedRestaurants.splice(ind,1);
		}


		for(i=0;i<timeSpan; i++){
			var ind2 = restCount.indexOf(0);
			if(ind2>-1){
				restCount.splice(ind2,1);
			}
		}

		console.log(visitedRestaurants);
		console.log(restCount);
		
		bubbleSort(restCount, visitedRestaurants);

		console.log(visitedRestaurants);
		console.log(restCount);

		avgCostB = sumB/B.length;

		avgCostL = sumL/L.length;
		avgCostD = sumD/D.length;
		avgCostO = sumO/O.length;

		datesInTimeSpanB = [];
		datesInTimeSpanL = [];
		datesInTimeSpanD = [];
		datesInTimeSpanO = [];

		dailyAvgB = [];
		dailyAvgL = [];
		dailyAvgD = [];
		dailyAvgO = [];

		//console.log(dateArrayB);
		for(i=0; i<timeSpan;i++){

			testDate = beginTime.clone().add(i,'days');
			
			var count = 0;
			var total = 0;
			for(j=0; j<dateArrayB.length;j++){

				var compare = dateArrayB[j].clone().add(4, 'hours')

				if(compare.isSame(testDate, 'day')){
					count ++;
					total += B[j];
				}
				//console.log("difference " + dateArrayB[j].diff(testDate) );
				//console.log("difference2 " + testDate.diff(dateArrayB[j]));
				//console.log("date " + dateArrayB[j].format("MM/DD/YY"));
				//console.log(dateArrayB[j].isSame(testDate, 'day'))
				//console.log("test date " + testDate.format("MM/DD/YY"));
				//console.log("current " + dateArrayB[j].format("MM/DD/YY"));	
			}

			//console.log("total " + total);
			//console.log("count " + count);
			dailyAvgB[i] = (total/count);
			datesInTimeSpanB[i] = (testDate.format("MM/DD/YY"));
			//console.log("in array " + testDate.format("MM/DD/YY"));
			//console.log("========================");

		}
		//console.log(dailyAvgB);
		//console.log(datesInTimeSpanB);

		for(i=0; i<timeSpan;i++){

			testDate = beginTime.clone().add(i,'days');
			var count = 0;
			var total = 0;
			for(j=0; j<dateArrayL.length;j++){

				var compare = dateArrayL[j].clone().add(4,'hours')
				if(compare.isSame(testDate, 'day')){
					count ++;
					total += L[j];
				}				
			}
			dailyAvgL.push(total/count);
			datesInTimeSpanL.push(testDate.format("MM/DD/YY"));
		}
		//console.log(dailyAvgL);
		//console.log(datesInTimeSpanL);

		for(i=0; i<timeSpan;i++){

			testDate = beginTime.clone().add(i,'days');
			var count = 0;
			var total = 0;
			for(j=0; j<dateArrayD.length;j++){
				var compare = dateArrayD[j].clone().add(4,'hours')
				if(compare.isSame(testDate, 'day')){
					count ++;
					total += D[j];
				}				
			}
			dailyAvgD.push(total/count);
			datesInTimeSpanD.push(testDate.format("MM/DD/YY"));
		}
		//console.log(dailyAvgD);
		//console.log(datesInTimeSpanD);

		for(i=0; i<timeSpan;i++){

			testDate = beginTime.clone().add(i,'days');
			var count = 0;
			var total = 0;
			for(j=0; j<dateArrayO.length;j++){
				var compare = dateArrayO[j].clone().add(4,'hours')
				if(compare.isSame(testDate, 'day')){
					count ++;
					total += O[j];
				}				
			}
			dailyAvgO.push(total/count);
			datesInTimeSpanO.push(testDate.format("MM/DD/YY"));
		}
		//console.log(dailyAvgO);
		//console.log(datesInTimeSpanO);


		var aggregateData = {
			avgCost : [avgCostO, avgCostB, avgCostL, avgCostD],
			sumTotal : [sumO, sumB, sumL, sumD],
			arrayMeals : [O, B, L, D],
			dateArrays : [dateArrayO,dateArrayB,dateArrayL,dateArrayD],
			dailyAvgCost : [dailyAvgO, dailyAvgB, dailyAvgL, dailyAvgD],
			dailyAvgDates : datesInTimeSpanO,
			allRestaurants : visitedRestaurants,
			allRestcount : restCount
		}
		
		//console.log(sum + ' ' + avgCostB + ' ' + avgCostL + ' ' + avgCostD + ' ' + avgCostO);
		//console.log(B + ' ' + L + ' ' + D + ' ' + O)
		
		res.json(aggregateData);

	})

});

app.post('/add',function (req, res, next) {
	
	foodTableModel.create(req)
	.then(function(){
		res.send(true);
	})

  });

}
