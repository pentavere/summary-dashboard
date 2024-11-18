import SummaryDashboard from '@/components/summary-dashboard'

const sections = [
  {
    name: 'Problems',
    key: 'problems',
    items: [
      { 
        value: "Type 2 Diabetes", 
        references: [
          { doc_id: 0 },
          { doc_id: 1 },
          { doc_id: 1 }
        ]
      },
      { 
        value: "Hypertension", 
        references: [
          { doc_id: 0 },
          { doc_id: 1 },
          { doc_id: 2 }
        ]
      },
      { 
        value: "Obesity", 
        references: [
          { doc_id: 1 },
          { doc_id: 4 },
          { doc_id: 4 }
        ]
      },
      { 
        value: "Chronic Kidney Disease", 
        references: [
          { doc_id: 2 },
          { doc_id: 4 },
          { doc_id: 5 }
        ]
      }
    ]
  },
  {
    name: 'Medications',
    key: 'medications',
    items: [
      { 
        value: "Metformin 1000mg", 
        references: [
          { doc_id: 0 },
          { doc_id: 1 },
          { doc_id: 3 }
        ]
      },
      { 
        value: "Lisinopril 10mg", 
        references: [
          { doc_id: 0 },
          { doc_id: 2 },
          { doc_id: 4 }
        ]
      },
      { 
        value: "Atorvastatin 40mg", 
        references: [
          { doc_id: 1 },
          { doc_id: 3 },
          { doc_id: 5 }
        ]
      }
    ]
  },
  {
    name: 'Allergies',
    key: 'allergies',
    items: [
      { 
        value: "Penicillin", 
        references: [
          { doc_id: 0 },
          { doc_id: 2 },
          { doc_id: 4 }
        ]
      },
      { 
        value: "Sulfa Drugs", 
        references: [
          { doc_id: 1 },
          { doc_id: 3 },
          { doc_id: 5 }
        ]
      }
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
  },
  {
    id: 1,
    title: "Endocrinology Consultation",
    category: "Consultation Note",
    author: "Dr. Michael Rodriguez",
    date: "2024-03-05 09:15",
    performer: "Dr. Michael Rodriguez",
  },
  {
    id: 2,
    title: "Nephrology Follow-up",
    category: "Progress Note",
    author: "Dr. Sarah Johnson",
    date: "2024-02-28 11:00",
    performer: "Dr. Sarah Johnson",
  },
  {
    id: 3,
    title: "Primary Care Annual Physical",
    category: "Physical Exam",
    author: "Dr. Emily Chen",
    date: "2024-02-15 10:45",
    performer: "Dr. Emily Chen",
  },
  {
    id: 4,
    title: "Cardiology Consultation",
    category: "Consultation Note",
    author: "Dr. James Wilson",
    date: "2024-02-01 13:20",
    performer: "Dr. James Wilson",
  },
  {
    id: 5,
    title: "Nephrology Initial Consultation",
    category: "Consultation Note",
    author: "Dr. Sarah Johnson",
    date: "2024-01-20 15:45",
    performer: "Dr. Sarah Johnson",
  }
];
export default function Home() {
  return (
    <main>
      <SummaryDashboard documents={documents} sections={sections}  />
    </main>
  )
}