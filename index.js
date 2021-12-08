const AWS = require('aws-sdk');
var ses = new AWS.SES({
    region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
    async function main() {
        send()
    }
    main();
    function send() {
        var sender = "admin@prod.pranav-agarwal.me"
        var to_address = JSON.parse(event.Records[0].Sns.Message).email;
        var token = JSON.parse(event.Records[0].Sns.Message).token;


        return new Promise(function (resolve, reject) {
            var params = {
                Destination: {
                    ToAddresses: [to_address]
                },
                Message: {
                    Body: {
                        Html: {
                            Data: '<html><head>' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
                                '<title>' + "Email to verify user account" + '</title>' +
                                '</head><body>' +
                                'click this link to verify your email. This link is valid for two minutes.' +
                                '<br><br>' +
                                "<a href=\"https://" + "prod.pranav-agarwal.me" + "/v1/user/verifyUserEmail?email=" + to_address + "&token=" + token + "\">" +
                                "https://" + "prod.pranav-agarwal.me" + "/v1/user/verifyUserEmail?email=" + to_address + "&token=" + token + "</a>"
                                +'</body></html>'
                        }
                    },
                    Subject: {
                        Data: "Email to verify user account"
                    }
                },
                Source: sender
            };
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    context.succeed(event);
                    resolve(data);
                }
            });
        });
    }
}