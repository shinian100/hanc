(function () {
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
    var role = a['role'];
    var ifFirmAppoimtment = a['ifFirmAppoimtment'];
    var appointmentNum = a['appointmentNum'];
    var nowDate = a['nowDate'];
    var name;
    var nameCode;
    var namePhone;
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var pattern = /^1[34578]\d{9}$/; 
    console.log($('.back').html())
    $('.back').on("click", function () {
        window.location = 'choose.html?select=' + select + '&role=' + role + '&appointmentNum=' + appointmentNum + '&ifFirmAppoimtment=' + ifFirmAppoimtment + '&nowDate=' + nowDate + '';
    })
    $('.btn').on('click', function () {
        name = $('#name').val();
        nameCode = $('#nameCode').val();
        namePhone = $('#namePhone').val();
        require();
    })

    function valid() {
        if (!name) {
            return false
        } else if (!nameCode) {
            return false
        } else if (!regIdNo.test(nameCode)) {
            $('#nameCode').focus();
            $('#nameCode').val('');
            return false
        } else if (!namePhone) {
            return false
        } else if (!pattern.test(namePhone)) {
            $('#namePhone').focus();
            $('#namePhone').val('');
            return false
        }else {
            return true
        }
    }

    function require() {
        let result = valid();
        if (result) {
            $.ajax({
                url: "http://192.168.0.102:8080/AppointmentController/insertAppointmentTable",
                dataType: "json",
                data: {
                    name: name,
                    nameCode: nameCode,
                    namePhone: namePhone,
                    appointmentTime: select,
                    periodOfTimeId: appointmentNum,
                    ifFirmAppoimtment: ifFirmAppoimtment
                },
                success: function (res) {
                    console.log(res, 'yshuxin')
                    if (res.id) {
                        $('#show').html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row p-2 title text-center'><div class='title text-center w-100'>"+res.appointment+"</div></div><div ><div class='sure mt-4 appointmentSure'>确认</div></div></div></div>")
                        $('#show').on('click', '.appointmentSure', function () {
                            $("#show").html('')
                            window.location = "index.html?appointmentTime=" + res.appointmentTime + "&id=" + res.id + "&appointmentNum=" + res.appointmentNum + '&nameCode=' + res.nameCode + '&role=' + role + '&ifFirmAppoimtment=' + ifFirmAppoimtment + '';
                            sessionStorage.setItem("id", res.id)
                            console.log(sessionStorage.getItem('id'))
                        })
                    } else {
                        $('#show').html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row p-2 title text-center'><div class='title text-center w-100'>"+res.appointment+"</div></div><div ><div class='sure mt-4 appointmentCancel'>确认</div></div></div></div>")
                        $('#show').on('click', '.appointmentCancel', function () {
                            $("#show").html('')
                        })
                    }
                },
            })
        };
    }
})()