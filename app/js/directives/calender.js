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
                console.log('stored month',storedMonth);
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
                        console.log('not this month');
                        thisMonthCondition=false;
                        if(firstWeek){
                            thisMonth = storedMonth-1;
                        }else{
                            thisMonth = storedMonth+1;
                        }
                        console.log('this month equal ',thisMonth);
                    }else{
                        thisMonth = storedMonth;
                    }
                    if(dayNumber == firstDay && thisMonthCondition){
                        todayCondition = true;
                    }
                    var dayName = new Date(thisYear+'-'+thisMonth+'-'+firstDay).toDateString();
                    // console.log(dayName);
                    dayName = dayName.slice(0,dayName.indexOf(' '));
                    // console.log(dayName);
                    var dayObject = {
                        number:firstDay,
                        thisMonth:thisMonthCondition,
                        today:todayCondition,
                        year:thisYear,
                        month:thisMonth,
                        todayName:dayName,
                        selected:false
                    };
                    for(var index in scope.selectedDays){
                        console.log(scope.selectedDays[index].number != dayObject.number || scope.selectedDays[index].year != dayObject.year || scope.selectedDays[index].month != dayObject.month);
                        if(scope.selectedDays[index].number == dayObject.number && scope.selectedDays[index].year == dayObject.year && scope.selectedDays[index].month == dayObject.month){
                            dayObject.selected = true;
                        }
                    }
                    scope.thisMonthDays.push(dayObject);
                    firstDay++;
                }
            }
            scope.prevMonth = function(){
                var year = thisYear,
                    month = storedMonth-1;
                console.log('month',month,'thismonth',thisMonth);
                if(month==0){
                    month=12;
                    year--;
                }
                prevCalculations(month,year);
                buildThisScreen();
            };
            scope.nextMonth = function(){
                console.log('next');
                var year = thisYear,
                    month = storedMonth+1;
                console.log(month);
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
                console.log(scope.selectedDays);
            };
            scope.removeSelection = function(day){
                day.selected = false;
                for(var index in scope.selectedDays){
                    if(scope.selectedDays[index].number == day.number && scope.selectedDays[index].year == day.year && scope.selectedDays[index].month == day.month){
                        scope.selectedDays.splice(index, 1);
                    }
                }

            }
        }
    };    
}]);