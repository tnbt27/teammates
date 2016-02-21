
module('instructorCourse.js');

/*Explanation: This is a dummy function to create an outline view in Eclipse */
function testVerifyCourseData(){}; 

test('verifyCourseData()', function(){
    // 'The method has only two paths and both are tested by UI tests
    expect(0);
});

function testIsCourseIDValidChars(){}; 
test('isCourseIDValidChars(courseId)', function(){
    
    //valid cases
    equal(isCourseIDValidChars("_$course1.2-3"), 
            true, 
            "Course Id valid");
    
    //invalid cases
    equal(isCourseIDValidChars("CS10@@"), 
            false, 
            "Course Id has @ character");
    equal(isCourseIDValidChars("CS100!"), 
            false, 
            "Course Id has ! character");
    equal(isCourseIDValidChars("CS100#"), 
            false, 
            "Course Id has # character");
    equal(isCourseIDValidChars("CS100%"), 
            false, 
            "Course Id has % character");
    equal(isCourseIDValidChars("CS100^"), 
            false, 
            "Course Id has ^ character");
    equal(isCourseIDValidChars("CS100&"), 
            false, 
            "Course Id has & character");
    equal(isCourseIDValidChars("CS100*"), 
            false, 
            "Course Id has * character");
    equal(isCourseIDValidChars("CS100\""), 
            false, 
            "Course Id has \" character");
    equal(isCourseIDValidChars("CS100'"), 
            false, 
            "Course Id has ' character");
});

function testGetCourseIdInvalidityInfo(){}; 

test('getCourseIdInvalidityInfo(courseId)', function(){
    
    //valid cases
    equal(getCourseIdInvalidityInfo(generateRandomString(COURSE_ID_MAX_LENGTH - 1)+"$   "), 
            "", 
            "Max-length course ID containing special characters and with extra whitespace padding");
    
    //invalid cases
    equal(getCourseIdInvalidityInfo(""), 
            DISPLAY_COURSE_COURSE_ID_EMPTY+"<br>", 
            "Course Id empty");
    equal(getCourseIdInvalidityInfo("   "), 
            DISPLAY_COURSE_COURSE_ID_EMPTY+"<br>", 
            "Course Id only white spaces");
    equal(getCourseIdInvalidityInfo("course*1"), 
            DISPLAY_COURSE_INVALID_ID+"<br>", 
            "Course Id only white spaces");
    equal(getCourseIdInvalidityInfo(generateRandomString(COURSE_ID_MAX_LENGTH + 1)), 
            DISPLAY_COURSE_LONG_ID+"<br>", 
            "Course Id too long");
});

function testGetCourseNameInvalidityInfo(){}; 

test('getCourseNameInvalidityInfo(courseId)', function(){
    
    //valid cases
    equal(getCourseNameInvalidityInfo(generateRandomString("   "+COURSE_NAME_MAX_LENGTH - 2)+"$*   "), 
            "", 
            "Max-length course name containing special characters and with extra whitespace padding");
    
    //invalid cases
    equal(getCourseNameInvalidityInfo("   "), 
            DISPLAY_COURSE_COURSE_NAME_EMPTY + "<br>", 
            "Course name empty");
    equal(getCourseNameInvalidityInfo(generateRandomString(COURSE_NAME_MAX_LENGTH + 1)), 
            DISPLAY_COURSE_LONG_NAME + "<br>", 
            "Course name too long");
});

function testGetCourseTimeZoneInvalidityInfo() {}

test('getCourseTimeZoneInvalidityInfo(courseTimeZone)', function() {

    // valid cases
    equal(getCourseTimeZoneInvalidityInfo("Asia/Singapore"), "", "Course time zone valid #1");
    equal(getCourseTimeZoneInvalidityInfo("Australia/Adelaide"), "", "Course time zone valid #2");
    equal(getCourseTimeZoneInvalidityInfo("America/Los_Angeles"), "", "Course time zone valid #3");
    equal(getCourseTimeZoneInvalidityInfo("UTC"), "", "Course time zone valid #4");

    // invalid case
    equal(getCourseTimeZoneInvalidityInfo("InvalidTimeZone"),
            DISPLAY_COURSE_INVALID_TIME_ZONE + "<br>",
            "Course time zone invalid");
});

function testCheckAddCourseParam(){}; 

test('checkAddCourseParam(courseID, courseName, courseTimeZone)', function(){

    equal(checkAddCourseParam("valid.course.id", "Software Engineering", "UTC"),
            "", 
            "All valid values");
    
    equal(checkAddCourseParam("", "Software Engineering", "UTC"),
            DISPLAY_COURSE_COURSE_ID_EMPTY+"<br>", 
            "Course ID empty");
        
    equal(checkAddCourseParam("valid.course-id", generateRandomString(COURSE_NAME_MAX_LENGTH + 1), "UTC"),
            DISPLAY_COURSE_LONG_NAME + "<br>", 
            "Course name too long");
    
    equal(checkAddCourseParam("valid.course-id", "Software Engineering", "InvalidTimeZone"),
            DISPLAY_COURSE_INVALID_TIME_ZONE + "<br>",
            "Course time zone invalid");

    equal(checkAddCourseParam("", "", ""), 
            DISPLAY_COURSE_COURSE_ID_EMPTY + "<br>" 
            + DISPLAY_COURSE_COURSE_NAME_EMPTY + "<br>"
            + DISPLAY_COURSE_INVALID_TIME_ZONE + "<br>",
            "both values are invalid");
    
    equal(checkAddCourseParam("invalid course id", generateRandomString(COURSE_NAME_MAX_LENGTH + 1), "googid|Instructor1|"), 
            DISPLAY_COURSE_INVALID_ID + "<br>" 
            + DISPLAY_COURSE_LONG_NAME + "<br>"
            + DISPLAY_COURSE_INVALID_TIME_ZONE + "<br>",
            "both values are invalid");

});



