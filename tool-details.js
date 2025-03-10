document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  const toolId = urlParams.get("id")

  if (toolId) {
    fetchToolDetails(toolId)
  } else {
    console.error("No tool ID provided")
  }

  async function fetchToolDetails(id) {
    try {
      const response = await fetch("aistorage/ai_tools_1.json")
      const tools = await response.json()
      const tool = tools.find((t) => t.id === Number.parseInt(id))

      if (tool) {
        displayToolDetails(tool)
      } else {
        console.error("Tool not found")
      }
    } catch (error) {
      console.error("Error fetching tool details:", error)
    }
  }

  function displayToolDetails(tool) {
    document.title = `${tool.name} - AI Tools Hub`
    document.getElementById("tool-title").textContent = tool.name
    document.getElementById("tool-image").src = tool.image
    document.getElementById("tool-image").alt = tool.name
    document.getElementById("tool-description").textContent = tool.description
    document.getElementById("tool-link").href = tool.link || "#"
  }
})

