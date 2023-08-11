let user = { role: "admin" };
let data = {};
let requestId = "57346834843";

window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== "https://" + window.location.hostname) return;
    let eventData = event.data;
    requestId = eventData["requestId"];
    user = eventData["user"];
    $(".div-qa-form").css("display", "block");
    generateForm(requestId, user);
  },
  false
);

generateForm(requestId, user);

$(".close-btn").click(function () {
  window.top.close();
});

$(".click-to-bottom").click(function () {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
});

let stopped;
let dispositionCounter;
//    let startTime = Math.floor(Date.now() / 1000);
let autoSaveFrequency = 15;
let autoSaveCounter = 1;
function countdown(startTime, dispositionStart) {
  autoSaveCounter++;
  stopped = setTimeout(function () {
    var currentTime = Math.floor(Date.now() / 1000);
    console.log(
      "auto dispose thread running : " +
        currentTime +
        " , starttime :  " +
        startTime +
        ",  dispositionStart : " +
        dispositionStart
    );
    dispositionCounter = 60 - (currentTime - startTime);
    if (enableConsoleLogs) console.log("counter : ", dispositionCounter);
    document.getElementById(
      "dispose-timer"
    ).value = `Timer: ${dispositionCounter}`;
    //$('#dispose-timer').text(`Timer: ${dispositionCounter}`);
    if (autoSaveCounter % autoSaveFrequency != 0) {
      countdown(startTime, false);
      if (enableConsoleLogs) console.log("No auto save");
    } else {
      if (enableConsoleLogs) console.log("auto dispose the call");
      countdown(startTime, false);
      autoSubmitTheForm();
    }
  }, 1000);
}

$(".requestid-button").click(function () {
  var $temp = $("<input>");
  $("body").append($temp);
  //alert($(`.request-id-para`).text());
  $temp.val($(`.request-id-para`).text()).select();
  document.execCommand("copy");
  $temp.remove();
});
