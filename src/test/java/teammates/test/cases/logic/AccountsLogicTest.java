package teammates.test.cases.logic;

import static org.testng.Assert.assertTrue;
import static org.testng.AssertJUnit.assertEquals;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import teammates.common.datatransfer.AccountAttributes;
import teammates.common.datatransfer.InstructorAttributes;
import teammates.common.datatransfer.StudentAttributes;
import teammates.common.exception.JoinCourseException;
import teammates.common.util.FieldValidator;
import teammates.common.util.StringHelper;
import teammates.logic.api.Logic;
import teammates.logic.core.AccountsLogic;
import teammates.logic.core.StudentsLogic;
import teammates.test.cases.BaseComponentTestCase;
import teammates.test.driver.AssertHelper;

public class AccountsLogicTest extends BaseComponentTestCase {

	private AccountsLogic accountsLogic = AccountsLogic.inst();
	private Logic logic = new Logic();

	@BeforeClass
	public static void classSetUp() throws Exception {
		printTestClassHeader();
		turnLoggingUp(AccountsLogic.class);
	}


	@Test
	public void testCreateAccount() throws Exception {

		______TS("typical success case");

		AccountAttributes accountToCreate = new AccountAttributes("id", "name",
				true, "test@email", "dev");
		accountsLogic.createAccount(accountToCreate);
		LogicTest.verifyPresentInDatastore(accountToCreate);
	}

	@Test
	public void testJoinCourse() throws Exception {

		String correctStudentId = "correctStudentId";
		String courseId = "courseId";
		String originalEmail = "original@email.com";

		// Create correct student with original@email.com
		StudentAttributes studentData = new StudentAttributes(null,
				originalEmail, "name", null, courseId, null);
		logic.createStudent(studentData);
		studentData = StudentsLogic.inst().getStudentForEmail(courseId,
				originalEmail);

		LogicTest.verifyPresentInDatastore(studentData);

		______TS("failure: wrong key");

		try {
			accountsLogic.joinCourse("wrong key", correctStudentId);
			signalFailureToDetectException();
		} catch (JoinCourseException e) {
			assertEquals("You have entered an invalid key: " + "wrong key",
					e.getMessage());
		}

		______TS("failure: invalid parameters");

		try {
			accountsLogic.joinCourse(studentData.key, "wrong student");
			signalFailureToDetectException();
		} catch (JoinCourseException e) {
			AssertHelper.assertContains(FieldValidator.REASON_INCORRECT_FORMAT,
					e.getMessage());
		}

		______TS("success: without encryption and account already exists");

		AccountAttributes accountData = new AccountAttributes(correctStudentId,
				"nameABC", false, "real@gmail.com", "nus");
		accountsLogic.createAccount(accountData);
		accountsLogic.joinCourse(studentData.key, correctStudentId);

		studentData.googleId = accountData.googleId;
		LogicTest.verifyPresentInDatastore(studentData);
		assertEquals(
				correctStudentId,
				logic.getStudentForEmail(studentData.course, studentData.email).googleId);

		______TS("failure: already joined");

		try {
			accountsLogic.joinCourse(studentData.key, correctStudentId);
			signalFailureToDetectException();
		} catch (JoinCourseException e) {
			assertEquals(correctStudentId + " has already joined this course",
					e.getMessage());
		}

		______TS("failure: valid key belongs to a different user");

		try {
			accountsLogic.joinCourse(studentData.key, "wrongstudent");
			signalFailureToDetectException();
		} catch (JoinCourseException e) {
			assertEquals(studentData.key + " belongs to a different user",
					e.getMessage());
		}

		______TS("success: with encryption and new account to be created");

		originalEmail = "email2@gmail.com";
		studentData = new StudentAttributes(null, originalEmail, "name", null,
				courseId, null);
		logic.createStudent(studentData);
		studentData = StudentsLogic.inst().getStudentForEmail(courseId,
				originalEmail);

		String encryptedKey = StringHelper.encrypt(studentData.key);
		accountsLogic.joinCourse(encryptedKey, correctStudentId);
		studentData.googleId = correctStudentId;
		LogicTest.verifyPresentInDatastore(studentData);
		assertEquals(correctStudentId,
				logic.getStudentForEmail(studentData.course, studentData.email).googleId);

		// check that we have the corresponding new account created.
		accountData.googleId = correctStudentId;
		accountData.email = originalEmail;
		accountData.name = "name";
		accountData.isInstructor = false;
		LogicTest.verifyPresentInDatastore(accountData);

		______TS("success: join course as student does not revoke instructor status");

		// promote account to instructor
		logic.createInstructorAccount(correctStudentId, courseId,
				studentData.name, studentData.email, "nus");

		// make the student 'unregistered' again
		studentData.googleId = "";
		logic.updateStudent(studentData.email, studentData);
		assertEquals("",
				logic.getStudentForEmail(studentData.course, studentData.email).googleId);

		// rejoin
		logic.joinCourse(correctStudentId, encryptedKey);
		assertEquals(correctStudentId,
				logic.getStudentForEmail(studentData.course, studentData.email).googleId);

		// check if still instructor
		assertTrue(logic.isInstructor(correctStudentId));
	}

	@Test
	public void testDeleteAccountCascade() throws Exception {

		______TS("typical success case");

		logic.createInstructorAccount("googleId", "courseId", "name",
				"email@com", "institute");
		InstructorAttributes instructor = logic.getInstructorForGoogleId(
				"courseId", "googleId");
		AccountAttributes account = logic.getAccount("googleId");

		// Make instructor account id a student too.
		StudentAttributes student = new StudentAttributes("googleId",
				"email@com", "name", null,
				"courseId", "team");
		logic.createStudent(student);

		LogicTest.verifyPresentInDatastore(account);
		LogicTest.verifyPresentInDatastore(instructor);
		LogicTest.verifyPresentInDatastore(student);

		accountsLogic.deleteAccountCascade("googleId");

		LogicTest.verifyAbsentInDatastore(account);
		LogicTest.verifyAbsentInDatastore(instructor);
		LogicTest.verifyAbsentInDatastore(student);

	}
	
	@AfterClass
	public static void classTearDown() throws Exception {
		turnLoggingDown(AccountsLogic.class);
	}
	
	//TODO: add missing test cases
}