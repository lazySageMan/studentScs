const SMSClient=require("@alicloud/sms-sdk");
//配用密匙
const accessKeyId = 'LTAI7RobgkpNzRun';
const secretAccessKey = 'ymzOh9sRTcrutFSXSeq0w0dEmzx0cR';

//创建一个新的sms服务
let smsClient = new SMSClient({accessKeyId,secretAccessKey});

function sms(userPhone,code,signName){
    smsClient.sendSMS({
        PhoneNumbers: userPhone,
        SignName: signName,
        TemplateCode: 'SMS_130180016',
        TemplateParam: `{"code":${code}}`
    }).then(function (res) {
        let {Code}=res;
        if (Code === 'OK') {
            //处理返回参数
            console.log("发送成功");
        }
    },function (err) {
        console.log(err);
    });
}
module.exports=sms;