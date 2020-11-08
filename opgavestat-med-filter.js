
var student = $('.page-header-headings h2').text();
var opgaveresult = [];
var alleOpgaver = $('.submissionstatustable');
var antalOpgaver,antalAfleverede,afleveringsprocent,filter;

function makeInfo() {
    getData();
    var filtertekst = filter !== '' ? ' filtrerede' : '';
    var infoText = '<h3>' + student + ' har afleveret ' + antalAfleverede + ' ud af ' + antalOpgaver + filtertekst + ' opgaver.</h3>';
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
    $('#opgaveresult').html(infoText);

}
function makeInfoBox() {
    
    var infodiv = $('<div id="opgaveinfo" class="col-12"><h4 class="pull-left">Opgavestatistik</h4><button id="filterbtn" class="btn btn-dark pull-right">Filter</button><button id="exportbtn" style="margin:0 10px;" class="btn btn-dark pull-right" title="Eksporter som CSV fil.">Export</button><p style="clear:both;">Her kan du få en overskuelig oversigt over, hvilke opgaver eleven har afleveret.</p></div>');
    var infotools = $('<div id="infotools" style="display:none; background-color:#fff; margin-bottom:20px; padding:20px;" class="col-12"><p>Brug filteret til at filtrerer de afleverede opgaver.</p><input type=text id="filter" placeholder="filtreringstekst" class="col-12" style="height: 50px; font-size: 20px; border: 2px solid; border-radius:5px; text-transform:uppercase"></div>');
    
    var inforesult = $('<div id="opgaveresult" class="col-12"></div>');

    
    infodiv.append(infotools);
    
    infodiv.append(inforesult);
    infodiv.css({ 'background-color': '#f2f2f2', 'padding': '20px', 'margin-bottom': '10px' });

    infodiv.insertBefore($('.page-context-header'));


}

function getData() {
    opgaveresult = [];
    filter = $('#filter').val().toUpperCase();
    
    if (filter == '') {
        antalOpgaver = alleOpgaver.length;
        antalAfleverede = $('.submissionstatussubmitted').length;
    } else {
        antalOpgaver = 0;
        antalAfleverede = 0;
    }
        $('.submissionstatustable').parent('ul').prev('h4').each(function (index) {
            let obj = {};
            obj.titel = $(this).text().toUpperCase();
            obj.titel = obj.titel.replace('OPGAVE:','');
            let findSubmitted = $(alleOpgaver[index]).find('.submissionstatussubmitted');
            if (findSubmitted.length < 1) {
                obj.afleveret = 'Nej';
            } else {
                obj.afleveret = 'Ja';
            }
            if (filter == '') {
                opgaveresult.push(obj);
            }
            else if (filter !== '' && obj.titel.includes(filter)) {
                opgaveresult.push(obj);
                antalOpgaver ++;
                if (obj.afleveret == 'Ja') {
                    antalAfleverede ++;
                }
            }

        }
        ); 
        afleveringsprocent = Math.floor((antalAfleverede / antalOpgaver) * 100);
        //console.log(JSON.stringify(opgaveresult));
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function Export(){

    let csvArray = [];
    csvArray.push(["Opgave", "Afleveret"]);
    console.log(opgaveresult.length);
    for(i=0; opgaveresult.length>i;i++){
        console.log(i);
        let titel = opgaveresult[i].titel;
        let afleveret = opgaveresult[i].afleveret;
        let resultArray = [titel,afleveret];
        csvArray.push(resultArray);
    }
    exportToCsv('Opgavestatistik-'+student+'.csv',csvArray );

}
makeInfoBox();
makeInfo();
//eventhandlers
$('#filterbtn').click(function (e) {
    e.preventDefault();
    $('#infotools').toggle('slow');

});
$('#exportbtn').click(function (e) {
    e.preventDefault();
    Export();

});

$('#filter').keyup(function (e) {
    e.preventDefault();
    makeInfo();

});