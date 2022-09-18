const feedbackPopup = document.getElementById("feedback-popup");

/**
 * 
 * @param {string} msg - The message to show
 * @param {string} type - Represents if the feedback is positive or negative. Allowed values: "feedback-msg" and "feedback-err"
 */
const showFBPopup = async (msg, type) => {
  feedbackPopup.classList.add("show");
  feedbackPopup.innerHTML = msg;
  feedbackPopup.classList.add(type);
  await sleep(4000); // The animation lasts for 4 seconds
  feedbackPopup.classList.remove("show");
  feedbackPopup.classList.remove(type);
};
