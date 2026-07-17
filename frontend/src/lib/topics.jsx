import {
  ClipboardList,
  Home as HomeIcon,
  Wifi,
  IdCard,
  Wallet,
  PartyPopper,
  BookOpen,
  Phone,
  Map,
} from "lucide-react";

export const TOPICS = [
  {
    id: "registration",
    label: "Course Registration",
    question: "How do I register for courses?",
    icon: ClipboardList,
  },
  {
    id: "hostel",
    label: "Hostel",
    question: "How do I apply for hostel accommodation?",
    icon: HomeIcon,
  },
  {
    id: "wifi",
    label: "Wi-Fi & IT",
    question: "How do I connect to campus Wi-Fi?",
    icon: Wifi,
  },
  {
    id: "student-id",
    label: "Student ID",
    question: "How do I get my student ID card?",
    icon: IdCard,
  },
  {
    id: "fees",
    label: "Fees",
    question: "How do I pay my tuition fees?",
    icon: Wallet,
  },
  {
    id: "orientation",
    label: "Orientation",
    question: "When is orientation week?",
    icon: PartyPopper,
  },
  {
    id: "library",
    label: "Library",
    question: "How do I access the library?",
    icon: BookOpen,
  },
  {
    id: "contacts",
    label: "Support & Contacts",
    question: "Who do I contact if I have a problem?",
    icon: Phone,
  },
  {
    id: "campus-map",
    label: "Campus Map",
    question: "Where are the main buildings on campus?",
    icon: Map,
  },
];
