document.addEventListener('DOMContentLoaded', function () {
  const requestList = document.getElementById('requests')
  const refreshButton = document.getElementById('refresh-requests')
  const toggleBlock = document.getElementById('toggle-block')

  function renderRequests() {
    chrome.storage.local.get({ requests: [] }, function (data) {
      const requests = data.requests
      requestList.innerHTML = '' // Clear the existing list
      requests.forEach((request) => {
        const listItem = document.createElement('li')
        listItem.textContent = `URL: ${request.url}, Method: ${request.method}, Status: ${request.statusCode}`
        requestList.appendChild(listItem)
      })
    })
  }

  // Initial render
  renderRequests()

  chrome.storage.local.get({ blockReels: true }, function (data) {
    toggleBlock.checked = data.blockReels
  })

  // Refresh button event listener
  refreshButton.addEventListener('click', renderRequests)

  // Toggle block event listener
  toggleBlock.addEventListener('change', (event) => {
    chrome.storage.local.set({ blockReels: event.target.checked })
  })
})
