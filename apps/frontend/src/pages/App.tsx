import { AppHeader } from "../components/AppHeader";
import { AppNav } from "../components/AppNav";
import { Section } from "../components/Section";
import { useAcademicData } from "../hooks/useAcademicData";
import { useRoute } from "../hooks/useRoute";
import { CoursesPage } from "./CoursesPage";
import { DashboardPage } from "./DashboardPage";
import { DetailPage } from "./DetailPage";
import { StudentsPage } from "./StudentsPage";
import { TeachersPage } from "./TeachersPage";
import { LoginPage } from "./LoginPage";
import { useAuth } from "../hooks/AuthProvider";

export function App() {
  const { isActive, navigate, route } = useRoute();
  const academic = useAcademicData({ navigate, route });
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Si es estudiante y quiere ver el dashboard, forzar a cursos
  if (route.page === "dashboard" && user.roles.includes("estudiante")) {
    navigate("/courses");
    return null;
  }

  return (
    <main className="appShell">
      <AppHeader loadState={academic.loadState} />
      <AppNav isActive={isActive} navigate={navigate} />

      {academic.loadState === "error" ? (
        <div className="notice">
          No se pudo conectar con la API. Inicia el backend en
          http://localhost:3000/api.
        </div>
      ) : null}

      {academic.formError ? (
        <div className="notice">{academic.formError}</div>
      ) : null}

      {route.page === "dashboard" && !user.roles.includes("estudiante") ? (
        <DashboardPage
          courses={academic.courses}
          navigate={navigate}
          students={academic.students}
          teachers={academic.teachers}
        />
      ) : null}

      {route.page === "courses" ? (
        <CoursesPage
          canCreateCourse={academic.canCreateCourse}
          cancelEditingCourse={academic.cancelEditingCourse}
          courseActionState={academic.courseActionState}
          courseForm={academic.courseForm}
          courseTeacherFilter={academic.courseTeacherFilter}
          courses={academic.filteredCourses}
          editCourseForm={academic.editCourseForm}
          editingCourseId={academic.editingCourseId}
          handleCreateCourse={academic.handleCreateCourse}
          handleDeleteCourse={academic.handleDeleteCourse}
          handleUpdateCourse={academic.handleUpdateCourse}
          isLoading={academic.isLoading}
          navigate={navigate}
          setCourseForm={academic.setCourseForm}
          setCourseTeacherFilter={academic.setCourseTeacherFilter}
          setEditCourseForm={academic.setEditCourseForm}
          startEditingCourse={academic.startEditingCourse}
          submitState={academic.submitState}
          teacherById={academic.teacherById}
          teachers={academic.teachers}
        />
      ) : null}

      {route.page === "students" ? (
        <StudentsPage
          cancelEditingStudent={academic.cancelEditingStudent}
          editStudentForm={academic.editStudentForm}
          editingStudentId={academic.editingStudentId}
          handleCreateStudent={academic.handleCreateStudent}
          handleDeleteStudent={academic.handleDeleteStudent}
          handleUpdateStudent={academic.handleUpdateStudent}
          isLoading={academic.isLoading}
          navigate={navigate}
          setEditStudentForm={academic.setEditStudentForm}
          setStudentForm={academic.setStudentForm}
          studentForm={academic.studentForm}
          studentActionState={academic.studentActionState}
          students={academic.students}
          submitState={academic.submitState}
          startEditingStudent={academic.startEditingStudent}
        />
      ) : null}

      {route.page === "teachers" ? (
        <TeachersPage
          handleCreateTeacher={academic.handleCreateTeacher}
          isLoading={academic.isLoading}
          navigate={navigate}
          setTeacherForm={academic.setTeacherForm}
          submitState={academic.submitState}
          teacherForm={academic.teacherForm}
          teachers={academic.teachers}
        />
      ) : null}

      {route.page === "detail" ? (
        <DetailPage
          courseById={academic.courseById}
          courseContentActionState={academic.courseContentActionState}
          courseResourceForms={academic.courseResourceForms}
          courseResources={academic.courseResources}
          courseQuizzes={academic.courseQuizzes}
          courseQuizForms={academic.courseQuizForms}
          courseSectionForm={academic.courseSectionForm}
          courseSections={academic.courseSections}
          courses={academic.courses}
          detailEntity={academic.detailEntity}
          detailState={academic.detailState}
          enrollmentState={academic.enrollmentState}
          enrollmentStudentId={academic.enrollmentStudentId}
          handleCreateCourseResource={academic.handleCreateCourseResource}
          handleCreateCourseSection={academic.handleCreateCourseSection}
          handleDeleteCourseResource={academic.handleDeleteCourseResource}
          handleDeleteCourseSection={academic.handleDeleteCourseSection}
          handleCreateCourseQuiz={academic.handleCreateCourseQuiz}
          handleDeleteCourseQuiz={academic.handleDeleteCourseQuiz}
          handleEnrollStudent={academic.handleEnrollStudent}
          handleUnenrollStudent={academic.handleUnenrollStudent}
          navigate={navigate}
          route={route}
          setCourseResourceForm={academic.setCourseResourceForm}
          getQuizForm={academic.getQuizForm}
          setCourseQuizForm={academic.setCourseQuizForm}
          setCourseSectionForm={academic.setCourseSectionForm}
          setEnrollmentStudentId={academic.setEnrollmentStudentId}
          studentActionState={academic.studentActionState}
          students={academic.students}
          teacherById={academic.teacherById}
        />
      ) : null}

      {route.page === "notFound" ? (
        <section className="pageGrid">
          <Section title="Pagina no encontrada">
            <div className="emptyDetail">
              La ruta actual no existe. Vuelve al inicio para continuar.
            </div>
          </Section>
        </section>
      ) : null}
    </main>
  );
}
