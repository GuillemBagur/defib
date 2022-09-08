const feedbackPopup = document.getElementById("feedback-popup");

const showFBPopup = async (msg, type) => {
  feedbackPopup.classList.add("show");
  feedbackPopup.innerHTML = msg;
  feedbackPopup.classList.add(type);
  await sleep(4000); // The animation lasts for 4 seconds
  feedbackPopup.classList.remove("show");
  feedbackPopup.classList.remove(type);
};
