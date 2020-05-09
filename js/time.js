(function () {
    var self = this;
    var $ele = $(this);

    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            console.log(strs)
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    var a = GetRequest();
    var select = a['select'];
    var nowDate = a['nowDate'];
    var role = a['role'] || 0;
    var success = a['success'];
    var nstr = new Date(); //当前Date资讯
    var ynow = nstr.getFullYear(); //年份
    var mnow = nstr.getMonth(); //月份
    var dnow = nstr.getDate(); //今日日期
    var n = new Date().getTime();
    var reserve; //预约预留天数
    var List = [];
    var daysOfMonth = [];
    // var list = [];
    var daysOfMonth = []; //从当前系统日期开始到预留日期
    var stateList = [];
    var appointmentQCode; //企业机构编码
    if (role == 1) {
        $('#button-click').remove();
    }
    self.isLeap = function (year) {
        return (year % 100 == 0 ? res = (year % 400 == 0 ? 1 : 0) : res = (year % 4 == 0 ? 1 : 0));
    }

    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };
    // 时间

    function toLongDate(m) {
        var date = new Date(m);
        return date.getFullYear() + "-" + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    }
     date();
    function date() {
        var str = "<div class='date-picker'><div class='wrapper'>";
        var m_days = new Array(31, 28 + self.isLeap(ynow), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //各月份的总天数
        for (var j = 0; j < reserve; j++) {
            var date = toLongDate(new Date(nowDate).getTime() + 24 * 60 * 60 * 1000 * (j));
            console.log(date,'date')
            daysOfMonth.push({
                date: date,
                state: 1,
                appointmentState: true
            });
        }
        var restList = [
            "2020-05-01", "2020-05-02", "2020-05-03", "2020-05-04", "2020-05-05", "2020-05-10", "2020-05-16", "2020-05-17", "2020-05-23", "2020-05-24", "2020-05-30", "2020-05-31",
            "2020-06-06", "2020-06-07", "2020-06-13", "2020-06-14", "2020-06-20", "2020-06-21", "2020-06-25", "2020-06-26", "2020-06-27",
            "2020-07-04", "2020-07-05", "2020-07-11", "2020-07-12", "2020-07-18", "2020-07-19", "2020-07-25", "2020-07-26",
            "2020-08-01", "2020-08-02", "2020-08-08", "2020-08-09", "2020-08-15", "2020-08-16", "2020-08-22", "2020-08-23", "2020-08-29", "2020-08-30",
            "2020-09-05", "2020-09-06", "2020-09-12", "2020-09-13", "2020-09-19", "2020-09-20", "2020-09-26",
            "2020-10-01", "2020-10-02", "2020-10-03", "2020-10-04", "2020-10-05", "2020-10-06", "2020-10-07", "2020-10-08", "2020-10-11", "2020-10-17", "2020-10-18", "2020-10-24", "2020-10-25", "2020-10-31",
            "2020-11-01", "2020-11-07", "2020-11-08", "2020-11-14", "2020-11-15", "2020-11-21", "2020-11-22", "2020-11-28", "2020-11-29",
            "2020-12-05", "2020-12-06", "2020-12-12", "2020-12-13", "2020-12-19", "2020-12-20", "2020-12-26", "2020-12-27"
        ]
        for (var w = 0; w < daysOfMonth.length; w++) {
            for (var k = 0; k <= restList.length; k++) {
                if (daysOfMonth[w].date == restList[k]) {
                    daysOfMonth[w].appointmentState = false;

                }
            }
        }
        for (var g = 0; g < daysOfMonth.length; g++) {

            for (var t = 0; t < List.length; t++) {
                if (daysOfMonth[g].date == List[t].triggerDay && List[t].number <= 0) {
                    daysOfMonth[g].state = 2
                }
            }
        }
        console.log(daysOfMonth,'daysOfMonth')
        for (var m = 0; m < daysOfMonth.length; m++) {
            default_time = daysOfMonth[m].date.split('-')[2];
            // default_day="周"+daysOfMonth[m].date.getDay();
            if (daysOfMonth[m].appointmentState == false) {
                str += "<div class='border-bg-appointmentNo text-color-appointmentNo timebtn' data-date=" + daysOfMonth[m].date + " data-state=" + daysOfMonth[m].state + " data-appointmentState=" + daysOfMonth[m].appointmentState + "><div class='p-1'><div>" +default_time + "</div><div>不可约</div></div></div>"
            } else if (daysOfMonth[m].state == 2) {
                str += "<div class='border-bg-full text-color-full timebtn' data-date=" + daysOfMonth[m].date + " data-state=" + daysOfMonth[m].state + " data-appointmentState=" + daysOfMonth[m].appointmentState + "><div class='p-1'><div>" + default_time + "</div><div>已约满</div></div></div>"
            } else {
                str += "<div class='border-bg-reducible text-color-empty timebtn' data-date=" + daysOfMonth[m].date + " data-state=" + daysOfMonth[m].state + " data-appointmentState=" + daysOfMonth[m].appointmentState + "><div class='p-1'><div>" + default_time + "</div><div>可预约</div></div></div>"
            }
        }
        str += "</div></div><div class='img-padding'><div class='text-center '><img src='../image/date.png' class='w-50'></div><div class='time'>日历</div></div>";
        $('#timeList').html(str);
    }
    choose();

    function choose() {
        if(role==0){
            var type=0
        }else if(role==1){
            var type=1
        }
        $.ajax({
            url: "http://192.168.0.102:8080/AppointmentController/selectNum",
            dataType: "json",
            data: {
                date: nowDate,
                type: type
            },
            success: function (res) {
                List = res.list
                reserve=res.appointmentDateNum;
                console.log(List, 'list')
                date();
            },
        });
    }
    // 调取预留天数

    setTime();
    function setTime() {
        $.ajax({
            url: "http://192.168.0.102:8080/AppointmentController/selectAppointmentNum",
            dataType: "json",
            success: function (res) {
                appointmentQCode = res[0].appointmentQCode;
            }

        });
    }

    function load() {
        var str = '<div></div>';
        for (var i = 0; i < list.length; i++) {
            if(role==0){
                list[i].peopleNum <= 0&&list[i].peopleNum!=null ? str += "<div class='date-picker time-border' data-start=" + list[i].id + " data-state=" + list[i].peopleNum + "><div class='timer' ><div class='time-container'><div class='text-time-start'>" + list[i].APPOINTMENT_DATE_BEG + "</div><div class='line'></div><div class='text-time-end'>" + list[i].APPOINTMENT_DATE_END + "</div></div><div class='time-container'><div class='surplus-text'>剩余<span class='surplusCount'>" + (list[i].peopleNum > 0 ? list[i].peopleNum :list[i].peopleNum!=null? 0:list[i].APPOINTMENT_PEOPLE) + "</span>位</div><div class='text-color-full state'>已满</div></div></div></div>" : str += "<div class='date-picker time-border'  data-start=" + list[i].id + " data-state=" + list[i].APPOINTMENT_PEOPLE + "><div class='timer'><div class='time-container'><div class='text-time-start'>" + list[i].APPOINTMENT_DATE_BEG + "</div><div class='line'></div><div class='text-time-end'>" + list[i].APPOINTMENT_DATE_END + "</div></div><div class='time-container'><div class='surplus-text'>剩余<span class='surplusCount'>" + (list[i].peopleNum > 0 ? list[i].peopleNum : list[i].peopleNum!=null? 0:list[i].APPOINTMENT_PEOPLE) + "</span>位</div><div class='text-color-empty state'>可约</div></div></div></div>"
            }else if(role==1){
                list[i].peopleNum <= 0&&list[i].peopleNum==null&&(list[i].APPOINTMENT_Q_NUM==''||list[i].APPOINTMENT_Q_NUM==null) ? str += "<div class='date-picker time-border' data-start=" + list[i].id + " data-state=" + list[i].peopleNum + "><div class='timer' ><div class='time-container'><div class='text-time-start'>" + list[i].APPOINTMENT_DATE_BEG + "</div><div class='line'></div><div class='text-time-end'>" + list[i].APPOINTMENT_DATE_END + "</div></div><div class='time-container'><div class='surplus-text'>剩余<span class='surplusCount'>" + (list[i].peopleNum > 0 ? list[i].peopleNum : list[i].peopleNum==null&&(list[i].APPOINTMENT_Q_NUM==''||list[i].APPOINTMENT_Q_NUM==null)? 0:list[i].APPOINTMENT_Q_NUM) + "</span>位</div><div class='text-color-full state'>已满</div></div></div></div>" : str += "<div class='date-picker time-border'  data-start=" + list[i].id + " data-state=" + list[i].APPOINTMENT_Q_NUM + "><div class='timer'><div class='time-container'><div class='text-time-start'>" + list[i].APPOINTMENT_DATE_BEG + "</div><div class='line'></div><div class='text-time-end'>" + list[i].APPOINTMENT_DATE_END + "</div></div><div class='time-container'><div class='surplus-text'>剩余<span class='surplusCount'>" + (list[i].peopleNum > 0 ? list[i].peopleNum : list[i].peopleNum==null&&(list[i].APPOINTMENT_Q_NUM==''||list[i].APPOINTMENT_Q_NUM==null)? 0:list[i].APPOINTMENT_Q_NUM) + "</span>位</div><div class='text-color-empty state'>可约</div></div></div></div>"
            }
        }
        $('#time').html(str);
    }
    require();
    function require(selectDate) {
        if(role==0){
            var type=0
        }else if(role==1){
            var type=1
        }
        $.ajax({
            url: "http://192.168.0.102:8080/AppointmentController/selectTimeNum",
            dataType: "json",
            data: {
                date: selectDate || select,
                type:type,
            },
            success: function (res) {
                console.log(res, 'yshuxin')
                list = res.list;
                load();
            },
        });
    }
    // 标题
    title();

    function title() {
        var y = select.split('-');
        $('#title').append("<span class='text'>" + y[0] + '年' + y[1] + '月</span>')
    }
    $(".button").on('click', function () {
        var str = "<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row   pt-4 code'><div class='show-text'>企业编码:</div><input type='text' placeholder='请输入企业编码' placeholder-style='font-size:12px;color:#666;' class=' border-0  ' id='firm'></div><div ><div class='show-button mt-4'>确认</div></div></div></div></div>";

        $('#show').append(str)
    })
    $("#show").on('click', '.show-button', function () {
        var number = $('#firm').val();
        console.log(number,appointmentQCode,'number')
        $('#show').children().remove();
        if (number==appointmentQCode) {
            var role = 1;
            window.location = 'choose.html?role=' + role + '&select=' + select + '&ifFirmAppoimtment=' + 1 +'&nowDate=' + nowDate+ '&success='+success+'';
        }else{
            $('#show').html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row p-2 title text-center'><div class='show-text text-center w-100'>该企业还未注册，请先注册再预约</div></div><div><div class='sure mt-4'>确认</div></div></div></div>")
        }
    })
    console.log(role,'role')
    $("#show").on('click', '.sure', function () {
        $('#show').children().remove();
    })
    $('#timeList').on("click", ".img-padding", function () {
        window.location = 'index.html?id='+success+'';
    })
    $('#timeList').on('click', '.timebtn', function () {
        var selectDate = $(this).data('date')
        var state = $(this).data('state')
        var appointmentState = $(this).data('appointmentstate');
            require(selectDate);
    })
    $('#time').on('click', '.time-border', function () {
        var appointmentNum = $(this).data('start')
        var state = $(this).data('state')
        if (state > 0) {
            window.location = 'login.html?role=' + role + '&select=' + select + '&appointmentNum=' + appointmentNum + '&ifFirmAppoimtment=' + role + '&nowDate=' + nowDate + '';
        }

    })

})()