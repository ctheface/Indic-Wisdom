// 20 initial verses bundled for instant load
// These will display immediately while the rest loads from API
const initialVerses = [
  {
    id: "23b92c99-f339-4796-8515-42dcf2abb743",
    sanskrit: "अहं सर्वस्य प्रभवो मत्तः सर्वं प्रवर्तते।",
    translation: "I am the source of all spiritual and material worlds; everything emanates from Me.",
    explanation: "The divine is the origin of all creation.",
    source: "Bhagavad Gita 10.8"
  },
  {
    id: "68d2607d-94d8-48cd-877f-63ad9ce482cf",
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥ १२-१३ ॥",
    translation: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant...",
    explanation: "Qualities of a true devotee: compassion and egolessness.",
    source: "Bhagavad Gita 12.13"
  },
  {
    id: "613a7737-84e6-4e3e-a740-d7dfb8b82ba4",
    sanskrit: "सर्वधर्मान् परित्यज्य मामेकं शरणं व्रज।",
    translation: "Abandon all varieties of dharma and simply surrender unto Me alone.",
    explanation: "Complete surrender to the divine is the ultimate path to liberation.",
    source: "Bhagavad Gita 18.66"
  },
  {
    id: "e76ad8fa-0b63-480b-a544-fd690d47966f",
    sanskrit: "न त्वेवाहं जातु नासं न त्वं नेमे जनाधिपाः। न चैव न भविष्यामः सर्वे वयमतः परम्।",
    translation: "Never was there a time when I did not exist, nor you, nor all these kings; nor in the future shall any of us cease to be.",
    explanation: "The eternal nature of the soul",
    source: "Bhagavad Gita 2.12"
  },
  {
    id: "e09017c9-0a59-45bc-86f1-2981fd1df1e7",
    sanskrit: "वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही।",
    translation: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones.",
    explanation: "The soul changes bodies like clothes",
    source: "Bhagavad Gita 2.22"
  },
  {
    id: "44c6b985-41ac-4061-a44c-e36da10813d2",
    sanskrit: "नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। न चैनं क्लेदयन्त्यापो न शोषयति मारुतः।",
    translation: "The soul can never be cut to pieces by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind.",
    explanation: "The soul is indestructible by material elements",
    source: "Bhagavad Gita 2.23"
  },
  {
    id: "a5b5fd5d-4dce-47a0-9aeb-0d77238abe89",
    sanskrit: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे।",
    translation: "The soul is never born nor dies. Nor does it exist after coming into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
    explanation: "The eternal and unchanging nature of the soul",
    source: "Bhagavad Gita 2.20"
  },
  {
    id: "18ec06d9-3efd-46bc-8da7-44fc619bfaed",
    sanskrit: "सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः ।\nमय्यार्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥ १२-१४ ॥",
    translation: "One who is always satisfied, self-controlled, and engaged in devotional service with determination, his mind and intelligence fixed on Me—such a devotee of Mine is very dear to Me.",
    explanation: "Satisfaction and fixed determination in devotion.",
    source: "Bhagavad Gita 12.14"
  },
  {
    id: "71b2a1d5-e392-4541-b05e-9b570af920fa",
    sanskrit: "श्रेयो हि ज्ञानमभ्यासाज्ज्ञानाद्ध्यानं विशिष्यते ।\nध्यानात्कर्मफलत्यागस्त्यागाच्छान्तिरनन्तरम् ॥ १२-१२ ॥",
    translation: "If you cannot take to this practice, then engage yourself in the cultivation of knowledge. Better than knowledge, however, is meditation, and better than meditation is renunciation of the fruits of action, for by such renunciation one can attain peace of mind.",
    explanation: "The hierarchy of spiritual practices.",
    source: "Bhagavad Gita 12.12"
  },
  {
    id: "d49b0d2d-3231-421d-98af-0813c19ef6fd",
    sanskrit: "यो न हृष्यति न द्वेष्टि न शोचति न काङ्क्षति ।\nशुभाशुभपरित्यागी भक्तिमान्यः स मे प्रियः ॥ १२-१७ ॥",
    translation: "One who neither rejoices nor grieves, who neither laments nor desires, and who renounces both auspicious and inauspicious things—such a devotee is very dear to Me.",
    explanation: "Equanimity towards dualities of like and dislike.",
    source: "Bhagavad Gita 12.17"
  },
  {
    id: "0e0078d2-c7d6-4564-85ad-a79aead877da",
    sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।",
    translation: "There are three gates leading to this hell: lust, anger, and greed. Every sane man should give these up, for they lead to the degradation of the soul.",
    explanation: "Lust, anger, and greed are detrimental to spiritual progress and should be avoided.",
    source: "Bhagavad Gita 16.21"
  },
  {
    id: "f274f267-6997-4960-a85f-59964b4f935c",
    sanskrit: "तस्माच्छास्त्रं प्रमाणं ते कार्याकार्यव्यवस्थितौ।",
    translation: "Therefore, let the scriptures be your authority in determining what should be done and what should not be done.",
    explanation: "The scriptures provide guidance on righteous conduct and moral duties.",
    source: "Bhagavad Gita 16.24"
  },
  {
    id: "273c0665-8402-4331-ba69-e05a9a26760d",
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत।",
    translation: "O son of Kunti, the contact between the senses and the sense objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent, and come and go like the winter and summer seasons. O descendent of Bharata, one must learn to tolerate them without being disturbed.",
    explanation: "Endurance through life's dualities",
    source: "Bhagavad Gita 2.14"
  },
  {
    id: "97e0fec0-dd05-4c8e-9dff-ac093cc32742",
    sanskrit: "यं हि न व्यथयन्त्येते पुरुषं पुरुषर्षभ। समदुःखसुखं धीरं सोऽमृतत्वाय कल्पते।",
    translation: "O best among men, the person who is not disturbed by happiness and distress, and remains steady in both, becomes eligible for liberation.",
    explanation: "Steadiness leads to liberation",
    source: "Bhagavad Gita 2.15"
  },
  {
    id: "579bf640-665f-43c2-940c-c0ae61789252",
    sanskrit: "अविनाशि तु तद्विद्धि येन सर्वमिदं ततम्। विनाशमव्ययस्यास्य न कश्चित्कर्तुमर्हति।",
    translation: "Know that which pervades the entire body is indestructible. No one is able to destroy the imperishable soul.",
    explanation: "The indestructible nature of the soul",
    source: "Bhagavad Gita 2.17"
  },
  {
    id: "2ff85dc5-d4af-46c3-be85-e705419a4c64",
    sanskrit: "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः ।\nहर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥ १२-१५ ॥",
    translation: "He by whom no one is put into difficulty and who is not disturbed by anyone, who is equipoised in happiness and distress, fear and anxiety, is very dear to Me.",
    explanation: "Freedom from emotional turbulence and causing no grief to others.",
    source: "Bhagavad Gita 12.15"
  },
  {
    id: "a02eb857-c58e-457f-b68c-a995d414f2ef",
    sanskrit: "तुल्यनिन्दास्तुतिर्मौनी सन्तुष्टो येन केनचित् ।\nअनिकेतः स्थिरमतिर्भक्तिमान्मे प्रियो नरः ॥ १२-१९ ॥",
    translation: "One who is equal in praise and reproach, who speaks little, who is satisfied with whatever comes, who is not attached to his home, who is fixed in knowledge, and who is engaged in devotional service—such a person is very dear to Me.",
    explanation: "Satisfaction in all circumstances and steadiness of mind.",
    source: "Bhagavad Gita 12.19"
  },
  {
    id: "d0e1afa1-1c6f-43bd-b5ea-d9dd43c4836d",
    sanskrit: "जातस्य हि ध्रुवो मृत्युर्ध्रुवं जन्म मृतस्य च। तस्मादपरिहार्येऽर्थे न त्वं शोचितुमर्हसि।",
    translation: "For one who has taken his birth, death is certain; and for one who is dead, birth is certain. Therefore, in the unavoidable discharge of your duty, you should not lament.",
    explanation: "Death and birth are natural cycles",
    source: "Bhagavad Gita 2.27"
  },
  {
    id: "c386e863-c4f8-4ea0-a25f-dcdee6d59e42",
    sanskrit: "स्वधर्ममपि चावेक्ष्य न विकम्पितुमर्हसि। धर्म्याद्धि युद्धाच्छ्रेयोऽन्यत्क्षत्रियस्य न विद्यते।",
    translation: "Considering your specific duty as a kshatriya, you should know that there is no better engagement for you than fighting on religious principles; and so there is no need for hesitation.",
    explanation: "Duty must be performed according to one's nature",
    source: "Bhagavad Gita 2.31"
  },
  {
    id: "10dd5f2b-446f-4f69-af9b-b1b7e99c577d",
    sanskrit: "अनपेक्षः शुचिर्दक्ष उदासीनो गतव्यथः ।\nसर्वारम्भपरित्यागी यो मद्भक्तः स मे प्रियः ॥ १२-१६ ॥",
    translation: "My devotee who is not dependent on the ordinary course of activities, who is pure, expert, without cares, free from all pains, and not striving for some result, is very dear to Me.",
    explanation: "Purity, expertise, and detachment in action.",
    source: "Bhagavad Gita 12.16"
  }
];

export default initialVerses;
