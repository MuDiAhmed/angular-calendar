/**
 * Created by mudi on 21/08/16.
 */
app.directive('calender',[function(){
    return {
        restrict: 'E',
        templateUrl: "partials/calenderTemplate.html",
        scope: {
            datesObject: "="
        },
        link: function(scope, element, attrs, form) {
            var today,
                thisYear,
                thisMonth,
                dayNumber,
                thisMonthLength = 31,
                prevMonthLength = 31,
                weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ],
                weekEnds = ['Fri','Sat'],
                storedMonth;
            scope.selectedDays = [];
            prevCalculations();
            buildThisScreen();
            function prevCalculations(month,year){
                thisMonthLength = 31;
                prevMonthLength = 31;
                var date = new Date();
                if(month&&year){
                    today = new Date(year+'-'+month+'-'+1);
                    if(date.getFullYear() == year && date.getMonth()+1 == month){
                        today = date;
                    }
                }else{
                    today = date;
                }
                thisYear = today.getFullYear();
                thisMonth = today.getMonth()+1;
                storedMonth = thisMonth;
                dayNumber = today.getDate();
                scope.thisMonth = thisMonth;
                scope.thisYear = thisYear;
                scope.month = monthNames[thisMonth-1];
                scope.dayNumber = dayNumber;
                scope.thisMonthDays = [];
                if([2,4,6,9,11].indexOf(storedMonth) != -1){
                    thisMonthLength = 30;
                }
                if([5,7,10,12].indexOf(storedMonth) != -1){
                    prevMonthLength = 30;
                }
                if(storedMonth == 3){
                    prevMonthLength = 29;
                }
            }
            function buildThisScreen(){
                var firstDayOfMonth = new Date(thisYear+'-'+storedMonth+'-'+1).toDateString();
                firstDayOfMonth = firstDayOfMonth.slice(0,firstDayOfMonth.indexOf(' '));
                var firstDayIndex = weekDays.indexOf(firstDayOfMonth),
                    firstDay = prevMonthLength-firstDayIndex+1,
                    firstWeek = true;
                for(var x=1; x<=35; x++){
                    var thisMonthCondition = true;
                    var todayCondition = false;
                    if((firstDay>prevMonthLength && firstWeek) || (!firstWeek && firstDay>thisMonthLength)){
                        firstDay=1
                    }
                    if(x>7){
                        firstWeek = false;
                    }
                    if((firstWeek&&firstDay>7)||(x>thisMonthLength&&firstDay<23)){
                        thisMonthCondition=false;
                        if(firstWeek){
                            thisMonth = storedMonth-1;
                        }else{
                            thisMonth = storedMonth+1;
                        }
                    }else{
                        thisMonth = storedMonth;
                    }
                    if(dayNumber == firstDay && thisMonthCondition){
                        todayCondition = true;
                    }
                    var dayName = new Date(thisYear+'-'+thisMonth+'-'+firstDay).toDateString();
                    dayName = dayName.slice(0,dayName.indexOf(' '));
                    var dayObject = {
                        number:firstDay,
                        thisMonth:thisMonthCondition,
                        today:todayCondition,
                        year:thisYear,
                        month:thisMonth,
                        todayName:dayName,
                        selected:false,
                        weekEnd:false
                    };
                    for(var index in scope.selectedDays){
                        if(daysAreSame(scope.selectedDays[index],dayObject)){
                            dayObject.selected = true;
                        }
                    }
                    if(weekEnds.indexOf(dayObject.todayName) != -1){
                        dayObject.weekEnd = true;
                    }
                    scope.thisMonthDays.push(dayObject);
                    firstDay++;
                }
            }
            scope.prevMonth = function(){
                var year = thisYear,
                    month = storedMonth-1;
                if(month==0){
                    month=12;
                    year--;
                }
                prevCalculations(month,year);
                buildThisScreen();
            };
            scope.nextMonth = function(){
                var year = thisYear,
                    month = storedMonth+1;
                if(month==13){
                    month=1;
                    year++;
                }

                prevCalculations(month,year);
                buildThisScreen();
            };
            scope.selectDays = function(day){
                day.selected = true;
                scope.selectedDays.push(day);
            };
            scope.removeSelection = function(day){
                day.selected = false;
                for(var index in scope.selectedDays){
                    if(daysAreSame(scope.selectedDays[index],day)){
                        scope.selectedDays.splice(index, 1);
                    }
                }
            }
            function daysAreSame(day1,day2){
                return day1.number == day2.number && day1.year == day2.year && day1.month == day2.month;
            }
            scope.makeRange = function(startDate,endDate){
                // var startDateArray = startDate.split('-'),
                //     endDateArray = endDate.split('-');
                // if(startDateArray.length == 3 && endDateArray.length == 3){
                //     scope.selectedDays = [];
                //     for(var x=startDateArray[1];x<=endDateArray[1];x++){
                //         for(var y=startDateArray[2];y<=endDateArray[2];y++){
                //             var date = new Date(startDateArray[0]+'-'+x+'-'+y);
                //             var dayName = date.toDateString();
                //             dayName = dayName.slice(0,dayName.indexOf(' '));
                //             var dayObject = {
                //                 number:y,
                //                 year:startDateArray[1],
                //                 month:x,
                //                 todayName:dayName,
                //                 selected:true,
                //                 weekEnd:(weekEnds.indexOf(dayName) != -1)
                //             };
                //             scope.selectedDays.push(dayObject);
                //         }
                //     }
                // }else{
                //     alert('Invalid Dates');
                // }
                startDate = parseInt(startDate);
                endDate = parseInt(endDate);
                if(Number.isInteger(startDate) && Number.isInteger(endDate) && startDate>0 && startDate<32 && endDate>0 && endDate<32 && startDate<endDate){
                    scope.selectedDays = [];
                    console.log(scope.thisMonthDays.length-startDate>=endDate);
                    console.log(scope.thisMonthDays.length-startDate,endDate);
                    var loopEnd = (scope.thisMonthDays.length-startDate>=endDate)?endDate:scope.thisMonthDays.length-startDate;
                    console.log(loopEnd);
                    for(var y=0;y<=scope.thisMonthDays.length-1;y++){
                        var date = scope.thisMonthDays[y];
                        date.selected = false;
                        if(date.number<startDate){
                            continue;
                        }
                        if(date.thisMonth&&(date.number<=endDate)){
                            date.selected = true;
                            scope.selectedDays.push(date);
                        }
                    }
                }else{
                    alert('Invalid Dates');
                }
            }
        }
    };    
}]);