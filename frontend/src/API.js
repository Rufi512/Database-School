import axios from "axios";
import Cookies from "js-cookie";
const accessToken = Cookies.get("token");

//GET
export const studentsList = async (students) => {
  if (students === "studentsActive") {
    const res = await axios
      .get("/api/students/actives", {
        headers: { "x-access-token": accessToken },
      })
      .catch((err) => {
        return err.response;
      });
    return res;
  }

  if (students === "studentsInactive") {
    const res = await axios
      .get("/api/students/inactives", {
        headers: { "x-access-token": accessToken },
      })
      .catch((err) => {
        return err.response;
      });
    return res;
  }

  if (students === "studentsGradues") {
    const res = await axios
      .get("/api/students/gradues", {
        headers: { "x-access-token": accessToken },
      })
      .catch((err) => {
        return err.response;
      });
    return res;
  }
};

export const studentInformation = async (id) => {
  const res = await axios
    .get("/api/students/info/" + id, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const getUsersList = async () => {
  const res = await axios
    .get("/api/user/list", { headers: { "x-access-token": accessToken } })
    .catch((err) => {
      return err.response;
    });
  return res;
};

//POST

export const loginUser = async (user) => {
  const res = await axios
    .post("/api/auth/login", user, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const registerUser = async (user) => {
  const res = await axios
    .post("/api/user/register", user, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const registerStudent = async (values) => {
  const res = await axios
    .post("/api/students/register", values, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });

  return res;
};

export const registerStudents = async (archive) => {
  const res = await axios
    .post("/api/students/register/file", archive, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });

  return res;
};

export const gradeStudent = async (value, ids) => {
  if (value === "upgrade") {
    const res = await axios
      .put("/api/students/graduate", ids, {
        headers: { "x-access-token": accessToken },
      })
      .catch((err) => {
        return err.response;
      });
    return res;
  }

  if (value === "degrade") {
    const res = await axios
      .put("/api/students/demote", ids, {
        headers: { "x-access-token": accessToken },
      })
      .catch((err) => {
        return err.response;
      });
    return res;
  }
};

export const commentStudent = async (id, comment) => {
  const res = await axios
    .post("/api/students/comment/" + id, { comment })
    .catch((err) => {
      return err.response;
    });
  return res;
};

//PUT
export const academicInformation = async (id, values) => {
  const res = await axios
    .put("/api/students/info/" + id, values, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const updateUser = async (user) => {
  const res = await axios
    .put("/api/user/update/" + user.id, user, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

//DELETE

export const deleteUser = async (id) => {
  const res = await axios
    .delete("/api/user/delete/" + id, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const deleteStudents = async (ids) => {
  const res = await axios
    .post("/api/students/delete", ids, {
      headers: { "x-access-token": accessToken },
    })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const deleteComments = async (id, index) => {
  const res = await axios
    .post(
      "/api/students/comment/delete/" + id,
      { index },
      { headers: { "x-access-token": accessToken } }
    )
    .catch((err) => {
      return err.response;
    });
  return res;
};
