import holy_family from '../assets/holy-family.jpg';
import person2 from '../assets/person2.jpeg';
import person3 from '../assets/person3.jpeg';
import person4 from '../assets/person4.webp';
import marpapa from '../assets/marpapa.jpg';

export const images = { holy_family, person2, person4, person3, marpapa };

export const headerItems = [
  { name: "Home", path: "/" },
  { name: "History", path: "history" },
  { name: "Groups", path: "groups" },
  { name: "Events", path: "events" },
  { name: "Contact", path: "contact" },
  { name: "Birthdays", path: "birthday" }
];

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
    name: "familyId",
    label: "Family Name",
    type: "dropdown",
    componentType: "select",
    options: [
    ]
  },
  {
    name: "groupId",
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
    placeholder: "Upload Image"

  }, {
    name: "familyName",
    label: "Family Name",
    type: "text",
    componentType: "input",
    placeholder: "Family Name"
  },
  {
    name: "contactNo",
    label: "Phone Number",
    type: "text",
    componentType: "input",
    placeholder: "Phone"
  },
  {
    name: "groupId",
    label: "Group Name",
    type: "dropdown",
    componentType: "select",
    options: [
    ]
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
]