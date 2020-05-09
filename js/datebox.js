$.fn.datebox = function () {
    var config = {
        $valueEle: $("#outputTime"),
        $prev: $(".datetitle #up"),
        $next: $(".datetitle #down"),
        minDate: null,
        maxDate: null,
        count: null,
    }
    config = $.extend(config);

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
    var state; //预约状态
    var success = sessionStorage.getItem('id') || 0; //预约成功
    var appointmentNum = a['appointmentNum'];
    var time = a['appointmentTime'] || 0;
    var role=a['role'] ||0;
    var ifFirmAppoimtment=a['ifFirmAppoimtment']||0;
    var appointmentTime;
    if (time != 0) {
        appointmentTime = time.split(" ")[0];
    }
    var nameCode = a['nameCode'];
    var order = []; //当前页面所有日期的每天预约人数
    var appointment = [];

    var maxdate, mindate;
    var nstr = new Date(); //当前Date资讯
    var ynow = nstr.getFullYear(); //年份
    var mnow = nstr.getMonth(); //月份
    var dnow = nstr.getDate(); //今日日期
    var n = new Date().getTime();
    var reserve;
    var list = [];
    var daysOfMonth = [];
    var stateList = [];
    var nowDate;
    var appointmentState;
    if (!config.minDate) {
        mindate = nstr;
    } else {
        mindate = new Date(config.mindate)
    }

    if (!config.maxDate) {
        maxdate = new Date(reserve);
    } else {
        maxdate = new Date(config.maxDate)
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
    //如果最小时间大于等于当前时间，那么设置当前时间为最小时间

    console.log("最小日期是:", mindate.format("yyyy-MM-dd"))
    console.log("最大日期是:", maxdate.format("yyyy-MM-dd"))
    console.log("当前日期：", currentDate())

    // 获取标题
    title();

    function title() {
        $(".datetitle #title").html('<span>' + ynow + '年' + (mnow + 1) + '月</span>');
    }
    // 获取当前时间表
    function createMonthDay() {
        let days = [];
        let fullYear = new Date().getFullYear();
        let month = new Date(ynow, mnow + 1, 1, 0, 0).getMonth() || new Date().getMonth() + 1;;
        let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
        for (var i = 1; i <= lastDayOfMonth; i++) {
            var mi = fullYear + "-" + (month < 10 ? "0" + month : month) + "-" + (i < 10 ? "0" + i : i);
            if (mi == nstr.format("yyyy-MM-dd") || mi > nstr.format("yyyy-MM-dd")) {
                days.push(mi);
            }
        };
        for (var p = 0; p < days.length; p++) {
            if (days[p] <= reserve) {
                daysOfMonth.push({
                    date: days[p],
                    state: 1,
                    appointmentState: true
                })
            }
        }
        for (var u = 0; u < daysOfMonth.length; u++) {
            list.forEach((it, id) => {
                if ((daysOfMonth[u].date == list[id].triggerDay && list[id].number > 0)) {
                    daysOfMonth[u].state = 1
                } else if (daysOfMonth[u].date == list[id].triggerDay && list[id].number <= 0) {
                    daysOfMonth[u].state = 2
                }
            })
        }
        for (let i = 0; i < daysOfMonth.length; i++) {
            for (let j = i + 1; j < daysOfMonth.length; j++) {
                if (daysOfMonth[i].date == daysOfMonth[j].date) { //第一个等同于第二个，splice方法删除第二个
                    daysOfMonth.splice(j, 1);
                    j--;
                }
            }
        }
        holiday();
        pain();
        return daysOfMonth;
    }


    function setDate(y, m, d) {
        var current = (new Date(y, m, d, 10, 0, 0)).format("yyyy-MM-dd");
        config.$valueEle.val(current);
    }
    //调取预约表
    appointmentTable();
    function appointmentTable() {
        nowDate = new Date().format("yyyy-MM-dd");
        $.ajax({
            url: "http://192.168.0.102:8080/AppointmentController/selectNum",
            dataType: "json",
            data: {
                date: nowDate,
                type: '0'
            },
            success: function (res) {
                list = res.list
                var future = new Date().getTime() + (24 * 60 * 60 * 1000 * res.appointmentDateNum);
                reserve = new Date(future).format("yyyy-MM-dd")
                maxdate=new Date(reserve)
                createMonthDay();
            },
        });

    }

    function currentDate() {
        return (new Date(ynow, mnow, dnow, 10, 0, 0)).format("yyyy-MM-dd");
    }

    function holiday() {
        var restList = [
        "2020-05-01","2020-05-02","2020-05-03","2020-05-04","2020-05-05","2020-05-10","2020-05-16","2020-05-17","2020-05-23", "2020-05-24","2020-05-30","2020-05-31",
        "2020-06-06","2020-06-07","2020-06-13","2020-06-14","2020-06-20","2020-06-21","2020-06-25","2020-06-26","2020-06-27",
        "2020-07-04","2020-07-05","2020-07-11","2020-07-12","2020-07-18","2020-07-19","2020-07-25","2020-07-26",
        "2020-08-01","2020-08-02","2020-08-08","2020-08-09","2020-08-15","2020-08-16","2020-08-22","2020-08-23","2020-08-29","2020-08-30",
        "2020-09-05","2020-09-06","2020-09-12","2020-09-13","2020-09-19","2020-09-20","2020-09-26",
        "2020-10-01","2020-10-02","2020-10-03","2020-10-04","2020-10-05","2020-10-06","2020-10-07","2020-10-08","2020-10-11","2020-10-17","2020-10-18","2020-10-24","2020-10-25","2020-10-31",
        "2020-11-01","2020-11-07","2020-11-08","2020-11-14","2020-11-15","2020-11-21","2020-11-22","2020-11-28","2020-11-29",
        "2020-12-05","2020-12-06","2020-12-12","2020-12-13","2020-12-19","2020-12-20","2020-12-26","2020-12-27"
    ];
            for (var j = 0; j <daysOfMonth.length; j++) {
                for (var k = 0; k <= restList.length; k++) {
                    if (daysOfMonth[j].date == restList[k]) {
                        daysOfMonth[j].appointmentState = false;
                    }
                }
            }
        
    }
    // 获取表格
    // pain();
    function pain() {
        var n1str = new Date(ynow, mnow, 1); //当月第一天 
        var firstday = n1str.getDay(); //当月第一天星期几
        var m_days = new Array(31, 28 + self.isLeap(ynow), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //各月份的总天数
        var tr_str = Math.ceil((m_days[mnow] + firstday) / 7); //表格所需要行数
        //打印表格第一行（有星期标志）

        $("#datetb").remove();
        var str = "<table id='datetb' cellspacing='0'><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>";

        for (i = 0; i < tr_str; i++) { //表格的行
            str += "<tr>";
            for (k = 0; k < 7; k++) { //表格每行的单元格
                idx = i * 7 + k; //单元格自然序列号
                date_str = idx - firstday + 1; //计算日期
                (date_str <= 0 || date_str > m_days[mnow]) ? date_str = "&nbsp;": date_str = idx - firstday + 1; //过滤无效日期（小于等于零的、大于月总天数的）
                var nows = ynow + "-" + (mnow < 10 ? "0" + (mnow + 1) : (mnow + 1)) + "-" + (date_str < 10 ? "0" + date_str : date_str);

                for (var w = 0; w < daysOfMonth.length; w++) {
                    if (daysOfMonth[w].date == nows &&daysOfMonth[w]. appointmentState == false) {
                        str += "<td  data-day=" + date_str + " data-state=" + 6 + ">" + "<div class='appointmentNo'><div>" + date_str + "</div>" + "<div class='subscribe'>不可约</div></div>" + "</td>";
                    } else if (daysOfMonth[w].date == nows && daysOfMonth[w].state == 1) {
                        str += "<td  data-day=" + date_str + " data-state=" + 1 + ">" + "<div class='defaultEmpty'><div>" + date_str + "</div>" + "<div class='subscribe'>可约</div></div>" + "</td>";
                    } else if (daysOfMonth[w].date == nows && daysOfMonth[w].state == 2) {
                        str += "<td  data-day=" + date_str + " data-state=" + 2 + ">" + "<div class='full'><div>" + date_str + "</div>" + "<div class='subscribe'>已满</div></div>" + "</td>";
                    }
                }
                if (daysOfMonth[0].date > nows) {
                    str += "<td  data-day=" + date_str + " data-state=" + 4 + ">" + date_str + "</td>";
                } else if (daysOfMonth[daysOfMonth.length - 1].date < nows && nows.split("-")[2] != "&nbsp;") {
                    str += "<td  data-day=" + date_str + " data-state=" + 3 + ">" + "<div class='default'><div>" + date_str + "</div>" + "<div class='subscribe'>无效</div></div>" + "</td>";
                } else if (nows.split("-")[2] == "&nbsp;") {
                    str += "<td  data-day=" + date_str + ">" + date_str + "</td>";
                }
                //打印日期：今天底色样式

                // state == 1 && date_str !== "&nbsp;" ? str += "<td  data-day=" + date_str + " data-state=" + state + ">" + "<div class='defaultEmpty'><div>" + date_str + "</div>" + "<div class='subscribe'>可约</div></div>" + "</td>" : state == 2 && date_str !== "&nbsp;" ? str += "<td  data-day=" + date_str + " data-state=" + state + ">" + "<div class='full'><div>" + date_str + "</div>" + "<div class='subscribe'>已满</div></div>" + "</td>" : state == 3 && date_str !== "&nbsp;" ? str += "<td  data-day=" + date_str + " data-state=" + state + ">" + "<div class='default'><div>" + date_str + "</div>" + "<div class='subscribe'>无效</div></div>" + "</td>" : str += "<td  data-day=" + date_str + " data-state=" + state + "><div>" + date_str + "</div></td>";
            }
            str += "</tr>"; //表格的行结束
        }
        str += "</table>"; //表格结束
        $ele.html(str);
        console.log(success,'success')
        success != 0  ? btn = "<div class='button-cancel position-fixed'><div class='cancel'>取消我的预约</div></div>" : btn = " "
        $("#cancel").html(btn)
        setDate(ynow, mnow, dnow);
    }
    $('#cancel').on("click", ".button-cancel", function () {
        $('#show').html("<div class='position-absolute shows text-center w-100'><div class='showContainer'><div class='container-bg pb-2 pt-3'><div class='title'>是否取消我的预约</div><div class='row ml-3 mr-2 mb-2'><div class='cancel-one'>取消</div><div class='sure' id='sure'>确认</div></div></div></div></div>")
    })
    $("#show").on("click", '.cancel-one', function () {
        $("#show").html("")
    })
    $("#show").on("click", '#sure', function () {
        $.ajax({
            url: "http://192.168.0.102:8080/AppointmentController/deleteAppointmentTable",
            dataType: "json",
            data: {
                nameCode: nameCode,
                id: success
            },
            success: function (res) {
                if (res) {
                    $("#show").html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-2'><div class='row pt-2 title text-center'><div class='show-text text-center w-100'>预约取消成功</div></div><div><div class='sure mt-4 button-ok'>确认</div></div></div></div>")
                    success = 0;
                    pain();
                } else {
                    $("#show").html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-2'><div class='row pt-2 title text-center'><div class='show-text text-center w-100'>预约取消失败</div></div><div><div class='sure mt-4 button-ok'>确认</div></div></div></div>")
                }
            },
        });
    })
    $('#show').on('click', '.button-ok', function () {
        $("#show").html("")
    })
    self.prev = function () {
        var temp = mnow - 1;
        var nowM = new Date(ynow, mnow - 1, dnow, 10, 0, 0).getMonth();
        var nowY = new Date(ynow, mnow - 1, dnow, 10, 0, 0).getFullYear();
        if (temp < 0) {
            mnow = 11;
            ynow--;
        } else {
            //过期无效时间 处理
            var prevdate = new Date(ynow, mnow - 1, 31, 10, 0, 0);
            if (prevdate < mindate) {
                $('.datetitle #up').html(" ");
                return;
            }
            if (mindate.getFullYear() == nowY && mindate.getMonth() === nowM) {
                $('.datetitle #up').html(" ");
            }
            if (prevdate < maxdate) {
                $('#down').html("&gt;");
            }
            mnow--;
        }
        if (ynow == mindate.getFullYear() && mnow == mindate.getMonth()) {
            var _mday = mindate.getDate();
            if (dnow < _mday) dnow = _mday;
        }
        pain();
        title();
        // table();
        // createMonthDay();

    }
    self.next = function () {
        var nextdate = new Date(ynow, mnow + 1, 1, 10, 0, 0);
        var nowM = new Date(ynow, mnow + 1, dnow, 10, 0, 0).getMonth();
        var nowY = new Date(ynow, mnow + 1, dnow, 10, 0, 0).getFullYear();
        if (nextdate > maxdate) {
            $('.datetitle #down').html(" ");
            // alert("超过最大可预约日期", nextdate.format("yyyy-MM-dd"))
            return;
        }
        if (maxdate.getFullYear() == nowY && maxdate.getMonth() === nowM) {
            $('.datetitle #down').html(" ");
        }
        if (nextdate > mindate) {
            $('#up').html("&lt;");
        }
        var temp = mnow + 1;
        if (temp > 11) {
            mnow = 0;
            ynow++;
        } else {
            mnow++;
        }
        if (ynow == maxdate.getFullYear() && mnow == maxdate.getMonth()) {
            var _mday = maxdate.getDate();
            if (dnow > _mday) dnow = _mday;
        }
        // pain();
        title();
        createMonthDay();
        // table();
    }
    self.seleted = function ($td) {
        if (!$td.hasClass('selected')) {
            var day = $td.data("day");
            var state = $td.data("state");
            var selectedDate = new Date(ynow, mnow, day, 1, 0, 0);
            if (selectedDate.format("yyyy-MM-dd") === mindate.format("yyyy-MM-dd")) {} else if (selectedDate < mindate || selectedDate > maxdate) {
                // alert("该日期不能预约");
                return;
            }
            dnow = day;
            setDate(ynow, mnow, day);
            // $(".datebox table td").removeClass('selected');
            // $td.addClass('selected');
            var select = selectedDate.format("yyyy-MM-dd");
            if (state == 1) {
                window.location = 'choose.html?select=' + select + '&state=' + state + '' + '&day=' + day + '&nowDate=' + nowDate + '&success='+success+'';
            }

        }
    }
    self.getDate = function () {
        return currentDate();
    }
    $ele.on("click", "table td", function () {
        self.seleted($(this));
    });
    config.$prev.click(function () {
        self.prev();
    });
    config.$next.click(function () {
        self.next();
    });
    return self;
}