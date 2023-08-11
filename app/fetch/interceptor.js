function postRequest(endPoint, requestBody) {
  const user = getLoggedInUser();
  const rtime = moment().unix();

  if (enableConsoleLogs) console.log("user", user);
  if (enableConsoleLogs) console.log("endPoint", endPoint);

  let headerValues = { headers: {} };
  headerValues.headers["X-RequestTime"] = rtime;
  headerValues.headers["X-Agent"] = user.agentId;
  headerValues.headers["X-Token"] = user.token;
  headerValues.headers["X-Auth-Token"] = md5(
    `${user.secret}:${rtime}:${user.role}`
  );

  if (enableConsoleLogs) console.log("headers", JSON.stringify(headerValues));

  return new Promise((resolve, reject) => {
    $.post({
      url: endPoint,
      data: JSON.stringify(requestBody),
      headers: headerValues.headers,
      contentType: "application/json", // Set the content type explicitly
    }).then(
      (res) => {
        if (enableConsoleLogs) console.log("res", res);
        if (res.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("isAutoIn");
          localStorage.removeItem("status");
          localStorage.removeItem("callDetail");
          if (endPoint === twoFactorAuthUrl) {
            document.location.href = "login.html";
          } else {
            document.location.href = "app/login.html";
          }
          displayStatus("danger", loggedOut);
        } else {
          resolve(res);
        }
      },
      (err) => {
        if (enableConsoleLogs) console.log("rejecting promise", err);

        if (err["status"] == 401) {
          displayStatus("danger", sessionExpire);
          if (endPoint === twoFactorAuthUrl) {
            document.location.href = "login.html";
          } else {
            document.location.href = "app/login.html";
          }
        }
        reject(err);
      }
    );
  });
}

function getRequest(endPoint) {
  const user = getLoggedInUser();
  const rtime = moment().unix();
  if (enableConsoleLogs) console.log("user", user);
  let headerValues = { headers: {} };
  headerValues.headers["X-Token"] = user.token;
  headerValues.headers["X-RequestTime"] = rtime;
  headerValues.headers["X-Agent"] = user.agentId;
  headerValues.headers["X-Auth-Token"] = md5(
    `${user.secret}:${rtime}:${user.role}`
  );
  if (enableConsoleLogs) console.log("headers", JSON.stringify(headerValues));
  return new Promise((resolve, reject) => {
    $.get({
      url: endPoint,
      data: headerValues,
      dataType: "json",
      headers: headerValues.headers,
    }).then(
      (res) => {
        if (enableConsoleLogs) console.log("res", res);
        if (res !== undefined && res.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("isAutoIn");
          localStorage.removeItem("status");
          localStorage.removeItem("callDetail");
          if (endPoint === twoFactorAuthUrl) {
            document.location.href = "login.html";
          } else {
            document.location.href = "app/login.html";
          }
          displayStatus("danger", loggedOut);
        } else {
          resolve(res);
        }
      },
      (err) => {
        if (enableConsoleLogs) console.log("rejecting promise", err);
        if (err["status"] == 401) {
          displayStatus("danger", sessionExpire);
          document.location.href = "app/login.html";
        }
        reject(err);
      }
    );
  });
}
