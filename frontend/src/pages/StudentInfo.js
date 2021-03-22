import React, { useState, useEffect } from "react";
import FormAcademic from "../components/FormAcademic";
import { Navbar } from "../components/Navbar";
import { InfoBasic } from "../components/InfoBasic";
import { InfoAcademic } from "../components/InfoAcademic";
import { HistoryStudent } from "../components/HistoryStudent";
import { Comments } from "../components/Comments";
import {
  studentInformation,
  gradeStudent,
  commentStudent,
  deleteStudents,
} from "../API";
import { Alert } from "../components/Alerts";
import { screenComment, changeView } from "../components/SomethingFunctions";
import { displayAlert } from "../components/Alerts";
import { Popup, displayPopup } from "../components/Alerts";
import trash from "../static/icons/trash-solid.svg";
import pencil from "../static/icons/pencil.svg";
import book from "../static/icons/book.svg";
import arrow from "../static/icons/arrow.svg";

const StudentInfo = (props) => {
  const [student, setStudent] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [record, setRecord] = useState([]);
  const [annualComments, setAnnualComments] = useState([]);
  const [commits, setCommits] = useState([]);
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState("");
  const [action, setAction] = useState("upgradeAndDegrade");
  const [confirm, setConfirm] = useState(false);
  const [popup, setPopup] = useState({});

  async function request(id) {
    const result = await studentInformation(id);
    console.log(result);

    if (result.status === 200) {
      setStudent(result.data);
      setSubjects(result.data.subjects);
      setCommits(result.data.comments);
      setRecord(result.data.record);
      setAnnualComments(result.data.annual_comments);
    }

    if (result.status >= 400) {
      setPopup({ text: result.data, type: "error" });
      displayPopup("", ".popupStudentInfo");
      return "";
    }

    if (result.status >= 500) {
      setPopup({ text: "Ocurrio un error al requerir informacion!", type: "error" });
      displayPopup("", ".popupStudentInfo");
      return "";
    }
  }

  useEffect(() => {
    function loadStudent() {
      const { id } = props.match.params;
      request(id);
    }
    loadStudent();
  }, [props]);

  //Añade comentario
  async function sendComment(e) {
    e.preventDefault();
    const result = await commentStudent(student._id, comment);
    if (result.status === 200) {
      screenComment(false);
      setComment("");
      request(student._id);
    }

    if (result.status >= 400) {
      setPopup({ text: result.data, type: "error" });
      displayPopup("received", ".popupStudentInfo");
    }

    if (result.status >= 500) {
      setPopup({ text: "Error al conectar con el servidor :(", type: "error" });
      displayPopup();
    }
  }

  const questionAction = async (value, action) => {
    displayAlert(true);
    changeView("general", student.school_year);
    if (value === true && action === "upgradeAndDegrade") {
      setAlert("Estas seguro de graduar a al estudiante?");
      setAction("upgradeAndDegrade");
      setConfirm(true);
    }

    if (value === false && action === "upgradeAndDegrade") {
      setAlert("Estas seguro de degradar a al estudiante?");
      setAction("upgradeAndDegrade");
      setConfirm(false);
    }

    if (value === true && action === "delete") {
      setAlert("Estas seguro de eliminar a este estudiante?");
      setAction("delete");
      setConfirm(true);
    }
  };

  //Gradua o degrada al estudiante
  async function upgradeAndDegrade(value) {
    displayAlert(false);
    displayPopup("", ".popupStudentInfo");
    setPopup({ text: "Enviando informacion", type: "request" });
    let gradue = null;
    let result = null;
    if (value === true) {
      result = await gradeStudent("upgrade", [student._id]);
      gradue = true;
    } else {
      result = await gradeStudent("degrade", [student._id]);
      gradue = false;
    }

    if (result.status >= 400) {
      setPopup({ text: result.data, type: "error" });
      displayPopup("received", ".popupStudentInfo");
    }

    if (result.status >= 500) {
      setPopup({ text: "Error al conectar con servidor", type: "error" });
      displayPopup("received", ".popupStudentInfo");
    }

    if (result.status === 200 && gradue === true) {
      setPopup({ text: "Estudiante Graduado", type: "pass" });
      displayPopup("received", ".popupStudentInfo");
      request(student._id);
    }

    if (result.status === 200 && gradue === false) {
      setPopup({ text: "Estudiante Degradado", type: "error" });
      displayPopup("received", ".popupStudentInfo");
      request(student._id);
    }
  }

  //Borra al estudiante
  async function deleteStudent(value) {
    if (value === true) {
      const result = await deleteStudents([student._id]);
      if (result.status === 200) {
        displayAlert(false);
        props.history.push("/students/");
      }

      if (result.status >= 400) {
        setPopup({ text: result.data, type: "error" });
        displayPopup("received", ".popupStudentInfo");
      }

      if (result.status >= 500) {
        setPopup({ text: "Error al conectar con el servidor", type: "error" });
        displayPopup("received", ".popupStudentInfo");
      }
    }
  }

  if (student.school_year === "Graduado") {
    return (
      <React.Fragment>
        <Navbar />
        <div
          className="container-student view-information"
          style={{ margin: "0 auto" }}
        >
          <Popup popup={popup} zone={"popupStudentInfo"} />
          <HistoryStudent
            student={student}
            record={record}
            annualComments={annualComments}
            gradue={student.school_year}
          />
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Navbar />
      <div className="buttons-actions">
        <div
          onClick={(e) => {
            changeView("edit");
          }}
        >
          <img src={pencil} alt="pencil" />
          <p>Editar</p>
        </div>
        <div
          onClick={(e) => {
            questionAction(true, "upgradeAndDegrade");
            setAction("upgradeAndDegrade");
          }}
        >
          <img src={arrow} style={{ transform: "rotate(-90deg)" }} alt="arrow" />
          <p>Graduar</p>{" "}
        </div>
        <div
          onClick={(e) => {
            changeView("history");
          }}
        >
          <img src={book} alt="book" />
          <p>Historial</p>
        </div>
        <div
          onClick={(e) => {
            questionAction(false, "upgradeAndDegrade");
            setAction("upgradeAndDegrade");
          }}
        >
          <img src={arrow} style={{ transform: "rotate(90deg)" }} alt="arrow" />
          <p>Degradar</p>
        </div>
        <div
          onClick={(e) => {
            questionAction(true, "delete");
            setAction("delete");
          }}
        >
          <img src={trash} alt="trash" />
          <p>Eliminar</p>
        </div>
      </div>
      <div className="container-student view-information">
        <Popup popup={popup} zone={"popupStudentInfo"} />
        <Alert
          alert={alert}
          upgradeAndDegrade={upgradeAndDegrade}
          deleteStudent={deleteStudent}
          nameActions={action}
          confirm={confirm}
        />
        <InfoBasic student={student} gradue={student.school_year} />
        <InfoAcademic information={subjects} zone={true} />

        <div className="time-edit">
          <p>Fecha de modificacion ultima vez: {student.last_modify}</p>
        </div>

        <Comments
          comments={commits}
          actions={request}
          studentInfo={true}
          id={student._id}
          gradue={student.school_year}
        />

        <div
          className="screen-back"
          onClick={(e) => {
            screenComment(false);
          }}
        ></div>
        <form onSubmit={sendComment}>
          <div className="screen-comment">
            <h3>Escribe tu comentario</h3>
            <textarea
              className="input-comment"
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
            ></textarea>
            <div>
              <button className="button-comment" type="submit">
                Enviar Comentario
              </button>
              <button
                className="button-comment"
                type="button"
                onClick={(e) => {
                  screenComment(false);
                }}
              >
                Regresar
              </button>
            </div>
          </div>
        </form>
        <button
          className="button-comment"
          type="button"
          onClick={(e) => {
            screenComment(true);
          }}
        >
          Comentar
        </button>
      </div>

      <FormAcademic
        id={student._id}
        ci={student.ci}
        firstName={student.firstName}
        lastName={student.lastName}
        status={student.status}
        subjects={subjects}
        school_year={student.school_year}
        request={request}
      />

      <HistoryStudent
        student={student}
        record={record}
        annualComments={annualComments}
        gradue={student.school_year}
      />
    </React.Fragment>
  );
};

export default StudentInfo;