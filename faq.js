document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    const answer = item.querySelector(".faq-answer")

    question.addEventListener("click", () => {
      const isActive = question.classList.contains("active")

      // Close all other open FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.querySelector(".faq-question").classList.remove("active")
          otherItem.querySelector(".faq-answer").classList.remove("active")
        }
      })

      // Toggle the clicked FAQ item
      question.classList.toggle("active", !isActive)
      answer.classList.toggle("active", !isActive)
    })
  })
})

