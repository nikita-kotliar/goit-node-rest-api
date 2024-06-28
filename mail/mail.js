import SibApiV3Sdk from "sib-api-v3-sdk";

const { MAIL_USERNAME, MAIL_PASSWORD, MAIL_SENDER } = process.env;

// Configure the Sendinblue API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "YOUR_API_V3_KEY"; // Replace with your actual API key
const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

function sendMail(email, token) {
  // Define the campaign settings
  const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
  emailCampaigns.name = "Vitrification Email Campaign";
  emailCampaigns.subject = "Vitrification email";
  emailCampaigns.sender = { name: "Sender Name", email: MAIL_SENDER };
  emailCampaigns.type = "classic";

  // Define the content to be sent
  emailCampaigns.htmlContent = `Thank you for registration, to confirm your email please go to this link <a href="http://localhost:3000/api/users/verify/${token}">Confirm registration</a>`;

  // Define recipients (replace listIds with appropriate list IDs or recipient details)
  emailCampaigns.recipients = { listIds: [2, 7] }; // Example list IDs

  // Schedule the sending (optional, if immediate, remove scheduledAt)
  emailCampaigns.scheduledAt = new Date().toISOString(); // Immediate sending

  // Make the call to create the email campaign
  apiInstance
    .createEmailCampaign(emailCampaigns)
    .then(function (data) {
      console.log("API called successfully. Returned data:", data);
    })
    .catch(function (error) {
      console.error("Error creating email campaign:", error);
    });

  // Alternatively, if you want to send the email directly without creating a campaign:
  // This sends an immediate transactional email
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.sender = { email: MAIL_SENDER };
  sendSmtpEmail.subject = "Vitrification email";
  sendSmtpEmail.htmlContent = `Thank you for registration, to confirm your email please go to this link <a href="http://localhost:3000/api/users/verify/${token}">Confirm registration</a>`;

  // Send the transactional email
  apiInstance
    .sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log(
        "Transactional email sent successfully. Returned data:",
        data
      );
    })
    .catch(function (error) {
      console.error("Error sending transactional email:", error);
    });
}

export default { sendMail };
