console.log("Lead SaaS extension active");
async function sendLead(lead) {
  try {
    await fetch(https://lead-saas.onrender.com/lead {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });

    console.log("Sent to SaaS:", lead.url);
  } catch (err) {
    console.error("Failed to send lead:", err);
  }
}

function extractLead() {
  const text = document.body.innerText;

  const emails = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  ) || [];

  const phones = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  ) || [];

  const lead = {
    title: document.title,
    url: window.location.href,
    emails: [...new Set(emails)],
    phones: [...new Set(phones)],
    time: new Date().toISOString()
  };

  if (lead.emails.length || lead.phones.length) {
    sendLead(lead);
  }
}

setTimeout(extractLead, 2000);
