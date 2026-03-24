// export interface Contact {
//   id: number;
//   name: string;
//   mobileNumber: string;
//   message: string;
//   email: string;
// }
export interface Contact {
  name: string;
  mobileNumber: string;
  email: string;
  message: string;
  // ✅ Add social media lead fields
  Name?: string;
  PhoneNumber?: string;
  Email?: string;
  City?: string;
  Company?: string;
  State?: string;
  Platform?: string;
}

export interface Template {
  name: string;
  language: string;
  status: string;
  components: any[];
}

export interface CampaignLog {
  id: number;
  campaign_name: string;
  mobile_number: string;
  template_name: string;
  parameters_sent: string;
  status: string;
  whatsapp_message_id: string;
  error_message: string;
  sent_at: string;
}