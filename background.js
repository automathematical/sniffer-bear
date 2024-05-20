chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ blockReels: true }, function (data) {
    if (data.blockReels) {
      addBlockingRule()
    }
  })

  chrome.webRequest.onCompleted.addListener(
    function (details) {
      if (details.url.includes('instagram.com')) {
        chrome.storage.local.get({ requests: [] }, function (data) {
          let requests = data.requests || []
          requests.push(details)
          chrome.storage.local.set({ requests: requests })
        })
      }
    },
    { urls: ['*://*.instagram.com/*'] }
  )
})

function addBlockingRule() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: 'https://www.instagram.com/reels/*' },
      },
    ],
  })
}

function removeBlockingRule() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
  })
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockReels) {
    if (changes.blockReels.newValue) {
      addBlockingRule()
    } else {
      removeBlockingRule()
    }
  }
})
