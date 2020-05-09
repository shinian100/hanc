(function () {
    var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var nameCode;

    function valid() {
        if (!nameCode) {
            return false
        } else if (!regIdNo.test(nameCode)) {
            $('#nameCode').focus();
            $('#nameCode').val('');
            return false
        } else {
            return true
        }
    }
    $('.btn').on("click", function () {
        nameCode = $('#nameCode').val();
        var result = valid();
        console.log(nameCode, 'nameCode', result)
        if (result) {
            console.log('45645153156')
            $.ajax({
                url: "http://192.168.0.102:8080/AppointmentController/selectByCode",
                dataType: "json",
                data: {
                    nameCode: nameCode,
                },
                success: function (res) {
                    console.log(res, 'yshuxin')
                    if (res.type=="jkz") {
                        window.location = 'info.html';
                    }else if(res.type == 'yy'){
                        $('#show').html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row p-2 title text-center'><div class='show-text text-center w-100'>"+ DateToTime(res.format, "Y年m月d日")+res.appointmentDateBeg+"~"+res.appointmentDateEnd+"预约体验成功</div></div><div><div class='sure mt-4'>确认</div></div></div></div>")
                    }else{
                        $('#show').html("<div class='text-center w-100 position-absolute shows'><div class='showContainer'><div class=' container-bg pb-1'><div class='row p-2 title text-center'><div class='show-text text-center w-100'>暂无预约记录，请先去预约吧</div></div><div><div class='sure mt-4'>确认</div></div></div></div>")
                    }
                   
                },
            });
        }
    })
    $("#show").on('click', '.sure', function () {
        $('#show').children().remove();
    })
    function DateToTime(date, type = "Y-M-D H:i:s") {
        var date = new Date(date); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var datetime = "";
        datetime += date.getFullYear() + type.substring(1, 2);
        datetime += (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + type.substring(3, 4);
        datetime += (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + type.substring(5, 6);
        return datetime;
    }
})()