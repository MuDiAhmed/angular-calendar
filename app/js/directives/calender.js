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
                if(month&&year){
                    today = new Date(month+'-1-'+year);
                    var date = new Date();
                    if(date.getFullYear() == year && date.getMonth()+1 == month){
                        today = new Date();
                    }
                }else{
                    today = new Date();
                }
                thisYear = today.getFullYear();
                thisMonth = today.getMonth()+1;
                storedMonth = thisMonth;
                dayNumber = today.getDate();
                scope.thisMonth = thisMonth;
                scope.thisYear = thisYear;
                scope.dayNumber = dayNumber;
                scope.month = monthNames[thisMonth-1];
                scope.thisMonthDays = [];
                if([2,4,6,9,11].indexOf(thisMonth) != -1){
                    thisMonthLength = 30;
                }
                if([3-5-7-10-12].indexOf(thisMonth) != -1){
                    prevMonthLength = 30;
                }
            }
            function buildThisScreen(){
                var firstDayOfMonth = new Date(thisMonth+'-1-'+thisYear).toDateString();
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
                            thisMonth--;
                        }else{
                            thisMonth = storedMonth+1;
                        }
                    }else{
                        thisMonth = storedMonth;
                    }
                    if(dayNumber == firstDay && thisMonthCondition){
                        todayCondition = true;
                    }
                    var dayName = new Date(thisMonth+'-'+firstDay+'-'+thisYear).toDateString();
                    dayName = dayName.slice(0,dayName.indexOf(' '));
                    scope.thisMonthDays.push({
                        number:firstDay,
                        thisMonth:thisMonthCondition,
                        today:todayCondition,
                        year:thisYear,
                        month:thisMonth,
                        todayName:dayName,
                        selected:false
                    });
                    firstDay++;
                }
            }
            scope.prevMonth = function(){
                var year = thisYear,
                    month = thisMonth-1;
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
                    month = thisMonth+1;
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
                scope.selectedDays.splice(scope.selectedDays.indexOf(day), 1);
            }
        }
    };    
}]);