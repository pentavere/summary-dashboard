import SummaryDashboard from '@/components/summary-dashboard'

const sections = [
  {
    name: 'Problems',
    key: 'problems',
    items: [
      { value: "Type 2 Diabetes", doc_ids: [0, 1, 3] },
      { value: "Hypertension", doc_ids: [0, 1, 2] },
      { value: "Obesity", doc_ids: [1, 3, 4] },
      { value: "Chronic Kidney Disease", doc_ids: [2, 4, 5] }
    ]
  },
  {
    name: 'Medications',
    key: 'medications',
    items: [
      { value: "Metformin 1000mg", doc_ids: [0, 1, 3] },
      { value: "Lisinopril 10mg", doc_ids: [0, 2, 4] },
      { value: "Atorvastatin 40mg", doc_ids: [1, 3, 5] }
    ]
  },
  {
    name: 'Allergies',
    key: 'allergies',
    items: [
      { value: "Penicillin", doc_ids: [0, 2, 4] },
      { value: "Sulfa Drugs", doc_ids: [1, 3, 5] }
    ]
  }
];

const documents = [
  {
    id: 0,
    title: "Primary Care Follow-up Note",
    category: "Progress Note",
    author: "Dr. Emily Chen",
    date: "2024-03-10 14:30",
    performer: "Dr. Emily Chen",
    relatedToItems: ["Type 2 Diabetes", "Hypertension", "Metformin 1000mg", "Lisinopril 10mg", "Penicillin"]
  },
  {
    id: 1,
    title: "Endocrinology Consultation",
    category: "Consultation Note",
    author: "Dr. Michael Rodriguez",
    date: "2024-03-05 09:15",
    performer: "Dr. Michael Rodriguez",
    relatedToItems: ["Type 2 Diabetes", "Obesity", "Metformin 1000mg", "Atorvastatin 40mg", "Sulfa Drugs"]
  },
  {
    id: 2,
    title: "Nephrology Follow-up",
    category: "Progress Note",
    author: "Dr. Sarah Johnson",
    date: "2024-02-28 11:00",
    performer: "Dr. Sarah Johnson",
    relatedToItems: ["Hypertension", "Chronic Kidney Disease", "Lisinopril 10mg", "Penicillin"]
  },
  {
    id: 3,
    title: "Primary Care Annual Physical",
    category: "Physical Exam",
    author: "Dr. Emily Chen",
    date: "2024-02-15 10:45",
    performer: "Dr. Emily Chen",
    relatedToItems: ["Type 2 Diabetes", "Obesity", "Metformin 1000mg", "Atorvastatin 40mg", "Sulfa Drugs"]
  },
  {
    id: 4,
    title: "Cardiology Consultation",
    category: "Consultation Note",
    author: "Dr. James Wilson",
    date: "2024-02-01 13:20",
    performer: "Dr. James Wilson",
    relatedToItems: ["Hypertension", "Obesity", "Chronic Kidney Disease", "Lisinopril 10mg", "Penicillin"]
  },
  {
    id: 5,
    title: "Nephrology Initial Consultation",
    category: "Consultation Note",
    author: "Dr. Sarah Johnson",
    date: "2024-01-20 15:45",
    performer: "Dr. Sarah Johnson",
    relatedToItems: ["Chronic Kidney Disease", "Atorvastatin 40mg", "Sulfa Drugs"]
  }
];
export default function Home() {
  return (
    <main>
      <SummaryDashboard documents={documents} sections={sections}  />
    </main>
  )
}