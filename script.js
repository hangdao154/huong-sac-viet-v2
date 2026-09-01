(function () {
  const modal = document.getElementById("video-modal");
  const frame = document.getElementById("video-frame");
  const title = document.getElementById("video-modal-title");
  const closeBtn = modal.querySelector(".modal-close");

  function openModal(src, name) {
    title.textContent = name || "Video tiết mục";
    frame.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.classList.remove("modal-open");
  }

  document.querySelectorAll(".btn.watch").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openModal(btn.dataset.video, btn.dataset.title);
    });
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const contact = (formData.get("contact") || "").toString().trim();
      const eventName = (formData.get("eventName") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      const fields = { name, contact, eventName, message };
      const missing = Object.entries(fields)
        .filter(([_, value]) => !value)
        .map(([key]) => {
          if (key === "name") return "Họ và tên";
          if (key === "contact") return "Số điện thoại / Email";
          if (key === "eventName") return "Tên sự kiện";
          if (key === "message") return "Nội dung cần trao đổi";
          return key;
        });

      if (missing.length) {
        formStatus.textContent =
          "Vui lòng điền đầy đủ thông tin: " + missing.join(", ");
        formStatus.className = "form-status visible error";
        return;
      }

      const subject = encodeURIComponent(
        "Yêu cầu đặt lịch / liên hệ từ " + name + " - " + eventName,
      );
      const body = encodeURIComponent(
        "Họ và tên: " +
          name +
          "\n" +
          "Số điện thoại / Email: " +
          contact +
          "\n" +
          "Tên sự kiện: " +
          eventName +
          "\n\n" +
          "Nội dung cần trao đổi:\n" +
          message,
      );

      const mailtoLink =
        "mailto:nhacdantoc.hsv@gmail.com?subject=" + subject + "&body=" + body;
      const telLink = "tel:+84983788868";

      const isPhoneOrEmail =
        /@/.test(contact) || /^(\+?\d[\d\s\-]{8,})$/.test(contact);
      const fallbackMessage =
        "Vui lòng gửi thông tin qua email: nhacdantoc.hsv@gmail.com hoặc gọi: +84 983788868";

      formStatus.textContent =
        "Đang chuyển bạn đến email/điện thoại của chủ web...";
      formStatus.className = "form-status visible success";

      if (isPhoneOrEmail) {
        const target = /@/.test(contact) ? "mailto" : "tel";
        window.location.href = target === "mailto" ? mailtoLink : telLink;
      } else {
        window.location.href = mailtoLink;
      }

      setTimeout(function () {
        formStatus.textContent = fallbackMessage;
        formStatus.className = "form-status visible success";
      }, 1500);
    });
  }
})();
