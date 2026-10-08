(function () {
  const modal = document.getElementById("video-modal");
  const frame = document.getElementById("video-frame");
  const title = document.getElementById("video-modal-title");
  const closeBtn = modal.querySelector(".modal-close");
  const cards = document.getElementById("program-cards");
  const programStatus = document.getElementById("program-status");

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

  function getDriveFileId(videoUrl) {
    const url = new URL(videoUrl);
    const match = url.pathname.match(
      /^\/file\/d\/([A-Za-z0-9_-]+)\/(?:preview|view)\/?$/,
    );

    if (url.hostname !== "drive.google.com" || !match) {
      throw new Error("Link video không đúng định dạng Google Drive: " + videoUrl);
    }

    return match[1];
  }

  function createProgramCard(program) {
    const fileId = getDriveFileId(program.videoUrl);
    const card = document.createElement("article");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const image = document.createElement("img");
    image.className = "thumb-image";
    image.src =
      "https://drive.google.com/thumbnail?id=" +
      encodeURIComponent(fileId) +
      "&sz=w800";
    image.alt = "";
    image.loading = "lazy";

    const heading = document.createElement("h3");
    heading.textContent = program.title;
    thumb.append(image, heading);

    const body = document.createElement("div");
    body.className = "body";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = program.tag;

    const description = document.createElement("p");
    description.textContent = program.description;

    const watchButton = document.createElement("button");
    watchButton.className = "btn watch";
    watchButton.type = "button";
    watchButton.dataset.video = program.videoUrl;
    watchButton.dataset.title = program.title;
    watchButton.textContent = "Xem ngay";

    body.append(tag, description, watchButton);
    card.append(thumb, body);
    return card;
  }

  async function loadPrograms() {
    try {
      const response = await fetch("data/programs.json");
      if (!response.ok) {
        throw new Error(
          "Không thể tải data/programs.json (HTTP " + response.status + ")",
        );
      }

      const programs = await response.json();
      if (!Array.isArray(programs)) {
        throw new Error("Dữ liệu chương trình phải là một danh sách.");
      }

      const fragment = document.createDocumentFragment();
      programs.forEach(function (program, index) {
        if (
          !program ||
          typeof program.title !== "string" ||
          !program.title.trim() ||
          typeof program.tag !== "string" ||
          !program.tag.trim() ||
          typeof program.description !== "string" ||
          !program.description.trim() ||
          typeof program.videoUrl !== "string" ||
          !program.videoUrl.trim()
        ) {
          throw new Error("Thông tin tiết mục thứ " + (index + 1) + " chưa hợp lệ.");
        }

        fragment.append(createProgramCard(program));
      });

      cards.replaceChildren(fragment);
      programStatus.textContent = programs.length
        ? ""
        : "Chưa có chương trình biểu diễn.";
      programStatus.hidden = programs.length > 0;
    } catch (error) {
      console.error("Lỗi tải danh sách chương trình:", error);
      programStatus.textContent =
        "Không thể tải danh sách chương trình. Vui lòng thử tải lại trang.";
      programStatus.hidden = false;
    }
  }

  cards.addEventListener("click", function (event) {
    const button = event.target.closest(".btn.watch");
    if (button && cards.contains(button)) {
      openModal(button.dataset.video, button.dataset.title);
    }
  });

  loadPrograms();

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
