var student = $('.page-header-headings h2').text();
var opgaveresult = [];
var alleOpgaver = $('.submissionstatustable');
var antalOpgaver = alleOpgaver.length;
var antalAfleverede = $('.submissionstatussubmitted').length;
var afleveringsprocent = Math.floor((antalAfleverede / antalOpgaver) * 100);
$('.submissionstatustable').parent('ul').prev('h4').each(function (index) {
    let obj = {};
    obj.titel = $(this).text();
    let findSubmitted = $(alleOpgaver[index]).find('.submissionstatussubmitted');
    if (findSubmitted.length < 1) {
        obj.afleveret = 'Nej';
    } else {
        obj.afleveret = 'Ja';
    }
    opgaveresult.push(obj);
}
);
opgaveresult;
function makeInfo() {
    var infoText = '<h3>' + student + ' har afleveret ' + antalAfleverede + ' ud af ' + antalOpgaver + ' opgaver.</h3>';
    infoText += '<h4>Afleveringsprocenten er derfor på ' + afleveringsprocent + '%.</h4>';
    infoText += '<b>Opgaver udført:</b><br>';
    infoText += '<ul>';
    for (var i = 0; i < opgaveresult.length; i++) {
        infoText += '<li>';
        let color = opgaveresult[i].afleveret == 'Ja' ? 'green' : 'red';
        infoText += opgaveresult[i].titel + ' : <b style="color:' + color + '">' + opgaveresult[i].afleveret + '</b>';
        infoText += '</li>';
    }
    infoText += '</ul>';
    var infodiv = $('<div id="opgaveinfo"></div>');
    infodiv.css({ 'background-color': '#FFF', 'padding': '20px', 'margin-bottom': '30px' });
    infodiv.html(infoText);
    infodiv.insertBefore($('.page-context-header'));
}
makeInfo();
