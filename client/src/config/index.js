import holy_family from '../assets/holy-family.jpg';
import person2 from '../assets/person2.jpeg';
import person3 from '../assets/person3.jpeg';
import person4 from '../assets/person4.webp';
import marpapa from '../assets/marpapa.jpg';
import familyImage from '../assets/family.png'
import { useSelector } from "react-redux";

export const images = { holy_family, person2, person4, person3, marpapa, familyImage };

export const getHeaderItems = () => {
  const items = [
    {
      title: "Home",
      path: "home",
      offset: -100,
    },
    {
      title: "About",
      path: "about",
      offset: -100,
    },
    {
      title: "Birthdays",
      path: "birthdays",
      offset: -100,
    },
    {
      title: "Contact",
      path: "contact",
      offset: -100,
    }
  ];

  return items;
};

export const footerLinks = {
  quickLinks: [
    { title: "Home", path: "/church/home" },
    { title: "About", path: "/church/about" },
    { title: "Contact", path: "/church/contact" },
  ],
  ministries: [
    { title: "Youth Ministry", path: "/ministries/youth" },
    { title: "Music Ministry", path: "/ministries/music" },
    { title: "Outreach", path: "/ministries/outreach" },
    { title: "Volunteer", path: "/ministries/volunteer" },
  ],
  contact: {
    address: "123 Church Street, City, State 12345",
    phone: "(555) 123-4567",
    email: "info@holyfamilychurch.org",
  },
};

export const massTimes = {
  sunday: ["8:00 AM", "10:00 AM", "12:00 PM"],
  saturday: ["5:00 PM"],
  weekdays: ["8:00 AM"],
};

export const socialLinks = {
  facebook: "https://facebook.com/holyfamilychurch",
  twitter: "https://twitter.com/holyfamilychurch",
  instagram: "https://instagram.com/holyfamilychurch",
  youtube: "https://youtube.com/holyfamilychurch",
};

export const leaders = [
  {
    name: "Pope Francis",
    image: marpapa,
    role: "Head of the Catholic Church"
  }
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    componentType: "input",
    type: "email",
    placeholder: "Email address"
  },
  {
    name: "password",
    label: "Password",
    componentType: "input",
    type: "password",
    placeholder: "Password"
  }
];

export const addMemberFormControls = [
  {
    name: "imageUrl",
    label: "Image",
    type: "file",
    componentType: "input",
    placeholder: "Upload Image"
  },
  {
    name: "role",
    label: "Role",
    type: "dropdown",
    componentType: "select",
    options: [
      { id: "member", label: "Member" },
      { id: "vicar", label: "Vicar" },
      { id: "sister", label: "Sister" },
      { id: "mother", label: "Mother" },
      { id: "teacher", label: "Teacher" },
      { id: "coordinator", label: "Coordinator" },
      { id: "group-leader", label: "Group Leader" },
      { id: "group-secretary", label: "Group Secretary" }
    ]
  },
  {
    name: "name",
    label: "Name",
    componentType: "input",
    type: "text",
    placeholder: "Name"
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    componentType: "date"
  },
  {
    name: "sex",
    label: "Gender",
    type: "dropdown",
    componentType: "select",
    options: [
      { id: "male", label: "Male" },
      { id: "female", label: "Female" }
    ]
  },
  {
    name: "baptismName",
    label: "Baptism Name",
    componentType: "input",
    type: "text",
    placeholder: "Baptism Name"
  },
  {
    name: "married",
    label: "Married",
    type: "dropdown",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" }
    ]
  },
  {
    name: "marriageDate",
    label: "Marriage Date",
    type: "date",
    componentType: "date"
  },
  {
    name: "isActive",
    label: "Active",
    type: "dropdown",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" }
    ]
  },
  {
    name: "dateOfDeath",
    label: "Date of Death",
    type: "date",
    componentType: "date"
  },
  {
    name: "family",
    label: "Family Name",
    type: "dropdown",
    componentType: "select",
    options: [
    ]
  },
  {
    name: "group",
    label: "Group Name",
    type: "dropdown",
    componentType: "select",
    options: [
    ]
  }
];

export const addFamilyFormControls = [
  {
    name: "imageUrl",
    label: "Family Image",
    type: "file",
    componentType: "input",
    placeholder: "Upload Family Image"
  },
  {
    name: "familyName",
    label: "Family Name",
    type: "text",
    componentType: "input",
    placeholder: "Enter Family Name"
  },
  {
    name: "headOfFamily",
    label: "Family Head",
    type: "text",
    componentType: "input",
    placeholder: "Enter Family Head's Name"
  },
  {
    name: "contactNo",
    label: "Phone Number",
    type: "tel",
    componentType: "input",
    placeholder: "Enter Phone Number"
  },
  {
    name: "group",
    label: "Group Name",
    type: "dropdown",
    componentType: "select",
    options: [
    ]
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    componentType: "input",
    placeholder: "Location"
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    componentType: "textarea",
    placeholder: "Enter Full Address"
  },
];

export const addGroupFormControls = [
  {
    name: "imageUrl",
    label: "Group Image",
    type: "file",
    componentType: "input",
    placeholder: "Upload Image"

  },
  {
    name: "groupName",
    label: "Group Name",
    type: "text",
    componentType: "input",
    placeholder: "Group Name",
  },
  {
    name: "leaderName",
    label: "Leader Name",
    type: "text",
    componentType: "input",
    placeholder: "Leader Name"
  },
  {
    name: "secretaryName",
    label: "Secretary Name",
    type: "text",
    componentType: "input",
    placeholder: "Secretary Name"
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    componentType: "input",
    placeholder: "Location"
  },
]

