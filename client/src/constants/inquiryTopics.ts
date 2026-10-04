export const INQUIRY_TOPICS = [
  {
    id: 'Ask questions before booking',
    label: 'Ask questions before booking',
    desc: 'General inquiries before reserving',
    icon: 'HelpCircle',
    template: 'Hi! I am interested in your property and had a quick question before confirming my booking: ',
  },
  {
    id: 'Ask about amenities',
    label: 'Ask about amenities',
    desc: 'Wi-Fi, parking, kitchen, pool, etc.',
    icon: 'Sparkles',
    template: 'Hello! Could you please give me more details about the amenities available at the property? ',
  },
  {
    id: 'Confirm check-in/check-out details',
    label: 'Confirm check-in/check-out details',
    desc: 'Timing, key access, early/late check',
    icon: 'Clock',
    template: 'Hi! Could you confirm the exact check-in and check-out procedures? Also, is flexible timing available? ',
  },
  {
    id: 'Ask about house rules',
    label: 'Ask about house rules',
    desc: 'Pets, quiet hours, visitors, smoking',
    icon: 'ShieldCheck',
    template: 'Hello! I would like to clarify some of the house rules (such as quiet hours, visitors, and pets): ',
  },
  {
    id: 'Share special requirements',
    label: 'Share special requirements',
    desc: 'Accessibility, crib, luggage drop-off',
    icon: 'HeartHandshake',
    template: 'Hi! We have a few special requirements for our upcoming stay and wanted to check if you could accommodate: ',
  },
  {
    id: 'Discuss problems during the stay',
    label: 'Discuss problems during the stay',
    desc: 'Urgent issues, maintenance, assistance',
    icon: 'AlertCircle',
    template: 'Hello host, I am reaching out regarding an issue during our stay that needs your attention: ',
  },
] as const;

export type InquiryTopicId = typeof INQUIRY_TOPICS[number]['id'];
