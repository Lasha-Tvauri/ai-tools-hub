document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    "All",
    "AI RECRUITMENT TOOLS",
    "AI REAL ESTATE TOOLS",
    "AI PORTRAIT & PROFILE PICTURE GENERATORS"
  ]
  const categoryFilters = document.querySelector(".category-filters")
  const aiToolListings = document.querySelector(".ai-tool-listings")
  const itemsPerPage = 9 // 3 rows * 3 cards per row
  let currentPage = 1
  let aiTools = []
  let filteredTools = []

  // Add category filter buttons
  categories.forEach((category) => {
    const button = document.createElement("button")
    button.textContent = category
    button.addEventListener("click", () => filterTools(category))
    categoryFilters.appendChild(button)
  })

  // Function to fetch AI tools data
  async function fetchAITools() {
    try {
      const response = await fetch("aistorage/ai_tools_1.json")
      aiTools = await response.json()
      aiTools = aiTools.reverse() // Added line to reverse the array
      filterTools("All")
    } catch (error) {
      console.error("Error fetching AI tools data:", error)
    }
  }

  // Function to create AI tool cards
  function createToolCard(tool) {
    const card = document.createElement("div")
    card.className = "ai-tool-card"
    card.innerHTML = `
      <img src="${tool.image}" alt="${tool.name}">
      <div class="ai-tool-card-content">
        <h3>${tool.name}</h3>
        <p>${tool.description.substring(0, 100)}...</p>
        <div class="tags">
          <span class="tag">${tool.category}</span>
        </div>
      </div>
    `
    card.addEventListener("click", () => {
      window.location.href = `tool-details.html?id=${tool.id}`
    })
    return card
  }

  // Function to display tools for the current page
  function displayTools() {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const toolsToDisplay = filteredTools.slice(startIndex, endIndex)

    aiToolListings.innerHTML = ""
    toolsToDisplay.forEach((tool) => {
      aiToolListings.appendChild(createToolCard(tool))
    })

    updatePaginationControls()
  }

  // New function to handle scrolling to cards
  function scrollToCards() {
    const aiToolListingsSection = document.querySelector(".ai-tool-listings")
    const headerHeight = document.querySelector("header").offsetHeight
    const yOffset = -headerHeight - 20 // Additional 20px for visual breathing room
    const y = aiToolListingsSection.getBoundingClientRect().top + window.pageYOffset + yOffset

    window.scrollTo({ top: y, behavior: "smooth" })
  }

  // Function to update pagination controls
  function updatePaginationControls() {
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage)
    const paginationContainer = document.querySelector(".pagination-controls")
    paginationContainer.innerHTML = ""

    const createPageButton = (page, text = page) => {
      const button = document.createElement("button")
      button.textContent = text
      button.classList.toggle("active", page === currentPage)
      button.addEventListener("click", () => {
        currentPage = page
        displayTools()
        scrollToCards()
      })
      return button
    }

    // Previous button
    const prevButton = createPageButton(currentPage - 1, "Previous")
    prevButton.disabled = currentPage === 1
    paginationContainer.appendChild(prevButton)

    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1))
      if (startPage > 2) {
        const ellipsis = document.createElement("span")
        ellipsis.textContent = "..."
        ellipsis.className = "pagination-ellipsis"
        paginationContainer.appendChild(ellipsis)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationContainer.appendChild(createPageButton(i))
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement("span")
        ellipsis.textContent = "..."
        ellipsis.className = "pagination-ellipsis"
        paginationContainer.appendChild(ellipsis)
      }
      paginationContainer.appendChild(createPageButton(totalPages))
    }

    // Next button
    const nextButton = createPageButton(currentPage + 1, "Next")
    nextButton.disabled = currentPage === totalPages
    paginationContainer.appendChild(nextButton)
  }

  // Function to filter tools by category
  function filterTools(category) {
    // filteredTools = category === "All" ? aiTools : aiTools.filter((tool) => tool.category === category)
    filteredTools = category === "All" ? [...aiTools] : aiTools.filter((tool) => tool.category === category) //reversed
    currentPage = 1
    displayTools()
    // scrollToCards()

    // Update active state of category buttons
    document.querySelectorAll(".category-filters button").forEach((button) => {
      button.classList.toggle("active", button.textContent === category)
    })
  }

  // Search functionality
  const searchBar = document.querySelector(".search-bar input")
  const searchButton = document.querySelector(".search-bar button")

  function searchTools() {
    const searchTerm = searchBar.value.toLowerCase()
    filteredTools = aiTools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm),
    )
    currentPage = 1
    displayTools()
    // scrollToCards()
  }

  searchButton.addEventListener("click", searchTools)
  searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchTools()
    }
  })

  // Email subscription functionality
  const emailForms = document.querySelectorAll("form")
  emailForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = e.target.querySelector('input[type="email"]').value
      alert(`Thank you for subscribing with email: ${email}`)
      e.target.reset()
    })
  })

  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
  
  // Fetch AI tools data when the page loads
  fetchAITools()
})

