document.addEventListener("DOMContentLoaded", () => {
  fetch("get_analytics.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log("Received data:", data)
      if (Object.keys(data).length === 0) {
        throw new Error("No data received from the server")
      }
      document.getElementById("totalVisits").textContent = data.totalVisits
      document.getElementById("uniqueVisitors").textContent = data.uniqueVisitors

      const visitsPerDayCtx = document.getElementById("visitsPerDayChart").getContext("2d")
      new window.Chart(visitsPerDayCtx, {
        type: "line",
        data: {
          labels: Object.keys(data.visitsPerDay),
          datasets: [
            {
              label: "Visits per Day",
              data: Object.values(data.visitsPerDay),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })

      const visitsPerPageCtx = document.getElementById("visitsPerPageChart").getContext("2d")
      new window.Chart(visitsPerPageCtx, {
        type: "bar",
        data: {
          labels: Object.keys(data.visitsPerPage),
          datasets: [
            {
              label: "Visits per Page",
              data: Object.values(data.visitsPerPage),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    })
    .catch((error) => {
      console.error("Error fetching analytics:", error)
      document.getElementById("totalVisits").textContent = "Error loading data"
      document.getElementById("uniqueVisitors").textContent = "Error loading data"
    })
})

