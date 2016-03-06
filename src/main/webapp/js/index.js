// AJAX
var xmlhttp = new getXMLObject();

// OPERATIONS
var OPERATION_INSTRUCTORINATOR_LOGIN = "instructor_login";
var OPERATION_STUDENT_LOGIN = "student_login";

//TESTIMONIALS
var TESTIMONIALS = ['<font color="#186c6c">Congratulations for creating and managing such a wonderful and useful tool. I am planning to use for all the subjects I am teaching from now after getting fantastic feedback about this tool from my students. <br>- Faculty user, Australia</font>',
                    '<font color="#cc6699">I just wanted to let you know that TEAMMATES has been a great success!  Students love it.<br>-Faculty user, USA</font>',
                    '<font color="#30122d">I had such a great experience with TEAMMATES in the previous semester that I am back for more! <br>-Faculty user, Pakistan</font>',
                    '<font color="#a38280">Thank you for this. I think it is brilliant. <br>-Faculty user, Canada</font>',
                    '<font color="#241230">I found the TEAMMATES system really easy to use. On the whole a very positive experience. Using TEAMMATES certainly helps with one of the main potential problems of group-based assessments. <br>-Faculty user, Singapore</font>',
                    '<font color="#7c3737">I find it really great and so simple to use. <br>-Faculty user, Austria</font>',
                    '<font color="#666699">These peer evaluations will be perfect for classes.  I can already see that this is going to be an excellent tool as I need the teams to evaluate each other on a weekly basis.  Adding a new evaluation item and the questions/response criteria is so easy through your system. <br>-Faculty user, USA</font>',
                    '<font color="#cc3300">Thank you for building such a wonderful tool. <br>-Faculty user, Canada</font>'
                    ];
var LOOP_INTERVAL = "5000"; //in milliseconds
var CURRENT_TESTIMONIAL = 0;

function instructorLogin() {
    // send request
    requestInstructorLogin();
    // handle response
    handleInstructorLogin();
}

function requestInstructorLogin() {
    if (xmlhttp) {
        xmlhttp.open("POST", "/teammates", false);
        xmlhttp.setRequestHeader("Content-Type",
                "application/x-www-form-urlencoded;");
        xmlhttp.send("operation=" + OPERATION_INSTRUCTORINATOR_LOGIN);
    }
}

function handleInstructorLogin() {
    if (xmlhttp.status == 200) {
        var url = xmlhttp.responseXML.getElementsByTagName("url")[0];
        window.location = url.firstChild.nodeValue;
    }
}

function handleStudentLogin() {
    if (xmlhttp.status == 200) {
        var url = xmlhttp.responseXML.getElementsByTagName("url")[0];
        window.location = url.firstChild.nodeValue;
    }
}

function studentLogin() {
    if (xmlhttp) {
        xmlhttp.open("POST", "teammates", false);
        xmlhttp.setRequestHeader("Content-Type",
                "application/x-www-form-urlencoded;");
        xmlhttp.send("operation=" + OPERATION_STUDENT_LOGIN);
    }

    handleStudentLogin();
}

function getXMLObject() {
    var xmlHttp = false;
    try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e2) {
            xmlHttp = false;
        }
    }
    if (!xmlHttp && typeof XMLHttpRequest != 'undefined') {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}

function submissionCounter(currentDate, baseDate, submissionPerHour, baseCount) {
    var errorMsg = "Thousands of";
    if (!currentDate || !baseDate) {
        return errorMsg;
    }
    var currBaseDateDifference = currentDate - baseDate;
    if (currBaseDateDifference < 0) {
        return errorMsg;
    }

    var hr = currBaseDateDifference / 60 / 60 / 1000; // convert from millisecond to hour
    var numberOfSubmissions = Math.floor(hr * submissionPerHour);
    numberOfSubmissions += baseCount;
    return formatNumber(numberOfSubmissions);
}

//Setting submission count at page load
onload = function() {
    
    // Parameters for the estimation calculation
    var baseDate = new Date('October 30, 2015 00:00:00');  //The date the parameters were adjusted
    var baseCount = 2000000;     //The submission count on the above date
    var submissionPerHour = 27; //The rate at which the submission count is growing
    
    //set the submission count in the page
    var e = document.getElementById('submissionsNumber');
    var currentDate = new Date();
    e.innerHTML = submissionCounter(currentDate, baseDate, submissionPerHour, baseCount);

    setInterval(loopTestimonials,LOOP_INTERVAL);
};

// Format large number with commas
function formatNumber(number) {
    number += '';
    var expression = /(\d+)(\d{3})/;
    while (expression.test(number)) {
        number = number.replace(expression, '$1' + ',' + '$2');
    }
    return number;
}

//looping through all the testimonials
function loopTestimonials() {
    var tc = document.getElementById('testimonialContainer');
    
    // intended null checking and early return, to prevent constant failures in JavaScript tests
    if (tc === null && typeof tc === 'object') {
        return;
    }
    
    tc.innerHTML = TESTIMONIALS[CURRENT_TESTIMONIAL];
    CURRENT_TESTIMONIAL = (CURRENT_TESTIMONIAL + 1) % TESTIMONIALS.length;
}